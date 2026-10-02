import json
import time
import urllib.request

BASE_URL = "http://127.0.0.1:5000"
QUESTION = "What are the delivery requirements for structural steel?"


def benchmark_sync():
    print("--- Measuring Synchronous /ask Latency ---")
    req = urllib.request.Request(
        f"{BASE_URL}/ask",
        data=json.dumps({"question": QUESTION}).encode(),
        headers={"Content-Type": "application/json"},
    )
    t0 = time.perf_counter()
    with urllib.request.urlopen(req) as resp:
        body = json.loads(resp.read().decode())
    t1 = time.perf_counter()
    total_latency = t1 - t0

    answer = body.get("answer", "")
    sources = body.get("sources", [])
    chunks_count = len(sources)
    context_size = sum(len(s) for s in sources)
    output_length = len(answer)

    print(f"Total Latency:    {total_latency:.2f}s")
    print(f"Retrieved Chunks: {chunks_count}")
    print(f"Context Size:     ~{context_size} characters")
    print(f"Output Length:    {output_length} characters")
    print(f"Answer snippet:   {answer[:80]}...")
    return {
        "sync_latency": total_latency,
        "chunks_count": chunks_count,
        "context_size": context_size,
        "output_length": output_length,
    }


def benchmark_streaming():
    print("\n--- Measuring Streaming /ask/stream Latency & TTFT ---")
    req = urllib.request.Request(
        f"{BASE_URL}/ask/stream",
        data=json.dumps({"question": QUESTION}).encode(),
        headers={"Content-Type": "application/json"},
    )

    t0 = time.perf_counter()
    ttft = None
    first_token = None
    accumulated_tokens = []
    sources = []

    with urllib.request.urlopen(req) as resp:
        for line in resp:
            line_str = line.decode().strip()
            if not line_str.startswith("data: "):
                continue
            data_str = line_str[6:].strip()
            if not data_str:
                continue
            try:
                payload = json.loads(data_str)
                p_type = payload.get("type")
                if p_type == "sources":
                    sources = payload.get("sources", [])
                elif p_type == "token":
                    if ttft is None:
                        ttft = time.perf_counter() - t0
                        first_token = payload.get("token")
                    accumulated_tokens.append(payload.get("token", ""))
                elif p_type == "done":
                    break
            except Exception:
                pass

    t1 = time.perf_counter()
    total_stream_time = t1 - t0
    full_text = "".join(accumulated_tokens)

    print(f"Streaming TTFT:        {ttft:.2f}s" if ttft else "TTFT: None")
    print(f"Streaming Total Time:  {total_stream_time:.2f}s")
    print(f"First Token:           {repr(first_token)}")
    print(f"Total Output Tokens:   {len(accumulated_tokens)}")
    print(f"Full Text Length:      {len(full_text)} characters")

    return {
        "ttft": ttft,
        "total_stream_time": total_stream_time,
        "output_length": len(full_text),
        "chunks_count": len(sources),
    }


if __name__ == "__main__":
    print("=" * 60)
    print("NEXORA PERFORMANCE MEASUREMENT (Live Cloud Provider)")
    print("=" * 60)
    sync_res = benchmark_sync()
    stream_res = benchmark_streaming()
    print("\n" + "=" * 60)
    print("SUMMARY")
    print(f"Synchronous /ask:      {sync_res['sync_latency']:.2f}s")
    print(f"Streaming TTFT:        {stream_res['ttft']:.2f}s")
    print(f"Streaming Total Time:  {stream_res['total_stream_time']:.2f}s")
    print("=" * 60)
