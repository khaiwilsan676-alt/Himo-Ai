const readline = require('readline');

// Advanced Math Engine
function evaluateAdvancedMath(text) {
  if (!text) return null;
  let clean = text.toLowerCase()
    .replace(/[“”"']/g, '')
    .replace(/what is|calculate|solve|\?|=|kya hoga|batao|ans|answer/g, "")
    .trim();

  const percentMatch = clean.match(/(\d+(?:\.\d+)?)\s*%\s*(?:of|\*)\s*(\d+(?:\.\d+)?)/);
  if (percentMatch) {
    const p = parseFloat(percentMatch[1]);
    const total = parseFloat(percentMatch[2]);
    const ans = (p / 100) * total;
    return `Calculation Result: ${ans} (${p}% of ${total})`;
  }

  if (clean.includes("sqrt") || clean.includes("root")) {
    const numMatch = clean.match(/[\d.]+/);
    if (numMatch) {
      const val = parseFloat(numMatch[0]);
      const ans = Math.sqrt(val);
      return `Square Root Result: √${val} = ${ans}`;
    }
  }

  let processed = clean
    .replace(/÷/g, "/")
    .replace(/×/g, "*")
    .replace(/x/g, "*")
    .replace(/pi/g, Math.PI.toString())
    .replace(/divided by/g, "/")
    .replace(/upon/g, "/");

  processed = processed.replace(/[^0-9+\-*/().\s%MathPI]/g, "").trim();

  if (processed && /[+\-*/%]/.test(processed)) {
    try {
      const sanitized = processed.replace(/(\d+(?:\.\d+)?)%/g, "($1*0.01)");
      const res = Function(`'use strict'; return (${sanitized})`)();
      if (typeof res === "number" && !isNaN(res)) {
        return `Calculation Result: ${res}`;
      }
    } catch (e) {
      return null;
    }
  }
  return null;
}

const ADVANCED_KNOWLEDGE = {
  "photosynthesis": "Photosynthesis: Plants convert light energy into chemical energy. Equation: 6CO2 + 6H2O + light -> C6H12O6 + 6O2.",
  "gravity": "Gravity: A fundamental physical force by which all things with mass are brought toward one another.",
  "javascript": "JavaScript: A high-level, interpreted programming language powering dynamic web applications and Node.js servers.",
  "react": "React: A declarative, efficient JavaScript library for building user interfaces with component-based architecture.",
  "firebase": "Firebase: Google's mobile and web development platform featuring Firestore NoSQL databases and Authentication suites.",
  "quantum mechanics": "Quantum Mechanics: A fundamental theory in physics providing a description of physical properties at the scale of atoms and subatomic particles.",
  "artificial intelligence": "Artificial Intelligence: Intelligence demonstrated by machines, involving machine learning, NLP, and autonomous cognitive reasoning."
};

function processHimoBrain(userInput) {
  let clean = userInput.trim();
  let lower = clean.toLowerCase();

  // 1. Math Check
  const mathResult = evaluateAdvancedMath(clean);
  if (mathResult) return mathResult;

  // 2. Knowledge Database Check
  for (const [key, val] of Object.entries(ADVANCED_KNOWLEDGE)) {
    if (lower.includes(key)) {
      return val;
    }
  }

  // 3. Code Synthesizer
  if (lower.includes("code") || lower.includes("write a function") || lower.includes("program")) {
    return `[Himo Code Synthesizer]\nfunction himoExecuteTask() {\n  console.log("Executing query: ${userInput}");\n  return "Execution Successful!";\n}\nhimoExecuteTask();`;
  }

  // 4. General Analysis
  if (lower.includes("what is") || lower.includes("who is") || lower.includes("explain") || lower.includes("tell me about")) {
    const topic = userInput.replace(/what is|who is|explain|tell me about|\?/gi, "").trim();
    return `[Himo Cognitive Analysis]\n${topic} is a core structural concept involving multi-disciplinary principles, system integration, and functional mechanics.`;
  }

  return `[Himo Native Analysis]\nRegarding "${clean}", our internal cognitive engine processes this as a conceptual inquiry. Ask math calculations, science topics (like gravity or photosynthesis), or coding questions!`;
}

// Setup Interactive Terminal Prompt
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("=========================================");
console.log("🤖 HIMO AI TERMINAL REASONING ENGINE v13.0");
console.log("Type any question, math problem, or code request.");
console.log("Type 'exit' to quit.");
console.log("=========================================\n");

const askQuestion = () => {
  rl.question('You: ', (input) => {
    if (input.trim().toLowerCase() === 'exit') {
      console.log('Himo: Bye! Session closed.');
      rl.close();
      return;
    }
    const response = processHimoBrain(input);
    console.log(`\nHimo: ${response}\n`);
    askQuestion();
  });
};

askQuestion();
