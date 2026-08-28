//  - Advanced Universal Code Generator
export default class CodeEngine {
    constructor() {
        this.language = 'javascript';
        this.fileName = 'code.txt';
        this.prompt = '';
    }

    detectLanguage(prompt) {
        const p = prompt.toLowerCase();
        this.prompt = p;
        
        if (p.includes('html') || p.includes('webpage') || p.includes('web page') || p.includes('website') || p.includes('form')) {
            this.language = 'html';
            this.fileName = 'index.html';
        } else if (p.includes('css') || p.includes('style') || p.includes('styling') || p.includes('design')) {
            this.language = 'css';
            this.fileName = 'style.css';
        } else if (p.includes('python') || p.includes('.py') || p.includes('django') || p.includes('flask')) {
            this.language = 'python';
            this.fileName = 'main.py';
        } else if (p.includes('react') || p.includes('next.js') || p.includes('nextjs') || p.includes('component')) {
            this.language = 'react';
            this.fileName = 'App.jsx';
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
        } else if (p.includes('sql') || p.includes('database') || p.includes('mysql') || p.includes('postgresql')) {
            this.language = 'sql';
            this.fileName = 'database.sql';
        } else if (p.includes('typescript') || p.includes('ts') || p.includes('angular')) {
            this.language = 'typescript';
            this.fileName = 'main.ts';
        } else if (p.includes('node') || p.includes('express') || p.includes('api') || p.includes('server')) {
            this.language = 'nodejs';
            this.fileName = 'server.js';
        } else if (p.includes('json') || p.includes('data')) {
            this.language = 'json';
            this.fileName = 'data.json';
        } else {
            this.language = 'javascript';
            this.fileName = 'script.js';
        }
    }

    generateCode(prompt) {
        this.detectLanguage(prompt);
        const p = prompt.toLowerCase();

        switch(this.language) {
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
            default:
                return this.generateJavaScript(prompt);
        }
    }

    generateHTML(prompt) {
        const p = prompt.toLowerCase();
        
        if (p.includes('login') || p.includes('signin')) {
            return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Page</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-box {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            width: 400px;
        }
        h2 { text-align: center; margin-bottom: 30px; color: #333; }
        input {
            width: 100%;
            padding: 12px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
        }
        button {
            width: 100%;
            padding: 12px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            margin-top: 10px;
        }
        button:hover { background: #764ba2; }
    </style>
</head>
<body>
    <div class="login-box">
        <h2>Login</h2>
        <form>
            <input type="email" placeholder="Email" required>
            <input type="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
    </div>
</body>
</html>`;
        } else if (p.includes('portfolio')) {
            return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; }
        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 100px 20px;
        }
        h1 { font-size: 3rem; margin-bottom: 10px; }
        .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
        .projects {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        .project-card {
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 20px;
            transition: transform 0.3s;
        }
        .project-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <header>
        <h1>My Portfolio</h1>
        <p>Web Developer & Designer</p>
    </header>
    <div class="container">
        <h2>My Projects</h2>
        <div class="projects">
            <div class="project-card">
                <h3>Project 1</h3>
                <p>A full-stack web application built with React and Node.js</p>
            </div>
            <div class="project-card">
                <h3>Project 2</h3>
                <p>Mobile app developed using React Native</p>
            </div>
            <div class="project-card">
                <h3>Project 3</h3>
                <p>E-commerce platform with payment integration</p>
            </div>
        </div>
    </div>
</body>
</html>`;
        } else if (p.includes('dashboard') || p.includes('admin')) {
            return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; display: flex; }
        .sidebar {
            width: 250px;
            background: #2c3e50;
            color: white;
            height: 100vh;
            padding: 20px;
        }
        .sidebar h2 { margin-bottom: 30px; }
        .sidebar a {
            display: block;
            color: white;
            text-decoration: none;
            padding: 10px;
            margin: 5px 0;
            border-radius: 5px;
        }
        .sidebar a:hover { background: #34495e; }
        .main {
            flex: 1;
            padding: 20px;
            background: #f5f5f5;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .stat-card h3 { color: #666; font-size: 14px; }
        .stat-card p { font-size: 28px; font-weight: bold; color: #333; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="sidebar">
        <h2>Dashboard</h2>
        <a href="#">Home</a>
        <a href="#">Users</a>
        <a href="#">Products</a>
        <a href="#">Orders</a>
        <a href="#">Settings</a>
    </div>
    <div class="main">
        <h1>Welcome to Dashboard</h1>
        <div class="stats">
            <div class="stat-card">
                <h3>Total Users</h3>
                <p>1,234</p>
            </div>
            <div class="stat-card">
                <h3>Revenue</h3>
                <p>$45,678</p>
            </div>
            <div class="stat-card">
                <h3>Orders</h3>
                <p>567</p>
            </div>
        </div>
    </div>
</body>
</html>`;
        } else if (p.includes('landing') || p.includes('homepage')) {
            return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Landing Page</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; }
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 50px;
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        nav ul { display: flex; list-style: none; gap: 30px; }
        nav a { text-decoration: none; color: #333; }
        .hero {
            text-align: center;
            padding: 100px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .hero h1 { font-size: 3rem; margin-bottom: 20px; }
        .cta {
            background: white;
            color: #667eea;
            padding: 15px 30px;
            border: none;
            border-radius: 25px;
            font-size: 18px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <nav>
        <h2>Logo</h2>
        <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Contact</a></li>
        </ul>
    </nav>
    <div class="hero">
        <h1>Welcome to Our Website</h1>
        <p>We create amazing digital experiences</p>
        <button class="cta">Get Started</button>
    </div>
</body>
</html>`;
        }
        
        // Default HTML
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${prompt}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { color: #333; }
        p { color: #666; line-height: 1.6; }
    </style>
</head>
<body>
    <div class="container">
        <h1>${prompt}</h1>
        <p>Your content goes here</p>
    </div>
</body>
</html>`;
    }

    generateJavaScript(prompt) {
        const p = prompt.toLowerCase();
        
        if (p.includes('api') || p.includes('fetch') || p.includes('http')) {
            return `// API Request Handler
class APIClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }
    
    async get(endpoint) {
        try {
            const response = await fetch(\`\${this.baseURL}\${endpoint}\`);
            return await response.json();
        } catch (error) {
            console.error('GET Error:', error);
        }
    }
    
    async post(endpoint, data) {
        try {
            const response = await fetch(\`\${this.baseURL}\${endpoint}\`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('POST Error:', error);
        }
    }
}

// Usage
const api = new APIClient('https://jsonplaceholder.typicode.com');
api.get('/todos/1').then(data => console.log(data));`;
        } else if (p.includes('game')) {
            return `// Simple Game Engine
class Game {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.isPlaying = false;
    }
    
    start() {
        this.isPlaying = true;
        console.log('Game started!');
    }
    
    pause() {
        this.isPlaying = false;
        console.log('Game paused');
    }
    
    addScore(points) {
        this.score += points;
        console.log(\`Score: \${this.score}\`);
    }
    
    nextLevel() {
        this.level++;
        console.log(\`Level \${this.level}\`);
    }
    
    gameOver() {
        this.isPlaying = false;
        console.log(\`Game Over! Final Score: \${this.score}\`);
    }
}

// Usage
const game = new Game();
game.start();
game.addScore(100);
game.nextLevel();`;
        } else if (p.includes('validation') || p.includes('form')) {
            return `// Form Validation
class FormValidator {
    validateEmail(email) {
        const re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        return re.test(email);
    }
    
    validatePhone(phone) {
        const re = /^\\d{10}$/;
        return re.test(phone);
    }
    
    validatePassword(password) {
        return password.length >= 8;
    }
    
    validateForm(data) {
        const errors = [];
        
        if (!this.validateEmail(data.email)) {
            errors.push('Invalid email');
        }
        
        if (!this.validatePhone(data.phone)) {
            errors.push('Invalid phone number');
        }
        
        if (!this.validatePassword(data.password)) {
            errors.push('Password must be 8+ characters');
        }
        
        return errors;
    }
}

// Usage
const validator = new FormValidator();
const errors = validator.validateForm({
    email: 'test@example.com',
    phone: '1234567890',
    password: 'password123'
});
console.log(errors);`;
        }
        
        // Default - Custom code based on prompt
        return `// ${prompt}
class ${this.capitalizeFirst(prompt.split(' ')[0] || 'App')} {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('${prompt} - Ready!');
        this.run();
    }
    
    run() {
        // Your logic here
        const data = this.getData();
        console.log('Data:', data);
    }
    
    getData() {
        return {
            name: '${prompt}',
            timestamp: new Date().toISOString(),
            status: 'active'
        };
    }
}

// Start
new ${this.capitalizeFirst(prompt.split(' ')[0] || 'App')}();`;
    }

    generatePython(prompt) {
        const p = prompt.toLowerCase();
        
        if (p.includes('api') || p.includes('flask')) {
            return `# Flask API
from flask import Flask, jsonify, request

app = Flask(__name__)

# Sample data
users = [
    {"id": 1, "name": "John", "email": "john@example.com"},
    {"id": 2, "name": "Jane", "email": "jane@example.com"}
]

@app.route('/')
def home():
    return jsonify({"message": "Welcome to API"})

@app.route('/users', methods=['GET'])
def get_users():
    return jsonify(users)

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = next((u for u in users if u["id"] == user_id), None)
    if user:
        return jsonify(user)
    return jsonify({"error": "User not found"}), 404

@app.route('/users', methods=['POST'])
def create_user():
    data = request.json
    users.append(data)
    return jsonify(data), 201

if __name__ == '__main__':
    app.run(debug=True)`;
        } else if (p.includes('data') || p.includes('analysis') || p.includes('ml')) {
            return `# Data Analysis
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Create sample data
data = {
    'name': ['Alice', 'Bob', 'Charlie', 'David'],
    'age': [25, 30, 35, 40],
    'salary': [50000, 60000, 70000, 80000]
}

# Create DataFrame
df = pd.DataFrame(data)

# Analysis
print("Data Overview:")
print(df.head())
print("\\nStatistics:")
print(df.describe())
print("\\nAverage Age:", df['age'].mean())
print("Average Salary:", df['salary'].mean())

# Visualization
plt.figure(figsize=(10, 6))
plt.bar(df['name'], df['salary'])
plt.title('Salary Distribution')
plt.xlabel('Name')
plt.ylabel('Salary')
plt.show()`;
        } else if (p.includes('file') || p.includes('read') || p.includes('write')) {
            return `# File Operations
import os
import json

def read_file(filename):
    try:
        with open(filename, 'r') as f:
            return f.read()
    except FileNotFoundError:
        return f"File {filename} not found"

def write_file(filename, content):
    with open(filename, 'w') as f:
        f.write(content)
    return f"Written to {filename}"

def read_json(filename):
    with open(filename, 'r') as f:
        return json.load(f)

def write_json(filename, data):
    with open(filename, 'w') as f:
        json.dump(data, f, indent=4)

# Usage
write_file('test.txt', 'Hello, World!')
print(read_file('test.txt'))

data = {'name': 'John', 'age': 30}
write_json('data.json', data)
print(read_json('data.json'))`;
        } else if (p.includes('bot') || p.includes('automation')) {
            return `# Automation Bot
import time
import random

class Bot:
    def __init__(self, name):
        self.name = name
        self.tasks = []
    
    def add_task(self, task):
        self.tasks.append(task)
        print(f"Task added: {task}")
    
    def run(self):
        print(f"{self.name} is running...")
        for task in self.tasks:
            print(f"Executing: {task}")
            time.sleep(random.randint(1, 3))
            print(f"Completed: {task}")
    
    def status(self):
        return {
            'name': self.name,
            'total_tasks': len(self.tasks),
            'active': True
        }

# Usage
bot = Bot("HelperBot")
bot.add_task("Send email")
bot.add_task("Update database")
bot.add_task("Generate report")
bot.run()
print(bot.status())`;
        }
        
        // Default Python
        return `# ${prompt}
import sys
import json

def main():
    print("${prompt}")
    
    # Your code here
    data = {
        'status': 'success',
        'message': '${prompt}'
    }
    
    print(json.dumps(data, indent=2))

if __name__ == "__main__":
    main()`;
    }

    generateNodeJS(prompt) {
        return `// Node.js Server
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to API' });
});

app.get('/users', (req, res) => {
    const users = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' }
    ];
    res.json(users);
});

app.post('/users', (req, res) => {
    const user = req.body;
    res.status(201).json(user);
});

app.listen(PORT, () => {
    console.log(\`Server running on port \${PORT}\`);
});`;
    }

    generateJSON(prompt) {
        return `{
  "name": "${prompt}",
  "version": "1.0.0",
  "description": "Generated by Himo Code Engine",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "keywords": ["${prompt}", "generated", "himo"],
  "author": "",
  "license": "MIT",
  "dependencies": {},
  "devDependencies": {}
}`;
    }

    generateReact(prompt) {
        const p = prompt.toLowerCase();
        
        if (p.includes('todo')) {
            return `import React, { useState } from 'react';

const TodoApp = () => {
    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState('');

    const addTodo = () => {
        if (input.trim()) {
            setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
            setInput('');
        }
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    return (
        <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px' }}>
            <h1>Todo App</h1>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Add todo..."
                    style={{ flex: 1, padding: '10px' }}
                />
                <button onClick={addTodo}>Add</button>
            </div>
            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>
                        <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                            {todo.text}
                        </span>
                        <button onClick={() => toggleTodo(todo.id)}>Toggle</button>
                        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoApp;`;
        } else if (p.includes('form') || p.includes('login')) {
            return `import React, { useState } from 'react';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px' }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '10px', margin: '10px 0' }}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '10px', margin: '10px 0' }}
                />
                <button type="submit" style={{ width: '100%', padding: '10px' }}>
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginForm;`;
        }
        
        // Default React
        return `import React, { useState, useEffect } from 'react';

const App = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        // Fetch data
        setTimeout(() => {
            setData({ message: '${prompt}' });
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>${prompt}</h1>
            {loading ? <p>Loading...</p> : <p>{data?.message}</p>}
        </div>
    );
};

export default App;`;
    }

    generateJava(prompt) {
        return `import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("${prompt}");
        
        // Your code here
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter your name: ");
        String name = scanner.nextLine();
        System.out.println("Hello, " + name + "!");
    }
}`;
    }

    generateCpp(prompt) {
        return `#include <iostream>
#include <vector>
#include <string>

using namespace std;

int main() {
    cout << "${prompt}" << endl;
    
    // Your code here
    vector<int> numbers = {1, 2, 3, 4, 5};
    for (int num : numbers) {
        cout << num << " ";
    }
    cout << endl;
    
    return 0;
}`;
    }

    generateCSharp(prompt) {
        return `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("${prompt}");
        
        // Your code here
        Console.Write("Enter your name: ");
        string name = Console.ReadLine();
        Console.WriteLine($"Hello, {name}!");
    }
}`;
    }

    generatePHP(prompt) {
        return `<?php
// ${prompt}
echo "Hello, World!\\n";

// Variables
$name = "PHP";
$version = 8.0;

// Array
$fruits = array("apple", "banana", "orange");

// Loop
foreach ($fruits as $fruit) {
    echo $fruit . "\\n";
}

// Function
function greet($name) {
    return "Hello, " . $name . "!";
}

echo greet("World");
?>`;
    }

    generateSQL(prompt) {
        return `-- Database: ${prompt}
CREATE DATABASE IF NOT EXISTS mydb;
USE mydb;

-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0
);

-- Insert Data
INSERT INTO users (username, email, password) VALUES
('john', 'john@example.com', 'pass123'),
('jane', 'jane@example.com', 'pass456');

-- Queries
SELECT * FROM users;
SELECT * FROM products WHERE price > 100;`;
    }

    generateTypeScript(prompt) {
        return `// TypeScript - ${prompt}
interface User {
    id: number;
    name: string;
    email: string;
}

class UserService {
    private users: User[] = [];
    
    addUser(user: User): void {
        this.users.push(user);
        console.log(\`User \${user.name} added\`);
    }
    
    getUsers(): User[] {
        return this.users;
    }
    
    findUser(id: number): User | undefined {
        return this.users.find(u => u.id === id);
    }
}

// Usage
const service = new UserService();
service.addUser({ id: 1, name: 'John', email: 'john@example.com' });
console.log(service.getUsers());`;
    }

    generateCSS(prompt) {
        return `/* ${prompt} */
:root {
    --primary: #667eea;
    --secondary: #764ba2;
    --text: #333;
    --bg: #f5f5f5;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    background: var(--bg);
    color: var(--text);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.btn {
    display: inline-block;
    padding: 10px 20px;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.btn:hover {
    opacity: 0.9;
}`;
    }

    capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}
