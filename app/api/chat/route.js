import OpenAI from "openai";

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "Chat is not configured. Add OPENAI_API_KEY to enable Himo AI responses." },
        { status: 503 }
      );
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    if (!message) {
      return Response.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: message
    });

    return Response.json({
      reply: response.output_text
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "AI request failed" },
      { status: 500 }
    );
  }
}
