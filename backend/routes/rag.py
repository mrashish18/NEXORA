from flask import Blueprint, request, jsonify

from services.rag_engine import RAGEngine


rag_bp = Blueprint("rag", __name__)

rag = RAGEngine()


# ==========================================================
# Health Check
# ==========================================================

@rag_bp.route("/health", methods=["GET"])
def health():

    return jsonify({
        "status": "running",
        "service": "NEXORA RAG Engine"
    })


# ==========================================================
# Index Document
# ==========================================================

@rag_bp.route("/index", methods=["POST"])
def index_document():

    data = request.get_json()

    if not data:

        return jsonify({
            "success": False,
            "message": "JSON body required."
        }), 400

    filepath = data.get("filepath")

    if not filepath:

        return jsonify({
            "success": False,
            "message": "filepath missing."
        }), 400

    result = rag.index_document(filepath)

    return jsonify(result)


# ==========================================================
# Ask AI
# ==========================================================

@rag_bp.route("/ask", methods=["POST"])
def ask_ai():

    data = request.get_json()

    if not data:

        return jsonify({
            "success": False,
            "message": "JSON body required."
        }), 400

    question = data.get("question")

    if not question:

        return jsonify({
            "success": False,
            "message": "Question required."
        }), 400

    answer = rag.ask(question)

    return jsonify({
        "success": True,
        "data": answer
    })