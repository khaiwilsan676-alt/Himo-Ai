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

    // Yahan tu apna AI/API code baad mein khud add karega.

    return Response.json({
      reply: "AI API not connected yet"
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Request failed" },
      { status: 500 }
    );
  }
}
