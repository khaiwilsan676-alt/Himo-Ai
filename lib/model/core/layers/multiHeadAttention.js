import {
  random,
  softmax,
} from "../ops/math.js"

export class MultiHeadAttention {
  constructor(
    dimension,
    heads = 4
  ) {
    if (dimension % heads !== 0) {
      throw new Error(
        "Embedding dimension must be divisible by number of heads"
      )
    }

    this.dimension = dimension
    this.heads = heads
    this.headDimension =
      dimension / heads

    this.wq =
      random(dimension * dimension)

    this.wk =
      random(dimension * dimension)

    this.wv =
      random(dimension * dimension)

    this.wo =
      random(dimension * dimension)
  }

  project(input, weights) {
    const output =
      new Float32Array(
        this.dimension
      )

    for (
      let j = 0;
      j < this.dimension;
      j++
    ) {
      let value = 0

      for (
        let i = 0;
        i < this.dimension;
        i++
      ) {
        value +=
          input[i] *
          weights[
            i * this.dimension + j
          ]
      }

      output[j] = value
    }

    return output
  }

  forward(sequence) {
    if (!sequence.length) {
      return []
    }

    const queries =
      sequence.map(x =>
        this.project(x, this.wq)
      )

    const keys =
      sequence.map(x =>
        this.project(x, this.wk)
      )

    const values =
      sequence.map(x =>
        this.project(x, this.wv)
      )

    const result = []

    for (
      let position = 0;
      position < sequence.length;
      position++
    ) {
      const combined =
        new Float32Array(
          this.dimension
        )

      for (
        let head = 0;
        head < this.heads;
        head++
      ) {
        const start =
          head * this.headDimension

        const end =
          start + this.headDimension

        const scores = []

        /*
         * Causal attention:
         * current token can only see
         * itself and previous tokens.
         */
        for (
          let keyPosition = 0;
          keyPosition <= position;
          keyPosition++
        ) {
          let score = 0

          for (
            let d = start;
            d < end;
            d++
          ) {
            score +=
              queries[position][d] *
              keys[keyPosition][d]
          }

          scores.push(
            score /
              Math.sqrt(
                this.headDimension
              )
          )
        }

        const probabilities =
          softmax(
            new Float32Array(scores)
          )

        for (
          let k = 0;
          k < probabilities.length;
          k++
        ) {
          const keyPosition =
            k

          for (
            let d = start;
            d < end;
            d++
          ) {
            combined[d] +=
              probabilities[k] *
              values[keyPosition][d]
          }
        }
      }

      result.push(
        this.project(
          combined,
          this.wo
        )
      )
    }

    return result
  }
}
