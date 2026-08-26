import {
  HimoModel,
} from "./himoModel.js"

import {
  decode,
  encode,
  vocabularySize,
} from "./tokenizer/index.js"

function sample(probabilities, temperature = 1) {
  if (!probabilities?.length) {
    return 0
  }

  const t =
    Math.max(0.05, temperature)

  const adjusted =
    new Float32Array(
      probabilities.length
    )

  let total = 0

  for (
    let i = 0;
    i < probabilities.length;
    i++
  ) {
    const value =
      Math.pow(
        Math.max(probabilities[i], 1e-12),
        1 / t
      )

    adjusted[i] = value
    total += value
  }

  if (!total) {
    return 0
  }

  let random =
    Math.random() * total

  for (
    let i = 0;
    i < adjusted.length;
    i++
  ) {
    random -= adjusted[i]

    if (random <= 0) {
      return i
    }
  }

  return adjusted.length - 1
}

export class HimoGenerator {
  constructor(config = {}) {
    this.model =
      config.model ||
      new HimoModel(config)
  }

  generate(
    prompt,
    options = {}
  ) {
    const maxTokens =
      Math.max(
        1,
        options.maxTokens ?? 64
      )

    const temperature =
      options.temperature ?? 0.8

    const tokens =
      encode(prompt)

    const generated = [
      ...tokens,
    ]

    const vocab =
      vocabularySize()

    for (
      let step = 0;
      step < maxTokens;
      step++
    ) {
      const text =
        decode(generated)

      const result =
        this.model.forward(text)

      const probabilities =
        this.model.lmHead.probabilities(
          result.hidden[
            result.hidden.length - 1
          ],
          temperature
        )

      let next =
        sample(
          probabilities,
          temperature
        )

      /*
       * Never generate an invalid
       * vocabulary index.
       */
      if (next >= vocab) {
        next = 3
      }

      generated.push(next)

      /*
       * EOS token.
       */
      if (next === 2) {
        break
      }
    }

    return decode(
      generated
        .slice(tokens.length)
    )
  }
}

export function generate(
  prompt,
  options = {}
) {
  const generator =
    new HimoGenerator(
      options
    )

  return generator.generate(
    prompt,
    options
  )
}
