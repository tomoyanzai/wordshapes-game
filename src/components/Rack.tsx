import type { Placement } from '../game/board'
import type { Tile } from '../game/tiles'

interface Props {
  rack: Tile[]
  pending: Placement[]
  selectedTileId: string | null
  onSelect: (tileId: string) => void
}

export function Rack({ rack, pending, selectedTileId, onSelect }: Props) {
  const used = new Set(pending.map((p) => p.tile.id))
  return (
    <div className="rack" aria-label="your tiles">
      {rack.map((t) => {
        const isUsed = used.has(t.id)
        return (
          <button
            key={t.id}
            className={[
              'rtile',
              t.letter === '?' ? 'rtile-blank' : '',
              selectedTileId === t.id ? 'rtile-selected' : '',
              isUsed ? 'rtile-used' : '',
            ].join(' ')}
            disabled={isUsed}
            onClick={() => onSelect(t.id)}
          >
            {t.letter === '?' ? '★' : t.letter}
          </button>
        )
      })}
    </div>
  )
}
