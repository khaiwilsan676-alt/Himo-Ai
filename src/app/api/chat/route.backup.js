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

    const apiKey = process.env.FIREBASE_API_KEY || process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are Himo AI, a helpful creative AI assistant. Mode: ${mode || "chat"}. User message: ${message}`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            return Response.json({ reply: candidateText });
          }
        }
      } catch (aiErr) {
        console.error("Firebase/Gemini API fetch error:", aiErr);
      }
    }

    // Fallback bot response if no API key or API call fails
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
