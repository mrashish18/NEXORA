import os
from dotenv import load_dotenv

basedir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(basedir, ".env"))
load_dotenv()


class Config:
    # ==============================
    # Cloud LLM Configuration
    # ==============================
    LLM_PROVIDER = os.getenv("LLM_PROVIDER", "openai").strip().lower()
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "").rstrip("/") or None
    OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    LLM_TIMEOUT_SECONDS = float(os.getenv("LLM_TIMEOUT_SECONDS", "60"))
    LLM_MAX_RETRIES = int(os.getenv("LLM_MAX_RETRIES", "2"))

    # ==============================
    # Rate Limiting Configuration
    # ==============================
    RATE_LIMIT_ENABLED = os.getenv("RATE_LIMIT_ENABLED", "True").lower() in ("true", "1")
    RATE_LIMIT_DEFAULT = os.getenv("RATE_LIMIT_DEFAULT", "120 per minute")
    RATE_LIMIT_ASK = os.getenv("RATE_LIMIT_ASK", "30 per minute")
    RATE_LIMIT_STREAM = os.getenv("RATE_LIMIT_STREAM", "30 per minute")
    RATE_LIMIT_UPLOAD = os.getenv("RATE_LIMIT_UPLOAD", "15 per minute")
    RATE_LIMIT_INDEX = os.getenv("RATE_LIMIT_INDEX", "20 per minute")

    # ==============================
    # CORS & Server Configuration
    # ==============================
    FRONTEND_URL = os.getenv(
        "FRONTEND_URL",
        "http://localhost:5173,http://127.0.0.1:5173,https://nexora-virid-xi.vercel.app"
    )

    @classmethod
    def get_allowed_origins(cls):
        origins = [origin.strip() for origin in cls.FRONTEND_URL.split(",") if origin.strip()]
        return origins if origins else ["http://localhost:5173", "https://nexora-virid-xi.vercel.app"]

    # ==============================
    # Upload Configuration
    # ==============================

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

    # Detect serverless runtime (e.g. Vercel) where root filesystem is read-only
    IS_SERVERLESS = bool(os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME"))

    if IS_SERVERLESS or not os.access(BASE_DIR, os.W_OK):
        UPLOAD_FOLDER = os.path.join("/tmp", "nexora_uploads")
        VECTOR_DB_PATH = os.path.join("/tmp", "nexora_vectorstore")
    else:
        UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
        VECTOR_DB_PATH = os.path.join(BASE_DIR, "vectorstore")

    SEED_VECTOR_DB_PATH = os.path.join(BASE_DIR, "vectorstore")

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

    SEED_FAISS_INDEX = os.path.join(
        SEED_VECTOR_DB_PATH,
        "construction.index",
    )

    SEED_METADATA_FILE = os.path.join(
        SEED_VECTOR_DB_PATH,
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

    DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1")