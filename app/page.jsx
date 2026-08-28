"use client"

import { useState, useRef, useEffect } from "react"
import LoginPage from "../components/LoginPage"
import MathMasterEngine from "../src/lib/mathMasterEngine"
import { auth } from "../src/lib/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"

async function think(prompt) {
  const q = prompt.trim()
  const qLower = q.toLowerCase()

  if (['hi', 'hii', 'hello', 'hii himo', 'hi himo'].includes(qLower)) {
    return "Yo! Himo Omni Engine active hai. Live Web Search & Coding ready hai. Aaj kya find ya build karna hai?"
  }

  const mathPattern = /^[0-9+\-*/÷×().\s*%^$€]+$/
  const hasOperatorOrDigits = /[0-9]/.test(q) && /[+\-*/÷×%^$€]/.test(q)

  if (mathPattern.test(q) && hasOperatorOrDigits) {
    try {
      const calcResult = MathMasterEngine.evaluate(q)
      if (typeof calcResult === "number" && !isNaN(calcResult)) {
        return `According to Himo:\n\n${q} = ${calcResult}`
      }
    } catch (e) {}
  }

  try {
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&utf8=&format=json&origin=*`)
    if (res.ok) {
      const data = await res.json()
      const searchResults = data?.query?.search || []
      if (searchResults.length > 0) {
        const queryKeywords = qLower.split(" ").filter(w => w.length > 2)
        const matchedSnippets = searchResults
          .map(item => {
            let text = item.snippet.replace(/<[^>]+>/g, '')
            text = text.replace(/Wikipedia|Merriam-Webster|Britannica|Dictionary/gi, '')
            return text.replace(/\s{2,}/g, ' ').trim()
          })
          .filter(snippet => {
            if (snippet.length < 20) return false
            const snipLower = snippet.toLowerCase()
            return queryKeywords.some(kw => snipLower.includes(kw))
          })
          .slice(0, 3)

        if (matchedSnippets.length > 0) {
          let output = "According to Himo:\n\n"
          matchedSnippets.forEach(s => { output += `• ${s}\n\n` })
          return output.trim()
        }
      }
    }
  } catch (err) {
    console.error("Search fetch error:", err)
  }

  return `According to Himo:\n\n'${q}' par koi exact relevant information nahi mili. Please specific topic likh kar search karo.`
}

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null)
  const [authChecking, setAuthChecking] = useState(true)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user)
      } else {
        setCurrentUser(null)
      }
      setAuthChecking(false)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
    }
  }, [message])

  async function handleSend(textToSend) {
    const prompt = (typeof textToSend === "string" ? textToSend : message).trim()
    if (!prompt || loading) return

    setMessage("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"

    setMessages((current) => [...current, { role: "user", content: prompt }])
    setLoading(true)

    try {
      const answer = await think(prompt)
      setMessages((current) => [...current, { role: "assistant", content: answer }])
    } catch (error) {
      setMessages((current) => [...current, { role: "assistant", content: "Error processing request." }])
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    try {
      await signOut(auth)
      setCurrentUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (authChecking) {
    return (
      <div className="auth-loading-screen">
        <div className="loader-spinner"></div>
        <style jsx>{`
          .auth-loading-screen {
            height: 100vh;
            width: 100vw;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #ffffff;
          }
          .loader-spinner {
            width: 38px;
            height: 38px;
            border: 3px solid #f3f4f6;
            border-top: 3px solid #2563eb;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!currentUser) {
    return <LoginPage onLoginSuccess={(user) => setCurrentUser(user)} />
  }

  const userInitial = currentUser.displayName 
    ? currentUser.displayName.charAt(0).toUpperCase() 
    : (currentUser.email ? currentUser.email.charAt(0).toUpperCase() : "U")

  return (
    <main className="app-shell">
      <div className="top-glow-mesh" />

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

        <div className="sidebar-footer">
          <button className="footer-item logout-btn" onClick={handleLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
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
              <img src="/logo.png" alt="Himo Logo" className="brand-logo" />
              Himo <span className="brand-plain-text">Omni V17.1</span>
            </span>
          </div>
          <div className="user-profile-badge">
            <div className="avatar-chip" title={currentUser.email || ""}>{userInitial}</div>
          </div>
        </header>

        <div className="canvas">
          {messages.length === 0 && (
            <div className="hero-screen">
              <div className="hero-greeting">
                <span className="gradient-text">Himo Omni</span>
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
                <div className="suggestion-card" onClick={() => handleSend("7 + 728")}>
                  <p>7 + 728</p>
                  <span>Fast Math Engine Calculation</span>
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
                    <div className="user-icon">{userInitial}</div>
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
        </div>
      </section>

      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .app-shell { display: flex; height: 100vh; background: #ffffff; color: #1f2937; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; overflow: hidden; position: relative; }
        .top-glow-mesh {
          position: absolute; top: 0; left: 0; right: 0; height: 30vh; pointer-events: none; z-index: 1;
          background: radial-gradient(circle at 15% 30%, rgba(96, 165, 250, 0.45), transparent 60%),
                      radial-gradient(circle at 45% 20%, rgba(244, 114, 182, 0.4), transparent 55%),
                      radial-gradient(circle at 75% 35%, rgba(52, 211, 153, 0.35), transparent 55%),
                      radial-gradient(circle at 90% 15%, rgba(192, 132, 252, 0.4), transparent 60%),
                      linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%);
          filter: blur(24px);
        }
        .workspace { flex: 1; display: flex; flex-direction: column; position: relative; height: 100vh; z-index: 2; background: transparent; }
        .topbar { height: 64px; padding: 0 20px; display: flex; align-items: center; justify-content: space-between; background: transparent; z-index: 10; }
        .left-nav { display: flex; align-items: center; gap: 16px; }
        .brand-name { font-size: 1.15rem; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px; }
        .brand-logo { width: 28px; height: 28px; object-fit: contain; border-radius: 6px; }
        .brand-plain-text { font-size: 0.85rem; font-weight: 500; color: #6b7280; margin-left: 2px; }
        .icon-btn { background: transparent; border: none; color: #374151; cursor: pointer; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
        .icon-btn:hover { background: rgba(0, 0, 0, 0.05); }
        .avatar-chip { width: 34px; height: 34px; border-radius: 50%; background: #3b82f6; color: #ffffff; font-size: 0.9rem; font-weight: 600; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3); }
        .sidebar { position: fixed; top: 0; left: -320px; width: 290px; height: 100vh; background: #ffffff; border-right: 1px solid #e5e7eb; transition: left 0.25s cubic-bezier(0.4, 0, 0.2, 1); z-index: 100; padding: 16px; display: flex; flex-direction: column; box-shadow: 4px 0 24px rgba(0, 0, 0, 0.08); }
        .sidebar.open { left: 0; }
        .sidebar-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.3); backdrop-filter: blur(2px); z-index: 99; }
        .sidebar-header { display: flex; justify-content: flex-start; margin-bottom: 16px; }
        .new-chat-btn { display: flex; align-items: center; gap: 12px; background: #f3f4f6; border: 1px solid #e5e7eb; color: #1f2937; padding: 12px 18px; border-radius: 24px; cursor: pointer; font-size: 0.9rem; font-weight: 500; margin-bottom: 24px; }
        .new-chat-btn:hover { background: #e5e7eb; }
        .sidebar-section { flex: 1; overflow-y: auto; }
        .sidebar-label { font-size: 0.75rem; font-weight: 600; color: #9ca3af; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        .recent-list { display: flex; flex-direction: column; gap: 4px; }
        .recent-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 16px; font-size: 0.88rem; color: #4b5563; cursor: pointer; }
        .recent-item:hover { background: #f3f4f6; color: #111827; }
        .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sidebar-footer { border-top: 1px solid #e5e7eb; padding-top: 12px; display: flex; flex-direction: column; gap: 4px; }
        .footer-item { display: flex; align-items: center; gap: 12px; background: transparent; border: none; color: #4b5563; padding: 10px 14px; border-radius: 16px; cursor: pointer; font-size: 0.88rem; width: 100%; }
        .logout-btn { color: #dc2626; }
        .logout-btn:hover { background: #fef2f2; color: #b91c1c; }
        .canvas { flex: 1; overflow-y: auto; padding: 0 16px 140px 16px; max-width: 820px; width: 100%; margin: 0 auto; }
        .hero-screen { margin-top: 6vh; }
        .hero-greeting { margin-bottom: 40px; }
        .gradient-text { font-size: 3.2rem; font-weight: 700; background: linear-gradient(74deg, #2563eb 0%, #7c3aed 30%, #db2777 60%, #059669 100%); background-size: 200% 100%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: block; margin-bottom: 4px; }
        .hero-greeting h1 { font-size: 2.8rem; font-weight: 600; color: #9ca3af; line-height: 1.2; }
        .suggestion-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
        .suggestion-card { background: #f9fafb; border: 1px solid #f3f4f6; padding: 18px; border-radius: 16px; cursor: pointer; transition: background 0.2s, transform 0.1s, box-shadow 0.2s; display: flex; flex-direction: column; justify-content: space-between; min-height: 110px; }
        .suggestion-card:hover { background: #ffffff; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05); transform: translateY(-2px); }
        .suggestion-card p { font-size: 0.95rem; font-weight: 600; color: #1f2937; }
        .suggestion-card span { font-size: 0.8rem; color: #6b7280; }
        .messages-list { display: flex; flex-direction: column; gap: 28px; padding-top: 24px; }
        .message-row { display: flex; gap: 18px; max-width: 100%; }
        .message-row.user { flex-direction: row-reverse; }
        .message-icon { flex-shrink: 0; margin-top: 2px; }
        .gemini-sparkle { background: linear-gradient(135deg, #2563eb, #9333ea, #db2777); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: flex; align-items: center; justify-content: center; }
        .user-icon { width: 32px; height: 32px; background: #e5e7eb; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 600; color: #374151; }
        .message-bubble { max-width: 82%; }
        .message-row.user .message-bubble { background: #f3f4f6; padding: 12px 18px; border-radius: 20px; border-top-right-radius: 4px; }
        .message-text { font-size: 1rem; line-height: 1.65; color: #1f2937; word-break: break-word; }
        .message-text p { margin-bottom: 8px; }
        .message-text p:last-child { margin-bottom: 0; }
        .gemini-shimmer-loader { display: flex; flex-direction: column; gap: 8px; width: 220px; padding: 8px 0; }
        .shimmer-line { height: 12px; border-radius: 6px; background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        .shimmer-line.line-1 { width: 90%; }
        .shimmer-line.line-2 { width: 60%; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .dock-container { position: absolute; bottom: 0; left: 0; right: 0; padding: 16px 20px 24px; background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 45%); display: flex; flex-direction: column; align-items: center; }
        .composer-shell { width: 100%; max-width: 800px; background: #ffffff; border-radius: 28px; padding: 12px 18px; display: flex; align-items: flex-end; gap: 12px; border: 1px solid #e5e7eb; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); }
        .composer-shell:focus-within { border-color: #93c5fd; box-shadow: 0 4px 24px rgba(59, 130, 246, 0.12); }
        .composer-shell textarea { flex: 1; background: transparent; border: none; outline: none; color: #1f2937; font-size: 1rem; font-family: inherit; resize: none; max-height: 160px; line-height: 1.5; padding-top: 4px; }
        .composer-shell textarea::placeholder { color: #9ca3af; }
        .composer-actions { display: flex; align-items: center; margin-bottom: 2px; }
        .send-button-gemini { width: 36px; height: 36px; border-radius: 50%; background: #111827; color: #ffffff; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.1s, background 0.2s; }
        .send-button-gemini:disabled { background: #e5e7eb; color: #9ca3af; cursor: not-allowed; }
        .send-button-gemini:not(:disabled):hover { transform: scale(1.05); background: #1f2937; }
        @media (max-width: 600px) {
          .gradient-text { font-size: 2.2rem; }
          .hero-greeting h1 { font-size: 1.8rem; }
          .canvas { padding-bottom: 120px; }
        }
      `}</style>
    </main>
  )
}
