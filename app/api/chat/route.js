const responses = {
  "explain quantum computing simply": "Quantum computing is a type of computing that uses quantum mechanics principles (like superposition and entanglement) to perform complex calculations much faster than traditional computers. Instead of classical bits (0 or 1), quantum computers use qubits, which can exist in multiple states simultaneously!",
  "write a landing page in react": "Here is a sleek React landing page structure:\n\n```jsx\nexport default function LandingPage() {\n  return (\n    <div className=\"min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6\">\n      <h1 className=\"text-5xl font-bold mb-4\">Welcome to Himo AI</h1>\n      <p className=\"text-gray-400 max-w-md text-center mb-6\">Build amazing projects powered by intelligence.</p>\n      <button className=\"bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-semibold\">\n        Get Started Free\n      </button>\n    </div>\n  );\n}\n```",
  "create a cinematic product shot": "🎬 **Cinematic Product Shot Concept**\n- **Subject:** Matte black minimalist wireless headphones on a sleek reflective marble pedestal.\n- **Lighting:** Soft volumetric side-lighting with subtle cyan-to-amber rim highlights.\n- **Camera:** 85mm f/1.4 lens, shallow depth-of-field, smooth 24fps slow-motion orbit.",
  "make a 10-second travel video": "✈️ **10-Second Travel Video Storyboard**\n- **0-3s:** Sunrise over Tokyo skyline, warm ambient orange tones.\n- **3-6s:** Bullet train speeding past Cherry Blossom trees with motion blur.\n- **6-10s:** Cinematic neon-lit Shibuya crossing with subtle slow-mo effect.",
  "ideas for a new startup": "💡 **Startup Ideas:**\n1. **AI Travel Planner:** Personalized real-time itineraries based on weather and crowds.\n2. **Code Optimizer Agent:** Automatic refactoring and test generator for GitHub pull requests.\n3. **Smart Studio:** AI-assisted sound & video design tool for solo creators.",
  "refactor auth middleware": "🔒 **Auth Middleware Refactor Example:**\n\n```js\nexport async function middleware(req) {\n  const token = req.headers.get('authorization')?.split(' ')[1];\n  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 });\n  try {\n    const user = await verifyJwtToken(token);\n    req.user = user;\n  } catch {\n    return Response.json({ error: 'Invalid token' }, { status: 403 });\n  }\n}\n```",
  "tokyo travel itinerary": "🌸 **3-Day Tokyo Itinerary:**\n- **Day 1:** Asakusa Senso-ji Temple, Skytree views, and Akihabara evening exploring.\n- **Day 2:** Meiji Shrine, Harajuku fashion street, and Shibuya Crossing night walk.\n- **Day 3:** Shinjuku Gyoen National Garden & Omoide Yokocho dining."
};

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message || !message.trim()) {
      return Response.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const cleaned = message.trim().toLowerCase();

    // Check if there's a predefined response
    for (const [key, reply] of Object.entries(responses)) {
      if (cleaned.includes(key)) {
        return Response.json({ reply });
      }
    }

    // Smart fallback answer for custom prompts
    const fallbackReply = `Here is what I found for "${message.trim()}":\n\nHimo AI has processed your request successfully! How else can I assist your workflow today?`;

    return Response.json({
      reply: fallbackReply
    });

  } catch (error) {
    console.error(error);
    return Response.json(
      { reply: "Himo AI is ready to help! Please send your request." }
    );
  }
}
