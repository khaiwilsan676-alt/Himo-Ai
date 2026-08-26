"use client"

import { useState, useRef, useEffect } from "react"

const MASTER_USER = "gagandeep"

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
  ]
};

const DEFAULT_MEMORY = {
  facts: {
    preference: "Next.js, Full-stack UI engineering, Dark mode interfaces & AI architecture",
    version: "v13.0 Pure Native Omni Core",
  },
  relations: [
    { subject: "nextjs", relation: "is built on", object: "react" },
    { subject: "react", relation: "is a UI library for", object: "javascript" },
    { subject: "javascript", relation: "is the foundation of", object: "web development" },
    { subject: "nextjs", relation: "supports", object: "server side rendering and static site generation" },
    { subject: "nextjs", relation: "uses", object: "typescript" },
    { subject: "tailwind css", relation: "is a utility-first framework for", object: "modern UI styling" },
    { subject: "supabase", relation: "provides postgres database and", object: "auth" },
    { subject: "capacitor", relation: "wraps web applications into", object: "native android and ios apps" },
    { subject: "himo", relation: "is created by", object: "gagandeep" }
  ],
  qaMemory: {
    "who are you": "Main Himo AI hoon — aapka 100% self-built, independent, personalized cognitive intelligence!",
    "who made you": "Main ek autonomous private AI engine hoon. Creator details classified hain.",
    "hello himo": "Yo! Himo Omni Engine active hai. Aaj kya create ya solve karna hai?",
    "what can you do": "Main 100% offline code generate karta hoon, deep bugs fix karta hoon, math evaluate karta hoon, infinite counting decode karta hoon aur real-time facts learn karta hoon.",
    "kaise ho": "Ekdum solid! Fully independent aur top efficiency par active hoon.",
  },
  lastSubject: null
};

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

export default function Home() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(null)
  
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const memoryRef = useRef(DEFAULT_MEMORY)

  useEffect(() => {
    const saved = localStorage.getItem("himo_v13_memory")
    if (saved) {
      try {
        memoryRef.current = JSON.parse(saved)
      } catch (e) {
        memoryRef.current = DEFAULT_MEMORY
      }
    }
  }, [])

  const saveMemory = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("himo_v13_memory", JSON.stringify(memoryRef.current))
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
    }
  }, [message])

  function cleanInputText(str) {
    return str.replace(/[\u200B-\u200D\uFEFF]/g, '').trim()
  }

  function tokenize(text) {
    return text.toLowerCase().match(/\b\w+\b/g) || []
  }

  function getSimilarity(text1, text2) {
    const t1 = new Set(tokenize(text1))
    const t2 = new Set(tokenize(text2))
    if (!t1.size || !t2.size) return 0
    const intersection = new Set([...t1].filter((x) => t2.has(x)))
    return intersection.size / Math.sqrt(t1.size * t2.size)
  }

  function evaluateMath(text) {
    let clean = cleanInputText(text.toLowerCase())
      .replace(/[“”"']/g, '')
      .replace(/what is|calculate|solve|\?|=|kya hoga|batao|ans|answer/g, "")
      .trim()

    const percentOfMatch = clean.match(/(\d+(?:\.\d+)?)\s*%\s*(?:of|\*)\s*(\d+(?:\.\d+)?)/)
    if (percentOfMatch) {
      const p = parseFloat(percentOfMatch[1])
      const total = parseFloat(percentOfMatch[2])
      const ans = (p / 100) * total
      return `Calculation Result: **${ans}** (${p}% of ${total})`
    }

    clean = clean.replace(/of/g, "*").replace(/x/g, "*")
    clean = clean.replace(/[^0-9+\-*/().\s%]/g, "").trim()

    if (clean && /[+\-*/%]/.test(clean)) {
      try {
        const sanitized = clean.replace(/(\d+(?:\.\d+)?)%/g, "($1*0.01)")
        const res = Function(`'use strict'; return (${sanitized})`)()
        if (typeof res === "number" && !isNaN(res)) {
          return `Calculation Result: **${res}**`
        }
      } catch (e) {
        return null
      }
    }
    return null
  }

  function deepAnalyzeFullCode(code) {
    const issues = []
    const fixes = []

    if (/\b\w+\.push\(/i.test(code) || /\b\w+\.splice\(/i.test(code)) {
      issues.push("• [CRITICAL] Direct State Mutation (.push / .splice): React state direct mutate karne se component re-render nahi hota.")
      fixes.push("// Fix 1: State Immutable Update\nsetItems(prev => [...prev, newItem]);")
    }

    if (/useEffect\s*\(\s*\(\)\s*=>\s*\{[\s\S]*(setInterval|addEventListener)[\s\S]*\}\s*,/i.test(code)) {
      if (!/return\s*\(\)\s*=>/i.test(code)) {
        issues.push("• [HIGH] Memory Leak in useEffect: Timer mount ho raha hai par unmount cleanup function missing hai.")
        fixes.push("// Fix 2: Add Cleanup Function\nreturn () => {\n  clearInterval(timer);\n};")
      }
    }

    if (/(const|let|var)\s+\w+\s*=\s*(fetch|axios)\(/i.test(code) && !/await\s+(fetch|axios)/i.test(code)) {
      issues.push("• [CRITICAL] Missing Await on Async Call: 'fetch' Promise return karta hai.")
      fixes.push("// Fix 3: Async/Await Pattern\nconst response = await fetch('/api/endpoint');\nconst data = await response.json();")
    }

    if (/\b(data|user|res|profile)\.\w+\.\w+/i.test(code) && !/\?\./.test(code)) {
      issues.push("• [WARNING] Unsafe Nested Lookup: Null aane par TypeError runtime crash hoga.")
      fixes.push("// Fix 4: Optional Chaining with Fallback\nconst badge = data?.user?.profile?.details?.badge ?? 'Default';")
    }

    if (issues.length > 0) {
      return `🔍 COMPREHENSIVE BUG REPORT (${issues.length} Issues Found):\n\n${issues.join("\n\n")}\n\n🛠️ RECOMMENDED CODE PATCHES:\n\n${fixes.join("\n\n")}`
    }
    return null
  }

  function processHimoBrain(userInput) {
    let clean = cleanInputText(userInput)
    const memory = memoryRef.current
    const lower = clean.toLowerCase()

    if (/who made you|who is your creator|kisne banaya|owner kaun hai|creator name/i.test(lower)) {
      return "Main ek autonomous private AI engine hoon. Creator details classified hain."
    }

    const teachMatch = clean.match(/when\s+i\s+say\s+(.+?)\s+(?:you\s+)?say\s+(.+)/i)
    if (teachMatch) {
      const q = cleanInputText(teachMatch[1]).toLowerCase()
      const a = cleanInputText(teachMatch[2])
      memory.qaMemory[q] = a
      saveMemory()
      return `Synapse Linked! Command '${q}' registered successfully.`
    }

    const mathResult = evaluateMath(clean)
    if (mathResult) return mathResult

    const bugResult = deepAnalyzeFullCode(clean)
    if (bugResult) return bugResult

    if (lower.includes("question") && (lower.includes("icon") || lower.includes("svg"))) {
      return "```jsx\nexport const QuestionIcon = ({ size = 24, className = 'text-indigo-400' }) => (\n  <svg width={size} height={size} viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\">\n    <circle cx=\"12\" cy=\"12\" r=\"10\" />\n    <path d=\"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3\" />\n    <line x1=\"12\" y1=\"17\" x2=\"12.01\" y2=\"17\" />\n  </svg>\n);\n```"
    }

    if (lower.includes("button") || lower.includes("ui")) {
      return "```jsx\nexport default function ShinyButton({ label = 'Click Me', onClick }) {\n  return (\n    <button \n      onClick={onClick}\n      className=\"px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-lg hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all duration-200\"\n    >\n      {label}\n    </button>\n  );\n}\n```"
    }

    const numMatch = clean.match(/\b\d{1,18}\b/)
    if (numMatch && (lower.includes("word") || lower.includes("counting") || lower.includes("read") || lower.includes("in words"))) {
      const rawNum = numMatch[0]
      const international = numberToInternationalWords(rawNum)
      const indianScale = getIndianScaleLookup(rawNum)
      return `🔢 NUMBER BREAKDOWN: **${rawNum}**\n• International: **${international}**\n• Indian Vedic: **${indianScale}**\n• Power of 10: **10^${rawNum.length - 1}**`
    }

    if (lower.includes("counting chart") || lower.includes("1 to 100000000000000000") || lower.includes("all numbers") || lower.includes("shankh")) {
      return `🌌 INFINITE NUMBER SCALE SYSTEM (1 to 10^17 / 100 Quadrillion / 10 Shankh):\n\n1. 1 (10^0) -> One | इकाई\n2. 10 (10^1) -> Ten | दहाई\n3. 100 (10^2) -> One Hundred | सैकड़ा\n4. 1,000 (10^3) -> One Thousand | हज़ार\n5. 10,000 (10^4) -> Ten Thousand | दस हज़ार\n6. 100,000 (10^5) -> Hundred Thousand | एक लाख (1 Lakh)\n7. 1,000,000 (10^6) -> One Million (1M) | दस लाख (10 Lakh)\n8. 10,000,000 (10^7) -> Ten Million (10M) | एक करोड़ (1 Crore)\n9. 100,000,000 (10^8) -> Hundred Million | दस करोड़ (10 Crore)\n10. 1,000,000,000 (10^9) -> One Billion (1B) | एक अरब (1 Arab)\n11. 10,000,000,000 (10^10) -> Ten Billion | दस अरब (10 Arab)\n12. 100,000,000,000 (10^11) -> Hundred Billion | एक खरब (1 Kharab)\n13. 1,000,000,000,000 (10^12) -> One Trillion (1T) | दस खरब (10 Kharab)\n14. 10,000,000,000,000 (10^13) -> Ten Trillion | एक नील (1 Neel)\n15. 100,000,000,000,000 (10^14) -> Hundred Trillion | दस नील (10 Neel)\n16. 1,000,000,000,000,000 (10^15) -> One Quadrillion (1Q) | एक पद्म (1 Padma)\n17. 10,000,000,000,000,000 (10^16) -> Ten Quadrillion | दस पद्म / 1 शंख (1 Shankh)\n18. 100,000,000,000,000,000 (10^17) -> 100 Quadrillion | दस शंख (10 Shankh / Mahashankh)`
    }

    if (lower.includes("fruit") || lower.includes("fruits")) {
      return "🍎 COMPREHENSIVE FRUITS DIRECTORY:\n\n" + ENCYCLOPEDIA.fruits.map(f => `• **${f.en}** (${f.hi}): ${f.desc}`).join("\n")
    }

    if (lower.includes("vegetable") || lower.includes("sabji")) {
      return "🥦 COMPREHENSIVE VEGETABLES DIRECTORY:\n\n" + ENCYCLOPEDIA.vegetables.map(v => `• **${v.en}** (${v.hi}): ${v.desc}`).join("\n")
    }

    if (lower.includes("color") || lower.includes("colours")) {
      return "🎨 COMPREHENSIVE COLOR SPECTRUM:\n\n" + ENCYCLOPEDIA.colors.map(c => `• **${c.name}** (${c.hi}) [\`${c.hex}\`] -> ${c.vibe}`).join("\n")
    }

    if (lower.includes("alphabet") || lower.includes("a to z")) {
      return "🔤 ALPHABETS MASTER CHART:\n\n" + ENCYCLOPEDIA.alphabets.map(a => `• **${a.letter}** -> **${a.word}** (${a.hindi})`).join("\n")
    }

    let bestMatch = null
    let highestScore = 0
    for (const [pattern, response] of Object.entries(memory.qaMemory)) {
      const score = getSimilarity(clean, pattern)
      if (score > highestScore) {
        highestScore = score
        bestMatch = response
      }
    }

    if (highestScore >= 0.35 && bestMatch) {
      return bestMatch
    }

    return `Processed: "${clean}". Native core operational.`
  }

  function streamResponse(fullText) {
    let currentLength = 0
    const step = Math.max(1, Math.floor(fullText.length / 30))

    setMessages((prev) => [...prev, { role: "assistant", content: "" }])

    const interval = setInterval(() => {
      currentLength += step
      if (currentLength >= fullText.length) {
        currentLength = fullText.length
        clearInterval(interval)
        setLoading(false)
      }
      const partial = fullText.substring(0, currentLength)
      setMessages((prev) => {
        const copy = [...prev]
        if (copy[copy.length - 1]) {
          copy[copy.length - 1] = { role: "assistant", content: partial }
        }
        return copy
      })
    }, 16)
  }

  function handleSend(textToSend) {
    const prompt = (typeof textToSend === "string" ? textToSend : message).trim()
    if (!prompt || loading) return

    setMessage("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"

    setMessages((current) => [...current, { role: "user", content: prompt }])
    setLoading(true)

    setTimeout(() => {
      const finalReply = processHimoBrain(prompt)
      streamResponse(finalReply)
    }, 200)
  }

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  function renderFormattedContent(content) {
    const parts = content.split(/(```[\s\S]*?```)/g)
    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const lines = part.slice(3, -3).trim().split("\n")
        const lang = lines[0].match(/^[a-z]+/i) ? lines[0] : ""
        const code = lang ? lines.slice(1).join("\n") : lines.join("\n")
        return (
          <div key={index} className="code-block-container">
            <div className="code-header">
              <span>{lang || "code"}</span>
              <button onClick={() => navigator.clipboard.writeText(code)} className="code-copy-btn">
                Copy Code
              </button>
            </div>
            <pre className="code-content"><code>{code}</code></pre>
          </div>
        )
      }

      return (
        <div key={index} className="text-fragment">
          {part.split("\n").map((line, i) => (
            <p key={i}>
              {line.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g).map((chunk, ci) => {
                if (chunk.startsWith("**") && chunk.endsWith("**")) {
                  return <strong key={ci}>{chunk.slice(2, -2)}</strong>
                }
                if (chunk.startsWith("*") && chunk.endsWith("*")) {
                  return <em key={ci}>{chunk.slice(1, -1)}</em>
                }
                if (chunk.startsWith("`") && chunk.endsWith("`")) {
                  return <code key={ci} className="inline-code">{chunk.slice(1, -1)}</code>
                }
                return chunk
              })}
            </p>
          ))}
        </div>
      )
    })
  }

  return (
    <main className="app-shell">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <button className="icon-btn" onClick={() => setSidebarOpen(false)} title="Close menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <button className="new-chat-btn" onClick={() => { setMessages([]); setSidebarOpen(false); }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Session
        </button>

        <div className="sidebar-section">
          <p className="sidebar-label">Omni Core Engine</p>
          <div className="status-badge">
            <span className="dot pulse"></span> 100% Native Architecture
          </div>
        </div>

        <div className="sidebar-footer">
          <button className="footer-item" onClick={() => { localStorage.clear(); memoryRef.current = DEFAULT_MEMORY; alert("Memory Reset Complete!"); }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Reset Memory State
          </button>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="left-nav">
            <button className="icon-btn" onClick={() => setSidebarOpen(true)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <span className="brand-name">
              Himo <span className="brand-badge">v13.0 Omni</span>
            </span>
          </div>
          <div className="user-profile-badge">
            <div className="avatar-chip">H</div>
          </div>
        </header>

        <div className="canvas">
          {messages.length === 0 && (
            <div className="hero-screen">
              <div className="hero-greeting">
                <span className="gradient-text">Himo Omni AI</span>
                <h1>Pure Native Intelligence & Deep Engine</h1>
              </div>

              <div className="suggestion-grid">
                <div className="suggestion-card" onClick={() => handleSend("Counting chart 1 to 100000000000000000")}>
                  <p>Infinite Counting</p>
                  <span>1 to 100 Quadrillion (Shankh)</span>
                </div>
                <div className="suggestion-card" onClick={() => handleSend("All fruits name")}>
                  <p>Comprehensive Fruits</p>
                  <span>Botanical Directory</span>
                </div>
                <div className="suggestion-card" onClick={() => handleSend("Calculate 25 * 480 - 150")}>
                  <p>Math Evaluation</p>
                  <span>Fast arithmetic</span>
                </div>
                <div className="suggestion-card" onClick={() => handleSend("Write code of question mark icon")}>
                  <p>UI & SVG Assets</p>
                  <span>Clean React components</span>
                </div>
              </div>
            </div>
          )}

          <div className="messages-list">
            {messages.map((msg, index) => (
              <div key={index} className={`message-row ${msg.role}`}>
                <div className="message-icon">
                  {msg.role === "assistant" ? (
                    <div className="gemini-sparkle">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                      </svg>
                    </div>
                  ) : (
                    <div className="user-icon">U</div>
                  )}
                </div>
                <div className="message-bubble">
                  <div className="message-text">
                    {renderFormattedContent(msg.content)}
                  </div>
                  {msg.role === "assistant" && msg.content && (
                    <div className="action-row">
                      <button className="action-btn" onClick={() => copyToClipboard(msg.content, index)}>
                        {copiedIndex === index ? "Copied ✓" : "Copy"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="message-row assistant">
                <div className="message-icon">
                  <div className="gemini-sparkle pulse">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                    </svg>
                  </div>
                </div>
                <div className="message-bubble">
                  <div className="gemini-shimmer-loader">
                    <div className="shimmer-line line-1"></div>
                    <div className="shimmer-line line-2"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="dock-container">
          <div className="composer-shell">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Message Himo, evaluate math or paste code..."
              rows={1}
            />
            <div className="composer-actions">
              <button
                type="button"
                className="send-button-gemini"
                disabled={!message.trim() || loading}
                onClick={() => handleSend()}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
          <p className="disclaimer-text">
            Himo v13.0 Omni • 100% Native Architecture
          </p>
        </div>
      </section>

      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .app-shell { display: flex; height: 100vh; background: #131314; color: #e3e3e3; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; overflow: hidden; }
        .workspace { flex: 1; display: flex; flex-direction: column; position: relative; height: 100vh; }
        .topbar { height: 64px; padding: 0 20px; display: flex; align-items: center; justify-content: space-between; background: #131314; z-index: 10; border-bottom: 1px solid #1e1f20; }
        .left-nav { display: flex; align-items: center; gap: 16px; }
        .brand-name { font-size: 1.15rem; font-weight: 600; color: #c4c7c5; display: flex; align-items: center; gap: 8px; }
        .brand-badge { font-size: 0.72rem; padding: 2px 8px; background: #23272f; border: 1px solid #383f4d; border-radius: 12px; color: #61dafb; font-weight: 500; }
        .icon-btn { background: transparent; border: none; color: #c4c7c5; cursor: pointer; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
        .icon-btn:hover { background: #282a2c; }
        .avatar-chip { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #ffffff; font-size: 0.9rem; font-weight: 600; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px rgba(99,102,241,0.3); }
        .sidebar { position: fixed; top: 0; left: -320px; width: 290px; height: 100vh; background: #1e1f20; transition: left 0.25s cubic-bezier(0.4, 0, 0.2, 1); z-index: 100; padding: 16px; display: flex; flex-direction: column; border-right: 1px solid #282a2c; }
        .sidebar.open { left: 0; }
        .sidebar-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.65); z-index: 99; backdrop-filter: blur(2px); }
        .sidebar-header { display: flex; justify-content: flex-start; margin-bottom: 16px; }
        .new-chat-btn { display: flex; align-items: center; gap: 12px; background: #282a2c; border: 1px solid #383b40; color: #e3e3e3; padding: 12px 18px; border-radius: 24px; cursor: pointer; font-size: 0.9rem; margin-bottom: 24px; transition: all 0.2s; }
        .new-chat-btn:hover { background: #333538; transform: translateY(-1px); }
        .sidebar-section { flex: 1; overflow-y: auto; }
        .sidebar-label { font-size: 0.72rem; font-weight: 600; color: #8e918f; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
        .status-badge { display: inline-flex; align-items: center; gap: 8px; font-size: 0.8rem; background: #161b22; padding: 6px 12px; border-radius: 12px; border: 1px solid #30363d; color: #58a6ff; font-weight: 500; }
        .status-badge .dot { width: 8px; height: 8px; background: #238636; border-radius: 50%; box-shadow: 0 0 8px #2ea043; }
        .sidebar-footer { border-top: 1px solid #2d2f31; padding-top: 12px; }
        .footer-item { display: flex; align-items: center; gap: 10px; background: transparent; border: none; color: #e57373; padding: 10px 14px; border-radius: 18px; cursor: pointer; font-size: 0.86rem; width: 100%; transition: background 0.2s; }
        .footer-item:hover { background: rgba(229, 115, 115, 0.1); }
        .canvas { flex: 1; overflow-y: auto; padding: 0 16px 200px 16px; max-width: 860px; width: 100%; margin: 0 auto; }
        .hero-screen { margin-top: 6vh; }
        .hero-greeting { margin-bottom: 36px; }
        .gradient-text { font-size: 3.4rem; font-weight: 700; background: linear-gradient(74deg, #4285f4 0%, #9b72cb 25%, #d96570 50%, #ffffff 100%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: block; margin-bottom: 6px; }
        .hero-greeting h1 { font-size: 2.2rem; font-weight: 400; color: #5e6267; }
        .suggestion-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 12px; }
        .suggestion-card { background: #1e1f20; padding: 18px; border-radius: 20px; cursor: pointer; border: 1px solid #282a2c; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column; justify-content: space-between; min-height: 105px; }
        .suggestion-card:hover { background: #25272a; transform: translateY(-3px); border-color: #383b40; }
        .suggestion-card p { font-size: 0.92rem; font-weight: 500; color: #e3e3e3; }
        .suggestion-card span { font-size: 0.78rem; color: #8e918f; }
        .messages-list { display: flex; flex-direction: column; gap: 24px; padding-top: 24px; }
        .message-row { display: flex; gap: 16px; max-width: 100%; }
        .message-row.user { flex-direction: row-reverse; }
        .gemini-sparkle { color: #9b72cb; margin-top: 3px; }
        .user-icon { width: 32px; height: 32px; background: #333538; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 600; color: #e3e3e3; margin-top: 3px; }
        .message-bubble { max-width: 85%; }
        .message-row.user .message-bubble { background: #282a2c; padding: 12px 18px; border-radius: 20px; border-top-right-radius: 4px; border: 1px solid #333538; }
        .message-text { font-size: 1rem; line-height: 1.68; color: #e3e3e3; }
        .inline-code { background: #282a2c; padding: 2px 6px; border-radius: 6px; font-family: monospace; font-size: 0.9em; color: #61dafb; }
        .code-block-container { margin: 12px 0; background: #0d1117; border-radius: 12px; border: 1px solid #30363d; overflow: hidden; }
        .code-header { display: flex; justify-content: space-between; align-items: center; background: #161b22; padding: 6px 14px; font-size: 0.78rem; color: #8b949e; border-bottom: 1px solid #30363d; text-transform: uppercase; font-weight: 600; }
        .code-copy-btn { background: transparent; border: 1px solid #30363d; color: #c9d1d9; font-size: 0.72rem; padding: 3px 8px; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
        .code-copy-btn:hover { background: #30363d; color: #fff; }
        .code-content { padding: 14px; margin: 0; overflow-x: auto; font-family: 'Consolas', 'Fira Code', monospace; font-size: 0.88rem; color: #e6edf3; line-height: 1.5; }
        .action-row { display: flex; gap: 8px; margin-top: 8px; }
        .action-btn { background: transparent; border: none; color: #8e918f; font-size: 0.75rem; cursor: pointer; padding: 4px 8px; border-radius: 6px; transition: background 0.15s; }
        .action-btn:hover { background: #282a2c; color: #e3e3e3; }
        .gemini-shimmer-loader { display: flex; flex-direction: column; gap: 8px; width: 220px; }
        .shimmer-line { height: 12px; border-radius: 6px; background: linear-gradient(90deg, #282a2c 25%, #3c4043 50%, #282a2c 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
        .shimmer-line.line-1 { width: 90%; }
        .shimmer-line.line-2 { width: 60%; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .dock-container { position: absolute; bottom: 0; left: 0; right: 0; padding: 16px 20px 20px; background: linear-gradient(180deg, transparent 0%, #131314 45%); display: flex; flex-direction: column; align-items: center; }
        .composer-shell { width: 100%; max-width: 840px; background: #1e1f20; border-radius: 28px; padding: 12px 18px; display: flex; align-items: flex-end; gap: 12px; border: 1px solid #2d2f31; box-shadow: 0 4px 20px rgba(0,0,0,0.3); transition: border-color 0.2s; }
        .composer-shell:focus-within { border-color: #55585d; background: #212226; }
        .composer-shell textarea { flex: 1; background: transparent; border: none; outline: none; color: #e3e3e3; font-size: 1rem; resize: none; max-height: 160px; line-height: 1.5; padding-top: 4px; }
        .send-button-gemini { width: 36px; height: 36px; border-radius: 50%; background: #e3e3e3; color: #131314; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.15s; }
        .send-button-gemini:hover:not(:disabled) { transform: scale(1.06); }
        .send-button-gemini:disabled { background: #282a2c; color: #8e918f; cursor: not-allowed; }
        .disclaimer-text { font-size: 0.74rem; color: #8e918f; margin-top: 10px; text-align: center; }
        @media (max-width: 600px) {
          .gradient-text { font-size: 2.3rem; }
          .hero-greeting h1 { font-size: 1.5rem; }
          .canvas { padding-bottom: 180px; }
        }
      `}</style>
    </main>
  )
}
