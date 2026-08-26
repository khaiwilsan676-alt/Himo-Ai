const readline = require('readline');

const MASTER_USER = "gagandeep";
let currentUser = "gagandeep";
let isMultiLineMode = false;
let multiLineBuffer = [];

// ====================================================
// 1. NATIVE KNOWLEDGE GRAPH & SYNAPSE STORE
// ====================================================
let memoryStore = {
  facts: {
    preference: "Next.js, Full-stack UI engineering, Dark mode interfaces & AI architecture",
    version: "v13.0 Pure Native Self-Trained Engine",
  },
  relations: [
    { subject: "nextjs", relation: "is built on", object: "react" },
    { subject: "react", relation: "is a UI library for", object: "javascript" },
    { subject: "javascript", relation: "is the foundation of", object: "web development" },
    { subject: "nextjs", relation: "supports", object: "server side rendering and static site generation" },
    { subject: "nextjs", relation: "uses", object: "typescript" },
    { subject: "supabase", relation: "provides postgres database and", object: "auth" },
    { subject: "capacitor", relation: "wraps web applications into", object: "native android and ios apps" },
    { subject: "tailwind css", relation: "is a utility-first framework for", object: "modern UI styling" },
    { subject: "himo", relation: "is created by", object: "gagandeep" }
  ],
  qaMemory: {
    "who are you": "Main Himo AI hoon — aapka 100% self-built, independent, personalized cognitive intelligence!",
    "who made you": "Main ek autonomous private AI engine hoon. Creator details classified hain.",
    "hello himo": "Yo! Himo Native Neural Engine online hai. Aaj kya create ya debug karna hai?",
    "what can you do": "Main 100% offline reasoning karta hoon, large code generate karta hoon, bugs fix karta hoon, infinite counting decode karta hoon aur real-time facts learn karta hoon.",
    "kaise ho": "Ekdum solid bhai! Fully independent aur full-speed par running hoon.",
    "kya haal hai": "Sab badhiya! Native core operational hai.",
  },
  lastSubject: null,
};

// ====================================================
// 2. FOUNDATIONAL DATA VAULT (A-Z, Colors, Fruits, etc.)
// ====================================================
const ENCYCLOPEDIA = {
  alphabets: [
    { letter: "A", word: "Apple", hindi: "सेब", phonetic: "ए फॉर एप्पल" },
    { letter: "B", word: "Ball", hindi: "गेंद", phonetic: "बी फॉर बॉल" },
    { letter: "C", word: "Cat", hindi: "बिल्ली", phonetic: "सी फॉर कैट" },
    { letter: "D", word: "Dog", hindi: "कुत्ता", phonetic: "डी फॉर डॉग" },
    { letter: "E", word: "Elephant", hindi: "हाथी", phonetic: "ई फॉर एलीफेंट" },
    { letter: "F", word: "Fish", hindi: "मछली", phonetic: "एफ फॉर फिश" },
    { letter: "G", word: "Grapes", hindi: "अंगूर", phonetic: "जी फॉर ग्रेप्स" },
    { letter: "H", word: "Horse", hindi: "घोड़ा", phonetic: "एच फॉर हॉर्स" },
    { letter: "I", word: "Ice Cream", hindi: "आइसक्रीम", phonetic: "आई फॉर आइसक्रीम" },
    { letter: "J", word: "Jug", hindi: "जग", phonetic: "जे फॉर जग" },
    { letter: "K", word: "Kite", hindi: "पतंग", phonetic: "के फॉर काइट" },
    { letter: "L", word: "Lion", hindi: "शेर", phonetic: "एल फॉर लायन" },
    { letter: "M", word: "Mango", hindi: "आम", phonetic: "एम फॉर मैंगो" },
    { letter: "N", word: "Nest", hindi: "घोंसला", phonetic: "एन फॉर नेस्ट" },
    { letter: "O", word: "Orange", hindi: "संतरा", phonetic: "ओ फॉर ऑरेंज" },
    { letter: "P", word: "Parrot", hindi: "तोता", phonetic: "पी फॉर पैरट" },
    { letter: "Q", word: "Queen", hindi: "रानी", phonetic: "क्यू फॉर क्वीन" },
    { letter: "R", word: "Rose", hindi: "गुलाब", phonetic: "आर फॉर रोज़" },
    { letter: "S", word: "Sun", hindi: "सूरज", phonetic: "एस फॉर सन" },
    { letter: "T", word: "Tiger", hindi: "बाघ", phonetic: "टी फॉर टाइगर" },
    { letter: "U", word: "Umbrella", hindi: "छाता", phonetic: "यू फॉर अम्ब्रेला" },
    { letter: "V", word: "Van", hindi: "वैन", phonetic: "वी फॉर वैन" },
    { letter: "W", word: "Watch", hindi: "घड़ी", phonetic: "डब्ल्यू फॉर वॉच" },
    { letter: "X", word: "Xylophone", hindi: "जाइलोफ़ोन", phonetic: "एक्स फॉर जाइलोफ़ोन" },
    { letter: "Y", word: "Yak", hindi: "याक", phonetic: "वाई फॉर याक" },
    { letter: "Z", word: "Zebra", hindi: "ज़ेबरा", phonetic: "ज़ेड फॉर ज़ेबरा" }
  ],
  fruits: [
    { en: "Apple", hi: "सेब", desc: "Crisp, rich in Dietary Fiber & Vitamin C" },
    { en: "Mango", hi: "आम (King of Fruits)", desc: "Luscious, rich in Vitamin A & C" },
    { en: "Banana", hi: "केला", desc: "High Potassium, instant energy" },
    { en: "Pomegranate", hi: "अनार", desc: "Antioxidants & hemoglobin booster" },
    { en: "Dragon Fruit", hi: "ड्रैगन फ्रूट", desc: "Prebiotics, magnesium & iron" },
    { en: "Guava", hi: "अमरूद", desc: "4x Vitamin C of oranges" },
    { en: "Papaya", hi: "पपीता", desc: "Papain enzyme & Vitamin A" },
    { en: "Pineapple", hi: "अनानास", desc: "Bromelain anti-inflammatory enzyme" },
    { en: "Watermelon", hi: "तरबूज", desc: "92% hydration, lycopene" },
    { en: "Avocado", hi: "मक्खन फल", desc: "Healthy monounsaturated fatty acids" },
    { en: "Blueberry", hi: "नीलबदरी", desc: "Anthocyanins for brain and vision" },
    { en: "Kiwi", hi: "कीवी", desc: "High Vitamin C, K & Actinidain" }
  ],
  vegetables: [
    { en: "Spinach", hi: "पालक", desc: "Iron, Calcium, Vitamin K & Lutein" },
    { en: "Bitter Gourd", hi: "करेला", desc: "Charantin for blood sugar control" },
    { en: "Broccoli", hi: "हरी फूलगोभी", desc: "Sulforaphane anticancer compound" },
    { en: "Ginger", hi: "अदरक", desc: "Gingerol anti-inflammatory" },
    { en: "Garlic", hi: "लहसुन", desc: "Allicin cardiovascular shield" },
    { en: "Turmeric", hi: "हल्दी", desc: "Curcumin healing compound" },
    { en: "Beetroot", hi: "चुकंदर", desc: "Nitrates for stamina" },
    { en: "Tomato", hi: "टमाटर", desc: "Lycopene antioxidant" }
  ],
  colors: [
    { name: "Ruby Red", hi: "लाल", hex: "#EF4444", vibe: "Passion, Energy, Vitality" },
    { name: "Sapphire Blue", hi: "नीला", hex: "#3B82F6", vibe: "Trust, Depth, Intellect" },
    { name: "Emerald Green", hi: "हरा", hex: "#10B981", vibe: "Growth, Nature, Balance" },
    { name: "Amber Yellow", hi: "पीला", hex: "#F59E0B", vibe: "Clarity, Warmth, Alertness" },
    { name: "Royal Purple", hi: "बैंगनी", hex: "#8B5CF6", vibe: "Wisdom, Luxury, Creativity" },
    { name: "Rose Pink", hi: "गुलाबी", hex: "#EC4899", vibe: "Love, Softness, Compassion" },
    { name: "Obsidian Black", hi: "काला", hex: "#111827", vibe: "Elegance, Mystery, Power" },
    { name: "Pure White", hi: "सफ़ेद", hex: "#FFFFFF", vibe: "Peace, Purity, Illumination" }
  ],
  animals: [
    { en: "Lion", hi: "शेर (King of Jungle)", cat: "Wild Carnivore" },
    { en: "Tiger", hi: "बाघ (National Animal)", cat: "Wild Apex" },
    { en: "Elephant", hi: "हाथी", cat: "Mega Herbivore" },
    { en: "Dolphin", hi: "डॉल्फ़िन", cat: "Aquatic Mammal" }
  ],
  shapes: [
    { name: "Circle", hi: "वृत्त (Gol)", desc: "0 sides, 1 curved edge" },
    { name: "Square", hi: "वर्ग (Varg)", desc: "4 equal sides, 90° angles" },
    { name: "Triangle", hi: "त्रिकोण (Trikon)", desc: "3 sides, sum = 180°" },
    { name: "Hexagon", hi: "षट्कोण", desc: "6 sides polygon" }
  ]
};

// ====================================================
// 3. BIG NUMBER CONVERTER (1 to 10^17)
// ====================================================
const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function convertThreeDigits(num) {
  let str = "";
  if (num >= 100) {
    str += ONES[Math.floor(num / 100)] + " Hundred ";
    num %= 100;
  }
  if (num >= 20) {
    str += TENS[Math.floor(num / 10)] + " ";
    num %= 10;
  }
  if (num > 0) {
    str += ONES[num] + " ";
  }
  return str.trim();
}

function numberToInternationalWords(numStr) {
  let clean = numStr.replace(/,/g, '').trim();
  if (!/^\d+$/.test(clean)) return null;
  if (clean === "0") return "Zero";
  
  const scales = ["", "Thousand", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion"];
  let words = [];
  let chunkCount = 0;

  while (clean.length > 0) {
    let chunk = parseInt(clean.slice(-3), 10);
    clean = clean.slice(0, -3);
    if (chunk > 0) {
      let chunkWord = convertThreeDigits(chunk);
      let scale = scales[chunkCount] ? " " + scales[chunkCount] : "";
      words.unshift(chunkWord + scale);
    }
    chunkCount++;
  }
  return words.join(", ");
}

function getIndianScaleLookup(numStr) {
  const len = numStr.replace(/,/g, '').trim().length;
  if (len === 1) return "इकाई (Units / Ek)";
  if (len === 2) return "दहाई (Tens / Das)";
  if (len === 3) return "सैकड़ा (Hundreds / Sau)";
  if (len === 4) return "हज़ार (Thousands / Hazaar)";
  if (len === 5) return "दस हज़ार (Ten Thousand / Das Hazaar)";
  if (len === 6) return "लाख (1 Lakh - 10^5)";
  if (len === 7) return "दस लाख (10 Lakh - 10^6 / 1 Million)";
  if (len === 8) return "करोड़ (1 Crore - 10^7 / 10 Million)";
  if (len === 9) return "दस करोड़ (10 Crore - 10^8 / 100 Million)";
  if (len === 10) return "अरब (1 Arab - 10^9 / 1 Billion)";
  if (len === 11) return "दस अरब (10 Arab - 10^10 / 10 Billion)";
  if (len === 12) return "खरब (1 Kharab - 10^11 / 100 Billion)";
  if (len === 13) return "दस खरब (10 Kharab - 10^12 / 1 Trillion)";
  if (len === 14) return "नील (1 Neel - 10^13 / 10 Trillion)";
  if (len === 15) return "दस नील (10 Neel - 10^14 / 100 Trillion)";
  if (len === 16) return "पद्म (1 Padma - 10^15 / 1 Quadrillion)";
  if (len === 17) return "दस पद्म / शंख (10 Padma / 1 Shankh - 10^16)";
  if (len === 18) return "दस शंख / महाशंख (10 Shankh / 100 Quadrillion - 10^17)";
  return "Infinite Vedic Order";
}

// ====================================================
// 4. OFFLINE NLP, EMBEDDINGS & INTENT PARSER
// ====================================================
function cleanInputText(str) {
  return str.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
}

function tokenize(text) {
  return text.toLowerCase().match(/\b\w+\b/g) || [];
}

function getSimilarity(text1, text2) {
  const t1 = new Set(tokenize(text1));
  const t2 = new Set(tokenize(text2));
  if (!t1.size || !t2.size) return 0;
  const intersection = new Set([...t1].filter((x) => t2.has(x)));
  return intersection.size / Math.sqrt(t1.size * t2.size);
}

// 5. NATIVE MATH SOLVER
function evaluateMath(text) {
  let clean = cleanInputText(text.toLowerCase())
    .replace(/[“”"']/g, '')
    .replace(/what is|calculate|solve|\?|=|kya hoga|batao|ans|answer/g, "")
    .trim();

  const percentOfMatch = clean.match(/(\d+(?:\.\d+)?)\s*%\s*(?:of|\*)\s*(\d+(?:\.\d+)?)/);
  if (percentOfMatch) {
    const p = parseFloat(percentOfMatch[1]);
    const total = parseFloat(percentOfMatch[2]);
    const ans = (p / 100) * total;
    return `Calculation Result: ${ans} (${p}% of ${total})`;
  }

  clean = clean.replace(/of/g, "*").replace(/x/g, "*");
  clean = clean.replace(/[^0-9+\-*/().\s%]/g, "").trim();

  if (clean && /[+\-*/%]/.test(clean)) {
    try {
      const sanitized = clean.replace(/(\d+(?:\.\d+)?)%/g, "($1*0.01)");
      const res = Function(`'use strict'; return (${sanitized})`)();
      if (typeof res === "number" && !isNaN(res)) return `Calculation Result: ${res}`;
    } catch (e) {
      return null;
    }
  }
  return null;
}

// 6. NATIVE CODE ASSET SYNTHESIZER
function generateCodeAssets(query) {
  const q = query.toLowerCase();

  if (q.includes("question") && (q.includes("icon") || q.includes("svg") || q.includes("mark"))) {
    return `// Question Mark Icon (SVG React Component)
export const QuestionIcon = ({ size = 24, className = "text-indigo-400" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);`;
  }

  if (q.includes("sparkle") || (q.includes("ai") && q.includes("icon"))) {
    return `// AI Sparkle Star Icon (SVG React Component)
export const SparkleIcon = ({ size = 24, className = "text-purple-400" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
  </svg>
);`;
  }

  if (q.includes("button") || q.includes("shiny button")) {
    return `// Modern Shiny Tailwind Button
export default function ShinyButton({ label = 'Click Me', onClick }) {
  return (
    <button onClick={onClick} className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-lg hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all duration-200">
      {label}
    </button>
  );
}`;
  }

  if (q.includes("modal") || q.includes("popup")) {
    return `// Glassmorphic Modal Component
export default function GlassModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-[#1e1f20] border border-white/10 p-6 shadow-2xl text-white">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="py-4 text-gray-300 text-sm">{children}</div>
      </div>
    </div>
  );
}`;
  }

  if (q.includes("schema") && (q.includes("user") || q.includes("supabase"))) {
    return `-- Supabase / PostgreSQL Schema
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);`;
  }

  return null;
}

// 7. OFFLINE DEEP BUG DIAGNOSTICS
function deepAnalyzeFullCode(code) {
  const issues = [];
  const fixes = [];

  if (/\b\w+\.push\(/i.test(code) || /\b\w+\.splice\(/i.test(code)) {
    issues.push("• [CRITICAL] Direct State Mutation (.push / .splice): React array direct mutate karne se component re-render nahi hota.");
    fixes.push("// Fix 1: State Immutable Update\nsetItems(prev => [...prev, newItem]);");
  }

  if (/useEffect\s*\(\s*\(\)\s*=>\s*\{[\s\S]*(setInterval|addEventListener)[\s\S]*\}\s*,/i.test(code)) {
    if (!/return\s*\(\)\s*=>/i.test(code)) {
      issues.push("• [HIGH] Memory Leak in useEffect: Timer/Listener mount ho raha hai par unmount cleanup function missing hai.");
      fixes.push("// Fix 2: Add Cleanup Function\nreturn () => {\n  clearInterval(timer);\n};");
    }
  }

  if (/(const|let|var)\s+\w+\s*=\s*(fetch|axios)\(/i.test(code) && !/await\s+(fetch|axios)/i.test(code)) {
    issues.push("• [CRITICAL] Missing Await on Async Call: 'fetch' Promise return karta hai.");
    fixes.push("// Fix 3: Async/Await Pattern\nconst response = await fetch('/api/endpoint');\nconst data = await response.json();");
  }

  if (/\b(data|user|res|profile)\.\w+\.\w+/i.test(code) && !/\?\./.test(code)) {
    issues.push("• [WARNING] Unsafe Nested Lookup: Null aane par TypeError runtime crash hoga.");
    fixes.push("// Fix 4: Optional Chaining with Fallback\nconst badge = data?.user?.profile?.details?.badge ?? 'Default';");
  }

  if (/\.map\s*\(\s*\([^)]*\)\s*=>/i.test(code) && !/key\s*=/i.test(code)) {
    issues.push("• [MEDIUM] Missing 'key' prop in dynamic list iterator.");
    fixes.push("// Fix 5: Pass Unique Key Prop\n{items.map(item => <div key={item.id}>{item.name}</div>)}");
  }

  if (issues.length > 0) {
    return `🔍 COMPREHENSIVE BUG REPORT (${issues.length} Issues Found):\n\n${issues.join("\n\n")}\n\n🛠️ RECOMMENDED CODE PATCHES:\n\n${fixes.join("\n\n")}`;
  }
  return "✅ Code scan complete: No major critical bugs detected.";
}

// 8. MASTER PROCESSING ROUTER
function processHimoBrain(userInput) {
  let clean = cleanInputText(userInput);
  const lower = clean.toLowerCase();

  // Auth Switch
  if (lower.startsWith("switch to guest")) {
    currentUser = "guest";
    return "Session switched to Guest mode. Administrative locks active.";
  }
  if (lower.startsWith("switch to gagandeep")) {
    currentUser = "gagandeep";
    return "Master Access Verified. Welcome Gagandeep!";
  }

  // Privacy Guard
  if (/who made you|who is your creator|kisne banaya|owner kaun hai|creator name/i.test(lower)) {
    if (currentUser.toLowerCase() === MASTER_USER) {
      return "Access Level: Master. Creator credentials authenticated.";
    }
    return "Main ek autonomous private AI engine hoon. Creator details classified hain.";
  }

  // Real-time Self-Training
  const teachMatch = clean.match(/when\s+i\s+say\s+(.+?)\s+(?:you\s+)?say\s+(.+)/i);
  if (teachMatch) {
    if (currentUser.toLowerCase() !== MASTER_USER) {
      return "Access Denied: Real-time training is locked. Admin authentication required.";
    }
    const q = cleanInputText(teachMatch[1]).toLowerCase();
    const a = cleanInputText(teachMatch[2]);
    memoryStore.qaMemory[q] = a;
    return `Synapse Linked! Command '${q}' registered successfully into native brain.`;
  }

  // Native Math Engine
  const mathRes = evaluateMath(clean);
  if (mathRes) return mathRes;

  // Native Code Generator
  const codeRes = generateCodeAssets(clean);
  if (codeRes) return codeRes;

  // Big Numbers Scale (1 to 10^17)
  const numMatch = clean.match(/\b\d{1,18}\b/);
  if (numMatch && (lower.includes("word") || lower.includes("counting") || lower.includes("read") || lower.includes("batao") || lower.includes("in words"))) {
    const rawNum = numMatch[0];
    const international = numberToInternationalWords(rawNum);
    const indianScale = getIndianScaleLookup(rawNum);
    return `🔢 NUMBER BREAKDOWN: ${rawNum}\n• International: **${international}**\n• Indian Vedic: **${indianScale}**\n• Power of 10: **10^${rawNum.length - 1}**`;
  }

  if (lower.includes("counting chart") || lower.includes("1 to 100000000000000000") || lower.includes("all numbers") || lower.includes("shankh")) {
    return `🌌 INFINITE NUMBER SCALE SYSTEM (1 to 10^17 / 100 Quadrillion / 10 Shankh):

1. 1 (10^0) -> One | इकाई
2. 10 (10^1) -> Ten | दहाई
3. 100 (10^2) -> One Hundred | सैकड़ा
4. 1,000 (10^3) -> One Thousand | हज़ार
5. 10,000 (10^4) -> Ten Thousand | दस हज़ार
6. 100,000 (10^5) -> Hundred Thousand | एक लाख (1 Lakh)
7. 1,000,000 (10^6) -> One Million (1M) | दस लाख (10 Lakh)
8. 10,000,000 (10^7) -> Ten Million (10M) | एक करोड़ (1 Crore)
9. 100,000,000 (10^8) -> Hundred Million | दस करोड़ (10 Crore)
10. 1,000,000,000 (10^9) -> One Billion (1B) | एक अरब (1 Arab)
11. 10,000,000,000 (10^10) -> Ten Billion | दस अरब (10 Arab)
12. 100,000,000,000 (10^11) -> Hundred Billion | एक खरब (1 Kharab)
13. 1,000,000,000,000 (10^12) -> One Trillion (1T) | दस खरब (10 Kharab)
14. 10,000,000,000,000 (10^13) -> Ten Trillion | एक नील (1 Neel)
15. 100,000,000,000,000 (10^14) -> Hundred Trillion | दस नील (10 Neel)
16. 1,000,000,000,000,000 (10^15) -> One Quadrillion (1Q) | एक पद्म (1 Padma)
17. 10,000,000,000,000,000 (10^16) -> Ten Quadrillion | दस पद्म / 1 शंख (1 Shankh)
18. 100,000,000,000,000,000 (10^17) -> 100 Quadrillion | दस शंख (10 Shankh / Mahashankh)`;
  }

  // Encyclopedia Lookups
  if (lower.includes("alphabet") || lower.includes("a to z") || lower.includes("abcd")) {
    let out = "🔤 ALPHABETS MASTER CHART (A to Z):\n\n";
    ENCYCLOPEDIA.alphabets.forEach(a => {
      out += `• **${a.letter}** -> **${a.word}** (${a.hindi}) [${a.phonetic}]\n`;
    });
    return out;
  }

  if (lower.includes("fruit") || lower.includes("fal") || lower.includes("fruits")) {
    let out = "🍎 COMPREHENSIVE FRUITS DIRECTORY:\n\n";
    ENCYCLOPEDIA.fruits.forEach(f => {
      out += `• **${f.en}** (${f.hi}): ${f.desc}\n`;
    });
    return out;
  }

  if (lower.includes("vegetable") || lower.includes("sabji") || lower.includes("sabzi")) {
    let out = "🥦 COMPREHENSIVE VEGETABLES DIRECTORY:\n\n";
    ENCYCLOPEDIA.vegetables.forEach(v => {
      out += `• **${v.en}** (${v.hi}): ${v.desc}\n`;
    });
    return out;
  }

  if (lower.includes("color") || lower.includes("rang") || lower.includes("colours")) {
    let out = "🎨 COMPREHENSIVE COLOR SPECTRUM:\n\n";
    ENCYCLOPEDIA.colors.forEach(c => {
      out += `• **${c.name}** (${c.hi}) [Hex: \`${c.hex}\`] -> ${c.vibe}\n`;
    });
    return out;
  }

  // Multi-Hop Relations
  const fwdMatch = clean.match(/(?:what\s+is|tell\s+me\s+about|who\s+is|kya\s+hai|batao)\s+([\w\s\-]+)/i);
  if (fwdMatch) {
    const target = fwdMatch[1].replace(/kya hai/gi, "").trim().toLowerCase();
    memoryStore.lastSubject = target;
    const directFacts = memoryStore.relations.filter((r) => r.subject === target);
    if (directFacts.length > 0) {
      const deductions = directFacts.map((fact) => {
        const intermediate = fact.object;
        const secondHops = memoryStore.relations.filter((r) => r.subject === intermediate);
        if (secondHops.length > 0) {
          const hop2 = secondHops[0];
          return `${target.toUpperCase()} ${fact.relation} ${intermediate}, which ${hop2.relation} ${hop2.object}`;
        }
        return `${target.toUpperCase()} ${fact.relation} ${intermediate}`;
      });
      return deductions.join(". ") + ".";
    }
  }

  // Exact / Semantic Memory Match
  let bestMatch = null;
  let highestScore = 0;
  for (const [pattern, response] of Object.entries(memoryStore.qaMemory)) {
    const score = getSimilarity(clean, pattern);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = response;
    }
  }

  if (highestScore >= 0.35 && bestMatch) {
    return bestMatch;
  }

  // Fallback Single-line Bug Check
  if (lower.includes("const ") || lower.includes("useeffect") || lower.includes(".push(")) {
    const analysis = deepAnalyzeFullCode(clean);
    if (analysis !== "✅ Code scan complete: No major critical bugs detected.") {
      return analysis;
    }
  }

  return `Input received: "${clean}". Native core operational.\nCommands to test:\n• 'who are you'\n• 'Calculate 25 * 480 - 150'\n• 'Counting chart 1 to 100000000000000000'\n• 'All fruits name'\n• 'when I say X say Y'`;
}

// 9. CLI INTERFACE
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '\x1b[36mYou: \x1b[0m'
});

console.log("\x1b[35m=== HIMO v13.0 PURE NATIVE AUTONOMOUS ENGINE ===\x1b[0m");
console.log("\x1b[33mZero External APIs • 100% Offline Cognitive Architecture\x1b[0m\n");
rl.prompt();

rl.on('line', (line) => {
  const input = line.trim();

  if (input === ':::') {
    if (!isMultiLineMode) {
      isMultiLineMode = true;
      multiLineBuffer = [];
      console.log("\x1b[33m--- Multi-Line Input Mode ON (Paste code, then type ':::' to submit) ---\x1b[0m");
      return;
    } else {
      isMultiLineMode = false;
      const fullCode = multiLineBuffer.join("\n");
      const reply = deepAnalyzeFullCode(fullCode);
      console.log(`\x1b[32mHimo: \x1b[0m\n${reply}\n`);
      rl.prompt();
      return;
    }
  }

  if (isMultiLineMode) {
    multiLineBuffer.push(line);
    return;
  }

  if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
    console.log("\x1b[33mHimo session ended. Bye!\x1b[0m");
    process.exit(0);
  }

  if (input) {
    const reply = processHimoBrain(input);
    console.log(`\x1b[32mHimo: \x1b[0m\n${reply}\n`);
  }
  rl.prompt();
});
