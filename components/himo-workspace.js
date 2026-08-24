"use client"

import { getPlaceholder, modes } from "./himo-data"

export function Topbar() {
  return <header className="topbar"><div className="mobile-brand"><span className="brand-mark">H</span> himo<span className="brand-dot">.</span>ai</div><div className="top-actions"><button className="icon-button" aria-label="Search">⌕</button><button className="upgrade">Upgrade <span>↗</span></button></div></header>
}

export function ModeTabs({ mode, onModeChange }) {
  return <div className="mode-tabs">{modes.map((item) => <button key={item.id} className={mode === item.id ? "active" : ""} onClick={() => onModeChange(item.id)}><span>{item.icon}</span>{item.label}</button>)}</div>
}

export function Composer({ mode, value, loading, onChange, onSend, conversation = false }) {
  const active = modes.find((item) => item.id === mode) || modes[0]
  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) {
      event.preventDefault()
      onSend()
    }
  }
  return <div className={`composer-wrap ${conversation ? "conversation-composer" : ""}`}><div className="composer"><textarea value={value} onChange={(event) => onChange(event.target.value)} onKeyDown={handleKeyDown} placeholder={getPlaceholder(active)} rows={2} /><div className="composer-footer"><div className="composer-tools"><button aria-label="Attach file">＋</button><button className="tool-label">Attach</button><span className="divider"/><button className="tool-label">{active.icon} {active.label}</button></div><button className="send-button" disabled={!value.trim() || loading} onClick={onSend}>{loading ? "…" : "↑"}</button></div></div>{!conversation && <p className="hint">Himo can make mistakes. Check important information.</p>}</div>
}

export function Conversation({ messages, loading, composer }) {
  return <div className="conversation">{messages.map((item, index) => <div className={`message ${item.role}`} key={`${item.role}-${index}`}><span className="message-avatar">{item.role === "user" ? "KS" : "H"}</span><div><p className="message-label">{item.role === "user" ? "You" : "Himo AI"}</p><div className="message-content">{item.content}</div></div></div>)}{loading && <div className="message assistant"><span className="message-avatar">H</span><div><p className="message-label">Himo AI</p><div className="typing"><i/><i/><i/></div></div></div>}{composer}</div>
}

export function Welcome({ mode, onModeChange, composer }) {
  return <div className="welcome"><div className="welcome-orbit"><span>H</span></div><p className="kicker">Your creative intelligence</p><h1>What will you <em>create</em> today?</h1><p className="subtitle">Chat, code, and bring your ideas to life with Himo AI.</p><ModeTabs mode={mode} onModeChange={onModeChange}/>{composer}</div>
}
