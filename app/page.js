'use client';
import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    { sender: 'himo', text: 'Yo! Himo Omni Engine active hai. Live Web Search & Coding ready hai. Kya find ya build karna hai?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ query: userMsg })
      });

      if (!res.ok) {
        throw new Error(`HTTP Status ${res.status}`);
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'himo', text: data.response || data.reply || 'No response data.' }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'himo', text: `Connection Error: ${err.message}. Please check connection.` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#020617', color: '#f8fafc', fontFamily: 'sans-serif' }}>
      <header style={{ padding: '16px', borderBottom: '1px solid #1e293b', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '36px', height: '36px', backgroundColor: '#4f46e5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>H</div>
        <div>
          <h1 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>Himo AI</h1>
          <span style={{ fontSize: '12px', color: '#34d399' }}>● Online & Ready</span>
        </div>
      </header>

      <main style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '85%',
              padding: '12px 16px',
              borderRadius: '16px',
              backgroundColor: m.sender === 'user' ? '#4f46e5' : '#0f172a',
              border: m.sender === 'user' ? 'none' : '1px solid #1e293b',
              fontSize: '14px',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '12px 16px', borderRadius: '16px', backgroundColor: '#0f172a', border: '1px solid #1e293b', fontSize: '14px', color: '#94a3b8', fontStyle: 'italic' }}>
              Himo search kar raha hai...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>

      <footer style={{ padding: '12px', borderTop: '1px solid #1e293b', backgroundColor: '#0f172a' }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Himo anything..."
            style={{
              flex: 1,
              padding: '12px 16px',
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '12px 20px',
              backgroundColor: '#4f46e5',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}
