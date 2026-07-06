import type { Word } from '../game/types'

interface Props {
  word: Word
  onContinue: () => void
}

/**
 * The "aha" interstitial: the word rendered letter by letter, with the
 * shape-carrying letters pulsing while the rest dim, the emoji floating
 * in above, and the mnemonic hint below. Pure CSS keyframes; respects
 * prefers-reduced-motion via the stylesheet.
 */
export function IconicReveal({ word, onContinue }: Props) {
  const iconic = word.iconic
  if (!iconic) return null

  return (
    <section className="reveal">
      <p className="reveal-kicker">✨ Look at the shape!</p>
      <span className="reveal-emoji" aria-hidden="true">
        {word.emoji}
      </span>
      <div className="reveal-word" aria-label={word.word}>
        {[...word.word].map((ch, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={iconic.letterIndices.includes(i) ? 'reveal-letter reveal-letter-iconic' : 'reveal-letter'}
            style={{ animationDelay: `${150 + i * 90}ms` }}
          >
            {ch}
          </span>
        ))}
      </div>
      <p className="reveal-hint">{iconic.hint}</p>
      <button className="btn btn-primary" autoFocus onClick={onContinue}>
        Nice! Continue
      </button>
    </section>
  )
}
