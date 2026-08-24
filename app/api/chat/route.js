import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request) {
  try {
    const { message } = await request.json();

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
