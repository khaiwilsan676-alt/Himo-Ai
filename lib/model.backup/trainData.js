import { addExample } from "./data/dataset"
import { train } from "./train"

const DATA = [
  ["hi", "Hi! How are you?"],
  ["hello", "Hello! Nice to talk to you."],
  ["hey", "Hey! What's up?"],
  ["how are you", "I'm doing good. How are you?"],
  ["what is your name", "I'm Himo."],
  ["who are you", "I'm Himo, your AI."],
  ["good morning", "Good morning! Hope you have a great day."],
  ["good night", "Good night! Sleep well."],
  ["thank you", "You're welcome!"],
  ["thanks", "You're welcome."],
  ["bye", "Bye! Talk to you later."],
  ["what are you doing", "I'm here talking with you."],
  ["i am happy", "That's great! I'm happy for you."],
  ["i am sad", "I'm sorry you're feeling sad. I'm here with you."],
  ["tell me something", "Sure! What would you like to talk about?"],
]

export function seedTrainingData() {
  let added = 0

  for (const [input, output] of DATA) {
    const result = addExample(
      input,
      output
    )

    if (result) {
      added++
    }
  }

  const training = train(
    20,
    0.03
  )

  return {
    added,
    ...training,
  }
}
