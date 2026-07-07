import { silhouette } from '../game/shapes'

/**
 * The day's signature clue: the word's letterform skeleton. Each column
 * shows where its letter lives — rising above the x-height band (tall),
 * inside it (small), or dropping below the baseline (tail).
 */
export function Silhouette({ word }: { word: string }) {
  return (
    <div className="silhouette" aria-label={`word shape, ${word.length} letters`}>
      {silhouette(word).map((cls, i) => (
        <span key={i} className="sil-col">
          <span className={`sil-seg ${cls === 'tall' ? 'sil-on' : ''}`} />
          <span className="sil-seg sil-on" />
          <span className={`sil-seg ${cls === 'tail' ? 'sil-on' : ''}`} />
        </span>
      ))}
    </div>
  )
}
