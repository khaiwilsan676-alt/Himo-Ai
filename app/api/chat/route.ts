import { NextResponse } from 'next/server';

function cleanText(text: string): string {
  let cleaned = text.replace(/https?:\/\/\S+|www\.\S+/g, '');
  const sitePatterns = [
    /Wikipedia/gi, /Merriam-Webster/gi, /Dictionary/gi, /Britannica/gi,
    /Psychology Today/gi, /Coursera/gi, /Grammarly/gi, /YouTube/gi,
    /GeeksforGeeks/gi, /W3Schools/gi, /Stack Overflow/gi, /Programiz/gi,
    /Tutorialspoint/gi, /OneCompiler/gi, /Javatpoint/gi
  ];
  sitePatterns.forEach(pat => {
    cleaned = cleaned.replace(pat, '');
  });
  return cleaned.replace(/\s*-\s*$/, '').replace(/\s{2,}/g, ' ').trim();
}

async function webSearch(query: string): Promise<string[]> {
  const snippets: string[] = [];
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    
    // Regex se snippet extract karo
    const regex = /<a class="result__snippet[^>]*>([\s\S]*?)<\/a>/g;
    let match;
    while ((match = regex.exec(html)) !== null && snippets.length < 4) {
      const rawText = match[1].replace(/<[^>]+>/g, '').trim();
      const cleaned = cleanText(rawText);
      if (cleaned.length > 20 && !snippets.includes(cleaned)) {
        snippets.push(cleaned);
      }
    }
  } catch (e) {
    // Fallback if search fails
  }
  return snippets;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query = (body.message || body.query || body.prompt || '').trim();

    if (!query) {
      return NextResponse.json({ response: 'Query empty hai.' }, {
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    const qLower = query.toLowerCase();
    if (['hi', 'hii', 'hello', 'hii himo', 'hi himo'].includes(qLower)) {
      return NextResponse.json({
        response: 'Yo! Himo Omni Engine active hai. Live Web Search & Coding ready hai. Kya find ya code karwana hai?'
      }, {
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    const snippets = await webSearch(query);
    let output = 'According to Himo:\n\n';

    if (snippets.length > 0) {
      snippets.forEach((s) => {
        output += `• ${s}\n\n`;
      });
    } else {
      output += `'${query}' ke baare me filhaal exact real-time details match nahi hui. Rephrase karke search karo.`;
    }

    return NextResponse.json({ 
      response: output,
      reply: output,
      content: output,
      text: output
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (error) {
    return NextResponse.json({ response: 'Himo Engine Error.' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
