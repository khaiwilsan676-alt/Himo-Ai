"use client"

import { useState, useRef, useEffect } from "react"

// --- HIMO COGNITIVE BRAIN CORE (Direct Client Engine) ---
const memoryStore = {
  facts: {
    user_name: "Gagandeep",
    preference: "Next.js, UI engineering & Dark mode apps",
  },
  relations: [
    { subject: "nextjs", relation: "is based on", object: "react" },
    { subject: "react", relation: "is a", object: "javascript framework" },
    { subject: "javascript", relation: "is a", object: "web programming language" },
    { subject: "nextjs", relation: "uses", object: "typescript" },
    { subject: "nextjs", relation: "requires", object: "nodejs" },
  ],
  qaMemory: {
    "who are you": "Main Himo AI hoon — aapka personalized adaptive cognitive intelligence!",
    "hello himo": "Yo! Himo is live on Vercel Cloud 24/7. Kya build kar rahe hain aaj?",
    "what can you do": "Main context yaad rakhta hoon, complex logic deduce karta hoon, aur multi-hop relationships traverse karta hoon.",
    "kaise ho": "Ekdum mast! High-speed execute ho raha hoon.",
  },
  lastSubject: null,
};

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

function processHimoBrain(userInput) {
  let clean = userInput.trim();

  if (memoryStore.lastSubject) {
    clean = clean.replace(/\b(it|this|that|ye|yeh|iska|isme)\b/gi, memoryStore.lastSubject);
  }

  const lower = clean.toLowerCase();
  if (/\b(bhai|bro|buddy|yaar)\b/.test(lower)) {
    if (/kaisa hai|kaise ho|how are you|kya haal/.test(lower)) {
      return "Ekdum solid bhai! Himo poori tarah active hai.";
    }
    if (/sahi hai|mast|op|nice|great|badhiya/.test(lower)) {
      return "Shukriya bhai! Himo hamesha ready hai.";
    }
  }

  if (["hi", "hello", "hey", "himo", "yo", "namaste", "hi himo"].includes(lower)) {
    return "Hey! Himo Cloud Engine is active. Batao kya query hai?";
  }

  const teachMatch = clean.match(/when\s+i\s+say\s+(.+?)\s+(?:you\s+)?say\s+(.+)/i);
  if (teachMatch) {
    const q = teachMatch[1].trim().toLowerCase();
    const a = teachMatch[2].trim();
    memoryStore.qaMemory[q] = a;
    return `Learned! Jab aap poochoge '${q}', main bolunga: '${a}'`;
  }

  const nameMatch = clean.match(/(?:my\s+name\s+is|mera\s+naam\s+hai|mera\s+naam)\s+([\w\s]+)/i);
  if (nameMatch) {
    const name = nameMatch[1].replace(/hai/gi, "").trim();
    memoryStore.facts["user_name"] = name;
    return `Understood! Maine yaad rakh liya ki aapka naam ${name} hai.`;
  }

  if (/what is my name|who am i|mera naam kya hai|mera naam/i.test(lower)) {
    const name = memoryStore.facts["user_name"];
    return name ? `Aapka naam ${name} hai.` : "Aapne abhi tak mujhe apna naam nahi bataya.";
  }

  if (/what do i like|mujhe kya pasand hai/i.test(lower)) {
    const pref = memoryStore.facts["preference"];
    return pref ? `Aapko ${pref} pasand hai.` : "Aapne apni pasand share nahi ki hai.";
  }

  const isQuery = /^(what|who|how|does|kya|kaun|batao|explain)/i.test(clean);
  if (!isQuery) {
    const relMatch = clean.match(
      /([\w\s\-]+?)\s+(is based on|is a|is an|is|uses|requires|has|features|supports|runs on)\s+([\w\s\-]+)/i
    );
    if (relMatch) {
      const sub = relMatch[1].trim().toLowerCase();
      const rel = relMatch[2].trim().toLowerCase();
      const obj = relMatch[3].trim().toLowerCase();

      memoryStore.lastSubject = sub;
      const exists = memoryStore.relations.some(
        (r) => r.subject === sub && r.relation === rel && r.object === obj
      );
      if (!exists) {
        memoryStore.relations.push({ subject: sub, relation: rel, object: obj });
        return `Knowledge Synapse Linked: [${sub}] --(${rel})--> [${obj}]`;
      }
      return `Ye fact mere knowledge base mein already exist karta hai: [${sub}] ${rel} [${obj}].`;
    }
  }

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

  const revMatch = clean.match(/what\s+(uses|has|requires|supports)\s+([\w\s\-]+)/i);
  if (revMatch) {
    const rel = revMatch[1].trim().toLowerCase();
    const targetObj = revMatch[2].trim().toLowerCase();
    const matches = memoryStore.relations
      .filter((r) => r.relation === rel && r.object === targetObj)
      .map((r) => r.subject.toUpperCase());
    if (matches.length > 0) {
      return `${matches.join(", ")} ${rel} ${targetObj}.`;
    }
  }

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

  return `Maine '${clean}' process kiya. Agar ye koi fact hai toh format mein likho: 'X is Y' ya 'When I say ${clean} say <answer>'.`;
}

export default function Home() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
    }
  }, [message])

  function handleSend(textToSend) {
    const prompt = (typeof textToSend === "string" ? textToSend : message).trim()
    if (!prompt || loading) return

    setMessage("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"

    setMessages((current) => [...current, { role: "user", content: prompt }])
    setLoading(true)

    // Direct Instant Processing with brief natural thinking animation
    setTimeout(() => {
      try {
        const reply = processHimoBrain(prompt)
        setMessages((current) => [
          ...current,
          { role: "assistant", content: reply }
        ])
      } catch (err) {
        setMessages((current) => [
          ...current,
          { role: "assistant", content: "Error processing brain logic." }
        ])
      } finally {
        setLoading(false)
      }
    }, 400)
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
          New chat
        </button>

        <div className="sidebar-section">
          <p className="sidebar-label">Recent</p>
          <div className="recent-list">
            {messages.filter(m => m.role === 'user').slice(-4).map((m, i) => (
              <div key={i} className="recent-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span className="truncate">{m.content}</span>
              </div>
            ))}
          </div>
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
              Himo <span className="brand-badge">2.5 Flash</span>
            </span>
          </div>
          <div className="user-profile-badge">
            <div className="avatar-chip">U</div>
          </div>
        </header>

        <div className="canvas">
          {messages.length === 0 && (
            <div className="hero-screen">
              <div className="hero-greeting">
                <span className="gradient-text">Hello there</span>
                <h1>How can I help you today?</h1>
              </div>

              <div className="suggestion-grid">
                <div className="suggestion-card" onClick={() => handleSend("What can you do?")}>
                  <p>What can you do?</p>
                  <span>Explore features & answers</span>
                </div>
                <div className="suggestion-card" onClick={() => handleSend("Help me write clean code")}>
                  <p>Help me write clean code</p>
                  <span>Tips for modern React and Next.js</span>
                </div>
                <div className="suggestion-card" onClick={() => handleSend("Tell me a quick tip")}>
                  <p>Tell me a quick tip</p>
                  <span>Learn something new right now</span>
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
                    {msg.content.split("\n").map((line, i) => (
                      <p key={i}>{line || "\u00A0"}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
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
              placeholder="Ask Himo..."
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
            Himo may display inaccurate info, so double-check its responses.
          </p>
        </div>
      </section>

      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .app-shell { display: flex; height: 100vh; background: #131314; color: #e3e3e3; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; overflow: hidden; }
        .workspace { flex: 1; display: flex; flex-direction: column; position: relative; height: 100vh; }
        .topbar { height: 64px; padding: 0 20px; display: flex; align-items: center; justify-content: space-between; background: #131314; z-index: 10; }
        .left-nav { display: flex; align-items: center; gap: 16px; }
        .brand-name { font-size: 1.15rem; font-weight: 500; color: #c4c7c5; display: flex; align-items: center; gap: 8px; }
        .brand-badge { font-size: 0.75rem; padding: 2px 8px; background: #1e1f20; border: 1px solid #333538; border-radius: 12px; color: #9da3a7; }
        .icon-btn { background: transparent; border: none; color: #c4c7c5; cursor: pointer; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
        .icon-btn:hover { background: #282a2c; }
        .avatar-chip { width: 34px; height: 34px; border-radius: 50%; background: #4a5568; color: #ffffff; font-size: 0.9rem; font-weight: 600; display: flex; align-items: center; justify-content: center; }
        .sidebar { position: fixed; top: 0; left: -320px; width: 290px; height: 100vh; background: #1e1f20; transition: left 0.25s; z-index: 100; padding: 16px; display: flex; flex-direction: column; }
        .sidebar.open { left: 0; }
        .sidebar-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.6); z-index: 99; }
        .sidebar-header { display: flex; justify-content: flex-start; margin-bottom: 16px; }
        .new-chat-btn { display: flex; align-items: center; gap: 12px; background: #282a2c; border: none; color: #e3e3e3; padding: 12px 18px; border-radius: 24px; cursor: pointer; font-size: 0.9rem; margin-bottom: 24px; }
        .sidebar-section { flex: 1; overflow-y: auto; }
        .sidebar-label { font-size: 0.75rem; font-weight: 600; color: #8e918f; margin-bottom: 12px; text-transform: uppercase; }
        .recent-list { display: flex; flex-direction: column; gap: 4px; }
        .recent-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 20px; font-size: 0.88rem; color: #c4c7c5; cursor: pointer; }
        .recent-item:hover { background: #282a2c; }
        .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .canvas { flex: 1; overflow-y: auto; padding: 0 16px 200px 16px; max-width: 820px; width: 100%; margin: 0 auto; }
        .hero-screen { margin-top: 8vh; }
        .hero-greeting { margin-bottom: 40px; }
        .gradient-text { font-size: 3.2rem; font-weight: 600; background: linear-gradient(74deg, #4285f4 0%, #9b72cb 9%, #d96570 20%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-greeting h1 { font-size: 2.8rem; font-weight: 500; color: #444746; }
        .suggestion-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
        .suggestion-card { background: #1e1f20; padding: 18px; border-radius: 16px; cursor: pointer; min-height: 110px; display: flex; flex-direction: column; justify-content: space-between; }
        .suggestion-card:hover { background: #282a2c; }
        .messages-list { display: flex; flex-direction: column; gap: 28px; padding-top: 24px; }
        .message-row { display: flex; gap: 18px; max-width: 100%; }
        .message-row.user { flex-direction: row-reverse; }
        .gemini-sparkle { color: #9b72cb; }
        .user-icon { width: 32px; height: 32px; background: #333538; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; }
        .message-bubble { max-width: 82%; }
        .message-row.user .message-bubble { background: #282a2c; padding: 12px 18px; border-radius: 20px; }
        .message-text { font-size: 1rem; line-height: 1.65; color: #e3e3e3; }
        .gemini-shimmer-loader { display: flex; flex-direction: column; gap: 8px; width: 220px; }
        .shimmer-line { height: 12px; border-radius: 6px; background: #282a2c; }
        .dock-container { position: absolute; bottom: 0; left: 0; right: 0; padding: 16px 20px 20px; background: linear-gradient(180deg, transparent 0%, #131314 40%); display: flex; flex-direction: column; align-items: center; }
        .composer-shell { width: 100%; max-width: 800px; background: #1e1f20; border-radius: 28px; padding: 12px 18px; display: flex; align-items: flex-end; gap: 12px; border: 1px solid #2d2f31; }
        .composer-shell textarea { flex: 1; background: transparent; border: none; outline: none; color: #e3e3e3; font-size: 1rem; resize: none; max-height: 160px; }
        .send-button-gemini { width: 36px; height: 36px; border-radius: 50%; background: #e3e3e3; color: #131314; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .disclaimer-text { font-size: 0.75rem; color: #8e918f; margin-top: 10px; }
      `}</style>
    </main>
  )
}
