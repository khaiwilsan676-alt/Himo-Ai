"use client"

import { useState, useRef, useEffect } from "react"
import LoginPage from "../components/LoginPage"
import MathMasterEngine from "../src/lib/mathMasterEngine"
import { generateCodeFromPrompt } from "../src/lib/codeMasterEngine"
import { fetchLiveWebData } from "../src/lib/webSearchEngine"
import { auth } from "../src/lib/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { saveChatToDB, getAllChatsFromDB, deleteChatFromDB } from "../src/lib/indexedDbStorage"

function HimoBrainIcon({ size = 26, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      <path d="M 52 35 C 48 35 44 38 43 43 C 41 53 37 60 33 60 C 29 60 27 55 28 48 C 29 41 35 36 41 36 C 45 36 48 34 49 30 C 50 26 48 22 43 23 C 33 25 24 33 22 43 C 20 54 24 64 32 66 C 39 68 45 63 48 55 C 50 49 53 44 57 44 C 61 44 63 48 62 55 C 60 64 53 71 44 71 C 39 71 36 74 37 78 C 38 82 42 84 48 83 C 60 81 70 70 72 57 C 74 44 68 35 58 35 Z" fill="currentColor" />
      <path d="M 49 15 C 31 16 17 29 15 47 C 14 55 16 63 21 69 C 23 71 26 70 27 67 C 28 64 26 62 23 58 C 20 52 19 46 20 40 C 22 28 32 19 46 18 C 50 18 53 15 52 11 C 51 8 47 7 43 8 C 39 9 35 11 31 14" fill="currentColor" />
      <path d="M 58 13 C 74 16 86 29 87 46 C 88 59 81 72 71 79 C 68 81 65 80 64 77 C 63 74 65 71 68 69 C 75 63 79 53 78 43 C 77 31 69 22 57 20 C 53 19 51 16 52 12 C 53 8 56 7 58 13 Z" fill="currentColor" />
      <path d="M 52 86 C 46 90 40 91 35 88 C 32 86 31 83 33 80 C 35 77 38 78 40 79 C 43 81 47 80 51 77 C 54 75 57 77 58 80 C 59 83 56 86 52 86 Z" fill="currentColor" />
      <circle cx="51" cy="28" r="3.2" fill="currentColor" />
      <circle cx="34" cy="50" r="3.2" fill="currentColor" />
      <circle cx="67" cy="57" r="3.2" fill="currentColor" />
    </svg>
  )
}

function CodeBlock({ codeText }) {
  const [copied, setCopied] = useState(false);
  
  // Extract pure code without markdown backticks
  const cleanCode = (codeText || "")
    .replace(/^```[a-zA-Z]*\n?/, "")
    .replace(/```$/, "")
    .trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-container-card">
      <div className="code-card-header">
        <span className="code-lang-label">Code</span>
        <button type="button" onClick={handleCopy} className="copy-action-btn" title="Copy code">
          {copied ? (
            <span className="copied-text">Copied ✓</span>
          ) : (
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
      <pre className="code-pre-block">
        <code>{cleanCode}</code>
      </pre>
    </div>
  );
}

async function think(prompt) {
  const q = prompt.trim();
  const qLower = q.toLowerCase();

  if (['hi', 'hii', 'hello', 'hii himo', 'hi himo', 'hey'].includes(qLower)) {
    return "Yo! Himo Omni Engine ready hai. Kya solve ya build karna hai?";
  }

  // 1. Math Master (Calculations & Tables)
  try {
    const mathResult = MathMasterEngine.evaluate(q);
    if (mathResult) return mathResult;
  } catch (e) {}

  // 2. Intelligent Code Generator (Highest priority for programming prompts)
  try {
    const codeResult = generateCodeFromPrompt(q);
    if (codeResult) return codeResult;
  } catch (e) {}

  // 3. Clean Web Knowledge Search
  try {
    const searchData = await fetchLiveWebData(q);
    if (searchData) return searchData;
  } catch (e) {}

  return `'${q}' par exact information nahi mili. Specific question poochhein.`;
}

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [message, setMessage] = useState("");
  const [currentChatId, setCurrentChatId] = useState(null);
  const [savedSessions, setSavedSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [topMenuOpen, setTopMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    try {
      const cachedUser = localStorage.getItem("himo_cached_user");
      if (cachedUser) {
        setCurrentUser(JSON.parse(cachedUser));
        setAuthChecking(false);
      }
    } catch (e) {}

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const safeUserData = { uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL };
        setCurrentUser(safeUserData);
        localStorage.setItem("himo_cached_user", JSON.stringify(safeUserData));
      } else {
        setCurrentUser(null);
        localStorage.removeItem("himo_cached_user");
      }
      setAuthChecking(false);
    });

    getAllChatsFromDB().then((chats) => {
      if (chats && chats.length > 0) {
        const sorted = chats.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.updatedAt - a.updatedAt);
        setSavedSessions(sorted);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [message]);

  useEffect(() => {
    const handleOutsideClick = () => {
      setTopMenuOpen(false);
      setSettingsMenuOpen(false);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const persistChatSession = async (updatedMessages, chatId = currentChatId) => {
    if (!updatedMessages || updatedMessages.length === 0) return;
    const id = chatId || `chat_${Date.now()}`;
    if (!currentChatId) setCurrentChatId(id);

    const firstUserMsg = updatedMessages.find(m => m.role === "user")?.content || "New conversation";
    const currentSession = savedSessions.find(s => s.id === id);
    
    const sessionObj = {
      id: id,
      title: currentSession?.title || (firstUserMsg.length > 28 ? firstUserMsg.slice(0, 28) + "..." : firstUserMsg),
      pinned: currentSession?.pinned || false,
      messages: updatedMessages,
      updatedAt: Date.now()
    };

    await saveChatToDB(sessionObj);

    setSavedSessions(prev => {
      const filtered = prev.filter(s => s.id !== id);
      const newList = [sessionObj, ...filtered];
      return newList.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.updatedAt - a.updatedAt);
    });
  };

  async function handleSend(textToSend) {
    const prompt = (typeof textToSend === "string" ? textToSend : message).trim();
    if (!prompt || loading) return;

    setMessage("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const newMsgs = [...messages, { role: "user", content: prompt }];
    setMessages(newMsgs);
    setLoading(true);

    await persistChatSession(newMsgs);

    try {
      const answer = await think(prompt);
      const finalMsgs = [...newMsgs, { role: "assistant", content: answer }];
      setMessages(finalMsgs);
      await persistChatSession(finalMsgs);
    } catch (error) {
      const errorMsgs = [...newMsgs, { role: "assistant", content: "Error processing request." }];
      setMessages(errorMsgs);
      await persistChatSession(errorMsgs);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      localStorage.removeItem("himo_cached_user");
      sessionStorage.clear();
      setCurrentUser(null);
      setSettingsMenuOpen(false);
      setSidebarOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  if (authChecking) {
    return (
      <div className="auth-loading-screen">
        <div className="loader-spinner"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  const userInitial = currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : (currentUser.email ? currentUser.email.charAt(0).toUpperCase() : "U");
  const isTyping = message.trim().length > 0;
  const isCurrentChatPinned = savedSessions.find(s => s.id === currentChatId)?.pinned;

  return (
    <main className="app-shell">
      <div className="top-glow-mesh" />
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

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
            <div className="avatar-chip footer-avatar">{currentUser.photoURL ? <img src={currentUser.photoURL} alt="DP" className="avatar-img" /> : userInitial}</div>
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
                <h1 className="hero-main-title">How can I help you today?</h1>
              </div>
            </div>
          )}

          <div className="messages-list">
            {messages.map((msg, index) => (
              <div key={index} className={`message-row ${msg.role}`}>
                <div className="message-icon">
                  {msg.role === "assistant" ? <div className="himo-brain-badge"><HimoBrainIcon size={24} /></div> : <div className="user-icon">{userInitial}</div>}
                </div>
                <div className="message-bubble">
                  <div className="message-text">
                    {msg.content.includes("```") ? (
                      <CodeBlock codeText="{msg.content}"/>
                    ) : (
                      msg.content.split("\n").map((line, i) => <p key={i}>{line || "\u00A0"}</p>)
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="message-row assistant">
                <div className="message-icon"><div className="himo-brain-badge pulse-brain"><HimoBrainIcon size="{24}"/></div></div>
                <div className="message-bubble"><div className="gemini-shimmer-loader"><div className="shimmer-line line-1"></div><div className="shimmer-line line-2"></div></div></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="dock-container">
          <div className={`composer-shell ${isTyping ? "typing-active" : ""}`}>
            <textarea ref={textareaRef} value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Ask Himo..." rows={1} />
            <div className="composer-actions">
              <button type="button" className={`send-button-gemini ${isTyping ? "active-glow-btn" : ""}`} disabled={!message.trim() || loading} onClick={() => handleSend()}>
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
        .footer-avatar { width: 36px; height: 36px; border-radius: 50%; background: #3b82f6; color: #ffffff; font-weight: 600; display: flex; align-items: center; justify-content: center; }
        .user-email-text { font-size: 0.85rem; font-weight: 600; color: #1f2937; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .settings-icon-btn { background: transparent; border: none; color: #6b7280; cursor: pointer; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; }
        .canvas { flex: 1; overflow-y: auto; padding: 0 20px 140px 20px; max-width: 820px; width: 100%; margin: 0 auto; }
        .hero-screen-top-left { margin-top: 40px; }
        .gradient-text { font-size: 3.6rem; font-weight: 800; display: inline-block; margin-bottom: 8px; }
        .animated-shimmer { background: linear-gradient(90deg, #2563eb 0%, #7c3aed 20%, #ec4899 40%, #06b6d4 60%, #10b981 80%, #2563eb 100%); background-size: 300% 100%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: fluidShimmer 4s linear infinite; }
        @keyframes fluidShimmer { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .hero-main-title { font-size: 2.7rem; font-weight: 700; color: #111827; }
        .messages-list { display: flex; flex-direction: column; gap: 24px; padding-top: 24px; }
        .message-row { display: flex; gap: 16px; width: 100%; }
        .message-row.user { flex-direction: row-reverse; }
        .himo-brain-badge { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; color: #111827; }
        .user-icon { width: 32px; height: 32px; background: #e5e7eb; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 600; }
        .message-bubble { max-width: 88%; }
        .message-row.user .message-bubble { background: #f3f4f6; padding: 12px 18px; border-radius: 20px; border-top-right-radius: 4px; }
        .message-text { font-size: 1rem; line-height: 1.6; color: #1f2937; }
        
        /* Modern Clean Code Block Card */
        .code-container-card {
          background: #0f172a;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid #1e293b;
          margin: 10px 0;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
          width: 100%;
        }
        .code-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #1e293b;
          padding: 8px 16px;
          border-bottom: 1px solid #334155;
        }
        .code-lang-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .copy-action-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #f1f5f9;
          padding: 5px 12px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        .copy-action-btn:hover {
          background: rgba(255, 255, 255, 0.18);
        }
        .copy-inner {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .copied-text {
          color: #34d399;
          font-weight: 600;
        }
        .code-pre-block {
          padding: 16px 18px;
          margin: 0;
          color: #e2e8f0;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.9rem;
          line-height: 1.55;
          overflow-x: auto;
          white-space: pre;
        }
        
        .dock-container { position: absolute; bottom: 0; left: 0; right: 0; padding: 16px 20px 24px; background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 45%); display: flex; flex-direction: column; align-items: center; }
        .composer-shell { width: 100%; max-width: 800px; background: #ffffff; border-radius: 28px; padding: 12px 18px; display: flex; align-items: flex-end; gap: 12px; border: 1.5px solid #e5e7eb; }
        .composer-shell.typing-active { border-color: transparent; background: linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(90deg, #2563eb, #9333ea, #ec4899, #06b6d4, #2563eb) border-box; background-size: 100% 100%, 300% 100%; animation: borderGlowFlow 3s linear infinite; box-shadow: 0 6px 28px rgba(37, 99, 235, 0.16); }
        @keyframes borderGlowFlow { 0% { background-position: 0% 0%, 0% 50%; } 50% { background-position: 0% 0%, 100% 50%; } 100% { background-position: 0% 0%, 0% 50%; } }
        .composer-shell textarea { flex: 1; background: transparent; border: none; outline: none; color: #111827; font-size: 1rem; font-family: inherit; resize: none; max-height: 160px; }
        .send-button-gemini { width: 38px; height: 38px; border-radius: 50%; background: #111827; color: #ffffff; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .active-glow-btn { background: linear-gradient(135deg, #2563eb, #7c3aed); }
        .auth-loading-screen { height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center; background: #fff; }
        .loader-spinner { width: 38px; height: 38px; border: 3px solid #f3f4f6; border-top: 3px solid #2563eb; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}
