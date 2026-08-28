// ==========================================
// HIMO INTELLIGENT CODE GENERATOR ENGINE
// ==========================================

export function generateCodeFromPrompt(prompt) {
  if (!prompt || typeof prompt !== "string") return null;

  const q = prompt.trim().toLowerCase();

  // Trigger words for coding requests
  const codeTriggers = [
    "code", "program", "script", "function", "component", "html", "css", 
    "javascript", "js", "react", "nextjs", "python", "node", "api", 
    "button", "form", "login page", "navbar", "card", "fetch", "game", "sql"
  ];

  const hasCodeIntent = codeTriggers.some(trigger => q.includes(trigger));
  if (!hasCodeIntent) return null;

  // 1. React / Next.js Component Prompts
  if (q.includes("react") || q.includes("component") || q.includes("nextjs") || q.includes("navbar") || q.includes("card")) {
    if (q.includes("navbar") || q.includes("header")) {
      return `### React Responsive Navbar Component\n\n\`\`\`jsx
import React, { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white shadow-md">
      <div className="text-xl font-bold tracking-wide">HimoDev</div>
      <div className="hidden md:flex gap-6 text-sm font-medium">
        <a href="#home" className="hover:text-blue-400 transition">Home</a>
        <a href="#features" className="hover:text-blue-400 transition">Features</a>
        <a href="#contact" className="hover:text-blue-400 transition">Contact</a>
      </div>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="md:hidden p-2 text-gray-300 hover:text-white"
      >
        ☰
      </button>
    </nav>
  );
}
\`\`\``;
    }

    if (q.includes("card")) {
      return `### Modern Glassmorphism Card Component\n\n\`\`\`jsx
import React from 'react';

export default function GlassCard({ title, desc, tag }) {
  return (
    <div className="max-w-sm p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl text-white">
      <span className="text-xs uppercase tracking-wider bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-400/30">
        {tag || "Featured"}
      </span>
      <h3 className="text-xl font-bold mt-4">{title || "Card Title"}</h3>
      <p className="text-sm text-gray-300 mt-2">{desc || "Card dynamic content description goes here."}</p>
      <button className="mt-5 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition">
        Explore
      </button>
    </div>
  );
}
\`\`\``;
    }
  }

  // 2. Python Scripts (Web Scraping, Automation, AI, Logic)
  if (q.includes("python") || q.includes("py") || q.includes("scrape") || q.includes("bot")) {
    if (q.includes("scrape") || q.includes("scraper") || q.includes("requests")) {
      return `### Python Web Scraper (BeautifulSoup & Requests)\n\n\`\`\`python
import requests
from bs4 import BeautifulSoup

def scrape_page(url):
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        title = soup.title.string if soup.title else "No Title Found"
        
        print(f"Page Title: {title}")
        return title
    except Exception as e:
        print(f"Error fetching page: {e}")
        return None

if __name__ == "__main__":
    scrape_page("https://example.com")
\`\`\``;
    }

    return `### Python Automation Script\n\n\`\`\`python
import time

def process_data(items):
    print("Starting execution...")
    results = []
    for idx, item in enumerate(items, 1):
        processed = f"{idx}. Processed: {item.strip().upper()}"
        results.append(processed)
        time.sleep(0.1)
    return results

if __name__ == "__main__":
    sample_data = ["data_point_a", "data_point_b", "data_point_c"]
    output = process_data(sample_data)
    for line in output:
        print(line)
\`\`\``;
  }

  // 3. HTML / CSS / JavaScript (Login Forms, Landing UI)
  if (q.includes("login") || q.includes("form")) {
    return `### Responsive Login Form (HTML + CSS)\n\n\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login</title>
  <style>
    body {
      margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: #0f172a; font-family: sans-serif; color: #fff;
    }
    .login-box {
      background: #1e293b; padding: 32px; border-radius: 16px; width: 100%; max-width: 360px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    }
    .input-field {
      width: 100%; padding: 12px; margin: 8px 0 16px; border-radius: 8px; border: 1px solid #334155;
      background: #0f172a; color: #fff; box-sizing: border-box; outline: none;
    }
    .input-field:focus { border-color: #3b82f6; }
    .btn {
      width: 100%; padding: 12px; background: #2563eb; color: #fff; border: none;
      border-radius: 8px; font-weight: bold; cursor: pointer;
    }
    .btn:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <div class="login-box">
    <h2>Sign In</h2>
    <form>
      <label>Email</label>
      <input type="email" placeholder="name@domain.com" required class="input-field">
      <label>Password</label>
      <input type="password" placeholder="••••••••" required class="input-field">
      <button type="submit" class="btn">Log In</button>
    </form>
  </div>
</body>
</html>
\`\`\``;
  }

  // 4. JavaScript Async API Fetch / Backend Node.js
  if (q.includes("fetch") || q.includes("api") || q.includes("async") || q.includes("node")) {
    return `### JavaScript Async API Fetch & Error Handling\n\n\`\`\`javascript
async function fetchSecureData(endpoint) {
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(\`HTTP Error: \${response.status}\`);
    }

    const data = await response.json();
    console.log("Data received successfully:", data);
    return data;
  } catch (error) {
    console.error("Fetch execution failed:", error.message);
    return null;
  }
}
\`\`\``;
  }

  // 5. Default Algorithm & Code Generator Template
  return `### Code Solution\n\n\`\`\`javascript
// Generated for prompt: "${prompt}"

function executeSolution(input) {
  if (!input) return null;
  
  // Clean, scalable logic
  const result = {
    status: "success",
    timestamp: new Date().toISOString(),
    payload: input
  };

  return result;
}

// Example Execution
console.log(executeSolution("Himo Omni Code Engine Ready!"));
\`\`\``;
}
