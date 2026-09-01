// Advanced Automatic Code Synthesis Engine for Himo
export default class CodeEngine {
  constructor() {
    this.language = 'javascript';
    this.fileName = 'script.js';
    this.prompt = '';
  }

  detectLanguage(prompt) {
    const p = prompt.toLowerCase();
    this.prompt = p;

    if (p.includes('react') || p.includes('jsx') || p.includes('next.js') || p.includes('nextjs') || p.includes('component')) {
      this.language = 'react';
      this.fileName = 'App.jsx';
    } else if (p.includes('html') || p.includes('webpage') || p.includes('web page') || p.includes('website') || p.includes('landing') || p.includes('portfolio') || p.includes('form') || p.includes('login') || p.includes('ui')) {
      this.language = 'html';
      this.fileName = 'index.html';
    } else if (p.includes('css') || p.includes('style') || p.includes('styling') || p.includes('animation')) {
      this.language = 'css';
      this.fileName = 'style.css';
    } else if (p.includes('python') || p.includes('py') || p.includes('flask') || p.includes('django') || p.includes('turtle') || p.includes('pygame')) {
      this.language = 'python';
      this.fileName = 'main.py';
    } else if (p.includes('java') && !p.includes('javascript')) {
      this.language = 'java';
      this.fileName = 'Main.java';
    } else if (p.includes('c++') || p.includes('cpp') || p.includes('cplusplus')) {
      this.language = 'cpp';
      this.fileName = 'main.cpp';
    } else if (p.includes('c#') || p.includes('csharp') || p.includes('.net')) {
      this.language = 'csharp';
      this.fileName = 'Program.cs';
    } else if (p.includes('php') || p.includes('laravel')) {
      this.language = 'php';
      this.fileName = 'index.php';
    } else if (p.includes('sql') || p.includes('database') || p.includes('mysql') || p.includes('postgres') || p.includes('table')) {
      this.language = 'sql';
      this.fileName = 'schema.sql';
    } else if (p.includes('typescript') || p.includes('ts')) {
      this.language = 'typescript';
      this.fileName = 'main.ts';
    } else if (p.includes('node') || p.includes('express') || p.includes('server') || p.includes('api')) {
      this.language = 'nodejs';
      this.fileName = 'server.js';
    } else if (p.includes('json') || p.includes('config')) {
      this.language = 'json';
      this.fileName = 'config.json';
    } else if (p.includes('bash') || p.includes('shell') || p.includes('sh')) {
      this.language = 'bash';
      this.fileName = 'script.sh';
    } else {
      this.language = 'javascript';
      this.fileName = 'app.js';
    }
  }

  generateCode(prompt) {
    if (!prompt) return '';
    this.detectLanguage(prompt);

    switch (this.language) {
      case 'html':
        return this.generateHTML(prompt);
      case 'css':
        return this.generateCSS(prompt);
      case 'python':
        return this.generatePython(prompt);
      case 'react':
        return this.generateReact(prompt);
      case 'java':
        return this.generateJava(prompt);
      case 'cpp':
        return this.generateCpp(prompt);
      case 'csharp':
        return this.generateCSharp(prompt);
      case 'php':
        return this.generatePHP(prompt);
      case 'sql':
        return this.generateSQL(prompt);
      case 'typescript':
        return this.generateTypeScript(prompt);
      case 'nodejs':
        return this.generateNodeJS(prompt);
      case 'json':
        return this.generateJSON(prompt);
      case 'bash':
        return this.generateBash(prompt);
      default:
        return this.generateJavaScript(prompt);
    }
  }

  generateHTML(prompt) {
    const p = prompt.toLowerCase();

    if (p.includes('calculator') || p.includes('calc')) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Smart Modern Calculator</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    body { background: #0f172a; height: 100vh; display: flex; align-items: center; justify-content: center; }
    .calculator { background: #1e293b; padding: 24px; border-radius: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.5); width: 320px; border: 1px solid #334155; }
    .display { background: #0f172a; color: #38bdf8; font-size: 2rem; font-weight: bold; text-align: right; padding: 16px; border-radius: 12px; margin-bottom: 20px; word-wrap: break-word; min-height: 40px; border: 1px solid #1e293b; }
    .buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
    button { background: #334155; color: #f8fafc; border: none; padding: 16px; font-size: 1.25rem; font-weight: 600; border-radius: 12px; cursor: pointer; transition: all 0.2s; }
    button:hover { background: #475569; transform: translateY(-2px); }
    button.op { background: #2563eb; color: #fff; }
    button.op:hover { background: #1d4ed8; }
    button.clear { background: #ef4444; color: #fff; }
    button.clear:hover { background: #dc2626; }
    button.equal { background: #10b981; color: #fff; grid-column: span 2; }
    button.equal:hover { background: #059669; }
  </style>
</head>
<body>
  <div class="calculator">
    <div className="display" id="display">0</div>
    <div class="buttons">
      <button class="clear" onclick="clearDisplay()">C</button>
      <button onclick="appendDisplay('/')" class="op">÷</button>
      <button onclick="appendDisplay('*')" class="op">×</button>
      <button onclick="deleteLast()" class="op">⌫</button>
      <button onclick="appendDisplay('7')">7</button>
      <button onclick="appendDisplay('8')">8</button>
      <button onclick="appendDisplay('9')">9</button>
      <button onclick="appendDisplay('-')" class="op">-</button>
      <button onclick="appendDisplay('4')">4</button>
      <button onclick="appendDisplay('5')">5</button>
      <button onclick="appendDisplay('6')">6</button>
      <button onclick="appendDisplay('+')" class="op">+</button>
      <button onclick="appendDisplay('1')">1</button>
      <button onclick="appendDisplay('2')">2</button>
      <button onclick="appendDisplay('3')">3</button>
      <button onclick="calculate()" class="equal">=</button>
      <button onclick="appendDisplay('0')">0</button>
      <button onclick="appendDisplay('.')">.</button>
    </div>
  </div>
  <script>
    let display = document.getElementById('display');
    function appendDisplay(val) {
      if (display.innerText === '0' && val !== '.') display.innerText = '';
      display.innerText += val;
    }
    function clearDisplay() { display.innerText = '0'; }
    function deleteLast() {
      display.innerText = display.innerText.slice(0, -1);
      if (!display.innerText) display.innerText = '0';
    }
    function calculate() {
      try {
        display.innerText = eval(display.innerText.replace(/×/g, '*').replace(/÷/g, '/'));
      } catch (e) {
        display.innerText = 'Error';
      }
    }
  </script>
</body>
</html>`;
    }

    if (p.includes('login') || p.includes('form') || p.includes('auth')) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Responsive Modern Login</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); height: 100vh; display: flex; align-items: center; justify-content: center; }
    .card { background: rgba(30, 41, 59, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); padding: 36px; border-radius: 20px; width: 360px; color: #fff; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
    h2 { font-size: 1.8rem; font-weight: 700; margin-bottom: 8px; text-align: center; }
    p { color: #94a3b8; font-size: 0.88rem; text-align: center; margin-bottom: 24px; }
    .input-group { margin-bottom: 18px; }
    label { display: block; font-size: 0.82rem; color: #cbd5e1; margin-bottom: 6px; font-weight: 600; }
    input { width: 100%; padding: 12px 14px; background: #0f172a; border: 1px solid #334155; border-radius: 10px; color: #fff; font-size: 0.95rem; outline: none; transition: border-color 0.2s; }
    input:focus { border-color: #3b82f6; }
    button { width: 100%; padding: 12px; background: linear-gradient(90deg, #2563eb, #3b82f6); color: #fff; border: none; border-radius: 10px; font-size: 1rem; font-weight: 600; cursor: pointer; margin-top: 10px; transition: opacity 0.2s; }
    button:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Welcome Back</h2>
    <p>Sign in to your account</p>
    <form onsubmit="event.preventDefault(); alert('Login submitted successfully!');">
      <div class="input-group">
        <label>Email Address</label>
        <input type="email" placeholder="name@company.com" required />
      </div>
      <div class="input-group">
        <label>Password</label>
        <input type="password" placeholder="••••••••" required />
      </div>
      <button type="submit">Sign In</button>
    </form>
  </div>
</body>
</html>`;
    }

    if (p.includes('game') || p.includes('snake')) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Snake Game</title>
  <style>
    body { background: #0f172a; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; font-family: sans-serif; }
    h1 { margin-bottom: 10px; font-size: 1.8rem; }
    canvas { background: #1e293b; border: 2px solid #38bdf8; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .score { font-size: 1.2rem; margin-top: 10px; color: #38bdf8; }
  </style>
</head>
<body>
  <h1>🐍 Classic Snake Game</h1>
  <canvas id="gameCanvas" width="400" height="400"></canvas>
  <div class="score">Score: <span id="score">0</span></div>
  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const grid = 20;
    let snake = [{x: 160, y: 160}, {x: 140, y: 160}];
    let dx = grid, dy = 0;
    let food = {x: 300, y: 300};
    let score = 0;

    function main() {
      if (isGameOver()) return alert('Game Over! Final Score: ' + score);
      setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();
        main();
      }, 100);
    }

    function clearCanvas() { ctx.fillStyle = '#1e293b'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    function drawSnake() { ctx.fillStyle = '#4ade80'; snake.forEach(part => ctx.fillRect(part.x, part.y, grid - 2, grid - 2)); }
    function advanceSnake() {
      const head = {x: snake[0].x + dx, y: snake[0].y + dy};
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('score').innerText = score;
        generateFood();
      } else { snake.pop(); }
    }

    function generateFood() {
      food.x = Math.floor(Math.random() * (canvas.width / grid)) * grid;
      food.y = Math.floor(Math.random() * (canvas.height / grid)) * grid;
    }

    function drawFood() { ctx.fillStyle = '#f43f5e'; ctx.fillRect(food.x, food.y, grid - 2, grid - 2); }

    function isGameOver() {
      for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
      }
      return snake[0].x < 0 || snake[0].x >= canvas.width || snake[0].y < 0 || snake[0].y >= canvas.height;
    }

    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft' && dx === 0) { dx = -grid; dy = 0; }
      if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -grid; }
      if (e.key === 'ArrowRight' && dx === 0) { dx = grid; dy = 0; }
      if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = grid; }
    });

    main();
  </script>
</body>
</html>`;
    }

    // Generic HTML Template
    const title = this.capitalize(prompt);
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: system-ui, sans-serif; }
    body { background: #0f172a; color: #f8fafc; padding: 40px 20px; min-height: 100vh; }
    .container { max-width: 800px; margin: 0 auto; background: #1e293b; padding: 32px; border-radius: 16px; border: 1px solid #334155; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
    h1 { color: #38bdf8; margin-bottom: 16px; font-size: 2rem; }
    p { color: #94a3b8; line-height: 1.6; font-size: 1rem; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${title}</h1>
    <p>Automated output generated by Himo Engine for request: "${prompt}".</p>
  </div>
</body>
</html>`;
  }

  generateReact(prompt) {
    const p = prompt.toLowerCase();

    if (p.includes('todo') || p.includes('task')) {
      return `import React, { useState } from 'react';

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  const addTask = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: input, completed: false }]);
    setInput('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto', padding: '24px', background: '#1e293b', borderRadius: '16px', color: '#fff', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#38bdf8' }}>📝 Task Manager</h2>
      <form onSubmit={addTask} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', outline: 'none' }}
        />
        <button type="submit" style={{ padding: '12px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          Add
        </button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((task) => (
          <li key={task.id} style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', padding: '12px', background: '#0f172a', borderRadius: '8px', marginBottom: '8px', border: '1px solid #334155' }}>
            <span
              onClick={() => toggleTask(task.id)}
              style={{ flex: 1, cursor: 'pointer', textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#64748b' : '#fff' }}
            >
              {task.text}
            </span>
            <button onClick={() => deleteTask(task.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}`;
    }

    return `import React, { useState, useEffect } from 'react';

export default function FeatureComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating automated state logic for: ${prompt}
    const timer = setTimeout(() => {
      setData({ status: 'Active', topic: '${prompt}', timestamp: new Date().toLocaleTimeString() });
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6 bg-slate-900 text-slate-100 rounded-xl max-w-lg mx-auto border border-slate-800 shadow-xl">
      <h2 className="text-xl font-bold text-sky-400 mb-2">${this.capitalize(prompt)}</h2>
      {loading ? (
        <div className="text-slate-400 animate-pulse">Loading component state...</div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-slate-300">Status: <span className="text-emerald-400 font-medium">{data.status}</span></p>
          <p className="text-xs text-slate-500">Updated: {data.timestamp}</p>
        </div>
      )}
    </div>
  );
}`;
  }

  generatePython(prompt) {
    const p = prompt.toLowerCase();

    if (p.includes('turtle') || p.includes('draw')) {
      return `# Python Turtle Graphics Synthesis
import turtle

def draw_art():
    screen = turtle.Screen()
    screen.bgcolor("#0f172a")
    screen.title("Himo Turtle Synthesis")

    t = turtle.Turtle()
    t.speed(0)
    t.pensize(2)
    colors = ["#38bdf8", "#818cf8", "#c084fc", "#f472b6", "#34d399"]

    for i in range(180):
        t.pencolor(colors[i % len(colors)])
        t.forward(i * 2)
        t.left(59)

    turtle.done()

if __name__ == "__main__":
    draw_art()`;
    }

    if (p.includes('web') || p.includes('scrape') || p.includes('fetch')) {
      return `# Python Web Data Extraction Script
import urllib.request
import json

def fetch_web_data(url="https://httpbin.org/get"):
    print(f"Connecting to {url}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            data = response.read().decode('utf-8')
            json_data = json.loads(data)
            print("[SUCCESS] Data retrieved:")
            print(json.dumps(json_data, indent=2))
            return json_data
    except Exception as e:
        print(f"[ERROR] Failed to fetch data: {e}")

if __name__ == "__main__":
    fetch_web_data()`;
    }

    return `# Python Script for: ${prompt}
import json
import time

class ${this.toCamelCase(prompt)}Processor:
    def __init__(self, name="${prompt}"):
        self.name = name
        self.timestamp = time.strftime("%Y-%m-%d %H:%M:%S")

    def execute(self):
        print(f"Executing task: {self.name}")
        result = {
            "status": "success",
            "prompt": self.name,
            "processed_at": self.timestamp,
            "data": [x ** 2 for x in range(1, 6)]
        }
        return result

if __name__ == "__main__":
    processor = ${this.toCamelCase(prompt)}Processor()
    output = processor.execute()
    print(json.dumps(output, indent=4))`;
  }

  generateJavaScript(prompt) {
    return `// JavaScript Implementation for: ${prompt}
class ${this.toCamelCase(prompt)}Service {
  constructor() {
    this.prompt = "${prompt}";
    this.createdAt = new Date().toISOString();
  }

  async run() {
    console.log(\`Starting execution for: \${this.prompt}\`);
    try {
      const data = await this.fetchData();
      console.log('Result:', data);
      return data;
    } catch (error) {
      console.error('Execution failed:', error);
    }
  }

  fetchData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          query: this.prompt,
          timestamp: this.createdAt,
          items: [10, 20, 30, 40]
        });
      }, 500);
    });
  }
}

// Instantiate and Run
const runner = new ${this.toCamelCase(prompt)}Service();
runner.run();`;
  }

  generateNodeJS(prompt) {
    return `// Node.js Express REST API Server
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API Endpoint for: ${prompt}
app.get('/api/resource', (req, res) => {
  res.json({
    status: 'success',
    message: 'API response for ${prompt}',
    data: [
      { id: 1, name: 'Item Alpha', active: true },
      { id: 2, name: 'Item Beta', active: false }
    ]
  });
});

app.post('/api/resource', (req, res) => {
  const body = req.body;
  res.status(201).json({
    status: 'created',
    received: body
  });
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`;
  }

  generateJava(prompt) {
    const className = this.toCamelCase(prompt) || 'MainApp';
    return `import java.util.*;

public class ${className} {
    public static void main(String[] args) {
        System.out.println("Java Automatic Code Synthesis Engine");
        System.out.println("Processing prompt: ${prompt}");

        List<String> items = new ArrayList<>();
        items.add("Feature A");
        items.add("Feature B");
        items.add("Feature C");

        for (String item : items) {
            System.out.println("Processing -> " + item);
        }
    }
}`;
  }

  generateCpp(prompt) {
    return `#include <iostream>
#include <vector>
#include <string>

using namespace std;

class TaskRunner {
private:
    string taskName;

public:
    TaskRunner(string name) : taskName(name) {}

    void execute() {
        cout << "Executing C++ Program for: " << taskName << endl;
        vector<int> data = {10, 20, 30, 40, 50};
        int sum = 0;
        for (int val : data) {
            sum += val;
        }
        cout << "Computed Sum: " << sum << endl;
    }
};

int main() {
    TaskRunner runner("${prompt}");
    runner.execute();
    return 0;
}`;
  }

  generateCSharp(prompt) {
    return `using System;
using System.Collections.Generic;

namespace HimoAutoCode
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("C# Solution for: ${prompt}");
            var items = new List<string> { "Module 1", "Module 2", "Module 3" };

            foreach (var item in items)
            {
                Console.WriteLine($"Running {item}...");
            }
        }
    }
}`;
  }

  generatePHP(prompt) {
    return `<?php
// PHP Script for: ${prompt}

header('Content-Type: application/json');

$response = [
    "status" => "success",
    "prompt" => "${prompt}",
    "timestamp" => date('Y-m-d H:i:s'),
    "data" => [
        ["id" => 1, "title" => "Sample A"],
        ["id" => 2, "title" => "Sample B"]
    ]
];

echo json_encode($response, JSON_PRETTY_PRINT);
?>`;
  }

  generateSQL(prompt) {
    return `-- SQL Database Schema and Queries for: ${prompt}
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert Sample Data
INSERT INTO users (username, email) VALUES
('john_doe', 'john@example.com'),
('jane_smith', 'jane@example.com');

-- Query
SELECT u.username, u.email, COUNT(r.id) AS total_records
FROM users u
LEFT JOIN records r ON u.id = r.user_id
GROUP BY u.id;`;
  }

  generateTypeScript(prompt) {
    return `// TypeScript Module for: ${prompt}
interface TaskPayload<T> {
  id: string;
  topic: string;
  data: T;
  timestamp: Date;
}

class AutoCodeSynthesizer<T> {
  private topic: string;

  constructor(topic: string) {
    this.topic = topic;
  }

  public process(data: T): TaskPayload<T> {
    return {
      id: Math.random().toString(36).substring(2, 9),
      topic: this.topic,
      data: data,
      timestamp: new Date()
    };
  }
}

// Example usage
const synthesizer = new AutoCodeSynthesizer<number[]>("${prompt}");
const result = synthesizer.process([1, 2, 3, 4, 5]);
console.log(result);`;
  }

  generateJSON(prompt) {
    return `{
  "name": "himo-auto-generated-code",
  "version": "1.0.0",
  "description": "Generated code manifest for: ${prompt}",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "keywords": ["himo", "code-generator", "ai"],
  "author": "Himo Code Engine",
  "license": "MIT"
}`;
  }

  generateCSS(prompt) {
    return `/* CSS Modern Stylesheet for: ${prompt} */
:root {
  --primary-color: #2563eb;
  --bg-color: #0f172a;
  --card-bg: #1e293b;
  --text-color: #f8fafc;
  --text-muted: #94a3b8;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.card {
  background-color: var(--card-bg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}`;
  }

  generateBash(prompt) {
    return `#!/bin/bash
# Shell Script for: ${prompt}

echo "=========================================="
echo "Himo Automated Shell Script Execution"
echo "Prompt: ${prompt}"
echo "=========================================="

# Check system info
echo "Current Date: $(date)"
echo "Current Directory: $(pwd)"
echo "User: $(whoami)"

echo "Task finished successfully."`;
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  toCamelCase(str) {
    return str.replace(/[^a-zA-Z0-9]/g, ' ').split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('');
  }
}
