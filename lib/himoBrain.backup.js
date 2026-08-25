import {
  observe,
  inventWord,
  getWord,
  getLearnedWords
} from "@/lib/learningEngine"

function clean(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function extractWords(text) {
  return clean(text)
    .split(" ")
    .filter(Boolean)
}

export async function think(input) {
  const text = clean(input)

  if (!text) {
    return "..."
  }

  // Learn what the human said.
  await observe(text)

  const words = extractWords(text)

  // Try to understand a word that is already
  // present in Himo's learned vocabulary.
  const known = []

  for (const word of words) {
    const memory = await getWord(word)

    if (memory) {
      known.push(memory)
    }
  }

  /*
   * Himo does NOT use a predefined answer.
   *
   * It builds a response from its current
   * learned state.
   */

  if (known.length) {
    const meaningful = known.find(
      item => item.meaning
    )

    if (meaningful) {
      return `${meaningful.word} = ${meaningful.meaning}.`
    }
  }

  // First interaction with an unknown word:
  // create a new candidate from learned patterns.
  const newWord = await inventWord()

  if (!newWord) {
    return "I am learning."
  }

  return `${newWord}`
}

export async function teach(
  word,
  meaning,
  example = ""
) {
  const { teachMeaning } =
    await import("@/lib/learningEngine")

  return teachMeaning(
    word,
    meaning,
    example
  )
}

export async function vocabulary() {
  return getLearnedWords()
}
