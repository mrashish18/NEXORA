import os
import time
import logging
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from config import Config
from services.rag_engine import get_rag_engine
from services.rate_limiter import rate_limit

logger = logging.getLogger(__name__)
upload_bp = Blueprint("upload", __name__)

MAX_FILENAME_LENGTH = 255


def is_allowed_file(filename: str) -> bool:
    if "." not in filename:
        return False
    ext = filename.rsplit(".", 1)[1].lower()
    return ext in Config.ALLOWED_EXTENSIONS


def validate_file_content(file_stream, ext: str) -> tuple[bool, str]:
    """
    Validates file magic numbers and content headers to prevent file spoofing.
    """
    header = file_stream.read(1024)
    file_stream.seek(0)

    if len(header) == 0:
        return False, "Uploaded file is empty (0 bytes)."

    if ext == "pdf":
        if not header.startswith(b"%PDF-"):
            return False, "File content header does not match a valid PDF document."
    elif ext == "docx":
        if not header.startswith(b"PK\x03\x04"):
            return False, "File content header does not match a valid DOCX document archive."
    elif ext == "txt":
        # Block executable binary headers pretending to be .txt
        if (
            header.startswith(b"MZ")  # Windows PE
            or header.startswith(b"\x7fELF")  # Linux ELF
            or header.startswith(b"\xca\xfe\xba\xbe")  # Java / Mach-O
            or b"\x00" in header[:256]  # Null bytes indicating binary executable
        ):
            return False, "File content is not valid plain text."
        try:
            header.decode("utf-8", errors="strict")
        except UnicodeDecodeError:
            try:
                header.decode("latin-1", errors="strict")
            except Exception:
                return False, "Text document contains unsupported character encoding."

    return True, ""


@upload_bp.route("/upload", methods=["POST"])
@rate_limit("upload")
def upload():
    if "file" not in request.files:
        return jsonify({
            "success": False,
            "error": "Bad Request",
            "message": "No file uploaded. Please provide a file in the form data."
        }), 400

    uploaded_file = request.files["file"]

    if not uploaded_file or not uploaded_file.filename:
        return jsonify({
            "success": False,
            "error": "Bad Request",
            "message": "Empty file or filename missing."
        }), 400

    original_filename = uploaded_file.filename.strip()

    if len(original_filename) > MAX_FILENAME_LENGTH:
        return jsonify({
            "success": False,
            "error": "Bad Request",
            "message": f"Filename exceeds maximum allowed length of {MAX_FILENAME_LENGTH} characters."
        }), 400

    clean_filename = secure_filename(original_filename)

    if not clean_filename:
        return jsonify({
            "success": False,
            "error": "Bad Request",
            "message": "Invalid file name. Path traversal characters are strictly prohibited."
        }), 400

    if not is_allowed_file(clean_filename):
        allowed_list = ", ".join(sorted(list(Config.ALLOWED_EXTENSIONS)))
        return jsonify({
            "success": False,
            "error": "Bad Request",
            "message": f"Unsupported file extension. Allowed file types: {allowed_list}"
        }), 400

    ext = clean_filename.rsplit(".", 1)[1].lower()

    # Content inspection to prevent file spoofing
    is_valid, content_error = validate_file_content(uploaded_file.stream, ext)
    if not is_valid:
        return jsonify({
            "success": False,
            "error": "Unprocessable Entity",
            "message": content_error
        }), 422

    # Path traversal protection: ensure destination resolves strictly within UPLOAD_FOLDER
    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
    upload_folder_abs = os.path.abspath(Config.UPLOAD_FOLDER)
    destination_path = os.path.abspath(os.path.join(upload_folder_abs, clean_filename))

    if not destination_path.startswith(upload_folder_abs):
        logger.warning(f"[Security] Blocked path traversal attempt in upload: {original_filename}")
        return jsonify({
            "success": False,
            "error": "Forbidden",
            "message": "Access denied: illegal file path."
        }), 403

    # Collision & overwrite mitigation: if file exists, append timestamp
    if os.path.exists(destination_path):
        name_part, ext_part = os.path.splitext(clean_filename)
        clean_filename = f"{name_part}_{int(time.time())}{ext_part}"
        destination_path = os.path.abspath(os.path.join(upload_folder_abs, clean_filename))

    try:
        uploaded_file.save(destination_path)
        # Ensure file permissions are non-executable (rw-r--r--)
        try:
            os.chmod(destination_path, 0o644)
        except Exception:
            pass

        file_size = os.path.getsize(destination_path)
    except Exception as e:
        logger.error(f"[Upload Error] Failed to save file safely: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Internal Server Error",
            "message": "Failed to save file on server."
        }), 500

    # Auto-indexing into RAG vector store (0 cloud LLM calls)
    should_index = request.form.get("auto_index", "true").lower() in ("true", "1", "yes")

    indexing_result = None
    if should_index:
        try:
            rag = get_rag_engine()
            indexing_result = rag.index_document(destination_path)
        except Exception as e:
            logger.error(f"[Indexing Error] Failed to index document: {str(e)}")
            indexing_result = {
                "success": False,
                "message": "File uploaded but failed to index into vector store."
            }

    is_indexed = indexing_result.get("success", False) if indexing_result else False

    return jsonify({
        "success": True,
        "filename": clean_filename,
        "filepath": destination_path,
        "size_bytes": file_size,
        "indexed": is_indexed,
        "indexing_details": indexing_result,
        "message": "File uploaded and indexed successfully into NEXORA knowledge base."
        if is_indexed
        else "File uploaded successfully."
    }), 200