import { NextResponse } from "next/server"

function cleanText(value = "") {
  return String(value).replace(/<[^>]*>/g, " ").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\\s+/g, " ").trim()
}

export async function GET(request) {
  const query = request.nextUrl.searchParams.get("q")?.trim()
  if (!query) return NextResponse.json({ answer: "Please enter a search query.", results: [] }, { status: 400 })
  try {
    const url = "https://html.duckduckgo.com/html/?q=" + encodeURIComponent(query)
    const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; Himo/17.1)" }, cache: "no-store" })
    if (!response.ok) throw new Error("Search request failed")
    const html = await response.text()
    const results = []
    const blocks = html.match(/<div class="result results_links results_links_deep web-result">[\\s\\S]*?<\\/div>\\s*<\\/div>/g) || []
    for (const block of blocks.slice(0, 5)) {
      const titleMatch = block.match(/<a[^>]*class="result__a"[^>]*>([\\s\\S]*?)<\\/a>/)
      const snippetMatch = block.match(/<a[^>]*class="result__snippet"[^>]*>([\\s\\S]*?)<\\/a>|<div[^>]*class="result__snippet"[^>]*>([\\s\\S]*?)<\\/div>/)
      const linkMatch = block.match(/<a[^>]*class="result__a"[^>]*href="([^"]+)"/)
      const title = cleanText(titleMatch?.[1] || "")
      const snippet = cleanText(snippetMatch?.[1] || snippetMatch?.[2] || "")
      const link = linkMatch?.[1] || ""
      if (title || snippet) results.push({ title, snippet, link })
    }
    const answer = results.length ? results.map((r, i) => (i + 1) + ". " + r.title + (r.snippet ? "\n" + r.snippet : "")).join("\n\n") : "I couldn't find a useful result for that search."
    return NextResponse.json({ answer, results })
  } catch {
    return NextResponse.json({ answer: "Web search is temporarily unavailable. I can still answer normally without search.", results: [] })
  }
}
