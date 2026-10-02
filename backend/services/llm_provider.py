import os
import time
from typing import Tuple, Dict, Any, Generator, Optional
import openai
from config import Config


# ==========================================================
# Typed LLM Exceptions
# ==========================================================
class LLMError(Exception):
    """Base exception for LLM provider errors."""
    def __init__(self, message: str, code: str = "LLM_ERROR", http_status: int = 500):
        super().__init__(message)
        self.message = message
        self.code = code
        self.http_status = http_status


class LLMConfigurationError(LLMError):
    def __init__(self, message: str = "Cloud AI service is not configured on the backend."):
        super().__init__(message, code="LLM_CONFIG_ERROR", http_status=503)


class LLMAuthenticationError(LLMError):
    def __init__(self, message: str = "AI service authentication failed. Please verify API key."):
        super().__init__(message, code="LLM_AUTH_ERROR", http_status=503)


class LLMRateLimitError(LLMError):
    def __init__(self, message: str = "AI service rate limit exceeded. Please try again shortly."):
        super().__init__(message, code="LLM_RATE_LIMIT", http_status=429)


class LLMTimeoutError(LLMError):
    def __init__(self, message: str = "AI service request timed out."):
        super().__init__(message, code="LLM_TIMEOUT", http_status=504)


class LLMConnectionError(LLMError):
    def __init__(self, message: str = "Unable to connect to cloud AI service."):
        super().__init__(message, code="LLM_UNAVAILABLE", http_status=503)


class LLMBadRequestError(LLMError):
    def __init__(self, message: str = "Invalid request to AI service."):
        super().__init__(message, code="LLM_BAD_REQUEST", http_status=400)


class LLMServiceError(LLMError):
    def __init__(self, message: str = "AI service returned an unexpected internal error."):
        super().__init__(message, code="LLM_SERVER_ERROR", http_status=502)


# ==========================================================
# LLM Provider Interface
# ==========================================================
class LLMProvider:
    """Base interface for cloud LLM providers."""
    def generate_answer(self, prompt: str) -> str:
        raise NotImplementedError

    def stream_answer(self, prompt: str) -> Generator[str, None, None]:
        raise NotImplementedError

    def check_health(self) -> Tuple[bool, str, Dict[str, Any]]:
        raise NotImplementedError


# ==========================================================
# Cloud OpenAI / OpenRouter Provider
# ==========================================================
class OpenAIProvider(LLMProvider):
    """
    Production Cloud LLM Provider supporting OpenAI and OpenAI-compatible
    endpoints (such as OpenRouter) with conservative retries and timeouts.
    """
    def __init__(self):
        self.api_key = Config.OPENAI_API_KEY
        self.base_url = Config.OPENAI_BASE_URL
        self.model = Config.OPENAI_MODEL
        self.timeout = Config.LLM_TIMEOUT_SECONDS
        self.max_retries = Config.LLM_MAX_RETRIES

        self.client: Optional[openai.OpenAI] = None
        self._init_client()

    def _init_client(self):
        if not self.api_key:
            self.client = None
            return

        default_headers = {
            "HTTP-Referer": "https://nexora.ai",
            "X-Title": "NEXORA Construction AI",
        }

        self.client = openai.OpenAI(
            api_key=self.api_key,
            base_url=self.base_url,
            timeout=self.timeout,
            max_retries=self.max_retries,
            default_headers=default_headers,
        )

    def _ensure_client(self) -> openai.OpenAI:
        if not self.client:
            # Re-read in case key was populated in environment after module load
            self.api_key = Config.OPENAI_API_KEY
            self._init_client()

        if not self.client or not self.api_key:
            raise LLMConfigurationError(
                "OPENAI_API_KEY is not configured on the backend server. "
                "Please configure OPENAI_API_KEY in backend/.env or your deployment environment variables."
            )
        return self.client

    def _map_openai_exception(self, err: Exception) -> LLMError:
        if isinstance(err, openai.AuthenticationError):
            return LLMAuthenticationError(
                "Cloud AI service authentication failed. Please verify the backend API key."
            )
        if isinstance(err, openai.RateLimitError):
            return LLMRateLimitError(
                "Cloud AI service rate limit reached. Please wait a moment and try again."
            )
        if isinstance(err, openai.APITimeoutError):
            return LLMTimeoutError(
                f"Cloud AI request timed out after {self.timeout}s."
            )
        if isinstance(err, openai.APIConnectionError):
            return LLMConnectionError(
                "Failed to establish connection to cloud AI provider."
            )
        if isinstance(err, openai.BadRequestError):
            return LLMBadRequestError(
                f"Invalid request sent to AI service: {getattr(err, 'message', str(err))}"
            )
        if isinstance(err, openai.InternalServerError):
            return LLMServiceError(
                "Cloud AI service returned an internal server error."
            )
        if isinstance(err, openai.OpenAIError):
            return LLMServiceError(
                f"AI provider error: {getattr(err, 'message', str(err))}"
            )
        if isinstance(err, LLMError):
            return err
        return LLMServiceError(f"Unexpected error communicating with AI provider: {str(err)}")

    def generate_answer(self, prompt: str) -> str:
        client = self._ensure_client()
        t0 = time.perf_counter()
        try:
            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are NEXORA AI, an expert Construction Procurement and Supply Chain Intelligence Copilot. "
                            "Provide accurate, professional, and grounded analysis."
                        ),
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    },
                ],
                temperature=0.2,
                max_tokens=350,
            )
            latency = time.perf_counter() - t0

            if not response.choices or not response.choices[0].message:
                raise LLMServiceError("No response content generated by cloud AI service.")

            content = response.choices[0].message.content or ""

            # Safe diagnostic token usage observability logging (no keys or documents logged)
            req_id = getattr(response, "id", "unavailable")
            usage = getattr(response, "usage", None)
            if usage:
                in_tokens = getattr(usage, "prompt_tokens", "unavailable")
                out_tokens = getattr(usage, "completion_tokens", "unavailable")
                tot_tokens = getattr(usage, "total_tokens", "unavailable")
            else:
                in_tokens = out_tokens = tot_tokens = "unavailable"

            print(
                f"[NEXORA LLM Usage] request_id={req_id} model={self.model} "
                f"input_tokens={in_tokens} output_tokens={out_tokens} total_tokens={tot_tokens} "
                f"latency={latency:.2f}s",
                flush=True,
            )
            return content.strip()
        except Exception as e:
            raise self._map_openai_exception(e)

    def stream_answer(self, prompt: str) -> Generator[str, None, None]:
        client = self._ensure_client()
        t0 = time.perf_counter()
        try:
            stream = client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are NEXORA AI, an expert Construction Procurement and Supply Chain Intelligence Copilot. "
                            "Provide accurate, professional, and grounded analysis."
                        ),
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    },
                ],
                temperature=0.2,
                max_tokens=350,
                stream=True,
                stream_options={"include_usage": True},
            )
            req_id = "unavailable"
            usage_info = None
            token_count = 0
            for chunk in stream:
                if hasattr(chunk, "id") and chunk.id:
                    req_id = chunk.id
                if hasattr(chunk, "usage") and chunk.usage:
                    usage_info = chunk.usage
                if chunk.choices and len(chunk.choices) > 0:
                    delta = chunk.choices[0].delta
                    token = delta.content or ""
                    if token:
                        token_count += 1
                        yield token
            latency = time.perf_counter() - t0

            if usage_info:
                in_tokens = getattr(usage_info, "prompt_tokens", "unavailable")
                out_tokens = getattr(usage_info, "completion_tokens", token_count)
                tot_tokens = getattr(usage_info, "total_tokens", "unavailable")
            else:
                in_tokens = "unavailable"
                out_tokens = token_count
                tot_tokens = "unavailable"

            print(
                f"[NEXORA LLM Stream Usage] request_id={req_id} model={self.model} "
                f"input_tokens={in_tokens} output_tokens={out_tokens} total_tokens={tot_tokens} "
                f"latency={latency:.2f}s",
                flush=True,
            )
        except Exception as e:
            raise self._map_openai_exception(e)

    def check_health(self) -> Tuple[bool, str, Dict[str, Any]]:
        """
        Lightweight health check that verifies configuration without making
        expensive token-generating API calls on every heartbeat.
        """
        is_configured = bool(self.api_key and self.api_key.strip())
        info = {
            "provider": "openai",
            "configured": is_configured,
            "model": self.model,
        }

        if is_configured:
            return True, f"Cloud LLM ready ({self.model} configured)", info
        else:
            return False, "OPENAI_API_KEY is not configured", info


def get_llm_provider() -> Tuple[LLMProvider, str]:
    """
    Factory function returning the configured cloud LLMProvider instance.
    Cloud LLM (OpenAI / OpenRouter) is the single production provider.
    """
    return OpenAIProvider(), "openai"
