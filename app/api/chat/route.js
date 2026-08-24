const API_KEY = process.env.FIREBASE_API_KEY;

export async function POST(request) {
  try {
    const { message } = await request.json();

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
