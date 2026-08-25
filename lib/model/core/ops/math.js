export function random(size, scale = 0.02) {
  const output = new Float32Array(size)

  for (let i = 0; i < size; i++) {
    output[i] =
      (Math.random() * 2 - 1) * scale
  }

  return output
}

export function zeros(size) {
  return new Float32Array(size)
}

export function softmax(values) {
  let max = -Infinity

  for (const value of values) {
    if (value > max) max = value
  }

  const output =
    new Float32Array(values.length)

  let sum = 0

  for (let i = 0; i < values.length; i++) {
    output[i] =
      Math.exp(values[i] - max)

    sum += output[i]
  }

  if (!sum) return output

  for (let i = 0; i < output.length; i++) {
    output[i] /= sum
  }

  return output
}

export function argmax(values) {
  let index = 0

  for (let i = 1; i < values.length; i++) {
    if (values[i] > values[index]) {
      index = i
    }
  }

  return index
}

export function dot(a, b) {
  let result = 0
  const length =
    Math.min(a.length, b.length)

  for (let i = 0; i < length; i++) {
    result += a[i] * b[i]
  }

  return result
}

export function relu(x) {
  return Math.max(0, x)
}
