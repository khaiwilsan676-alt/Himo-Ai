import {
  MultiHeadAttention,
} from "./multiHeadAttention.js"

import {
  FeedForward,
} from "./feedForward.js"

import {
  LayerNorm,
} from "./layerNorm.js"

export class TransformerBlock {
  constructor(
    dimension,
    hiddenSize,
    heads = 4
  ) {
    this.attention =
      new MultiHeadAttention(
        dimension,
        heads
      )

    this.norm1 =
      new LayerNorm(
        dimension
      )

    this.feedForward =
      new FeedForward(
        dimension,
        hiddenSize
      )

    this.norm2 =
      new LayerNorm(
        dimension
      )
  }

  residual(a, b) {
    const output =
      new Float32Array(
        a.length
      )

    for (
      let i = 0;
      i < a.length;
      i++
    ) {
      output[i] =
        a[i] + b[i]
    }

    return output
  }

  forward(sequence) {
    if (!sequence.length) {
      return []
    }

    const attention =
      this.attention.forward(
        sequence
      )

    const normalizedAttention = []

    for (
      let i = 0;
      i < sequence.length;
      i++
    ) {
      normalizedAttention.push(
        this.norm1.forward(
          this.residual(
            sequence[i],
            attention[i]
          )
        )
      )
    }

    const output = []

    for (
      let i = 0;
      i < normalizedAttention.length;
      i++
    ) {
      const feed =
        this.feedForward.forward(
          normalizedAttention[i]
        )

      output.push(
        this.norm2.forward(
          this.residual(
            normalizedAttention[i],
            feed
          )
        )
      )
    }

    return output
  }
}
