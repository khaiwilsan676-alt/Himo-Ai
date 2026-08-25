import { SelfAttention } from "./selfAttention.js"
import { FeedForward } from "./feedForward.js"
import { LayerNorm } from "./layerNorm.js"

export class TransformerBlock {
  constructor(
    dimension,
    hiddenSize
  ) {
    this.attention =
      new SelfAttention(
        dimension
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

  add(a, b) {
    const output =
      new Float32Array(a.length)

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
    const attention =
      this.attention.forward(
        sequence
      )

    const first = []

    for (
      let i = 0;
      i < sequence.length;
      i++
    ) {
      first.push(
        this.norm1.forward(
          this.add(
            sequence[i],
            attention[i]
          )
        )
      )
    }

    return first.map(token =>
      this.norm2.forward(
        this.add(
          token,
          this.feedForward.forward(
            token
          )
        )
      )
    )
  }
}
