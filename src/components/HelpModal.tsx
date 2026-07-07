import { GOALS_TO_WIN, TURN_BUDGET } from '../game/generate'

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
          Build words on the board, crossword-style, to clear{' '}
          <strong>{GOALS_TO_WIN} goal cards</strong> in at most <strong>{TURN_BUDGET} plays</strong>.
          Everyone gets the same board, tiles and goals each day.
        </p>
        <ul className="help-list">
          <li>Tap a tile, then tap a square. Tap a placed tile to take it back.</li>
          <li>Your first word must cover the <strong>✦ center</strong>. After that, every word must connect — and all crossings must be real words.</li>
          <li>Only the <strong>3 visible goals</strong> can be cleared. One play can clear several at once.</li>
          <li>Three one-time helpers: <strong>⇄ swap</strong> up to 3 tiles (free), <strong>↻ reroll</strong> a goal card, <strong>★ blank</strong> turns a tile into any letter.</li>
        </ul>
        <p className="help-fine">
          Win or lose, tap any word you played to learn what it means. Some goal cards care about a
          word&rsquo;s <em>shape</em> — tall letters (b d f h k l t), small ones, and letters with
          tails (g j p q y).
        </p>
      </div>
    </div>
  )
}
