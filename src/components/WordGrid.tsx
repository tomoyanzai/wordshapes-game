import { useMemo } from 'react'
import { createRng, seededShuffle } from '../game/rng'
import type { Puzzle } from '../game/types'
import { WordCard } from './WordCard'

interface Props {
  puzzle: Puzzle
  /** indices into puzzle.words, in probe order */
  probeOrder: number[]
  locked: boolean
  onProbe: (index: number) => void
}

/**
 * The board words are stored tier-grouped (joins-it first) in the data file,
 * so tier order can't drive the grid — that would leak the answer at a
 * glance. Shuffle deterministically per puzzle instead, so the layout is
 * stable across reloads of the same day but not predictable in advance.
 */
export function WordGrid({ puzzle, probeOrder, locked, onProbe }: Props) {
  const order = useMemo(() => {
    const indices = puzzle.words.map((_, i) => i)
    return seededShuffle(indices, createRng(`${puzzle.id}:grid`))
  }, [puzzle])

  const probed = useMemo(() => new Set(probeOrder), [probeOrder])

  return (
    <div className="grid">
      {order.map((index) => (
        <WordCard
          key={index}
          word={puzzle.words[index]}
          probed={probed.has(index)}
          disabled={locked || probed.has(index)}
          onProbe={() => onProbe(index)}
        />
      ))}
    </div>
  )
}
