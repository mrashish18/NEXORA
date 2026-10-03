import os
import sys

# Ensure backend root directory is in Python path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Serverless environments (like Vercel) have a read-only root filesystem.
# Configure HuggingFace, PyTorch, and Transformers caches to /tmp.
if os.getenv("VERCEL") or not os.access(backend_dir, os.W_OK):
    os.environ.setdefault("HF_HOME", "/tmp/hf_home")
    os.environ.setdefault("TRANSFORMERS_CACHE", "/tmp/hf_home")
    os.environ.setdefault("TORCH_HOME", "/tmp/torch_home")

from app import app
