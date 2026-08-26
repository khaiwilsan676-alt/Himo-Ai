import { getPersonality } from "../personality/index.js"
import { getMemory, saveMemory } from "../memory/index.js"

export async function think(message, userId = "anonymous", mode = "chat") {
  const input = String(message || "").trim()

  if (!input) {
    return "Haan, bolo. Main sun raha hoon."
  }

  const personality = getPersonality()
  const memory = getMemory(userId)

  const reply = `${personality.name}: Tumne kaha "${input}". Main tumhari baat samajhne ki koshish kar raha hoon.`

  saveMemory(userId, {
    role: "user",
    content: input,
    mode,
  })

  saveMemory(userId, {
    role: "assistant",
    content: reply,
    mode,
  })

  return reply
}
