import type { Mark } from './types'

/**
 * Classic Wordle marking with correct duplicate-letter handling:
 * exact matches claim their letters first, then remaining letters fund
 * "near" marks left to right until exhausted.
 */
export function evaluateGuess(guess: string, answer: string): Mark[] {
  const n = answer.length
  const marks: Mark[] = Array(n).fill('miss')
  const remaining: Record<string, number> = {}

  for (let i = 0; i < n; i++) {
    if (guess[i] === answer[i]) {
      marks[i] = 'hit'
    } else {
      remaining[answer[i]] = (remaining[answer[i]] ?? 0) + 1
    }
  }
  for (let i = 0; i < n; i++) {
    if (marks[i] === 'miss' && (remaining[guess[i]] ?? 0) > 0) {
      marks[i] = 'near'
      remaining[guess[i]]--
    }
  }
  return marks
}

const RANK: Record<Mark, number> = { miss: 0, near: 1, hit: 2 }

/** Best-known state per letter across all submitted guesses (colors the keyboard). */
export function keyStates(guesses: string[], answer: string): Record<string, Mark> {
  const out: Record<string, Mark> = {}
  for (const guess of guesses) {
    const marks = evaluateGuess(guess, answer)
    for (let i = 0; i < guess.length; i++) {
      const prev = out[guess[i]]
      if (prev === undefined || RANK[marks[i]] > RANK[prev]) out[guess[i]] = marks[i]
    }
  }
  return out
}
