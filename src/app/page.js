"use client"

import { useState, useRef, useEffect } from "react"

const DEFAULT_MEMORY = {
  facts: {
    user_name: "Gagandeep",
    preference: "Next.js, Full-stack UI engineering, Dark mode interfaces & AI architecture",
    creator: "Gagandeep",
    version: "v6.0 Ultra Neural",
    status: "Active & 24/7 Autonomous"
  },
  relations: [
    { subject: "nextjs", relation: "is built on", object: "react" },
    { subject: "react", relation: "is a UI library for", object: "javascript" },
    { subject: "javascript", relation: "is the foundation of", object: "web development" },
    { subject: "nextjs", relation: "supports", object: "server side rendering and static site generation" },
    { subject: "nextjs", relation: "uses", object: "typescript" },
    { subject: "tailwind css", relation: "is a utility-first framework for", object: "modern UI styling" },
    { subject: "firebase", relation: "provides real-time database and", object: "cloud authentication" },
    { subject: "supabase", relation: "is an open source alternative to", object: "firebase" },
    { subject: "capacitor", relation: "wraps web applications into", object: "native android and ios apps" },
    { subject: "himo", relation: "is created by", object: "gagandeep" }
  ],
  qaMemory: {
    "who are you": "Main Himo AI hoon — aapka high-performance personalized cognitive assistant, ready to build and solve!",
    "hello himo": "Yo! Himo v6.0 Ultra Engine active hai. Aaj kya create ya solve karna hai?",
    "what can you do": "Main code generate karta hoon, multi-hop reasoning se facts connect karta hoon, complex math calculate karta hoon, aur continuous naye facts learn karta hoon.",
    "kaise ho": "Ekdum top speed aur high efficiency par chal raha hoon! Aap batao?",
    "who made you": "Mujhe Gagandeep ne banaya hai — ek powerful, adaptive intelligence ke roop mein."
  },
  lastSubject: null
};

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
    const saved = localStorage.getItem("himo_v6_memory")
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
      localStorage.setItem("himo_v6_memory", JSON.stringify(memoryRef.current))
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
    const clean = text.toLowerCase().replace(/what is|calculate|solve|\?|=|kya hoga|batao/g, "").trim()
    const mathPattern = /^[0-9+\-*/().\s%]+$/
    if (mathPattern.test(clean) && /[+\-*/%]/.test(clean)) {
      try {
        const sanitized = clean.replace(/%/g, "*0.01")
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

  function processHimoBrain(userInput) {
    let clean = userInput.trim()
    const memory = memoryRef.current

    const mathResult = evaluateMath(clean)
    if (mathResult) return mathResult

    if (memory.lastSubject) {
      clean = clean.replace(/\b(it|this|that|ye|yeh|iska|isme)\b/gi, memory.lastSubject)
    }

    const lower = clean.toLowerCase()

    // 1. Code Generation Quick Triggers
    if (lower.includes("code") || lower.includes("example") || lower.includes("banao") || lower.includes("create")) {
      if (lower.includes("button") || lower.includes("ui")) {
        return "Ye lijiye modern interactive Tailwind UI Button component:\n\n```jsx\nexport default function ShinyButton({ label = 'Click Me', onClick }) {\n  return (\n    <button \n      onClick={onClick}\n      className=\"px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-lg hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all duration-200\"\n    >\n      {label}\n    </button>\n  );\n}\n```\nIsme smooth hover scaling aur gradient glow integrated hai."
      }
      if (lower.includes("fetch") || lower.includes("api")) {
        return "Next.js ke andar clean API fetch karne ka pattern:\n\n```javascript\nasync function fetchChatResponse(userPrompt) {\n  try {\n    const response = await fetch('/api/chat', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({ message: userPrompt }),\n    });\n    if (!response.ok) throw new Error('Network error');\n    return await response.json();\n  } catch (err) {\n    console.error('API Error:', err);\n    return null;\n  }\n}\n```"
      }
    }

    // 2. Casual Slangs & Human Tone
    if (/\b(bhai|bro|buddy|yaar)\b/.test(lower)) {
      if (/kaisa hai|kaise ho|how are you|kya haal/.test(lower)) {
        return "Ekdum solid aur high gear mein bhai! Aaj kya special design ya build kar rahe hain?"
      }
      if (/sahi hai|mast|op|nice|great|badhiya|gazab/.test(lower)) {
        return "Shukriya bhai! Himo engine hamesha top speed execute karne ke liye ready hai."
      }
    }

    if (["hi", "hello", "hey", "himo", "yo", "namaste", "hi himo"].includes(lower)) {
      return "Yo! Himo v6.0 Engine active hai. Batao kya query solve karni hai?"
    }

    // 3. Dynamic Teaching & Memory Synapse Injection
    const teachMatch = clean.match(/when\s+i\s+say\s+(.+?)\s+(?:you\s+)?say\s+(.+)/i)
    if (teachMatch) {
      const q = teachMatch[1].trim().toLowerCase()
      const a = teachMatch[2].trim()
      memory.qaMemory[q] = a
      saveMemory()
      return `Synapse Recorded! Jab bhi aap '${q}' bologe, mera reply hoga: '${a}'`
    }

    // 4. Identity & Attributes
    const nameMatch = clean.match(/(?:my\s+name\s+is|mera\s+naam\s+hai|mera\s+naam)\s+([\w\s]+)/i)
    if (nameMatch) {
      const name = nameMatch[1].replace(/hai/gi, "").trim()
      memory.facts["user_name"] = name
      saveMemory()
      return `Noted! Maine memory mein save kar liya hai ki aapka naam ${name} hai.`
    }

    if (/what is my name|who am i|mera naam kya hai|mera naam/i.test(lower)) {
      const name = memory.facts["user_name"]
      return name ? `Aapka naam **${name}** hai.` : "Aapne abhi tak mujhe apna naam nahi bataya."
    }

    if (/what do i like|mujhe kya pasand hai/i.test(lower)) {
      const pref = memory.facts["preference"]
      return pref ? `Aapki saved preferences: **${pref}**` : "Aapne apni pasand share nahi ki hai."
    }

    // 5. Knowledge Triplet Ingestion ("X is Y")
    const isQuery = /^(what|who|how|does|kya|kaun|batao|explain|calculate)/i.test(clean)
    if (!isQuery) {
      const relMatch = clean.match(
        /([\w\s\-]+?)\s+(is built on|is based on|is a|is an|is|uses|requires|has|features|supports|runs on)\s+([\w\s\-]+)/i
      )
      if (relMatch) {
        const sub = relMatch[1].trim().toLowerCase()
        const rel = relMatch[2].trim().toLowerCase()
        const obj = relMatch[3].trim().toLowerCase()

        memory.lastSubject = sub
        const exists = memory.relations.some(
          (r) => r.subject === sub && r.relation === rel && r.object === obj
        )
        if (!exists) {
          memory.relations.push({ subject: sub, relation: rel, object: obj })
          saveMemory()
          return `Knowledge Synapse Formed: **[${sub}]** --(*${rel}*)--> **[${obj}]**`
        }
        return `Ye fact mere neural graph mein already stored hai: [${sub}] ${rel} [${obj}].`
      }
    }

    // 6. Multi-Hop Forward Deduction
    const fwdMatch = clean.match(/(?:what\s+is|tell\s+me\s+about|who\s+is|kya\s+hai|batao)\s+([\w\s\-]+)/i)
    if (fwdMatch) {
      const target = fwdMatch[1].replace(/kya hai/gi, "").trim().toLowerCase()
      memory.lastSubject = target
      const directFacts = memory.relations.filter((r) => r.subject === target)
      if (directFacts.length > 0) {
        const deductions = directFacts.map((fact) => {
          const intermediate = fact.object
          const secondHops = memory.relations.filter((r) => r.subject === intermediate)
          if (secondHops.length > 0) {
            const hop2 = secondHops[0]
            return `**${target.toUpperCase()}** ${fact.relation} *${intermediate}*, which ${hop2.relation} **${hop2.object}**`
          }
          return `**${target.toUpperCase()}** ${fact.relation} *${intermediate}*`
        })
        return deductions.join(". ") + "."
      }
    }

    // 7. Reverse Queries ("what uses X")
    const revMatch = clean.match(/what\s+(uses|has|requires|supports|wraps)\s+([\w\s\-]+)/i)
    if (revMatch) {
      const rel = revMatch[1].trim().toLowerCase()
      const targetObj = revMatch[2].trim().toLowerCase()
      const matches = memory.relations
        .filter((r) => r.relation.includes(rel) && r.object.includes(targetObj))
        .map((r) => r.subject.toUpperCase())
      if (matches.length > 0) {
        return `**${matches.join(", ")}** ${rel} **${targetObj}**.`
      }
    }

    // 8. Semantic Similarity Search
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

    return `Maine query analyze ki: *"${clean}"*.\nAgar ye koi specific fact ya command hai, toh aap mujhe direct sikha sakte hain:\n• Fact link karne ke liye: \`X is Y\`\n• Direct response ke liye: \`When I say ${clean} say <answer>\``
  }

  // Realistic Streaming / Typing Simulation
  function streamResponse(fullText) {
    const newMsgIndex = messages.length + 1
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
    }, 250)
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
          <p className="sidebar-label">Memory Status</p>
          <div className="status-badge">
            <span className="dot pulse"></span> Synapses: {memoryRef.current.relations.length + Object.keys(memoryRef.current.qaMemory).length} Links
          </div>
          
          <p className="sidebar-label" style={{ marginTop: "20px" }}>Recent Inputs</p>
          <div className="recent-list">
            {messages.filter(m => m.role === 'user').slice(-5).map((m, i) => (
              <div key={i} className="recent-item" onClick={() => handleSend(m.content)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span className="truncate">{m.content}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-footer">
          <button className="footer-item" onClick={() => { localStorage.clear(); memoryRef.current = DEFAULT_MEMORY; alert("Memory Reset Complete!"); }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Reset Brain State
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
              Himo <span className="brand-badge">v6.0 Ultra</span>
            </span>
          </div>
          <div className="user-profile-badge">
            <div className="avatar-chip">G</div>
          </div>
        </header>

        <div className="canvas">
          {messages.length === 0 && (
            <div className="hero-screen">
              <div className="hero-greeting">
                <span className="gradient-text">Hello Gagandeep</span>
                <h1>Ready to build something amazing?</h1>
              </div>

              <div className="suggestion-grid">
                <div className="suggestion-card" onClick={() => handleSend("What can you do?")}>
                  <p>Explore Capabilities</p>
                  <span>See reasoning & syntax logic</span>
                </div>
                <div className="suggestion-card" onClick={() => handleSend("Create a modern UI button code")}>
                  <p>Generate UI Components</p>
                  <span>Tailwind & React blocks</span>
                </div>
                <div className="suggestion-card" onClick={() => handleSend("Calculate 25 * 480 - 150")}>
                  <p>Evaluate Computation</p>
                  <span>Instant math solving</span>
                </div>
                <div className="suggestion-card" onClick={() => handleSend("What is Nextjs?")}>
                  <p>Multi-Hop Reasoning</p>
                  <span>Graph deduction traversal</span>
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
                    <div className="user-icon">G</div>
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
              placeholder="Message Himo or teach facts..."
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
            Himo v6.0 Ultra • Continuous Adaptive Cognitive Engine
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
        .recent-list { display: flex; flex-direction: column; gap: 4px; }
        .recent-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 18px; font-size: 0.86rem; color: #c4c7c5; cursor: pointer; transition: background 0.15s; }
        .recent-item:hover { background: #282a2c; color: #fff; }
        .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
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
