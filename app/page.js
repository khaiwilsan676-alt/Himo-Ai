"use client"

import { useState } from "react"

export default function Home() {
  const [message, setMessage] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleSend() {
    if (!message.trim()) return
    console.log("Message sent:", message)
    setMessage("")
  }

  return (
    <main className="app-shell">
      {/* Sidebar */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>×</button>
        <div className="sidebar-content">
          <p className="sidebar-title">Menu</p>
          <button className="sidebar-item">New Chat</button>
          <button className="sidebar-item">Settings</button>
          <button className="sidebar-item">Profile</button>
        </div>
      </aside>

      <section className="workspace">
        {/* Top Header */}
        <header className="topbar">
          <button className="brand-button" onClick={() => setSidebarOpen(true)}>
            <span className="brand-mark">H</span>
            <span>himo<span className="brand-dot">.ai</span></span>
          </button>
        </header>

        {/* Middle Area - Empty */}
        <div className="canvas" />

        {/* Bottom Input */}
        <div className="bottom-dock">
          <div className="composer-wrap">
            <div className="composer">
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Message Himo AI..."
                rows={1}
              />
              <button
                type="button"
                className="send-button"
                disabled={!message.trim()}
                onClick={handleSend}
              >
                ↑
              </button>
            </div>
          </div>
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
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .workspace {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        /* Top Bar */
        .topbar {
          height: 60px;
          padding: 0 24px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e5e5e5;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: white;
          z-index: 10;
        }

        .brand-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .brand-mark {
          width: 32px;
          height: 32px;
          background: #1a1a1a;
          color: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 16px;
        }

        .brand-dot {
          color: #666;
        }

        /* Sidebar */
        .sidebar {
          position: fixed;
          top: 0;
          left: -300px;
          width: 300px;
          height: 100vh;
          background: white;
          border-right: 1px solid #e5e5e5;
          transition: left 0.3s ease;
          z-index: 100;
          padding: 20px;
        }

        .sidebar.open {
          left: 0;
        }

        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          z-index: 99;
        }

        .close-sidebar {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }

        .sidebar-content {
          margin-top: 40px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sidebar-title {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
        }

        .sidebar-item {
          padding: 12px;
          background: #f5f5f5;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          text-align: left;
          font-size: 14px;
          color: #1a1a1a;
        }

        .sidebar-item:hover {
          background: #e5e5e5;
        }

        /* Canvas */
        .canvas {
          flex: 1;
          margin-top: 60px;
          margin-bottom: 120px;
          overflow-y: auto;
        }

        /* Bottom Dock */
        .bottom-dock {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px 24px;
          background: white;
          border-top: 1px solid #e5e5e5;
          z-index: 10;
        }

        .composer-wrap {
          max-width: 800px;
          margin: 0 auto;
        }

        .composer {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          background: #fafafa;
        }

        .composer textarea {
          flex: 1;
          border: none;
          background: none;
          outline: none;
          resize: none;
          font-size: 16px;
          font-family: inherit;
          color: #1a1a1a;
        }

        .composer textarea::placeholder {
          color: #999;
        }

        .send-button {
          width: 36px;
          height: 36px;
          background: #1a1a1a;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s;
        }

        .send-button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .send-button:not(:disabled):hover {
          background: #333;
        }
      `}</style>
    </main>
  )
          }
