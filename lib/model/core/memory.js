const MEMORY_KEY =
  "HimoConversationMemory"

const MAX_MESSAGES = 100

function storage() {
  if (typeof window === "undefined") {
    return null
  }

  return window.localStorage
}

function load() {
  const store = storage()

  if (!store) return []

  try {
    const data =
      JSON.parse(
        store.getItem(
          MEMORY_KEY
        ) || "[]"
      )

    return Array.isArray(data)
      ? data
      : []
  } catch {
    return []
  }
}

function save(messages) {
  const store = storage()

  if (!store) return false

  try {
    store.setItem(
      MEMORY_KEY,
      JSON.stringify(
        messages.slice(
          -MAX_MESSAGES
        )
      )
    )

    return true
  } catch {
    return false
  }
}

export function remember(
  role,
  content
) {
  if (!content) return false

  const messages = load()

  messages.push({
    role,
    content: String(content),
    timestamp: Date.now(),
  })

  return save(messages)
}

export function getMemory(
  limit = 20
) {
  return load().slice(-limit)
}

export function getMemoryPrompt(
  limit = 20
) {
  return getMemory(limit)
    .map(
      message =>
        `${message.role}: ${message.content}`
    )
    .join("\n")
}

export function clearMemory() {
  const store = storage()

  if (store) {
    store.removeItem(
      MEMORY_KEY
    )
  }
}

export function memorySize() {
  return load().length
}
