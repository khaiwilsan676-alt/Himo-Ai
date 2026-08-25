"use client"

import { useState, useRef, useEffect } from "react"
import LoginPage from "@/components/LoginPage"
import { findAnswer } from "@/components/Himoanswer"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  // Auto-resize textarea
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

    setTimeout(() => {
      const answer = findAnswer(prompt)
      setMessages((current) => [
        ...current,
        { role: "assistant", content: answer }
      ])
      setLoading(false)
    }, 600)
  }

  // Show Login Component first
  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />
  }

  return (
    <main className="app-shell">
      {/* Dynamic 30vh Top Gradient Mesh */}
      <div className="top-ambient-glow" />

      {/* Sidebar Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
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
          <button className="footer-item" onClick={() => setIsLoggedIn(false)}>
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
        {/* Top Navbar */}
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

        {/* Messages Canvas */}
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
          <p className="disclaimer-text">
            Himo may display inaccurate info, so double-check its responses.
          </p>
        </div>
      </section>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .app-shell {
          display: flex;
          height: 100vh;
          background: #ffffff;
          color: #1f2937;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
          overflow: hidden;
          position: relative;
        }

        /* Top 30vh Blue, Purple, Green Mix Glow fading to Pure White */
        .top-ambient-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 30vh;
          background: 
            radial-gradient(circle at 15% 15%, rgba(66, 133, 244, 0.22), transparent 45%),
            radial-gradient(circle at 50% 10%, rgba(155, 114, 203, 0.25), transparent 50%),
            radial-gradient(circle at 85% 20%, rgba(52, 168, 83, 0.20), transparent 45%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, #ffffff 100%);
          pointer-events: none;
          z-index: 1;
        }

        .workspace {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
          height: 100vh;
          z-index: 2;
        }

        /* Top Header */
        .topbar {
          height: 64px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: transparent;
        }

        .left-nav {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .brand-name {
          font-size: 1.15rem;
          font-weight: 600;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .brand-badge {
          font-size: 0.75rem;
          padding: 2px 8px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          color: #4b5563;
          font-weight: 500;
          backdrop-filter: blur(4px);
        }

        .icon-btn {
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid #e5e7eb;
          color: #374151;
          cursor: pointer;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .icon-btn:hover {
          background: #f3f4f6;
          color: #111827;
        }

        .avatar-chip {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4285f4, #9b72cb);
          color: #ffffff;
          font-size: 0.9rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(66, 133, 244, 0.25);
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
          box-shadow: 4px 0 24px rgba(0, 0, 0, 0.06);
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

        .sidebar-header {
          display: flex;
          justify-content: flex-start;
          margin-bottom: 16px;
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
          transition: all 0.2s;
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
          border-radius: 20px;
          font-size: 0.88rem;
          color: #4b5563;
          cursor: pointer;
          transition: background 0.15s;
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

        .sidebar-footer {
          border-top: 1px solid #e5e7eb;
          padding-top: 12px;
        }

        .footer-item {
          display: flex;
          align-items: center;
          gap: 12px;
          background: transparent;
          border: none;
          color: #ef4444;
          padding: 10px 14px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.88rem;
          font-weight: 500;
          width: 100%;
        }

        .footer-item:hover {
          background: #fee2e2;
        }

        /* Canvas & Hero */
        .canvas {
          flex: 1;
          overflow-y: auto;
          padding: 0 16px 200px 16px;
          max-width: 820px;
          width: 100%;
          margin: 0 auto;
        }

        .hero-screen {
          margin-top: 6vh;
          animation: fadeIn 0.4s ease-out;
        }

        .hero-greeting {
          margin-bottom: 36px;
        }

        .gradient-text {
          font-size: 3.2rem;
          font-weight: 700;
          background: linear-gradient(90deg, #4285f4, #9b72cb, #34a853);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: block;
          margin-bottom: 4px;
        }

        .hero-greeting h1 {
          font-size: 2.5rem;
          font-weight: 600;
          color: #374151;
          line-height: 1.2;
        }

        .suggestion-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 14px;
        }

        .suggestion-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          padding: 18px;
          border-radius: 18px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 110px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
        }

        .suggestion-card:hover {
          background: #f9fafb;
          border-color: #cbd5e1;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
        }

        .suggestion-card p {
          font-size: 0.95rem;
          font-weight: 600;
          color: #1f2937;
        }

        .suggestion-card span {
          font-size: 0.8rem;
          color: #6b7280;
        }

        /* Message Rows */
        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
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

        .gemini-sparkle {
          color: #4285f4;
          display: flex;
          align-items: center;
          justify-content: center;
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
          border: 1px solid #e5e7eb;
          padding: 12px 18px;
          border-radius: 20px;
          border-top-right-radius: 4px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
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

        /* Shimmer Loading */
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
          background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
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
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Bottom Pure White Composer Dock */
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
          z-index: 10;
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
          border: 1px solid #d1d5db;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          transition: all 0.2s;
        }

        .composer-shell:focus-within {
          border-color: #9b72cb;
          box-shadow: 0 4px 24px rgba(155, 114, 203, 0.18);
        }

        .composer-shell textarea {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #111827;
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
          transition: all 0.15s;
        }

        .send-button-gemini:disabled {
          background: #f3f4f6;
          color: #9ca3af;
          cursor: not-allowed;
        }

        .send-button-gemini:not(:disabled):hover {
          transform: scale(1.05);
          background: #000000;
        }

        .disclaimer-text {
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 10px;
          text-align: center;
        }

        @media (max-width: 600px) {
          .gradient-text { font-size: 2.2rem; }
          .hero-greeting h1 { font-size: 1.8rem; }
          .canvas { padding-bottom: 180px; }
        }
      `}</style>
    </main>
  )
}

