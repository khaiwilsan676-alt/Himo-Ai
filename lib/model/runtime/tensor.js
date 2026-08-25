export function zeros(size) {
  return new Float32Array(size)
}

export function random(size, scale = 0.08) {
  const data = new Float32Array(size)

  for (let i = 0; i < size; i++) {
    data[i] = (Math.random() * 2 - 1) * scale
  }

  return data
}

export function dot(a, b) {
  let result = 0

  const length = Math.min(a.length, b.length)

  for (let i = 0; i < length; i++) {
    result += a[i] * b[i]
  }

  return result
}

export function softmax(values) {
  let max = -Infinity

  for (const value of values) {
    if (value > max) max = value
  }

  const result = new Float32Array(values.length)

  let sum = 0

  for (let i = 0; i < values.length; i++) {
    result[i] = Math.exp(values[i] - max)
    sum += result[i]
  }

  if (sum === 0) return result

  for (let i = 0; i < result.length; i++) {
    result[i] /= sum
  }

  return result
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

export function relu(value) {
  return Math.max(0, value)
}
