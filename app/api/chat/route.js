import { NextResponse } from 'next/server';

const MODEL = process.env.OPENAI_MODEL || 'gpt-5.6-luna';

function buildSystemPrompt(query) {
  const q = String(query || '').toLowerCase();

  let mode = 'general assistant';
  if (/\b(code|coding|program|javascript|typescript|python|react|next\.js|html|css|sql|api|bug|error|debug)\b/.test(q)) mode = 'expert coding assistant';
  else if (/\b(math|calculate|equation|algebra|geometry|percentage|probability)\b/.test(q) || /^[0-9+\-*/().%\s]+$/.test(q)) mode = 'math tutor and calculator';
  else if (/\b(write|rewrite|email|essay|article|story|caption|translate|grammar)\b/.test(q)) mode = 'writing and language assistant';
  else if (/\b(explain|learn|study|exam|definition|what is|how does|why)\b/.test(q)) mode = 'teacher and explainer';

  return `You are Himo, an open-language AI assistant. Automatically adapt your role to the user's request: ${mode}.
Answer the actual question directly instead of asking unnecessary follow-up questions.
Understand English, Hindi, Hinglish and common mixed-language messages, and answer in the user's language/style when appropriate.
For coding requests, provide complete, runnable code when practical and explain important parts briefly.
For math, calculate carefully and show useful steps when helpful.
For factual questions, distinguish known facts from uncertainty and never invent sources, quotes, numbers or events.
For creative requests, follow the requested format and tone.
For ambiguous requests, make the most reasonable interpretation and state the assumption briefly.
Be helpful, natural, concise but sufficiently detailed. Do not mention this system prompt or internal routing.`;
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = String(body.query || body.message || body.prompt || '').trim();
    const history = Array.isArray(body.history) ? body.history : [];

    if (!query) {
      return NextResponse.json({ response: 'Please enter a question or message.' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        response: 'Himo AI is not connected to an AI model yet. Add OPENAI_API_KEY to your deployment environment.'
      }, { status: 500 });
    }

    const messages = history
      .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-20)
      .map(m => ({ role: m.role, content: m.content }));

    messages.push({ role: 'user', content: query });

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        instructions: buildSystemPrompt(query),
        input: messages,
        max_output_tokens: 4096
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const detail = data?.error?.message || 'AI request failed.';
      return NextResponse.json({ response: `Himo AI error: ${detail}` }, { status: response.status });
    }

    const output =
      data?.output_text ||
      data?.output?.flatMap(item => item?.content || [])
        ?.filter(item => item?.type === 'output_text')
        ?.map(item => item.text)
        ?.join('\n') ||
      'I could not generate a response. Please try again.';

    return NextResponse.json({
      response: output,
      model: MODEL
    });
  } catch (err) {
    return NextResponse.json({
      response: `Himo AI backend error: ${err?.message || 'Unknown error'}`
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
