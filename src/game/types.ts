export type ShapeClass = 'tall' | 'small' | 'tail'

export type Mark = 'hit' | 'near' | 'miss'

export interface Puzzle {
  /** 4–7 lowercase a-z letters */
  word: string
  /** One-line, crossword-crisp definition. Never contains the answer. */
  clue: string
  exampleSentence: string
  /** Rough difficulty tag, shown in the dossier for learners */
  level: 'A2' | 'B1' | 'B2' | 'C1'
  /** Why the word's shape fits its meaning — shown when the word is iconic */
  shapeNote?: string
  /** 0-based letters that carry the shape-meaning resemblance */
  iconicIndices?: number[]
  /** Future first-language glosses, e.g. { ja: "にじむ" } */
  translations: Record<string, string>
}

export interface Stats {
  played: number
  won: number
  currentStreak: number
  maxStreak: number
  /** dist[i] = wins in i+1 guesses */
  dist: [number, number, number, number, number, number]
  lastWonPuzzle: number | null
  lastPlayedPuzzle: number | null
}

export type GameStatus = 'playing' | 'won' | 'lost'

/** What persists for the in-progress / finished day */
export interface GameSave {
  puzzleNo: number
  guesses: string[]
  status: GameStatus
}
