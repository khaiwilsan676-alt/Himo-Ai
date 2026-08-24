"use client"

import { useState, useRef, useEffect } from "react"

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

// Smart responses without API
const smartResponses = [
  {
    keywords: ["hi", "hello", "hey", "namaste", "hola", "himo"],
    response: "Hello! 👋 I'm Himo AI, your creative intelligence companion. I can help you with:\n\n✦ Chat - Ask me anything\n✦ Code - Build and debug your projects\n✦ Image - Create stunning visuals\n✦ Video - Bring your ideas to life\n\nWhat would you like to create today?"
  },
  {
    keywords: ["who are you", "what are you", "about you", "introduce yourself", "tum kaun"],
    response: "I'm Himo AI! 🤖\n\nYour all-in-one creative partner. I specialize in:\n\n• Chat - Answering questions and brainstorming ideas\n• Code - Writing and debugging code\n• Image - Creating visual content\n• Video - Generating videos from text\n\nThink of me as your personal creative studio, ready 24/7!"
  },
  {
    keywords: ["help", "features", "what can you do", "kaise use"],
    response: "Here's how I can help you! 🚀\n\n**Chat Mode:**\n• Answer questions\n• Explain concepts\n• Brainstorm ideas\n\n**Code Mode:**\n• Write code snippets\n• Debug issues\n• Explain programming concepts\n\n**Image Mode:**\n• Create image descriptions\n• Generate visual ideas\n\n**Video Mode:**\n• Script video concepts\n• Plan shots and scenes\n\nJust type what you need, and I'll assist you!"
  },
  {
    keywords: ["code", "react", "javascript", "python", "html", "css", "programming"],
    response: "I'd love to help you with coding! 💻\n\nI can assist with:\n• Writing clean, efficient code\n• Debugging errors\n• Explaining concepts\n• Code reviews\n\nHere's a quick example:\n\n```javascript\n// Simple React component\nfunction Greeting({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}\n```\n\nWhat specific coding task do you need help with?"
  },
  {
    keywords: ["image", "picture", "photo", "visual", "design"],
    response: "Ready to create visuals! 🎨\n\nI can help you with:\n• Image concepts and descriptions\n• Design ideas\n• Color schemes\n• Visual storytelling\n\nDescribe what you'd like to create, and I'll provide detailed prompts and ideas!\n\nFor example: 'A futuristic city at sunset with flying cars'"
  },
  {
    keywords: ["video", "animation", "film", "movie"],
    response: "Let's bring your ideas to life! 🎬\n\nI can help with:\n• Video concepts\n• Storyboarding\n• Script writing\n• Scene descriptions\n\nTell me your video idea, and I'll help you plan it out!\n\nFor example: 'A travel montage of Tokyo at night'"
  },
  {
    keywords: ["thanks", "thank you", "shukriya", "dhanyavad"],
    response: "You're welcome! 😊 Happy to help!\n\nIs there anything else you'd like to create or explore?"
  },
  {
    keywords: ["bye", "goodbye", "see you", "alvida"],
    response: "Goodbye! 👋\n\nIt was great chatting with you. Come back anytime you need creative help!\n\nStay curious! ✨"
  }
]

// Fallback responses
const fallbackResponses = [
  "That's an interesting question! 🤔\n\nWhile I'm currently running in demo mode without full API access, I can still help you brainstorm ideas and provide guidance.\n\nCould you tell me more about what you're trying to achieve?",
  
  "I understand you're asking about that! 💭\n\nIn this demo version, I have limited access to external data, but I can definitely help you think through this.\n\nLet me suggest some approaches:\n1. Break down the problem into smaller parts\n2. Consider different perspectives\n3. Explore creative solutions\n\nWhat specific aspect would you like to dive deeper into?",
  
  "Great topic! 🌟\n\nWhile I'm in demo mode, here's how I can help:\n• Provide frameworks and strategies\n• Offer creative suggestions\n• Guide you through problem-solving\n\nCould you share more details about what you need?",
  
  "Interesting! Let me think about this... 💡\n\nHere are my initial thoughts:\n• This could be approached from multiple angles\n• Consider the key components involved\n• Think about the desired outcome\n\nWould you like me to elaborate on any specific aspect?"
]

function getSmartResponse(userInput, mode) {
  const input = userInput.toLowerCase()
  
  // Check for greetings first
  for (const item of smartResponses) {
    if (item.keywords.some(keyword => input.includes(keyword))) {
      return item.response
    }
  }
  
  // Mode-specific fallback
  const modeSpecific = {
    chat: "I'm here to chat! 💬\n\nYou can ask me about:\n• General knowledge\n• Ideas and brainstorming\n• Problem-solving\n• Creative concepts\n\nWhat's on your mind?",
    code: "I see you want to work on code! 💻\n\nI can help you with:\n• Writing functions and components\n• Debugging logic\n• Algorithm explanation\n• Code structure\n\nShare your coding challenge, and let's solve it together!",
    image: "Ready to create images! 🎨\n\nTo get started, describe your image idea like:\n• 'A serene mountain lake at dawn'\n• 'Abstract geometric patterns in neon colors'\n• 'A cozy coffee shop interior'\n\nWhat visual would you like to create?",
    video: "Let's create a video! 🎬\n\nTo plan your video, tell me:\n• Topic or theme\n• Duration\n• Style (cinematic, documentary, animated)\n\nFor example: 'A 30-second product showcase with smooth transitions'"
  }
  
  // Return mode-specific response or random fallback
  if (input.length > 20) {
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
  }
  
  return modeSpecific[mode] || modeSpecific.chat
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

function Composer({ mode, value, loading, onChange, onSend }) {
  const activeMode = modes.find((m) => m.id === mode) || modes[0]
  const isCreator = mode === "image" || mode === "video"
  const textareaRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [value])

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) {
      event.preventDefault()
      onSend()
    }
  }

  const placeholderText = isCreator
    ? `Describe the ${mode} you want to create...`
    : `Message Himo ${activeMode.label}...`

  return (
    <div className="composer-wrap">
      <div className="composer">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText}
          rows={1}
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
      <p className="hint">{uiText.disclaimer}</p>
    </div>
  )
}

function Conversation({ messages, loading }) {
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

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
      <div ref={messagesEndRef} />
    </div>
  )
}

function Welcome({ mode, onModeChange, onSelectExample }) {
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
    
    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700))
    
    // Get smart response (no API needed)
    const reply = getSmartResponse(prompt, mode)
    
    setMessages((current) => [
      ...current,
      { role: "assistant", content: reply }
    ])
    
    setLoading(false)
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
            <>
              <Welcome
                mode={mode}
                onModeChange={setMode}
                onSelectExample={handleSelectExample}
              />
              <div className="composer-fixed">
                {composer}
              </div>
            </>
          ) : (
            <>
              <Conversation
                messages={messages}
                loading={loading}
              />
              <div className="composer-fixed">
                {composer}
              </div>
            </>
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
