import { specialTokens, normalizeText } from "../tokenizer/tokenizer"

const STORAGE_KEY = "HimoVocabulary"

function getStorage() {
  if (typeof window === "undefined") return null
  return window.localStorage
}

function load() {
  const storage = getStorage()

  if (!storage) {
    return {
      wordToId: {},
      idToWord: {},
      nextId: 4,
    }
  }

  try {
    const saved = JSON.parse(
      storage.getItem(STORAGE_KEY) || "null"
    )

    if (saved) return saved
  } catch {}

  return {
    wordToId: {},
    idToWord: {},
    nextId: 4,
  }
}

function save(vocab) {
  const storage = getStorage()

  if (storage) {
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify(vocab)
    )
  }
}

export function getVocabulary() {
  return load()
}

export function addWord(word) {
  const clean = normalizeText(word)

  if (!clean || clean.includes(" ")) {
    return null
  }

  const vocab = load()

  if (vocab.wordToId[clean]) {
    return vocab.wordToId[clean]
  }

  const id = vocab.nextId++

  vocab.wordToId[clean] = id
  vocab.idToWord[id] = clean

  save(vocab)

  return id
}

export function addText(text) {
  const normalized = normalizeText(text)

  if (!normalized) return []

  const words = normalized.split(" ")
  const ids = []

  for (const word of words) {
    const id = addWord(word)

    if (id !== null) {
      ids.push(id)
    }
  }

  return ids
}

export function wordToId(word) {
  const vocab = load()

  return (
    vocab.wordToId[normalizeText(word)] ??
    specialTokens().UNK
  )
}

export function idToWord(id) {
  const vocab = load()

  return vocab.idToWord[id] ?? "<unk>"
}

export function vocabularySize() {
  return load().nextId
}

export function resetVocabulary() {
  const storage = getStorage()

  if (storage) {
    storage.removeItem(STORAGE_KEY)
  }
}
