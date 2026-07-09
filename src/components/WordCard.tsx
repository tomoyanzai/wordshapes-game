import type { KeyboardEvent } from 'react'
import type { PuzzleWord, Tier } from '../game/types'

const TIER_PIPS: Record<Tier, string> = {
  'joins-it': '●●●',
  'same-world': '●●',
  'far-away': '○',
}

const TIER_LABEL: Record<Tier, string> = {
  'joins-it': 'joins it',
  'same-world': 'same world',
  'far-away': 'far away',
}

interface Props {
  word: PuzzleWord
  probed: boolean
  disabled: boolean
  onProbe: () => void
}

export function WordCard({ word, probed, disabled, onProbe }: Props) {
  const activate = () => {
    if (disabled || probed) return
    onProbe()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault()
      activate()
    }
  }

  return (
    <div
      className={`card tier-${word.tier} ${probed ? 'flipped' : ''}`}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={probed}
      aria-disabled={disabled}
      aria-label={`Probe the word ${word.word}`}
      onClick={activate}
      onKeyDown={onKeyDown}
    >
      <div className="card-inner">
        <div className="card-face card-front">
          <span className="word">{word.word}</span>
        </div>
        <div className="card-face card-back">
          <span className="back-word">{word.word}</span>
          <span className="pips" aria-hidden="true">
            {TIER_PIPS[word.tier]}
          </span>
          <span className="tier-label">{TIER_LABEL[word.tier]}</span>
        </div>
      </div>
    </div>
  )
}
