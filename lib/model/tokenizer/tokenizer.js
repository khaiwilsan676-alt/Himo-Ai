const SPECIAL = {
  PAD: 0,
  UNK: 1,
  BOS: 2,
  EOS: 3,
}

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s.,!?'"_-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export function tokenize(text, vocabulary = {}) {
  const normalized = normalize(text)

  if (!normalized) {
    return [SPECIAL.BOS, SPECIAL.EOS]
  }

  const words = normalized.split(" ")

  return [
    SPECIAL.BOS,
    ...words.map(
      word => vocabulary[word] ?? SPECIAL.UNK
    ),
    SPECIAL.EOS,
  ]
}

export function detokenize(tokens, reverseVocabulary = {}) {
  return tokens
    .filter(
      token =>
        token !== SPECIAL.PAD &&
        token !== SPECIAL.BOS &&
        token !== SPECIAL.EOS
    )
    .map(
      token => reverseVocabulary[token] ?? "<unk>"
    )
    .join(" ")
}

export function specialTokens() {
  return { ...SPECIAL }
}

export function normalizeText(text) {
  return normalize(text)
}
