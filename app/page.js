"use client"

import { useState } from "react"
import { Sidebar } from "../components/himo-sidebar"
import { Composer, Conversation, Topbar, Welcome } from "../components/himo-workspace"

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
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: prompt }) })
      const data = await res.json()
      setMessages((current) => [...current, { role: "assistant", content: res.ok ? data.reply : data.error || "Something went wrong" }])
    } catch {
      setMessages((current) => [...current, { role: "assistant", content: "Unable to connect right now. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  const composer = <Composer mode={mode} value={message} loading={loading} onChange={setMessage} onSend={() => sendMessage()} />
  const conversationComposer = <Composer mode={mode} value={message} loading={loading} onChange={setMessage} onSend={() => sendMessage()} conversation />

  return (
    <main className="app-shell">
      <Sidebar mode={mode} onModeChange={setMode} onNewConversation={() => setMessages([])} />
      <section className="workspace">
        <Topbar />
        <div className={`canvas ${messages.length ? "has-messages" : ""}`}>
          {!messages.length ? <Welcome mode={mode} onModeChange={setMode} composer={composer} /> : <Conversation messages={messages} loading={loading} composer={conversationComposer} />}
        </div>
        <footer className="footer-note"><span>Himo AI</span><span>Built for curious minds · {new Date().getFullYear()}</span></footer>
      </section>
    </main>
  )
}
