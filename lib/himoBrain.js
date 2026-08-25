export async function think(input, mode = "chat") {
  const message = String(input || "").trim()

  if (!message) {
    return "I'm here. What would you like to talk about?"
  }

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      mode,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.error || "Himo AI request failed")
  }

  return data.reply || "I couldn't generate a response."
}

export async function teach(word, meaning, example = "") {
  return {
    word,
    meaning,
    example,
  }
}

export async function vocabulary() {
  return []
}
