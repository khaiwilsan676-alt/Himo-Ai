import {
  getExamples,
} from "./data/dataset"

import {
  vocabularySize,
} from "./data/vocabulary"

import {
  trainStep,
} from "./runtime/neuralNetwork"

function vectorFromIds(ids, size) {
  const vector = new Float32Array(size)

  if (!ids?.length) return vector

  for (const id of ids) {
    const index = id % size
    vector[index] += 1
  }

  const scale = 1 / ids.length

  for (let i = 0; i < vector.length; i++) {
    vector[i] *= scale
  }

  return vector
}

function targetFromIds(ids, size) {
  const target = new Float32Array(size)

  if (!ids?.length) return target

  for (const id of ids) {
    if (id >= 0 && id < size) {
      target[id] += 1
    }
  }

  let total = 0

  for (const value of target) {
    total += value
  }

  if (total > 0) {
    for (let i = 0; i < target.length; i++) {
      target[i] /= total
    }
  }

  return target
}

export function trainOnce(
  learningRate = 0.03
) {
  const examples = getExamples()

  if (!examples.length) {
    return {
      trained: 0,
      loss: 0,
    }
  }

  const size = Math.max(
    8,
    vocabularySize()
  )

  let totalLoss = 0
  let trained = 0

  for (const example of examples) {
    const input = vectorFromIds(
      example.inputIds,
      size
    )

    const target = targetFromIds(
      example.outputIds,
      size
    )

    if (!example.inputIds?.length) {
      continue
    }

    if (!example.outputIds?.length) {
      continue
    }

    totalLoss += trainStep(
      input,
      target,
      learningRate
    )

    trained++
  }

  return {
    trained,
    loss:
      trained > 0
        ? totalLoss / trained
        : 0,
  }
}

export function train(
  epochs = 3,
  learningRate = 0.03
) {
  let result = {
    trained: 0,
    loss: 0,
  }

  for (let i = 0; i < epochs; i++) {
    result = trainOnce(
      learningRate
    )
  }

  return {
    ...result,
    epochs,
  }
}
