interface Props {
  onPick: (letter: string) => void
  onClose: () => void
}

const LETTERS = 'abcdefghijklmnopqrstuvwxyz'

export function BlankPickerModal({ onPick, onClose }: Props) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" aria-label="Close" onClick={onClose}>
          ✕
        </button>
        <h2>Blank tile</h2>
        <p>Choose the letter this blank plays as:</p>
        <div className="blank-grid">
          {[...LETTERS].map((ch) => (
            <button key={ch} className="rtile" onClick={() => onPick(ch)}>
              {ch}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
