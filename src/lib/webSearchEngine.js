// ==========================================
// HIMO REAL-TIME WEB SEARCH & DATA SYNTHESIZER
// ==========================================

export async function fetchLiveWebData(query) {
  const q = query ? query.replace(/[\u200B-\u200D\uFEFF]/g, '').trim() : "";
  if (!q) return null;

  try {
    const encodedQuery = encodeURIComponent(q);
    const response = await fetch(`https://html.duckduckgo.com/html/?q=${encodedQuery}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (!response.ok) return null;
    const htmlText = await response.text();

    // Simple robust regex parsing to extract result snippets from DuckDuckGo HTML layout
    const snippetRegex = /<a class="result__snippet[^>]*>(.*?)<\/a>/g;
    let match;
    let snippets = [];

    while ((match = snippetRegex.exec(htmlText)) !== null && snippets.length < 3) {
      const cleanSnippet = match[1].replace(/<\/?[^>]+(>|$)/g, "").trim();
      if (cleanSnippet) {
        snippets.push(cleanSnippet);
      }
    }

    if (snippets.length > 0) {
      return `Live Web Search Analysis for "${q}":\n\n` + snippets.map((s, idx) => `${idx + 1}. ${s}`).join("\n\n") + `\n\nAnalysis: Ye raha real-time web data jo maine live fetch kiya hai bhai! Iske mutabiq ye query puri tarah clear ho jati hai.`;
    }
  } catch (err) {
    // Fallback if offline or network error
    return null;
  }

  return null;
}
