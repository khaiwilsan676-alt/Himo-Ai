const SPECIAL = {
  PAD: 0,
  BOS: 1,
  EOS: 2,
  UNK: 3,
}

const words = new Map()
const reverse = new Map()

let nextId = 4

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}'_?.!,+\-*/=:#()[\]{}]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function addWord(word) {
  if (words.has(word)) {
    return words.get(word)
  }

  if (nextId >= 4096) {
    return SPECIAL.UNK
  }

  const id = nextId++

  words.set(word, id)
  reverse.set(id, word)

  return id
}

export function encode(text) {
  const normalized = normalize(text)

  if (!normalized) {
    return [
      SPECIAL.BOS,
      SPECIAL.EOS,
    ]
  }

  const result = [SPECIAL.BOS]

  for (const word of normalized.split(" ")) {
    result.push(addWord(word))
  }

  result.push(SPECIAL.EOS)

  return result
}

export function decode(tokens) {
  return tokens
    .filter(
      token =>
        token !== SPECIAL.PAD &&
        token !== SPECIAL.BOS &&
        token !== SPECIAL.EOS
    )
    .map(
      token =>
        reverse.get(token) || "<unk>"
    )
    .join(" ")
}

export function vocabularySize() {
  return nextId
}

export function specialTokens() {
  return { ...SPECIAL }
}

export function resetTokenizer() {
  words.clear()
  reverse.clear()
  nextId = 4
}
