const HIMO_API =
  "https://himo-ai-six.vercel.app/api/himo/"

export async function think(
  input,
  mode = "chat",
  userId = "anonymous"
) {
  const message = String(input || "").trim()

  if (!message) {
    return "Haan, bolo. Main sun raha hoon."
  }

  const response = await fetch(HIMO_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      userId,
      mode,
    }),
  })

  const data = await response.json()

  if (!response.ok || !data?.success) {
    throw new Error(
      data?.error || "Himo Brain API failed"
    )
  }

  return data.reply || "Himo ne reply nahi diya."
}
