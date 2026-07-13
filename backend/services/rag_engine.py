from services.pdf_reader import PDFReader
from services.embeddings import EmbeddingService
import ollama


class RAGEngine:

    def __init__(self):
        self.reader = PDFReader()
        self.embedding = EmbeddingService()

    # -----------------------------
    # Index Document
    # -----------------------------
    def index_document(self, filepath):

        text = self.reader.extract(filepath)

        if not text:
            return {
                "success": False,
                "message": "No text extracted."
            }

        self.embedding.add_document(text)

        return {
            "success": True,
            "message": "Document indexed successfully.",
            "characters": len(text)
        }

    # -----------------------------
    # Retrieve
    # -----------------------------
    def retrieve(self, question):

        return self.embedding.search(question)

    # -----------------------------
    # Prompt
    # -----------------------------
    def build_prompt(self, question):

        chunks = self.retrieve(question)

        context = "\n\n".join(chunks)

        return f"""
You are NEXORA AI.

You are an expert in:

- Construction Procurement
- Supply Chain
- Contracts
- Purchase Orders
- Vendor Management
- BOQ
- Logistics

Answer ONLY using the supplied context.

If the answer cannot be found reply exactly:

"I couldn't find that information in the uploaded documents."

--------------------

CONTEXT

{context}

--------------------

QUESTION

{question}

--------------------

ANSWER
"""

    # -----------------------------
    # Ask AI
    # -----------------------------
    def ask(self, question):

        prompt = self.build_prompt(question)

        try:

            response = ollama.chat(
                model="llama3.2",
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )

            return {
                "answer": response["message"]["content"]
            }

        except Exception as e:

            return {
                "answer": str(e)
            }