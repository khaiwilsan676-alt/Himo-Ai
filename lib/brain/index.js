import { getPersonality } from "../personality/index.js"
import { getMemory, saveMemory } from "../memory/index.js"

function generateReply(input, memory, personality, mode) {
  const text = input.toLowerCase()

  if (
    text.includes("hello") ||
    text.includes("hi") ||
    text.includes("hey") ||
    text.includes("salam")
  ) {
    return "Hey! 👋 Main Himo hoon. Bolo, kya karna hai?"
  }

  if (text.includes("tumhara naam") || text.includes("your name")) {
    return "Mera naam Himo hai. 🤖"
  }

  if (
    text.includes("kaise ho") ||
    text.includes("how are you")
  ) {
    return "Main bilkul ready hoon 😄 Bolo kya karna hai?"
  }

  if (
    text.includes("thank") ||
    text.includes("shukriya")
  ) {
    return "You're welcome bhai ❤️"
  }

  if (
    text.includes("who are you") ||
    text.includes("tum kon ho") ||
    text.includes("tum kaun ho")
  ) {
    return "Main Himo hoon — tumhara AI assistant. Main tumhari baat samajhne, yaad rakhne aur help karne ke liye bana hoon."
  }

  if (text.endsWith("?")) {
    return `Achha sawaal hai. Tumne poocha: "${input}" — main isko samajhkar tumhe best possible answer dene ki koshish karunga.`
  }

  return `Samajh gaya. Tum keh rahe ho: "${input}". Bolo, iske saath kya karna hai?`
}

export async function think(message, userId = "anonymous", mode = "chat") {
  const input = String(message || "").trim()

  if (!input) {
    return "Haan, bolo. Main sun raha hoon."
  }

  const personality = getPersonality()
  const memory = getMemory(userId)

  const reply = generateReply(
    input,
    memory,
    personality,
    mode
  )

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
