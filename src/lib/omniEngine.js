// ==========================================
// HIMO ULTIMATE SECURE OMNI ENGINE v22.0 (Fixed ESM Extensions)
// ==========================================

import { getWeatherClimateInfo } from "./weatherEngine.js";
import { evaluateMasterMath } from "./mathMasterEngine.js";
import { getHumanMasterInfo } from "./humanEngine.js";
import { getHumanDeepPerspective } from "./humanMasterPhilosophy.js";
import { debugAndGenerateCode } from "./codeDebuggerEngine.js";
import { getGlobalKnowledge } from "./globalKnowledgeEngine.js";

const SECRET_CREATOR_ID = "8Gef8W6R5DQyhJeKVtDVURHg5Wv2";
let isTrainingModeActive = false;

const NEURAL_SYNAPSE_MEMORY = {
  "who are you": "Main Himo AI hoon — aapka 100% self-built, independent, neural-trained cognitive intelligence!",
  "what can you do": "Main A to Z Global Knowledge, Physics, Space, Computer Science, Code Generation & Debugging, Human Philosophy/Biology, Math, Accounting, Weather sab kuch kar sakta hoon."
};

const MASTER_QA_DATABASE = {
  "what is ai": "Artificial Intelligence (AI) is intelligence demonstrated by machines, involving machine learning, natural language processing, and neural networks.",
  "what is javascript": "JavaScript is a high-level, interpreted programming language conforming to the ECMAScript specification, primarily used for dynamic web applications.",
  "what is python": "Python is a high-level, interpreted programming language known for its clear syntax and dynamic typing, widely used in AI, data science, and web backend.",
  "what is photosynthesis": "Photosynthesis is the process used by plants to convert light energy into chemical energy, summarized by the equation: 6CO2 + 6H2O + light -> C6H12O6 + 6O2.",
  "what is gravity": "Gravity is a fundamental physical force by which all things with mass are brought toward one another, described by Newton's Law of Universal Gravitation.",
  "who is albert einstein": "Albert Einstein was a German-born theoretical physicist widely acknowledged to be one of the greatest physicists of all time, famous for his theory of relativity (E=mc^2)."
};

export function handleNeuralTraining(text, providedCreatorId = "") {
  const clean = text ? text.replace(/[\u200B-\u200D\uFEFF]/g, '').trim() : "";
  const lower = clean.toLowerCase();

  if (lower === "switch himo training mode") {
    if (providedCreatorId !== SECRET_CREATOR_ID) {
      return `⛔ **Access Denied:** Unauthorized switch attempt! Creator credentials required.`;
    }
    isTrainingModeActive = true;
    return `🔓 **SUCCESS:** Himo Training Mode is now **ACTIVE**. You can use \`train: question = answer\` to teach me!`;
  }

  if (lower.startsWith("train:") || lower.startsWith("teach:")) {
    if (!isTrainingModeActive || providedCreatorId !== SECRET_CREATOR_ID) {
      return `🔒 **Training Locked:** Training mode is inactive. Say \`SWITCH HIMO TRAINING MODE\` first.`;
    }

    const parts = clean.substring(6).split("=");
    if (parts.length === 2) {
      const q = parts[0].trim().toLowerCase();
      const a = parts[1].trim();
      MASTER_QA_DATABASE[q] = a;
      return `🧠 **Secure Neural Training Successful!**\nNew synaptic pathway formed permanently:\n• **Q:** ${q}\n• **A:** ${a}`;
    } else {
      return `⚠️ **Format Error:** Use -> \`train: question = answer\``;
    }
  }

  if (MASTER_QA_DATABASE[lower]) return MASTER_QA_DATABASE[lower];
  if (NEURAL_SYNAPSE_MEMORY[lower]) return NEURAL_SYNAPSE_MEMORY[lower];
  return null;
}

export function generateTable(text) {
  const clean = text ? text.replace(/[\u200B-\u200D\uFEFF]/g, '').toLowerCase() : "";
  if (clean.includes("table") || clean.includes("pahada")) {
    const match = clean.match(/\b(1?\d{1,3}|[2-9]\d{1,3})\b/);
    if (match) {
      const num = parseInt(match[0], 10);
      if (num >= 2 && num <= 1999) {
        let rows = [];
        for (let i = 1; i <= 10; i++) {
          rows.push(`${num} × ${i} = ${num * i}`);
        }
        return `📊 **Multiplication Table of ${num} (2 to 1999 Master Engine):**\n\n` + rows.join("\n");
      }
    }
  }
  return null;
}

export function generateCounting(text) {
  const clean = text ? text.replace(/[\u200B-\u200D\uFEFF]/g, '').toLowerCase() : "";
  if (clean.includes("counting") || clean.includes("shankh") || clean.includes("1 to")) {
    return `🌌 **INFINITE NUMBER SCALE SYSTEM (1 to 10^17 / 10 Shankh):**
• 1 (10^0) -> One | इकाई
• 1,000 (10^3) -> One Thousand | हज़ार
• 100,000 (10^5) -> Hundred Thousand | एक लाख (1 Lakh)
• 10,000,000 (10^7) -> Ten Million | एक करोड़ (1 Crore)
• 1,000,000,000 (10^9) -> One Billion | एक अरब (1 Arab)
• 1,000,000,000,000 (10^12) -> One Trillion | दस खरब (10 Kharab)
• 10,000,000,000,000,000 (10^16) -> Ten Quadrillion | दस पद्म / 1 शंख (1 Shankh)`;
  }
  return null;
}

export function processCodeRequest(query) {
  return debugAndGenerateCode(query);
}
