import os
import logging
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config

from routes.upload import upload_bp
from routes.rag import rag_bp, health as rag_health

# Configure secure server-side logging (never logs API keys or full credentials)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [%(name)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("nexora")

app = Flask(__name__)
app.config.from_object(Config)

# Configure CORS with explicit allowed origins
allowed_origins = Config.get_allowed_origins()
logger.info(f"[NEXORA Backend] Configured CORS allowed origins: {allowed_origins}")

CORS(
    app,
    resources={r"/*": {"origins": allowed_origins}},
    supports_credentials=False,
    methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
)

# Register Blueprints
app.register_blueprint(upload_bp)
app.register_blueprint(rag_bp)


@app.route("/")
def home():
    return jsonify({
        "project": "NEXORA AI",
        "title": "AI-Powered Construction Supply Chain & Procurement Intelligence",
        "version": "1.0",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "ask": "/ask",
            "ask_stream": "/ask/stream",
            "upload": "/upload",
            "index": "/index",
        },
    }), 200


# Top-level health check endpoint mirroring rag_bp.health
@app.route("/health", methods=["GET"])
def health():
    return rag_health()


# ==========================================================
# Standardized JSON Production Error Handlers
# ==========================================================
@app.errorhandler(400)
def bad_request(error):
    return jsonify({
        "success": False,
        "error": "Bad Request",
        "message": getattr(error, "description", "Malformed request syntax.")
    }), 400


@app.errorhandler(401)
def unauthorized(error):
    return jsonify({
        "success": False,
        "error": "Unauthorized",
        "message": "Authentication required."
    }), 401


@app.errorhandler(403)
def forbidden(error):
    return jsonify({
        "success": False,
        "error": "Forbidden",
        "message": getattr(error, "description", "Access denied.")
    }), 403


@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "success": False,
        "error": "Not Found",
        "message": "The requested endpoint does not exist."
    }), 404


@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({
        "success": False,
        "error": "Method Not Allowed",
        "message": "The HTTP method is not supported for this endpoint."
    }), 405


@app.errorhandler(413)
def request_entity_too_large(error):
    return jsonify({
        "success": False,
        "error": "File Too Large",
        "message": f"Maximum allowed upload size is {Config.MAX_CONTENT_LENGTH // (1024 * 1024)}MB."
    }), 413


@app.errorhandler(415)
def unsupported_media_type(error):
    return jsonify({
        "success": False,
        "error": "Unsupported Media Type",
        "message": getattr(error, "description", "Unsupported payload format.")
    }), 415


@app.errorhandler(422)
def unprocessable_entity(error):
    return jsonify({
        "success": False,
        "error": "Unprocessable Entity",
        "message": getattr(error, "description", "The request content could not be processed.")
    }), 422


@app.errorhandler(429)
def ratelimit_handler(error):
    return jsonify({
        "success": False,
        "error": "Too Many Requests",
        "message": "Rate limit exceeded. Please wait before making more requests."
    }), 429


@app.errorhandler(500)
def internal_server_error(error):
    logger.error(f"[Server Error 500] {str(error)}")
    return jsonify({
        "success": False,
        "error": "Internal Server Error",
        "message": "An unexpected error occurred on the server."
    }), 500


@app.errorhandler(502)
def bad_gateway(error):
    return jsonify({
        "success": False,
        "error": "Bad Gateway",
        "message": "Upstream AI service communication failed."
    }), 502


@app.errorhandler(503)
def service_unavailable(error):
    return jsonify({
        "success": False,
        "error": "Service Unavailable",
        "message": "Service temporarily unavailable. Please retry shortly."
    }), 503


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    host = os.getenv("HOST", "0.0.0.0")
    debug = Config.DEBUG
    logger.info(f"[NEXORA Backend] Starting server on http://{host}:{port} (debug={debug})")

    # Warm up RAG Engine singleton
    try:
        from services.rag_engine import get_rag_engine
        logger.info("[NEXORA Backend] Initializing RAG Engine...")
        get_rag_engine()
        logger.info("[NEXORA Backend] RAG Engine ready.")
    except Exception as e:
        logger.warning(f"[NEXORA Backend Warning] Deferred RAG initialization: {e}")

    app.run(host=host, port=port, debug=debug)