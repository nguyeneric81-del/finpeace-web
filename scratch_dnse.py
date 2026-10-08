import requests
import json
import time
import threading

try:
    import sseclient
except ImportError:
    import os
    os.system("python3 -m pip install sseclient-py")
    import sseclient

token = "eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxMDAwNjA3Nzk1IiwiYnJva2VySWQiOiIzMzYxIiwicm9sZXMiOlsiaW52ZXN0b3IiLCJCUk9LRVIiXSwiaW52ZXN0b3JJZCI6IjEwMDA2MDc3OTUiLCJpc3MiOiJETlNFIiwiYnJva2VyVHlwZSI6IlNBQ08iLCJmdWxsTmFtZSI6Ik5ndXnhu4VuIFR14bqlbiBBbmgiLCJ1c2VySWQiOiIzYmFjY2VjNS1jYTIxLTRhZjgtOWU5Mi0wYWYyNzBmZmU1MWUiLCJhdWQiOlsiYXVkaWVuY2UiXSwibmJmIjoxNzg3OTMxMTQ3LCJjdXN0b2R5Q29kZSI6IjA2NENUQTMzNjYiLCJjdXN0b21lckVtYWlsIjoibmd1eWVuZXJpYzgxQGdtYWlsLmNvbSIsImN1c3RvbWVySWQiOiIxMDAwNjA3Nzk1IiwiZXhwIjoxNzg3OTU5OTQ3LCJjdXN0b21lck1vYmlsZSI6IjA5Njk5MzMzMjYiLCJpYXQiOjE3ODc5MzExNDcsInN0YXR1cyI6IkFDVElWRSIsInVzZXJuYW1lIjoiYW5oLm5ndXllbl8zMzYxIn0.Dcg2cvuYCUcwHAxEfFRF12AnbrPQdgoHO4KMqIrio_96ZzOjVaTq11k40I53vv5nCyorxvKEZwhNRwr-GfFnV8duYg2S7tOnrvceiyO8wO1mZ-5-xxLWtweBrYy_1ESHSJ8MSHw1vufbIXYIrwXqZi4_bsz79DJ-fRYmhHaCkzo"
headers = {"Authorization": f"Bearer {token}"}
url = "https://mcp.dnse.com.vn/mcp"

response = requests.get(url, headers=headers, stream=True)
client = sseclient.SSEClient(response)

post_endpoint = None

def listen():
    global post_endpoint
    for event in client.events():
        if event.event == 'endpoint':
            post_endpoint = event.data
            break

t = threading.Thread(target=listen)
t.start()
time.sleep(3)

if post_endpoint:
    post_url = post_endpoint if post_endpoint.startswith('http') else f"https://mcp.dnse.com.vn{post_endpoint}"
    
    payload = {
        "jsonrpc": "2.0",
        "id": 2,
        "method": "tools/call",
        "params": {
            "name": "financial_get_report_summary",
            "arguments": {"symbol": "HPG"}
        }
    }
    r2 = requests.post(post_url, headers=headers, json=payload)
    print("financial_get_report_summary:", r2.text[:1000])
    
    payload3 = {
        "jsonrpc": "2.0",
        "id": 3,
        "method": "tools/call",
        "params": {
            "name": "financial_get_index",
            "arguments": {"symbol": "HPG"}
        }
    }
    r3 = requests.post(post_url, headers=headers, json=payload3)
    print("financial_get_index:", r3.text[:1000])
else:
    print("No endpoint received")
