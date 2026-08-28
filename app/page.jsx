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

// Proper Black File Code Container
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
        <div className="file-indicator">
          <span className="dot-circle red"></span>
          <span className="dot-circle yellow"></span>
          <span className="dot-circle green"></span>
          <span className="lang-badge-tag">{language}</span>
        </div>
        <button type="button" onClick={handleCopy} className="copy-icon-btn" title="Copy code">
          {copied ? <span className="copied-tag">✓ Copied</span> : <span>Copy code</span>}
        </button>
      </div>
      <div className="dark-code-scroll">
        <pre className="dark-pre-text"><code>{cleanCode}</code></pre>
      </div>
    </div>
  )
}

// Strict 100px x 100px High-Graphic AI Image Card
function HighGraphicImageCard({ promptText, onImageClick }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const seed = Math.floor(Math.random() * 999999)
  const cleanPrompt = encodeURIComponent(promptText.replace(/(create|generate|make|image|photo|of|banao|dikhao)/gi, "").trim() || "modern high detail artwork")
  const highResUrl = `[https://image.pollinations.ai/prompt/$](https://image.pollinations.ai/prompt/$){cleanPrompt}?seed=${seed}&width=768&height=768&nologo=true`

  return (
    <div className="strict-100px-img-wrapper" onClick={() => onImageClick(highResUrl)}>
      {!imgLoaded && (
        <div className="strict-loader">
          <div className="tiny-spinner"></div>
        </div>
      )}
      <img 
        src={highResUrl} 
        alt={promptText} 
        className={`strict-100px-img-elem ${imgLoaded ? "img-visible" : "img-hidden"}`} 
        onLoad={() => setImgLoaded(true)}
      />
    </div>
  )
}

function cleanFormatting(text) {
  if (!text) return ""
  return text.replace(/\*\*/g, "").replace(/\*/g, "")
}

function renderMessageContent(content, onImageClick) {
  if (typeof content === "object" && content?.type === "ai_image") {
    return <HighGraphicImageCard promptText={content.prompt} onImageClick={onImageClick} />
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

  const [isListening, setIsListening] = useState(false)

  const fileInputRef = useRef(null)
  const mediaStreamRef = useRef(null)
  const recognitionRef = useRef(null)
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

  const toggleVoiceRecording = async () => {
    if (typeof window === "undefined") return
    if (isListening) {
      if (recognitionRef.current) try { recognitionRef.current.stop() } catch (e) {}
      if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(t => t.stop())
      setIsListening(false)
      return
    }
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true })
      }
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = "hi-IN"
        recognition.onstart = () => setIsListening(true)
        recognition.onresult = (event) => {
          const transcript = event.results[0]?.[0]?.transcript
          if (transcript) handleSend(transcript.trim())
        }
        recognition.onend = () => setIsListening(false)
        recognition.onerror = () => setIsListening(false)
        recognitionRef.current = recognition
        recognition.start()
      }
    } catch (err) { setIsListening(false) }
  }

  async function think(prompt, hasAttachedPhoto = false) {
    const q = prompt.trim()
    const qLower = q.toLowerCase()

    // 1. Math Calculation Priority
    const isMathQuery = /[\d]+\s*[\+\-\*\/\%\^]\s*[\d]+/.test(q) || !isNaN(Number(q.replace(/\s+/g, "")))
    if (isMathQuery) {
      try {
        const mathResult = MathMasterEngine.evaluate(q)
        if (mathResult) return cleanFormatting(mathResult)
      } catch (e) {}
    }

    // 2. Strict Code Request Check
    const isCodeRequest = 
      qLower.startsWith("write code") || 
      qLower.startsWith("code ") || 
      qLower.includes("code in") ||
      qLower.includes("ka code") || 
      qLower.includes("function") || 
      qLower.includes("script") ||
      qLower.includes("html") ||
      qLower.includes("component") ||
      qLower.includes("react") ||
      qLower.includes("javascript") ||
      qLower.includes("python") ||
      qLower.includes("java") ||
      qLower.includes("css") ||
      qLower.includes("sql")

    if (isCodeRequest) {
      const codeOutput = generateCodeFromPrompt(q)
      if (codeOutput) return codeOutput
    }

    // 3. High-Graphic AI Image Request Check
    const isImageKeyword = 
      qLower.includes("image") || 
      qLower.includes("photo") || 
      qLower.includes("tasveer") || 
      qLower.includes("picture") || 
      qLower.includes("generate") || 
      qLower.includes("create") ||
      qLower.includes("banao") || 
      qLower.includes("draw")

    if (isImageKeyword && !isMathQuery) {
      return { type: "ai_image", prompt: q }
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

    return `Ooo sun, '${q}' par processing complete hai!`
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
  const isCurrentChatPinned = savedSessions.find(s => s.id === currentChatId)?.pinned

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
              <a href={previewModalImg} target="_blank" rel="noreferrer" download="himo_ai_art.jpg" className="viewer-save-btn">Save HD Image</a>
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
                {s.pinned && <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="pin-tag-icon"><path d="M16 12V4H17V2H7V4H8V12L6 14V16H11V22L12 23L13 22V16H18V14L16 12Z" /></svg>}
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="user-info-wrapper">
            <div className="avatar-chip footer-avatar-circle">{userInitial}</div>
            <div className="user-email-text" title={currentUser.email || ""}>{currentUser.email || "User"}</div>
          </div>
          <div className="settings-container">
            <button type="button" className="settings-icon-btn" onClick={(e) => { e.stopPropagation(); setSettingsMenuOpen(!settingsMenuOpen); }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
            </button>
            {settingsMenuOpen && (
              <div className="popup-card settings-popup">
                <button type="button" className="popup-menu-item logout-item" onClick={handleLogout}>Log out</button>
              </div>
            )}
          </div>
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

          <div className="top-right-actions">
            <button type="button" className="icon-btn" onClick={(e) => { e.stopPropagation(); setTopMenuOpen(!topMenuOpen); }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
            </button>
            {topMenuOpen && (
              <div className="popup-card top-dropdown">
                <button type="button" className="popup-menu-item" onClick={async () => { if (currentChatId) await deleteChatFromDB(currentChatId); setSavedSessions(p => p.filter(s => s.id !== currentChatId)); setMessages([]); setCurrentChatId(null); setTopMenuOpen(false); }}>Delete Chat</button>
                <button type="button" className="popup-menu-item" onClick={async () => { const t = prompt("Rename chat:"); if (t && currentChatId) { const s = savedSessions.find(x => x.id === currentChatId); if (s) { const u = { ...s, title: t }; await saveChatToDB(u); setSavedSessions(p => p.map(x => x.id === currentChatId ? u : x)); } } setTopMenuOpen(false); }}>Rename</button>
                <button type="button" className="popup-menu-item" onClick={async () => { if (currentChatId) { const s = savedSessions.find(x => x.id === currentChatId); if (s) { const u = { ...s, pinned: !s.pinned }; await saveChatToDB(u); setSavedSessions(p => p.map(x => x.id === currentChatId ? u : x).sort((a,b) => (b.pinned?1:0)-(a.pinned?1:0))); } } setTopMenuOpen(false); }}>{isCurrentChatPinned ? "Unpin" : "Pin"}</button>
              </div>
            )}
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
            {loading && <div className="message-row assistant"><div className="message-bubble">Thinking...</div></div>}
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
            <div className="plus-btn-wrapper">
              <button
                type="button"
                className="plus-action-btn"
                onClick={(e) => { e.stopPropagation(); setPlusMenuOpen(!plusMenuOpen); }}
                title="Upload Photo"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>

              {plusMenuOpen && (
                <div className="popup-card plus-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                  <button type="button" className="popup-menu-item plus-item" onClick={() => fileInputRef.current?.click()}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    <span>Upload Image</span>
                  </button>
                </div>
              )}
            </div>

            <textarea 
              ref={textareaRef} 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} 
              placeholder={isListening ? "Listening..." : "Ask Himo..."} 
              rows={1} 
            />
            
            <div className="composer-actions">
              <button
                type="button"
                className={`chat-mic-button ${isListening ? "mic-active-pulse" : ""}`}
                onClick={toggleVoiceRecording}
                title="Voice Input"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              </button>

              <button 
                type="button" 
                className={`send-button-gemini ${isTyping ? "active-glow-btn" : ""}`} 
                disabled={(!message.trim() && !attachedImage) || loading} 
                onClick={() => handleSend()}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        .app-shell { display: flex; height: 100dvh; width: 100vw; background: #ffffff; color: #1f2937; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; overflow: hidden; position: fixed; inset: 0; }
        .top-glow-mesh { position: absolute; top: 0; left: 0; right: 0; height: 35vh; pointer-events: none; z-index: 1; background: radial-gradient(circle at 15% 30%, rgba(96, 165, 250, 0.4), transparent 60%), radial-gradient(circle at 45% 20%, rgba(244, 114, 182, 0.35), transparent 55%), radial-gradient(circle at 75% 35%, rgba(52, 211, 153, 0.3), transparent 55%), radial-gradient(circle at 90% 15%, rgba(192, 132, 252, 0.35), transparent 60%), linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%); filter: blur(24px); }
        .workspace { flex: 1; display: flex; flex-direction: column; position: relative; height: 100%; width: 100%; z-index: 2; overflow: hidden; }
        .topbar { height: 56px; padding: 0 16px; display: flex; align-items: center; justify-content: space-between; position: relative; }
        .left-nav { display: flex; align-items: center; gap: 10px; }
        .brand-name { font-size: 1.2rem; font-weight: 700; color: #111827; }
        .icon-btn { background: transparent; border: none; color: #374151; cursor: pointer; border-radius: 50%; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; }
        .popup-card { position: absolute; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); padding: 6px; min-width: 160px; z-index: 100; display: flex; flex-direction: column; gap: 2px; }
        .top-dropdown { top: 48px; right: 16px; }
        .settings-popup { bottom: 50px; right: 0; min-width: 140px; }
        .plus-dropdown-menu { bottom: 46px; left: 0; min-width: 170px; }
        .popup-menu-item { background: transparent; border: none; padding: 10px 14px; font-size: 0.9rem; color: #374151; border-radius: 10px; cursor: pointer; text-align: left; width: 100%; display: flex; align-items: center; gap: 8px; }
        .logout-item { color: #dc2626; }

        .sidebar { position: fixed; top: 0; left: -320px; width: 280px; height: 100dvh; background: #ffffff; border-right: 1px solid #e5e7eb; transition: left 0.25s ease; z-index: 100; padding: 16px; display: flex; flex-direction: column; }
        .sidebar.open { left: 0; }
        .sidebar-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.3); backdrop-filter: blur(2px); z-index: 99; }
        .new-chat-btn { display: flex; align-items: center; gap: 10px; background: #f3f4f6; border: 1px solid #e5e7eb; color: #1f2937; padding: 10px 16px; border-radius: 20px; cursor: pointer; font-size: 0.88rem; font-weight: 500; margin-bottom: 20px; }
        .sidebar-section { flex: 1; overflow-y: auto; }
        .sidebar-label { font-size: 0.72rem; font-weight: 600; color: #9ca3af; margin-bottom: 10px; text-transform: uppercase; }
        .recent-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 12px; font-size: 0.85rem; color: #4b5563; cursor: pointer; }
        .active-chat-item { background: #eff6ff; color: #2563eb; font-weight: 600; }
        .sidebar-footer { border-top: 1px solid #e5e7eb; padding-top: 12px; display: flex; align-items: center; justify-content: space-between; position: relative; }
        .user-info-wrapper { display: flex; align-items: center; gap: 8px; overflow: hidden; max-width: 190px; }
        .footer-avatar-circle { width: 36px; height: 36px; border-radius: 50%; background: #3b82f6; color: #ffffff; font-weight: 700; display: flex; align-items: center; justify-content: center; }
        .user-email-text { font-size: 0.82rem; font-weight: 600; color: #1f2937; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .settings-icon-btn { background: transparent; border: none; color: #6b7280; cursor: pointer; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; }

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

        /* STRICT 100px x 100px IMAGE CARD */
        .strict-100px-img-wrapper {
          width: 100px !important;
          height: 100px !important;
          min-width: 100px !important;
          min-height: 100px !important;
          max-width: 100px !important;
          max-height: 100px !important;
          border-radius: 14px;
          overflow: hidden;
          margin: 6px 0;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
          cursor: pointer;
          border: 1.5px solid #e2e8f0;
          background: #0f172a;
          position: relative;
          display: inline-block;
          flex-shrink: 0;
        }
        .strict-100px-img-elem {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          display: block !important;
          border-radius: 12px !important;
          transition: opacity 0.2s ease;
        }
        .img-visible { opacity: 1; }
        .img-hidden { opacity: 0; }
        .strict-loader {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1e293b;
        }
        .tiny-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-top-color: #38bdf8;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* PROPER SOLID BLACK CODE FILE CONTAINER */
        .dark-code-card {
          background: #0d1117 !important;
          border: 1px solid #30363d;
          border-radius: 12px;
          overflow: hidden;
          margin: 10px 0;
          width: 100%;
          max-width: 100%;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }
        .dark-code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #161b22 !important;
          padding: 8px 12px;
          border-bottom: 1px solid #30363d;
        }
        .file-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .dot-circle {
          width: 9px;
          height: 9px;
          border-radius: 50%;
        }
        .dot-circle.red { background: #ff5f56; }
        .dot-circle.yellow { background: #ffbd2e; }
        .dot-circle.green { background: #27c93f; }
        .lang-badge-tag {
          font-size: 0.72rem;
          font-weight: 700;
          color: #8b949e;
          font-family: ui-monospace, SFMono-Regular, monospace;
          margin-left: 6px;
        }
        .copy-icon-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #c9d1d9;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 0.72rem;
          cursor: pointer;
        }
        .copied-tag {
          color: #3fb950;
          font-weight: 600;
        }
        .dark-code-scroll {
          padding: 12px 14px;
          overflow-x: auto;
          background: #0d1117 !important;
          max-width: 100%;
          -webkit-overflow-scrolling: touch;
        }
        .dark-pre-text {
          margin: 0;
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 0.84rem;
          line-height: 1.5;
          color: #e6edf3;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .dock-container { position: absolute; bottom: 0; left: 0; right: 0; padding: 8px 14px 14px; background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 40%); display: flex; flex-direction: column; align-items: center; z-index: 10; }
        .attached-photo-preview-bar { display: flex; align-items: center; gap: 10px; width: 100%; max-width: 800px; margin-bottom: 6px; padding: 0 4px; }
        .preview-thumb-box { position: relative; width: 44px; height: 44px; border-radius: 10px; overflow: hidden; border: 1.5px solid #3b82f6; }
        .thumb-img { width: 100%; height: 100%; object-fit: cover; }
        .remove-thumb-btn { position: absolute; top: 1px; right: 1px; background: rgba(0,0,0,0.7); color: #fff; border: none; border-radius: 50%; width: 16px; height: 16px; font-size: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .preview-caption-hint { font-size: 0.78rem; color: #4b5563; font-weight: 500; }

        .composer-shell { width: 100%; max-width: 800px; background: #ffffff; border-radius: 26px; padding: 6px 12px; display: flex; align-items: flex-end; gap: 8px; border: 1.5px solid #e5e7eb; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .composer-shell.typing-active { border-color: transparent; background: linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(90deg, #2563eb, #9333ea, #ec4899, #06b6d4, #2563eb) border-box; background-size: 100% 100%, 300% 100%; animation: borderGlowFlow 3s linear infinite; }
        @keyframes borderGlowFlow { 0% { background-position: 0% 0%, 0% 50%; } 50% { background-position: 0% 0%, 100% 50%; } 100% { background-position: 0% 0%, 0% 50%; } }

        .plus-btn-wrapper { position: relative; display: flex; align-items: center; }
        .plus-action-btn { width: 34px; height: 34px; border-radius: 50%; background: #f3f4f6; color: #4b5563; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s, transform 0.15s; }
        .plus-action-btn:hover { background: #e5e7eb; color: #111827; }
        .composer-shell textarea { flex: 1; background: transparent; border: none; outline: none; color: #111827; font-size: 0.95rem; resize: none; max-height: 140px; padding: 6px 0; }
        .composer-actions { display: flex; align-items: center; gap: 6px; margin-bottom: 2px; }
        .chat-mic-button { width: 34px; height: 34px; border-radius: 50%; background: #f3f4f6; color: #4b5563; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .mic-active-pulse { background: #dc2626 !important; color: #ffffff !important; animation: micPulse 1.2s infinite ease-in-out; }
        @keyframes micPulse { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.5); } 50% { transform: scale(1.1); box-shadow: 0 0 0 6px rgba(220, 38, 38, 0.2); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.0); } }

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
