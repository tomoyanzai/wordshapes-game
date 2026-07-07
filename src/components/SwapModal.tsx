import { useState } from 'react'
import type { Tile } from '../game/tiles'

interface Props {
  rack: Tile[]
  onConfirm: (tileIds: string[]) => void
  onClose: () => void
}

export function SwapModal({ rack, onConfirm, onClose }: Props) {
  const [picked, setPicked] = useState<string[]>([])
  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length < 3 ? [...p, id] : p))

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" aria-label="Close" onClick={onClose}>
          ✕
        </button>
        <h2>Swap tiles</h2>
        <p>Pick up to 3 tiles to trade for fresh ones. Costs no turn — but you only get one swap per day.</p>
        <div className="swap-rack">
          {rack.map((t) => (
            <button
              key={t.id}
              className={`rtile ${picked.includes(t.id) ? 'rtile-selected' : ''}`}
              onClick={() => toggle(t.id)}
            >
              {t.letter === '?' ? '★' : t.letter}
            </button>
          ))}
        </div>
        <button className="btn-primary" disabled={picked.length === 0} onClick={() => onConfirm(picked)}>
          Swap {picked.length || ''} tile{picked.length === 1 ? '' : 's'}
        </button>
      </div>
    </div>
  )
}
