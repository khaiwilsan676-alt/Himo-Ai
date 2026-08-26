import {
  Embedding,
  PositionalEncoding,
  TransformerBlock,
} from "./layers/index.js"

import {
  encode,
  vocabularySize,
} from "./tokenizer/index.js"

export class HimoModel {
  constructor(config = {}) {
    this.dimension =
      config.dimension ?? 128

    this.hiddenSize =
      config.hiddenSize ?? 256

    this.heads =
      config.heads ?? 4

    this.layers =
      config.layers ?? 4

    this.maxLength =
      config.maxLength ?? 512

    this.vocabSize =
      config.vocabSize ??
      vocabularySize()

    this.embedding =
      new Embedding(
        this.vocabSize,
        this.dimension
      )

    this.position =
      new PositionalEncoding(
        this.dimension,
        this.maxLength
      )

    this.blocks = []

    for (
      let i = 0;
      i < this.layers;
      i++
    ) {
      this.blocks.push(
        new TransformerBlock(
          this.dimension,
          this.hiddenSize,
          this.heads
        )
      )
    }
  }

  forward(text) {
    const tokens =
      encode(text)

    const embeddings =
      tokens.map(token =>
        this.embedding.forward(
          token
        )
      )

    let hidden =
      this.position.apply(
        embeddings
      )

    for (
      const block of this.blocks
    ) {
      hidden =
        block.forward(hidden)
    }

    return {
      tokens,
      hidden,
    }
  }

  info() {
    return {
      dimension:
        this.dimension,

      hiddenSize:
        this.hiddenSize,

      heads:
        this.heads,

      layers:
        this.layers,

      maxLength:
        this.maxLength,

      vocabSize:
        this.vocabSize,
    }
  }
}
