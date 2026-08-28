export function generateCodeFromPrompt(prompt) {
  if (!prompt || typeof prompt !== "string") return null;
  const q = prompt.trim().toLowerCase();

  const codeTriggers = [
    "code", "program", "script", "function", "component", "html", "css", 
    "javascript", "js", "react", "nextjs", "python", "node", "api", 
    "button", "form", "login page", "navbar", "card", "fetch", "game", 
    "sql", "java", "c++", "cpp", "c#", "dart", "flutter", "draw", "turtle"
  ];

  const hasIntent = codeTriggers.some(t => q.includes(t));
  if (!hasIntent) return null;

  // 1. Python Question Mark / Drawing / Turtle / CLI Icon
  if (q.includes("python") && (q.includes("question") || q.includes("icon") || q.includes("mark") || q.includes("draw"))) {
    return `\`\`\`python
# Draw Question Mark using Python Turtle
import turtle

def draw_question_mark():
    t = turtle.Turtle()
    t.pensize(5)
    t.speed(3)
    t.color("#2563eb")

    # Arc for question mark
    t.penup()
    t.goto(0, 50)
    t.pendown()
    t.setheading(90)
    t.circle(-30, 180)
    t.forward(20)
    t.circle(-20, 90)
    t.forward(20)

    # Dot
    t.penup()
    t.forward(15)
    t.pendown()
    t.dot(8, "#2563eb")

    t.hideturtle()
    turtle.done()

if __name__ == "__main__":
    draw_question_mark()
\`\`\``;
  }

  // 2. Python Generic / Custom Script
  if (q.includes("python") || q.includes("py")) {
    return `\`\`\`python
# Python Script
def main():
    query = "${prompt.replace(/"/g, '\\"')}"
    print(f"Executing: {query}")
    
    # Core Logic
    data = [i for i in range(1, 11)]
    result = {"status": "success", "data": data}
    print("Output:", result)

if __name__ == "__main__":
    main()
\`\`\``;
  }

  // 3. Java Program
  if (q.includes("java")) {
    return `\`\`\`java
public class Main {
    public static void main(String[] args) {
        System.out.println("Himo Omni - Java Execution Ready!");
        
        // Solution implementation
        int[] numbers = {10, 20, 30, 40, 50};
        for (int num : numbers) {
            System.out.println("Processing: " + num);
        }
    }
}
\`\`\``;
  }

  // 4. React / Next.js Navbar or Component
  if (q.includes("react") || q.includes("navbar") || q.includes("next")) {
    return `\`\`\`jsx
import React, { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white shadow-md">
      <div className="text-xl font-bold">Himo</div>
      <div className="hidden md:flex gap-6 text-sm">
        <a href="#home" className="hover:text-blue-400">Home</a>
        <a href="#about" className="hover:text-blue-400">About</a>
        <a href="#contact" className="hover:text-blue-400">Contact</a>
      </div>
      <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">☰</button>
    </nav>
  );
}
\`\`\``;
  }

  // 5. HTML / CSS Login Page
  if (q.includes("login") || q.includes("form") || q.includes("html")) {
    return `\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Login</title>
  <style>
    body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0f172a; font-family: sans-serif; }
    .card { background: #1e293b; padding: 30px; border-radius: 12px; width: 320px; color: #fff; box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
    input { width: 100%; padding: 12px; margin: 8px 0 16px; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: #fff; box-sizing: border-box; }
    button { width: 100%; padding: 12px; background: #2563eb; color: #fff; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
    button:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Sign In</h2>
    <form>
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </div>
</body>
</html>
\`\`\``;
  }

  // 6. Generic Clean Code Solution
  return `\`\`\`javascript
// Solution for: ${prompt}

function executeTask() {
  const payload = {
    message: "Task completed successfully",
    timestamp: new Date().toISOString()
  };
  return payload;
}

console.log(executeTask());
\`\`\``;
}
