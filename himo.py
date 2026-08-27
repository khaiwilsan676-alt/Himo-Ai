import re
import urllib.parse
import requests
from bs4 import BeautifulSoup

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
    """Direct web page se actual code block extract karta hai"""
    try:
        res = requests.get(target_url, headers=HEADERS, timeout=5)
        if res.status_code == 200:
            soup = BeautifulSoup(res.text, 'html.parser')
            # Code tags dhoondo
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
                # Snippet text
                snippet_elem = r.find('a', class_='result__snippet')
                if snippet_elem:
                    cleaned = clean_text(snippet_elem.get_text(strip=True))
                    if cleaned and len(cleaned) > 20 and cleaned not in snippets:
                        snippets.append(cleaned)
                
                # Pehle result se actual code block scrape karne ki koshish
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
    snippets, direct_code = web_search(user_query)
    
    output = "\nAccording to Himo:\n\n"
    
    if direct_code:
        output += f"```java\n{direct_code}\n```\n\n"
        output += "Details & Logic:\n"
        for s in snippets[:2]:
            output += f"• {s}\n"
    elif snippets:
        for s in snippets:
            output += f"• {s}\n\n"
    else:
        output += f"No data found for '{user_query}'.\n"
        
    return output

def main():
    print("🚀 Himo AI (Deep Code Extraction Enabled) Ready!")
    print("Type 'exit' or 'quit' to stop.\n")
    
    while True:
        try:
            user_input = input("You: ").strip()
            if not user_input:
                continue
            if user_input.lower() in ["exit", "quit"]:
                print("\nAccording to Himo: Alvida Bhai!")
                break

            response = format_himo_response(user_input)
            print(response)

        except KeyboardInterrupt:
            print("\nExiting...")
            break

if __name__ == "__main__":
    main()
