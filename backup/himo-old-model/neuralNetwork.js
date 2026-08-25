import {
  random,
  softmax,
  argmax,
} from "./tensor"

const MODEL_KEY = "HimoNeuralModel"

function storage() {
  if (typeof window === "undefined") return null
  return window.localStorage
}

function createModel(inputSize, outputSize) {
  const weights = new Float32Array(
    inputSize * outputSize
  )

  const bias = new Float32Array(outputSize)

  const initial = random(
    weights.length,
    Math.sqrt(2 / Math.max(1, inputSize))
  )

  weights.set(initial)

  return {
    inputSize,
    outputSize,
    weights: Array.from(weights),
    bias: Array.from(bias),
    trainedSteps: 0,
  }
}

function saveModel(model) {
  const store = storage()

  if (!store) return

  store.setItem(
    MODEL_KEY,
    JSON.stringify(model)
  )
}

function loadModel(inputSize, outputSize) {
  const store = storage()

  if (!store) {
    return createModel(inputSize, outputSize)
  }

  try {
    const saved = JSON.parse(
      store.getItem(MODEL_KEY) || "null"
    )

    if (
      saved &&
      saved.inputSize === inputSize &&
      saved.outputSize === outputSize
    ) {
      return saved
    }
  } catch {}

  const model = createModel(
    inputSize,
    outputSize
  )

  saveModel(model)

  return model
}

export function predict(
  input,
  outputSize,
  temperature = 1
) {
  if (!input?.length || outputSize <= 0) {
    return {
      index: 0,
      probabilities: [],
    }
  }

  const inputSize = input.length

  const model = loadModel(
    inputSize,
    outputSize
  )

  const logits = new Float32Array(
    outputSize
  )

  for (let j = 0; j < outputSize; j++) {
    let value = model.bias[j]

    for (let i = 0; i < inputSize; i++) {
      value +=
        input[i] *
        model.weights[
          i * outputSize + j
        ]
    }

    logits[j] =
      value /
      Math.max(0.1, temperature)
  }

  const probabilities =
    softmax(logits)

  return {
    index: argmax(probabilities),
    probabilities: Array.from(
      probabilities
    ),
  }
}

export function trainStep(
  input,
  target,
  learningRate = 0.03
) {
  if (
    !input?.length ||
    !target?.length
  ) {
    return 0
  }

  const inputSize = input.length
  const outputSize = target.length

  const model = loadModel(
    inputSize,
    outputSize
  )

  const logits =
    new Float32Array(outputSize)

  for (let j = 0; j < outputSize; j++) {
    let value = model.bias[j]

    for (let i = 0; i < inputSize; i++) {
      value +=
        input[i] *
        model.weights[
          i * outputSize + j
        ]
    }

    logits[j] = value
  }

  const probabilities =
    softmax(logits)

  let loss = 0

  for (let j = 0; j < outputSize; j++) {
    if (target[j] > 0) {
      loss -=
        target[j] *
        Math.log(
          Math.max(
            probabilities[j],
            1e-8
          )
        )
    }
  }

  for (let j = 0; j < outputSize; j++) {
    const error =
      probabilities[j] -
      target[j]

    model.bias[j] -=
      learningRate * error

    for (let i = 0; i < inputSize; i++) {
      model.weights[
        i * outputSize + j
      ] -=
        learningRate *
        error *
        input[i]
    }
  }

  model.trainedSteps += 1

  saveModel(model)

  return loss
}

export function modelInfo() {
  const store = storage()

  if (!store) {
    return null
  }

  try {
    const model = JSON.parse(
      store.getItem(MODEL_KEY) || "null"
    )

    if (!model) return null

    return {
      inputSize: model.inputSize,
      outputSize: model.outputSize,
      trainedSteps:
        model.trainedSteps || 0,
    }
  } catch {
    return null
  }
}

export function resetModel() {
  const store = storage()

  if (store) {
    store.removeItem(MODEL_KEY)
  }
}
