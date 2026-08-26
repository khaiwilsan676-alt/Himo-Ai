import {
  HimoModel,
} from "./himoModel.js"

export class HimoTrainer {
  constructor(config = {}) {
    this.model =
      config.model ||
      new HimoModel(config)

    this.steps = 0
    this.loss = 0
  }

  trainStep(text) {
    if (!text || !String(text).trim()) {
      return {
        loss: 0,
        steps: this.steps,
      }
    }

    /*
     * Forward pass.
     * Actual gradient training will be
     * connected in the next training stage.
     */
    const result =
      this.model.forward(text)

    this.steps += 1

    this.loss =
      result.logits.length > 0
        ? Math.log(result.logits.length)
        : 0

    return {
      loss: this.loss,
      steps: this.steps,
    }
  }

  train(texts = []) {
    let result = {
      loss: 0,
      steps: this.steps,
    }

    for (const text of texts) {
      result = this.trainStep(text)
    }

    return result
  }

  getModel() {
    return this.model
  }

  info() {
    return {
      ...this.model.info(),
      steps: this.steps,
      loss: this.loss,
    }
  }
}
