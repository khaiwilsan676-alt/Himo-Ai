export class LayerNorm {
  constructor(size) {
    this.size = size
    this.epsilon = 1e-5

    this.gamma =
      new Float32Array(size)

    this.beta =
      new Float32Array(size)

    this.gamma.fill(1)
  }

  forward(input) {
    let mean = 0

    for (const value of input) {
      mean += value
    }

    mean /= input.length

    let variance = 0

    for (const value of input) {
      const diff =
        value - mean

      variance +=
        diff * diff
    }

    variance /= input.length

    const scale =
      1 /
      Math.sqrt(
        variance + this.epsilon
      )

    const output =
      new Float32Array(
        input.length
      )

    for (
      let i = 0;
      i < input.length;
      i++
    ) {
      output[i] =
        (input[i] - mean) *
          scale *
          this.gamma[i] +
        this.beta[i]
    }

    return output
  }
}
