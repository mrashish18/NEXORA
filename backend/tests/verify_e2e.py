import os
import sys
import json
import urllib.request
import uuid

BASE_URL = "http://127.0.0.1:5000"

def test_health():
    print("Testing GET /health...")
    req = urllib.request.Request(f"{BASE_URL}/health")
    with urllib.request.urlopen(req) as res:
        data = json.loads(res.read().decode())
        print("Health status:", data["status"])
        print("Backend:", data["backend"])
        print("LLM Provider:", data["llm"]["provider"], "| Available:", data["llm"]["available"])
        print("Knowledge Base Chunks:", data["knowledge_base"]["chunks_count"])
        assert data["backend"] == "online"
        assert "llm" in data
        assert "knowledge_base" in data
    print("[PASS] Health check PASSED\n")

def test_upload_and_rag():
    print("Testing POST /upload with auto_index=true...")
    boundary = uuid.uuid4().hex
    unique_clause = f"Special agreement clause XZ-{uuid.uuid4().hex[:6]}: Steel beams must be delivered before 06:00 AM to avoid downtown congestion."
    filename = "test_contract_clause.txt"

    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n'
        f"Content-Type: text/plain\r\n\r\n"
        f"{unique_clause}\r\n"
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="auto_index"\r\n\r\n'
        f"true\r\n"
        f"--{boundary}--\r\n"
    ).encode("utf-8")

    req = urllib.request.Request(f"{BASE_URL}/upload", data=body)
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")

    with urllib.request.urlopen(req) as res:
        data = json.loads(res.read().decode())
        print("Upload result:", data)
        assert data["success"] is True
        assert data["indexed"] is True
    print("[PASS] Upload and FAISS indexing PASSED\n")

    print("Testing POST /ask for the newly uploaded clause...")
    ask_req = urllib.request.Request(
        f"{BASE_URL}/ask",
        data=json.dumps({"question": "At what time must steel beams be delivered according to clause XZ?"}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(ask_req) as res:
        ask_data = json.loads(res.read().decode())
        print("Answer received:", ask_data.get("answer"))
        assert ask_data["success"] is True
        assert "06:00" in ask_data.get("answer", "") or "6:00" in ask_data.get("answer", "") or "morning" in ask_data.get("answer", "").lower()
    print("[PASS] RAG retrieval from newly uploaded document PASSED\n")

if __name__ == "__main__":
    try:
        test_health()
        test_upload_and_rag()
        print("ALL END-TO-END VERIFICATIONS PASSED SUCCESSFULLY!")
    except Exception as e:
        print("E2E Verification Failed:", e)
        sys.exit(1)
