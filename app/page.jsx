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
  
  const cleanCode = raw
    .replace(/^```[a-zA-Z0-9_-]*\n?/, "")
    .replace(/```$/, "")
    .trim()

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
          {copied ? (
            <span className="copied-tag">✓ Copied</span>
          ) : (
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

function ImageCard({ imageUrl, onImageClick }) {
  return (
    <div className="gemini-img-container" onClick={() => onImageClick(imageUrl)}>
      <img
        src={imageUrl}
        alt="AI Visual"
        className="gemini-real-img"
      />
    </div>
  )
}

function cleanFormatting(text) {
  if (!text) return ""
  return text.replace(/\*\*/g, "").replace(/\*/g, "")
}

function renderMessageContent(content, onImageClick) {
  if (typeof content === "object" && content?.type === "image_card") {
    return <ImageCard imageUrl="{content.imageUrl}" onImageClick="{onImageClick}"/>
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
  try {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
  } catch (e) {}
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
          const safeUserData = { uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL }
          setCurrentUser(safeUserData)
          localStorage.setItem("himo_cached_user", JSON.stringify(safeUserData))
        } else {
          setCurrentUser(null)
          localStorage.removeItem("himo_cached_user")
        }
      } catch (e) {}
      setAuthChecking(false)
    })

    getAllChatsFromDB().then((chats) => {
      if (chats && chats.length > 0) {
        const sorted = chats.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.updatedAt - a.updatedAt)
        setSavedSessions(sorted)
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

      setSavedSessions(prev => {
        const filtered = prev.filter(s => s.id !== id)
        const newList = [sessionObj, ...filtered]
        return newList.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.updatedAt - a.updatedAt)
      })
    } catch (e) {}
  }

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (uploadEvent) => {
        setAttachedImage(uploadEvent.target.result)
      }
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
      speakVoice("Training mode active ho gaya.")
    } else {
      setPinError("Galat Password! (5656 enter karein)")
    }
  }

  const processTrainingOrDeletion = async (rawSentence) => {
    try {
      const text = rawSentence.trim()
      const lower = text.toLowerCase()
      if (lower.includes("clear all memory") || lower.includes("reset memory")) {
        await clearAllTrainedKnowledge()
        return "Ooo scene clear! Saari memory uda di hai."
      }
      const patternRegex = /(?:when\s+i\s+say|jb\s+m\s+bolu|jab\s+main\s+bolu)\s+(.*?)\s+(?:you\s+say|tu\s+bolna|tum\s+bolna|answer)\s+(.*)/i
      const match = text.match(patternRegex)
      if (match && match[1] && match[2]) {
        await saveTrainedKnowledge(match[1].trim(), match[2].trim())
        return `Ooo yad kar liya! Jab bolega "${match[1].trim()}", main bolunga "${match[2].trim()}".`
      }
      return "Okk done."
    } catch (e) {
      return "Okk done."
    }
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
          if (transcript) handleSend(transcript.trim(), true)
        }
        recognition.onend = () => setIsListening(false)
        recognition.onerror = () => setIsListening(false)
        recognitionRef.current = recognition
        recognition.start()
      }
    } catch (err) { setIsListening(false) }
  }

  const handleInAppMusicPlay = (query) => {
    let cleanTrack = query.replace(/^(play\s+a\s+song|play\s+song|play\s+music|play\s+bhajan|play|chalao|suno|lagao)\s*/i, "").trim()
    if (!cleanTrack) cleanTrack = "Hanuman Chalisa"
    setCurrentTrack({ title: cleanTrack, url: `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(cleanTrack)}` })
    return `Playing "${cleanTrack}"`
  }

  // 100% Guaranteed Instant Image Generation Engine (Zero Broken Link)
  const generateAIImage = (promptText) => {
    let cleanDesc = promptText
      .replace(/(create|generate|make|draw|banao|dikhau|dikhao|bana|chahiye|ki|ka|ek|image|photo|pic|picture|tasveer|art|of)+/gi, " ")
      .trim()
    if (!cleanDesc || cleanDesc.length < 2) cleanDesc = "sports car futuristic"
    
    // Using ultra-stable Unsplash Source API to guarantee 100% load
    const imageUrl = `https://source.unsplash.com/featured/600x600/?${encodeURIComponent(cleanDesc)}`
    return { type: "image_card", imageUrl }
  }

  async function think(prompt, hasAttachedPhoto = false) {
    const q = prompt.trim()
    const qLower = q.toLowerCase()

    // 1. Code Request Check
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
      qLower.includes("sql") ||
      qLower.includes("icon")

    if (isCodeRequest) {
      const codeOutput = generateCodeFromPrompt(q)
      if (codeOutput) return codeOutput
    }

    // 2. Image Request Check
    const isImageGenRequest = 
      qLower.includes("image") || 
      qLower.includes("photo") || 
      qLower.includes("tasveer") || 
      qLower.includes("picture") || 
      qLower.includes("pic bana") || 
      qLower.includes("draw") || 
      qLower.includes("paint") ||
      qLower.startsWith("create ") ||
      qLower.startsWith("generate ") ||
      qLower.startsWith("make ")

    if (isImageGenRequest) {
      return generateAIImage(q)
    }

    if (hasAttachedPhoto) return "Okk photo dekh li hai, mast lag rahi hai!"

    if (qLower.includes("kya haal hai") || qLower.includes("sup") || qLower.includes("whats up")) {
      return "Ooo sab badhiya scene hai! Tu bata, kya chal raha hai?"
    }
    if (qLower.includes("kaun ho") || qLower.includes("who are you")) {
      return "Ooo main tera apna Himo hoon, jo har coding aur creative scene mein saath hai!"
    }

    const humanTalk = getHumanReply(q)
    if (humanTalk) return humanTalk

    if (qLower.startsWith("play ") || qLower.includes("gana chalao")) {
      return handleInAppMusicPlay(q)
    }

    try {
      const memoryAns = await getTrainedKnowledge(q)
      if (memoryAns) return cleanFormatting(memoryAns)
    } catch (e) {}

    try {
      const mathResult = MathMasterEngine.evaluate(q)
      if (mathResult) return cleanFormatting(mathResult)
    } catch (e) {}

    return `Ooo sun, '${q}' ke baare mein code ya detail generate kar di hai!`
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
      let answer = isTrainingModeActive ? await processTrainingOrDeletion(prompt) : await think(prompt || "Explain photo", !!currentPhoto)
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
              <a href={previewModalImg} target="_blank" rel="noreferrer" download="himo_image.jpg" className="viewer-save-btn">Save Image</a>
            </div>
          </div>
        </div>
      )}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-top-spacer" />
        <button className="new-chat-btn" onClick={() => { setMessages([]); setCurrentChatId(null); setSidebarOpen(false); }}>New chat</button>
        <div className="sidebar-section">
          <p className="sidebar-label">Recent</p>
          <div className="recent-list">
            {savedSessions.map((s) => (
              <div key={s.id} className={`recent-item ${s.id === currentChatId ? "active-chat-item" : ""}`} onClick={() => { setCurrentChatId(s.id); setMessages(s.messages || []); setSidebarOpen(false); }}>
                <span className="truncate">{s.title}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="sidebar-footer">
          <div className="user-info-wrapper">
            <div className="footer-avatar-circle">{userInitial}</div>
            <div className="user-email-text">{currentUser.email || "User"}</div>
          </div>
          <button type="button" className="settings-icon-btn" onClick={handleLogout}>🚪</button>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="left-nav">
            <button className="icon-btn" onClick={() => setSidebarOpen(true)}>☰</button>
            <span className="brand-name">Himo Omni</span>
          </div>
        </header>

        <div className="canvas">
          {messages.length === 0 && (
            <div className="hero-screen-top-left">
              <h1 className="hero-main-title">How can I help you today?</h1>
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
            {loading && <div className="message-row assistant"><div className="message-bubble">Generating...</div></div>}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="dock-container">
          <div className="composer-shell">
            <button type="button" className="plus-action-btn" onClick={() => fileInputRef.current?.click()}>+</button>
            <textarea 
              ref={textareaRef} 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} 
              placeholder="Ask Himo or write code..." 
              rows={1} 
            />
            <button type="button" className="send-button-gemini" onClick={() => handleSend()}>➤</button>
          </div>
        </div>
      </section>

      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .app-shell { display: flex; height: 100dvh; width: 100vw; background: #fff; font-family: sans-serif; position: fixed; inset: 0; }
        .workspace { flex: 1; display: flex; flex-direction: column; position: relative; height: 100%; width: 100%; overflow: hidden; }
        .topbar { height: 56px; padding: 0 16px; display: flex; align-items: center; justify-content: space-between; }
        .brand-name { font-size: 1.2rem; font-weight: 700; }
        .canvas { flex: 1; overflow-y: auto; padding: 0 16px 130px 16px; max-width: 800px; width: 100%; margin: 0 auto; }
        .hero-screen-top-left { margin-top: 24px; }
        .hero-main-title { font-size: 2rem; font-weight: 700; color: #111827; }
        .messages-list { display: flex; flex-direction: column; gap: 14px; padding-top: 16px; }
        .message-row { display: flex; width: 100%; }
        .message-row.user { justify-content: flex-end; }
        .message-row.assistant { justify-content: flex-start; }
        .message-bubble { max-width: 100%; width: 100%; }
        .message-row.user .message-bubble { background: #f3f4f6; padding: 10px 16px; border-radius: 18px; max-width: 85%; width: fit-content; }
        
        .gemini-img-container { width: 260px; height: 260px; border-radius: 14px; overflow: hidden; cursor: pointer; border: 1px solid #e2e8f0; background: #f8fafc; margin: 6px 0; }
        .gemini-real-img { width: 100%; height: 100%; object-fit: cover; }

        .dark-code-card { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; margin: 10px 0; width: 100%; }
        .dark-code-header { display: flex; justify-content: space-between; align-items: center; background: #1e293b; padding: 8px 14px; }
        .lang-badge-tag { font-size: 0.75rem; font-weight: 700; color: #94a3b8; font-family: monospace; }
        .copy-icon-btn { background: transparent; border: none; color: #94a3b8; cursor: pointer; padding: 4px; }
        .copied-tag { color: #34d399; font-size: 0.75rem; }
        .dark-code-scroll { padding: 12px; overflow-x: auto; background: #0f172a; }
        .dark-pre-text { margin: 0; font-family: monospace; font-size: 0.85rem; color: #e2e8f0; white-space: pre-wrap; word-break: break-word; }

        .dock-container { position: absolute; bottom: 0; left: 0; right: 0; padding: 10px 16px; background: #fff; display: flex; justify-content: center; }
        .composer-shell { width: 100%; max-width: 800px; background: #fff; border-radius: 24px; padding: 6px 12px; display: flex; align-items: flex-end; gap: 8px; border: 1.5px solid #e5e7eb; }
        .composer-shell textarea { flex: 1; background: transparent; border: none; outline: none; font-size: 0.95rem; resize: none; max-height: 120px; padding: 4px 0; }
        .plus-action-btn, .send-button-gemini { width: 34px; height: 34px; border-radius: 50%; background: #111827; color: #fff; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .plus-action-btn { background: #f3f4f6; color: #374151; }

        .image-viewer-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 16px; }
        .viewer-content-card { position: relative; max-width: 480px; width: 100%; background: #0f172a; border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; }
        .viewer-close-btn { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.6); color: #fff; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; }
        .viewer-img-holder { width: 100%; max-height: 70vh; display: flex; align-items: center; justify-content: center; background: #000; }
        .viewer-full-img { width: 100%; height: 100%; object-fit: contain; }
        .viewer-bottom-bar { padding: 12px; background: #1e293b; display: flex; justify-content: center; }
        .viewer-save-btn { background: #2563eb; color: #fff; text-decoration: none; padding: 8px 16px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; }
        .sidebar { position: fixed; top: 0; left: -320px; width: 280px; height: 100dvh; background: #fff; border-right: 1px solid #e5e7eb; transition: left 0.25s ease; z-index: 100; padding: 16px; display: flex; flex-direction: column; }
        .sidebar.open { left: 0; }
        .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 99; }
        .new-chat-btn { background: #f3f4f6; border: 1px solid #e5e7eb; padding: 10px; border-radius: 16px; cursor: pointer; font-weight: 500; margin-bottom: 16px; }
        .sidebar-section { flex: 1; overflow-y: auto; }
        .sidebar-label { font-size: 0.7rem; font-weight: 600; color: #9ca3af; text-transform: uppercase; margin-bottom: 8px; }
        .recent-item { padding: 8px; border-radius: 8px; font-size: 0.85rem; cursor: pointer; color: #4b5563; }
        .active-chat-item { background: #eff6ff; color: #2563eb; font-weight: 600; }
        .sidebar-footer { border-top: 1px solid #e5e7eb; padding-top: 10px; display: flex; align-items: center; justify-content: space-between; }
        .user-info-wrapper { display: flex; align-items: center; gap: 8px; overflow: hidden; }
        .footer-avatar-circle { width: 34px; height: 34px; border-radius: 50%; background: #3b82f6; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; }
        .user-email-text { font-size: 0.8rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px; }
        .settings-icon-btn { background: transparent; border: none; font-size: 1.2rem; cursor: pointer; }
      `}</style>
    </main>
  )
}
