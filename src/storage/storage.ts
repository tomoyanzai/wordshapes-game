import { emptyStats } from '../game/stats'
import type { GameSave, Stats } from '../game/types'

const GAME_KEY = 'wordshapes:v2:game'
const STATS_KEY = 'wordshapes:v2:stats'
const HELP_KEY = 'wordshapes:v2:seenHelp'

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? null : (JSON.parse(raw) as T)
  } catch {
    return null
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // private mode / quota: play on in memory
  }
}

/** Returns the saved board only if it belongs to today's puzzle. */
export function loadGameSave(puzzleNo: number): GameSave | null {
  const save = read<GameSave>(GAME_KEY)
  return save !== null && save.puzzleNo === puzzleNo && Array.isArray(save.guesses) ? save : null
}

export function saveGame(save: GameSave): void {
  write(GAME_KEY, save)
}

export function loadStats(): Stats {
  const stats = read<Stats>(STATS_KEY)
  return stats !== null && Array.isArray(stats.dist) ? { ...emptyStats(), ...stats } : emptyStats()
}

export function saveStats(stats: Stats): void {
  write(STATS_KEY, stats)
}

export function hasSeenHelp(): boolean {
  try {
    return localStorage.getItem(HELP_KEY) === '1'
  } catch {
    return true
  }
}

export function markHelpSeen(): void {
  try {
    localStorage.setItem(HELP_KEY, '1')
  } catch {
    // non-fatal
  }
}
