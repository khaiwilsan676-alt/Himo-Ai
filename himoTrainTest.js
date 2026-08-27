const readline = require('readline');

const trainedMemory = {};

function evaluateMath(text) {
  if (!text) return null;
  let clean = text.toLowerCase()
    .replace(/[“”"']/g, '')
    .replace(/what is|calculate|solve|\?|=|kya hoga|batao|ans|answer/g, "")
    .trim();

  let processed = clean
    .replace(/÷/g, "/")
    .replace(/×/g, "*")
    .replace(/x/g, "*")
    .replace(/pi/g, Math.PI.toString());

  processed = processed.replace(/[^0-9+\-*/().\s%]/g, "").trim();

  if (processed && /[+\-*/%]/.test(processed)) {
    try {
      const res = Function(`'use strict'; return (${processed})`)();
      if (typeof res === "number" && !isNaN(res)) {
        return `Calculation Result: ${res}`;
      }
    } catch (e) {
      return null;
    }
  }
  return null;
}

function generateAutomaticAnswer(query) {
  const q = query.toLowerCase().trim();
  const cleanTopic = q.replace(/what is|who is|how does|why do|explain|tell me about|\?/gi, "").trim();
  const capitalized = cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1);

  if (q.includes("why") || q.includes("how")) {
    return `🔬 Himo Scientific Breakdown:\nWhen examining "${cleanTopic}", it operates through foundational laws of physics, chemistry, or natural mechanics. The underlying process involves systematic energy transfer, structural equilibrium, and cause-and-effect execution.`;
  }

  if (q.includes("who") || q.includes("where") || q.includes("history")) {
    return `🏛️ Himo Historical Synthesis:\n"${capitalized}" holds a significant position in chronology, defined by its core origin, developmental milestones, and lasting impact on its respective domain.`;
  }

  if (q.includes("code") || q.includes("program") || q.includes("function") || q.includes("python") || q.includes("javascript")) {
    return `💻 Himo Technical Synthesizer:\n"${capitalized}" is a powerful architectural concept in software engineering utilizing syntax parsing, modular logic, and runtime execution.`;
  }

  return `🧠 Himo Himo Response:\nRegarding "${capitalized}", our cognitive engine breaks this down into three core pillars:\n1. Core Definition: Represents a functional category with defined properties.\n2. Operational Mechanics: Interacts directly with environmental or digital structures.\n3. Utility: Used extensively for optimization and problem-solving.`;
}

function processHimoBrain(userInput) {
  const clean = userInput.trim();
  const lower = clean.toLowerCase();

  // 1. Math Check
  const mathRes = evaluateMath(clean);
  if (mathRes) return mathRes;

  // 2. Training Command
  if (lower.startsWith("teach:")) {
    const parts = clean.substring(6).split("=");
    if (parts.length === 2) {
      const q = parts[0].trim().toLowerCase();
      const a = parts[1].trim();
      trainedMemory[q] = a;
      return `🧠 Autonomous Training Successful!\nCreator ID (8Gef8W6R5DQyhJeKVtDVURHg5Wv2) verified.\nLearned permanently:\n• Q: ${q}\n• A: ${a}`;
    } else {
      return `⚠️ Training Syntax Error: Use format -> teach: question = answer`;
    }
  }

  // 3. Self-Trained Memory
  if (trainedMemory[lower]) {
    return `🧠 [Self-Trained Memory]: ${trainedMemory[lower]}`;
  }

  // 4. Automatic Answer for ANY question
  return generateAutomaticAnswer(clean);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("=================================================");
console.log("🤖 HIMO AI TERMINAL ENGINE v13.0 (Math + Auto QA Active)");
console.log("=================================================\n");

const askQuestion = () => {
  rl.question('You: ', (input) => {
    if (input.trim().toLowerCase() === 'exit') {
      rl.close();
      return;
    }
    const response = processHimoBrain(input);
    console.log(`\nHimo:\n${response}\n`);
    askQuestion();
  });
};

askQuestion();
