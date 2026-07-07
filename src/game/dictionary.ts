let dict: Set<string> | null = null
let loading: Promise<void> | null = null

/**
 * The 157k-word dictionary (2–9 letters) loads as its own async chunk so
 * it never blocks first paint. Kick this off at app start; the UI gates
 * Submit on `dictionaryReady()` — there is deliberately NO optimistic
 * fallback here, because an invalid word would be committed to the board
 * permanently.
 */
export function preloadDictionary(): Promise<void> {
  loading ??= import('../data/dictionary').then((m) => {
    dict = new Set(m.DICTIONARY_RAW.split('\n'))
  })
  return loading
}

export function dictionaryReady(): boolean {
  return dict !== null
}

export function isValidWord(word: string): boolean {
  return dict !== null && dict.has(word)
}
