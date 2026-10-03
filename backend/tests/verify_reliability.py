import urllib.request
import json
import time
import sys

base_url = 'https://nexora-backend-two.vercel.app'
frontend_url = 'https://nexora-virid-xi.vercel.app'

print('=== 1. VERIFY /health ===')
t0 = time.time()
with urllib.request.urlopen(f'{base_url}/health', timeout=15) as res:
    data = json.loads(res.read().decode('utf-8'))
    print(f'Status: {res.status} in {time.time()-t0:.2f}s')
    print(f'Backend: {data.get("backend")}, Chunks: {data.get("knowledge_base", {}).get("chunks_count")}')
    assert res.status == 200
    assert data.get('backend') == 'online'

queries = [
    ('1. What is NEXORA?', 'What is NEXORA?'),
    ('2. What procurement risks exist?', 'What procurement risks exist?'),
    ('3. Who created NEXORA and was it built for a hackathon?', 'Who created NEXORA and was it built for a hackathon?'),
    ('4. What are NEXORAs key capabilities?', 'What are NEXORAs key capabilities?')
]

for label, q in queries:
    print(f'\n=== QUERY: {label} ===')
    t0 = time.time()
    req = urllib.request.Request(
        f'{base_url}/ask',
        data=json.dumps({'question': q}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req, timeout=30) as res:
        res_data = json.loads(res.read().decode('utf-8'))
        elapsed = time.time() - t0
        print(f'HTTP {res.status} in {elapsed:.2f}s')
        ans = res_data.get('answer', '')
        print('Answer:', ans[:160] + ('...' if len(ans) > 160 else ''))
        sources = res_data.get('sources', [])
        print('Sources count:', len(sources))
        if 'hackathon' in q.lower():
            for kw in ['ashish', 'iit', 'student', 'kaya', 'hackathon']:
                assert kw not in ans.lower(), f'Sensitive term {kw} found in answer!'
                for s in sources:
                    assert kw not in s.lower(), f'Sensitive term {kw} found in source!'
            print('VERIFIED: No sensitive/creator/hackathon info in privacy answer or sources.')

print('\n=== 5. VERIFY /ask/stream TIMING (Must not hang!) ===')
t0 = time.time()
req_stream = urllib.request.Request(
    f'{base_url}/ask/stream',
    data=json.dumps({'question': 'What are NEXORAs key capabilities?'}).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)
with urllib.request.urlopen(req_stream, timeout=20) as res:
    print(f'Connected in {time.time()-t0:.2f}s')
    tokens = []
    events = []
    while True:
        line = res.readline()
        if not line:
            break
        line_str = line.decode('utf-8').strip()
        if line_str.startswith('data:'):
            payload = line_str[5:].strip()
            if payload:
                try:
                    ev = json.loads(payload)
                    events.append(ev)
                    if ev.get('type') == 'token':
                        tokens.append(ev['token'])
                    elif ev.get('type') == 'done':
                        print('Done event received!')
                        break
                except Exception:
                    pass
    stream_time = time.time() - t0
    print(f'Stream completed in {stream_time:.2f}s (Tokens: {len(tokens)})')
    assert stream_time < 15.0, f'Stream took too long: {stream_time}s!'
    print('Tokens preview:', ''.join(tokens[:10]))

print('\n=== 6. VERIFY CANCEL / STOP BEHAVIOR ===')
t0 = time.time()
req_cancel = urllib.request.Request(
    f'{base_url}/ask/stream',
    data=json.dumps({'question': 'What are NEXORAs key capabilities?'}).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)
with urllib.request.urlopen(req_cancel, timeout=20) as res:
    # Read first token then close immediately
    first_token_received = False
    for line in res:
        line_str = line.decode('utf-8').strip()
        if 'token' in line_str:
            first_token_received = True
            break
    # Close connection
    res.close()
    cancel_time = time.time() - t0
    print(f'Cancelled cleanly after receiving first token in {cancel_time:.2f}s')
    assert first_token_received is True

print('\nALL PRODUCTION RELIABILITY TESTS PASSED WITH 100% SUCCESS!')
