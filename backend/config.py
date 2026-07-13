import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    # ==============================
    # API Keys
    # ==============================

    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY", "")

    # ==============================
    # Upload Configuration
    # ==============================

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

    UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")

    VECTOR_DB_PATH = os.path.join(BASE_DIR, "vectorstore")

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    os.makedirs(VECTOR_DB_PATH, exist_ok=True)

    MAX_CONTENT_LENGTH = 30 * 1024 * 1024  # 30MB

    # ==============================
    # Allowed Files
    # ==============================

    ALLOWED_EXTENSIONS = {
        "pdf",
        "docx",
        "txt",
    }

    # ==============================
    # Embedding Model
    # ==============================

    EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

    # ==============================
    # FAISS Index
    # ==============================

    FAISS_INDEX = os.path.join(
        VECTOR_DB_PATH,
        "construction.index",
    )

    METADATA_FILE = os.path.join(
        VECTOR_DB_PATH,
        "metadata.pkl",
    )

    # ==============================
    # OCR
    # ==============================

    OCR_LANGUAGE = "eng"

    # ==============================
    # Chunk Settings
    # ==============================

    CHUNK_SIZE = 800

    CHUNK_OVERLAP = 150

    # ==============================
    # Flask
    # ==============================

    DEBUG = True