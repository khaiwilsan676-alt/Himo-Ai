import React, { useState } from 'react';

export const examples = [
  "Explain quantum computing simply",
  "Write a landing page in React",
  "Create a cinematic product shot",
  "Make a 10-second travel video"
];

export const recentConversations = [
  "Ideas for a new startup",
  "Refactor auth middleware",
  "Tokyo travel itinerary"
];

export default function HimoChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "himo",
      text: "Hello! I am Himo AI, a best language model. How can I assist you today?"
    }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: input
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulated AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "himo",
          text: "I am ready to help you with anything you need!"
        }
      ]);
    }, 600);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0d0f17] text-white font-sans">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Himo AI
          </span>
        </div>
      </header>

      {/* Chat Messages Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl w-full mx-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-800/80 border border-gray-700/60 text-gray-200 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </main>

      {/* Bottom Sticky Input Bar */}
      <footer className="p-4 border-t border-gray-800/80 bg-[#0d0f17]/95 backdrop-blur">
        <div className="max-w-3xl mx-auto">
          {/* Quick Suggestion Pills */}
          {messages.length === 1 && (
            <div className="flex gap-2 overflow-x-auto pb-3 mb-1 no-scrollbar">
              {examples.map((example, i) => (
                <button
                  key={i}
                  onClick={() => setInput(example)}
                  className="whitespace-nowrap text-xs bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700/50 rounded-full px-3 py-1.5 text-gray-300 transition"
                >
                  {example}
                </button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message Himo AI..."
              className="w-full bg-gray-800/90 text-white placeholder-gray-400 border border-gray-700 rounded-full py-3.5 pl-5 pr-14 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white rounded-full transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}

