# 🚀 NEXORA AI
### AI-Powered Construction Procurement & Supply Chain Intelligence Platform

NEXORA is an AI-powered Construction Procurement & Supply Chain Intelligence Platform that automates document understanding, procurement intelligence, and decision-making using Retrieval-Augmented Generation (RAG), FAISS Vector Search, and Cloud LLMs (OpenAI / OpenRouter).

Built for the **Kaya AI India Hackathon 2026**.

---

## ✨ Features

- 📄 **Document Intelligence**: Upload & extract Purchase Orders, Invoices, Contracts, and BOQs (PDF, DOCX, TXT)
- 🧠 **Retrieval-Augmented Generation (RAG)**: Grounded retrieval using FAISS vector store & Sentence Transformers
- ☁️ **Cloud LLM Architecture**: Production-ready cloud AI integration (OpenAI & OpenRouter compatible)
- ⚡ **Real-time Streaming**: Token-by-token streaming via Server-Sent Events (`/ask/stream`)
- 🛡️ **Anti-Hallucination Guardrails**: Grounded answers strictly constrained to verified document context
- 📊 **Procurement & Supply Chain Analytics**: Real-time KPI dashboards, vendor tracking, and risk analysis
- 📑 **Source Citations**: Exact context chunk citations returned with every answer
- 🔒 **Server-Side Security**: API keys are isolated on the backend—never exposed to client-side code

---

## 🏗️ Architecture & Tech Stack

```
               [ User / Browser ]
                       │
                       ▼
       [ Frontend (React + Vite + Tailwind CSS) ]
                       │
                       │ HTTPS API (VITE_API_BASE_URL)
                       ▼
             [ Flask Backend API ]
                /             \
               /               \
              ▼                 ▼
   [ FAISS Vector Store ]   [ Cloud LLM (OpenAI / OpenRouter) ]
   (Embeddings / RAG)       (Grounded Inference)
```

### Core Architecture & Token Principles
- **No Local LLM / Ollama Dependency**: Ollama is not required. Inference runs via cloud LLM (OpenAI / OpenRouter).
- **100% Local RAG Pipeline**: Document text extraction, chunking, SentenceTransformer embeddings (`all-MiniLM-L6-v2`), and FAISS vector storage run completely locally on the backend server.
- **Zero-Token Local Operations**: Health checks (`/health`), document uploads (`/upload`), document indexing (`/index`), FAISS semantic retrieval, and idle server state do **not** make cloud LLM calls.
- **Generation Requests**: Cloud LLM API requests consume provider tokens only when generation is explicitly requested via `POST /ask` or `POST /ask/stream`.
- **Backend-Only Security**: All API keys reside strictly on the backend. No secret credentials reach the client browser.
- **Production Routing**: The frontend communicates solely with the backend API via `VITE_API_BASE_URL`.

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React Icons

### Backend
- Python 3.10+
- Flask & Flask-CORS
- Gunicorn (Production WSGI)

### AI, RAG & Document Processing
- Sentence Transformers (`all-MiniLM-L6-v2`)
- FAISS Vector Database (`faiss-cpu`)
- PyMuPDF (`fitz`) & Python-docx
- Cloud LLM Client (`openai>=1.0.0` with OpenAI and OpenRouter support)

---

## 📂 Project Structure

```
NEXORA
├── backend
│   ├── routes
│   │   ├── upload.py             # Document upload & auto-indexing
│   │   └── rag.py                # Query (/ask, /ask/stream, /health)
│   ├── services
│   │   ├── pdf_reader.py         # Multi-format document text extraction
│   │   ├── embeddings.py         # SentenceTransformer + FAISS store
│   │   ├── rag_engine.py         # Grounded prompt builder & RAG singleton
│   │   └── llm_provider.py       # Cloud LLM client (OpenAI / OpenRouter)
│   ├── tests
│   │   ├── test_backend.py       # Unit test suite (16 test cases)
│   │   └── verify_live_cloud_rag.py # Live cloud integration verification
│   ├── uploads/                  # Temporary file upload storage
│   ├── vectorstore/              # FAISS index and metadata storage
│   ├── app.py                    # Flask application entry point
│   ├── config.py                 # Centralized configuration & environment
│   └── requirements.txt          # Python production dependencies
├── src/                          # React + TypeScript frontend
│   ├── components/               # UI components (ChatPreview, Sidebar, UploadZone)
│   ├── services/api.ts           # Centralized API client (streaming & sync)
│   ├── types/api.ts              # Strongly typed API contracts
│   └── hooks/                    # Custom hooks (useBackendHealth)
├── vercel.json                   # Vercel SPA routing rewrite rules
└── README.md
```

---

## ⚙️ Environment Variables

### Backend Configuration (`backend/.env`)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Backend server port | `5000` |
| `HOST` | Backend host binding | `0.0.0.0` |
| `DEBUG` | Flask debug mode | `False` |
| `FRONTEND_URL` | Allowed CORS origins (comma-separated) | `http://localhost:5173,https://nexora-virid-xi.vercel.app` |
| `LLM_PROVIDER` | Cloud LLM provider | `openai` |
| `OPENAI_API_KEY` | Secret API Key (OpenAI or OpenRouter) | `sk-...` |
| `OPENAI_BASE_URL` | Optional API base URL (for OpenRouter) | `https://openrouter.ai/api/v1` |
| `OPENAI_MODEL` | Target LLM model | `gpt-4o-mini` |
| `LLM_TIMEOUT_SECONDS` | Maximum timeout per request | `60` |
| `LLM_MAX_RETRIES` | Max retries for transient errors (429/5xx) | `2` |

> 🔒 **Security Notice**: Never put `OPENAI_API_KEY` into frontend files or version control. It is strictly kept on the Flask backend.

### Frontend Configuration (`.env`)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Backend API URL | `http://127.0.0.1:5000` (Local) / `https://your-api.com` (Prod) |

---

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/mrashish18/NEXORA.git
cd NEXORA
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env and set your OPENAI_API_KEY
python app.py
```

Backend will run on: `http://127.0.0.1:5000`

### 3. Frontend Setup

In a new terminal window:

```bash
cd ..
npm install
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## 🔌 API Endpoints

### 1. Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "ok",
  "backend": "online",
  "service": "NEXORA RAG Engine",
  "llm": {
    "provider": "openai",
    "configured": true,
    "available": true,
    "model": "gpt-4o-mini"
  },
  "knowledge_base": {
    "indexed": true,
    "chunks_count": 5
  }
}
```

### 2. Query AI Assistant (Synchronous)
```http
POST /ask
Content-Type: application/json

{
  "question": "What is NEXORA?"
}
```
**Response:**
```json
{
  "success": true,
  "answer": "NEXORA is an AI-Powered Construction Procurement Platform...",
  "sources": ["...document excerpt..."],
  "metadata": {
    "provider": "openai",
    "model": "gpt-4o-mini",
    "chunks_retrieved": 2
  }
}
```

### 3. Query AI Assistant (Streaming via SSE)
```http
POST /ask/stream
Content-Type: application/json

{
  "question": "What is NEXORA?"
}
```
Streams `data: {"type": "sources", "sources": [...]}` followed by `data: {"type": "token", "token": "..."}` and `data: {"type": "done"}`.

### 4. Upload Document
```http
POST /upload
Content-Type: multipart/form-data

file: <document.pdf | document.docx | document.txt>
auto_index: true
```

---

## 🧪 Testing & Verification

Run the comprehensive unit test suite:

```bash
python -m unittest backend/tests/test_backend.py -v
```

Run live cloud integration test (when `OPENAI_API_KEY` is configured):

```bash
python backend/tests/verify_live_cloud_rag.py
```

Run frontend build and lint check:

```bash
npm run lint
npm run build
```

---

## 🌐 Production Deployment

- **Frontend**: Deploy to **Vercel** with SPA rewrites configured in `vercel.json`. Set environment variable `VITE_API_BASE_URL` to your production backend URL.
- **Backend**: Deploy to **Render**, **Railway**, or **Google Cloud Run** using Gunicorn:
  ```bash
  gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120
  ```

---

## 👨‍💻 Developer

**Ashish Kumar**  
IIT Madras BS Degree Programme  

---

## 📄 License

This project is licensed under the MIT License.