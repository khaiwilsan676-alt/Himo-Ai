import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not configured." }, { status: 500 })
    }

    const body = await request.json()
    const prompt = String(body?.prompt || "").trim()
    const history = Array.isArray(body?.history) ? body.history : []
    const useWeb = Boolean(body?.useWeb)

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 })
    }

    const input = [
      ...history.slice(-12).map((item) => ({
        role: item.role === "assistant" ? "assistant" : "user",
        content: String(item.content || "")
      })),
      { role: "user", content: prompt }
    ]

    const payload = {
      model: "gpt-5.6-luna",
      instructions: [
        "You are Himo, a natural, friendly AI assistant.",
        "Talk like a real helpful human. Understand Hinglish, Hindi, English, and casual spelling.",
        "Answer the user's actual question directly. Never replace a conversational question with an unrelated search result.",
        "If the user asks who you are, say you are Himo, their AI assistant.",
        "Keep casual replies natural and concise unless the user asks for detail.",
        "When web search is enabled, use it only for fresh/current/external facts and then synthesize the answer naturally."
      ].join(" "),
      input
    }

    if (useWeb) {
      payload.tools = [{ type: "web_search" }]
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey
      },
      body: JSON.stringify(payload),
      cache: "no-store"
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "OpenAI API request failed." },
        { status: response.status }
      )
    }

    const answer = data?.output_text?.trim()
    return NextResponse.json({
      answer: answer || "Sorry, I couldn't generate a response."
    })
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Something went wrong." },
      { status: 500 }
    )
  }
}
