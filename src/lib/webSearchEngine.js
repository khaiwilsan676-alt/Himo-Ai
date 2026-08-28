// ==========================================
// HIMO CLEAN KNOWLEDGE & WEB SEARCH ENGINE
// ==========================================

export async function fetchLiveWebData(query) {
  if (!query) return null;

  // Clean query: remove filler words like 'kya hai', 'what is', 'tell me about'
  let cleanQuery = query
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim();

  const entityQuery = cleanQuery
    .replace(/\b(kya hai|kya hota hai|batao|kisko bolte hai|what is|define|who is|tell me about|explain)\b/gi, '')
    .replace(/[?!.,]/g, '')
    .trim();

  const searchQuery = entityQuery.length > 1 ? entityQuery : cleanQuery;

  try {
    // 1. Direct Wikipedia REST Summary API (Super fast & ultra clean definition)
    const summaryRes = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchQuery)}`
    );

    if (summaryRes.ok) {
      const data = await summaryRes.json();
      if (data.extract && data.type !== "disambiguation") {
        return `**${data.title}**\n\n${data.extract}`;
      }
    }

    // 2. Fallback Search API if direct page not found
    const searchRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchQuery)}&utf8=&format=json&origin=*`
    );

    if (searchRes.ok) {
      const sData = await searchRes.json();
      const results = sData?.query?.search || [];

      if (results.length > 0) {
        const topResult = results[0];
        // Fetch direct summary of top matched page
        const topPageRes = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topResult.title)}`
        );

        if (topPageRes.ok) {
          const topData = await topPageRes.json();
          if (topData.extract) {
            return `**${topData.title}**\n\n${topData.extract}`;
          }
        }

        // Clean raw snippet fallback
        let cleanSnippet = topResult.snippet
          .replace(/<[^>]+>/g, '')
          .replace(/Wikipedia|Britannica|Dictionary/gi, '')
          .replace(/\s{2,}/g, ' ')
          .trim();

        return `**${topResult.title}**\n\n${cleanSnippet}.`;
      }
    }
  } catch (err) {
    console.error("Web Search Error:", err);
  }

  return `Himo:\n\n'${cleanQuery}' ke baare mein koi seedhi jaankari nahi mili. Please topic ka specific naam likhein.`;
}
