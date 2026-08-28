"use client"

import { useState, useRef, useEffect } from "react"
import LoginPage from "../components/LoginPage"
import MathMasterEngine from "../src/lib/mathMasterEngine"
import { auth } from "../src/lib/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"

// Custom Himo Brain Circuit SVG Icon (matching provided logo)
function HimoBrainIcon({ size = 26, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M 52 35 C 48 35 44 38 43 43 C 41 53 37 60 33 60 C 29 60 27 55 28 48 C 29 41 35 36 41 36 C 45 36 48 34 49 30 C 50 26 48 22 43 23 C 33 25 24 33 22 43 C 20 54 24 64 32 66 C 39 68 45 63 48 55 C 50 49 53 44 57 44 C 61 44 63 48 62 55 C 60 64 53 71 44 71 C 39 71 36 74 37 78 C 38 82 42 84 48 83 C 60 81 70 70 72 57 C 74 44 68 35 58 35 Z"
        fill="currentColor"
      />
      <path
        d="M 49 15 C 31 16 17 29 15 47 C 14 55 16 63 21 69 C 23 71 26 70 27 67 C 28 64 26 62 23 58 C 20 52 19 46 20 40 C 22 28 32 19 46 18 C 50 18 53 15 52 11 C 51 8 47 7 43 8 C 39 9 35 11 31 14"
        fill="currentColor"
      />
      <path
        d="M 58 13 C 74 16 86 29 87 46 C 88 59 81 72 71 79 C 68 81 65 80 64 77 C 63 74 65 71 68 69 C 75 63 79 53 78 43 C 77 31 69 22 57 20 C 53 19 51 16 52 12 C 53 8 56 7 58 13 Z"
        fill="currentColor"
      />
      <path
        d="M 52 86 C 46 90 40 91 35 88 C 32 86 31 83 33 80 C 35 77 38 78 40 79 C 43 81 47 80 51 77 C 54 75 57 77 58 80 C 59 83 56 86 52 86 Z"
        fill="currentColor"
      />
      <circle cx="51" cy="28" r="3.2" fill="currentColor" />
      <circle cx="34" cy="50" r="3.2" fill="currentColor" />
      <circle cx="67" cy="57" r="3.2" fill="currentColor" />
    </svg>
  )
}

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
  
  // Dropdown States
  const [topMenuOpen, setTopMenuOpen] = useState(false)
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false)

  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    try {
      const cachedUser = localStorage.getItem("himo_cached_user")
      if (cachedUser) {
        setCurrentUser(JSON.parse(cachedUser))
        setAuthChecking(false)
      }
    } catch (e) {}

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const safeUserData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }
        setCurrentUser(safeUserData)
        localStorage.setItem("himo_cached_user", JSON.stringify(safeUserData))
      } else {
        setCurrentUser(null)
        localStorage.removeItem("himo_cached_user")
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

  useEffect(() => {
    const handleOutsideClick = () => {
      setTopMenuOpen(false)
      setSettingsMenuOpen(false)
    }
    window.addEventListener("click", handleOutsideClick)
    return () => window.removeEventListener("click", handleOutsideClick)
  }, [])

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
      localStorage.removeItem("himo_cached_user")
      sessionStorage.clear()
      setCurrentUser(null)
      setSettingsMenuOpen(false)
      setSidebarOpen(false)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleSuccessfulLogin = (user) => {
    const safeUserData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }
    setCurrentUser(safeUserData)
    localStorage.setItem("himo_cached_user", JSON.stringify(safeUserData))
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
    return <LoginPage onLoginSuccess={handleSuccessfulLogin} />
  }

  const userInitial = currentUser.displayName 
    ? currentUser.displayName.charAt(0).toUpperCase() 
    : (currentUser.email ? currentUser.email.charAt(0).toUpperCase() : "U")

  return (
    <main className="app-shell">
      <div className="top-glow-mesh" />

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Slide-out Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-top-spacer" />

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

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="user-info-wrapper">
            <div className="avatar-chip footer-avatar">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="User DP" className="avatar-img" />
              ) : (
                userInitial
              )}
            </div>
            <div className="user-email-text" title={currentUser.email || ""}>
              {currentUser.email || "User"}
            </div>
          </div>

          <div className="settings-container">
            <button 
              type="button"
              className="settings-icon-btn" 
              onClick={(e) => {
                e.stopPropagation();
                setSettingsMenuOpen(!settingsMenuOpen);
              }}
              title="Settings"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>

            {settingsMenuOpen && (
              <div className="popup-card settings-popup" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="popup-menu-item logout-item" onClick={handleLogout}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <section className="workspace">
        {/* Top Navbar */}
        <header className="topbar">
          <div className="left-nav">
            <button className="icon-btn" onClick={() => setSidebarOpen(true)} title="Open Sidebar">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <span className="brand-name">Himo Omni</span>
          </div>

          <div className="top-right-actions">
            <button 
              type="button" 
              className="icon-btn" 
              onClick={(e) => {
                e.stopPropagation();
                setTopMenuOpen(!topMenuOpen);
              }}
              title="More options"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>

            {topMenuOpen && (
              <div className="popup-card top-dropdown" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="popup-menu-item" onClick={() => { setMessages([]); setTopMenuOpen(false); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Delete Chat
                </button>
                <button type="button" className="popup-menu-item" onClick={() => setTopMenuOpen(false)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                  Rename
                </button>
                <button type="button" className="popup-menu-item" onClick={() => setTopMenuOpen(false)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  Pin
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content Canvas */}
        <div className="canvas">
          {messages.length === 0 && (
            <div className="hero-screen-top-left">
              <div className="hero-greeting-left">
                <span className="gradient-text animated-shimmer">Himo Omni</span>
                <h1>How can I help you today?</h1>
              </div>
            </div>
          )}

          {/* Messages Feed */}
          <div className="messages-list">
            {messages.map((msg, index) => (
              <div key={index} className={`message-row ${msg.role}`}>
                <div className="message-icon">
                  {msg.role === "assistant" ? (
                    <div className="himo-brain-badge">
                      <HimoBrainIcon size={24} />
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
                  <div className="himo-brain-badge pulse-brain">
                    <HimoBrainIcon size={24} />
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

        {/* Input Floating Composer */}
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
        .app-shell {
          display: flex;
          height: 100vh;
          background: #ffffff;
          color: #1f2937;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          overflow: hidden;
          position: relative;
        }

        .top-glow-mesh {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 30vh;
          pointer-events: none;
          z-index: 1;
          background: 
            radial-gradient(circle at 15% 30%, rgba(96, 165, 250, 0.45), transparent 60%),
            radial-gradient(circle at 45% 20%, rgba(244, 114, 182, 0.4), transparent 55%),
            radial-gradient(circle at 75% 35%, rgba(52, 211, 153, 0.35), transparent 55%),
            radial-gradient(circle at 90% 15%, rgba(192, 132, 252, 0.4), transparent 60%),
            linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%);
          filter: blur(24px);
        }

        .workspace {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
          height: 100vh;
          z-index: 2;
          background: transparent;
        }

        /* Navbar */
        .topbar {
          height: 64px;
          padding: 0 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: transparent;
          z-index: 10;
          position: relative;
        }

        .left-nav {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-name {
          font-size: 1.2rem;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.2px;
        }

        .top-right-actions {
          position: relative;
        }

        .icon-btn {
          background: transparent;
          border: none;
          color: #374151;
          cursor: pointer;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .icon-btn:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        /* Popup Cards */
        .popup-card {
          position: absolute;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          padding: 6px;
          min-width: 160px;
          z-index: 100;
          display: flex;
          flex-direction: column;
          gap: 2px;
          animation: fadeIn 0.15s ease-out;
        }

        .top-dropdown {
          top: 48px;
          right: 0;
        }

        .settings-popup {
          bottom: 50px;
          right: 0;
          min-width: 140px;
        }

        .popup-menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border: none;
          padding: 10px 14px;
          font-size: 0.9rem;
          color: #374151;
          border-radius: 10px;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: background 0.15s;
        }

        .popup-menu-item:hover {
          background: #f3f4f6;
          color: #111827;
        }

        .logout-item {
          color: #dc2626;
        }

        .logout-item:hover {
          background: #fef2f2;
          color: #b91c1c;
        }

        /* Sidebar */
        .sidebar {
          position: fixed;
          top: 0;
          left: -320px;
          width: 290px;
          height: 100vh;
          background: #ffffff;
          border-right: 1px solid #e5e7eb;
          transition: left 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 100;
          padding: 16px;
          display: flex;
          flex-direction: column;
          box-shadow: 4px 0 24px rgba(0, 0, 0, 0.08);
        }

        .sidebar.open {
          left: 0;
        }

        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(2px);
          z-index: 99;
        }

        .sidebar-top-spacer {
          height: 12px;
        }

        .new-chat-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          color: #1f2937;
          padding: 12px 18px;
          border-radius: 24px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 24px;
        }

        .new-chat-btn:hover {
          background: #e5e7eb;
        }

        .sidebar-section {
          flex: 1;
          overflow-y: auto;
        }

        .sidebar-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #9ca3af;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .recent-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .recent-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 16px;
          font-size: 0.88rem;
          color: #4b5563;
          cursor: pointer;
        }

        .recent-item:hover {
          background: #f3f4f6;
          color: #111827;
        }

        .truncate {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Sidebar Footer */
        .sidebar-footer {
          border-top: 1px solid #e5e7eb;
          padding-top: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
        }

        .user-info-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          overflow: hidden;
          max-width: 200px;
        }

        .footer-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #3b82f6;
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }

        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-email-text {
          font-size: 0.85rem;
          font-weight: 600;
          color: #1f2937;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .settings-container {
          position: relative;
        }

        .settings-icon-btn {
          background: transparent;
          border: none;
          color: #6b7280;
          cursor: pointer;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, color 0.2s;
        }

        .settings-icon-btn:hover {
          background: #f3f4f6;
          color: #111827;
        }

        /* Canvas & Top-Left Aligned Hero */
        .canvas {
          flex: 1;
          overflow-y: auto;
          padding: 0 20px 140px 20px;
          max-width: 820px;
          width: 100%;
          margin: 0 auto;
        }

        .hero-screen-top-left {
          margin-top: 36px;
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
        }

        .hero-greeting-left {
          text-align: left;
        }

        .gradient-text {
          font-size: 3.2rem;
          font-weight: 800;
          display: block;
          margin-bottom: 6px;
          letter-spacing: -0.5px;
        }

        /* Dynamic Continuous Color Shimmer Animation */
        .animated-shimmer {
          background: linear-gradient(
            90deg, 
            #2563eb 0%, 
            #9333ea 25%, 
            #ec4899 50%, 
            #10b981 75%, 
            #2563eb 100%
          );
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: fluidShimmer 5s linear infinite;
        }

        @keyframes fluidShimmer {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .hero-greeting-left h1 {
          font-size: 2rem;
          font-weight: 600;
          color: #9ca3af;
          line-height: 1.25;
        }

        /* Messages */
        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 28px;
          padding-top: 24px;
        }

        .message-row {
          display: flex;
          gap: 16px;
          max-width: 100%;
        }

        .message-row.user {
          flex-direction: row-reverse;
        }

        .message-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* Custom Brain Badge */
        .himo-brain-badge {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #111827;
        }

        .pulse-brain {
          animation: pulse 1.5s infinite ease-in-out;
        }

        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.08); opacity: 1; color: #2563eb; }
          100% { transform: scale(0.95); opacity: 0.7; }
        }

        .user-icon {
          width: 32px;
          height: 32px;
          background: #e5e7eb;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 600;
          color: #374151;
        }

        .message-bubble {
          max-width: 82%;
        }

        .message-row.user .message-bubble {
          background: #f3f4f6;
          padding: 12px 18px;
          border-radius: 20px;
          border-top-right-radius: 4px;
        }

        .message-text {
          font-size: 1rem;
          line-height: 1.65;
          color: #1f2937;
          word-break: break-word;
        }

        .message-text p {
          margin-bottom: 8px;
        }

        .message-text p:last-child {
          margin-bottom: 0;
        }

        .gemini-shimmer-loader {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 220px;
          padding: 8px 0;
        }

        .shimmer-line {
          height: 12px;
          border-radius: 6px;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .shimmer-line.line-1 { width: 90%; }
        .shimmer-line.line-2 { width: 60%; }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Composer */
        .dock-container {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px 20px 24px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 45%);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .composer-shell {
          width: 100%;
          max-width: 800px;
          background: #ffffff;
          border-radius: 28px;
          padding: 12px 18px;
          display: flex;
          align-items: flex-end;
          gap: 12px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .composer-shell:focus-within {
          border-color: #93c5fd;
          box-shadow: 0 4px 24px rgba(59, 130, 246, 0.12);
        }

        .composer-shell textarea {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #1f2937;
          font-size: 1rem;
          font-family: inherit;
          resize: none;
          max-height: 160px;
          line-height: 1.5;
          padding-top: 4px;
        }

        .composer-shell textarea::placeholder {
          color: #9ca3af;
        }

        .composer-actions {
          display: flex;
          align-items: center;
          margin-bottom: 2px;
        }

        .send-button-gemini {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #111827;
          color: #ffffff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.1s, background 0.2s;
        }

        .send-button-gemini:disabled {
          background: #e5e7eb;
          color: #9ca3af;
          cursor: not-allowed;
        }

        .send-button-gemini:not(:disabled):hover {
          transform: scale(1.05);
          background: #1f2937;
        }

        @media (max-width: 600px) {
          .gradient-text { font-size: 2.3rem; }
          .hero-greeting-left h1 { font-size: 1.5rem; }
          .canvas { padding-bottom: 120px; }
        }
      `}</style>
    </main>
  )
}
