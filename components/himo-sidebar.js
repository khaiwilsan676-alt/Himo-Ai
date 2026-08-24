"use client"

import { recentConversations, modes } from "./himo-data"

export function Brand({ mobile = false }) {
  return (
    <div className={mobile ? "mobile-brand" : "brand"}>
      <span className="brand-mark">H</span>
      <span>himo<span className="brand-dot">.</span>ai</span>
    </div>
  )
}

export function Sidebar({ mode, onModeChange, onNewConversation }) {
  return (
    <aside className="sidebar">
      <Brand />
      <button className="new-chat" onClick={onNewConversation}>
        <span>＋</span> New conversation <kbd>⌘ K</kbd>
      </button>
      <div className="side-section">
        <p className="eyebrow">Workspace</p>
        {modes.map((item) => (
          <button key={item.id} className={`side-mode ${mode === item.id ? "selected" : ""}`} onClick={() => onModeChange(item.id)}>
            <span className="mode-icon">{item.icon}</span>
            <span><strong>{item.label}</strong><small>{item.description}</small></span>
          </button>
        ))}
      </div>
      <div className="side-section recent">
        <p className="eyebrow">Recent</p>
        {recentConversations.map((conversation) => <button key={conversation}>{conversation}</button>)}
      </div>
      <div className="sidebar-bottom">
        <button className="utility"><span>◌</span> Settings</button>
        <div className="profile"><span className="avatar">KS</span><span><strong>Khaiwilsan</strong><small>Personal plan</small></span><span className="more">···</span></div>
      </div>
    </aside>
  )
}
