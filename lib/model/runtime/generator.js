import {
  addText,
  wordToId,
  idToWord,
  vocabularySize,
} from "../data/vocabulary"

import {
  predict,
} from "./neuralNetwork"

function makeInput(text, size) {
  const ids = addText(text)

  const vector = new Float32Array(size)

  if (!ids.length) return vector

  for (const id of ids) {
    const index = id % size
    vector[index] += 1
  }

  const scale = 1 / ids.length

  for (let i = 0; i < vector.length; i++) {
    vector[i] *= scale
  }

  return vector
}

export function generate(
  prompt,
  options = {}
) {
  const maxWords =
    options.maxWords || 12

  const temperature =
    options.temperature || 0.8

  const size = Math.max(
    8,
    vocabularySize()
  )

  const input = makeInput(
    prompt,
    size
  )

  const words = []

  for (let i = 0; i < maxWords; i++) {
    const result = predict(
      input,
      size,
      temperature
    )

    const word = idToWord(
      result.index
    )

    if (
      !word ||
      word === "<unk>"
    ) {
      break
    }

    if (
      words.includes(word)
    ) {
      break
    }

    words.push(word)

    const index =
      result.index % input.length

    input[index] += 0.05
  }

  return words.join(" ")
}

export function generateResponse(
  prompt
) {
  const response = generate(
    prompt,
    {
      maxWords: 16,
      temperature: 0.85,
    }
  )

  return response || "I am still learning."
}
