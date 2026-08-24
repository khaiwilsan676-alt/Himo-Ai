import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

export async function POST(request) {
  try {
    const { message, mode } = await request.json();

    if (!message) {
      return Response.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Try Gemini first if key available
    if (process.env.GEMINI_API_KEY) {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const systemInstruction = `You are Himo AI, an intelligent creative workspace assistant. Mode: ${mode || "chat"}. Be helpful, clear, and concise.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: message,
        config: {
          systemInstruction
        }
      });

      return Response.json({
        reply: response.text || "No response generated."
      });
    }

    // Fallback to OpenAI if key available
    if (process.env.OPENAI_API_KEY) {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: `You are Himo AI, an intelligent creative workspace assistant. Mode: ${mode || "chat"}. Be helpful, clear, and concise.` },
          { role: "user", content: message }
        ]
      });

      return Response.json({
        reply: completion.choices[0]?.message?.content || "No response generated."
      });
    }

    return Response.json(
      { error: "AI service is not configured. Please add GEMINI_API_KEY to your environment variables." },
      { status: 503 }
    );

  } catch (error) {
    console.error("Chat API error:", error);

    return Response.json(
      { error: "Request failed: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}
