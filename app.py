import re
import urllib.parse
import requests
from bs4 import BeautifulSoup
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS

app = Flask(__name__)
# Sabhi origins (Capacitor/Android APK) ke liye CORS enable
CORS(app, resources={r"/*": {"origins": "*"}})

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def clean_text(text):
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    site_patterns = [
        r'Wikipedia', r'Merriam-Webster', r'Dictionary', r'Britannica',
        r'Psychology Today', r'Coursera', r'Grammarly', r'YouTube',
        r'GeeksforGeeks', r'W3Schools', r'Stack Overflow', r'Programiz',
        r'Tutorialspoint', r'OneCompiler', r'Javatpoint'
    ]
    for pattern in site_patterns:
        text = re.sub(pattern, '', text, flags=re.IGNORECASE)
    text = re.sub(r'\s*-\s*$', '', text)
    return re.sub(r'\s{2,}', ' ', text).strip()

def fetch_first_code_snippet(target_url):
    try:
        res = requests.get(target_url, headers=HEADERS, timeout=5)
        if res.status_code == 200:
            soup = BeautifulSoup(res.text, 'html.parser')
            for code_tag in soup.find_all(['pre', 'code']):
                code_text = code_tag.get_text()
                if len(code_text.strip()) > 30 and any(kw in code_text for kw in [";", "{", "def ", "import", "class"]):
                    return code_text.strip()
    except Exception:
        pass
    return None

def web_search(query):
    snippets = []
    direct_code = None
    try:
        url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}"
        res = requests.get(url, headers=HEADERS, timeout=8)
        if res.status_code == 200:
            soup = BeautifulSoup(res.text, 'html.parser')
            results = soup.find_all('div', class_='result', limit=4)
            for idx, r in enumerate(results):
                snippet_elem = r.find('a', class_='result__snippet')
                if snippet_elem:
                    cleaned = clean_text(snippet_elem.get_text(strip=True))
                    if cleaned and len(cleaned) > 20 and cleaned not in snippets:
                        snippets.append(cleaned)
                
                if idx == 0 and not direct_code:
                    link_elem = r.find('a', class_='result__url')
                    if link_elem:
                        href = link_elem.get('href', '')
                        if "uddg=" in href:
                            clean_link = urllib.parse.unquote(href.split("uddg=")[1].split("&")[0])
                            direct_code = fetch_first_code_snippet(clean_link)
    except Exception:
        pass
    return snippets, direct_code

def format_himo_response(user_query):
    query_lower = user_query.lower().strip()
    if query_lower in ["hi", "hii", "hello", "hii himo", "hi himo"]:
        return "Yo! Himo Omni Engine active hai. Live Web Search & Code Extractor ready hai. Kya find ya build karna hai?"

    snippets, direct_code = web_search(user_query)
    
    output = "According to Himo:\n\n"
    if direct_code:
        output += f"```java\n{direct_code}\n```\n\n"
        output += "Details & Logic:\n"
        for s in snippets[:2]:
            output += f"• {s}\n"
    elif snippets:
        for s in snippets:
            output += f"• {s}\n\n"
    else:
        output += f"'{user_query}' par filhaal koi real-time data match nahi hua."
    return output

HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Himo AI</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
</head>
<body class="bg-slate-950 text-slate-100 flex flex-col h-screen font-sans">
    <header class="border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-3">
            <div class="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">H</div>
            <div>
                <h1 class="text-base font-bold text-white leading-tight">Himo AI</h1>
                <p class="text-xs text-emerald-400 font-medium flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Web Search & Code Online
                </p>
            </div>
        </div>
    </header>

    <main id="chat-container" class="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 max-w-4xl w-full mx-auto">
        <div class="flex gap-3">
            <div class="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-xs font-bold shrink-0">H</div>
            <div class="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-200 leading-relaxed shadow-sm max-w-[85%]">
                Himo AI ready hai bhai! Kuch bhi pucho ya code extract karwao.
            </div>
        </div>
    </main>

    <footer class="border-t border-slate-800 bg-slate-900/90 p-4">
        <form id="chat-form" class="max-w-4xl mx-auto flex items-center gap-2">
            <input 
                id="user-input" 
                type="text" 
                placeholder="Ask Himo anything..." 
                class="flex-1 bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                autocomplete="off"
            />
            <button 
                type="submit" 
                class="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white px-5 py-3 rounded-xl text-sm font-semibold transition shadow-md shadow-indigo-600/20"
            >
                Send
            </button>
        </form>
    </footer>

    <script>
        const chatContainer = document.getElementById('chat-container');
        const chatForm = document.getElementById('chat-form');
        const userInput = document.getElementById('user-input');

        function appendMessage(sender, text) {
            const isUser = sender === 'user';
            const wrapper = document.createElement('div');
            wrapper.className = `flex gap-3 ${isUser ? 'justify-end' : ''}`;

            const avatar = isUser ? '' : `<div class="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-xs font-bold shrink-0">H</div>`;
            const content = isUser 
                ? `<div class="bg-indigo-600 text-white rounded-2xl px-4 py-3 text-sm max-w-[85%] leading-relaxed">${text}</div>`
                : `<div class="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-200 leading-relaxed prose prose-invert max-w-[85%]">${marked.parse(text)}</div>`;

            wrapper.innerHTML = isUser ? content : avatar + content;
            chatContainer.appendChild(wrapper);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            hljs.highlightAll();
        }

        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = userInput.value.trim();
            if (!text) return;

            appendMessage('user', text);
            userInput.value = '';

            const loadingDiv = document.createElement('div');
            loadingDiv.id = 'loading';
            loadingDiv.className = 'flex gap-3';
            loadingDiv.innerHTML = `
                <div class="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-xs font-bold shrink-0">H</div>
                <div class="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-400 italic">
                    Himo search kar raha hai...
                </div>
            `;
            chatContainer.appendChild(loadingDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;

            try {
                // Absolute URL di hai taaki APK WebView seedhe live Vercel endpoint hit kare
                const res = await fetch('https://himo-ai-six.vercel.app/api/chat', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({query: text})
                });
                const data = await res.json();
                document.getElementById('loading').remove();
                appendMessage('himo', data.response);
            } catch (err) {
                document.getElementById('loading').remove();
                appendMessage('himo', 'Error: APK Backend se connect nahi ho paya. Internet check karein.');
            }
        });
    </script>
</body>
</html>
"""

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def home(path):
    return render_template_string(HTML_TEMPLATE)

@app.route('/api/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
    data = request.get_json() or {}
    query = data.get('query', '')
    if not query:
        return jsonify({"response": "Query empty hai."})
    
    reply = format_himo_response(query)
    return jsonify({"response": reply})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
