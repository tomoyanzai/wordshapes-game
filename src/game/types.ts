export type CefrLevel = 'A1' | 'A2' | 'B1'

export interface IconicInfo {
  /** One-line playful mnemonic, e.g. "b and d are the bed posts!" */
  hint: string
  /** 0-based indices into `word` of the letters that resemble the meaning */
  letterIndices: number[]
}

export interface Word {
  /** Stable slug (the word itself) — never renumbered, keys saved progress */
  id: string
  word: string
  definition: string
  emoji: string
  exampleSentence: string
  cefrLevel: CefrLevel
  tags: string[]
  iconic?: IconicInfo
  /** Future glosses, e.g. { ja: "ベッド" } — empty for MVP */
  translations: Record<string, string>
}

export interface WordProgress {
  /** Leitner box 1..5 (5 = mastered) */
  box: number
  /** Local day number (days since epoch) when the word is due again */
  nextDueDay: number
  timesSeen: number
  timesCorrect: number
  firstSeenDay: number
}

export interface PlayerState {
  version: 1
  xp: number
  streak: number
  bestStreak: number
  /** Local "YYYY-MM-DD" of the last completed daily pack */
  lastCompletedPackDate: string | null
  wordProgress: Record<string, WordProgress>
  settings: { reducedMotion: boolean }
}

export type QuestionType = 'defToWord' | 'wordToDef'

export interface Question {
  type: QuestionType
  word: Word
  /** Exactly 4 options including `word`, in display order */
  options: Word[]
  isReview: boolean
}
