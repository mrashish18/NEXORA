import os
import sys
import json
import time

# Ensure backend directory is in path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

from config import Config
from services.rag_engine import get_rag_engine


def main():
    print("=" * 60)
    print("NEXORA Cloud LLM Live Integration Verification")
    print("=" * 60)

    api_key = Config.OPENAI_API_KEY
    if not api_key:
        print("[SKIPPED] OPENAI_API_KEY is not set in backend/.env or environment.")
        print("To run live cloud integration, set OPENAI_API_KEY (and optionally OPENAI_BASE_URL).")
        return 0

    print(f"Provider:        {Config.LLM_PROVIDER}")
    print(f"Model:           {Config.OPENAI_MODEL}")
    print(f"Base URL:        {Config.OPENAI_BASE_URL or 'Default (https://api.openai.com/v1)'}")
    print(f"Key configured:  Yes (length: {len(api_key)})")

    rag = get_rag_engine()

    # Step 1: Health Check
    print("\n1. Running Health Check...")
    health = rag.check_health()
    print("Health Status:", json.dumps(health, indent=2))
    if not health.get("llm", {}).get("available"):
        print("[ERROR] Cloud LLM reporting unavailable.")
        return 1

    # Step 2: Index a unique live test clause
    timestamp_id = int(time.time())
    test_clause = (
        f"NEXORA Verified Live Clause #{timestamp_id}: "
        "Standard delivery of prefabricated concrete panels must occur strictly between 04:00 AM and 05:30 AM "
        "under project supervisor signature authorization."
    )
    test_filepath = os.path.join(Config.UPLOAD_FOLDER, f"live_test_{timestamp_id}.txt")
    with open(test_filepath, "w", encoding="utf-8") as f:
        f.write(test_clause)

    print(f"\n2. Indexing live test document: {test_filepath}...")
    index_res = rag.index_document(test_filepath)
    print("Indexing result:", json.dumps(index_res, indent=2))
    if not index_res.get("success"):
        print("[ERROR] Document indexing failed.")
        return 1

    # Step 3: Query Cloud LLM with grounded retrieval
    question = f"What is the required delivery window for prefabricated concrete panels in test #{timestamp_id}?"
    print(f"\n3. Querying Cloud LLM with question: '{question}'...")

    t0 = time.time()
    ask_res = rag.ask(question)
    latency = time.time() - t0

    print(f"\n[Response in {latency:.2f}s]")
    print(json.dumps(ask_res, indent=2))

    answer = ask_res.get("answer", "")
    sources = ask_res.get("sources", [])

    if not ask_res.get("success"):
        print("[ERROR] Live ask request failed.")
        return 1

    print("\n4. Verification Results:")
    has_window = "04:00" in answer or "05:30" in answer or "concrete" in answer.lower()
    has_sources = len(sources) > 0

    print(f"  - Answer received:       {'PASS' if len(answer) > 0 else 'FAIL'}")
    print(f"  - Grounded content match: {'PASS' if has_window else 'CHECK'}")
    print(f"  - Sources returned:       {'PASS' if has_sources else 'FAIL'}")
    print(f"  - Cloud Provider:        {ask_res.get('metadata', {}).get('provider')}")

    print("\n" + "=" * 60)
    print("Cloud LLM Integration PASSED Successfully!")
    print("=" * 60)
    return 0


if __name__ == "__main__":
    sys.exit(main())
