import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { createRng, seededShuffle } from '../game/rng'
import type { Puzzle } from '../game/types'

interface Props {
  puzzle: Puzzle
  forced: boolean
  onSubmit: (value: string) => void
  onClose: () => void
}

export function AnswerSheet({ puzzle, forced, onSubmit, onClose }: Props) {
  const [value, setValue] = useState('')
  const [selectedChip, setSelectedChip] = useState<string | null>(null)
  const [entering, setEntering] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  // the wheel array's first entry is always the secret in the data file —
  // shuffle per puzzle so display order never gives it away
  const chips = useMemo(() => seededShuffle(puzzle.wheel, createRng(`${puzzle.id}:wheel`)), [puzzle])

  useEffect(() => {
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => setEntering(false))
      return () => cancelAnimationFrame(raf2)
    })
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 60)
    return () => {
      cancelAnimationFrame(raf1)
      clearTimeout(focusTimer)
    }
  }, [])

  useEffect(() => {
    if (forced) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [forced, onClose])

  const pickChip = (word: string) => {
    if (selectedChip === word) {
      setSelectedChip(null)
      setValue('')
    } else {
      setSelectedChip(word)
      setValue(word)
    }
    inputRef.current?.focus()
  }

  const handleInput = (v: string) => {
    setValue(v)
    if (selectedChip !== null && v !== selectedChip) setSelectedChip(null)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed.length === 0) return
    onSubmit(trimmed)
  }

  return (
    <div
      className={`sheet-overlay ${entering ? 'entering' : ''} ${forced ? 'forced' : ''}`}
      onClick={(e) => {
        if (forced) return
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheetTitle">
        {!forced && (
          <button className="sheet-close" type="button" aria-label="Close" onClick={onClose}>
            ✕
          </button>
        )}
        <h2 id="sheetTitle">Name the word</h2>
        {forced && <p className="forced-note">All six probes used — this is your answer.</p>}
        <form onSubmit={submit} autoComplete="off">
          <input
            ref={inputRef}
            className="guess-input"
            type="text"
            placeholder="type the word…"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="Type your answer"
            value={value}
            onChange={(e) => handleInput(e.target.value)}
          />
          <p className="or-choose">or choose:</p>
          <div className="chip-row">
            {chips.map((word) => (
              <button
                key={word}
                type="button"
                className="chip"
                aria-pressed={selectedChip === word}
                onClick={() => pickChip(word)}
              >
                {word}
              </button>
            ))}
          </div>
          <p className="warning">One attempt. Make it count.</p>
          <button className="confirm-btn" type="submit" disabled={value.trim().length === 0}>
            Confirm
          </button>
        </form>
      </div>
    </div>
  )
}
