import { random, relu } from "../ops/math.js"

export class FeedForward {
  constructor(inputSize, hiddenSize) {
    this.inputSize = inputSize
    this.hiddenSize = hiddenSize

    this.w1 =
      random(
        inputSize * hiddenSize
      )

    this.b1 =
      new Float32Array(hiddenSize)

    this.w2 =
      random(
        hiddenSize * inputSize
      )

    this.b2 =
      new Float32Array(inputSize)
  }

  forward(input) {
    const hidden =
      new Float32Array(
        this.hiddenSize
      )

    for (
      let j = 0;
      j < this.hiddenSize;
      j++
    ) {
      let value =
        this.b1[j]

      for (
        let i = 0;
        i < this.inputSize;
        i++
      ) {
        value +=
          input[i] *
          this.w1[
            i * this.hiddenSize + j
          ]
      }

      hidden[j] = relu(value)
    }

    const output =
      new Float32Array(
        this.inputSize
      )

    for (
      let j = 0;
      j < this.inputSize;
      j++
    ) {
      let value =
        this.b2[j]

      for (
        let i = 0;
        i < this.hiddenSize;
        i++
      ) {
        value +=
          hidden[i] *
          this.w2[
            i * this.inputSize + j
          ]
      }

      output[j] = value
    }

    return output
  }
}
