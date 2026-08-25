import { random } from "../ops/math.js"

export class Embedding {
  constructor(vocabSize, dimension) {
    this.vocabSize = vocabSize
    this.dimension = dimension

    this.weights = random(
      vocabSize * dimension,
      0.05
    )
  }

  forward(tokens) {
    return tokens.map(token => {
      const output =
        new Float32Array(
          this.dimension
        )

      const id =
        Math.max(
          0,
          Math.min(
            token,
            this.vocabSize - 1
          )
        )

      const offset =
        id * this.dimension

      for (
        let i = 0;
        i < this.dimension;
        i++
      ) {
        output[i] =
          this.weights[offset + i]
      }

      return output
    })
  }
}
