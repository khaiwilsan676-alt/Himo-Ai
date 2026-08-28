"use client"

import { useState, useRef, useEffect } from "react"
import LoginPage from "../components/LoginPage"
import MathMasterEngine from "../src/lib/mathMasterEngine"
import { generateCodeFromPrompt } from "../src/lib/codeMasterEngine"
import { fetchLiveWebData } from "../src/lib/webSearchEngine"
import { handleDeviceAction } from "../src/lib/deviceControlEngine"
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
  const cleanCode = (codeText || "").replace(/^```[a-zA-Z]*\n?/, "").replace(/```$/, "").trim()

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(cleanCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {}
  }

  return (
    <div className="code-container-card">
      <div className="code-card-header">
        <span className="code-lang-label">Code</span>
        <button type="button" onClick={handleCopy} className="copy-action-btn" title="Copy code">
          {copied ? <span className="copied-text">Copied ✓</span> : (
            <span className="copy-inner">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy Code
            </span>
          )}
        </button>
      </div>
      <pre className="code-pre-block"><code>{cleanCode}</code></pre>
    </div>
  )
}

function cleanFormatting(text) {
  if (!text) return ""
  return text.replace(/\*\*/g, "").replace(/\*/g, "")
}

function stopVoicePlayback() {
  try {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
  } catch (e) {}
}

function speakVoice(text) {
  if (!text || typeof window === "undefined") return
  try {
    stopVoicePlayback()
    if ("speechSynthesis" in window) {
      window.speechSynthesis.resume()
      const cleanText = text.replace(/```[\s\S]*?```/g, "Code ready.")
        .replace(/[#*•_`]/g, "")
        .trim()
      if (!cleanText) return

      const utterance = new SpeechSynthesisUtterance(cleanText)
      utterance.rate = 1.0
      utterance.lang = "hi-IN"
      window.speechSynthesis.speak(utterance)
    }
  } catch (err) {
    console.warn("Audio speech catch:", err)
  }
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

  // Training Mode States
  const [isTrainingModeActive, setIsTrainingModeActive] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)
  const [pinDigits, setPinDigits] = useState(["", "", "", ""])
  const [pinError, setPinError] = useState("")
  const [isListening, setIsListening] = useState(false)

  // Hardware States
  const [showCameraModal, setShowCameraModal] = useState(false)
  const [capturedPhoto, setCapturedPhoto] = useState(null)
  const [screenshotToast, setScreenshotToast] = useState(null)
  const [currentTrack, setCurrentTrack] = useState(null)

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

  const handlePinChange = (val, idx) => {
    if (val.length > 1) val = val.slice(-1)
    const updated = [...pinDigits]
    updated[idx] = val
    setPinDigits(updated)
    setPinError("")

    if (val && idx < 3) {
      pinInputRefs[idx + 1].current?.focus()
    }
  }

  const handlePinKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !pinDigits[idx] && idx > 0) {
      pinInputRefs[idx - 1].current?.focus()
    }
  }

  const handleVerifyPinAndActivateMode = () => {
    const entered = pinDigits.join("")
    if (entered === "5656") {
      setShowPinModal(false)
      setPinDigits(["", "", "", ""])
      setPinError("")
      setIsTrainingModeActive(true)
      speakVoice("Training mode activated.")
    } else {
      setPinError("Galat Password! (5656 enter karein)")
    }
  }

  const processTrainingOrDeletion = async (rawSentence) => {
    try {
      const text = rawSentence.trim()
      const lower = text.toLowerCase()

      if (lower.includes("clear all memory") || lower.includes("reset memory") || lower.includes("delete all memory")) {
        await clearAllTrainedKnowledge()
        const reply = "Saari custom trained memory permanently clear ho chuki hai."
        speakVoice(reply)
        return reply
      }

      if (
        lower.startsWith("delete ") || 
        lower.startsWith("forget ") || 
        lower.startsWith("remove ") || 
        lower.startsWith("delete memory ") || 
        lower.includes("bhul jao")
      ) {
        const targetQuery = text
          .replace(/^(delete|forget|delete memory|remove memory|remove|bhul jao|ye bhul jao|isko delete karo)\s*/i, "")
          .replace(/about\s+/i, "")
          .trim()

        if (targetQuery) {
          const deletedTopic = await deleteTrainedKnowledge(targetQuery)
          if (deletedTopic) {
            const reply = `Maine "${deletedTopic}" ki memory permanently dimag se delete kar di hai.`
            speakVoice(reply)
            return reply
          } else {
            const reply = `"${targetQuery}" naam ki koi memory nahi mili.`
            speakVoice(reply)
            return reply
          }
        }
      }

      const patternRegex = /(?:when\s+i\s+say|jb\s+m\s+bolu|jab\s+main\s+bolu)\s+(.*?)\s+(?:you\s+say|tu\s+bolna|tum\s+bolna|answer)\s+(.*)/i
      const match = text.match(patternRegex)

      if (match && match[1] && match[2]) {
        const topic = match[1].trim()
        const answer = match[2].trim()

        await saveTrainedKnowledge(topic, answer)
        const reply = `Got it! When you say "${topic}", I will say "${answer}". Saved in memory.`
        speakVoice(reply)
        return reply
      }

      const parts = text.split("=")
      if (parts.length === 2 && parts[0].trim() && parts[1].trim()) {
        await saveTrainedKnowledge(parts[0].trim(), parts[1].trim())
        const reply = `Got it! "${parts[0].trim()}" is now permanently learned.`
        speakVoice(reply)
        return reply
      }

      const helpMsg = "Bolkar sikhayein: 'When I say [Question] you say [Answer]' ya hatane ke liye bolein: 'Delete [Question]'"
      speakVoice(helpMsg)
      return helpMsg
    } catch (e) {
      return "Command processed."
    }
  }

  // Universal WebView & Browser Voice Engine
  const toggleVoiceRecording = async () => {
    if (typeof window === "undefined") return

    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop() } catch (e) {}
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop())
      }
      setIsListening(false)
      return
    }

    try {
      // 1. Request hardware mic permission (Works in WebView & Chrome)
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaStreamRef.current = stream
      }

      // 2. Initialize Speech Recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = "en-US"

        recognition.onstart = () => setIsListening(true)
        recognition.onresult = (event) => {
          try {
            const transcript = event.results[0][0].transcript
            if (transcript && transcript.trim()) {
              handleSend(transcript.trim(), true)
            }
          } catch (e) {}
        }
        recognition.onend = () => {
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(t => t.stop())
          }
          setIsListening(false)
        }
        recognition.onerror = () => {
          setIsListening(false)
        }

        recognitionRef.current = recognition
        recognition.start()
      } else {
        alert("Speech Recognition engine not supported in this Android WebView.")
        setIsListening(false)
      }
    } catch (err) {
      console.warn("Speech error:", err)
      setIsListening(false)
    }
  }

  const handleInAppMusicPlay = (query) => {
    let cleanTrack = query
      .replace(/^(play\s+a\s+song|play\s+song|play\s+music|play\s+bhajan|play|chalao|suno|lagao)\s*/i, "")
      .replace(/\b(please|sunao|chalao|play|karo)\b/gi, "")
      .trim()

    if (!cleanTrack || cleanTrack === "a" || cleanTrack === "song") {
      cleanTrack = "Hanuman Chalisa"
    }

    const embedUrl = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(cleanTrack)}`

    setCurrentTrack({
      title: cleanTrack,
      url: embedUrl
    })

    return `Playing "${cleanTrack}" on main screen...`
  }

  async function think(prompt) {
    const q = prompt.trim()
    const qLower = q.toLowerCase()

    if (['hi', 'hii', 'hello', 'hii himo', 'hi himo', 'hey'].includes(qLower)) {
      return "Yo! Himo Omni Engine ready hai. Kya solve, play, ya capture karna hai?"
    }

    if (
      qLower.startsWith("play ") || 
      qLower.includes("gana chalao") || 
      qLower.includes("bhajan chalao") || 
      qLower.includes("song play") || 
      qLower.startsWith("lagao ")
    ) {
      return handleInAppMusicPlay(q)
    }

    try {
      const deviceAction = await handleDeviceAction(q, null, null)
      if (deviceAction) return deviceAction
    } catch (e) {}

    try {
      const memoryAns = await getTrainedKnowledge(q)
      if (memoryAns) return cleanFormatting(memoryAns)
    } catch (e) {}

    try {
      const mathResult = MathMasterEngine.evaluate(q)
      if (mathResult) return cleanFormatting(mathResult)
    } catch (e) {}

    try {
      const codeResult = generateCodeFromPrompt(q)
      if (codeResult) return codeResult
    } catch (e) {}

    try {
      const searchData = await fetchLiveWebData(q)
      if (searchData) return cleanFormatting(searchData)
    } catch (e) {}

    return `'${q}' par exact information nahi mili. Specific question poochhein.`
  }

  async function handleSend(textToSend, isVoice = false) {
    const prompt = (typeof textToSend === "string" ? textToSend : message).trim()
    if (!prompt || loading) return

    const lowerPrompt = prompt.toLowerCase()

    if (['stop', 'chup', 'ruko', 'pause', 'stop speaking', 'shant', 'stop music'].includes(lowerPrompt)) {
      stopVoicePlayback()
      setCurrentTrack(null)
      setMessage("")
      return
    }

    if (lowerPrompt.includes("himo on the training mode")) {
      setMessage("")
      if (textareaRef.current) textareaRef.current.style.height = "auto"
      setShowPinModal(true)
      setTimeout(() => pinInputRefs[0].current?.focus(), 150)
      return
    }

    const isDirectDeleteCommand = 
      lowerPrompt.startsWith("delete ") || 
      lowerPrompt.startsWith("forget ") || 
      lowerPrompt.startsWith("remove ") || 
      lowerPrompt.startsWith("delete memory ") || 
      lowerPrompt.includes("clear all memory")

    setMessage("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"

    const newMsgs = [...messages, { role: "user", content: prompt }]
    setMessages(newMsgs)
    setLoading(true)

    await persistChatSession(newMsgs)

    try {
      let answer = ""

      if (isTrainingModeActive || isDirectDeleteCommand) {
        answer = await processTrainingOrDeletion(prompt)
      } else {
        answer = await think(prompt)
        if (isVoice || (await getTrainedKnowledge(prompt))) {
          speakVoice(answer)
        }
      }

      const finalMsgs = [...newMsgs, { role: "assistant", content: answer }]
      setMessages(finalMsgs)
      await persistChatSession(finalMsgs)
    } catch (error) {
      const errorMsgs = [...newMsgs, { role: "assistant", content: "Error processing request." }]
      setMessages(errorMsgs)
      await persistChatSession(errorMsgs)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    try {
      await signOut(auth)
      localStorage.removeItem("himo_cached_user")
      sessionStorage.clear()
      setCurrentUser(null)
      setSettingsMenuOpen(false)
      setSidebarOpen(false)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (authChecking) {
    return (
      <div className="auth-loading-screen">
        <div className="loader-spinner"></div>
      </div>
    )
  }

  if (!currentUser) {
    return <LoginPage onLoginSuccess={(user) => setCurrentUser(user)} />
  }

  const userInitial = currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : (currentUser.email ? currentUser.email.charAt(0).toUpperCase() : "U")
  const isTyping = message.trim().length > 0
  const isCurrentChatPinned = savedSessions.find(s => s.id === currentChatId)?.pinned

  return (
    <main className="app-shell">
      <div className="top-glow-mesh" />
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* In-App Floating Player */}
      {currentTrack && (
        <div className="in-app-media-player">
          <div className="player-top-header">
            <div className="track-title-tag">
              <span className="equalizer-bar"></span>
              <span>Playing: {currentTrack.title}</span>
            </div>
            <button type="button" onClick={() => setCurrentTrack(null)} className="close-player-btn">✕</button>
          </div>
          <iframe 
            src={currentTrack.url} 
            title="Music Player" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="player-iframe"
          />
        </div>
      )}

      {/* 4-Box PIN Modal */}
      {showPinModal && (
        <div className="modal-backdrop" onClick={() => setShowPinModal(false)}>
          <div className="pin-card-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pin-header">
              <h3>Human Newton Engine</h3>
              <p>Training Mode chalu karne ke liye PIN enter karein</p>
            </div>

            <div className="pin-boxes-row">
              {pinDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={pinInputRefs[idx]}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(e.target.value, idx)}
                  onKeyDown={(e) => handlePinKeyDown(e, idx)}
                  className="pin-digit-box"
                />
              ))}
            </div>

            {pinError && <p className="pin-error-text">{pinError}</p>}

            <button type="button" className="mode-on-btn" onClick={handleVerifyPinAndActivateMode}>
              Mode on
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-top-spacer" />
        <button className="new-chat-btn" onClick={() => { setMessages([]); setCurrentChatId(null); setSidebarOpen(false); }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
          New chat
        </button>

        <div className="sidebar-section">
          <p className="sidebar-label">Recent</p>
          <div className="recent-list">
            {savedSessions.length === 0 ? (
              <span className="no-chats-hint">No saved chats yet</span>
            ) : (
              savedSessions.map((session) => (
                <div key={session.id} className={`recent-item ${session.id === currentChatId ? "active-chat-item" : ""}`} onClick={() => { setCurrentChatId(session.id); setMessages(session.messages || []); setSidebarOpen(false); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  <span className="truncate flex-1">{session.title}</span>
                  {session.pinned && <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="pin-tag-icon"><path d="M16 12V4H17V2H7V4H8V12L6 14V16H11V22L12 23L13 22V16H18V14L16 12Z" /></svg>}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="user-info-wrapper">
            <div className="avatar-chip footer-avatar-circle">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="DP" className="avatar-img-circle" />
              ) : (
                userInitial
              )}
            </div>
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

      {/* Main Workspace */}
      <section className="workspace">
        <header className="topbar">
          <div className="left-nav">
            <button className="icon-btn" onClick={() => setSidebarOpen(true)}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="6" x2="21" y2="6"></line></svg></button>
            <span className="brand-name">Himo Omni</span>

            {isTrainingModeActive && (
              <div className="training-active-tag">
                <span className="tag-dot"></span>
                Training Mode ON
                <button 
                  type="button" 
                  className="exit-train-btn" 
                  onClick={() => { setIsTrainingModeActive(false); speakVoice("Training mode closed."); }}
                  title="Exit Training Mode"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="top-right-actions">
            <button type="button" className="icon-btn" onClick={(e) => { e.stopPropagation(); setTopMenuOpen(!topMenuOpen); }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg></button>
            {topMenuOpen && (
              <div className="popup-card top-dropdown">
                <button type="button" className="popup-menu-item" onClick={async () => { if (currentChatId) await deleteChatFromDB(currentChatId); setSavedSessions(p => p.filter(s => s.id !== currentChatId)); setMessages([]); setCurrentChatId(null); setTopMenuOpen(false); }}>Delete Chat</button>
                <button type="button" className="popup-menu-item" onClick={async () => { const t = prompt("Rename chat:"); if (t) { const s = savedSessions.find(x => x.id === currentChatId); if (s) { const u = { ...s, title: t }; await saveChatToDB(u); setSavedSessions(p => p.map(x => x.id === currentChatId ? u : x)); } } setTopMenuOpen(false); }}>Rename</button>
                <button type="button" className="popup-menu-item" onClick={async () => { const s = savedSessions.find(x => x.id === currentChatId); if (s) { const u = { ...s, pinned: !s.pinned }; await saveChatToDB(u); setSavedSessions(p => p.map(x => x.id === currentChatId ? u : x).sort((a,b) => (b.pinned?1:0)-(a.pinned?1:0))); } setTopMenuOpen(false); }}>{isCurrentChatPinned ? "Unpin" : "Pin"}</button>
              </div>
            )}
          </div>
        </header>

        {/* Content Canvas */}
        <div className="canvas">
          {messages.length === 0 && (
            <div className="hero-screen-top-left">
              <div className="hero-greeting-left">
                <span className="gradient-text animated-shimmer">Himo Omni</span>
                <h1 className="hero-main-title">
                  {isTrainingModeActive ? "Train me or control apps..." : "How can I help you today?"}
                </h1>
                {isTrainingModeActive && (
                  <p className="training-guide-text">
                    Add: <em>"When I say [X] you say [Y]"</em> | Delete: <em>"Delete [X]"</em>
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="messages-list">
            {messages.map((msg, index) => (
              <div key={index} className={`message-row ${msg.role}`}>
                <div className="message-bubble">
                  <div className="message-text">
                    {msg.content.includes("```") ? (
                      <CodeBlock codeText="{msg.content}"/>
                    ) : (
                      cleanFormatting(msg.content).split("\n").map((line, i) => (
                        <p key={i}>{line || "\u00A0"}</p>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="message-row assistant">
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

        {/* Floating Input Composer */}
        <div className="dock-container">
          <div className={`composer-shell ${isTyping ? "typing-active" : ""}`}>
            <textarea 
              ref={textareaRef} 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} 
              placeholder={isListening ? "Listening to your voice..." : (isTrainingModeActive ? "Train: When I say X you say Y... or Delete X" : "Ask Himo, play music, or tap mic...")} 
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
                disabled={!message.trim() || loading} 
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
        
        .app-shell { 
          display: flex; 
          height: 100dvh; 
          width: 100vw;
          background: #ffffff; 
          color: #1f2937; 
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
          overflow: hidden; 
          position: fixed; 
          inset: 0;
          padding-top: env(safe-area-inset-top, 0px);
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }

        .top-glow-mesh { position: absolute; top: 0; left: 0; right: 0; height: 35vh; pointer-events: none; z-index: 1; background: radial-gradient(circle at 15% 30%, rgba(96, 165, 250, 0.4), transparent 60%), radial-gradient(circle at 45% 20%, rgba(244, 114, 182, 0.35), transparent 55%), radial-gradient(circle at 75% 35%, rgba(52, 211, 153, 0.3), transparent 55%), radial-gradient(circle at 90% 15%, rgba(192, 132, 252, 0.35), transparent 60%), linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%); filter: blur(24px); }
        .workspace { flex: 1; display: flex; flex-direction: column; position: relative; height: 100%; width: 100%; z-index: 2; overflow: hidden; }
        .topbar { height: 56px; padding: 0 16px; display: flex; align-items: center; justify-content: space-between; position: relative; flex-shrink: 0; }
        .left-nav { display: flex; align-items: center; gap: 10px; }
        .brand-name { font-size: 1.2rem; font-weight: 700; color: #111827; }

        .training-active-tag {
          display: flex; align-items: center; gap: 6px;
          background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8;
          padding: 3px 8px; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;
        }
        .tag-dot { width: 6px; height: 6px; border-radius: 50%; background: #2563eb; animation: blink 1.2s infinite; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .exit-train-btn { background: transparent; border: none; color: #1d4ed8; font-size: 0.8rem; cursor: pointer; padding: 0 2px; }

        .icon-btn { background: transparent; border: none; color: #374151; cursor: pointer; border-radius: 50%; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; }
        .popup-card { position: absolute; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); padding: 6px; min-width: 160px; z-index: 100; display: flex; flex-direction: column; gap: 2px; }
        .top-dropdown { top: 48px; right: 0; }
        .settings-popup { bottom: 50px; right: 0; min-width: 140px; }
        .popup-menu-item { background: transparent; border: none; padding: 10px 14px; font-size: 0.9rem; color: #374151; border-radius: 10px; cursor: pointer; text-align: left; width: 100%; }
        .logout-item { color: #dc2626; }
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
        .footer-avatar-circle {
          width: 36px; height: 36px; min-width: 36px;
          border-radius: 50%; background: #3b82f6; color: #ffffff;
          font-weight: 700; font-size: 0.9rem;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; aspect-ratio: 1 / 1;
        }
        .avatar-img-circle { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
        .user-email-text { font-size: 0.82rem; font-weight: 600; color: #1f2937; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .settings-icon-btn { background: transparent; border: none; color: #6b7280; cursor: pointer; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; }
        
        .canvas { flex: 1; overflow-y: auto; padding: 0 16px 120px 16px; max-width: 800px; width: 100%; margin: 0 auto; -webkit-overflow-scrolling: touch; }
        .hero-screen-top-left { margin-top: 24px; }
        .gradient-text { font-size: 3rem; font-weight: 800; display: inline-block; margin-bottom: 4px; }
        .animated-shimmer { background: linear-gradient(90deg, #2563eb 0%, #7c3aed 20%, #ec4899 40%, #06b6d4 60%, #10b981 80%, #2563eb 100%); background-size: 300% 100%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: fluidShimmer 4s linear infinite; }
        @keyframes fluidShimmer { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .hero-main-title { font-size: 2.2rem; font-weight: 700; color: #111827; line-height: 1.15; }
        .training-guide-text { font-size: 0.88rem; color: #6b7280; margin-top: 6px; }

        .messages-list { display: flex; flex-direction: column; gap: 14px; padding-top: 16px; }
        .message-row { display: flex; width: 100%; }
        .message-row.user { justify-content: flex-end; }
        .message-row.assistant { justify-content: flex-start; }
        
        .message-bubble { max-width: 90%; }
        .message-row.user .message-bubble { background: #f3f4f6; padding: 10px 16px; border-radius: 18px; border-top-right-radius: 4px; }
        .message-row.assistant .message-bubble { background: transparent; padding: 2px 0; }
        .message-text { font-size: 0.96rem; line-height: 1.55; color: #1f2937; }
        
        /* In-App Floating Media Player */
        .in-app-media-player {
          position: fixed; bottom: 76px; right: 14px; width: 280px; height: 180px;
          background: #0f172a; border-radius: 14px; overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3); border: 1px solid #1e293b;
          z-index: 150; display: flex; flex-direction: column;
        }
        .player-top-header {
          display: flex; justify-content: space-between; align-items: center;
          background: #1e293b; padding: 5px 10px; color: #f8fafc; font-size: 0.75rem; font-weight: 600;
        }
        .track-title-tag { display: flex; align-items: center; gap: 6px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 220px; }
        .equalizer-bar { width: 6px; height: 6px; border-radius: 50%; background: #10b981; }
        .close-player-btn { background: transparent; border: none; color: #94a3b8; font-size: 1rem; cursor: pointer; }
        .player-iframe { width: 100%; flex: 1; border: none; }

        .code-container-card { background: #0f172a; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b; margin: 8px 0; width: 100%; }
        .code-card-header { display: flex; justify-content: space-between; align-items: center; background: #1e293b; padding: 6px 14px; border-bottom: 1px solid #334155; }
        .code-lang-label { font-size: 0.75rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; }
        .copy-action-btn { background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); color: #f1f5f9; padding: 4px 10px; border-radius: 6px; font-size: 0.74rem; cursor: pointer; }
        .copy-inner { display: flex; align-items: center; gap: 4px; }
        .copied-text { color: #34d399; font-weight: 600; }
        .code-pre-block { padding: 12px 14px; margin: 0; color: #e2e8f0; font-family: monospace; font-size: 0.85rem; line-height: 1.5; overflow-x: auto; white-space: pre; }
        
        .dock-container { position: absolute; bottom: 0; left: 0; right: 0; padding: 10px 14px 14px; background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 40%); display: flex; flex-direction: column; align-items: center; z-index: 10; }
        .composer-shell { width: 100%; max-width: 800px; background: #ffffff; border-radius: 26px; padding: 8px 14px; display: flex; align-items: flex-end; gap: 8px; border: 1.5px solid #e5e7eb; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .composer-shell.typing-active { border-color: transparent; background: linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(90deg, #2563eb, #9333ea, #ec4899, #06b6d4, #2563eb) border-box; background-size: 100% 100%, 300% 100%; animation: borderGlowFlow 3s linear infinite; }
        @keyframes borderGlowFlow { 0% { background-position: 0% 0%, 0% 50%; } 50% { background-position: 0% 0%, 100% 50%; } 100% { background-position: 0% 0%, 0% 50%; } }
        .composer-shell textarea { flex: 1; background: transparent; border: none; outline: none; color: #111827; font-size: 0.95rem; font-family: inherit; resize: none; max-height: 140px; line-height: 1.35; padding: 4px 0; }
        
        .composer-actions { display: flex; align-items: center; gap: 6px; margin-bottom: 1px; }
        
        .chat-mic-button {
          width: 34px; height: 34px; border-radius: 50%; background: #f3f4f6; color: #4b5563;
          border: none; display: flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .mic-active-pulse {
          background: #dc2626 !important; color: #ffffff !important;
          animation: micPulse 1.2s infinite ease-in-out;
        }
        @keyframes micPulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.5); }
          50% { transform: scale(1.1); box-shadow: 0 0 0 6px rgba(220, 38, 38, 0.2); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.0); }
        }

        .send-button-gemini { width: 34px; height: 34px; border-radius: 50%; background: #111827; color: #ffffff; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .active-glow-btn { background: linear-gradient(135deg, #2563eb, #7c3aed); }

        /* 4-Box PIN Modal */
        .modal-backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 14px; }
        .pin-card-modal { background: #ffffff; border-radius: 20px; padding: 26px 20px; max-width: 320px; width: 100%; text-align: center; }
        .pin-header h3 { font-size: 1.15rem; font-weight: 700; color: #111827; margin-bottom: 4px; }
        .pin-header p { font-size: 0.8rem; color: #6b7280; margin-bottom: 18px; }
        .pin-boxes-row { display: flex; justify-content: center; gap: 10px; margin-bottom: 16px; }
        .pin-digit-box { width: 46px; height: 50px; text-align: center; font-size: 1.4rem; font-weight: 700; border: 1.5px solid #e5e7eb; border-radius: 12px; outline: none; }
        .pin-digit-box:focus { border-color: #2563eb; background: #eff6ff; }
        .pin-error-text { font-size: 0.78rem; color: #dc2626; font-weight: 600; margin-bottom: 10px; }
        .mode-on-btn { width: 100%; padding: 12px; background: #2563eb; color: #ffffff; font-size: 0.95rem; font-weight: 700; border-radius: 12px; border: none; cursor: pointer; }

        .auth-loading-screen { height: 100dvh; width: 100vw; display: flex; align-items: center; justify-content: center; background: #fff; }
        .loader-spinner { width: 34px; height: 34px; border: 3px solid #f3f4f6; border-top: 3px solid #2563eb; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </main>
  )
}
