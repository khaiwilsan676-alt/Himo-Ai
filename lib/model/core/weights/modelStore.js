const MODEL_KEY =
  "HimoTransformerModel"

function storage() {
  if (
    typeof window === "undefined"
  ) {
    return null
  }

  return window.localStorage
}

export function saveModel(model) {
  const store = storage()

  if (!store || !model) {
    return false
  }

  try {
    store.setItem(
      MODEL_KEY,
      JSON.stringify(model)
    )

    return true
  } catch {
    return false
  }
}

export function loadModel() {
  const store = storage()

  if (!store) {
    return null
  }

  try {
    const value =
      store.getItem(MODEL_KEY)

    if (!value) {
      return null
    }

    return JSON.parse(value)
  } catch {
    return null
  }
}

export function hasSavedModel() {
  return loadModel() !== null
}

export function clearModel() {
  const store = storage()

  if (store) {
    store.removeItem(MODEL_KEY)
  }
}
