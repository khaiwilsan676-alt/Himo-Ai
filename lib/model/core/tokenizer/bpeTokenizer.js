const SPECIAL = {
  PAD: 0,
  BOS: 1,
  EOS: 2,
  UNK: 3,
}

const BASE_CHARS =
  "abcdefghijklmnopqrstuvwxyz0123456789"

const tokenToId = new Map()
const idToToken = new Map()

let nextId = 4

for (const char of BASE_CHARS) {
  tokenToId.set(char, nextId)
  idToToken.set(nextId, char)
  nextId++
}

function normalize(text) {
  return String(text ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
}

function addToken(token) {
  if (!token) return SPECIAL.UNK

  const existing =
    tokenToId.get(token)

  if (existing !== undefined) {
    return existing
  }

  if (nextId >= 4096) {
    return SPECIAL.UNK
  }

  const id = nextId++

  tokenToId.set(token, id)
  idToToken.set(id, token)

  return id
}

function splitWord(word) {
  if (!word) return []

  const pieces = []

  /*
   * Character/subword fallback.
   * This means Himo can process a word
   * even when the complete word isn't
   * present in its vocabulary.
   */
  for (const char of word) {
    pieces.push(char)
  }

  return pieces
}

export function encode(text) {
  const normalized =
    normalize(text)

  if (!normalized) {
    return [
      SPECIAL.BOS,
      SPECIAL.EOS,
    ]
  }

  const tokens = [
    SPECIAL.BOS,
  ]

  for (
    const word of normalized.split(" ")
  ) {
    const pieces =
      splitWord(word)

    for (const piece of pieces) {
      tokens.push(
        addToken(piece)
      )
    }

    /*
     * Explicit word boundary.
     */
    tokens.push(
      addToken("<space>")
    )
  }

  tokens.push(
    SPECIAL.EOS
  )

  return tokens
}

export function decode(ids) {
  let output = ""

  for (const id of ids) {
    if (
      id === SPECIAL.PAD ||
      id === SPECIAL.BOS ||
      id === SPECIAL.EOS
    ) {
      continue
    }

    const token =
      idToToken.get(id)

    if (!token) {
      continue
    }

    if (token === "<space>") {
      output += " "
    } else {
      output += token
    }
  }

  return output.trim()
}

export function vocabularySize() {
  return nextId
}

export function specialTokens() {
  return {
    ...SPECIAL,
  }
}

export function getVocabulary() {
  return {
    tokenToId:
      Object.fromEntries(tokenToId),
    idToToken:
      Object.fromEntries(idToToken),
    size: nextId,
  }
}

export function resetVocabulary() {
  tokenToId.clear()
  idToToken.clear()

  nextId = 4

  for (const char of BASE_CHARS) {
    tokenToId.set(char, nextId)
    idToToken.set(nextId, char)
    nextId++
  }
}
