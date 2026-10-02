from typing import Dict, Any, List, Optional, Generator
from services.pdf_reader import PDFReader
from services.embeddings import EmbeddingService
from services.llm_provider import (
    get_llm_provider,
    LLMProvider,
    LLMError,
    LLMConfigurationError,
)
from config import Config


class RAGEngine:
    def __init__(self):
        self.reader = PDFReader()
        self.embedding = EmbeddingService()
        self._provider: Optional[LLMProvider] = None
        self._provider_name: str = "openai"
        self._init_llm_provider()

    def _init_llm_provider(self):
        try:
            self._provider, self._provider_name = get_llm_provider()
        except Exception as e:
            print(f"[RAGEngine Warning] Could not initialize cloud LLM provider: {e}")
            self._provider = None
            self._provider_name = "openai"

    def check_health(self) -> Dict[str, Any]:
        """Check status of embedding store and cloud LLM provider."""
        chunks_count = len(self.embedding.documents) if self.embedding else 0
        has_index = self.embedding.index is not None if self.embedding else False

        llm_status = False
        llm_msg = "Cloud LLM uninitialized"
        llm_info = {"provider": "openai", "configured": False, "model": Config.OPENAI_MODEL}

        if self._provider is None:
            self._init_llm_provider()

        if self._provider is not None:
            try:
                llm_status, llm_msg, llm_info = self._provider.check_health()
            except Exception as e:
                llm_status = False
                llm_msg = str(e)
        else:
            llm_msg = "Cloud LLM provider not configured."

        return {
            "llm": {
                "provider": llm_info.get("provider", "openai"),
                "configured": llm_info.get("configured", False),
                "available": llm_status,
                "message": llm_msg,
                "model": llm_info.get("model", Config.OPENAI_MODEL),
            },
            "knowledge_base": {
                "indexed": has_index and chunks_count > 0,
                "chunks_count": chunks_count,
            },
        }

    # -----------------------------
    # Index Document
    # -----------------------------
    def index_document(self, filepath: str) -> Dict[str, Any]:
        text = self.reader.extract(filepath)

        if not text or not text.strip():
            return {
                "success": False,
                "message": "No text could be extracted from the document."
            }

        self.embedding.add_document(text)

        return {
            "success": True,
            "message": "Document indexed successfully into vector store.",
            "characters": len(text),
            "total_chunks": len(self.embedding.documents),
        }

    # -----------------------------
    # Retrieve
    # -----------------------------
    def retrieve(self, question: str, k: int = 2) -> List[str]:
        if not self.embedding or self.embedding.index is None:
            return []
        chunks = self.embedding.search(question, k=k)
        return chunks[:k]

    # -----------------------------
    # Grounded Prompt Construction
    # -----------------------------
    def build_prompt(self, question: str, chunks: List[str]) -> str:
        context = "\n\n---\n\n".join(chunks[:2]) if chunks else ""

        if context:
            return f"""You are NEXORA AI Copilot for Construction Procurement and Supply Chain Intelligence.

CORE INSTRUCTIONS:
1. Ground your answer strictly in the RETRIEVED CONTEXT below.
2. Prioritize supplied document context above all else. Do NOT invent, assume, or extrapolate document facts, clauses, dates, numbers, or terms.
3. If the context does not contain enough specific details to answer the question, explicitly state: "Based on the indexed project documents, sufficient information is not available to answer this question." Do NOT fabricate citations or facts.
4. Keep the answer direct, professional, and concise (2-4 clear sentences or structured bullet points).
5. Do not include conversational fluff, greetings, or repeat the prompt.

--------------------
RETRIEVED CONTEXT:
{context}
--------------------

USER QUESTION: {question}

GROUNDED ANSWER:"""
        else:
            return f"""You are NEXORA AI Copilot for Construction Procurement and Supply Chain Intelligence.

CORE INSTRUCTIONS:
1. Note: No project documents matching this query are currently indexed in the knowledge base.
2. Clearly state that no project-specific documents were found for this query in the indexed knowledge base.
3. Provide high-level, standard construction industry guidance (2-3 sentences), and advise the user to upload relevant project documents (e.g. Purchase Orders, Contracts, BOQs) for project-specific analysis.
4. Do NOT invent or pretend to cite project-specific facts or figures.

USER QUESTION: {question}

GROUNDED ANSWER:"""

    # -----------------------------
    # Ask AI (Synchronous)
    # -----------------------------
    def ask(self, question: str) -> Dict[str, Any]:
        if not question or not question.strip():
            return {
                "success": False,
                "message": "Question cannot be empty."
            }

        chunks = self.retrieve(question.strip(), k=2)
        prompt = self.build_prompt(question.strip(), chunks)

        if self._provider is None:
            self._init_llm_provider()

        if self._provider is None:
            raise LLMConfigurationError(
                "Cloud LLM provider is not configured. "
                "Ensure OPENAI_API_KEY is configured in backend environment variables."
            )

        answer_text = self._provider.generate_answer(prompt)
        return {
            "success": True,
            "answer": answer_text.strip(),
            "sources": chunks[:2] if chunks else [],
            "metadata": {
                "provider": "openai",
                "model": Config.OPENAI_MODEL,
                "chunks_retrieved": len(chunks),
            }
        }

    # -----------------------------
    # Ask AI (Streaming Generator)
    # -----------------------------
    def ask_stream(self, question: str) -> Generator[Dict[str, Any], None, None]:
        if not question or not question.strip():
            yield {
                "type": "error",
                "error": {
                    "code": "BAD_REQUEST",
                    "message": "Question cannot be empty."
                }
            }
            return

        chunks = self.retrieve(question.strip(), k=2)
        prompt = self.build_prompt(question.strip(), chunks)

        if self._provider is None:
            self._init_llm_provider()

        if self._provider is None:
            yield {
                "type": "error",
                "error": {
                    "code": "LLM_CONFIG_ERROR",
                    "message": "OPENAI_API_KEY is not configured on the backend server."
                }
            }
            return

        # Send retrieved sources first so UI can render citations immediately
        yield {
            "type": "sources",
            "sources": chunks[:2] if chunks else [],
            "metadata": {
                "provider": "openai",
                "model": Config.OPENAI_MODEL,
                "chunks_retrieved": len(chunks),
            }
        }

        try:
            for token in self._provider.stream_answer(prompt):
                yield {"type": "token", "token": token}
            yield {"type": "done"}
        except LLMError as e:
            yield {
                "type": "error",
                "error": {
                    "code": e.code,
                    "message": e.message
                }
            }
        except Exception as e:
            yield {
                "type": "error",
                "error": {
                    "code": "LLM_ERROR",
                    "message": f"Unexpected error during streaming: {str(e)}"
                }
            }


_rag_singleton: Optional[RAGEngine] = None


def get_rag_engine() -> RAGEngine:
    global _rag_singleton
    if _rag_singleton is None:
        _rag_singleton = RAGEngine()
    return _rag_singleton