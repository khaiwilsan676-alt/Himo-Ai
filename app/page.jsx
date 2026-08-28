"use client"

import { useState, useRef, useEffect } from "react"
import LoginPage from "../components/LoginPage"
import MathMasterEngine from "../src/lib/mathMasterEngine"
import { generateCodeFromPrompt } from "../src/lib/codeMasterEngine"
import { fetchLiveWebData } from "../src/lib/webSearchEngine"
import { handleDeviceAction } from "../src/lib/deviceControlEngine"
import { getHumanReply } from "../src/lib/humanTalkEngine"
import { auth } from "../src/lib/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { 
  saveChatToDB, 
  getAllChatsFromDB, 
  deleteChatFromDB,
  saveTrainedKnowledge,
  getTrainedKnowledge,
  deleteTrainedKnowledge,
  clearAllTrainedKnowledge 
} from "../src/lib/indexedDbStorage"

function CodeBlock({ codeText }) {
  const [copied, setCopied] = useState(false)
  const raw = typeof codeText === "string" ? codeText : ""
  const firstLine = raw.split("\n")[0] || ""
  const langMatch = firstLine.match(/^```(\w+)?/)
  const language = (langMatch && langMatch[1]) ? langMatch[1].toUpperCase() : "CODE"
  const cleanCode = raw.replace(/^```[a-zA-Z0-9_-]*\n?/, "").replace(/```$/, "").trim()

  const handleCopy = () => {
    try {
      if (typeof navigator !== "undefined") {
        navigator.clipboard.writeText(cleanCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (e) {}
  }

  return (
    <div className="dark-code-card">
      <div className="dark-code-header">
        <span className="lang-badge-tag">{language}</span>
        <button type="button" onClick={handleCopy} className="copy-icon-btn" title="Copy code">
          {copied ? <span className="copied-tag">✓ Copied</span> : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
        </button>
      </div>
      <div className="dark-code-scroll">
        <pre className="dark-pre-text"><code>{cleanCode}</code></pre>
      </div>
    </div>
  )
}

function ProceduralImageCard({ seedNumber, promptText, onImageClick }) {
  const canvasRef = useRef(null)
  const [dataUrl, setDataUrl] = useState("")

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const size = 512
    canvas.width = size
    canvas.height = size

    const num = parseInt(seedNumber) || 5
    const hueBase = (num * 36) % 360
    
    const grad = ctx.createLinearGradient(0, 0, size, size)
    grad.addColorStop(0, `hsl(${hueBase}, 85%, 12%)`)
    grad.addColorStop(0.5, `hsl(${(hueBase + 50)%360}, 75%, 22%)`)
    grad.addColorStop(1, `hsl(${(hueBase + 100)%360}, 90%, 8%)`)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)

    const shapes = (num + 2) * 5
    for (let i = 0; i < shapes; i++) {
      ctx.beginPath()
      const x = (Math.sin(i * num + 2) * 0.5 + 0.5) * size
      const y = (Math.cos(i * num * 0.8) * 0.5 + 0.5) * size
      const radius = ((i * 19) % 130) + 15

      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${(hueBase + i * 20) % 360}, 80%, 55%, 0.3)`
      ctx.fill()
      ctx.lineWidth = 2
      ctx.strokeStyle = `hsla(${(hueBase + i * 25) % 360}, 90%, 75%, 0.5)`
      ctx.stroke()
    }

    ctx.save()
    ctx.translate(size / 2, size / 2)
    const rings = num === 0 ? 6 : num + 2
    for (let r = 0; r < rings; r++) {
      ctx.rotate((Math.PI / rings) * (num + 1))
      ctx.strokeRect(-r * 20, -r * 20, r * 40, r * 40)
    }
    ctx.restore()

    ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
    ctx.font = "bold 18px monospace"
    ctx.fillText(`HIMO OMNI // SEED [${num}]`, 24, size - 28)

    setDataUrl(canvas.toDataURL("image/png"))
  }, [seedNumber])

  return (
    <div className="gemini-img-container" onClick={() => dataUrl && onImageClick(dataUrl)}>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {dataUrl ? (
        <img src={dataUrl} alt={promptText} className="gemini-real-img" />
      ) : (
        <div className="gemini-gen-card"><span>Rendering...</span></div>
      )}
    </div>
  )
}

function cleanFormatting(text) {
  if (!text) return ""
  return text.replace(/\*\*/g, "").replace(/\*/g, "")
}

function renderMessageContent(content, onImageClick) {
  if (typeof content === "object" && content?.type === "procedural_image") {
    return <ProceduralImageCard seedNumber={content.seed} promptText={content.prompt} onImageClick={onImageClick} />
  }

  const text = typeof content === "string" ? content : ""

  if (text.includes("```")) {
    const parts = text.split(/(```[\s\S]*?```)/g)
    return parts.map((part, i) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        return <CodeBlock key={i} codeText={part} />
      }
      if (!part.trim()) return null
      return (
        <div key={i} className="text-prose-row">
          {cleanFormatting(part).split("\n").map((line, j) => (
            <p key={j}>{line || "\u00A0"}</p>
          ))}
        </div>
      )
    })
  }

  return (
    <div className="text-prose-row">
      {cleanFormatting(text).split("\n").map((line, i) => (
        <p key={i}>{line || "\u00A0"}</p>
      ))}
    </div>
  )
}

async function stopVoicePlayback() {
  if (typeof window === "undefined") return
  try {
    const { TextToSpeech } = await import("@capacitor-community/text-to-speech")
    await TextToSpeech.stop()
  } catch (e) {}
  try { if ("speechSynthesis" in window) window.speechSynthesis.cancel() } catch (e) {}
}

async function speakVoice(text) {
  if (!text || typeof window === "undefined") return
  try {
    await stopVoicePlayback()
    const cleanText = text.replace(/```[\s\S]*?```/g, "Code ready hai.").replace(/[#*•_`]/g, "").trim()
    if (!cleanText) return

    try {
      const { TextToSpeech } = await import("@capacitor-community/text-to-speech")
      await TextToSpeech.speak({ text: cleanText.slice(0, 250), lang: "hi-IN", rate: 1.0, pitch: 1.0, volume: 1.0, category: "ambient" })
      return
    } catch (nativeErr) {}

    if ("speechSynthesis" in window) {
      window.speechSynthesis.resume()
      const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 250))
      utterance.rate = 1.0
      utterance.lang = "hi-IN"
      window.speechSynthesis.speak(utterance)
    }
  } catch (err) {}
}

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null)
  const [authChecking, setAuthChecking] = useState(true)
  const [message, setMessage] = useState("")
  const [currentChatId, setCurrentChatId] = useState(null)
  const [savedSessions, setSavedSessions] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [topMenuOpen, setTopMenuOpen] = useState(false)
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false)

  const [attachedImage, setAttachedImage] = useState(null)
  const [plusMenuOpen, setPlusMenuOpen] = useState(false)
  const [previewModalImg, setPreviewModalImg] = useState(null)

  const [isTrainingModeActive, setIsTrainingModeActive] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)
  const [pinDigits, setPinDigits] = useState(["", "", "", ""])
  const [pinError, setPinError] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(null)

  const fileInputRef = useRef(null)
  const mediaStreamRef = useRef(null)
  const recognitionRef = useRef(null)
  const pinInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]
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
      try {
        if (user) {
          const userData = { uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL }
          setCurrentUser(userData)
          localStorage.setItem("himo_cached_user", JSON.stringify(userData))
        } else {
          setCurrentUser(null)
          localStorage.removeItem("himo_cached_user")
        }
      } catch (e) {}
      setAuthChecking(false)
    })

    getAllChatsFromDB().then((chats) => {
      if (chats && chats.length > 0) {
        setSavedSessions(chats.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.updatedAt - a.updatedAt))
      }
    }).catch(() => {})

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`
    }
  }, [message])

  useEffect(() => {
    const handleOutsideClick = () => {
      setTopMenuOpen(false)
      setSettingsMenuOpen(false)
      setPlusMenuOpen(false)
    }
    window.addEventListener("click", handleOutsideClick)
    return () => window.removeEventListener("click", handleOutsideClick)
  }, [])

  const persistChatSession = async (updatedMessages, chatId = currentChatId) => {
    try {
      if (!updatedMessages || updatedMessages.length === 0) return
      const id = chatId || `chat_${Date.now()}`
      if (!currentChatId) setCurrentChatId(id)

      const firstUserMsg = updatedMessages.find(m => m.role === "user")?.content || "New conversation"
      const currentSession = savedSessions.find(s => s.id === id)
      
      const sessionObj = {
        id: id,
        title: currentSession?.title || (firstUserMsg.length > 28 ? firstUserMsg.slice(0, 28) + "..." : firstUserMsg),
        pinned: currentSession?.pinned || false,
        messages: updatedMessages,
        updatedAt: Date.now()
      }

      await saveChatToDB(sessionObj)
      setSavedSessions(prev => [sessionObj, ...prev.filter(s => s.id !== id)].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.updatedAt - a.updatedAt))
    } catch (e) {}
  }

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (uploadEvent) => setAttachedImage(uploadEvent.target.result)
      reader.readAsDataURL(file)
    }
    setPlusMenuOpen(false)
  }

  const handlePinChange = (val, idx) => {
    if (val.length > 1) val = val.slice(-1)
    const updated = [...pinDigits]
    updated[idx] = val
    setPinDigits(updated)
    setPinError("")
    if (val && idx < 3) pinInputRefs[idx + 1].current?.focus()
  }

  const handlePinKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !pinDigits[idx] && idx > 0) pinInputRefs[idx - 1].current?.focus()
  }

  const handleVerifyPinAndActivateMode = () => {
    if (pinDigits.join("") === "5656") {
      setShowPinModal(false)
      setPinDigits(["", "", "", ""])
      setPinError("")
      setIsTrainingModeActive(true)
      speakVoice("Training mode active.")
    } else {
      setPinError("Galat PIN! (5656)")
    }
  }

  const generateProceduralArt = (promptText) => {
    const text = promptText.trim()
    const match = text.match(/\d/)
    const seedNum = match ? parseInt(match[0]) : Math.floor(Math.random() * 10)
    return { type: "procedural_image", seed: seedNum, prompt: text }
  }

  async function think(prompt, hasAttachedPhoto = false) {
    const q = prompt.trim()
    const qLower = q.toLowerCase()

    const isCodeRequest = 
      qLower.startsWith("write code") || 
      qLower.startsWith("code ") || 
      qLower.includes("ka code") || 
      qLower.includes("function") || 
      qLower.includes("script") ||
      qLower.includes("html") ||
      qLower.includes("component") ||
      qLower.includes("react") ||
      qLower.includes("javascript") ||
      qLower.includes("python") ||
      qLower.includes("css") ||
      qLower.includes("sql")

    if (isCodeRequest) {
      const codeOutput = generateCodeFromPrompt(q)
      if (codeOutput) return codeOutput
    }

    const isImageGenRequest = 
      qLower.includes("image") || 
      qLower.includes("photo") || 
      qLower.includes("tasveer") || 
      qLower.includes("picture") || 
      qLower.includes("banao") || 
      qLower.includes("bana") ||
      /\d/.test(qLower)

    if (isImageGenRequest) {
      return generateProceduralArt(q)
    }

    if (hasAttachedPhoto) return "Okk photo dekh li hai, mast lag rahi hai!"

    if (qLower.includes("kya haal hai") || qLower.includes("sup")) {
      return "Ooo sab badhiya scene hai! Tu bata, kya chal raha hai?"
    }

    const humanTalk = getHumanReply(q)
    if (humanTalk) return humanTalk

    try {
      const memoryAns = await getTrainedKnowledge(q)
      if (memoryAns) return cleanFormatting(memoryAns)
    } catch (e) {}

    try {
      const mathResult = MathMasterEngine.evaluate(q)
      if (mathResult) return cleanFormatting(mathResult)
    } catch (e) {}

    return `Ooo sun, '${q}' par local processing complete hai!`
  }

  async function handleSend(textToSend) {
    const prompt = (typeof textToSend === "string" ? textToSend : message).trim()
    const currentPhoto = attachedImage
    if ((!prompt && !currentPhoto) || loading) return

    setMessage("")
    setAttachedImage(null)
    if (textareaRef.current) textareaRef.current.style.height = "auto"

    const newMsgs = [...messages, { role: "user", content: prompt || "Photo shared 📷", attachedPhoto: currentPhoto }]
    setMessages(newMsgs)
    setLoading(true)
    await persistChatSession(newMsgs)

    try {
      let answer = await think(prompt || "Explain photo", !!currentPhoto)
      if (typeof answer !== "object") speakVoice(answer)

      const finalMsgs = [...newMsgs, { role: "assistant", content: answer }]
      setMessages(finalMsgs)
      await persistChatSession(finalMsgs)
    } catch (error) {
      setMessages([...newMsgs, { role: "assistant", content: "Ooo error ho gaya, dubara bol." }])
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    try {
      await signOut(auth)
      localStorage.removeItem("himo_cached_user")
      setCurrentUser(null)
    } catch (e) {}
  }

  if (authChecking) return <div className="auth-loading-screen"><div className="loader-spinner"></div></div>
  if (!currentUser) return <LoginPage onLoginSuccess={(u) => setCurrentUser(u)} />

  const userInitial = currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : "U"
  const isTyping = message.trim().length > 0 || !!attachedImage

  return (
    <main className="app-shell">
      <div className="top-glow-mesh" />
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <input type="file" ref={fileInputRef} accept="image/*" style={{ display: "none" }} onChange={handleImageSelect} />

      {previewModalImg && (
        <div className="image-viewer-modal" onClick={() => setPreviewModalImg(null)}>
          <div className="viewer-content-card" onClick={(e) => e.stopPropagation()}>
            <button className="viewer-close-btn" onClick={() => setPreviewModalImg(null)}>✕</button>
            <div className="viewer-img-holder"><img src={previewModalImg} alt="Preview" className="viewer-full-img" /></div>
            <div className="viewer-bottom-bar">
              <a href={previewModalImg} target="_blank" rel="noreferrer" download="himo_art.png" className="viewer-save-btn">Save Image</a>
            </div>
          </div>
        </div>
      )}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-top-spacer" />
        <button className="new-chat-btn" onClick={() => { setMessages([]); setCurrentChatId(null); setSidebarOpen(false); }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
          New chat
        </button>

        <div className="sidebar-section">
          <p className="sidebar-label">Recent</p>
          <div className="recent-list">
            {savedSessions.map((s) => (
              <div key={s.id} className={`recent-item ${s.id === currentChatId ? "active-chat-item" : ""}`} onClick={() => { setCurrentChatId(s.id); setMessages(s.messages || []); setSidebarOpen(false); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                <span className="truncate flex-1">{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="user-info-wrapper">
            <div className="avatar-chip footer-avatar-circle">{userInitial}</div>
            <div className="user-email-text">{currentUser.email || "User"}</div>
          </div>
          <button type="button" className="settings-icon-btn" onClick={handleLogout}>🚪</button>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="left-nav">
            <button className="icon-btn" onClick={() => setSidebarOpen(true)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <span className="brand-name">Himo Omni</span>
          </div>
        </header>

        <div className="canvas">
          {messages.length === 0 && (
            <div className="hero-screen-top-left">
              <div className="hero-greeting-left">
                <span className="gradient-text animated-shimmer">Himo Omni</span>
                <h1 className="hero-main-title">How can I help you today?</h1>
              </div>
            </div>
          )}

          <div className="messages-list">
            {messages.map((msg, index) => (
              <div key={index} className={`message-row ${msg.role}`}>
                <div className="message-bubble">
                  {msg.attachedPhoto && (
                    <div className="chat-attached-image-wrapper" onClick={() => setPreviewModalImg(msg.attachedPhoto)}>
                      <img src={msg.attachedPhoto} alt="Shared" className="user-chat-img" />
                    </div>
                  )}
                  <div className="message-text">
                    {renderMessageContent(msg.content, (url) => setPreviewModalImg(url))}
                  </div>
                </div>
              </div>
            ))}
            {loading && <div className="message-row assistant"><div className="message-bubble">Processing...</div></div>}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="dock-container">
          {attachedImage && (
            <div className="attached-photo-preview-bar">
              <div className="preview-thumb-box">
                <img src={attachedImage} alt="Attachment" className="thumb-img" />
                <button type="button" onClick={() => setAttachedImage(null)} className="remove-thumb-btn">✕</button>
              </div>
              <span className="preview-caption-hint">Photo ready</span>
            </div>
          )}

          <div className={`composer-shell ${isTyping ? "typing-active" : ""}`}>
            <button type="button" className="plus-action-btn" onClick={() => fileInputRef.current?.click()}>+</button>
            <textarea 
              ref={textareaRef} 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} 
              placeholder="Ask Himo or enter number 0-9 for art..." 
              rows={1} 
            />
            <button type="button" className={`send-button-gemini ${isTyping ? "active-glow-btn" : ""}`} onClick={() => handleSend()}>➤</button>
          </div>
        </div>
      </section>

      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        .app-shell { display: flex; height: 100dvh; width: 100vw; background: #ffffff; color: #1f2937; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; overflow: hidden; position: fixed; inset: 0; }
        .top-glow-mesh { position: absolute; top: 0; left: 0; right: 0; height: 35vh; pointer-events: none; z-index: 1; background: radial-gradient(circle at 15% 30%, rgba(96, 165, 250, 0.4), transparent 60%), radial-gradient(circle at 45% 20%, rgba(244, 114, 182, 0.35), transparent 55%), radial-gradient(circle at 75% 35%, rgba(52, 211, 153, 0.3), transparent 55%), radial-gradient(circle at 90% 15%, rgba(192, 132, 252, 0.35), transparent 60%), linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%); filter: blur(24px); }
        .workspace { flex: 1; display: flex; flex-direction: column; position: relative; height: 100%; width: 100%; z-index: 2; overflow: hidden; }
        .topbar { height: 56px; padding: 0 16px; display: flex; align-items: center; justify-content: space-between; }
        .left-nav { display: flex; align-items: center; gap: 10px; }
        .brand-name { font-size: 1.2rem; font-weight: 700; color: #111827; }
        .icon-btn { background: transparent; border: none; color: #374151; cursor: pointer; border-radius: 50%; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; }

        .sidebar { position: fixed; top: 0; left: -320px; width: 280px; height: 100dvh; background: #ffffff; border-right: 1px solid #e5e7eb; transition: left 0.25s ease; z-index: 100; padding: 16px; display: flex; flex-direction: column; }
        .sidebar.open { left: 0; }
        .sidebar-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.3); backdrop-filter: blur(2px); z-index: 99; }
        .new-chat-btn { display: flex; align-items: center; gap: 10px; background: #f3f4f6; border: 1px solid #e5e7eb; color: #1f2937; padding: 10px 16px; border-radius: 20px; cursor: pointer; font-size: 0.88rem; font-weight: 500; margin-bottom: 20px; }
        .sidebar-section { flex: 1; overflow-y: auto; }
        .sidebar-label { font-size: 0.72rem; font-weight: 600; color: #9ca3af; margin-bottom: 10px; text-transform: uppercase; }
        .recent-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 12px; font-size: 0.85rem; color: #4b5563; cursor: pointer; }
        .active-chat-item { background: #eff6ff; color: #2563eb; font-weight: 600; }
        .sidebar-footer { border-top: 1px solid #e5e7eb; padding-top: 12px; display: flex; align-items: center; justify-content: space-between; }
        .user-info-wrapper { display: flex; align-items: center; gap: 8px; overflow: hidden; max-width: 190px; }
        .footer-avatar-circle { width: 36px; height: 36px; border-radius: 50%; background: #3b82f6; color: #ffffff; font-weight: 700; display: flex; align-items: center; justify-content: center; }
        .user-email-text { font-size: 0.82rem; font-weight: 600; color: #1f2937; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .settings-icon-btn { background: transparent; border: none; font-size: 1.2rem; cursor: pointer; }

        .canvas { flex: 1; overflow-y: auto; padding: 0 16px 130px 16px; max-width: 800px; width: 100%; margin: 0 auto; }
        .hero-screen-top-left { margin-top: 24px; }
        .gradient-text { font-size: 3rem; font-weight: 800; display: inline-block; margin-bottom: 4px; }
        .animated-shimmer { background: linear-gradient(90deg, #2563eb 0%, #7c3aed 20%, #ec4899 40%, #06b6d4 60%, #10b981 80%, #2563eb 100%); background-size: 300% 100%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: fluidShimmer 4s linear infinite; }
        @keyframes fluidShimmer { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .hero-main-title { font-size: 2.2rem; font-weight: 700; color: #111827; }

        .messages-list { display: flex; flex-direction: column; gap: 14px; padding-top: 16px; }
        .message-row { display: flex; width: 100%; }
        .message-row.user { justify-content: flex-end; }
        .message-row.assistant { justify-content: flex-start; }
        .message-bubble { max-width: 100%; width: 100%; }
        .message-row.user .message-bubble { background: #f3f4f6; padding: 10px 16px; border-radius: 18px; max-width: 85%; width: fit-content; }
        .message-text { font-size: 0.96rem; line-height: 1.55; color: #1f2937; width: 100%; }
        .text-prose-row { margin-bottom: 6px; }

        .chat-attached-image-wrapper { margin-bottom: 8px; max-width: 220px; border-radius: 14px; overflow: hidden; cursor: pointer; }
        .user-chat-img { width: 100%; height: auto; display: block; border-radius: 14px; }

        .gemini-img-container { width: 260px; height: 260px; border-radius: 18px; overflow: hidden; margin: 6px 0; box-shadow: 0 4px 16px rgba(0,0,0,0.08); cursor: pointer; border: 1px solid #e2e8f0; background: #f8fafc; }
        .gemini-real-img { width: 100%; height: 100%; object-fit: cover; border-radius: 18px; display: block; }
        .gemini-gen-card { padding: 20px; text-align: center; color: #64748b; font-size: 0.85rem; }

        .dark-code-card { background: #0f172a; border: 1px solid #1e293b; border-radius: 14px; overflow: hidden; margin: 10px 0; width: 100%; }
        .dark-code-header { display: flex; justify-content: space-between; align-items: center; background: #1e293b; padding: 8px 14px; border-bottom: 1px solid #334155; }
        .lang-badge-tag { font-size: 0.72rem; font-weight: 700; color: #94a3b8; font-family: monospace; }
        .copy-icon-btn { background: transparent; border: none; color: #94a3b8; cursor: pointer; padding: 4px; }
        .copied-tag { color: #34d399; font-size: 0.75rem; }
        .dark-code-scroll { padding: 14px; overflow-x: auto; background: #0f172a; max-width: 100%; }
        .dark-pre-text { margin: 0; font-family: monospace; font-size: 0.85rem; color: #e2e8f0; white-space: pre-wrap; word-break: break-word; }

        .dock-container { position: absolute; bottom: 0; left: 0; right: 0; padding: 8px 14px 14px; background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 40%); display: flex; flex-direction: column; align-items: center; z-index: 10; }
        .attached-photo-preview-bar { display: flex; align-items: center; gap: 10px; width: 100%; max-width: 800px; margin-bottom: 6px; padding: 0 4px; }
        .preview-thumb-box { position: relative; width: 44px; height: 44px; border-radius: 10px; overflow: hidden; border: 1.5px solid #3b82f6; }
        .thumb-img { width: 100%; height: 100%; object-fit: cover; }
        .remove-thumb-btn { position: absolute; top: 1px; right: 1px; background: rgba(0,0,0,0.7); color: #fff; border: none; border-radius: 50%; width: 16px; height: 16px; font-size: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .preview-caption-hint { font-size: 0.78rem; color: #4b5563; font-weight: 500; }

        .composer-shell { width: 100%; max-width: 800px; background: #ffffff; border-radius: 26px; padding: 6px 12px; display: flex; align-items: flex-end; gap: 8px; border: 1.5px solid #e5e7eb; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .composer-shell.typing-active { border-color: transparent; background: linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(90deg, #2563eb, #9333ea, #ec4899, #06b6d4, #2563eb) border-box; background-size: 100% 100%, 300% 100%; animation: borderGlowFlow 3s linear infinite; }
        @keyframes borderGlowFlow { 0% { background-position: 0% 0%, 0% 50%; } 50% { background-position: 0% 0%, 100% 50%; } 100% { background-position: 0% 0%, 0% 50%; } }

        .plus-action-btn { width: 34px; height: 34px; border-radius: 50%; background: #f3f4f6; color: #4b5563; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .composer-shell textarea { flex: 1; background: transparent; border: none; outline: none; color: #111827; font-size: 0.95rem; resize: none; max-height: 140px; padding: 6px 0; }
        .send-button-gemini { width: 34px; height: 34px; border-radius: 50%; background: #111827; color: #ffffff; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .active-glow-btn { background: linear-gradient(135deg, #2563eb, #7c3aed); }

        .image-viewer-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.88); backdrop-filter: blur(8px); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 16px; }
        .viewer-content-card { position: relative; max-width: 480px; width: 100%; background: #0f172a; border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 20px 40px rgba(0,0,0,0.5); border: 1px solid #1e293b; }
        .viewer-close-btn { position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.6); color: #ffffff; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; z-index: 10; display: flex; align-items: center; justify-content: center; }
        .viewer-img-holder { width: 100%; max-height: 70vh; display: flex; align-items: center; justify-content: center; background: #000; }
        .viewer-full-img { width: 100%; height: 100%; object-fit: contain; }
        .viewer-bottom-bar { padding: 14px; background: #1e293b; display: flex; justify-content: center; }
        .viewer-save-btn { background: #2563eb; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 12px; font-size: 0.9rem; font-weight: 600; }
      `}</style>
    </main>
  )
}
