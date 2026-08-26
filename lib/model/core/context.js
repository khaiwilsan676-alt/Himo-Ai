const MAX_MESSAGES = 20
const MAX_CHARS = 12000

export class ConversationContext {
  constructor(options = {}) {
    this.maxMessages =
      options.maxMessages ??
      MAX_MESSAGES

    this.maxChars =
      options.maxChars ??
      MAX_CHARS

    this.messages = []
  }

  addUser(message) {
    this.add("user", message)
  }

  addAssistant(message) {
    this.add("assistant", message)
  }

  add(role, content) {
    if (!content) return

    this.messages.push({
      role,
      content: String(content),
      time: Date.now(),
    })

    if (
      this.messages.length >
      this.maxMessages
    ) {
      this.messages =
        this.messages.slice(
          -this.maxMessages
        )
    }
  }

  getMessages() {
    return [...this.messages]
  }

  buildPrompt(currentMessage = "") {
    const lines = []

    for (const message of this.messages) {
      lines.push(
        `${message.role}: ${message.content}`
      )
    }

    if (currentMessage) {
      lines.push(
        `user: ${currentMessage}`
      )
    }

    let prompt =
      lines.join("\n")

    if (
      prompt.length >
      this.maxChars
    ) {
      prompt =
        prompt.slice(
          -this.maxChars
        )
    }

    return prompt
  }

  clear() {
    this.messages = []
  }

  size() {
    return this.messages.length
  }
}

export function createContext(
  options = {}
) {
  return new ConversationContext(
    options
  )
}
