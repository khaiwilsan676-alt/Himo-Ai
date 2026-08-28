export function generateCodeFromPrompt(prompt) {
  if (!prompt || typeof prompt !== "string") return null;
  const q = prompt.trim().toLowerCase();

  const codeTriggers = ["code", "program", "script", "function", "component", "html", "css", "javascript", "js", "react", "nextjs", "python", "node", "api", "button", "form", "login page", "navbar", "card", "fetch", "game", "sql"];
  const hasCodeIntent = codeTriggers.some(trigger => q.includes(trigger));
  if (!hasCodeIntent) return null;

  // React Components
  if (q.includes("navbar") || q.includes("header")) {
    return `\`\`\`jsx
import React, { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-900 text-white">
      <div className="text-xl font-bold">Himo</div>
      <div className="hidden md:flex gap-6">
        <a href="#home" className="hover:text-blue-400">Home</a>
        <a href="#about" className="hover:text-blue-400">About</a>
        <a href="#contact" className="hover:text-blue-400">Contact</a>
      </div>
      <button onClick={() => setOpen(!open)} className="md:hidden">☰</button>
    </nav>
  );
}
\`\`\``;
  }

  // HTML Login Page
  if (q.includes("login") || q.includes("form")) {
    return `\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Login</title>
  <style>
    body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #0f172a; font-family: sans-serif; }
    .card { background: #1e293b; padding: 32px; border-radius: 12px; width: 320px; color: #fff; }
    input { width: 100%; padding: 10px; margin: 8px 0 16px; border-radius: 6px; border: 1px solid #334155; background: #0f172a; color: #fff; box-sizing: border-box; }
    button { width: 100%; padding: 10px; background: #2563eb; color: #fff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Login</h2>
    <form>
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Password" required />
      <button type="submit">Sign In</button>
    </form>
  </div>
</body>
</html>
\`\`\``;
  }

  // Python Scraper
  if (q.includes("python") && (q.includes("scrape") || q.includes("soup") || q.includes("request"))) {
    return `\`\`\`python
import requests
from bs4 import BeautifulSoup

def scrape_url(url):
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        return soup.title.string if soup.title else "No Title"
    return None

if __name__ == "__main__":
    print(scrape_url("https://example.com"))
\`\`\``;
  }

  // Generic Function Output
  return `\`\`\`javascript
function executeTask(data) {
  if (!data) return null;
  return {
    success: true,
    result: data
  };
}

console.log(executeTask("Running task"));
\`\`\``;
}
