import { MODEL_CONFIG } from "./config.js"
import { Embedding } from "./layers/embedding.js"
import { TransformerBlock } from "./layers/transformerBlock.js"
import {
  encode,
  decode,
  specialTokens,
} from "./tokenizer/basicTokenizer.js"
import {
  random,
  softmax,
  argmax,
} from "./ops/math.js"

export class HimoModel {
  constructor(config = MODEL_CONFIG) {
    this.config = config

    this.embedding =
      new Embedding(
        config.vocabSize,
        config.embeddingSize
      )

    this.blocks =
      Array.from(
        { length: config.layers },
        () =>
          new TransformerBlock(
            config.embeddingSize,
            config.hiddenSize
          )
      )

    this.outputWeights =
      random(
        config.embeddingSize *
          config.vocabSize
      )

    this.outputBias =
      new Float32Array(
        config.vocabSize
      )
  }

  forward(tokens) {
    let sequence =
      this.embedding.forward(tokens)

    for (
      const block of this.blocks
    ) {
      sequence =
        block.forward(sequence)
    }

    return sequence
  }

  logits(hidden) {
    const output =
      new Float32Array(
        this.config.vocabSize
      )

    for (
      let j = 0;
      j < output.length;
      j++
    ) {
      let value =
        this.outputBias[j]

      for (
        let i = 0;
        i < this.config.embeddingSize;
        i++
      ) {
        value +=
          hidden[i] *
          this.outputWeights[
            i *
              this.config.vocabSize +
            j
          ]
      }

      output[j] = value
    }

    return output
  }

  predict(
    tokens,
    temperature = 0.75
  ) {
    const sequence =
      this.forward(tokens)

    if (!sequence.length) {
      return {
        token:
          specialTokens().EOS,
        probabilities: [],
      }
    }

    const hidden =
      sequence[
        sequence.length - 1
      ]

    const logits =
      this.logits(hidden)

    const scaled =
      logits.map
        ? logits.map(
            x =>
              x /
              Math.max(
                0.1,
                temperature
              )
          )
        : Array.from(logits, x =>
            x /
            Math.max(
              0.1,
              temperature
            )
          )

    const probabilities =
      softmax(scaled)

    return {
      token:
        argmax(probabilities),
      probabilities,
    }
  }

  generate(
    prompt,
    options = {}
  ) {
    const tokens =
      encode(prompt)

    const special =
      specialTokens()

    const maxTokens =
      options.maxTokens ||
      this.config.maxNewTokens

    const temperature =
      options.temperature ??
      this.config.temperature

    for (
      let i = 0;
      i < maxTokens;
      i++
    ) {
      const context =
        tokens.slice(
          -this.config.contextSize
        )

      const result =
        this.predict(
          context,
          temperature
        )

      if (
        result.token ===
          special.EOS ||
        result.token ===
          special.PAD
      ) {
        break
      }

      tokens.push(
        result.token
      )
    }

    return decode(tokens)
  }

  info() {
    return {
      contextSize:
        this.config.contextSize,

      embeddingSize:
        this.config.embeddingSize,

      hiddenSize:
        this.config.hiddenSize,

      layers:
        this.config.layers,

      heads:
        this.config.heads,

      vocabSize:
        this.config.vocabSize,
    }
  }
}
