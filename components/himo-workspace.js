"use client"

import { brand, user, uiText } from "./himo-data"

export function Topbar() {
  return (
    <header className="topbar">
      <div className="mobile-brand">
        <span className="brand-mark">{brand.mark}</span> {brand.name}<span className="brand-dot">{brand.tld}</span>
      </div>
      <div className="top-actions">
        <button className="icon-button" aria-label="Search">⌕</button>
        <button className="upgrade">{uiText.upgrade} <span>↗</span></button>
      </div>
    </header>
  )
}

export function Composer({ value, loading, onChange, onSend, conversation = false }) {
  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) {
      event.preventDefault()
      onSend()
    }
  }

  return (
    <div className={`composer-wrap ${conversation ? "conversation-composer" : ""}`}>
      <div className="composer">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={uiText.placeholder}
          rows={2}
        />
        <div className="composer-footer">
          <div className="composer-tools">
            <button type="button" aria-label="Attach file">＋</button>
            <button type="button" className="tool-label">{uiText.attach}</button>
          </div>
          <button
            type="button"
            className="send-button"
            disabled={!value.trim() || loading}
            onClick={onSend}
          >
            {loading ? "…" : "↑"}
          </button>
        </div>
      </div>
      {!conversation && (
        <p className="hint">{uiText.disclaimer}</p>
      )}
    </div>
  )
}

export function Conversation({ messages, loading, composer }) {
  return (
    <div className="conversation">
      {messages.map((item, index) => (
        <div className={`message ${item.role}`} key={`${item.role}-${index}`}>
          <span className="message-avatar">
            {item.role === "user" ? user.avatar : brand.mark}
          </span>
          <div>
            <p className="message-label">
              {item.role === "user" ? uiText.youLabel : brand.fullName}
            </p>
            <div className="message-content">{item.content}</div>
          </div>
        </div>
      ))}
      {loading && (
        <div className="message assistant">
          <span className="message-avatar">{brand.mark}</span>
          <div>
            <p className="message-label">{brand.fullName}</p>
            <div className="typing">
              <i /><i /><i />
            </div>
          </div>
        </div>
      )}
      {composer}
    </div>
  )
}

export function Welcome({ composer }) {
  return (
    <div className="welcome">
      <div className="welcome-orbit"><span>{brand.mark}</span></div>
      <p className="kicker">{uiText.kicker}</p>
      <h1>{uiText.headingMain}<em>{uiText.headingEm}</em>{uiText.headingEnd}</h1>
      <p className="subtitle">{uiText.subtitle}</p>
      {composer}
    </div>
  )
}

