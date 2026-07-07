import { TURN_BUDGET } from '../game/generate'
import type { HelperState } from '../state/reducer'

interface Props {
  helpers: HelperState
  turnsUsed: number
  onSwap: () => void
  onBlank: () => void
}

export function HelperBar({ helpers, turnsUsed, onSwap, onBlank }: Props) {
  return (
    <div className="helperbar">
      <span className="turnmeter" aria-label={`${turnsUsed} of ${TURN_BUDGET} turns used`}>
        {Array.from({ length: TURN_BUDGET }, (_, i) => (
          <span key={i} className={i < turnsUsed ? 'tpip tpip-used' : 'tpip'} />
        ))}
      </span>
      <div className="helper-buttons">
        <button className="helper" disabled={!helpers.swap} onClick={onSwap} title="Swap up to 3 tiles (free turn)">
          ⇄ swap
        </button>
        <button className="helper" disabled={!helpers.blank} onClick={onBlank} title="Turn a tile into a wildcard">
          ★ blank
        </button>
        <span className={`helper helper-static ${helpers.reroll ? '' : 'helper-off'}`} title="Tap ↻ on a goal card to replace it">
          ↻ reroll
        </span>
      </div>
    </div>
  )
}
