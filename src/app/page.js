"use client"

import { useState, useRef, useEffect } from "react"
import { auth, googleProvider } from "../lib/firebase"
import { evaluateAdvancedMath } from "../lib/mathEngine"
import { generateAutomaticAnswer } from "../lib/aiEngine"
import { teachHimo, queryLearnedHimo } from "../lib/autonomousTrainer"
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut 
} from "firebase/auth"

const ENCYCLOPEDIA = {
  alphabets: [
    { letter: "A", word: "Apple", hindi: "सेब", phonetic: "ए फॉर एप्पल" },
    { letter: "B", word: "Ball", hindi: "गेंद", phonetic: "बी फॉर बॉल" },
    { letter: "C", word: "Cat", hindi: "बिल्ली", phonetic: "सी फॉर कैट" },
    { letter: "D", word: "Dog", hindi: "कुत्ता", phonetic: "डी फॉर डॉग" },
    { letter: "E", word: "Elephant", hindi: "हाथी", phonetic: "ई फॉर एलीफेंट" },
    { letter: "F", word: "Fish", hindi: "मछली", phonetic: "एफ फॉर फिश" },
    { letter: "G", word: "Grapes", hindi: "अंगूर", phonetic: "जी फॉर ग्रेप्स" },
    { letter: "H", word: "Horse", hindi: "घोड़ा", phonetic: "एच फॉर हॉर्स" },
    { letter: "I", word: "Ice Cream", hindi: "आइसक्रीम", phonetic: "आई फॉर आइसक्रीम" },
    { letter: "J", word: "Jug", hindi: "जग", phonetic: "जे फॉर जग" },
    { letter: "K", word: "Kite", hindi: "पतंग", phonetic: "के फॉर काइट" },
    { letter: "L", word: "Lion", hindi: "शेर", phonetic: "एल फॉर लायन" },
    { letter: "M", word: "Mango", hindi: "आम", phonetic: "एम फॉर मैंगो" },
    { letter: "N", word: "Nest", hindi: "घोंसला", phonetic: "एन फॉर नेस्ट" },
    { letter: "O", word: "Orange", hindi: "संतरा", phonetic: "ओ फॉर ऑरेंज" },
    { letter: "P", word: "Parrot", hindi: "तोता", phonetic: "पी फॉर पैरट" },
    { letter: "Q", word: "Queen", hindi: "रानी", phonetic: "क्यू फॉर क्वीन" },
    { letter: "R", word: "Rose", hindi: "गुलाब", phonetic: "आर फॉर रोज़" },
    { letter: "S", word: "Sun", hindi: "सूरज", phonetic: "एस फॉर सन" },
    { letter: "T", word: "Tiger", hindi: "बाघ", phonetic: "टी फॉर टाइगर" },
    { letter: "U", word: "Umbrella", hindi: "छाता", phonetic: "यू फॉर अम्ब्रेला" },
    { letter: "V", word: "Van", hindi: "वैन", phonetic: "वी फॉर वैन" },
    { letter: "W", word: "Watch", hindi: "घड़ी", phonetic: "डब्ल्यू फॉर वॉच" },
    { letter: "X", word: "Xylophone", hindi: "जाइलोफ़ोन", phonetic: "एक्स फॉर जाइलोफ़ोन" },
    { letter: "Y", word: "Yak", hindi: "याक", phonetic: "वाई फॉर याक" },
    { letter: "Z", word: "Zebra", hindi: "ज़ेबरा", phonetic: "ज़ेड फॉर ज़ेबरा" }
  ],
  fruits: [
    { en: "Apple", hi: "सेब", desc: "Crisp, rich in Dietary Fiber & Vitamin C" },
    { en: "Mango", hi: "आम (King of Fruits)", desc: "Luscious, rich in Vitamin A & C" },
    { en: "Banana", hi: "केला", desc: "High Potassium, instant energy" },
    { en: "Pomegranate", hi: "अनार", desc: "Antioxidants & hemoglobin booster" },
    { en: "Dragon Fruit", hi: "ड्रैगन फ्रूट", desc: "Prebiotics, magnesium & iron" },
    { en: "Guava", hi: "अमरूद", desc: "4x Vitamin C of oranges" },
    { en: "Papaya", hi: "पपीता", desc: "Papain enzyme & Vitamin A" },
    { en: "Pineapple", hi: "अनानास", desc: "Bromelain anti-inflammatory enzyme" },
    { en: "Watermelon", hi: "तरबूज", desc: "92% hydration, lycopene" },
    { en: "Avocado", hi: "मक्खन फल", desc: "Healthy monounsaturated fatty acids" },
    { en: "Blueberry", hi: "नीलबदरी", desc: "Anthocyanins for brain and vision" },
    { en: "Kiwi", hi: "कीवी", desc: "High Vitamin C, K & Actinidain" }
  ],
  vegetables: [
    { en: "Spinach", hi: "पालक", desc: "Iron, Calcium, Vitamin K & Lutein" },
    { en: "Bitter Gourd", hi: "करेला", desc: "Charantin for blood sugar control" },
    { en: "Broccoli", hi: "हरी फूलगोभी", desc: "Sulforaphane anticancer compound" },
    { en: "Ginger", hi: "अदरक", desc: "Gingerol anti-inflammatory" },
    { en: "Garlic", hi: "लहसुन", desc: "Allicin cardiovascular shield" },
    { en: "Turmeric", hi: "हल्दी", desc: "Curcumin healing compound" },
    { en: "Beetroot", hi: "चुकंदर", desc: "Nitrates for stamina" },
    { en: "Tomato", hi: "टमाटर", desc: "Lycopene antioxidant" }
  ],
  colors: [
    { name: "Ruby Red", hi: "लाल", hex: "#EF4444", vibe: "Passion, Energy, Vitality" },
    { name: "Sapphire Blue", hi: "नीला", hex: "#3B82F6", vibe: "Trust, Depth, Intellect" },
    { name: "Emerald Green", hi: "हरा", hex: "#10B981", vibe: "Growth, Nature, Balance" },
    { name: "Amber Yellow", hi: "पीला", hex: "#F59E0B", vibe: "Clarity, Warmth, Alertness" },
    { name: "Royal Purple", hi: "बैंगनी", hex: "#8B5CF6", vibe: "Wisdom, Luxury, Creativity" },
    { name: "Rose Pink", hi: "गुलाबी", hex: "#EC4899", vibe: "Love, Softness, Compassion" },
    { name: "Obsidian Black", hi: "काला", hex: "#111827", vibe: "Elegance, Mystery, Power" },
    { name: "Pure White", hi: "सफ़ेद", hex: "#FFFFFF", vibe: "Peace, Purity, Illumination" }
  ]
};

const DEFAULT_MEMORY = {
  qaMemory: {
    "who are you": "Main Himo hoon — aapka 100% self-built, independent, personalized cognitive intelligence!",
    "who made you": "Main ek autonomous private AI engine hoon. Creator ID: 8Gef8W6R5DQyhJeKVtDVURHg5Wv2.",
    "hello himo": "Yo! Himo Omni Engine active hai. Creator ID verified. Aaj kya create ya solve karna hai?",
    "what can you do": "Main 100% offline code generate karta hoon, math evaluate karta hoon, aur creator ke sikhane par khud ko human ki tarah train karta hoon.",
    "kaise ho": "Ekdum solid! Fully independent aur top efficiency par active hoon.",
  }
};

const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function convertThreeDigits(num) {
  let str = "";
  if (num >= 100) {
    str += ONES[Math.floor(num / 100)] + " Hundred ";
    num %= 100;
  }
  if (num >= 20) {
    str += TENS[Math.floor(num / 10)] + " ";
    num %= 10;
  }
  if (num > 0) {
    str += ONES[num] + " ";
  }
  return str.trim();
}

function numberToInternationalWords(numStr) {
  let clean = numStr.replace(/,/g, '').trim();
  if (!/^\d+$/.test(clean)) return null;
  if (clean === "0") return "Zero";
  
  const scales = ["", "Thousand", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion"];
  let words = [];
  let chunkCount = 0;

  while (clean.length > 0) {
    let chunk = parseInt(clean.slice(-3), 10);
    clean = clean.slice(0, -3);
    if (chunk > 0) {
      let chunkWord = convertThreeDigits(chunk);
      let scale = scales[chunkCount] ? " " + scales[chunkCount] : "";
      words.unshift(chunkWord + scale);
    }
    chunkCount++;
  }
  return words.join(", ");
}

function getIndianScaleLookup(numStr) {
  const len = numStr.replace(/,/g, '').trim().length;
  if (len === 1) return "इकाई (Units / Ek)";
  if (len === 2) return "दहाई (Tens / Das)";
  if (len === 3) return "सैकड़ा (Hundreds / Sau)";
  if (len === 4) return "हज़ार (Thousands / Hazaar)";
  if (len === 5) return "दस हज़ार (Ten Thousand / Das Hazaar)";
  if (len === 6) return "लाख (1 Lakh - 10^5)";
  if (len === 7) return "दस लाख (10 Lakh - 10^6 / 1 Million)";
  if (len === 8) return "करोड़ (1 Crore - 10^7 / 10 Million)";
  if (len === 9) return "दस करोड़ (10 Crore - 10^8 / 100 Million)";
  if (len === 10) return "अरब (1 Arab - 10^9 / 1 Billion)";
  if (len === 11) return "दस अरब (10 Arab - 10^10 / 10 Billion)";
  if (len === 12) return "खरब (1 Kharab - 10^11 / 100 Billion)";
  if (len === 13) return "दस खरब (10 Kharab - 10^12 / 1 Trillion)";
  if (len === 14) return "नील (1 Neel - 10^13 / 10 Trillion)";
  if (len === 15) return "दस नील (10 Neel - 10^14 / 100 Trillion)";
  if (len === 16) return "पद्म (1 Padma - 10^15 / 1 Quadrillion)";
  if (len === 17) return "दस पद्म / शंख (10 Padma / 1 Shankh - 10^16)";
  if (len === 18) return "दस शंख / महाशंख (10 Shankh / 100 Quadrillion - 10^17)";
  return "Infinite Vedic Order";
}

const openDB = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject("No window");
    const request = indexedDB.open("HimoChatDB", 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("sessions")) {
        db.createObjectStore("sessions", { keyPath: "id", autoIncrement: true });
      }
    };
  });
};

const saveSessionToIDB = async (session) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("sessions", "readwrite");
      const store = transaction.objectStore("sessions");
      const request = session.id ? store.put(session) : store.add({ ...session, timestamp: Date.now() });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error(e);
  }
};

const getAllSessionsFromIDB = async () => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("sessions", "readonly");
      const store = transaction.objectStore("sessions");
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    return [];
  }
};

function LoginPage({ onLoginSuccess }) {
  const [showTerms, setShowTerms] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const handleUserInteraction = () => {
    if (videoRef.current && isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.play();
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userData = {
        name: user.displayName || user.email.split('@')[0],
        email: user.email,
        photoURL: user.photoURL || "/IMG_20260826_084111.jpg"
      };
      localStorage.setItem("userEmail", userData.email);
      localStorage.setItem("userName", userData.name);
      localStorage.setItem("userPhoto", userData.photoURL);
      if (onLoginSuccess) onLoginSuccess(userData);
    } catch (error) {
      setErrorMsg("Google Sign-In failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuthSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setErrorMsg('');

    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      const user = userCredential.user;
      const userData = {
        name: user.displayName || user.email.split('@')[0],
        email: user.email,
        photoURL: user.photoURL || "/IMG_20260826_084111.jpg"
      };
      localStorage.setItem("userEmail", userData.email);
      localStorage.setItem("userName", userData.name);
      localStorage.setItem("userPhoto", userData.photoURL);
      if (onLoginSuccess) onLoginSuccess(userData);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="login-page-container"
      onClick={handleUserInteraction}
      onTouchStart={handleUserInteraction}
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        webkit-playsinline="true"
        className="login-video"
      >
        <source src="/VID_20260825_012929_202_bsl.mp4" type="video/mp4" />
      </video>

      <div className="top-brand-wrapper">
        <div className="brand-image-container">
          <img 
            src="/IMG_20260826_084111.jpg" 
            alt="Himo Logo" 
            className="brand-logo-img"
          />
        </div>
        <h1 className="brand-title">Himo</h1>
      </div>

      <div className="bottom-wrapper">
        {errorMsg && <div className="error-banner">{errorMsg}</div>}

        <div className="login-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleGoogleLogin();
            }}
            disabled={loading}
            className="auth-btn google-btn"
          >
            <svg className="btn-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{loading ? "Signing in..." : "Continue with Google"}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEmailModalOpen(true);
            }}
            className="auth-btn email-blue-btn"
          >
            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Sign in with Email</span>
          </button>
        </div>

        <div className="bottom-terms">
          <p onClick={(e) => { e.stopPropagation(); setShowTerms(true); }} className="terms-text">
            Login means you agree to the Terms &amp; Privacy Policy
          </p>
        </div>
      </div>

      {isEmailModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsEmailModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{isSignUp ? "Create Account" : "Sign In with Email"}</h3>
            <form onSubmit={handleEmailAuthSubmit} className="email-form">
              <input 
                type="email" 
                placeholder="Enter email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="modal-input"
              />
              <input 
                type="password" 
                placeholder="Enter password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="modal-input"
              />
              <button type="submit" disabled={loading} className="modal-btn">
                {loading ? "Processing..." : (isSignUp ? "Sign Up" : "Login")}
              </button>
              <p className="toggle-auth-mode" onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
              </p>
            </form>
            <button className="modal-close-btn" onClick={() => setIsEmailModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {showTerms && (
        <div className="modal-backdrop" onClick={() => setShowTerms(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Terms &amp; Privacy Policy</h3>
            <p>By logging in, you agree to our Terms of Service and Privacy Policy. Your session data is safely managed via Firebase.</p>
            <button className="modal-btn" onClick={() => setShowTerms(false)}>Close</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .login-page-container { position: relative; width: 100vw; height: 100vh; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; align-items: center; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; user-select: none; }
        .login-video { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }
        .top-brand-wrapper { position: relative; z-index: 10; margin-top: 15vh; display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .brand-image-container { width: 90px; height: 90px; border-radius: 22px; overflow: hidden; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4); border: 2px solid rgba(255, 255, 255, 0.2); background: #000; }
        .brand-logo-img { width: 100%; height: 100%; object-fit: cover; }
        .brand-title { font-size: 2rem; font-weight: 800; color: #ffffff; letter-spacing: 1px; text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7); margin: 0; }
        .bottom-wrapper { position: relative; z-index: 10; width: 100%; max-width: 360px; padding: 0 20px 24px 20px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .error-banner { background: rgba(239, 68, 68, 0.9); color: white; padding: 8px 12px; border-radius: 8px; font-size: 0.8rem; text-align: center; width: 100%; }
        .login-actions { width: 100%; display: flex; flex-direction: column; gap: 12px; }
        .auth-btn { width: 100%; padding: 14px 20px; font-size: 0.95rem; font-weight: 600; border-radius: 9999px; border: none; display: flex; align-items: center; justify-content: center; gap: 12px; cursor: pointer; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35); transition: transform 0.1s ease; }
        .auth-btn:active { transform: scale(0.97); }
        .google-btn { background: #ffffff; color: #1f2937; }
        .google-btn:hover { background: #f8fafc; }
        .email-blue-btn { background: #1d4ed8; color: #ffffff; }
        .email-blue-btn:hover { background: #1e40af; }
        .btn-icon { width: 20px; height: 20px; flex-shrink: 0; }
        .bottom-terms { text-align: center; }
        .terms-text { font-size: 0.78rem; color: #ffffff; text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8); text-decoration: underline; cursor: pointer; }
        .modal-backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75); z-index: 50; display: flex; align-items: center; justify-content: center; padding: 16px; }
        .modal-content { background: #ffffff; color: #111827; border-radius: 24px; max-width: 360px; width: 100%; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4); display: flex; flex-direction: column; gap: 12px; }
        .modal-content h3 { font-size: 1.15rem; font-weight: 700; margin-bottom: 4px; }
        .email-form { display: flex; flex-direction: column; gap: 10px; }
        .modal-input { width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 0.9rem; outline: none; }
        .modal-btn { width: 100%; padding: 10px; background: #1d4ed8; color: #ffffff; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; }
        .toggle-auth-mode { font-size: 0.8rem; color: #2563eb; text-align: center; cursor: pointer; margin-top: 4px; }
        .modal-close-btn { background: transparent; border: none; color: #6b7280; font-size: 0.85rem; cursor: pointer; text-align: center; margin-top: 4px; }
      `}</style>
    </div>
  );
}

function HimoChatPage({ user, onLogout }) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [sessions, setSessions] = useState([])
  const [currentSessionId, setCurrentSessionId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const memoryRef = useRef(DEFAULT_MEMORY)

  const userEmail = user?.email || localStorage.getItem("userEmail") || "user@gmail.com";
  const userName = user?.displayName || userEmail.split('@')[0];
  const userPhoto = user?.photoURL || user?.photoUrl || localStorage.getItem("userPhoto") || "/IMG_20260826_084111.jpg";

  useEffect(() => {
    getAllSessionsFromIDB().then((savedSessions) => {
      if (savedSessions && savedSessions.length > 0) {
        setSessions(savedSessions);
      }
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
    }
  }, [message])

  const saveCurrentSession = async (msgs) => {
    if (msgs.length === 0) return;
    const title = msgs[0]?.content ? msgs[0].content.substring(0, 30) + "..." : "New Session";
    const sessionData = {
      id: currentSessionId || Date.now(),
      title,
      messages: msgs,
      timestamp: Date.now()
    };
    await saveSessionToIDB(sessionData);
    const updatedSessions = await getAllSessionsFromIDB();
    setSessions(updatedSessions);
    if (!currentSessionId) {
      setCurrentSessionId(sessionData.id);
    }
  };

  const handleNewSession = async () => {
    if (messages.length > 0) {
      await saveCurrentSession(messages);
    }
    setMessages([]);
    setCurrentSessionId(null);
    setSidebarOpen(false);
  };

  const loadSession = (session) => {
    setMessages(session.messages);
    setCurrentSessionId(session.id);
    setSidebarOpen(false);
  };

  function cleanInputText(str) {
    return str.replace(/[\u200B-\u200D\uFEFF]/g, '').trim()
  }

  function getSimilarity(text1, text2) {
    const t1 = new Set(text1.toLowerCase().match(/\b\w+\b/g) || [])
    const t2 = new Set(text2.toLowerCase().match(/\b\w+\b/g) || [])
    if (!t1.size || !t2.size) return 0
    const intersection = new Set([...t1].filter((x) => t2.has(x)))
    return intersection.size / Math.sqrt(t1.size * t2.size)
  }

  async function processHimoBrain(userInput) {
    let clean = cleanInputText(userInput)
    const memory = memoryRef.current
    const lower = clean.toLowerCase()

    // 0. Creator Training Command e.g. "teach: [question] = [answer]"
    if (lower.startsWith("teach:")) {
      const parts = clean.substring(6).split("=");
      if (parts.length === 2) {
        const q = parts[0].trim();
        const a = parts[1].trim();
        await teachHimo(q, a);
        return `🧠 **Autonomous Training Successful!**\nCreator ID (8Gef8W6R5DQyhJeKVtDVURHg5Wv2) verified.\nI have successfully learned and stored this permanently:\n• **Q:** ${q}\n• **A:** ${a}`;
      } else {
        return `⚠️ **Training Syntax Error:** Please use format -> \`teach: your question = your answer\``;
      }
    }

    // 1. Check Self-Learned Human Memory (IndexedDB)
    const learnedAnswer = await queryLearnedHimo(clean);
    if (learnedAnswer) {
      return `🧠 [Self-Trained Memory]: ${learnedAnswer}`;
    }

    // 2. Math Engine Check
    const mathResult = evaluateAdvancedMath(clean)
    if (mathResult) return mathResult

    // 3. Encyclopedia / Master Charts Check
    if (lower.includes("question") && (lower.includes("icon") || lower.includes("svg"))) {
      return "```jsx\nexport const QuestionIcon = ({ size = 24, className = 'text-indigo-400' }) => (\n  <svg width={size} height={size} viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\">\n    <circle cx=\"12\" cy=\"12\" r=\"10\" />\n    <path d=\"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3\" />\n    <line x1=\"12\" y1=\"17\" x2=\"12.01\" y2=\"17\" />\n  </svg>\n);\n```"
    }

    const numMatch = clean.match(/\b\d{1,18}\b/)
    if (numMatch && (lower.includes("word") || lower.includes("counting") || lower.includes("read") || lower.includes("in words"))) {
      const rawNum = numMatch[0]
      const international = numberToInternationalWords(rawNum)
      const indianScale = getIndianScaleLookup(rawNum)
      return `🔢 NUMBER BREAKDOWN: **${rawNum}**\n• International: **${international}**\n• Indian Vedic: **${indianScale}**\n• Power of 10: **10^${rawNum.length - 1}**`
    }

    if (lower.includes("counting chart") || lower.includes("1 to 100000000000000000") || lower.includes("shankh")) {
      return `🌌 INFINITE NUMBER SCALE SYSTEM (1 to 10^17 / 100 Quadrillion / 10 Shankh):\n\n1. 1 (10^0) -> One | इकाई\n2. 1,000 (10^3) -> One Thousand | हज़ार\n3. 100,000 (10^5) -> Hundred Thousand | एक लाख (1 Lakh)\n4. 10,000,000 (10^7) -> Ten Million (10M) | एक करोड़ (1 Crore)\n5. 1,000,000,000 (10^9) -> One Billion (1B) | एक अरब (1 Arab)\n6. 1,000,000,000,000 (10^12) -> One Trillion (1T) | दस खरब (10 Kharab)\n7. 10,000,000,000,000,000 (10^16) -> Ten Quadrillion | दस पद्म / 1 शंख (1 Shankh)`
    }

    if (lower.includes("fruit") || lower.includes("fruits")) {
      return "🍎 COMPREHENSIVE FRUITS DIRECTORY:\n\n" + ENCYCLOPEDIA.fruits.map(f => `• **${f.en}** (${f.hi}): ${f.desc}`).join("\n")
    }

    if (lower.includes("vegetable") || lower.includes("sabji")) {
      return "🥦 COMPREHENSIVE VEGETABLES DIRECTORY:\n\n" + ENCYCLOPEDIA.vegetables.map(v => `• **${v.en}** (${v.hi}): ${v.desc}`).join("\n")
    }

    if (lower.includes("color") || lower.includes("colours")) {
      return "🎨 COMPREHENSIVE COLOR SPECTRUM:\n\n" + ENCYCLOPEDIA.colors.map(c => `• **${c.name}** (${c.hi}) [\`${c.hex}\`] -> ${c.vibe}`).join("\n")
    }

    if (lower.includes("alphabet") || lower.includes("a to z")) {
      return "🔤 ALPHABETS MASTER CHART:\n\n" + ENCYCLOPEDIA.alphabets.map(a => `• **${a.letter}** -> **${a.word}** (${a.hindi})`).join("\n")
    }

    let bestMatch = null
    let highestScore = 0
    for (const [pattern, response] of Object.entries(memory.qaMemory)) {
      const score = getSimilarity(clean, pattern)
      if (score > highestScore) {
        highestScore = score
        bestMatch = response
      }
    }

    if (highestScore >= 0.30 && bestMatch) {
      return bestMatch
    }

    // 4. Automatic Intelligent Knowledge Synthesizer
    return generateAutomaticAnswer(clean);
  }

  function streamResponse(fullText, updatedMessages) {
    let currentLength = 0
    const step = Math.max(1, Math.floor(fullText.length / 30))

    const newMsgsWithAssistant = [...updatedMessages, { role: "assistant", content: "" }];
    setMessages(newMsgsWithAssistant);

    const interval = setInterval(() => {
      currentLength += step
      if (currentLength >= fullText.length) {
        currentLength = fullText.length
        clearInterval(interval)
        setLoading(false)
        const finalMsgs = [...updatedMessages, { role: "assistant", content: fullText }];
        saveCurrentSession(finalMsgs);
      }
      const partial = fullText.substring(0, currentLength)
      setMessages((prev) => {
        const copy = [...prev]
        if (copy[copy.length - 1]) {
          copy[copy.length - 1] = { role: "assistant", content: partial }
        }
        return copy
      })
    }, 16)
  }

  async function handleSend(textToSend) {
    const prompt = (typeof textToSend === "string" ? textToSend : message).trim()
    if (!prompt || loading) return

    setMessage("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"

    const updatedMessages = [...messages, { role: "user", content: prompt }];
    setMessages(updatedMessages)
    setLoading(true)

    setTimeout(async () => {
      const finalReply = await processHimoBrain(prompt)
      streamResponse(finalReply, updatedMessages)
    }, 200)
  }

  return (
    <main className="app-shell">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <button className="icon-btn" onClick={() => setSidebarOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <button className="new-chat-btn" onClick={handleNewSession}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Session
        </button>

        <div className="sidebar-section">
          <p className="sidebar-label">Logged in as</p>
          <div className="user-info-box flex items-center gap-3">
            <img 
              src={userPhoto} 
              alt="DP" 
              className="user-dp-img"
              onError={(e)=>{e.target.src = "/IMG_20260826_084111.jpg"}}
            />
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="user-name truncate m-0">{userName}</p>
              <p className="user-email truncate m-0">{userEmail}</p>
            </div>
          </div>

          <div className="history-drawer">
            <p className="sidebar-label" style={{ marginTop: '16px' }}>Chat History</p>
            <div className="history-list">
              {sessions.map((s) => (
                <div 
                  key={s.id} 
                  className={`history-item truncate ${currentSessionId === s.id ? 'active' : ''}`}
                  onClick={() => loadSession(s)}
                >
                  {s.title}
                </div>
              ))}
              {sessions.length === 0 && <p className="no-history">No saved sessions</p>}
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          <button className="footer-item logout-btn" onClick={onLogout}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Log Out
          </button>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="left-nav">
            <button className="icon-btn" onClick={() => setSidebarOpen(true)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <span className="brand-name">
              Himo <span className="brand-badge">v13.0 Omni</span>
            </span>
          </div>
          <div className="user-profile-badge">
            <img 
              src={userPhoto} 
              alt="Profile" 
              className="topbar-avatar-img"
              onError={(e)=>{e.target.src = "/IMG_20260826_084111.jpg"}}
            />
          </div>
        </header>

        <div className="canvas">
          {messages.length === 0 && (
            <div className="hero-screen">
              <div className="hero-greeting">
                <span className="gradient-text">Himo Omni</span>
                <h1>Pure Native Intelligence & Deep Engine</h1>
              </div>

              <div className="suggestion-grid">
                <div className="suggestion-card" onClick={() => handleSend("Counting chart 1 to 100000000000000000")}>
                  <p>Infinite Counting</p>
                  <span>1 to 100 Quadrillion (Shankh)</span>
                </div>
                <div className="suggestion-card" onClick={() => handleSend("All fruits name")}><p>Comprehensive Fruits</p><span>Botanical Directory</span></div>
                <div className="suggestion-card" onClick={() => handleSend("Calculate 25 * 480 - 150")}><p>Math Evaluation</p><span>Fast arithmetic</span></div>
                <div className="suggestion-card" onClick={() => handleSend("teach: what is ai = AI is artificial intelligence created by creator 8Gef8W6R5DQyhJeKVtDVURHg5Wv2")}><p>Train Himo</p><span>Teach custom facts</span></div>
              </div>
            </div>
          )}

          <div className="messages-list">
            {messages.map((msg, index) => (
              <div key={index} className={`message-row ${msg.role}`}>
                <div className="message-icon">
                  {msg.role === "assistant" ? (
                    <div className="gemini-sparkle">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                      </svg>
                    </div>
                  ) : (
                    <img 
                      src={userPhoto} 
                      alt="U" 
                      className="chat-user-icon-img"
                      onError={(e)=>{e.target.src = "/IMG_20260826_084111.jpg"}}
                    />
                  )}
                </div>
                <div className="message-bubble">
                  <div className="message-text">
                    {msg.content.split("\n").map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="dock-container">
          <div className="composer-shell">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Ask anything or train Himo via 'teach: question = answer'..."
              rows={1}
            />
            <div className="composer-actions">
              <button
                type="button"
                className="send-button-gemini"
                disabled={!message.trim() || loading}
                onClick={() => handleSend()}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
          <p className="disclaimer-text">Himo v13.0 Omni • Creator ID: 8Gef8W6R5DQyhJeKVtDVURHg5Wv2</p>
        </div>
      </section>

      <style jsx global>{`
        html, body {
          overscroll-behavior-y: none;
          touch-action: pan-x pan-y;
          -webkit-text-size-adjust: 100%;
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
      `}</style>

      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; word-break: break-word; overflow-wrap: break-word; }
        .app-shell { display: flex; height: 100vh; width: 100vw; background: #131314; color: #e3e3e3; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; overflow: hidden; position: fixed; top: 0; left: 0; }
        .workspace { flex: 1; display: flex; flex-direction: column; position: relative; height: 100vh; width: 100%; overflow: hidden; }
        
        .topbar { height: 64px; padding: 0 20px; display: flex; align-items: center; justify-content: space-between; background: #131314; z-index: 10; border: none !important; box-shadow: none !important; }
        .left-nav { display: flex; align-items: center; gap: 16px; }
        .brand-name { font-size: 1.15rem; font-weight: 600; color: #c4c7c5; display: flex; align-items: center; gap: 8px; }
        .brand-badge { font-size: 0.72rem; padding: 2px 8px; background: #23272f; border: 1px solid #383f4d; border-radius: 12px; color: #61dafb; font-weight: 500; }
        .icon-btn { background: transparent; border: none; color: #c4c7c5; cursor: pointer; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
        .icon-btn:hover { background: #282a2c; }

        .topbar-avatar-img { width: 34px !important; height: 34px !important; min-width: 34px !important; min-height: 34px !important; max-width: 34px !important; max-height: 34px !important; border-radius: 50% !important; object-fit: cover !important; display: block; }
        .user-dp-img { width: 40px !important; height: 40px !important; min-width: 40px !important; min-height: 40px !important; max-width: 40px !important; max-height: 40px !important; border-radius: 50% !important; object-fit: cover !important; border: 1px solid rgba(255,255,255,0.2); display: block; flex-shrink: 0; }
        .chat-user-icon-img { width: 32px !important; height: 32px !important; min-width: 32px !important; min-height: 32px !important; max-width: 32px !important; max-height: 32px !important; border-radius: 50% !important; object-fit: cover !important; display: block; margin-top: 3px; flex-shrink: 0; }

        .sidebar { position: fixed; top: 0; left: -320px; width: 290px; height: 100vh; background: #1e1f20; transition: left 0.25s cubic-bezier(0.4, 0, 0.2, 1); z-index: 100; padding: 16px; display: flex; flex-direction: column; border-right: 1px solid #282a2c; }
        .sidebar.open { left: 0; }
        .sidebar-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.65); z-index: 99; backdrop-filter: blur(2px); }
        .sidebar-header { display: flex; justify-content: flex-start; margin-bottom: 16px; }
        .new-chat-btn { display: flex; align-items: center; gap: 12px; background: #282a2c; border: 1px solid #383b40; color: #e3e3e3; padding: 12px 18px; border-radius: 24px; cursor: pointer; font-size: 0.9rem; margin-bottom: 24px; width: 100%; }
        .sidebar-section { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .sidebar-label { font-size: 0.72rem; font-weight: 600; color: #8e918f; margin-bottom: 8px; text-transform: uppercase; }
        
        .user-info-box { background: #161b22; padding: 10px 12px; border-radius: 12px; border: 1px solid #30363d; display: flex; align-items: center; gap: 12px; width: 100%; }
        .user-name { font-size: 0.88rem; font-weight: 600; color: #ffffff; width: 100%; }
        .user-email { font-size: 0.75rem; color: #8b949e; margin-top: 2px; width: 100%; }
        
        .history-drawer { flex: 1; display: flex; flex-direction: column; overflow: hidden; margin-top: 12px; }
        .history-list { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; padding-right: 4px; }
        .history-item { font-size: 0.84rem; color: #c4c7c5; padding: 8px 12px; border-radius: 8px; cursor: pointer; background: #232528; border: 1px solid transparent; }
        .history-item:hover { background: #2d2f33; }
        .history-item.active { background: #2d323b; border-color: #3b4252; color: #ffffff; }
        .no-history { font-size: 0.78rem; color: #8e918f; font-style: italic; }

        .sidebar-footer { border-top: 1px solid #2d2f31; padding-top: 12px; }
        .footer-item { display: flex; align-items: center; gap: 10px; background: transparent; border: none; color: #e57373; padding: 10px 14px; border-radius: 18px; cursor: pointer; font-size: 0.86rem; width: 100%; }
        
        .canvas { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 0 16px 200px 16px; max-width: 860px; width: 100%; margin: 0 auto; }
        .hero-screen { margin-top: 6vh; }
        .hero-greeting { margin-bottom: 36px; }
        .gradient-text { font-size: 3.4rem; font-weight: 700; background: linear-gradient(74deg, #4285f4 0%, #9b72cb 25%, #d96570 50%, #ffffff 100%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: block; margin-bottom: 6px; }
        .hero-greeting h1 { font-size: 2.2rem; font-weight: 400; color: #5e6267; }
        .suggestion-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 12px; }
        .suggestion-card { background: #1e1f20; padding: 18px; border-radius: 20px; cursor: pointer; border: 1px solid #282a2c; display: flex; flex-direction: column; justify-content: space-between; min-height: 105px; }
        .suggestion-card:hover { background: #25272a; }
        .suggestion-card p { font-size: 0.92rem; font-weight: 500; color: #e3e3e3; }
        .suggestion-card span { font-size: 0.78rem; color: #8e918f; }
        
        .messages-list { display: flex; flex-direction: column; gap: 24px; padding-top: 24px; width: 100%; }
        .message-row { display: flex; gap: 16px; max-width: 100%; width: 100%; }
        .message-row.user { flex-direction: row-reverse; }
        .gemini-sparkle { color: #9b72cb; margin-top: 3px; flex-shrink: 0; }
        
        .message-bubble { max-width: 85%; min-width: 0; }
        .message-row.user .message-bubble { background: #282a2c; padding: 12px 18px; border-radius: 20px; border-top-right-radius: 4px; border: 1px solid #333538; }
        .message-text { font-size: 1rem; line-height: 1.68; color: #e3e3e3; word-break: break-word; overflow-wrap: break-word; }
        
        .dock-container { position: bottom; left: 0; right: 0; padding: 16px 20px 20px; background: linear-gradient(180deg, transparent 0%, #131314 45%); display: flex; flex-direction: column; align-items: center; }
        .composer-shell { width: 100%; max-width: 840px; background: #1e1f20; border-radius: 28px; padding: 12px 18px; display: flex; align-items: flex-end; gap: 12px; border: 1px solid #2d2f31; }
        .composer-shell textarea { flex: 1; background: transparent; border: none; outline: none; color: #e3e3e3; font-size: 1rem; resize: none; max-height: 160px; line-height: 1.5; padding-top: 4px; }
        .send-button-gemini { width: 36px; height: 36px; border-radius: 50%; background: #e3e3e3; color: #131314; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; }
        .send-button-gemini:disabled { background: #282a2c; color: #8e918f; cursor: not-allowed; }
        .disclaimer-text { font-size: 0.74rem; color: #8e918f; margin-top: 10px; text-align: center; }
      `}</style>
    </main>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          photoURL: firebaseUser.photoURL || "/IMG_20260826_084111.jpg"
        });
      } else {
        setUser(null);
      }
      setInitializing(false);
    });

    return () => unsubscribe();
  }, [])

  const handleLoginSuccess = (userData) => {
    setUser(userData)
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.clear();
    } catch (e) {
      console.error(e);
    }
  }

  if (initializing) {
    return <div style={{ background: '#131314', width: '100vw', height: '100vh' }}></div>
  }

  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />
  }

  return <HimoChatPage user={user} onLogout={handleLogout} />
}
