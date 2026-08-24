"use client";

import { useState } from "react";

const modes = [
  { id: "chat", label: "Chat", icon: "✦", description: "Ask anything" },
  { id: "code", label: "Code", icon: "</>", description: "Build and debug" },
  { id: "image", label: "Image", icon: "▧", description: "Create visuals" },
  { id: "video", label: "Video", icon: "▶", description: "Bring ideas to life" }
];

const examples = [
  "Explain quantum computing simply",
  "Write a landing page in React",
  "Create a cinematic product shot",
  "Make a 10-second travel video"
];

export default function HimoAI() {
  const [mode, setMode] = useState("chat");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(value = message) {
    if (!value.trim() || loading) return;

    const prompt = value.trim();

    setMessage("");

    setMessages((current) => [
      ...current,
      { role: "user", content: prompt }
    ]);

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: prompt
        })
      });

      const data = await res.json();

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: res.ok
            ? data.reply
            : data.error || "Something went wrong"
        }
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "Unable to connect right now. Please try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  const active = modes.find(
    (item) => item.id === mode
  );

  const isCreator =
    mode === "image" || mode === "video";

  return (
    <main className="app-shell">

      <aside className="sidebar">

        <div className="brand">
          <span className="brand-mark">H</span>

          <span>
            himo<span className="brand-dot">.</span>ai
          </span>
        </div>

        <button
          className="new-chat"
          onClick={() => setMessages([])}
        >
          <span>＋</span>
          New conversation
          <kbd>⌘ K</kbd>
        </button>

        <div className="side-section">

          <p className="eyebrow">
            Workspace
          </p>

          {modes.map((item) => (
            <button
              key={item.id}
              className={`side-mode ${
                mode === item.id ? "selected" : ""
              }`}
              onClick={() => setMode(item.id)}
            >
              <span className="mode-icon">
                {item.icon}
              </span>

              <span>
                <strong>{item.label}</strong>
                <small>{item.description}</small>
              </span>
            </button>
          ))}

        </div>

        <div className="side-section recent">

          <p className="eyebrow">
            Recent
          </p>

          <button>
            Ideas for a new startup
          </button>

          <button>
            Refactor auth middleware
          </button>

          <button>
            Tokyo travel itinerary
          </button>

        </div>

        <div className="sidebar-bottom">

          <button className="utility">
            <span>◌</span>
            Settings
          </button>

          <div className="profile">

            <span className="avatar">
              KS
            </span>

            <span>
              <strong>Khaiwilsan</strong>
              <small>Personal plan</small>
            </span>

            <span className="more">
              ···
            </span>

          </div>

        </div>

      </aside>

      <section className="workspace">

        <header className="topbar">

          <div className="mobile-brand">

            <span className="brand-mark">
              H
            </span>

            himo<span className="brand-dot">.</span>ai

          </div>

          <div className="top-actions">

            <button
              className="icon-button"
              aria-label="Search"
            >
              ⌕
            </button>

            <button className="upgrade">
              Upgrade <span>↗</span>
            </button>

          </div>

        </header>

        <div
          className={`canvas ${
            messages.length ? "has-messages" : ""
          }`}
        >

          {!messages.length ? (

            <div className="welcome">

              <div className="welcome-orbit">
                <span>H</span>
              </div>

              <p className="kicker">
                Your creative intelligence
              </p>

              <h1>
                What will <em>create</em> today?
              </h1>

              <p className="subtitle">
                Chat, code, and bring your ideas
                to life with Himo AI.
              </p>

              <div className="mode-tabs">

                {modes.map((item) => (

                  <button
                    key={item.id}
                    className={
                      mode === item.id
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setMode(item.id)
                    }
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </button>

                ))}

              </div>

              <div className="composer-wrap">

                <div className="composer">

                  <textarea
                    value={message}
                    onChange={(event) =>
                      setMessage(event.target.value)
                    }
                    onKeyDown={(event) => {

                      if (
                        event.key === "Enter" &&
                        !event.shiftKey &&
                        !event.nativeEvent
                          .isComposing &&
                        event.keyCode !== 229
                      ) {
                        event.preventDefault();
                        sendMessage();
                      }

                    }}
                    placeholder={
                      isCreator
                        ? `Describe the ${mode} you want to create...`
                        : `Message Himo ${
                            active?.label || "AI"
                          }...`
                    }
                    rows={2}
                  />

                  <div className="composer-footer">

                    <div className="composer-tools">

                      <button
                        aria-label="Attach file"
                      >
                        ＋
                      </button>

                      <button className="tool-label">
                        Attach
                      </button>

                      <span className="divider" />

                      <button className="tool-label">
                        {active?.icon}{" "}
                        {active?.label}
                      </button>

                    </div>

                    <button
                      className="send-button"
                      disabled={
                        !message.trim() ||
                        loading
                      }
                      onClick={() =>
                        sendMessage()
                      }
                    >
                      {loading ? "…" : "↑"}
                    </button>

                  </div>

                </div>

                <p className="hint">
                  Himo can make mistakes. Check
                  important information.
                </p>

              </div>

            </div>

          ) : (

            <div className="conversation">

              {messages.map((item, index) => (

                <div
                  className={`message ${item.role}`}
                  key={`${item.role}-${index}`}
                >

                  <span className="message-avatar">
                    {item.role === "user"
                      ? "KS"
                      : "H"}
                  </span>

                  <div>

                    <p className="message-label">
                      {item.role === "user"
                        ? "You"
                        : "Himo AI"}
                    </p>

                    <div className="message-content">
                      {item.content}
                    </div>

                  </div>

                </div>

              ))}

              {loading && (

                <div className="message assistant">

                  <span className="message-avatar">
                    H
                  </span>

                  <div>

                    <p className="message-label">
                      Himo AI
                    </p>

                    <div className="typing">
                      <i />
                      <i />
                      <i />
                    </div>

                  </div>

                </div>

              )}

              <div className="composer conversation-composer">

                <textarea
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  onKeyDown={(event) => {

                    if (
                      event.key === "Enter" &&
                      !event.shiftKey &&
                      !event.nativeEvent
                        .isComposing &&
                      event.keyCode !== 229
                    ) {
                      event.preventDefault();
                      sendMessage();
                    }

                  }}
                  placeholder="Continue the conversation..."
                  rows={1}
                />

                <button
                  className="send-button"
                  disabled={
                    !message.trim() ||
                    loading
                  }
                  onClick={() =>
                    sendMessage()
                  }
                >
                  ↑
                </button>

              </div>

            </div>

          )}

        </div>

        <footer className="footer-note">

          <span>Himo AI</span>

          <span>
            Built for curious minds ·{" "}
            {new Date().getFullYear()}
          </span>

        </footer>

      </section>

    </main>
  );
      }
