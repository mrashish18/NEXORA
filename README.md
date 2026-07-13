# 🚀 NEXORA AI
### AI-Powered Construction Procurement & Supply Chain Intelligence Platform

NEXORA is an AI-powered Construction Procurement & Supply Chain Intelligence Platform that automates document understanding, procurement intelligence, and decision-making using Retrieval-Augmented Generation (RAG), FAISS Vector Search, and Llama 3.2 (Ollama).

Built for the **Kaya AI India Hackathon 2026**.

---

# ✨ Features

- 📄 PDF Document Upload
- 🔍 AI Document Search
- 🧠 Retrieval-Augmented Generation (RAG)
- 📚 FAISS Vector Database
- 🤖 Local LLM using Ollama (Llama 3.2)
- 📑 OCR-ready Document Processing
- 📊 Procurement Intelligence
- ⚠️ Vendor Risk Analysis
- 📦 Purchase Order & Invoice Understanding
- 💬 AI Procurement Copilot

---

# 🏗️ Tech Stack

## Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

## Backend
- Python
- Flask
- Flask-CORS

## AI & Machine Learning
- Sentence Transformers
- FAISS
- Ollama
- Llama 3.2

## Document Processing
- PyMuPDF
- Recursive Text Splitter

---

# 📂 Project Structure

```
NEXORA
│
├── backend
│   ├── routes
│   │   ├── upload.py
│   │   └── rag.py
│   │
│   ├── services
│   │   ├── pdf_reader.py
│   │   ├── embeddings.py
│   │   └── rag_engine.py
│   │
│   ├── uploads
│   ├── vectorstore
│   ├── app.py
│   └── config.py
│
├── src
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/NEXORA.git

cd NEXORA
```

---

## Install Backend

```bash
cd backend

pip install -r requirements.txt
```

---

## Install Frontend

```bash
npm install
```

---

# 🤖 Install Ollama

Download

https://ollama.com/download

Pull Llama 3.2

```bash
ollama pull llama3.2
```

Run

```bash
ollama run llama3.2
```

---

# ▶️ Run Backend

```bash
cd backend

python app.py
```

Backend

```
http://127.0.0.1:5000
```

---

# ▶️ Run Frontend

```bash
npm run dev
```

Frontend

```
http://localhost:5173
```

---

# 🔌 API Endpoints

## Health

```
GET /health
```

---

## Upload PDF

```
POST /upload
```

Form Data

```
file : document.pdf
```

---

## Index Document

```
POST /index
```

```json
{
    "filepath":"uploads/document.pdf"
}
```

---

## Ask AI

```
POST /ask
```

```json
{
    "question":"What is NEXORA?"
}
```

---

# 🔄 AI Workflow

```
Upload PDF
      │
      ▼
Extract Text
      │
      ▼
Split into Chunks
      │
      ▼
Generate Embeddings
      │
      ▼
Store in FAISS
      │
      ▼
User Question
      │
      ▼
Semantic Search
      │
      ▼
Relevant Context
      │
      ▼
Llama 3.2 (Ollama)
      │
      ▼
AI Answer
```

---

# 📸 Demo

### Upload Document

- Upload Procurement PDF
- Upload Invoice
- Upload Purchase Order

### AI Query Examples

```
What is NEXORA?

Summarize this document.

What technologies are used?

What is the future roadmap?

What features does NEXORA provide?

How does NEXORA help construction companies?
```

---

# 🚀 Future Roadmap

- ERP Integration
- SAP Integration
- BIM Support
- AI Contract Review
- Predictive Cost Analytics
- Vendor Recommendation Engine
- Multi-language OCR
- Mobile Application
- Construction Digital Twin

---

# 👨‍💻 Developer

**Ashish Kumar**

IIT Madras BS Degree Programme

Python • Flask • AI • RAG • LLM • FAISS • React

---

# 📄 License

This project is licensed under the MIT License.

---

# ⭐ If you like this project

Give this repository a ⭐ on GitHub.