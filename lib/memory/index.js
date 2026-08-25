const memoryStore = new Map()

export function getMemory(userId = "anonymous") {
  return memoryStore.get(userId) || []
}

export function saveMemory(userId = "anonymous", item) {
  const history = getMemory(userId)

  history.push({
    ...item,
    timestamp: Date.now(),
  })

  memoryStore.set(userId, history.slice(-50))
}
