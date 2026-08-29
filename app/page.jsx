"use client"

import { useState, useRef, useEffect } from "react"
import LoginPage from "../components/LoginPage"
import MathMasterEngine from "../src/lib/mathMasterEngine"
import { generateCodeFromPrompt } from "../src/lib/codeMasterEngine"
import { fetchLiveWebData } from "../src/lib/webSearchEngine"
import { handleDeviceAction } from "../src/lib/deviceControlEngine"
import { getHumanReply } from "../src/lib/humanTalkEngine"
import WorldEngine from "../src/lib/WorldEngine"
import CodeEngine from "../src/lib/CodeEngine"
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

function CodeBlock({ codeText, fileName }) {
  const [copied, setCopied] = useState(false)
  const cleanCode = (codeText || "").replace(/^```[a-zA-Z]*\n?/, "").replace(/```$/, "").trim()

  const handleCopy = () => {
    try {
      if (typeof navigator !== "undefined") {
        navigator.clipboard.writeText(cleanCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (e) {}
  }

  const handleDownload = () => {
    try {
      const blob = new Blob([cleanCode], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName || 'code.txt'
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {}
  }

  return (
    <div className="code-container-card">
      <div className="code-card-header">
        <span className="code-lang-label">📄 {fileName || 'code.txt'}</span>
        <div className="code-actions">
          <button type="button" onClick={handleCopy} className="copy-action-btn" title="Copy code">
            {copied ? <span className="copied-text">Copied ✓</span> : (
              <span className="copy-inner">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy
              </span>
            )}
          </button>
          <button type="button" onClick={handleDownload} className="copy-action-btn" title="Download file">
            <span className="copy-inner">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download
            </span>
          </button>
        </div>
      </div>
      <pre className="code-pre-block"><code>{cleanCode}</code></pre>
    </div>
  )
}

function cleanFormatting(text) {
  if (!text) return ""
  return text.replace(/\*\*/g, "").replace(/\*/g, "")
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

async function speakVoice(text, onEndCallback = null) {
  if (!text || typeof window === "undefined") {
    if (onEndCallback) onEndCallback()
    return
  }

  try {
    await stopVoicePlayback()

    const cleanText = text.replace(/```[\s\S]*?```/g, "Code bana diya hai bhai.")
      .replace(/[#*•_`]/g, "")
      .trim()

    if (!cleanText) {
      if (onEndCallback) onEndCallback()
      return
    }

    try {
      const { TextToSpeech } = await import("@capacitor-community/text-to-speech")
      await TextToSpeech.speak({
        text: cleanText.slice(0, 300),
        lang: "hi-IN",
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        category: "ambient"
      })
      if (onEndCallback) onEndCallback()
      return
    } catch (nativeErr) {}

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      window.speechSynthesis.resume()

      const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 300))
      utterance.rate = 1.0
      utterance.lang = "hi-IN"

      let callbackFired = false
      const safeCallback = () => {
        if (!callbackFired) {
          callbackFired = true
          if (onEndCallback) onEndCallback()
        }
      }

      utterance.onend = safeCallback
      utterance.onerror = safeCallback

      setTimeout(safeCallback, 8000)

      window.speechSynthesis.speak(utterance)
    } else {
      if (onEndCallback) onEndCallback()
    }
  } catch (err) {
    if (onEndCallback) onEndCallback()
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
  const [isTrainingModeActive, setIsTrainingModeActive] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)
  const [pinDigits, setPinDigits] = useState(["", "", "", ""])
  const [pinError, setPinError] = useState("")
  const [currentTrack, setCurrentTrack] = useState(null)

  // Voice States
  const [isDictating, setIsDictating] = useState(false)
  const [isLiveMode, setIsLiveMode] = useState(false)
  const [liveTranscript, setLiveTranscript] = useState("")
  const [isAiSpeaking, setIsAiSpeaking] = useState(false)

  // World Engine States
  const [showWorld, setShowWorld] = useState(false)
  const [worldEngineInstance, setWorldEngineInstance] = useState(null)

  const recognitionRef = useRef(null)
  const isLiveModeRef = useRef(false)
  const isDictatingRef = useRef(false)
  const isAiSpeakingRef = useRef(false)

  const pinInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const worldContainerRef = useRef(null)

  useEffect(() => {
    isLiveModeRef.current = isLiveMode
  }, [isLiveMode])

  useEffect(() => {
    isDictatingRef.current = isDictating
  }, [isDictating])

  useEffect(() => {
    isAiSpeakingRef.current = isAiSpeaking
  }, [isAiSpeaking])

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

  // Initialize World Engine
  useEffect(() => {
    if (showWorld && worldContainerRef.current && !worldEngineInstance) {
      const engine = new WorldEngine(worldContainerRef.current)
      setWorldEngineInstance(engine)
    }

    return () => {
      if (worldEngineInstance) {
        worldEngineInstance.dispose()
        setWorldEngineInstance(null)
      }
    }
  }, [showWorld])

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
      speakVoice("Training mode start ho gaya hai bhai!")
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
        const reply = "Saari memory permanently clear ho gayi bhai!"
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
            const reply = `Maine "${deletedTopic}" ki memory delete kar di hai bhai!`
            speakVoice(reply)
            return reply
          } else {
            const reply = `"${targetQuery}" naam ki koi memory nahi mili bhai.`
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
        const reply = `Got it bhai! Jab bolega "${topic}", main bolunga "${answer}".`
        speakVoice(reply)
        return reply
      }

      const parts = text.split("=")
      if (parts.length === 2 && parts[0].trim() && parts[1].trim()) {
        await saveTrainedKnowledge(parts[0].trim(), parts[1].trim())
        const reply = `Got it bhai! "${parts[0].trim()}" yaad kar liya.`
        speakVoice(reply)
        return reply
      }

      const helpMsg = "Bolkar sikha bhai: 'When I say [Question] you say [Answer]'"
      speakVoice(helpMsg)
      return helpMsg
    } catch (e) {
      return "Processed bhai."
    }
  }

  // --- Recognition Factory ---
  const createSpeechInstance = () => {
    if (typeof window === "undefined") return null
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return null

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "hi-IN"
    return recognition
  }

  // --- 1. MIC ONLY MODE (Listen & Type Realtime in Top Header / Textarea) ---
  const toggleDictationMode = () => {
    if (isLiveMode) stopLiveMode()

    if (isDictating) {
      stopDictationMode()
      return
    }

    const recognition = createSpeechInstance()
    if (!recognition) {
      alert("Microphone speech recognition is not supported on this browser.")
      return
    }

    recognitionRef.current = recognition
    setIsDictating(true)

    recognition.onresult = (event) => {
      let fullTranscript = ""
      for (let i = 0; i < event.results.length; ++i) {
        fullTranscript += event.results[i][0].transcript
      }
      const clean = fullTranscript.trim()
      if (clean) {
        setLiveTranscript(clean)
        setMessage(clean)
      }
    }

    recognition.onend = () => {
      if (isDictatingRef.current) {
        try { recognition.start() } catch (e) {}
      } else {
        setIsDictating(false)
      }
    }

    recognition.onerror = (e) => {
      if (e.error !== "no-speech") {
        setIsDictating(false)
      }
    }

    try {
      recognition.start()
    } catch (e) {
      setIsDictating(false)
    }
  }

  const stopDictationMode = () => {
    isDictatingRef.current = false
    setIsDictating(false)
    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch (e) {}
      recognitionRef.current = null
    }
  }

  // --- 2. VOICE WAVE MODE (Continuous Live Two-Way Conversation) ---
  const toggleLiveMode = () => {
    if (isDictating) stopDictationMode()

    if (isLiveMode) {
      stopLiveMode()
      return
    }

    setIsLiveMode(true)
    setIsAiSpeaking(true)

    // Voice Greetings when opening Live Wave Mode
    speakVoice("Hi I'm Himo, tell me your question, I can assist you", () => {
      setIsAiSpeaking(false)
      if (isLiveModeRef.current) {
        startLiveCycle()
      }
    })
  }

  const startLiveCycle = () => {
    if (isAiSpeakingRef.current) return

    const recognition = createSpeechInstance()
    if (!recognition) {
      alert("Live Voice is not supported on this browser.")
      setIsLiveMode(false)
      return
    }

    recognitionRef.current = recognition

    recognition.onresult = (event) => {
      if (isAiSpeakingRef.current) return

      let interim = ""
      let finalTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        } else {
          interim += event.results[i][0].transcript
        }
      }

      const activeText = (finalTranscript || interim).trim()
      if (activeText) {
        setLiveTranscript(activeText)
      }

      if (finalTranscript && finalTranscript.trim()) {
        try { recognition.stop() } catch (e) {}
        handleSend(finalTranscript.trim(), true)
      }
    }

    recognition.onend = () => {
      if (isLiveModeRef.current && !isAiSpeakingRef.current) {
        try { recognition.start() } catch (e) {}
      }
    }

    recognition.onerror = (e) => {
      if (e.error === "not-allowed") {
        alert("Microphone permission allowed nahi hai bhai! Settings me check karo.")
        stopLiveMode()
      }
    }

    try {
      recognition.start()
    } catch (e) {}
  }

  const stopLiveMode = () => {
    isLiveModeRef.current = false
    setIsLiveMode(false)
    setIsAiSpeaking(false)
    setLiveTranscript("")
    stopVoicePlayback()

    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch (e) {}
      recognitionRef.current = null
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

    return `Gana "${cleanTrack}" screen par play ho raha hai bhai!`
  }

  async function think(prompt, hasAttachedPhoto = false) {
    const q = prompt.trim()
    const qLower = q.toLowerCase()

    // World Map Check - World Engine
    if (qLower.includes('world') || qLower.includes('3d world') || qLower.includes('world map') || qLower.includes('map') || qLower.includes('3d map') || qLower.includes('earth') || qLower.includes('terrain')) {
      return "WORLD_3D_ENGINE"
    }

    // Code Generation Check - Code Engine
    const codeKeywords = ['code', 'kode', 'program', 'script', 'function', 'app', 'application', 'calculator', 'game', 'website', 'webpage', 'html', 'css', 'python', 'react', 'javascript', 'java', 'todo', 'form', 'database', 'sql', 'banao', 'make', 'create', 'generate', 'likho', 'write']
    
    if (codeKeywords.some(keyword => qLower.includes(keyword))) {
      try {
        const codeEngine = new CodeEngine()
        const generatedCode = codeEngine.generateCode(q)
        if (generatedCode) {
          return {
            type: "code_file",
            code: generatedCode,
            fileName: codeEngine.fileName
          }
        }
      } catch (e) {}
    }

    const humanTalk = getHumanReply(q)
    if (humanTalk) {
      return humanTalk
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

    return `Bhai '${q}' par exact information nahi mili. Ek baar specific sawaal poochh na!`
  }

  async function handleSend(textToSend, isVoice = false) {
    const prompt = (typeof textToSend === "string" ? textToSend : message).trim()

    if (!prompt || loading) return

    const lowerPrompt = (prompt || "").toLowerCase()

    if (['stop', 'chup', 'ruko', 'pause', 'stop speaking', 'shant', 'stop music'].includes(lowerPrompt)) {
      stopVoicePlayback()
      setCurrentTrack(null)
      setMessage("")
      if (isVoice) stopLiveMode()
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

    const userMsgObj = { 
      role: "user", 
      content: prompt
    }

    const newMsgs = [...messages, userMsgObj]
    setMessages(newMsgs)
    setLoading(true)

    await persistChatSession(newMsgs)

    try {
      let answer = ""

      if (isTrainingModeActive || isDirectDeleteCommand) {
        answer = await processTrainingOrDeletion(prompt)
      } else {
        answer = await think(prompt)
      }

      if (answer === "WORLD_3D_ENGINE") {
        setShowWorld(true)
        const worldMsg = "🌍 3D World Engine activated! Use mouse to rotate and scroll to zoom."
        if (isVoice || isLiveModeRef.current) {
          setIsAiSpeaking(true)
          speakVoice(worldMsg, () => {
            setIsAiSpeaking(false)
            if (isLiveModeRef.current) {
              setLiveTranscript("")
              setTimeout(startLiveCycle, 200)
            }
          })
        }
        const finalMsgs = [...newMsgs, { role: "assistant", content: worldMsg, isWorld: true }]
        setMessages(finalMsgs)
        await persistChatSession(finalMsgs)
      } else {
        if (typeof answer !== "object") {
          if (isVoice || isLiveModeRef.current) {
            setIsAiSpeaking(true)
            speakVoice(answer, () => {
              setIsAiSpeaking(false)
              if (isLiveModeRef.current) {
                setLiveTranscript("")
                setTimeout(startLiveCycle, 200)
              }
            })
          }
        }
        const finalMsgs = [...newMsgs, { role: "assistant", content: answer }]
        setMessages(finalMsgs)
        await persistChatSession(finalMsgs)
      }
    } catch (error) {
      const errorMsgs = [...newMsgs, { role: "assistant", content: "Kuch issue ho gaya bhai, dubara bolo." }]
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
      if (worldEngineInstance) {
        worldEngineInstance.dispose()
        setWorldEngineInstance(null)
      }
      setShowWorld(false)
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
      {/* Dynamic Gemini Live Fluid Wave Light around screen */}
      <div className={`screen-wave-aurora ${isLiveMode ? "aurora-active" : ""}`}>
        <div className="aurora-beam top-beam"></div>
        <div className="aurora-beam right-beam"></div>
        <div className="aurora-beam bottom-beam"></div>
        <div className="aurora-beam left-beam"></div>
      </div>

      <div className="top-glow-mesh" />
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

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

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-top-spacer" />
        <button className="new-chat-btn" onClick={() => { 
          setMessages([]); 
          setCurrentChatId(null); 
          setShowWorld(false);
          if (worldEngineInstance) {
            worldEngineInstance.dispose();
            setWorldEngineInstance(null);
          }
          setSidebarOpen(false); 
        }}>
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
                <div key={session.id} className={`recent-item ${session.id === currentChatId ? "active-chat-item" : ""}`} onClick={() => { setCurrentChatId(session.id); setMessages(session.messages || []); setShowWorld(false); setSidebarOpen(false); }}>
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
                  onClick={() => { setIsTrainingModeActive(false); speakVoice("Training mode band kar diya bhai."); }}
                  title="Exit Training Mode"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Top Header Live Realtime Subtitle for Dictation / Live */}
          {(isDictating || isLiveMode) && liveTranscript && (
            <div className="header-live-transcript-pill">
              <span className="live-typing-dot"></span>
              <span className="live-transcript-text truncate">{liveTranscript}</span>
            </div>
          )}

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

        <div className="canvas">
          {messages.length === 0 && (
            <div className="hero-screen-top-left">
              <div className="hero-greeting-left">
                <span className="gradient-text animated-shimmer">Himo Omni</span>
                <h1 className="hero-main-title">
                  {isTrainingModeActive ? "Kuch naya sikha ya delete kar bhai..." : "How can I help you today?"}
                </h1>
              </div>

              {/* Single Row 3 Modern Action Cards */}
              {!isTrainingModeActive && (
                <div className="hero-cards-row">
                  <div className="hero-action-card" onClick={() => handleSend("Calculate 25 * 48 + 120 / 4")}>
                    <div className="card-icon-bubble math-bubble">📐</div>
                    <div className="card-info">
                      <h3>Maths Master</h3>
                      <p>Solve complex equations & calculations</p>
                    </div>
                  </div>

                  <div className="hero-action-card" onClick={() => handleSend("Explain quantum computing in simple words")}>
                    <div className="card-icon-bubble qa-bubble">💡</div>
                    <div className="card-info">
                      <h3>Q & A</h3>
                      <p>Ask smart questions & get accurate answers</p>
                    </div>
                  </div>

                  <div className="hero-action-card live-card" onClick={toggleLiveMode}>
                    <div className="card-icon-bubble live-bubble">🎙️</div>
                    <div className="card-info">
                      <h3>Live Conversation</h3>
                      <p>Real-time instant voice chat with Himo</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="messages-list">
            {messages.map((msg, index) => (
              <div key={index} className={`message-row ${msg.role}`}>
                <div className="message-bubble">
                  <div className="message-text">
                    {typeof msg.content === "object" && msg.content?.type === "code_file" ? (
                      <CodeBlock codeText={msg.content.code} fileName={msg.content.fileName} />
                    ) : typeof msg.content === "string" && msg.content.includes("```") ? (
                      <CodeBlock codeText="{msg.content}" fileName="code.txt"/>
                    ) : (
                      cleanFormatting(typeof msg.content === "string" ? msg.content : "").split("\n").map((line, i) => (
                        <p key={i}>{line || "\u00A0"}</p>
                      ))
                    )}
                  </div>

                  {msg.isWorld && (
                    <div 
                      ref={worldContainerRef}
                      className="world-container"
                      style={{ 
                        width: '100%', 
                        height: '400px', 
                        marginTop: '16px',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        position: 'relative',
                        background: '#87CEEB'
                      }}
                    />
                  )}
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

        {/* Live Bottom All-Blue Floating Widget with Cross Button */}
        {isLiveMode ? (
          <div className="gemini-live-bottom-dock">
            <div className="gemini-live-capsule-blue">
              <div className="capsule-blue-visualizer">
                <span className="blue-wave-bar bar-1"></span>
                <span className="blue-wave-bar bar-2"></span>
                <span className="blue-wave-bar bar-3"></span>
                <span className="blue-wave-bar bar-4"></span>
                <span className="blue-wave-bar bar-5"></span>
              </div>
              <span className="capsule-blue-label">
                {isAiSpeaking ? "Himo speaking..." : (liveTranscript ? "Listening..." : "Live listening...")}
              </span>
              <button 
                type="button" 
                className="capsule-blue-close-btn" 
                onClick={stopLiveMode}
                title="Exit Live Mode"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="dock-container">
            <div className={`composer-shell ${isTyping ? "typing-active" : ""}`}>
              <textarea 
                ref={textareaRef} 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} 
                placeholder={isDictating ? "Listening and typing..." : (isTrainingModeActive ? "Train mode..." : "Ask Himo...")} 
                rows={1} 
              />
              
              <div className="composer-actions">
                {/* 1. Mic Button: Only Listens & Types */}
                <button
                  type="button"
                  className={`chat-mic-button ${isDictating ? "dictate-active-pulse" : ""}`}
                  onClick={toggleDictationMode}
                  title="Voice Type (Dictation)"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
                </button>

                {/* 2. Text Present -> Send Button | Empty Text -> All Blue Voice Wave Mode */}
                {isTyping ? (
                  <button 
                    type="button" 
                    className="send-button-gemini active-glow-btn" 
                    disabled={loading} 
                    onClick={() => handleSend()}
                    title="Send message"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </button>
                ) : (
                  <button 
                    type="button" 
                    className="gemini-live-pulse-btn-blue"
                    onClick={toggleLiveMode}
                    title="Himo Live Conversation"
                  >
                    <div className="live-bars-group-blue">
                      <span className="live-bar-blue bar-1"></span>
                      <span className="live-bar-blue bar-2"></span>
                      <span className="live-bar-blue bar-3"></span>
                      <span className="live-bar-blue bar-4"></span>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
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

        /* Fluid Gemini Live Edge Wave Aurora */
        .screen-wave-aurora {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9999;
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
        }

        .screen-wave-aurora.aurora-active {
          opacity: 1;
        }

        .aurora-beam {
          position: absolute;
          filter: blur(18px);
          opacity: 0.85;
        }

        .top-beam {
          top: -12px; left: 0; right: 0; height: 35px;
          background: linear-gradient(90deg, transparent, #ffffff, #60a5fa, #3b82f6, #ffffff, transparent);
          background-size: 200% 100%;
          animation: waveBeamFlow 2.8s ease-in-out infinite alternate;
        }

        .bottom-beam {
          bottom: -12px; left: 0; right: 0; height: 35px;
          background: linear-gradient(90deg, transparent, #3b82f6, #60a5fa, #ffffff, #2563eb, transparent);
          background-size: 200% 100%;
          animation: waveBeamFlow 2.8s ease-in-out infinite alternate-reverse;
        }

        .left-beam {
          top: 0; bottom: 0; left: -12px; width: 35px;
          background: linear-gradient(180deg, transparent, #ffffff, #3b82f6, #60a5fa, transparent);
          background-size: 100% 200%;
          animation: waveBeamFlowVert 3s ease-in-out infinite alternate;
        }

        .right-beam {
          top: 0; bottom: 0; right: -12px; width: 35px;
          background: linear-gradient(180deg, transparent, #60a5fa, #ffffff, #2563eb, transparent);
          background-size: 100% 200%;
          animation: waveBeamFlowVert 3s ease-in-out infinite alternate-reverse;
        }

        @keyframes waveBeamFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }

        @keyframes waveBeamFlowVert {
          0% { background-position: 50% 0%; }
          100% { background-position: 50% 100%; }
        }

        /* Hero Cards Row */
        .hero-cards-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 24px;
          width: 100%;
        }

        .hero-action-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 14px 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          cursor: pointer;
          transition: all 0.22s ease-in-out;
        }

        .hero-action-card:hover {
          background: #ffffff;
          border-color: #93c5fd;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.08);
        }

        .hero-action-card.live-card {
          border-color: #bfdbfe;
          background: linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%);
        }

        .card-icon-bubble {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }

        .math-bubble { background: #dbeafe; }
        .qa-bubble { background: #fef3c7; }
        .live-bubble { background: #e0e7ff; }

        .card-info h3 {
          font-size: 0.92rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 2px;
        }

        .card-info p {
          font-size: 0.74rem;
          color: #64748b;
          line-height: 1.35;
        }

        @media (max-width: 600px) {
          .hero-cards-row {
            grid-template-columns: 1fr;
            gap: 8px;
          }
          .hero-action-card {
            flex-direction: row;
            align-items: center;
            gap: 12px;
            padding: 10px 12px;
          }
        }

        /* Top Header Live Transcript Pill */
        .header-live-transcript-pill {
          max-width: 48%;
          background: rgba(243, 244, 246, 0.95);
          backdrop-filter: blur(8px);
          border: 1px solid #dbeafe;
          padding: 5px 12px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 6px;
          animation: fadeIn 0.25s ease;
        }

        .live-typing-dot {
          width: 7px;
          height: 7px;
          min-width: 7px;
          border-radius: 50%;
          background: #2563eb;
          animation: blink 0.9s infinite;
        }

        .live-transcript-text {
          font-size: 0.82rem;
          color: #1e3a8a;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Live Bottom All-Blue Floating Widget with Cross Button */
        .gemini-live-bottom-dock {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10000;
          padding: 0 16px;
        }

        .gemini-live-capsule-blue {
          background: linear-gradient(135deg, #1d4ed8, #2563eb, #1e40af);
          color: #ffffff;
          padding: 8px 10px 8px 16px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 25px rgba(29, 78, 216, 0.4), 0 0 18px rgba(96, 165, 250, 0.35);
          border: 1.5px solid rgba(255, 255, 255, 0.35);
          animation: capsulePop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes capsulePop {
          from { transform: translateY(20px) scale(0.9); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }

        .capsule-blue-visualizer {
          display: flex;
          align-items: center;
          gap: 3px;
          height: 22px;
        }

        .blue-wave-bar {
          width: 3.5px;
          border-radius: 9999px;
          background: #ffffff;
          animation: liveBlueWave 1.1s ease-in-out infinite;
        }

        .blue-wave-bar.bar-1 { height: 7px; animation-delay: 0.0s; }
        .blue-wave-bar.bar-2 { height: 16px; animation-delay: 0.15s; }
        .blue-wave-bar.bar-3 { height: 22px; animation-delay: 0.3s; }
        .blue-wave-bar.bar-4 { height: 14px; animation-delay: 0.45s; }
        .blue-wave-bar.bar-5 { height: 8px; animation-delay: 0.2s; }

        @keyframes liveBlueWave {
          0%, 100% { transform: scaleY(0.4); opacity: 0.7; }
          50% { transform: scaleY(1.3); opacity: 1; }
        }

        .capsule-blue-label {
          font-size: 0.88rem;
          font-weight: 600;
          color: #ffffff;
          letter-spacing: 0.2px;
        }

        .capsule-blue-close-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.22);
          border: none;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }

        .capsule-blue-close-btn:hover {
          background: rgba(255, 255, 255, 0.4);
          transform: scale(1.08);
        }

        /* Mic Button Dictation Pulse */
        .dictate-active-pulse {
          background: #2563eb !important;
          color: #ffffff !important;
          animation: dictatePulse 1.2s infinite ease-in-out;
        }

        @keyframes dictatePulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.5); }
          50% { transform: scale(1.1); box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.25); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.0); }
        }

        /* All-Blue Gemini Wave Button inside Input */
        .gemini-live-pulse-btn-blue {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #eff6ff;
          border: 1.5px solid #bfdbfe;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .gemini-live-pulse-btn-blue:hover {
          background: #dbeafe;
          transform: scale(1.06);
        }

        .live-bars-group-blue {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2.5px;
          height: 16px;
        }

        .live-bar-blue {
          width: 2.5px;
          border-radius: 9999px;
          background: #2563eb;
          animation: liveWaveBlue 1.3s ease-in-out infinite;
        }

        .live-bar-blue.bar-1 { height: 6px; animation-delay: 0.0s; }
        .live-bar-blue.bar-2 { height: 14px; animation-delay: 0.2s; }
        .live-bar-blue.bar-3 { height: 10px; animation-delay: 0.4s; }
        .live-bar-blue.bar-4 { height: 5px; animation-delay: 0.1s; }

        @keyframes liveWaveBlue {
          0%, 100% { transform: scaleY(0.5); opacity: 0.7; }
          50% { transform: scaleY(1.3); opacity: 1; }
        }

        .world-container canvas {
          width: 100% !important;
          height: 100% !important;
          display: block;
        }

        .top-glow-mesh { position: absolute; top: 0; left: 0; right: 0; height: 35vh; pointer-events: none; z-index: 1; background: radial-gradient(circle at 15% 30%, rgba(96, 165, 250, 0.4), transparent 60%), radial-gradient(circle at 45% 20%, rgba(244, 114, 182, 0.35), transparent 55%), radial-gradient(circle at 75% 35%, rgba(52, 211, 153, 0.3), transparent 55%), radial-gradient(circle at 90% 15%, rgba(192, 132, 252, 0.35), transparent 60%), linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%); filter: blur(24px); }
        .workspace { flex: 1; display: flex; flex-direction: column; position: relative; height: 100%; width: 100%; z-index: 2; overflow: hidden; }
        .topbar { height: 56px; padding: 0 16px; display: flex; align-items: center; justify-content: space-between; position: relative; flex-shrink: 0; gap: 8px; }
        .left-nav { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
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
        .popup-menu-item { background: transparent; border: none; padding: 10px 14px; font-size: 0.9rem; color: #374151; border-radius: 10px; cursor: pointer; text-align: left; width: 100%; display: flex; align-items: center; gap: 10px; }
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
        
        .canvas { flex: 1; overflow-y: auto; padding: 0 16px 130px 16px; max-width: 800px; width: 100%; margin: 0 auto; -webkit-overflow-scrolling: touch; }
        .hero-screen-top-left { margin-top: 24px; }
        .gradient-text { font-size: 3rem; font-weight: 800; display: inline-block; margin-bottom: 4px; }
        .animated-shimmer { background: linear-gradient(90deg, #2563eb 0%, #7c3aed 20%, #ec4899 40%, #06b6d4 60%, #10b981 80%, #2563eb 100%); background-size: 300% 100%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: fluidShimmer 4s linear infinite; }
        @keyframes fluidShimmer { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .hero-main-title { font-size: 2.2rem; font-weight: 700; color: #111827; line-height: 1.15; }

        .messages-list { display: flex; flex-direction: column; gap: 14px; padding-top: 16px; }
        .message-row { display: flex; width: 100%; }
        .message-row.user { justify-content: flex-end; }
        .message-row.assistant { justify-content: flex-start; }
        
        .message-bubble { max-width: 90%; }
        .message-row.user .message-bubble { background: #f3f4f6; padding: 10px 16px; border-radius: 18px; border-top-right-radius: 4px; }
        .message-row.assistant .message-bubble { background: transparent; padding: 2px 0; }
        .message-text { font-size: 0.96rem; line-height: 1.55; color: #1f2937; }

        .in-app-media-player {
          position: fixed; bottom: 84px; right: 14px; width: 280px; height: 180px;
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
        .code-actions { display: flex; gap: 6px; }
        .copy-action-btn { background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); color: #f1f5f9; padding: 4px 10px; border-radius: 6px; font-size: 0.74rem; cursor: pointer; }
        .copy-inner { display: flex; align-items: center; gap: 4px; }
        .copied-text { color: #34d399; font-weight: 600; }
        .code-pre-block { padding: 12px 14px; margin: 0; color: #e2e8f0; font-family: monospace; font-size: 0.85rem; line-height: 1.5; overflow-x: auto; white-space: pre; }
        
        .dock-container { position: absolute; bottom: 0; left: 0; right: 0; padding: 8px 14px 14px; background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 40%); display: flex; flex-direction: column; align-items: center; z-index: 10; }
        
        .composer-shell { width: 100%; max-width: 800px; background: #ffffff; border-radius: 26px; padding: 6px 12px; display: flex; align-items: flex-end; gap: 8px; border: 1.5px solid #e5e7eb; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .composer-shell.typing-active { border-color: transparent; background: linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(90deg, #2563eb, #9333ea, #ec4899, #06b6d4, #2563eb) border-box; background-size: 100% 100%, 300% 100%; animation: borderGlowFlow 3s linear infinite; }
        @keyframes borderGlowFlow { 0% { background-position: 0% 0%, 0% 50%; } 50% { background-position: 0% 0%, 100% 50%; } 100% { background-position: 0% 0%, 0% 50%; } }
        
        .composer-shell textarea { flex: 1; background: transparent; border: none; outline: none; color: #111827; font-size: 0.95rem; font-family: inherit; resize: none; max-height: 140px; line-height: 1.35; padding: 6px 0; }
        .composer-actions { display: flex; align-items: center; gap: 6px; margin-bottom: 2px; }
        
        .chat-mic-button {
          width: 34px; height: 34px; border-radius: 50%; background: #f3f4f6; color: #4b5563;
          border: none; display: flex; align-items: center; justify-content: center; cursor: pointer;
        }

        .send-button-gemini { width: 34px; height: 34px; border-radius: 50%; background: #111827; color: #ffffff; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .active-glow-btn { background: linear-gradient(135deg, #2563eb, #7c3aed); }

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

