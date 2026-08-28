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
    navigator.clipboard.writeText(cleanCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel()
  }
}

function speakVoice(text) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return
  stopVoicePlayback()
  const cleanText = text.replace(/```[\s\S]*?```/g, "Here is the code.")
  const utterance = new SpeechSynthesisUtterance(cleanText)
  utterance.rate = 1.0
  utterance.pitch = 1.0
  window.speechSynthesis.speak(utterance)
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

  // Hardware Camera, Screenshot & Music Player States
  const [showCameraModal, setShowCameraModal] = useState(false)
  const [capturedPhoto, setCapturedPhoto] = useState(null)
  const [screenshotToast, setScreenshotToast] = useState(null)
  const [currentTrack, setCurrentTrack] = useState(null)

  const videoCameraRef = useRef(null)
  const cameraStreamRef = useRef(null)
  const pinInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]
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
      if (user) {
        const safeUserData = { uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL }
        setCurrentUser(safeUserData)
        localStorage.setItem("himo_cached_user", JSON.stringify(safeUserData))
      } else {
        setCurrentUser(null)
        localStorage.removeItem("himo_cached_user")
      }
      setAuthChecking(false)
    })

    getAllChatsFromDB().then((chats) => {
      if (chats && chats.length > 0) {
        const sorted = chats.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.updatedAt - a.updatedAt)
        setSavedSessions(sorted)
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
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

  // Camera Handlers
  const openLiveCamera = async () => {
    setShowCameraModal(true)
    setCapturedPhoto(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      })
      cameraStreamRef.current = stream
      if (videoCameraRef.current) {
        videoCameraRef.current.srcObject = stream
      }
    } catch (err) {
      alert("Camera permission denied or camera not found.")
      setShowCameraModal(false)
    }
  }

  const capturePhotoFrame = () => {
    if (videoCameraRef.current) {
      const video = videoCameraRef.current
      const canvas = document.createElement("canvas")
      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 480
      const ctx = canvas.getContext("2d")
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL("image/jpeg")
      setCapturedPhoto(dataUrl)
      
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(t => t.stop())
      }
    }
  }

  const closeLiveCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(t => t.stop())
    }
    setShowCameraModal(false)
    setCapturedPhoto(null)
  }

  // Real Screenshot Handler
  const captureScreenshot = () => {
    if (typeof window === "undefined") return
    
    const takeSnap = () => {
      if (window.html2canvas) {
        window.html2canvas(document.body).then((canvas) => {
          const imgData = canvas.toDataURL("image/png")
          const dlLink = document.createElement("a")
          dlLink.download = `Himo_Screenshot_${Date.now()}.png`
          dlLink.href = imgData
          dlLink.click()

          setScreenshotToast("Screenshot Saved to Device!")
          speakVoice("Screenshot taken and saved.")
          setTimeout(() => setScreenshotToast(null), 3500)
        })
      } else {
        const script = document.createElement("script")
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
        script.onload = takeSnap
        document.head.appendChild(script)
      }
    }
    takeSnap()
  }

  const persistChatSession = async (updatedMessages, chatId = currentChatId) => {
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
      speakVoice("Training mode activated. Speak or write what you want me to learn or delete.")
    } else {
      setPinError("Galat Password! (5656 enter karein)")
    }
  }

  const processTrainingOrDeletion = async (rawSentence) => {
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
  }

  const toggleVoiceRecording = () => {
    if (typeof window === "undefined") return
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("Browser speech recognition not supported.")
      return
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop()
      setIsListening(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "en-US"

    recognition.onstart = () => setIsListening(true)

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript
      if (transcript && transcript.trim()) {
        handleSend(transcript.trim(), true)
      }
    }

    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
  }

  // Robust In-App Song / Bhajan Player Engine
  const handleInAppMusicPlay = (query) => {
    let cleanTrack = query
      .replace(/^(play\s+a\s+song|play\s+song|play\s+music|play\s+bhajan|play|chalao|suno|lagao)\s*/i, "")
      .replace(/\b(please|sunao|chalao|play|karo)\b/gi, "")
      .trim()

    if (!cleanTrack || cleanTrack === "a" || cleanTrack === "song") {
      cleanTrack = "Hanuman Chalisa"
    }

    // Use Clean Search Embed Feed that doesn't get blocked
    const embedUrl = `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(cleanTrack)}`

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

    // 1. In-App Music / Song / Bhajan Player
    if (
      qLower.startsWith("play ") || 
      qLower.includes("gana chalao") || 
      qLower.includes("bhajan chalao") || 
      qLower.includes("song play") || 
      qLower.startsWith("lagao ")
    ) {
      return handleInAppMusicPlay(q)
    }

    // 2. Hardware Actions (Screenshot, Camera, Open App)
    try {
      const deviceAction = await handleDeviceAction(q, openLiveCamera, captureScreenshot)
      if (deviceAction) return deviceAction
    } catch (e) {}

    // 3. Human Newton Trained Memory
    try {
      const memoryAns = await getTrainedKnowledge(q)
      if (memoryAns) return cleanFormatting(memoryAns)
    } catch (e) {}

    // 4. Math Master
    try {
      const mathResult = MathMasterEngine.evaluate(q)
      if (mathResult) return cleanFormatting(mathResult)
    } catch (e) {}

    // 5. Code Engine
    try {
      const codeResult = generateCodeFromPrompt(q)
      if (codeResult) return codeResult
    } catch (e) {}

    // 6. Web Search Engine
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

      {/* Screenshot Notification Toast */}
      {screenshotToast && (
        <div className="screenshot-toast">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <span>{screenshotToast}</span>
        </div>
      )}

      {/* In-App Floating Music Player */}
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
            allow="autoplay; encrypted-media; picture-in-picture" 
            className="player-iframe"
          />
        </div>
      )}

      {/* Live Camera Viewfinder Modal */}
      {showCameraModal && (
        <div className="modal-backdrop" onClick={closeLiveCamera}>
          <div className="camera-viewfinder-card" onClick={(e) => e.stopPropagation()}>
            <div className="camera-card-top">
              <span>Live Camera</span>
              <button type="button" onClick={closeLiveCamera} className="camera-close-x">✕</button>
            </div>

            <div className="camera-video-frame">
              {capturedPhoto ? (
                <img src={capturedPhoto} alt="Captured" className="captured-photo-img" />
              ) : (
                <video ref={videoCameraRef} autoPlay playsInline className="live-camera-video"></video>
              )}
            </div>

            <div className="camera-actions-row">
              {capturedPhoto ? (
                <>
                  <a href={capturedPhoto} download="himo_capture.jpg" className="camera-btn save-photo-btn">Save Picture</a>
                  <button type="button" onClick={openLiveCamera} className="camera-btn retake-btn">Retake</button>
                </>
              ) : (
                <button type="button" onClick={capturePhotoFrame} className="snap-shutter-btn">
                  <div className="shutter-inner"></div>
                </button>
              )}
            </div>
          </div>
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
            <button className="icon-btn" onClick={() => setSidebarOpen(true)}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></button>
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

        {/* Input Floating Composer */}
        <div className="dock-container">
          <div className={`composer-shell ${isTyping ? "typing-active" : ""}`}>
            <textarea 
              ref={textareaRef} 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} 
              placeholder={isListening ? "Listening to your voice..." : (isTrainingModeActive ? "Train: When I say X you say Y... or Delete X" : "Play song, take photo, or ask anything...")} 
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
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .app-shell { display: flex; height: 100vh; background: #ffffff; color: #1f2937; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; overflow: hidden; position: relative; }
        .top-glow-mesh { position: absolute; top: 0; left: 0; right: 0; height: 32vh; pointer-events: none; z-index: 1; background: radial-gradient(circle at 15% 30%, rgba(96, 165, 250, 0.4), transparent 60%), radial-gradient(circle at 45% 20%, rgba(244, 114, 182, 0.35), transparent 55%), radial-gradient(circle at 75% 35%, rgba(52, 211, 153, 0.3), transparent 55%), radial-gradient(circle at 90% 15%, rgba(192, 132, 252, 0.35), transparent 60%), linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%); filter: blur(24px); }
        .workspace { flex: 1; display: flex; flex-direction: column; position: relative; height: 100vh; z-index: 2; }
        .topbar { height: 64px; padding: 0 18px; display: flex; align-items: center; justify-content: space-between; position: relative; }
        .left-nav { display: flex; align-items: center; gap: 12px; }
        .brand-name { font-size: 1.25rem; font-weight: 700; color: #111827; }

        .training-active-tag {
          display: flex; align-items: center; gap: 6px;
          background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8;
          padding: 4px 10px; border-radius: 9999px; font-size: 0.78rem; font-weight: 600;
        }
        .tag-dot { width: 7px; height: 7px; border-radius: 50%; background: #2563eb; animation: blink 1.2s infinite; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .exit-train-btn { background: transparent; border: none; color: #1d4ed8; font-size: 0.85rem; cursor: pointer; padding: 0 2px; }

        .icon-btn { background: transparent; border: none; color: #374151; cursor: pointer; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
        .popup-card { position: absolute; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); padding: 6px; min-width: 160px; z-index: 100; display: flex; flex-direction: column; gap: 2px; }
        .top-dropdown { top: 48px; right: 0; }
        .settings-popup { bottom: 50px; right: 0; min-width: 140px; }
        .popup-menu-item { background: transparent; border: none; padding: 10px 14px; font-size: 0.9rem; color: #374151; border-radius: 10px; cursor: pointer; text-align: left; width: 100%; }
        .logout-item { color: #dc2626; }
        .sidebar { position: fixed; top: 0; left: -320px; width: 290px; height: 100vh; background: #ffffff; border-right: 1px solid #e5e7eb; transition: left 0.25s ease; z-index: 100; padding: 16px; display: flex; flex-direction: column; }
        .sidebar.open { left: 0; }
        .sidebar-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.3); backdrop-filter: blur(2px); z-index: 99; }
        .new-chat-btn { display: flex; align-items: center; gap: 12px; background: #f3f4f6; border: 1px solid #e5e7eb; color: #1f2937; padding: 12px 18px; border-radius: 24px; cursor: pointer; font-size: 0.9rem; font-weight: 500; margin-bottom: 24px; }
        .sidebar-section { flex: 1; overflow-y: auto; }
        .sidebar-label { font-size: 0.75rem; font-weight: 600; color: #9ca3af; margin-bottom: 12px; text-transform: uppercase; }
        .recent-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 14px; font-size: 0.88rem; color: #4b5563; cursor: pointer; }
        .active-chat-item { background: #eff6ff; color: #2563eb; font-weight: 600; }
        
        .sidebar-footer { border-top: 1px solid #e5e7eb; padding-top: 14px; display: flex; align-items: center; justify-content: space-between; }
        .user-info-wrapper { display: flex; align-items: center; gap: 10px; overflow: hidden; max-width: 200px; }
        .footer-avatar-circle {
          width: 38px; height: 38px; min-width: 38px;
          border-radius: 50%; background: #3b82f6; color: #ffffff;
          font-weight: 700; font-size: 0.95rem;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; aspect-ratio: 1 / 1; border: 1.5px solid rgba(0,0,0,0.08);
        }
        .avatar-img-circle {
          width: 100%; height: 100%; object-fit: cover; border-radius: 50%;
        }
        .user-email-text { font-size: 0.85rem; font-weight: 600; color: #1f2937; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .settings-icon-btn { background: transparent; border: none; color: #6b7280; cursor: pointer; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; }
        
        .canvas { flex: 1; overflow-y: auto; padding: 0 20px 140px 20px; max-width: 820px; width: 100%; margin: 0 auto; }
        .hero-screen-top-left { margin-top: 40px; }
        .gradient-text { font-size: 3.6rem; font-weight: 800; display: inline-block; margin-bottom: 8px; }
        .animated-shimmer { background: linear-gradient(90deg, #2563eb 0%, #7c3aed 20%, #ec4899 40%, #06b6d4 60%, #10b981 80%, #2563eb 100%); background-size: 300% 100%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: fluidShimmer 4s linear infinite; }
        @keyframes fluidShimmer { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .hero-main-title { font-size: 2.7rem; font-weight: 700; color: #111827; }
        .training-guide-text { font-size: 0.95rem; color: #6b7280; margin-top: 8px; }

        .messages-list { display: flex; flex-direction: column; gap: 18px; padding-top: 24px; }
        .message-row { display: flex; width: 100%; }
        .message-row.user { justify-content: flex-end; }
        .message-row.assistant { justify-content: flex-start; }
        
        .message-bubble { max-width: 88%; }
        .message-row.user .message-bubble { background: #f3f4f6; padding: 12px 18px; border-radius: 20px; border-top-right-radius: 4px; }
        .message-row.assistant .message-bubble { background: transparent; padding: 4px 0; }
        .message-text { font-size: 1rem; line-height: 1.6; color: #1f2937; }
        
        /* Floating In-App Media Player Frame */
        .in-app-media-player {
          position: fixed; bottom: 84px; right: 20px; width: 310px; height: 210px;
          background: #0f172a; border-radius: 16px; overflow: hidden;
          box-shadow: 0 12px 30px rgba(0,0,0,0.35); border: 1.5px solid #1e293b;
          z-index: 150; display: flex; flex-direction: column;
        }
        .player-top-header {
          display: flex; justify-content: space-between; align-items: center;
          background: #1e293b; padding: 6px 12px; color: #f8fafc; font-size: 0.78rem; font-weight: 600;
        }
        .track-title-tag { display: flex; align-items: center; gap: 6px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 240px; }
        .equalizer-bar { width: 6px; height: 6px; border-radius: 50%; background: #10b981; }
        .close-player-btn { background: transparent; border: none; color: #94a3b8; font-size: 1.1rem; cursor: pointer; }
        .player-iframe { width: 100%; flex: 1; border: none; }

        .code-container-card { background: #0f172a; border-radius: 14px; overflow: hidden; border: 1px solid #1e293b; margin: 10px 0; box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25); width: 100%; }
        .code-card-header { display: flex; justify-content: space-between; align-items: center; background: #1e293b; padding: 8px 16px; border-bottom: 1px solid #334155; }
        .code-lang-label { font-size: 0.8rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
        .copy-action-btn { background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); color: #f1f5f9; padding: 5px 12px; border-radius: 8px; font-size: 0.78rem; font-weight: 500; cursor: pointer; transition: background 0.2s; }
        .copy-action-btn:hover { background: rgba(255, 255, 255, 0.18); }
        .copy-inner { display: flex; align-items: center; gap: 6px; }
        .copied-text { color: #34d399; font-weight: 600; }
        .code-pre-block { padding: 16px 18px; margin: 0; color: #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.9rem; line-height: 1.55; overflow-x: auto; white-space: pre; }
        
        .dock-container { position: absolute; bottom: 0; left: 0; right: 0; padding: 16px 20px 24px; background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 45%); display: flex; flex-direction: column; align-items: center; }
        .composer-shell { width: 100%; max-width: 800px; background: #ffffff; border-radius: 28px; padding: 10px 16px; display: flex; align-items: flex-end; gap: 10px; border: 1.5px solid #e5e7eb; }
        .composer-shell.typing-active { border-color: transparent; background: linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(90deg, #2563eb, #9333ea, #ec4899, #06b6d4, #2563eb) border-box; background-size: 100% 100%, 300% 100%; animation: borderGlowFlow 3s linear infinite; box-shadow: 0 6px 28px rgba(37, 99, 235, 0.16); }
        @keyframes borderGlowFlow { 0% { background-position: 0% 0%, 0% 50%; } 50% { background-position: 0% 0%, 100% 50%; } 100% { background-position: 0% 0%, 0% 50%; } }
        .composer-shell textarea { flex: 1; background: transparent; border: none; outline: none; color: #111827; font-size: 1rem; font-family: inherit; resize: none; max-height: 160px; line-height: 1.4; padding: 6px 0; }
        
        .composer-actions { display: flex; align-items: center; gap: 8px; margin-bottom: 2px; }
        
        .chat-mic-button {
          width: 36px; height: 36px; border-radius: 50%; background: #f3f4f6; color: #4b5563;
          border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s, color 0.2s;
        }
        .chat-mic-button:hover { background: #e5e7eb; color: #111827; }
        .mic-active-pulse {
          background: #dc2626 !important; color: #ffffff !important;
          animation: micPulse 1.2s infinite ease-in-out;
        }
        @keyframes micPulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.5); }
          50% { transform: scale(1.1); box-shadow: 0 0 0 8px rgba(220, 38, 38, 0.2); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.0); }
        }

        .send-button-gemini { width: 36px; height: 36px; border-radius: 50%; background: #111827; color: #ffffff; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .active-glow-btn { background: linear-gradient(135deg, #2563eb, #7c3aed); }

        /* Camera Viewfinder Modal */
        .camera-viewfinder-card {
          background: #0f172a; border-radius: 24px; padding: 18px; max-width: 420px; width: 100%;
          display: flex; flex-direction: column; gap: 14px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }
        .camera-card-top { display: flex; justify-content: space-between; align-items: center; color: #f8fafc; font-weight: 700; }
        .camera-close-x { background: transparent; border: none; color: #94a3b8; font-size: 1.2rem; cursor: pointer; }
        .camera-video-frame {
          width: 100%; height: 280px; background: #000000; border-radius: 16px; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .live-camera-video, .captured-photo-img { width: 100%; height: 100%; object-fit: cover; }
        .camera-actions-row { display: flex; justify-content: center; gap: 12px; align-items: center; }
        .snap-shutter-btn {
          width: 64px; height: 64px; border-radius: 50%; background: transparent;
          border: 4px solid #ffffff; display: flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .shutter-inner { width: 48px; height: 48px; border-radius: 50%; background: #ffffff; transition: transform 0.1s; }
        .snap-shutter-btn:active .shutter-inner { transform: scale(0.9); background: #ef4444; }
        .camera-btn { padding: 10px 18px; border-radius: 12px; font-size: 0.9rem; font-weight: 700; text-decoration: none; cursor: pointer; border: none; }
        .save-photo-btn { background: #2563eb; color: #fff; }
        .retake-btn { background: #334155; color: #fff; }

        /* Screenshot Toast Banner */
        .screenshot-toast {
          position: fixed; top: 16px; left: 50%; transform: translateX(-50%);
          background: #10b981; color: #ffffff; padding: 10px 18px; border-radius: 9999px;
          display: flex; align-items: center; gap: 8px; font-size: 0.88rem; font-weight: 600;
          z-index: 300; box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
          animation: slideDownToast 0.25s ease-out;
        }

        @keyframes slideDownToast {
          from { transform: translate(-50%, -16px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }

        /* 4-Box PIN Modal */
        .modal-backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(5px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 16px; }
        .pin-card-modal { background: #ffffff; border-radius: 24px; padding: 32px 24px; max-width: 360px; width: 100%; text-align: center; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25); }
        .pin-header h3 { font-size: 1.3rem; font-weight: 700; color: #111827; margin-bottom: 6px; }
        .pin-header p { font-size: 0.85rem; color: #6b7280; margin-bottom: 24px; }
        .pin-boxes-row { display: flex; justify-content: center; gap: 12px; margin-bottom: 20px; }
        .pin-digit-box { width: 52px; height: 58px; text-align: center; font-size: 1.6rem; font-weight: 700; border: 2px solid #e5e7eb; border-radius: 14px; outline: none; }
        .pin-digit-box:focus { border-color: #2563eb; background: #eff6ff; }
        .pin-error-text { font-size: 0.82rem; color: #dc2626; font-weight: 600; margin-bottom: 12px; }
        .mode-on-btn { width: 100%; padding: 14px; background: #2563eb; color: #ffffff; font-size: 1rem; font-weight: 700; border-radius: 14px; border: none; cursor: pointer; }

        .auth-loading-screen { height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center; background: #fff; }
        .loader-spinner { width: 38px; height: 38px; border: 3px solid #f3f4f6; border-top: 3px solid #2563eb; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </main>
  )
}
