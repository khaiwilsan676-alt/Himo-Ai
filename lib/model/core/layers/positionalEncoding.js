export class PositionalEncoding {
  constructor(dimension, maxLength = 512) {
    this.dimension = dimension
    this.maxLength = maxLength
  }

  apply(sequence) {
    return sequence.map((vector, position) => {
      const output = new Float32Array(vector)

      for (let i = 0; i < this.dimension; i++) {
        const angle =
          position /
          Math.pow(
            10000,
            (2 * Math.floor(i / 2)) /
              this.dimension
          )

        if (i % 2 === 0) {
          output[i] += Math.sin(angle)
        } else {
          output[i] += Math.cos(angle)
        }
      }

      return output
    })
  }
}
