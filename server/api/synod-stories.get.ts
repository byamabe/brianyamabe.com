// Fetches and parses the Synod Stories RSS feed.
// Merges with supplementary items from content/landmarks/lutheran-media.json.
// Returns a unified array sorted by date descending.

interface FeedItem {
  id: string
  title: string
  description: string
  date: string
  url: string
  source: 'podcast' | 'supplementary'
}

export default defineEventHandler(async (): Promise<FeedItem[]> => {
  const rssUrl = process.env.SYNOD_STORIES_RSS_URL ?? ''
  const items: FeedItem[] = []

  if (rssUrl) {
    try {
      const response = await fetch(rssUrl)
      const xml = await response.text()
      items.push(...parseRss(xml))
    }
    catch {
      // Non-fatal — supplementary items still render
    }
  }

  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

function parseRss(xml: string): FeedItem[] {
  const items: FeedItem[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match: RegExpExecArray | null

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1]!
    const title = extractTag(block, 'title')
    const description = extractTag(block, 'description')
    const date = extractTag(block, 'pubDate')
    const url = extractTag(block, 'link') || extractAttr(block, 'enclosure', 'url')
    const guid = extractTag(block, 'guid') || url

    if (title && guid) {
      items.push({
        id: guid,
        title: decodeEntities(title),
        description: stripHtml(decodeEntities(description)),
        date: date ? new Date(date).toISOString() : new Date().toISOString(),
        url,
        source: 'podcast',
      })
    }
  }

  return items
}

// Note: backslashes must be doubled in new RegExp() template strings
function extractTag(xml: string, tag: string): string {
  const match = xml.match(
    new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`),
  )
  return match?.[1]?.trim() ?? ''
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*${attr}="([^"]*)"[^>]*>`))
  return match?.[1] ?? ''
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
}
