const KEY = "HimoModelWeights"

function storage() {
  if (typeof window === "undefined") {
    return null
  }

  return window.localStorage
}

export function saveWeights(weights) {
  const store = storage()

  if (!store) return false

  store.setItem(
    KEY,
    JSON.stringify(weights)
  )

  return true
}

export function loadWeights() {
  const store = storage()

  if (!store) return null

  try {
    return JSON.parse(
      store.getItem(KEY) || "null"
    )
  } catch {
    return null
  }
}

export function clearWeights() {
  const store = storage()

  if (store) {
    store.removeItem(KEY)
  }
}
