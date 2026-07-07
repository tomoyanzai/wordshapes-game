import { useEffect, useState } from 'react'
import { getDefinition } from '../game/definitions'

interface Props {
  word: string
  onClose: () => void
}

export function DefinitionSheet({ word, onClose }: Props) {
  const [def, setDef] = useState<string | null | 'loading'>('loading')

  useEffect(() => {
    let live = true
    setDef('loading')
    void getDefinition(word).then((d) => {
      if (live) setDef(d)
    })
    return () => {
      live = false
    }
  }, [word])

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <p className="sheet-word">{word}</p>
        <p className="sheet-def">
          {def === 'loading' ? 'Looking it up…' : def ?? 'No definition available right now.'}
        </p>
        <button className="btn-primary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}
