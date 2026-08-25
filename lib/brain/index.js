import { getPersonality } from "../personality/index.js"
import { getMemory, saveMemory } from "../memory/index.js"
import { generateResponse } from "../model/runtime/generator.js"

export async function think(
  message,
  userId = "anonymous",
  mode = "chat"
) {
  const input = String(message || "").trim()

  if (!input) {
    return "Haan, bolo. Main sun raha hoon."
  }

  const personality = getPersonality()
  const history = getMemory(userId) || []

  const context = history
    .slice(-6)
    .map(item => `${item.role}: ${item.content}`)
    .join("\n")

  const prompt = [
    `You are ${personality.name}.`,
    "You are a helpful, natural AI assistant.",
    `Mode: ${mode}`,
    context,
    `user: ${input}`,
    "assistant:"
  ]
    .filter(Boolean)
    .join("\n")

  let reply = generateResponse(prompt)

  if (!reply || reply.trim().length < 2) {
    reply = "Haan, samajh raha hoon. Thoda aur batao."
  }

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

  return reply.trim()
}
