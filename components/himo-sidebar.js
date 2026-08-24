"use client"

import { brand, user, uiText, recentConversations } from "./himo-data"

export function Brand({ mobile = false }) {
  return (
    <div className={mobile ? "mobile-brand" : "brand"}>
      <span className="brand-mark">{brand.mark}</span>
      <span>{brand.name}<span className="brand-dot">{brand.tld}</span></span>
    </div>
  )
}

export function Sidebar({ onNewConversation }) {
  return (
    <aside className="sidebar">
      <Brand />
      <button className="new-chat" onClick={onNewConversation}>
        <span>＋</span> {uiText.newConversation} <kbd>⌘ K</kbd>
      </button>

      <div className="side-section recent">
        <p className="eyebrow">{uiText.recentHeading}</p>
        {recentConversations.map((conversation, idx) => (
          <button key={idx}>{conversation}</button>
        ))}
      </div>

      <div className="sidebar-bottom">
        <button className="utility"><span>◌</span> {uiText.settings}</button>
        <div className="profile">
          <span className="avatar">{user.avatar}</span>
          <span><strong>{user.name}</strong><small>{user.plan}</small></span>
          <span className="more">···</span>
        </div>
      </div>
    </aside>
  )
}
