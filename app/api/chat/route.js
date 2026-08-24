import { findPredefinedAnswer } from "@/src/data/aiKnowledge";

export async function POST(request) {
  try {
    const { message, mode } = await request.json();

    if (!message) {
      return Response.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Check predefined local knowledge base first
    const answer = findPredefinedAnswer(message);
    if (answer) {
      return Response.json({ reply: answer });
    }

    // Default bot response without external AI APIs
    const modeLabel = mode ? mode : "chat";
    const defaultReply = `Hello! I am Himo Bot. I am here to help you with ${modeLabel}. You asked: "${message}". How can I assist you further?`;

    return Response.json({
      reply: defaultReply
    });

  } catch (error) {
    console.error("Chat API error:", error);

    return Response.json(
      { error: "Request failed: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}
