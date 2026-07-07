export type ShapeClass = 'tall' | 'small' | 'tail'

export interface Stats {
  played: number
  won: number
  currentStreak: number
  maxStreak: number
  /** dist[i] = wins in i+1 turns (0..11); dist[12] = losses/concedes */
  dist: number[]
  lastWonDay: number | null
  lastPlayedDay: number | null
}

export type GameStatus = 'playing' | 'won' | 'lost'
