export const modes = [
  { id: "chat", label: "Chat", icon: "✦", description: "Ask anything" },
  { id: "code", label: "Code", icon: "</>", description: "Build and debug" },
  { id: "image", label: "Image", icon: "▧", description: "Create visuals" },
  { id: "video", label: "Video", icon: "▶", description: "Bring ideas to life" }
]

export const examples = [
  "Explain quantum computing simply",
  "Write a landing page in React",
  "Create a cinematic product shot",
  "Make a 10-second travel video"
]

export const recentConversations = [
  "Ideas for a new startup",
  "Refactor auth middleware",
  "Tokyo travel itinerary"
]

export function getMode(id) {
  return modes.find((mode) => mode.id === id) || modes[0]
}

export function isCreatorMode(id) {
  return id === "image" || id === "video"
}

export function getPlaceholder(mode) {
  return isCreatorMode(mode.id)
    ? `Describe the ${mode.id} you want to create...`
    : `Message Himo ${mode.label}...`
}
