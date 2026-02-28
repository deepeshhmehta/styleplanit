import http.server
import socketserver
import os
import sys

PORT = 8000

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    """
    Custom handler to support GitHub Pages style routing.
    Redirects /services to /services.html automatically.
    """
    def do_GET(self):
        # 1. Get the local file path for the requested URL
        path = self.translate_path(self.path)
        
        # 2. Check if we need to append .html
        if not os.path.exists(path) and not os.path.splitext(path)[1]:
            html_path = path + ".html"
            if os.path.exists(html_path):
                self.path += ".html"
        
        return super().do_GET()

# Ensure we run from project root even if called from scripts/
os.chdir(os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir)))

print("\n" + "="*50)
print(f"🚀 Style Plan(it) Dev Server")
print(f"🔗 http://localhost:{PORT}")
print("Mode: Clean URLs (GitHub Pages Parity)")
print("="*50 + "\n")

try:
    with socketserver.TCPServer(("", PORT), CleanURLHandler) as httpd:
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\n👋 Server stopped.")
    sys.exit(0)
except Exception as e:
    print(f"\n❌ Error: {e}")
    sys.exit(1)
