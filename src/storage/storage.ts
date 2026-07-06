import type { PlayerState } from '../game/types'

const KEY = 'wordshapes:v1'

export function freshPlayerState(): PlayerState {
  return {
    version: 1,
    xp: 0,
    streak: 0,
    bestStreak: 0,
    lastCompletedPackDate: null,
    wordProgress: {},
    settings: { reducedMotion: false },
  }
}

/** Corruption or version mismatch falls back to a fresh state rather than crashing. */
export function loadPlayerState(): PlayerState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw === null) return freshPlayerState()
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return freshPlayerState()
    if ((parsed as { version?: unknown }).version !== 1) return freshPlayerState()
    return { ...freshPlayerState(), ...(parsed as Partial<PlayerState>), version: 1 }
  } catch {
    return freshPlayerState()
  }
}

export function savePlayerState(state: PlayerState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // quota/private-mode failures are non-fatal: the game keeps playing in memory
  }
}
