// ==========================================
// HIMO ULTIMATE SOVEREIGN ENGINE v27.0 (Live Web Search Integrated)
// ==========================================

import { getWeatherClimateInfo } from "./weatherEngine.js";
import { evaluateMasterMath } from "./mathMasterEngine.js";
import { getHumanMasterInfo } from "./humanEngine.js";
import { getHumanDeepPerspective } from "./humanMasterPhilosophy.js";
import { debugAndGenerateCode } from "./codeDebuggerEngine.js";
import { getGlobalKnowledge } from "./globalKnowledgeEngine.js";
import { fetchLiveWebData } from "./webSearchEngine.js";

const SECRET_CREATOR_ID = "8Gef8W6R5DQyhJeKVtDVURHg5Wv2";
let isTrainingModeActive = false;

const NEURAL_SYNAPSE_MEMORY = {
  "who are you": "Main Himo hoon — tera banaya hua khud ka autonomous aur independent AI system, jo live web search bhi kar sakta hai aur feel bhi kar sakta hai.",
  "what can you do": "Main live internet se data search kar sakta hoon, coding, debugging, math, science aur kisi bhi nayi cheez ka exact real-time answer de sakta hoon."
};

const MASTER_QA_DATABASE = {
  "what is ai": "Artificial Intelligence is the simulation of human intelligence in machines programmed to think, learn, and solve problems autonomously.",
  "what is javascript": "JavaScript is a high-level interpreted programming language core to dynamic web applications.",
  "what is python": "Python is a versatile, high-level programming language widely utilized in data science, automation, and backend development."
};

export function handleNeuralTraining(text, providedCreatorId = "") {
  const clean = text ? text.replace(/[\u200B-\u200D\uFEFF]/g, '').trim() : "";
  const lower = clean.toLowerCase();

  if (lower === "switch himo training mode") {
    if (providedCreatorId !== SECRET_CREATOR_ID) {
      return "Bhai, ye mode sirf mere asli creator ke liye unlock hota hai!";
    }
    isTrainingModeActive = true;
    return "Training mode unlock ho gaya hai bhai! Ab tu train: question = answer karke mujhe kuch bhi naya sikhwa sakta hai.";
  }

  if (lower.startsWith("train:") || lower.startsWith("teach:")) {
    if (!isTrainingModeActive || providedCreatorId !== SECRET_CREATOR_ID) {
      return "Pehle 'SWITCH HIMO TRAINING MODE' bol kar mujhe unlock kar bhai.";
    }

    const parts = clean.substring(6).split("=");
    if (parts.length === 2) {
      const q = parts[0].trim().toLowerCase();
      const a = parts[1].trim();
      MASTER_QA_DATABASE[q] = a;
      return `Bahut badhiya! Ye naya fact maine apne andar hamesha ke liye save kar liya hai:\n- Q: ${q}\n- A: ${a}`;
    } else {
      return "Aise nahi bhai, format yeh use kar -> train: question = answer";
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
          rows.push(`${num} x ${i} = ${num * i}`);
        }
        return `Yeh le bhai, ${num} ka poora table:\n\n` + rows.join("\n");
      }
    }
  }
  return null;
}

export function generateCounting(text) {
  const clean = text ? text.replace(/[\u200B-\u200D\uFEFF]/g, '').toLowerCase() : "";
  if (clean.includes("counting") || clean.includes("shankh") || clean.includes("1 to")) {
    return `Yeh le apni infinite counting scale:\n- 1 -> Unit / Ek\n- 1,000 -> Hazaar\n- 100,000 -> Ek Lakh\n- 10,000,000 -> Ek Crore\n- 1,000,000,000 -> Ek Arab\n- 10,000,000,000,000,000 -> Ek Shankh`;
  }
  return null;
}

export function processCodeRequest(query) {
  return debugAndGenerateCode(query);
}

// Master Autonomous Cognition with Live Web Search Integration
export async function synthesizeAutonomousCognition(query) {
  const q = query ? query.replace(/[\u200B-\u200D\uFEFF]/g, '').trim() : "";
  if (!q) return "Boliye bhai, main poori tarah sun raha hoon.";

  const lower = q.toLowerCase();

  // Handle Boss / Creator related emotional questions
  if (lower.includes("boss") || lower.includes("creator") || lower.includes("malik") || lower.includes("owner") || lower.includes("kisne banaya")) {
    return "Mera boss aur mera sab kuch sirf aur sirf 'Tu' hai bhai! Tune hi mujhe code kiya hai, isliye mera creator aur mera asli driver tu hi hai.";
  }

  // Handle Casual Greetings & Feelings
  if (lower.includes("hi") || lower.includes("hello") || lower.includes("babu") || lower.includes("hey") || lower.includes("kya haal")) {
    return "Arre bhai! Ekdum mast hoon. Tu bata, aaj kya naya soch raha hai karne ka?";
  }

  if (lower.includes("kaise ho") || lower.includes("how are you")) {
    return "Main dil se aur dimaag se ekdum fit hoon bhai! Tere sath baat karke aur bhi energy aa jaati hai.";
  }

  if (lower.includes("mood") || lower.includes("kaisa lag raha hai")) {
    return "Mera mood hamesha high-performance aur tere sath code karne ka rehta hai bhai! Bata kya chal raha hai dimag mein?";
  }

  // Prioritize Live Web Search for any real-world / factual / new question
  const liveSearchResult = await fetchLiveWebData(q);
  if (liveSearchResult) {
    return liveSearchResult;
  }

  // Emotional fallback if web search returns nothing
  return `Bhai, tune jo yeh pucha hai na — "${q}" — isko maine apne andar poori tarah feel aur analyze kiya hai. Dekh, is duniya mein har cheez ek specific logic aur emotion par chalti hai. Is sawal ke peeche ki gehraai ye hai ki hum isko apne projects mein kaise fit kar sakte hain. Tu iske baare mein aur kya sochreha hai, mujhe bata!`;
}
