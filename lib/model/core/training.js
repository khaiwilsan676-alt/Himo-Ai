import { encode } from "./tokenizer/basicTokenizer.js"

export function crossEntropy(probabilities, target) {
  const p = Math.max(
    1e-8,
    probabilities[target] || 0
  )

  return -Math.log(p)
}

export function makeTrainingPairs(text) {
  const tokens = encode(text)
  const pairs = []

  for (let i = 0; i < tokens.length - 1; i++) {
    pairs.push({
      input: tokens.slice(
        0,
        i + 1
      ),
      target: tokens[i + 1],
    })
  }

  return pairs
}

export function trainingStats(losses) {
  if (!losses.length) {
    return {
      steps: 0,
      loss: 0,
    }
  }

  const loss =
    losses.reduce(
      (sum, value) => sum + value,
      0
    ) / losses.length

  return {
    steps: losses.length,
    loss,
  }
}
