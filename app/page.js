"use client"

import { useState } from "react"

const brand = {
  name: "himo",
  mark: "H",
  tld: ".ai",
  fullName: "Himo AI"
}

const user = {
  name: "Khaiwilsan",
  avatar: "KS",
  plan: "Personal plan"
}

const modes = [
  { id: "chat", label: "Chat", icon: "✦", description: "Ask anything" },
  { id: "code", label: "Code", icon: "</>", description: "Build and debug" },
  { id: "image", label: "Image", icon: "▧", description: "Create visuals" },
  { id: "video", label: "Video", icon: "▶", description: "Bring ideas to life" }
]

const examples = [
  "Explain quantum computing simply",
  "Write a landing page in React",
  "Create a cinematic product shot",
  "Make a 10-second travel video"
]

const recentConversations = [
  "Ideas for a new startup",
  "Refactor auth middleware",
  "Tokyo travel itinerary"
]

const uiText = {
  kicker: "Your creative intelligence",
  headingMain: "What will ",
  headingEm: "create",
  headingEnd: " today?",
  subtitle: "Chat, code, and bring your ideas to life with Himo AI.",
  placeholder: "Message Himo AI...",
  attach: "Attach",
  disclaimer: "Himo can make mistakes. Check important information.",
  upgrade: "Upgrade",
  newConversation: "New conversation",
  recentHeading: "Recent",
  settings: "Settings",
  youLabel: "You"
}

function Brand({ mobile = false }) {
  return (
    <div className={mobile ? "mobile-brand" : "brand"}>
      <span className="brand-mark">{brand.mark}</span>
      <span>{brand.name}<span className="brand-dot">{brand.tld}</span></span>
    </div>
  )
}

function Topbar() {
  return (
    <header className="topbar">
      <Brand mobile={true} />
      <div className="top-actions">
        <button className="icon-button" aria-label="Search">⌕</button>
        <button className="upgrade">{uiText.upgrade} <span>↗</span></button>
      </div>
    </header>
  )
}

function Sidebar({ mode, onModeChange, onNewConversation }) {
  return (
    <aside className="sidebar">
      <Brand />
      <button className="new-chat" onClick={onNewConversation}>
        <span>＋</span> {uiText.newConversation} <kbd>⌘ K</kbd>
      </button>

      <div className="side-section">
        <p className="eyebrow">Workspace</p>
        {modes.map((item) => (
          <button
            key={item.id}
            className={`side-mode ${mode === item.id ? "selected" : ""}`}
            onClick={() => onModeChange(item.id)}
          >
            <span className="mode-icon">{item.icon}</span>
            <span>
              <strong>{item.label}</strong>
              <small>{item.description}</small>
            </span>
          </button>
        ))}
      </div>

      <div className="side-section recent">
        <p className="eyebrow">{uiText.recentHeading}</p>
        {recentConversations.map((conversation, idx) => (
          <button key={idx}>{conversation}</button>
        ))}
      </div>

      <div className="sidebar-bottom">
        <button className="utility"><span>◌</span> {uiText.settings}</button>
        <div className="profile">
          <span className="avatar">{user.avatar}</span>
          <span><strong>{user.name}</strong><small>{user.plan}</small></span>
          <span className="more">···</span>
        </div>
      </div>
    </aside>
  )
}

function Composer({ mode, value, loading, onChange, onSend, conversation = false }) {
  const activeMode = modes.find((m) => m.id === mode) || modes[0]
  const isCreator = mode === "image" || mode === "video"

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) {
      event.preventDefault()
      onSend()
    }
  }

  const placeholderText = conversation
    ? "Continue the conversation..."
    : isCreator
    ? `Describe the ${mode} you want to create...`
    : `Message Himo ${activeMode.label}...`

  return (
    <div className={`composer-wrap ${conversation ? "conversation-composer-wrap" : ""}`}>
      <div className={`composer ${conversation ? "conversation-composer" : ""}`}>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText}
          rows={conversation ? 1 : 2}
        />
        <div className="composer-footer">
          <div className="composer-tools">
            <button type="button" aria-label="Attach file">＋</button>
            <button type="button" className="tool-label">{uiText.attach}</button>
            <span className="divider" />
            <button type="button" className="tool-label">
              {activeMode.icon} {activeMode.label}
            </button>
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

function Conversation({ messages, loading, composer }) {
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

function Welcome({ mode, onModeChange, composer, onSelectExample }) {
  return (
    <div className="welcome">
      <div className="welcome-orbit"><span>{brand.mark}</span></div>
      <p className="kicker">{uiText.kicker}</p>
      <h1>{uiText.headingMain}<em>{uiText.headingEm}</em>{uiText.headingEnd}</h1>
      <p className="subtitle">{uiText.subtitle}</p>

      <div className="mode-tabs">
        {modes.map((item) => (
          <button
            key={item.id}
            className={mode === item.id ? "active" : ""}
            onClick={() => onModeChange(item.id)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {composer}

      <div className="example-pills">
        {examples.map((example, idx) => (
          <button key={idx} className="example-chip" onClick={() => onSelectExample(example)}>
            {example}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const [mode, setMode] = useState("chat")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  async function sendMessage(value = message) {
    if (!value.trim() || loading) return
    const prompt = value.trim()
    setMessage("")
    setMessages((current) => [...current, { role: "user", content: prompt }])
    setLoading(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, mode })
      })
      const data = await res.json()
      setMessages((current) => [
        ...current,
        { role: "assistant", content: res.ok ? data.reply : data.error || "Something went wrong" }
      ])
    } catch {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: "Unable to connect right now. Please try again." }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSelectExample = (exampleText) => {
    setMessage(exampleText)
    sendMessage(exampleText)
  }

  const composer = (
    <Composer
      mode={mode}
      value={message}
      loading={loading}
      onChange={setMessage}
      onSend={() => sendMessage()}
    />
  )

  const conversationComposer = (
    <Composer
      mode={mode}
      value={message}
      loading={loading}
      onChange={setMessage}
      onSend={() => sendMessage()}
      conversation={true}
    />
  )

  return (
    <main className="app-shell">
      <Sidebar
        mode={mode}
        onModeChange={setMode}
        onNewConversation={() => setMessages([])}
      />
      <section className="workspace">
        <Topbar />
        <div className={`canvas ${messages.length ? "has-messages" : ""}`}>
          {!messages.length ? (
            <Welcome
              mode={mode}
              onModeChange={setMode}
              composer={composer}
              onSelectExample={handleSelectExample}
            />
          ) : (
            <Conversation
              messages={messages}
              loading={loading}
              composer={conversationComposer}
            />
          )}
        </div>
        <footer className="footer-note">
          <span>{brand.fullName}</span>
          <span>Built for curious minds · {new Date().getFullYear()}</span>
        </footer>
      </section>
    </main>
  )
}
