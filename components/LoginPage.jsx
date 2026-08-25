"use client"

import React, { useState } from 'react';

export default function LoginPage({ onLoginSuccess }) {
  const [showTerms, setShowTerms] = useState(false);

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
    <div className="login-page-container">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        webkit-playsinline="true"
        className="login-video"
      >
        <source src="/VID_20260825_012929_202_bsl.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="video-overlay" />

      {/* Spacer Top */}
      <div className="top-space" />

      {/* Center Action Buttons */}
      <div className="login-actions">
        {/* Google White Button */}
        <button
          onClick={() => handleFakeLogin('Google')}
          className="auth-btn"
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

        {/* Gmail Button */}
        <button
          onClick={() => handleFakeLogin('Gmail')}
          className="auth-btn"
        >
          <svg className="btn-icon red-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>Sign in with Gmail</span>
        </button>
      </div>

      {/* Ekdam Bottom: Terms & Privacy Link */}
      <div className="bottom-terms">
        <p onClick={() => setShowTerms(true)} className="terms-text">
          Login means you agree to the Terms &amp; Privacy Policy
        </p>
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
          justify-content: space-between;
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
          pointer-events: none;
        }

        .video-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          z-index: 1;
          pointer-events: none;
        }

        .top-space {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 10%;
        }

        .login-actions {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 320px;
          padding: 0 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .auth-btn {
          width: 100%;
          padding: 14px 20px;
          background: #ffffff;
          color: #1f2937;
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: 9999px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
          transition: transform 0.1s ease, background-color 0.2s;
        }

        .auth-btn:hover {
          background: #f3f4f6;
        }

        .auth-btn:active {
          transform: scale(0.97);
        }

        .btn-icon {
          width: 22px;
          height: 22px;
          flex-shrink: 0;
        }

        .red-icon {
          color: #ea4335;
        }

        .bottom-terms {
          position: relative;
          z-index: 2;
          padding-bottom: 24px;
          padding-left: 16px;
          padding-right: 16px;
          text-align: center;
        }

        .terms-text {
          font-size: 0.78rem;
          color: rgba(255, 255, 255, 0.85);
          text-decoration: underline;
          cursor: pointer;
          transition: color 0.2s;
        }

        .terms-text:hover {
          color: #ffffff;
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

