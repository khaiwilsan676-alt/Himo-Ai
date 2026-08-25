import {
  random,
  softmax,
} from "../ops/math.js"

export class SelfAttention {
  constructor(dimension) {
    this.dimension = dimension

    this.wq =
      random(
        dimension * dimension
      )

    this.wk =
      random(
        dimension * dimension
      )

    this.wv =
      random(
        dimension * dimension
      )

    this.wo =
      random(
        dimension * dimension
      )
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
    const q = sequence.map(
      x => this.project(x, this.wq)
    )

    const k = sequence.map(
      x => this.project(x, this.wk)
    )

    const v = sequence.map(
      x => this.project(x, this.wv)
    )

    const output = []

    for (
      let i = 0;
      i < sequence.length;
      i++
    ) {
      const scores =
        new Float32Array(i + 1)

      for (
        let j = 0;
        j <= i;
        j++
      ) {
        let score = 0

        for (
          let d = 0;
          d < this.dimension;
          d++
        ) {
          score +=
            q[i][d] *
            k[j][d]
        }

        scores[j] =
          score /
          Math.sqrt(
            this.dimension
          )
      }

      const probability =
        softmax(scores)

      const attended =
        new Float32Array(
          this.dimension
        )

      for (
        let j = 0;
        j <= i;
        j++
      ) {
        for (
          let d = 0;
          d < this.dimension;
          d++
        ) {
          attended[d] +=
            probability[j] *
            v[j][d]
        }
      }

      output.push(
        this.project(
          attended,
          this.wo
        )
      )
    }

    return output
  }
}
