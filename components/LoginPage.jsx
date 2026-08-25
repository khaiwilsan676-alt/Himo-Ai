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
    <div className="relative w-full h-screen overflow-hidden flex flex-col justify-between items-center font-sans select-none">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        webkit-playsinline="true"
        className="absolute top-0 left-0 w-full h-full object-cover z-0 pointer-events-none"
      >
        <source src="/VID_20260825_012929_202_bsl.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay for clear contrast */}
      <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />

      {/* Top Spacer */}
      <div className="relative z-20 w-full pt-10" />

      {/* Center Action Buttons */}
      <div className="relative z-20 w-full max-w-xs px-4 flex flex-col items-center gap-4 my-auto">
        
        {/* Google White Button (Round Full) */}
        <button
          onClick={() => handleFakeLogin('Google')}
          className="w-full py-4 px-6 bg-white hover:bg-gray-100 text-gray-800 font-semibold rounded-full shadow-2xl flex items-center justify-center gap-3 transition-transform active:scale-95 cursor-pointer"
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
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
          <span className="text-[15px] tracking-wide">Continue with Google</span>
        </button>

        {/* Gmail Button (Round Full) */}
        <button
          onClick={() => handleFakeLogin('Gmail')}
          className="w-full py-4 px-6 bg-white hover:bg-gray-100 text-gray-800 font-semibold rounded-full shadow-2xl flex items-center justify-center gap-3 transition-transform active:scale-95 cursor-pointer"
        >
          <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-[15px] tracking-wide">Sign in with Gmail</span>
        </button>

      </div>

      {/* Ekdam Bottom: Terms & Privacy Link */}
      <div className="relative z-20 pb-6 px-4 text-center">
        <p
          onClick={() => setShowTerms(true)}
          className="text-xs text-white/80 hover:text-white underline cursor-pointer transition-colors"
        >
          Login means you agree to the Terms &amp; Privacy Policy
        </p>
      </div>

      {/* Terms & Privacy Popup Modal */}
      {showTerms && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() => setShowTerms(false)}
        >
          <div 
            className="bg-white text-gray-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-2">Terms &amp; Privacy Policy</h3>
            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              By logging in, you agree to our Terms of Service and Privacy Policy. Your session data is safely managed locally.
            </p>
            <button
              onClick={() => setShowTerms(false)}
              className="w-full py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
