"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "firebase/auth";
import { auth, googleProvider } from "../src/lib/firebase";

export default function LoginPage({ onLoginSuccess }) {
  const [showTerms, setShowTerms] = useState(false);
  const [showEmailScreen, setShowEmailScreen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {
        // Fallback agar browser autoplay policy block kare
        if (videoRef.current) videoRef.current.muted = true;
        videoRef.current?.play().catch(() => {});
      });
    }
  }, []);

  const handleUserInteraction = () => {
    if (videoRef.current && videoRef.current.muted) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleGoogleLogin = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setLoading(true);
    setErrorMsg("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (typeof onLoginSuccess === "function") {
        onLoginSuccess(user);
      }
    } catch (error) {
      console.error("Google Auth Error:", error);
      setErrorMsg(`${error.code}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      const user = userCredential.user;
      if (typeof onLoginSuccess === "function") {
        onLoginSuccess(user);
      }
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
      {/* Background Video (Sound Enabled) */}
      <video
        ref={videoRef}
        autoPlay
        loop
        playsInline
        className="login-video"
      >
        <source src="/VID_20260825_012929_202_bsl.mp4" type="video/mp4" />
      </video>

      {/* Error Message Toast */}
      {errorMsg && (
        <div className="error-banner">
          <span>{errorMsg}</span>
          <button type="button" onClick={() => setErrorMsg("")}>×</button>
        </div>
      )}

      {/* VIEW 1: Full Email / Password Screen */}
      {showEmailScreen ? (
        <div className="email-screen-view">
          {/* Top Left Back Arrow */}
          <header className="top-nav-bar">
            <button 
              type="button" 
              className="back-btn" 
              onClick={() => {
                setShowEmailScreen(false);
                setErrorMsg("");
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
          </header>

          <div className="email-content-wrapper">
            {/* Center Logo */}
            <div className="brand-image-container">
              <img 
                src="/logo.png"
                alt="Himo Logo" 
                className="brand-logo-img"
              />
            </div>

            <h1 className="welcome-title">{isSignUp ? "Create Account" : "Welcome Back!"}</h1>
            <p className="welcome-subtitle">{isSignUp ? "Sign up to get started with Himo" : "Sign in to your Account"}</p>

            {/* Form */}
            <form onSubmit={handleEmailAuth} className="transparent-auth-form">
              <div className="field-group">
                <label className="field-label">Email</label>
                <div className="input-shell">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="transparent-input"
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Password</label>
                <div className="input-shell with-icon">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="transparent-input"
                  />
                  <button 
                    type="button" 
                    className="eye-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="login-submit-btn">
                {loading ? "Please wait..." : (isSignUp ? "Sign Up" : "Login")}
              </button>
            </form>

            <p className="switch-auth-text">
              {isSignUp ? "Already have an account? " : "Do you have account? "}
              <span onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? "Login" : "Sign up"}
              </span>
            </p>
          </div>
        </div>
      ) : (
        /* VIEW 2: Default Landing Screen */
        <>
          <div className="top-brand-wrapper">
            <div className="brand-image-container">
              <img 
                src="/logo.png"
                alt="Himo Logo" 
                className="brand-logo-img"
              />
            </div>
            <h1 className="brand-title">Himo</h1>
          </div>

          <div className="bottom-wrapper">
            <div className="login-actions">
              <button
                type="button"
                onClick={handleGoogleLogin}
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
                type="button"
                onClick={() => setShowEmailScreen(true)}
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
              <p onClick={() => setShowTerms(true)} className="terms-text">
                Login means you agree to the Terms &amp; Privacy Policy
              </p>
            </div>
          </div>
        </>
      )}

      {/* Terms Modal */}
      {showTerms && (
        <div className="modal-backdrop" onClick={() => setShowTerms(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Terms &amp; Privacy Policy</h3>
            <p>By logging in, you agree to our Terms of Service and Privacy Policy.</p>
            <button type="button" className="modal-btn" onClick={() => setShowTerms(false)}>Close</button>
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
          pointer-events: none;
        }

        .error-banner {
          position: fixed;
          top: 20px;
          z-index: 60;
          background: rgba(239, 68, 68, 0.95);
          color: #fff;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 10px;
          max-width: 90%;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
        }

        .error-banner button {
          background: transparent;
          border: none;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
        }

        /* Default Screen View */
        .top-brand-wrapper {
          position: relative; 
          z-index: 20;
          margin-top: 15vh;
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }

        .brand-image-container {
          width: 88px; height: 88px;
          border-radius: 22px; overflow: hidden;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 255, 255, 0.25);
          background: #000;
        }

        .brand-logo-img { width: 100%; height: 100%; object-fit: cover; }

        .brand-title {
          font-size: 2.2rem; font-weight: 800; color: #ffffff;
          letter-spacing: 1px; text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
          margin: 0;
        }

        .bottom-wrapper {
          position: relative; 
          z-index: 30;
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

        /* Email Screen Form Layout */
        .email-screen-view {
          position: absolute;
          inset: 0;
          z-index: 40;
          display: flex;
          flex-direction: column;
          padding: 24px 20px;
          overflow-y: auto;
        }

        .top-nav-bar {
          width: 100%;
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }

        .back-btn {
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: background 0.2s;
        }

        .back-btn:hover {
          background: rgba(0, 0, 0, 0.55);
        }

        .email-content-wrapper {
          width: 100%;
          max-width: 360px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .welcome-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #ffffff;
          margin-top: 16px;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
          text-align: center;
        }

        .welcome-subtitle {
          font-size: 0.92rem;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 28px;
          text-align: center;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
        }

        .transparent-auth-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #ffffff;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
          margin-left: 4px;
        }

        .input-shell {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
        }

        .transparent-input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.35);
          backdrop-filter: blur(12px);
          color: #ffffff;
          font-size: 0.95rem;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s, background 0.2s;
        }

        .transparent-input::placeholder {
          color: rgba(255, 255, 255, 0.55);
        }

        .transparent-input:focus {
          border-color: #60a5fa;
          background: rgba(255, 255, 255, 0.22);
        }

        .with-icon .transparent-input {
          padding-right: 48px;
        }

        .eye-toggle-btn {
          position: absolute;
          right: 12px;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.75);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }

        .login-submit-btn {
          width: 100%;
          padding: 15px;
          margin-top: 10px;
          border-radius: 9999px;
          border: none;
          background: #2563eb;
          color: #ffffff;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
          transition: transform 0.1s ease, background 0.2s;
        }

        .login-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-submit-btn:active:not(:disabled) {
          transform: scale(0.98);
        }

        .switch-auth-text {
          margin-top: 24px;
          font-size: 0.9rem;
          color: #ffffff;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
          text-align: center;
        }

        .switch-auth-text span {
          color: #60a5fa;
          font-weight: 700;
          cursor: pointer;
          text-decoration: underline;
        }

        /* Terms Modal */
        .modal-backdrop {
          position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75);
          z-index: 70; display: flex; align-items: center; justify-content: center; padding: 16px;
        }
        .modal-content {
          background: #ffffff; color: #111827;
          border-radius: 24px; max-width: 360px; width: 100%; padding: 24px;
        }
        .modal-content h3 { font-size: 1.15rem; font-weight: 700; margin-bottom: 12px; }
        .modal-btn {
          width: 100%; padding: 12px; background: #111827; color: #ffffff;
          border-radius: 9999px; border: none; font-weight: 600; cursor: pointer; margin-top: 16px;
        }
      `}</style>
    </div>
  );
}
