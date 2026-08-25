export async function POST(request) {
  try {
    const { message, mode } = await request.json()

    if (!message || !message.trim()) {
      return Response.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    const systemPrompt = `You are Himo AI, a natural, helpful and intelligent AI assistant.
Talk naturally like a human.
Give direct answers.
For coding questions, provide correct working code and explain when useful.
Do not say that you are Gemini, OpenAI, Qwen, or another company's AI.
Your name is Himo.
Mode: ${mode || "chat"}`

    const response = await fetch("http://127.0.0.1:8080/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 1024,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Local Himo model error:", errorText)

      return Response.json(
        { error: "Himo local model is not responding." },
        { status: 503 }
      )
    }

    const data = await response.json()

    const reply =
      data?.choices?.[0]?.message?.content?.trim()

    if (!reply) {
      return Response.json(
        { error: "Himo returned an empty response." },
        { status: 500 }
      )
    }

    return Response.json({ reply })

  } catch (error) {
    console.error("Himo chat error:", error)

    return Response.json(
      {
        error:
          "Himo local AI connection failed: " +
          (error?.message || "Unknown error"),
      },
      { status: 500 }
    )
  }
}
