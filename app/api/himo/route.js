import { think } from "../../../lib/brain/index.js"

export async function POST(request) {
  try {
    const body = await request.json()

    const message = String(body?.message || "").trim()
    const userId = String(body?.userId || "anonymous")
    const mode = String(body?.mode || "chat")

    if (!message) {
      return Response.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      )
    }

    const reply = await think(message, userId, mode)

    return Response.json({
      success: true,
      reply,
      userId,
      mode
    })
  } catch (error) {
    console.error("Himo Brain Error:", error)

    return Response.json(
      {
        success: false,
        error: error?.message || "Himo Brain failed"
      },
      { status: 500 }
    )
  }
}
