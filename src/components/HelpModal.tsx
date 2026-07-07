interface Props {
  onClose: () => void
}

export function HelpModal({ onClose }: Props) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" aria-label="Close" onClick={onClose}>
          ✕
        </button>
        <h2>How to play</h2>
        <p>
          Find the day&rsquo;s word in <strong>6 guesses</strong>. You get two clues: a short{' '}
          <strong>definition</strong>, and the word&rsquo;s <strong>silhouette</strong> — the shape its
          letters make on the line.
        </p>
        <div className="help-shapes">
          <div>
            <span className="help-glyph">▲</span> tall letters — <em>b d f h k l t</em>
          </div>
          <div>
            <span className="help-glyph">■</span> small letters — <em>a c e i m n o r s u v w x z</em>
          </div>
          <div>
            <span className="help-glyph">▼</span> letters with a tail — <em>g j p q y</em>
          </div>
        </div>
        <p>
          Every guess must be a real word that <strong>fits the silhouette</strong> — the keyboard
          only lights up letters with the right shape. After each guess:{' '}
          <span className="chip chip-hit">green</span> right letter, right spot ·{' '}
          <span className="chip chip-near">yellow</span> in the word, wrong spot ·{' '}
          <span className="chip chip-miss">dark</span> not in the word.
        </p>
        <p className="help-fine">
          One word a day, the same for everyone. Win or lose, you leave knowing a word — some of
          them literally look like what they mean.
        </p>
      </div>
    </div>
  )
}
