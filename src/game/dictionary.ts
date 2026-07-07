import { PUZZLE_WORDS } from '../data/puzzles'

let dict: Set<string> | null = null
let loading: Promise<void> | null = null

/**
 * The 74k-word guess dictionary loads as its own async chunk so it never
 * blocks first paint. Kick this off at app start.
 */
export function preloadDictionary(): Promise<void> {
  loading ??= import('../data/dictionary').then((m) => {
    dict = new Set(m.DICTIONARY_RAW.split('\n'))
  })
  return loading
}

/** Valid guesses: every puzzle answer, plus the bundled 4–7 letter dictionary. */
export function isValidWord(word: string): boolean {
  if (PUZZLE_WORDS.has(word)) return true
  // dictionary still in flight (first seconds of a cold load): don't block play
  return dict === null ? true : dict.has(word)
}
