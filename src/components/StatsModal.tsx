import type { Stats } from '../game/types'

interface Props {
  stats: Stats
  onClose: () => void
}

export function StatsModal({ stats, onClose }: Props) {
  const winPct = stats.played > 0 ? Math.round((100 * stats.won) / stats.played) : 0
  const maxDist = Math.max(1, ...stats.dist)

  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="statsTitle">
        <button className="modal-close" type="button" aria-label="Close" onClick={onClose}>
          ✕
        </button>
        <h2 id="statsTitle">Statistics</h2>
        <div className="stats-grid">
          <div>
            <strong>{stats.played}</strong>
            <span>played</span>
          </div>
          <div>
            <strong>{winPct}</strong>
            <span>win %</span>
          </div>
          <div>
            <strong>{stats.currentStreak}</strong>
            <span>streak</span>
          </div>
          <div>
            <strong>{stats.maxStreak}</strong>
            <span>max</span>
          </div>
        </div>
        <div className="dist">
          {stats.dist.map((n, i) => (
            <div className="dist-row" key={i}>
              <span className="dist-label">{i + 1}</span>
              <span className="dist-bar" style={{ width: `${Math.max(7, (100 * n) / maxDist)}%` }}>
                {n}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
