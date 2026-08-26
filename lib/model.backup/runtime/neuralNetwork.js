import { random, softmax, argmax } from "./tensor.js"

const MODEL_KEY = "himo-model-v2"

const memory = globalThis.__HIMO_MODEL_MEMORY ||
  (globalThis.__HIMO_MODEL_MEMORY = new Map())

function createModel(inputSize, outputSize) {
  const weights = new Float32Array(inputSize * outputSize)
  const bias = new Float32Array(outputSize)

  weights.set(
    random(
      weights.length,
      Math.sqrt(2 / Math.max(1, inputSize))
    )
  )

  return {
    inputSize,
    outputSize,
    weights: Array.from(weights),
    bias: Array.from(bias),
    trainedSteps: 0,
  }
}

function key(inputSize, outputSize) {
  return `${MODEL_KEY}:${inputSize}:${outputSize}`
}

function loadModel(inputSize, outputSize) {
  const k = key(inputSize, outputSize)

  if (!memory.has(k)) {
    memory.set(k, createModel(inputSize, outputSize))
  }

  return memory.get(k)
}

export function predict(input, outputSize, temperature = 1) {
  if (!input?.length || outputSize <= 0) {
    return {
      index: 0,
      probabilities: [],
    }
  }

  const inputSize = input.length
  const model = loadModel(inputSize, outputSize)

  const logits = new Float32Array(outputSize)

  for (let j = 0; j < outputSize; j++) {
    let value = model.bias[j]

    for (let i = 0; i < inputSize; i++) {
      value +=
        input[i] *
        model.weights[i * outputSize + j]
    }

    logits[j] =
      value / Math.max(0.1, temperature)
  }

  const probabilities = softmax(logits)

  return {
    index: argmax(probabilities),
    probabilities: Array.from(probabilities),
  }
}

export function trainStep(
  input,
  target,
  learningRate = 0.01
) {
  if (!input?.length || !target?.length) {
    return 0
  }

  const inputSize = input.length
  const outputSize = target.length

  const model = loadModel(
    inputSize,
    outputSize
  )

  const logits = new Float32Array(outputSize)

  for (let j = 0; j < outputSize; j++) {
    let value = model.bias[j]

    for (let i = 0; i < inputSize; i++) {
      value +=
        input[i] *
        model.weights[i * outputSize + j]
    }

    logits[j] = value
  }

  const probabilities = softmax(logits)

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
      probabilities[j] - target[j]

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

  return loss
}

export function modelInfo() {
  const models = []

  for (const model of memory.values()) {
    models.push({
      inputSize: model.inputSize,
      outputSize: model.outputSize,
      trainedSteps: model.trainedSteps,
    })
  }

  return models
}

export function resetModel() {
  memory.clear()
}

export function zeros(size) {
  return new Float32Array(size)
}
