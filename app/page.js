"use client"

import { useState, useRef, useEffect } from "react"
import { findAnswer } from "@/components/Himoanswer"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  
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

  // Fake Login Handler
  function handleLogin(provider) {
    setIsLoggedIn(true)
  }

  function handleSend(textToSend) {
    const prompt = (typeof textToSend === "string" ? textToSend : message).trim()
    if (!prompt || loading) return

    setMessage("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"

    setMessages((current) => [...current, { role: "user", content: prompt }])
    setLoading(true)

    // Local knowledge base answer simulation
    setTimeout(() => {
      const answer = findAnswer(prompt)
      setMessages((current) => [
        ...current,
        { role: "assistant", content: answer }
      ])
      setLoading(false)
    }, 600)
  }

  // 1. Show Login Screen First
  if (!isLoggedIn) {
    return (
      <main className="login-wrapper">
        {/* Background Video */}
        <video autoPlay loop muted playsInline className="bg-video">
          <source src="/VID_20260824_032704_942_bsl.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="video-overlay" />

        {/* Bottom Login Box */}
        <div className="bottom-login-container">
          {/* Google Button */}
          <button className="auth-btn google-btn" onClick={() => handleLogin("Google")}>
            <svg className="btn-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Continue with Google
          </button>

          {/* Gmail Button */}
          <button className="auth-btn gmail-btn" onClick={() => handleLogin("Gmail")}>
            <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Sign in with Gmail
          </button>

          {/* Clickable Privacy Text */}
          <p className="privacy-link" onClick={() => setShowTerms(true)}>
            Login means you agree to the Terms &amp; Privacy Policy
          </p>
        </div>

        {/* Terms Popup Modal */}
        {showTerms && (
          <div className="terms-modal-overlay" onClick={() => setShowTerms(false)}>
            <div className="terms-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Terms &amp; Privacy Policy</h3>
              <p>
                By logging in and using Himo, you agree to our Terms of Service and Privacy Policy. Your conversation data is stored locally for session continuity.
              </p>
              <button className="modal-close-btn" onClick={() => setShowTerms(false)}>
                Close
              </button>
            </div>
          </div>
        )}

        <style jsx>{`
          .login-wrapper {
            position: relative;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
          .bg-video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 0;
          }
          .video-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.45);
            z-index: 1;
          }
          .bottom-login-container {
            position: relative;
            z-index: 2;
            width: 100%;
            max-width: 360px;
            padding: 0 20px 40px 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .auth-btn {
            width: 100%;
            padding: 14px 20px;
            background: #ffffff;
            color: #1f2937;
            font-size: 0.95rem;
            font-weight: 600;
            border-radius: 9999px;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            cursor: pointer;
            box-shadow: 0 4px 14px rgba(0,0,0,0.25);
            transition: transform 0.1s ease, background-color 0.2s;
          }
          .auth-btn:hover {
            background: #f3f4f6;
          }
          .auth-btn:active {
            transform: scale(0.97);
          }
          .gmail-btn {
            background: rgba(255, 255, 255, 0.92);
            backdrop-filter: blur(8px);
          }
          .btn-icon {
            width: 20px;
            height: 20px;
          }
          .privacy-link {
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.85);
            text-align: center;
            margin-top: 6px;
            cursor: pointer;
            text-decoration: underline;
            user-select: none;
          }
          .privacy-link:hover {
            color: #ffffff;
          }
          .terms-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.75);
            z-index: 50;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .terms-modal {
            background: #ffffff;
            color: #111827;
            padding: 24px;
            border-radius: 20px;
            max-width: 380px;
            width: 100%;
            box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3);
          }
          .terms-modal h3 {
            font-size: 1.15rem;
            font-weight: 700;
            margin-bottom: 8px;
          }
          .terms-modal p {
            font-size: 0.88rem;
            color: #4b5563;
            line-height: 1.5;
            margin-bottom: 20px;
          }
          .modal-close-btn {
            width: 100%;
            padding: 10px;
            background: #111827;
            color: #ffffff;
            border: none;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
          }
        `}</style>
      </main>
    )
  }

  // 2. Chat Workspace (Rendered after fake login)
  return (
    <main className="app-shell">
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
          background: #131314;
          color: #e3e3e3;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
          overflow: hidden;
        }

        .workspace {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
          height: 100vh;
        }

        /* Top Header */
        .topbar {
          height: 64px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #131314;
          z-index: 10;
        }

        .left-nav {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .brand-name {
          font-size: 1.15rem;
          font-weight: 500;
          color: #c4c7c5;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .brand-badge {
          font-size: 0.75rem;
          padding: 2px 8px;
          background: #1e1f20;
          border: 1px solid #333538;
          border-radius: 12px;
          color: #9da3a7;
        }

        .icon-btn {
          background: transparent;
          border: none;
          color: #c4c7c5;
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
          background: #282a2c;
        }

        .avatar-chip {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #4a5568;
          color: #ffffff;
          font-size: 0.9rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Sidebar */
        .sidebar {
          position: fixed;
          top: 0;
          left: -320px;
          width: 290px;
          height: 100vh;
          background: #1e1f20;
          transition: left 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 100;
          padding: 16px;
          display: flex;
          flex-direction: column;
        }

        .sidebar.open {
          left: 0;
        }

        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
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
          background: #282a2c;
          border: none;
          color: #e3e3e3;
          padding: 12px 18px;
          border-radius: 24px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 24px;
          transition: background 0.2s;
        }

        .new-chat-btn:hover {
          background: #333538;
        }

        .sidebar-section {
          flex: 1;
          overflow-y: auto;
        }

        .sidebar-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #8e918f;
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
          color: #c4c7c5;
          cursor: pointer;
        }

        .recent-item:hover {
          background: #282a2c;
        }

        .truncate {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-footer {
          border-top: 1px solid #2d2f31;
          padding-top: 12px;
        }

        .footer-item {
          display: flex;
          align-items: center;
          gap: 12px;
          background: transparent;
          border: none;
          color: #c4c7c5;
          padding: 10px 14px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.88rem;
          width: 100%;
        }

        .footer-item:hover {
          background: #282a2c;
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
          margin-top: 8vh;
          animation: fadeIn 0.4s ease-out;
        }

        .hero-greeting {
          margin-bottom: 40px;
        }

        .gradient-text {
          font-size: 3.2rem;
          font-weight: 600;
          background: linear-gradient(74deg, #4285f4 0%, #9b72cb 9%, #d96570 20%, #d96570 24%, #9b72cb 35%, #ffffff 100%);
          background-size: 400% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: block;
          margin-bottom: 4px;
        }

        .hero-greeting h1 {
          font-size: 2.8rem;
          font-weight: 500;
          color: #444746;
          line-height: 1.2;
        }

        .suggestion-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }

        .suggestion-card {
          background: #1e1f20;
          padding: 18px;
          border-radius: 16px;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 110px;
        }

        .suggestion-card:hover {
          background: #282a2c;
          transform: translateY(-2px);
        }

        .suggestion-card p {
          font-size: 0.95rem;
          font-weight: 500;
          color: #e3e3e3;
        }

        .suggestion-card span {
          font-size: 0.8rem;
          color: #8e918f;
        }

        /* Message Rows */
        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 28px;
          padding-top: 24px;
        }

        .message-row {
          display: flex;
          gap: 18px;
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
          background: linear-gradient(135deg, #4285f4, #9b72cb, #d96570);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-icon {
          width: 32px;
          height: 32px;
          background: #333538;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 600;
          color: #e3e3e3;
        }

        .message-bubble {
          max-width: 82%;
        }

        .message-row.user .message-bubble {
          background: #282a2c;
          padding: 12px 18px;
          border-radius: 20px;
          border-top-right-radius: 4px;
        }

        .message-text {
          font-size: 1rem;
          line-height: 1.65;
          color: #e3e3e3;
          word-break: break-word;
        }

        .message-text p {
          margin-bottom: 8px;
        }

        .message-text p:last-child {
          margin-bottom: 0;
        }

        /* Loading Shimmer */
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
          background: linear-gradient(90deg, #282a2c 25%, #3c4043 50%, #282a2c 75%);
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

        /* Bottom Composer Dock */
        .dock-container {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px 20px 20px;
          background: linear-gradient(180deg, transparent 0%, #131314 40%);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .composer-shell {
          width: 100%;
          max-width: 800px;
          background: #1e1f20;
          border-radius: 28px;
          padding: 12px 18px;
          display: flex;
          align-items: flex-end;
          gap: 12px;
          border: 1px solid #2d2f31;
          transition: border-color 0.2s;
        }

        .composer-shell:focus-within {
          border-color: #444746;
          background: #202124;
        }

        .composer-shell textarea {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #e3e3e3;
          font-size: 1rem;
          font-family: inherit;
          resize: none;
          max-height: 160px;
          line-height: 1.5;
          padding-top: 4px;
        }

        .composer-shell textarea::placeholder {
          color: #8e918f;
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
          background: #e3e3e3;
          color: #131314;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.1s;
        }

        .send-button-gemini:disabled {
          background: #282a2c;
          color: #8e918f;
          cursor: not-allowed;
        }

        .send-button-gemini:not(:disabled):hover {
          transform: scale(1.05);
        }

        .disclaimer-text {
          font-size: 0.75rem;
          color: #8e918f;
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

