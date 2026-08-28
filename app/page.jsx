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

// Clean Black Code File Box Component
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
        <button type="button" onClick={handleCopy} className="copy-icon-btn" title="Copy to clipboard">
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

// Gemini Style AI Image Generator Component
function ImageCard({ imageUrl, onImageClick }) {
  const [loaded, setLoaded] = useState(false)
  const [imgSrc, setImgSrc] = useState(imageUrl)

  const handleFallback = () => {
    // Fallback directly to reliable high-res image stream
    setImgSrc(`[https://picsum.photos/seed/$](https://picsum.photos/seed/$){Math.floor(Math.random()*9999)}/600/600`)
  }

  return (
    <div className="gemini-img-container" onClick={() => loaded && onImageClick(imgSrc)}>
      {!loaded && (
        <div className="gemini-gen-card">
          <div className="gemini-gen-header">
            <span className="gemini-sparkle-icon">✨</span>
            <span className="gemini-gen-title">Generating Image...</span>
          </div>
          <div className="grey-shimmer-box">
            <div className="shimmer-wave"></div>
          </div>
        </div>
      )}
      <img
        src={imgSrc}
        alt="AI Visual"
        className={`gemini-real-img ${loaded ? "active-show" : "hidden-load"}`}
        onLoad={() => setLoaded(true)}
        onError={handleFallback}
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

    const cleanText = text.replace(/```[\s\S]*?```/g, "Code ready hai.")
      .replace(/[#*•_`]/g, "")
      .trim()

    if (!cleanText) return

    try {
      const { TextToSpeech } = await import("@capacitor-community/text-to-speech")
      await TextToSpeech.speak({
        text: cleanText.slice(0, 250),
        lang: "hi-IN",
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        category: "ambient"
      })
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
      speakVoice("Training mode start ho gaya.")
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
        const reply = `Got it! Jab bolega "${topic}", main bolunga "${answer}".`
        speakVoice(reply)
        return reply
      }

      const parts = text.split("=")
      if (parts.length === 2 && parts[0].trim() && parts[1].trim()) {
        await saveTrainedKnowledge(parts[0].trim(), parts[1].trim())
        const reply = `Got it! "${parts[0].trim()}" yaad kar liya.`
        speakVoice(reply)
        return reply
      }

      const helpMsg = "Bolkar sikha: 'When I say [Question] you say [Answer]'"
      speakVoice(helpMsg)
      return helpMsg
    } catch (e) {
      return "Processed."
    }
  }

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
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaStreamRef.current = stream
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = "hi-IN"

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

        recognition.onerror = () => setIsListening(false)

        recognitionRef.current = recognition
        recognition.start()
      } else {
        alert("Speech Recognition not supported on this device.")
        setIsListening(false)
      }
    } catch (err) {
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

    return `Playing "${cleanTrack}"`
  }

  // Reliable Real-time AI Image Engine
  const generateAIImage = (promptText) => {
    let cleanDesc = promptText
      .replace(/^(create\s+image\s+of|create\s+image|generate\s+image\s+of|generate\s+image|make\s+image\s+of|make\s+image|draw\s+image\s+of|draw|photo\s+banao|image\s+banao|tasveer\s+banao|picture\s+banao|ai\s+image)\s*/i, "")
      .replace(/^(of|a|an)\s+/i, "")
      .trim()

    if (!cleanDesc) cleanDesc = "Apple realistic 4k"

    // High reliable direct image generation endpoint
    const seed = Math.floor(Math.random() * 999999)
    const directUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanDesc)}?width=768&height=768&nologo=true&seed=${seed}`

    return {
      type: "image_card",
      imageUrl: directUrl
    }
  }

  async function think(prompt, hasAttachedPhoto = false) {
    const q = prompt.trim()
    const qLower = q.toLowerCase()

    // 1. Image Generation Check
    const isImageGenRequest = 
      qLower.startsWith("create image") || 
      qLower.startsWith("generate image") || 
      qLower.startsWith("make image") || 
      qLower.startsWith("draw ") || 
      qLower.includes("photo banao") || 
      qLower.includes("image banao") || 
      qLower.includes("tasveer banao") || 
      qLower.includes("picture banao") || 
      qLower.startsWith("ai image")

    if (isImageGenRequest) {
      return generateAIImage(q)
    }

    // 2. Code Request Check (Ensure it returns full formatted markdown code block)
    const isCodeRequest = 
      qLower.startsWith("write code") || 
      qLower.startsWith("code ") || 
      qLower.includes("ka code") || 
      qLower.includes("function") || 
      qLower.includes("script") ||
      qLower.includes("html") ||
      qLower.includes("component")

    if (isCodeRequest) {
      const codeOutput = generateCodeFromPrompt(q)
      if (codeOutput) return codeOutput
    }

    if (hasAttachedPhoto) {
      return `Photo upload ho gayi hai.`
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
      const searchData = await fetchLiveWebData(q)
      if (searchData) return cleanFormatting(searchData)
    } catch (e) {}

    return `Bhai '${q}' par exact information nahi mili.`
  }

  async function handleSend(textToSend, isVoice = false) {
    const prompt = (typeof textToSend === "string" ? textToSend : message).trim()
    const currentPhoto = attachedImage

    if ((!prompt && !currentPhoto) || loading) return

    const lowerPrompt = (prompt || "").toLowerCase()

    if (['stop', 'chup', 'ruko', 'pause', 'stop speaking', 'shant', 'stop music'].includes(lowerPrompt)) {
      stopVoicePlayback()
      setCurrentTrack(null)
      setMessage("")
      setAttachedImage(null)
      return
    }

    if (lowerPrompt.includes("himo on the training mode")) {
      setMessage("")
      setAttachedImage(null)
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
    setAttachedImage(null)
    if (textareaRef.current) textareaRef.current.style.height = "auto"

    const userMsgObj = { 
      role: "user", 
      content: prompt || (currentPhoto ? "Photo shared 📷" : ""),
      attachedPhoto: currentPhoto || null
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
        answer = await think(prompt || "Explain this photo", !!currentPhoto)
      }

      if (typeof answer !== "object") {
        speakVoice(answer)
      }

      const finalMsgs = [...newMsgs, { role: "assistant", content: answer }]
      setMessages(finalMsgs)
      await persistChatSession(finalMsgs)
    } catch (error) {
      const errorMsgs = [...newMsgs, { role: "assistant", content: "Error occurred." }]
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
  const isTyping = message.trim().length > 0 || !!attachedImage
  const isCurrentChatPinned = savedSessions.find(s => s.id === currentChatId)?.pinned

  return (
    <main className="app-shell">
      <div className="top-glow-mesh" />
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        style={{ display: "none" }} 
        onChange={handleImageSelect} 
      />

      {/* Fullscreen Image View Modal */}
      {previewModalImg && (
        <div className="image-viewer-modal" onClick={() => setPreviewModalImg(null)}>
          <div className="viewer-content-card" onClick={(e) => e.stopPropagation()}>
            <button className="viewer-close-btn" onClick={() => setPreviewModalImg(null)}>✕</button>
            <div className="viewer-img-holder">
              <img src={previewModalImg} alt="Preview" className="viewer-full-img" />
            </div>
            <div className="viewer-bottom-bar">
              <a href={previewModalImg} target="_blank" rel="noreferrer" download="himo_image.jpg" className="viewer-save-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Save Image
              </a>
            </div>
          </div>
        </div>
      )}

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
              <p>Training Mode PIN</p>
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
                  onClick={() => { setIsTrainingModeActive(false); speakVoice("Training mode off."); }}
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

        <div className="canvas">
          {messages.length === 0 && (
            <div className="hero-screen-top-left">
              <div className="hero-greeting-left">
                <span className="gradient-text animated-shimmer">Himo Omni</span>
                <h1 className="hero-main-title">
                  {isTrainingModeActive ? "Training Mode Active" : "How can I help you today?"}
                </h1>
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
                title="Add photo or AI action"
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
                  <button type="button" className="popup-menu-item plus-item" onClick={() => { setMessage("Create image of "); setPlusMenuOpen(false); textareaRef.current?.focus(); }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                    <span>Generate AI Image</span>
                  </button>
                </div>
              )}
            </div>

            <textarea 
              ref={textareaRef} 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} 
              placeholder={isListening ? "Listening..." : (isTrainingModeActive ? "Train mode..." : "Ask Himo...")} 
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
        
        .message-bubble { max-width: 100%; width: fit-content; }
        .message-row.user .message-bubble { background: #f3f4f6; padding: 10px 16px; border-radius: 18px; border-top-right-radius: 4px; max-width: 85%; }
        .message-row.assistant .message-bubble { background: transparent; padding: 2px 0; width: 100%; }
        .message-text { font-size: 0.96rem; line-height: 1.55; color: #1f2937; width: 100%; }
        .text-prose-row { margin-bottom: 6px; }

        .chat-attached-image-wrapper { margin-bottom: 8px; max-width: 220px; border-radius: 14px; overflow: hidden; cursor: pointer; }
        .user-chat-img { width: 100%; height: auto; display: block; border-radius: 14px; }

        /* Gemini Style AI Image Generator Container */
        .gemini-img-container {
          position: relative;
          width: 280px;
          border-radius: 18px;
          overflow: hidden;
          margin: 6px 0;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          cursor: pointer;
        }
        .gemini-gen-card {
          width: 280px;
          height: 280px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .gemini-gen-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .gemini-sparkle-icon {
          font-size: 1rem;
          animation: spinSparkle 2s infinite linear;
        }
        @keyframes spinSparkle {
          0% { transform: rotate(0deg) scale(0.9); }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(0.9); }
        }
        .gemini-gen-title {
          font-size: 0.86rem;
          font-weight: 600;
          color: #334155;
        }
        .grey-shimmer-box {
          flex: 1;
          background: #e2e8f0;
          border-radius: 12px;
          position: relative;
          overflow: hidden;
        }
        .shimmer-wave {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
          animation: waveSlide 1.5s infinite;
        }
        @keyframes waveSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .gemini-real-img {
          width: 280px;
          height: 280px;
          object-fit: cover;
          border-radius: 18px;
          display: block;
          transition: opacity 0.3s ease;
        }
        .gemini-real-img.hidden-load { display: none; }
        .gemini-real-img.active-show { display: block; }

        /* Sleek Black Code Box Container */
        .dark-code-card {
          background: #0f172a;
          border: 1px solid #1e293b;
          border-radius: 14px;
          overflow: hidden;
          margin: 10px 0;
          width: 100%;
          max-width: 100%;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }
        .dark-code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #1e293b;
          padding: 8px 14px;
          border-bottom: 1px solid #334155;
        }
        .lang-badge-tag {
          font-size: 0.72rem;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.5px;
          font-family: monospace;
        }
        .copy-icon-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 6px;
          transition: color 0.15s;
        }
        .copy-icon-btn:hover {
          color: #f8fafc;
        }
        .copied-tag {
          font-size: 0.75rem;
          color: #34d399;
          font-weight: 600;
        }
        .dark-code-scroll {
          padding: 14px;
          overflow-x: auto;
          background: #0f172a;
          -webkit-overflow-scrolling: touch;
        }
        .dark-pre-text {
          margin: 0;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.88rem;
          line-height: 1.55;
          color: #e2e8f0;
          white-space: pre;
        }

        /* Fullscreen Image View Modal */
        .image-viewer-modal {
          position: fixed; inset: 0; background: rgba(0,0,0,0.88); backdrop-filter: blur(8px);
          z-index: 300; display: flex; align-items: center; justify-content: center; padding: 16px;
        }
        .viewer-content-card {
          position: relative; max-width: 480px; width: 100%; background: #0f172a;
          border-radius: 20px; overflow: hidden; display: flex; flex-direction: column;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5); border: 1px solid #1e293b;
        }
        .viewer-close-btn {
          position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.6);
          color: #ffffff; border: none; width: 32px; height: 32px; border-radius: 50%;
          font-size: 16px; cursor: pointer; z-index: 10; display: flex; align-items: center; justify-content: center;
        }
        .viewer-img-holder { width: 100%; max-height: 70vh; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #000; }
        .viewer-full-img { width: 100%; height: 100%; object-fit: contain; }
        .viewer-bottom-bar { padding: 14px; background: #1e293b; display: flex; justify-content: center; }
        .viewer-save-btn {
          display: inline-flex; align-items: center; gap: 8px; background: #2563eb;
          color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 12px;
          font-size: 0.9rem; font-weight: 600;
        }

        /* Floating Media Player */
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
        
        .dock-container { position: absolute; bottom: 0; left: 0; right: 0; padding: 8px 14px 14px; background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 40%); display: flex; flex-direction: column; align-items: center; z-index: 10; }
        
        .attached-photo-preview-bar {
          display: flex; align-items: center; gap: 10px; width: 100%; max-width: 800px;
          margin-bottom: 6px; padding: 0 4px;
        }
        .preview-thumb-box { position: relative; width: 44px; height: 44px; border-radius: 10px; overflow: hidden; border: 1.5px solid #3b82f6; }
        .thumb-img { width: 100%; height: 100%; object-fit: cover; }
        .remove-thumb-btn {
          position: absolute; top: 1px; right: 1px; background: rgba(0,0,0,0.7);
          color: #fff; border: none; border-radius: 50%; width: 16px; height: 16px;
          font-size: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .preview-caption-hint { font-size: 0.78rem; color: #4b5563; font-weight: 500; }

        .composer-shell { width: 100%; max-width: 800px; background: #ffffff; border-radius: 26px; padding: 6px 12px; display: flex; align-items: flex-end; gap: 8px; border: 1.5px solid #e5e7eb; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .composer-shell.typing-active { border-color: transparent; background: linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(90deg, #2563eb, #9333ea, #ec4899, #06b6d4, #2563eb) border-box; background-size: 100% 100%, 300% 100%; animation: borderGlowFlow 3s linear infinite; }
        @keyframes borderGlowFlow { 0% { background-position: 0% 0%, 0% 50%; } 50% { background-position: 0% 0%, 100% 50%; } 100% { background-position: 0% 0%, 0% 50%; } }
        
        .plus-btn-wrapper { position: relative; display: flex; align-items: center; }
        .plus-action-btn {
          width: 34px; height: 34px; border-radius: 50%; background: #f3f4f6; color: #4b5563;
          border: none; display: flex; align-items: center; justify-content: center; cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .plus-action-btn:hover { background: #e5e7eb; color: #111827; }
        .plus-dropdown-menu { bottom: 46px; left: 0; min-width: 190px; }
        .plus-item { font-size: 0.85rem; font-weight: 500; }

        .composer-shell textarea { flex: 1; background: transparent; border: none; outline: none; color: #111827; font-size: 0.95rem; font-family: inherit; resize: none; max-height: 140px; line-height: 1.35; padding: 6px 0; }
        .composer-actions { display: flex; align-items: center; gap: 6px; margin-bottom: 2px; }
        
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
