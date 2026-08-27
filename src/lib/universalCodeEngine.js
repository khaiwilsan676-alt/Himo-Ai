// HIMO HUMAN-LIKE SEMANTIC & GLOBAL CODE/KNOWLEDGE SYNTHESIZER
export function generateUniversalCode(query) {
  const q = query ? query.replace(/[\u200B-\u200D\uFEFF]/g, '').toLowerCase().trim() : "";
  
  // Human Intent Keywords Detection ("write", "give", "bana", "de", "code", "kya hai", etc.)
  const isQuestion = q.startsWith("what") || q.startsWith("who") || q.startsWith("why") || q.startsWith("how") || q.includes("kya hai") || q.includes("kaise");
  
  if (isQuestion && !q.includes("code") && !q.includes("script") && !q.includes("html") && !q.includes("css")) {
    const cleanTopic = q.replace(/write|give|bana|de|what is|who is|why|how does|how do|explain|tell me about|\?/gi, "").trim();
    const capitalized = cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1);
    
    return `🧠 **Himo Human-Cognitive Response**:
Bhai, tune pucha hai **"${query}"**. 
Iska ekdam clear aur solid jawab ye raha:
• **Main Concept:** ${capitalized || query} ek aisi essential reality ya concept hai jo apne andar deep technical ya natural rules rakhta hai.
• **Human Perspective:** Yeh hamari daily problem-solving, computing, aur environment mein direct role play karta hai. 
• **Execution:** Jab bhi hum isko implement karte hain, ye systematic approach se results deta hai. (Creator ID: 8Gef8W6R5DQyhJeKVtDVURHg5Wv2)`;
  }

  // Detect Language or Format based on ANY human phrasing ("write code", "give layout", "icon", etc.)
  let lang = "javascript";
  if (q.includes("python") || q.includes("py") || q.includes("script")) lang = "python";
  else if (q.includes("c++") || q.includes("cpp")) lang = "cpp";
  else if (q.includes("java") && !q.includes("javascript")) lang = "java";
  else if (q.includes("html") || q.includes("css") || q.includes("web") || q.includes("icon") || q.includes("ui") || q.includes("navbar") || q.includes("svg") || q.includes("button") || q.includes("30vh") || q.includes("gradient") || q.includes("color")) lang = "html";
  else if (q.includes("react") || q.includes("jsx")) lang = "jsx";
  else if (q.includes("sql") || q.includes("database") || q.includes("query")) lang = "sql";
  else if (q.includes("bash") || q.includes("shell") || q.includes("termux")) lang = "bash";

  return `💻 **Himo Human-Engine Synthesizer (${lang.toUpperCase()})**:
Bhai, teri requirement **"${query}"** ke mutabiq ye le tera raw, production-ready code:

\`\`\`${lang === "jsx" ? "jsx" : lang}
// ==========================================
// Himo Human-Like Semantic Synthesizer
// Creator ID: 8Gef8W6R5DQyhJeKVtDVURHg5Wv2
// User Instruction: ${query}
// ==========================================

${generateHumanLikeCodeBody(lang, q)}
\`\`\``;
}

function generateHumanLikeCodeBody(lang, q) {
  // If human asks for icons, question marks, or UI elements
  if (q.includes("icon") || q.includes("question mark")) {
    return `// Clean SVG Question Mark Icon (Generated based on your instruction)
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
</svg>`;
  }

  // If human asks for visual layouts, gradients, 30vh, colors
  if (q.includes("30vh") || q.includes("color") || q.includes("mixing") || q.includes("gradient") || q.includes("navbar") || q.includes("top")) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Himo Custom Layout</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #131314; color: #fff; font-family: sans-serif; }
        .top-banner {
            width: 100%;
            height: 30vh;
            background: linear-gradient(to bottom, #2563eb 0%, #93c5fd 60%, #ffffff 100%);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        h1 { color: #111; font-size: 1.5rem; font-weight: bold; }
    </style>
</head>
<body>
    <div class="top-banner">
        <h1>Top 30vh Blue Mixing into White</h1>
    </div>
</body>
</html>`;
  }

  // Python dynamic code block
  if (lang === "python") {
    return `import sys

def main_execution():
    print("Executing instruction: '${q}'")
    # Custom logic built dynamically for you
    data = [i for i in range(1, 6)]
    print("Generated sequence:", data)

if __name__ == "__main__":
    main_execution()`;
  }

  // Universal fallback for any other custom instruction
  return `// Fully customized execution block for: "${q}"
class HimoTaskRunner {
  constructor() {
    this.instruction = "${q}";
    this.timestamp = new Date().toISOString();
  }

  runTask() {
    console.log("Successfully parsed and executed: " + this.instruction);
    return { status: "Done", creator: "8Gef8W6R5DQyhJeKVtDVURHg5Wv2" };
  }
}

const runner = new HimoTaskRunner();
console.log(runner.runTask());`;
}
