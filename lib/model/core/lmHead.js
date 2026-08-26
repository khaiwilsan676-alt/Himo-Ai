import { softmax } from "./ops/math.js"

export class LanguageModelHead {
  constructor(dimension, vocabSize) {
    this.dimension = dimension
    this.vocabSize = vocabSize

    this.weights = new Float32Array(
      dimension * vocabSize
    )

    this.bias = new Float32Array(
      vocabSize
    )

    const scale =
      Math.sqrt(2 / Math.max(1, dimension))

    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i] =
        (Math.random() * 2 - 1) * scale
    }
  }

  forward(hidden) {
    const logits =
      new Float32Array(this.vocabSize)

    for (let j = 0; j < this.vocabSize; j++) {
      let value = this.bias[j]

      for (let i = 0; i < this.dimension; i++) {
        value +=
          hidden[i] *
          this.weights[
            i * this.vocabSize + j
          ]
      }

      logits[j] = value
    }

    return logits
  }

  probabilities(hidden, temperature = 1) {
    const logits =
      this.forward(hidden)

    const scale =
      Math.max(0.05, temperature)

    for (let i = 0; i < logits.length; i++) {
      logits[i] /= scale
    }

    return softmax(logits)
  }
}
