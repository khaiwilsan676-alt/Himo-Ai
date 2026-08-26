import {
  encode,
} from "./tokenizer/index.js"

import {
  HimoModel,
} from "./himoModel.js"

function softmax(values) {
  let max = -Infinity

  for (const value of values) {
    if (value > max) max = value
  }

  const result =
    new Float32Array(values.length)

  let sum = 0

  for (
    let i = 0;
    i < values.length;
    i++
  ) {
    result[i] =
      Math.exp(values[i] - max)

    sum += result[i]
  }

  if (sum > 0) {
    for (
      let i = 0;
      i < result.length;
      i++
    ) {
      result[i] /= sum
    }
  }

  return result
}

function argmax(values) {
  let index = 0

  for (
    let i = 1;
    i < values.length;
    i++
  ) {
    if (
      values[i] > values[index]
    ) {
      index = i
    }
  }

  return index
}

export function crossEntropy(
  logits,
  target
) {
  const probabilities =
    softmax(logits)

  const p =
    Math.max(
      1e-8,
      probabilities[target] || 0
    )

  return {
    loss: -Math.log(p),
    probabilities,
    prediction:
      argmax(probabilities),
  }
}

export function makeSequencePairs(
  text
) {
  const tokens =
    encode(text)

  const pairs = []

  for (
    let i = 0;
    i < tokens.length - 1;
    i++
  ) {
    pairs.push({
      tokens: tokens.slice(
        0,
        i + 1
      ),
      target:
        tokens[i + 1],
    })
  }

  return pairs
}

export class TrainingEngine {
  constructor(config = {}) {
    this.model =
      config.model ||
      new HimoModel(config)

    this.learningRate =
      config.learningRate ?? 0.001

    this.steps = 0
    this.totalLoss = 0
  }

  updateLMHead(
    hidden,
    probabilities,
    target
  ) {
    const head =
      this.model.lmHead

    for (
      let j = 0;
      j < head.vocabSize;
      j++
    ) {
      const targetValue =
        j === target ? 1 : 0

      const error =
        probabilities[j] -
        targetValue

      head.bias[j] -=
        this.learningRate *
        error

      for (
        let i = 0;
        i < head.dimension;
        i++
      ) {
        const index =
          i * head.vocabSize + j

        head.weights[index] -=
          this.learningRate *
          error *
          hidden[i]
      }
    }
  }

  trainText(text) {
    const pairs =
      makeSequencePairs(text)

    if (!pairs.length) {
      return {
        loss: 0,
        steps: this.steps,
      }
    }

    let totalLoss = 0

    for (const pair of pairs) {
      const result =
        this.model.forward(text)

      const current =
        crossEntropy(
          result.logits,
          pair.target
        )

      const hidden =
        result.hidden[
          result.hidden.length - 1
        ]

      this.updateLMHead(
        hidden,
        current.probabilities,
        pair.target
      )

      totalLoss += current.loss
      this.steps += 1
    }

    const loss =
      totalLoss / pairs.length

    this.totalLoss += loss

    return {
      loss,
      steps: this.steps,
    }
  }

  train(
    dataset = [],
    epochs = 1
  ) {
    let result = {
      loss: 0,
      steps: this.steps,
    }

    for (
      let epoch = 0;
      epoch < epochs;
      epoch++
    ) {
      for (const text of dataset) {
        result =
          this.trainText(text)
      }
    }

    return result
  }

  info() {
    return {
      steps: this.steps,
      totalLoss:
        this.totalLoss,
      learningRate:
        this.learningRate,
    }
  }
}
