import { getPersonality } from "../personality/index.js"
import {
  getMemory,
  saveMemory,
} from "../memory/index.js"
import {
  HimoModel,
  HimoTrainer,
} from "../model/core/index.js"

const model =
  new HimoModel()

let trained = false

function ensureTraining() {
  if (trained) return

  const trainer =
    new HimoTrainer(model)

  trainer.train(
    5,
    0.003
  )

  trained = true
}

export async function think(
  message,
  userId = "anonymous",
  mode = "chat"
) {
  const input =
    String(message || "").trim()

  if (!input) {
    return "Haan, bolo. Main sun raha hoon."
  }

  ensureTraining()

  const personality =
    getPersonality()

  const memory =
    getMemory(userId)

  const history =
    Array.isArray(memory)
      ? memory
          .slice(-6)
          .map(
            item =>
              `${item.role}: ${item.content}`
          )
          .join("\n")
      : ""

  const prompt = [
    `You are ${personality.name}, a helpful AI assistant.`,
    `Mode: ${mode}.`,
    history,
    `user: ${input}`,
    `assistant:`,
  ]
    .filter(Boolean)
    .join("\n")

  let reply =
    model.generate(
      prompt,
      {
        maxTokens: 80,
        temperature: 0.7,
      }
    )

  reply =
    reply
      .replace(
        /^.*assistant:\s*/i,
        ""
      )
      .trim()

  if (!reply) {
    reply =
      "Main abhi is question ko process kar raha hoon."
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

  return reply
}

export function modelInfo() {
  return model.info()
}
