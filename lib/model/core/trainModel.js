import { HimoTrainer } from "./trainer.js"

export function trainHimo(
  epochs = 3,
  learningRate = 0.01
) {
  const trainer =
    new HimoTrainer()

  return trainer.train(
    epochs,
    learningRate
  )
}
