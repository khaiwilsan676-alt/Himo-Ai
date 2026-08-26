import json
import socket
from http.server import HTTPServer, BaseHTTPRequestHandler
from himo_core import CognitiveBrain

mind = CognitiveBrain()

class HimoHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        if self.path == "/":
            self._set_headers(200)
            data = {"status": "online", "brain": "Himo Core v4.0"}
            self.wfile.write(json.dumps(data).encode('utf-8'))
        elif self.path == "/memory":
            self._set_headers(200)
            data = {
                "facts": mind.memory.get("facts", {}),
                "relations_count": len(mind.memory.get("relations", [])),
                "qa_rules_count": len(mind.memory.get("qa_memory", {}))
            }
            self.wfile.write(json.dumps(data).encode('utf-8'))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Not Found"}).encode('utf-8'))

    def do_POST(self):
        if self.path == "/chat":
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                payload = json.loads(post_data.decode('utf-8'))
                user_msg = payload.get("message", "").strip()
            except Exception:
                user_msg = ""

            if not user_msg:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": "Message required"}).encode('utf-8'))
                return

            reply = mind.think_and_reply(user_msg)
            self._set_headers(200)
            response_data = {
                "reply": reply,
                "active_subject": mind.last_subject
            }
            self.wfile.write(json.dumps(response_data).encode('utf-8'))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode('utf-8'))

def run():
    # Try multiple ports to avoid conflicts
    for port in [8080, 8000, 5000, 9000]:
        try:
            server_address = ('0.0.0.0', port)
            httpd = HTTPServer(server_address, HimoHandler)
            print(f"\n[✅] HIMO API SERVER RUNNING ON PORT: {port}")
            print(f"[🔗] Local URL: http://localhost:{port}/chat\n")
            httpd.serve_forever()
            break
        except OSError:
            continue

if __name__ == "__main__":
    run()
