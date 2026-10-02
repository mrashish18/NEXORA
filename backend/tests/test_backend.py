import sys
import os
import io
import unittest
from unittest.mock import patch, MagicMock

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app
from config import Config
from services.rag_engine import get_rag_engine
from services.llm_provider import (
    LLMError,
    LLMConfigurationError,
    LLMRateLimitError,
    LLMTimeoutError,
    LLMConnectionError,
    LLMServiceError,
)
import openai


class NexoraBackendTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.client = self.app.test_client()

    # 1. Root endpoint
    def test_root_endpoint(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data.get("project"), "NEXORA AI")
        self.assertEqual(data.get("status"), "running")
        self.assertIn("endpoints", data)

    # 2. Health endpoint (Cloud LLM architecture)
    def test_health_endpoint(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data.get("backend"), "online")
        self.assertIn("llm", data)
        self.assertEqual(data["llm"]["provider"], "openai")
        self.assertIn("configured", data["llm"])
        self.assertIn("model", data["llm"])
        self.assertIn("knowledge_base", data)

    # 3. Ask empty question
    def test_ask_empty_question(self):
        response = self.client.post("/ask", json={"question": ""})
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertFalse(data.get("success"))
        self.assertEqual(data.get("error", {}).get("code"), "BAD_REQUEST")

    # 4. Ask missing body
    def test_ask_missing_body(self):
        response = self.client.post("/ask", data="invalid", content_type="text/plain")
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertFalse(data.get("success"))
        self.assertEqual(data.get("error", {}).get("code"), "BAD_REQUEST")

    # 5. Cloud provider response (Mocked)
    @patch("openai.resources.chat.completions.Completions.create")
    def test_ask_valid_query_mocked(self, mock_create):
        mock_response = MagicMock()
        mock_choice = MagicMock()
        mock_choice.message.content = "NEXORA is an AI-powered construction procurement platform."
        mock_response.choices = [mock_choice]
        mock_create.return_value = mock_response

        with patch.object(Config, "OPENAI_API_KEY", "sk-mock-test-key-12345"):
            rag = get_rag_engine()
            # Force re-read of provider
            rag._init_llm_provider()

            response = self.client.post("/ask", json={"question": "What is NEXORA?"})
            self.assertEqual(response.status_code, 200)
            data = response.get_json()
            self.assertTrue(data.get("success"))
            self.assertIn("NEXORA", data.get("answer", ""))
            self.assertIn("sources", data)
            self.assertEqual(data.get("metadata", {}).get("provider"), "openai")

    # 6. Invalid API configuration
    def test_invalid_api_configuration(self):
        with patch.object(Config, "OPENAI_API_KEY", ""):
            rag = get_rag_engine()
            rag._init_llm_provider()

            response = self.client.post("/ask", json={"question": "What is NEXORA?"})
            self.assertEqual(response.status_code, 503)
            data = response.get_json()
            self.assertFalse(data.get("success"))
            self.assertEqual(data.get("error", {}).get("code"), "LLM_CONFIG_ERROR")

    # 7. LLM Timeout handling
    @patch("openai.resources.chat.completions.Completions.create")
    def test_llm_timeout_handling(self, mock_create):
        mock_request = MagicMock()
        mock_create.side_effect = openai.APITimeoutError(request=mock_request)

        with patch.object(Config, "OPENAI_API_KEY", "sk-mock-key"):
            rag = get_rag_engine()
            rag._init_llm_provider()

            response = self.client.post("/ask", json={"question": "What is NEXORA?"})
            self.assertEqual(response.status_code, 504)
            data = response.get_json()
            self.assertFalse(data.get("success"))
            self.assertEqual(data.get("error", {}).get("code"), "LLM_TIMEOUT")

    # 8. LLM Rate Limit (429) handling
    @patch("openai.resources.chat.completions.Completions.create")
    def test_llm_rate_limit_handling(self, mock_create):
        mock_response = MagicMock()
        mock_response.status_code = 429
        mock_create.side_effect = openai.RateLimitError(
            message="Rate limit exceeded",
            response=mock_response,
            body={"error": {"message": "Rate limit exceeded"}}
        )

        with patch.object(Config, "OPENAI_API_KEY", "sk-mock-key"):
            rag = get_rag_engine()
            rag._init_llm_provider()

            response = self.client.post("/ask", json={"question": "What is NEXORA?"})
            self.assertEqual(response.status_code, 429)
            data = response.get_json()
            self.assertFalse(data.get("success"))
            self.assertEqual(data.get("error", {}).get("code"), "LLM_RATE_LIMIT")

    # 9. LLM 500/502 handling
    @patch("openai.resources.chat.completions.Completions.create")
    def test_llm_server_error_handling(self, mock_create):
        mock_response = MagicMock()
        mock_response.status_code = 500
        mock_create.side_effect = openai.InternalServerError(
            message="Internal server error",
            response=mock_response,
            body={"error": {"message": "Internal error"}}
        )

        with patch.object(Config, "OPENAI_API_KEY", "sk-mock-key"):
            rag = get_rag_engine()
            rag._init_llm_provider()

            response = self.client.post("/ask", json={"question": "What is NEXORA?"})
            self.assertEqual(response.status_code, 502)
            data = response.get_json()
            self.assertFalse(data.get("success"))
            self.assertEqual(data.get("error", {}).get("code"), "LLM_SERVER_ERROR")

    # 10. Malformed LLM response
    @patch("openai.resources.chat.completions.Completions.create")
    def test_malformed_llm_response(self, mock_create):
        mock_response = MagicMock()
        mock_response.choices = []  # Empty choices
        mock_create.return_value = mock_response

        with patch.object(Config, "OPENAI_API_KEY", "sk-mock-key"):
            rag = get_rag_engine()
            rag._init_llm_provider()

            response = self.client.post("/ask", json={"question": "What is NEXORA?"})
            self.assertEqual(response.status_code, 502)
            data = response.get_json()
            self.assertFalse(data.get("success"))

    # 11. Streaming endpoint with SSE
    @patch("openai.resources.chat.completions.Completions.create")
    def test_ask_stream_mocked(self, mock_create):
        chunk1 = MagicMock()
        chunk1.choices = [MagicMock()]
        chunk1.choices[0].delta.content = "NEXORA "

        chunk2 = MagicMock()
        chunk2.choices = [MagicMock()]
        chunk2.choices[0].delta.content = "Platform."

        mock_create.return_value = iter([chunk1, chunk2])

        with patch.object(Config, "OPENAI_API_KEY", "sk-mock-key"):
            rag = get_rag_engine()
            rag._init_llm_provider()

            response = self.client.post("/ask/stream", json={"question": "What is NEXORA?"})
            self.assertEqual(response.status_code, 200)
            self.assertIn("text/event-stream", response.content_type)
            stream_text = response.get_data(as_text=True)
            self.assertIn("data: ", stream_text)
            self.assertIn('"type": "sources"', stream_text)
            self.assertIn('"type": "token"', stream_text)
            self.assertIn('"type": "done"', stream_text)

    # 12. Upload document validation
    def test_upload_missing_file(self):
        response = self.client.post("/upload")
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertFalse(data.get("success"))

    def test_upload_invalid_extension(self):
        response = self.client.post(
            "/upload",
            data={"file": (io.BytesIO(b"malicious script"), "script.exe")},
            content_type="multipart/form-data"
        )
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertFalse(data.get("success"))
        self.assertIn("Unsupported", data.get("message", ""))

    # 13. Successful RAG retrieval test
    def test_successful_rag_retrieval(self):
        rag = get_rag_engine()
        chunks = rag.retrieve("NEXORA", k=2)
        # Should return list without errors
        self.assertIsInstance(chunks, list)

    # 14. Upload + Index + Ask E2E flow
    @patch("openai.resources.chat.completions.Completions.create")
    def test_upload_index_and_ask_e2e(self, mock_create):
        mock_response = MagicMock()
        mock_choice = MagicMock()
        mock_choice.message.content = "Clause verified: Steel delivery is scheduled before 06:00 AM."
        mock_response.choices = [mock_choice]
        mock_create.return_value = mock_response

        with patch.object(Config, "OPENAI_API_KEY", "sk-mock-key"):
            rag = get_rag_engine()
            rag._init_llm_provider()

            # Upload a text document
            doc_content = b"Special contract clause: Structural steel must be delivered by 06:00 AM."
            upload_res = self.client.post(
                "/upload",
                data={
                    "file": (io.BytesIO(doc_content), "contract_test_clause.txt"),
                    "auto_index": "true",
                },
                content_type="multipart/form-data"
            )
            self.assertEqual(upload_res.status_code, 200)
            upload_data = upload_res.get_json()
            self.assertTrue(upload_data.get("success"))

            # Ask question about uploaded document
            ask_res = self.client.post(
                "/ask",
                json={"question": "What is the delivery time for structural steel?"}
            )
            self.assertEqual(ask_res.status_code, 200)
            ask_data = ask_res.get_json()
            self.assertTrue(ask_data.get("success"))
            self.assertIn("06:00 AM", ask_data.get("answer", ""))

    # 15. CORS headers verification
    def test_cors_headers(self):
        response = self.client.options(
            "/ask",
            headers={
                "Origin": "https://nexora-virid-xi.vercel.app",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type",
            }
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("Access-Control-Allow-Origin", response.headers)
        self.assertEqual(
            response.headers["Access-Control-Allow-Origin"],
            "https://nexora-virid-xi.vercel.app"
        )


if __name__ == "__main__":
    unittest.main()
