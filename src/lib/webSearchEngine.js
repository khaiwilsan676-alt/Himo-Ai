export async function fetchLiveWebData(query) {
  if (!query) return null;

  const cleanQuery = query
    .replace(/\b(kya hai|kya hota hai|batao|kisko bolte hai|what is|define|who is|tell me about|explain|meaning of)\b/gi, '')
    .replace(/[?!.,]/g, '')
    .trim();

  const target = cleanQuery.length > 1 ? cleanQuery : query.trim();

  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(target)}`
    );

    if (res.ok) {
      const data = await res.json();
      if (data.extract && data.type !== "disambiguation") {
        return `**${data.title}**\n\n${data.extract}`;
      }
    }

    // Search query fallback
    const searchRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(target)}&utf8=&format=json&origin=*`
    );

    if (searchRes.ok) {
      const sData = await searchRes.json();
      const results = sData?.query?.search || [];

      if (results.length > 0) {
        const topResult = results[0];
        const topPageRes = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topResult.title)}`
        );

        if (topPageRes.ok) {
          const topData = await topPageRes.json();
          if (topData.extract) {
            return `**${topData.title}**\n\n${topData.extract}`;
          }
        }

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

  return null;
}
