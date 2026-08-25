import { HimoModel } from "./himoModel.js"
import { TRAINING_DATA } from "./trainingData.js"
import { encode } from "./tokenizer/basicTokenizer.js"
import { softmax } from "./ops/math.js"

export class HimoTrainer {
  constructor(model = new HimoModel()) {
    this.model = model
    this.steps = 0
  }

  trainExample(
    input,
    output,
    learningRate = 0.003
  ) {
    const inputTokens =
      encode(input)

    const targetTokens =
      encode(output)

    const sequence =
      this.model.forward(
        inputTokens
      )

    if (!sequence.length) {
      return 0
    }

    let loss = 0

    const count =
      Math.min(
        sequence.length,
        targetTokens.length
      )

    for (
      let position = 0;
      position < count;
      position++
    ) {
      const hidden =
        sequence[position]

      const target =
        targetTokens[position]

      const probabilities =
        softmax(
          this.model.logits(hidden)
        )

      loss -= Math.log(
        Math.max(
          1e-8,
          probabilities[target] || 0
        )
      )

      for (
        let token = 0;
        token <
        this.model.config.vocabSize;
        token++
      ) {
        const error =
          probabilities[token] -
          (token === target ? 1 : 0)

        this.model.outputBias[token] -=
          learningRate * error

        for (
          let i = 0;
          i <
          this.model.config.embeddingSize;
          i++
        ) {
          const index =
            i *
              this.model.config.vocabSize +
            token

          this.model.outputWeights[index] -=
            learningRate *
            error *
            hidden[i]
        }
      }
    }

    this.steps++

    return loss / Math.max(1, count)
  }

  train(
    epochs = 3,
    learningRate = 0.003
  ) {
    let totalLoss = 0
    let examples = 0

    for (
      let epoch = 0;
      epoch < epochs;
      epoch++
    ) {
      for (
        const [input, output]
        of TRAINING_DATA
      ) {
        totalLoss +=
          this.trainExample(
            input,
            output,
            learningRate
          )

        examples++
      }
    }

    return {
      epochs,
      examples,
      steps: this.steps,
      loss:
        examples
          ? totalLoss / examples
          : 0,
    }
  }
}
