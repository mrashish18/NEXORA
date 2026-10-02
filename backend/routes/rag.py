import os
import json
import logging
from flask import Blueprint, request, jsonify, Response, stream_with_context
from config import Config
from services.rag_engine import get_rag_engine
from services.llm_provider import LLMError
from services.rate_limiter import rate_limit

logger = logging.getLogger(__name__)
rag_bp = Blueprint("rag", __name__)

MAX_QUESTION_LENGTH = 2000


# ==========================================================
# Health Check (0 cloud LLM calls)
# ==========================================================
@rag_bp.route("/health", methods=["GET"])
def health():
    try:
        rag = get_rag_engine()
    except Exception as e:
        logger.error(f"[Health Check Error] RAG uninitialized: {str(e)}")
        return jsonify({
            "status": "degraded",
            "backend": "online",
            "service": "NEXORA RAG Engine",
            "error": "Failed to initialize RAG Engine.",
            "llm": {
                "provider": Config.LLM_PROVIDER,
                "configured": bool(Config.OPENAI_API_KEY),
                "available": False,
                "message": "Uninitialized"
            },
            "knowledge_base": {
                "indexed": False,
                "chunks_count": 0
            }
        }), 200

    health_info = rag.check_health()
    is_fully_healthy = health_info["llm"]["available"]

    return jsonify({
        "status": "ok" if is_fully_healthy else "degraded",
        "backend": "online",
        "service": "NEXORA RAG Engine",
        **health_info
    }), 200


# ==========================================================
# Index Document (0 cloud LLM calls)
# ==========================================================
@rag_bp.route("/index", methods=["POST"])
@rate_limit("index")
def index_document():
    try:
        rag = get_rag_engine()
    except Exception as e:
        logger.error(f"[Index Error] RAG Engine unavailable: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Service Unavailable",
            "message": "RAG Engine temporarily unavailable."
        }), 503

    data = request.get_json(silent=True)

    if not data or not isinstance(data, dict):
        return jsonify({
            "success": False,
            "error": "Bad Request",
            "message": "JSON body required with 'filepath' field."
        }), 400

    filepath = data.get("filepath", "").strip()

    if not filepath:
        return jsonify({
            "success": False,
            "error": "Bad Request",
            "message": "Field 'filepath' is required."
        }), 400

    # Path traversal protection
    upload_folder_abs = os.path.abspath(Config.UPLOAD_FOLDER)
    base_dir_abs = os.path.abspath(Config.BASE_DIR)
    filepath_abs = os.path.abspath(filepath)

    if not (filepath_abs.startswith(upload_folder_abs) or filepath_abs.startswith(base_dir_abs)):
        logger.warning(f"[Security] Blocked path traversal attempt in /index: {filepath}")
        return jsonify({
            "success": False,
            "error": "Forbidden",
            "message": "Access denied: illegal file path."
        }), 403

    if not os.path.exists(filepath_abs):
        return jsonify({
            "success": False,
            "error": "Not Found",
            "message": "File not found on server."
        }), 404

    try:
        result = rag.index_document(filepath_abs)
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"[Index Error] Indexing failed: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Internal Server Error",
            "message": "Indexing process failed."
        }), 500


# ==========================================================
# Helper: Request Validation for /ask & /ask/stream
# ==========================================================
def validate_ask_request():
    data = request.get_json(silent=True)

    if not data or not isinstance(data, dict):
        return None, (jsonify({
            "success": False,
            "error": {
                "code": "BAD_REQUEST",
                "message": "JSON body required with 'question' field."
            }
        }), 400)

    # Prevent client override of internal configuration
    disallowed_keys = {"openai_api_key", "model", "system_prompt", "base_url", "provider"}
    injected_keys = disallowed_keys.intersection(data.keys())
    if injected_keys:
        return None, (jsonify({
            "success": False,
            "error": {
                "code": "BAD_REQUEST",
                "message": f"Unauthorized request parameters detected: {', '.join(injected_keys)}"
            }
        }), 400)

    question = data.get("question", "")

    if not isinstance(question, str) or not question.strip():
        return None, (jsonify({
            "success": False,
            "error": {
                "code": "BAD_REQUEST",
                "message": "Valid non-empty 'question' string required."
            }
        }), 400)

    trimmed_question = question.strip()
    if len(trimmed_question) > MAX_QUESTION_LENGTH:
        return None, (jsonify({
            "success": False,
            "error": {
                "code": "BAD_REQUEST",
                "message": f"Question exceeds maximum allowed length of {MAX_QUESTION_LENGTH} characters."
            }
        }), 400)

    return trimmed_question, None


# ==========================================================
# Ask AI (Synchronous - 1 cloud LLM call)
# ==========================================================
@rag_bp.route("/ask", methods=["POST"])
@rate_limit("ask")
def ask_ai():
    try:
        rag = get_rag_engine()
    except Exception as e:
        logger.error(f"[RAG Unavailable] {str(e)}")
        return jsonify({
            "success": False,
            "error": {
                "code": "RAG_UNAVAILABLE",
                "message": "RAG Engine temporarily unavailable."
            }
        }), 503

    question, error_response = validate_ask_request()
    if error_response:
        return error_response

    try:
        result = rag.ask(question)
        if not result.get("success", False):
            return jsonify(result), 400
        return jsonify(result), 200
    except LLMError as e:
        logger.warning(f"[LLM Error] Code: {e.code}, Message: {e.message}")
        status_map = {
            "LLM_CONFIG_ERROR": 503,
            "LLM_TIMEOUT": 504,
            "LLM_RATE_LIMIT": 429,
            "LLM_CONNECTION_ERROR": 503,
            "LLM_SERVER_ERROR": 502,
        }
        status_code = status_map.get(e.code, 502)
        return jsonify({
            "success": False,
            "error": {
                "code": e.code,
                "message": e.message
            }
        }), status_code
    except Exception as e:
        logger.error(f"[Unexpected /ask error] {str(e)}")
        return jsonify({
            "success": False,
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An unexpected error occurred while processing your request."
            }
        }), 500


# ==========================================================
# Ask AI (Real-time SSE Streaming - 1 streaming cloud LLM call)
# ==========================================================
@rag_bp.route("/ask/stream", methods=["POST"])
@rate_limit("stream")
def ask_ai_stream():
    try:
        rag = get_rag_engine()
    except Exception as e:
        logger.error(f"[RAG Unavailable] {str(e)}")
        return jsonify({
            "success": False,
            "error": {
                "code": "RAG_UNAVAILABLE",
                "message": "RAG Engine temporarily unavailable."
            }
        }), 503

    question, error_response = validate_ask_request()
    if error_response:
        return error_response

    def generate():
        try:
            for chunk in rag.ask_stream(question):
                yield f"data: {json.dumps(chunk)}\n\n"
        except GeneratorExit:
            # Client disconnected / clicked Stop
            logger.info(f"[SSE Stream] Client disconnected gracefully.")
            return
        except LLMError as e:
            logger.warning(f"[SSE LLM Error] {e.code}: {e.message}")
            yield f"data: {json.dumps({'type': 'error', 'error': {'code': e.code, 'message': e.message}})}\n\n"
        except Exception as e:
            logger.error(f"[SSE Unexpected Error] {str(e)}")
            yield f"data: {json.dumps({'type': 'error', 'error': {'code': 'STREAM_ERROR', 'message': 'Streaming error occurred.'}})}\n\n"

    return Response(
        stream_with_context(generate()),
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        }
    )