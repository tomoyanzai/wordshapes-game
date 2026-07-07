// Decorative education layer: never used for validation, never blocks
// play. Definitions come from the free dictionaryapi.dev with a small
// localStorage cache; every failure path resolves to null.

const CACHE_KEY = 'wordgather:v1:defs'
const CACHE_MAX = 200

type Cache = Record<string, string>

function readCache(): Cache {
  try {
    return (JSON.parse(localStorage.getItem(CACHE_KEY) ?? '{}') as Cache) ?? {}
  } catch {
    return {}
  }
}

function writeCache(cache: Cache): void {
  try {
    const keys = Object.keys(cache)
    if (keys.length > CACHE_MAX) {
      for (const k of keys.slice(0, keys.length - CACHE_MAX)) delete cache[k]
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {
    // non-fatal
  }
}

export function cachedDefinition(word: string): string | null {
  return readCache()[word] ?? null
}

export async function getDefinition(word: string): Promise<string | null> {
  const hit = cachedDefinition(word)
  if (hit !== null) return hit
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 3000)
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, {
      signal: ctrl.signal,
    })
    clearTimeout(timer)
    if (!res.ok) return null
    const data = (await res.json()) as Array<{
      meanings?: Array<{ partOfSpeech?: string; definitions?: Array<{ definition?: string }> }>
    }>
    const meaning = data[0]?.meanings?.[0]
    const text = meaning?.definitions?.[0]?.definition
    if (text === undefined) return null
    const pos = meaning?.partOfSpeech
    const def = pos !== undefined ? `(${pos}) ${text}` : text
    const cache = readCache()
    cache[word] = def
    writeCache(cache)
    return def
  } catch {
    return null
  }
}
