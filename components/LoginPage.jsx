"use client"

import React, { useState, useRef, useEffect } from 'react';

export default function LoginPage({ onLoginSuccess }) {
  const [showTerms, setShowTerms] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    // Video play ensure karne ke liye
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay fallback
      });
    }
  }, []);

  // Screen par kahin bhi first touch/click hone par sound on ho jayega
  const handleUserInteraction = () => {
    if (videoRef.current && isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.play();
    }
  };

  const handleFakeLogin = (provider) => {
    const fakeUserData = {
      name: "Demo User",
      email: provider === 'Google' ? "user@gmail.com" : "demo@gmail.com",
      provider: provider
    };
    if (onLoginSuccess) {
      onLoginSuccess(fakeUserData);
    }
  };

  return (
    <div 
      className="login-page-container"
      onClick={handleUserInteraction}
      onTouchStart={handleUserInteraction}
    >
      {/* Background Video */}
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

      {/* Bottom Section */}
      <div className="bottom-wrapper">
        {/* Buttons Section */}
        <div className="login-actions">
          {/* Google White Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFakeLogin('Google');
            }}
            className="auth-btn google-btn"
          >
            <svg className="btn-icon" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Email / Gmail Blue Button with User SVG Icon */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFakeLogin('Gmail');
            }}
            className="auth-btn email-blue-btn"
          >
            <svg
              className="btn-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Sign in with Email</span>
          </button>
        </div>

        {/* Terms & Privacy */}
        <div className="bottom-terms">
          <p 
            onClick={(e) => {
              e.stopPropagation();
              setShowTerms(true);
            }} 
            className="terms-text"
          >
            Login means you agree to the Terms &amp; Privacy Policy
          </p>
        </div>
      </div>

      {/* Terms & Privacy Popup Modal */}
      {showTerms && (
        <div className="modal-backdrop" onClick={() => setShowTerms(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Terms &amp; Privacy Policy</h3>
            <p>
              By logging in, you agree to our Terms of Service and Privacy Policy. Your session data is safely managed locally.
            </p>
            <button className="modal-btn" onClick={() => setShowTerms(false)}>
              Close
            </button>
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
          justify-content: flex-end;
          align-items: center;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          user-select: none;
        }

        .login-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }

        .bottom-wrapper {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 360px;
          padding: 0 20px 24px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .login-actions {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .auth-btn {
          width: 100%;
          padding: 14px 20px;
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: 9999px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
          transition: transform 0.1s ease;
        }

        .auth-btn:active {
          transform: scale(0.97);
        }

        .google-btn {
          background: #ffffff;
          color: #1f2937;
        }

        .google-btn:hover {
          background: #f8fafc;
        }

        .email-blue-btn {
          background: #1d4ed8;
          color: #ffffff;
        }

        .email-blue-btn:hover {
          background: #1e40af;
        }

        .btn-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .bottom-terms {
          text-align: center;
        }

        .terms-text {
          font-size: 0.78rem;
          color: #ffffff;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
          text-decoration: underline;
          cursor: pointer;
        }

        .terms-text:hover {
          color: #e2e8f0;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .modal-content {
          background: #ffffff;
          color: #111827;
          border-radius: 24px;
          max-width: 360px;
          width: 100%;
          padding: 24px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4);
        }

        .modal-content h3 {
          font-size: 1.15rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .modal-content p {
          font-size: 0.88rem;
          color: #4b5563;
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .modal-btn {
          width: 100%;
          padding: 12px;
          background: #111827;
          color: #ffffff;
          border-radius: 9999px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .modal-btn:hover {
          background: #000000;
        }
      `}</style>
    </div>
  );
}

