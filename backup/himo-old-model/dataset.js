import { addText } from "./vocabulary"

const STORAGE_KEY = "HimoTrainingData"

function getStorage() {
  if (typeof window === "undefined") return null
  return window.localStorage
}

function load() {
  const storage = getStorage()

  if (!storage) return []

  try {
    return JSON.parse(
      storage.getItem(STORAGE_KEY) || "[]"
    )
  } catch {
    return []
  }
}

function save(data) {
  const storage = getStorage()

  if (storage) {
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    )
  }
}

export function addExample(input, output) {
  if (!input || !output) return null

  const inputIds = addText(input)
  const outputIds = addText(output)

  if (!inputIds.length || !outputIds.length) {
    return null
  }

  const data = load()

  const example = {
    input: String(input),
    output: String(output),
    inputIds,
    outputIds,
    createdAt: Date.now(),
  }

  data.push(example)

  // Keep the local dataset manageable.
  const limited = data.slice(-5000)

  save(limited)

  return example
}

export function getExamples() {
  return load()
}

export function getExampleCount() {
  return load().length
}

export function getRandomExamples(amount = 10) {
  const data = load()

  if (!data.length) return []

  const shuffled = [...data]

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))

    ;[shuffled[i], shuffled[j]] =
      [shuffled[j], shuffled[i]]
  }

  return shuffled.slice(0, amount)
}

export function resetDataset() {
  const storage = getStorage()

  if (storage) {
    storage.removeItem(STORAGE_KEY)
  }
}
