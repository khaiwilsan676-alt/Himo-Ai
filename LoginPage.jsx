"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "firebase/auth";
import { auth, googleProvider } from "../src/lib/firebase";

export default function LoginPage() {
  const [showTerms, setShowTerms] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
    getRedirectResult(auth).catch((error) => {
      if (error.code) setErrorMsg(`${error.code}: ${error.message}`);
    });
  }, []);

  const handleUserInteraction = () => {
    if (videoRef.current && isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.play().catch(() => {});
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Popup auth failed, trying redirect:", error);
      if (error.code === "auth/popup-blocked" || error.code === "auth/popup-closed-by-user") {
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectErr) {
          setErrorMsg(`${redirectErr.code}: ${redirectErr.message}`);
        }
      } else {
        setErrorMsg(`${error.code}: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setShowEmailModal(false);
    } catch (error) {
      console.error("Email Auth Error:", error);
      setErrorMsg(`${error.code}: ${error.message}`);
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

      {errorMsg && (
        <div className="error-banner">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg("")}>×</button>
        </div>
      )}

      <div className="bottom-wrapper">
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
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>{loading ? "Authenticating..." : "Continue with Google"}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowEmailModal(true);
            }}
            disabled={loading}
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

      {showEmailModal && (
        <div className="modal-backdrop" onClick={() => setShowEmailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{isSignUp ? "Create Account" : "Sign In with Email"}</h3>
            <form onSubmit={handleEmailAuth} className="email-form">
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="input-field"
              />
              <input 
                type="password" 
                placeholder="Password (min 6 chars)" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="input-field"
              />
              <button type="submit" disabled={loading} className="modal-btn">
                {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
              </button>
            </form>
            <p className="toggle-auth-text">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <span onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? "Sign In" : "Sign Up"}
              </span>
            </p>
          </div>
        </div>
      )}

      {showTerms && (
        <div className="modal-backdrop" onClick={() => setShowTerms(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Terms &amp; Privacy Policy</h3>
            <p>By logging in, you agree to our Terms of Service and Privacy Policy.</p>
            <button className="modal-btn" onClick={() => setShowTerms(false)}>Close</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .login-page-container {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          user-select: none;
        }
        .login-video {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          z-index: 0;
        }
        .top-brand-wrapper {
          position: relative; z-index: 10;
          margin-top: 15vh;
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }
        .brand-image-container {
          width: 90px; height: 90px;
          border-radius: 22px; overflow: hidden;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 255, 255, 0.2);
          background: #000;
        }
        .brand-logo-img { width: 100%; height: 100%; object-fit: cover; }
        .brand-title {
          font-size: 2rem; font-weight: 800; color: #ffffff;
          letter-spacing: 1px; text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
          margin: 0;
        }
        .error-banner {
          position: relative; z-index: 20;
          background: rgba(239, 68, 68, 0.95);
          color: #fff; padding: 10px 16px; border-radius: 8px;
          font-size: 0.85rem; display: flex; align-items: center; gap: 10px;
          max-width: 90%; margin: 0 16px;
        }
        .error-banner button { background: transparent; border: none; color: white; font-size: 1.2rem; cursor: pointer; }
        .bottom-wrapper {
          position: relative; z-index: 10;
          width: 100%; max-width: 360px;
          padding: 0 20px 24px 20px;
          display: flex; flex-direction: column; align-items: center; gap: 16px;
        }
        .login-actions { width: 100%; display: flex; flex-direction: column; gap: 12px; }
        .auth-btn {
          width: 100%; padding: 14px 20px; font-size: 0.95rem; font-weight: 600;
          border-radius: 9999px; border: none; display: flex; align-items: center;
          justify-content: center; gap: 12px; cursor: pointer;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
          transition: transform 0.1s ease;
        }
        .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .auth-btn:active:not(:disabled) { transform: scale(0.97); }
        .google-btn { background: #ffffff; color: #1f2937; }
        .email-blue-btn { background: #1d4ed8; color: #ffffff; }
        .btn-icon { width: 20px; height: 20px; flex-shrink: 0; }
        .bottom-terms { text-align: center; }
        .terms-text {
          font-size: 0.78rem; color: #ffffff;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
          text-decoration: underline; cursor: pointer;
        }
        .modal-backdrop {
          position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75);
          z-index: 50; display: flex; align-items: center; justify-content: center; padding: 16px;
        }
        .modal-content {
          background: #ffffff; color: #111827;
          border-radius: 24px; max-width: 360px; width: 100%; padding: 24px;
        }
        .modal-content h3 { font-size: 1.15rem; font-weight: 700; margin-bottom: 12px; }
        .email-form { display: flex; flex-direction: column; gap: 10px; }
        .input-field {
          width: 100%; padding: 12px 14px; border-radius: 10px;
          border: 1px solid #d1d5db; font-size: 0.9rem; outline: none; box-sizing: border-box;
        }
        .input-field:focus { border-color: #2563eb; }
        .modal-btn {
          width: 100%; padding: 12px; background: #111827; color: #ffffff;
          border-radius: 9999px; border: none; font-weight: 600; cursor: pointer; margin-top: 6px;
        }
        .toggle-auth-text { margin-top: 14px; font-size: 0.82rem; color: #6b7280; text-align: center; }
        .toggle-auth-text span { color: #2563eb; font-weight: 600; cursor: pointer; }
      `}</style>
    </div>
  );
}

