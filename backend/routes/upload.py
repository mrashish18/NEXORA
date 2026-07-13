from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os

upload_bp = Blueprint("upload", __name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@upload_bp.route("/upload", methods=["POST"])
def upload():
    
    print("========== UPLOAD REQUEST ==========")
    print(request.method)
    print(request.files)
    print(request.form)

    if "file" not in request.files:
        return jsonify({
            "success": False,
            "message": "No file uploaded."
        }), 400

    uploaded_file = request.files["file"]

    if uploaded_file is None:
        return jsonify({
            "success": False,
            "message": "No file object."
        }), 400

    filename = uploaded_file.filename or ""

    if filename == "":
        return jsonify({
            "success": False,
            "message": "Empty filename."
        }), 400

    filename = secure_filename(filename)

    filepath = os.path.join(UPLOAD_FOLDER, filename)

    uploaded_file.save(filepath)

    return jsonify({
        "success": True,
        "filename": filename,
        "filepath": filepath
    }), 200