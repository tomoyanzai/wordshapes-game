interface Props {
  onClose: () => void
}

export function HowToModal({ onClose }: Props) {
  return (
    <div
      className="howto-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="howto" role="dialog" aria-modal="true" aria-labelledby="howtoTitle">
        <h2 id="howtoTitle">How to play</h2>

        <div className="howto-step">
          <div className="howto-visual" aria-hidden="true">
            <div className="mini-card facedown">?</div>
          </div>
          <p>There is a secret word. You can&rsquo;t see it.</p>
        </div>

        <div className="howto-step">
          <div className="howto-visual" aria-hidden="true">
            <div className="mini-flip">
              <div className="mini-flip-inner">
                <div className="mini-face mini-front">bow</div>
                <div className="mini-face mini-back">
                  <span className="mini-pips">●●●</span>
                  <span className="mini-tier">joins it</span>
                </div>
              </div>
            </div>
            <p className="mini-caption">rain + bow = rainbow</p>
          </div>
          <p>
            Tap a word. ●●● means it JOINS the secret into a real word or phrase — like rain + bow = rainbow.
          </p>
        </div>

        <div className="howto-step">
          <div className="howto-visual" aria-hidden="true">
            <div className="mini-dots">
              <span className="md" />
              <span className="md" />
              <span className="md" />
              <span className="md" />
              <span className="md" />
              <span className="md" />
              <span className="md-check">✓</span>
            </div>
          </div>
          <p>You have 6 taps. Then name the secret — one chance.</p>
        </div>

        <button className="howto-go" type="button" onClick={onClose}>
          Got it — play
        </button>
      </div>
    </div>
  )
}
