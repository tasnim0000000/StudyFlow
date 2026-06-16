/** Strip HTML tags for plain-text search */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

/** Extract course codes like CS301, MATH205 from text */
export function extractCourseCodes(text: string): string[] {
  const matches = text.match(/\b[A-Z]{2,4}\d{3}\b/gi) ?? []
  return matches.map((m) => m.toUpperCase())
}

/** Normalize searchable text */
function normalize(text: string): string {
  return text.toLowerCase().trim()
}

/**
 * Match query against one or more fields.
 * Supports partial matches, course codes (CS301), and multi-word queries.
 */
export function matchesSearch(query: string, ...fields: (string | null | undefined)[]): boolean {
  const q = normalize(query)
  if (!q) return false

  const searchable = fields
    .filter(Boolean)
    .flatMap((f) => {
      const text = f!
      const codes = extractCourseCodes(text)
      return [text, ...codes]
    })
    .map(normalize)

  // Direct substring match on any field
  if (searchable.some((s) => s.includes(q))) return true

  // Course code exact/prefix match (e.g. "cs301" matches "CS301 Web Dev")
  const qUpper = q.toUpperCase()
  if (/^[a-z]{2,4}\d{0,3}$/i.test(q)) {
    return searchable.some((s) => {
      const codes = extractCourseCodes(s)
      return codes.some((code) => code.startsWith(qUpper) || code.includes(qUpper))
    })
  }

  // Multi-word: all tokens must appear somewhere across fields combined
  const tokens = q.split(/\s+/).filter(Boolean)
  if (tokens.length > 1) {
    const combined = searchable.join(' ')
    return tokens.every((t) => combined.includes(t))
  }

  return false
}
