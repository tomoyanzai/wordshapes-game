export type Tier = 'joins-it' | 'same-world' | 'far-away'

export interface PuzzleWord {
  word: string
  tier: Tier
  note: string
  phrase?: string
}

export interface Puzzle {
  id: string
  secret: string
  /** lowercased accepted answers (includes secret) */
  accept: string[]
  /** e.g. "a TIME" */
  clue: string
  /** exactly 16 */
  words: PuzzleWord[]
  /** exactly 6 answer options (includes secret + planted decoys) */
  wheel: string[]
  winNote: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface Stats {
  played: number
  won: number
  currentStreak: number
  maxStreak: number
  /** dist[i] = wins using i+1 probes (length 6); losses tracked separately */
  dist: number[]
  losses: number
  lastWonDay: number | null
  lastPlayedDay: number | null
}

export type GameStatus = 'playing' | 'won' | 'lost'
