import { emptyStats } from '../game/stats'
import type { Stats } from '../game/types'
import type { GameSlice } from '../state/reducer'

const GAME_KEY = 'wordgather:tw:v1:game'
const STATS_KEY = 'wordgather:tw:v1:stats'
const HELP_KEY = 'wordgather:tw:v1:seenHelp'

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

/** Returns the saved game only if it belongs to the given day. */
export function loadGameSave(dayNo: number): GameSlice | null {
  const save = read<GameSlice>(GAME_KEY)
  return save !== null && save.dayNo === dayNo ? save : null
}

export function saveGame(slice: GameSlice): void {
  write(GAME_KEY, slice)
}

export function loadStats(): Stats {
  const stats = read<Stats>(STATS_KEY)
  return stats !== null && Array.isArray(stats.dist) && stats.dist.length === 6
    ? { ...emptyStats(), ...stats }
    : emptyStats()
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
