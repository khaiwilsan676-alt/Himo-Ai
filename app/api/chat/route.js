import { NextResponse } from 'next/server';

function cleanText(text) {
  if (!text) return '';
  let cleaned = text.replace(/https?:\/\/\S+|www\.\S+/g, '');
  const sitePatterns = [
    /Wikipedia/gi, /Merriam-Webster/gi, /Dictionary/gi, /Britannica/gi,
    /Psychology Today/gi, /Coursera/gi, /Grammarly/gi, /YouTube/gi,
    /GeeksforGeeks/gi, /W3Schools/gi, /Stack Overflow/gi, /Programiz/gi
  ];
  sitePatterns.forEach((pat) => {
    cleaned = cleaned.replace(pat, '');
  });
  return cleaned.replace(/\s*-\s*$/, '').replace(/\s{2,}/g, ' ').trim();
}

async function fetchLiveSummary(query) {
  const snippets = [];
  
  // 1. Instant Wikipedia Open API (Never blocks on serverless)
  try {
    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json`;
    const res = await fetch(wikiUrl, {
      headers: { 'User-Agent': 'HimoAI/2.0 (himo.assistant@gmail.com)' },
      next: { revalidate: 60 }
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.query?.search?.length > 0) {
        data.query.search.slice(0, 3).forEach((item) => {
          const raw = item.snippet.replace(/<[^>]+>/g, '').trim();
          const cleaned = cleanText(raw);
          if (cleaned.length > 20 && !snippets.includes(cleaned)) {
            snippets.push(cleaned);
          }
        });
      }
    }
  } catch (e) {}

  // 2. Fallback: DuckDuckGo Instant API
  if (snippets.length === 0) {
    try {
      const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
      const res = await fetch(ddgUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (res.ok) {
        const data = await res.json();
        if (data.AbstractText) {
          snippets.push(cleanText(data.AbstractText));
        }
      }
    } catch (e) {}
  }

  return snippets;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const query = (body.query || body.message || body.prompt || '').trim();

    if (!query) {
      return NextResponse.json({ response: 'Please kuch search ya query type karo.' });
    }

    const qLower = query.toLowerCase();
    if (['hi', 'hii', 'hello', 'hii himo', 'hi himo'].includes(qLower)) {
      return NextResponse.json({
        response: 'Yo! Himo Omni Engine live hai. Web search aur coding prompts ke liye ready hai.'
      });
    }

    const snippets = await fetchLiveSummary(query);
    let output = 'According to Himo:\n\n';

    if (snippets.length > 0) {
      snippets.forEach((s) => {
        output += `• ${s}\n\n`;
      });
    } else {
      output += `'${query}' ke baare me filhaal exact real-time match nahi mila. Thode different keywords use karke try karo.`;
    }

    return NextResponse.json({ response: output });
  } catch (error) {
    return NextResponse.json({
      response: 'According to Himo:\n\nRequest process nahi ho saki. Please query rephrase karke dobara try karein.'
    });
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
