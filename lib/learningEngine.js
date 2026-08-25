const DB_NAME = "HimoLanguageDB"
const DB_VERSION = 2

const STORES = {
  words: "words",
  patterns: "patterns",
  meta: "meta",
}

const ALPHABET = "abcdefghijklmnopqrstuvwxyz"

function browser() {
  return typeof window !== "undefined" &&
    typeof indexedDB !== "undefined"
}

function openDB() {
  return new Promise((resolve, reject) => {
    if (!browser()) {
      reject(new Error("IndexedDB unavailable"))
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = event.target.result

      if (!db.objectStoreNames.contains(STORES.words)) {
        const store = db.createObjectStore(STORES.words, {
          keyPath: "word",
        })

        store.createIndex("count", "count", {
          unique: false,
        })
      }

      if (!db.objectStoreNames.contains(STORES.patterns)) {
        const store = db.createObjectStore(STORES.patterns, {
          keyPath: "pattern",
        })

        store.createIndex("count", "count", {
          unique: false,
        })
      }

      if (!db.objectStoreNames.contains(STORES.meta)) {
        db.createObjectStore(STORES.meta, {
          keyPath: "key",
        })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function getRecord(storeName, key) {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly")
    const request = tx.objectStore(storeName).get(key)

    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
  })
}

async function putRecord(storeName, record) {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite")
    const request = tx.objectStore(storeName).put(record)

    request.onsuccess = () => resolve(record)
    request.onerror = () => reject(request.error)
  })
}

async function getAll(storeName) {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly")
    const request = tx.objectStore(storeName).getAll()

    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
  })
}

function cleanText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function wordsFrom(text) {
  return cleanText(text)
    .split(" ")
    .filter(Boolean)
}

/*
  Learn normal text.
*/
export async function observe(text) {
  if (!browser()) return null

  const words = wordsFrom(text)

  for (const word of words) {
    await learnWord(word)

    for (let i = 0; i < word.length - 1; i++) {
      await learnPattern(word.slice(i, i + 2))
    }

    for (let i = 0; i < word.length - 2; i++) {
      await learnPattern(word.slice(i, i + 3))
    }
  }

  const old = await getRecord(
    STORES.meta,
    "observations"
  )

  await putRecord(STORES.meta, {
    key: "observations",
    value: old ? old.value + 1 : 1,
  })

  return {
    words,
    observations: old ? old.value + 1 : 1,
  }
}

async function learnWord(word) {
  if (!word) return

  const old = await getRecord(
    STORES.words,
    word
  )

  await putRecord(STORES.words, {
    word,
    count: old ? old.count + 1 : 1,
    meaning: old?.meaning || null,
    examples: old?.examples || [],
    invented: old?.invented || false,
    confidence: old?.confidence || 0,
    firstSeen: old?.firstSeen || Date.now(),
    lastSeen: Date.now(),
  })
}

async function learnPattern(pattern) {
  if (!pattern) return

  const old = await getRecord(
    STORES.patterns,
    pattern
  )

  await putRecord(STORES.patterns, {
    pattern,
    count: old ? old.count + 1 : 1,
    firstSeen: old?.firstSeen || Date.now(),
  })
}

/*
  Teach Himo a meaning.

  Example:
  teachMeaning("mavo", "friend", "Mavo is my friend")
*/
export async function teachMeaning(
  word,
  meaning,
  example = ""
) {
  const cleanWord = cleanText(word)
    .split(" ")[0]

  const cleanMeaning = String(
    meaning || ""
  ).trim()

  if (!cleanWord || !cleanMeaning) {
    return null
  }

  const old = await getRecord(
    STORES.words,
    cleanWord
  )

  const examples = old?.examples || []

  if (
    example &&
    !examples.includes(example)
  ) {
    examples.push(example)
  }

  const record = {
    word: cleanWord,
    count: old?.count || 1,
    meaning: cleanMeaning,
    examples: examples.slice(-10),
    invented: true,
    confidence: Math.min(
      100,
      (old?.confidence || 0) + 25
    ),
    firstSeen:
      old?.firstSeen || Date.now(),
    lastSeen: Date.now(),
  }

  await putRecord(
    STORES.words,
    record
  )

  return record
}

/*
  Generate a new word from learned patterns.
*/
export async function inventWord(
  length = null
) {
  if (!browser()) return ""

  const patterns =
    await getAll(STORES.patterns)

  const target =
    length ||
    Math.floor(Math.random() * 4) + 3

  if (!patterns.length) {
    let word = ""

    for (let i = 0; i < target; i++) {
      word += ALPHABET[
        Math.floor(
          Math.random() *
          ALPHABET.length
        )
      ]
    }

    return word
  }

  const sorted = [...patterns]
    .sort((a, b) => b.count - a.count)

  let result = ""

  const first =
    sorted[
      Math.floor(
        Math.random() *
        Math.min(sorted.length, 10)
      )
    ]

  result = first.pattern

  while (result.length < target) {
    const possible = sorted.filter(
      item =>
        item.pattern[0] ===
        result[result.length - 1]
    )

    if (!possible.length) break

    const next =
      possible[
        Math.floor(
          Math.random() *
          possible.length
        )
      ]

    result += next.pattern.slice(-1)
  }

  return result.slice(0, target)
}

/*
  Invent multiple candidate words.
*/
export async function inventWords(
  amount = 5
) {
  const result = []

  for (let i = 0; i < amount; i++) {
    const word = await inventWord()

    if (word && !result.includes(word)) {
      result.push(word)
    }
  }

  return result
}

/*
  Check whether Himo knows a word.
*/
export async function getWord(word) {
  const clean = cleanText(word)
    .split(" ")[0]

  if (!clean) return null

  return getRecord(
    STORES.words,
    clean
  )
}

/*
  Get all vocabulary.
*/
export async function getLearnedWords() {
  const words =
    await getAll(STORES.words)

  return words.sort(
    (a, b) => b.count - a.count
  )
}

/*
  Get learned patterns.
*/
export async function getLearnedPatterns() {
  const patterns =
    await getAll(STORES.patterns)

  return patterns.sort(
    (a, b) => b.count - a.count
  )
}

/*
  Statistics.
*/
export async function getLearningStats() {
  const words =
    await getLearnedWords()

  const patterns =
    await getLearnedPatterns()

  const observations =
    await getRecord(
      STORES.meta,
      "observations"
    )

  return {
    letters: 26,
    learnedWords: words.length,
    learnedPatterns: patterns.length,
    inventedWords: words.filter(
      w => w.invented
    ).length,
    wordsWithMeaning: words.filter(
      w => w.meaning
    ).length,
    observations:
      observations?.value || 0,
  }
}

/*
  Give Himo a direct learning instruction.

  Example:
  "mavo means friend"
  "zena means water"
*/
export async function learnFromSentence(
  sentence
) {
  const text = String(sentence || "")
    .trim()

  const match = text.match(
    /^([a-z]+)\s+(?:means|is|=)\s+(.+)$/i
  )

  if (!match) {
    return null
  }

  return teachMeaning(
    match[1],
    match[2]
  )
}

/*
  Completely reset language memory.
*/
export async function resetLearning() {
  if (!browser()) return

  const db = await openDB()
  db.close()

  await new Promise((resolve, reject) => {
    const request =
      indexedDB.deleteDatabase(DB_NAME)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
    request.onblocked = () => resolve()
  })
}

export function getAlphabet() {
  return ALPHABET.split("")
}
