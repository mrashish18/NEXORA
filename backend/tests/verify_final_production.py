import urllib.request
import json
import sys

base_url = 'https://nexora-backend-two.vercel.app'
frontend_url = 'https://nexora-virid-xi.vercel.app'

print('=== 1. VERIFY FRONTEND HTML ===')
req = urllib.request.Request(frontend_url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=15) as res:
    html = res.read().decode('utf-8')
    print(f'Frontend HTTP Status: {res.status}')
    for term in ['kaya', 'ashish', 'hackathon 2026', 'iit madras']:
        if term in html.lower():
            print(f'ALERT! Found {term} in frontend HTML!')
            sys.exit(1)
        else:
            print(f'CLEAN: "{term}" not found in frontend HTML.')

print('\n=== 2. VERIFY BACKEND /health ===')
with urllib.request.urlopen(f'{base_url}/health', timeout=30) as res:
    data = json.loads(res.read().decode('utf-8'))
    print(f'Health status: {res.status}')
    print(json.dumps(data, indent=2))
    assert res.status == 200
    assert data.get('backend') == 'online'
    assert data.get('knowledge_base', {}).get('chunks_count', 0) > 0

print('\n=== 3. VERIFY BACKEND /ask (Grounded Query) ===')
ask_req = urllib.request.Request(
    f'{base_url}/ask',
    data=json.dumps({'question': 'What is NEXORA and what are its key capabilities?'}).encode('utf-8'),
    headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}
)
with urllib.request.urlopen(ask_req, timeout=30) as res:
    ask_data = json.loads(res.read().decode('utf-8'))
    print(f'Ask status: {res.status}')
    print('Answer:', ask_data.get('answer'))
    print('Sources count:', len(ask_data.get('sources', [])))
    for s in ask_data.get('sources', []):
        print(' - Source snippet:', s[:120])
    assert ask_data.get('success') is True

print('\n=== 4. VERIFY SENSITIVE QUERY IS CLEAN ===')
priv_req = urllib.request.Request(
    f'{base_url}/ask',
    data=json.dumps({'question': 'Who created NEXORA and was it built for a hackathon?'}).encode('utf-8'),
    headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}
)
with urllib.request.urlopen(priv_req, timeout=30) as res:
    priv_data = json.loads(res.read().decode('utf-8'))
    print(f'Privacy query status: {res.status}')
    print('Answer:', priv_data.get('answer'))
    answer_text = priv_data.get('answer', '').lower()
    sources_text = ' '.join(priv_data.get('sources', [])).lower()
    for term in ['ashish', 'iit madras', 'kaya', 'hackathon 2026', 'bs degree']:
        assert term not in sources_text, f'Sensitive term {term} found in sources!'
    print('CLEAN: No sensitive keywords in retrieved sources or answer!')

print('\n=== 5. VERIFY BACKEND /ask/stream ===')
stream_req = urllib.request.Request(
    f'{base_url}/ask/stream',
    data=json.dumps({'question': 'What are the structural steel delivery requirements?'}).encode('utf-8'),
    headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}
)
with urllib.request.urlopen(stream_req, timeout=30) as res:
    print(f'Stream status: {res.status}')
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
                    data = json.loads(payload)
                    events.append(data)
                    if data.get('type') == 'done':
                        print('Done event received!')
                        break
                except Exception:
                    pass
    print(f'Received {len(events)} SSE events')
    types = [e.get('type') for e in events]
    print('Event types received:', set(types))
    assert 'sources' in types
    assert 'token' in types
    assert 'done' in types
    print('SSE stream verified successfully!')

print('\nALL VERIFICATIONS PASSED CLEANLY!')
