# WordShapes

**One word a day. You know its meaning — and its shape.**

WordShapes is a daily word-deduction game built on a finding from cognitive science: some written words visually resemble what they mean. *bed* has a post at each end. *droop* sags into the tail of its own p. The game turns the **silhouette of a word** — the skeleton its letters make on the line — into a playable clue.

> Inspired by Sidhu, D. M. (2026). *The word "bed" looks like a bed: Orthographic iconicity in English.* **Cognition**. The shape notes in the game are playful mnemonics in that paper's spirit, not linguistic claims.

## The game

Everyone gets the same word each day. Two clues:

- a one-line, crossword-crisp **definition** — *"to flow out slowly, like honey from a spoon"*
- the word's **silhouette**: `■■■■` — which letters rise tall (▲), sit small (■), or drop a tail (▼)

Six guesses. Every guess must be a real word that **fits the silhouette** — the keyboard only lights up letters with the right shape for the next position (tall `b d f h k l t`, tail `g j p q y`, small the rest). Feedback is the familiar green / yellow / dark.

Win or lose, the word's **dossier** opens: meaning, example, difficulty level, and — when the word is one of the shape-iconic ones — why it looks like what it means. Then the spoiler-free share grid, with the silhouette row as its signature:

```
WordShapes #1 2/6
■■■■
⬛⬛🟨⬛
🟩🟩🟩🟩
```

Retention is Wordle-grammar: daily scarcity, streaks, a solve-distribution histogram, and a share artifact that markets the game every time it's posted. The education is smuggled in after the fun — ESL learners (the schema carries a `translations` field for future first-language glosses) and native speakers play the exact same puzzle.

## Run it

```bash
npm install
npm run dev       # play at http://localhost:5173
npm test          # 46 unit tests over the pure game logic
npm run build     # typecheck + production bundle
```

Dev-only trick: append `?today=2026-07-09` to the URL to time-travel — test streaks and future puzzles without waiting for real tomorrows.

## Architecture

Vite + React + TypeScript, mobile-first, no backend — progress lives in `localStorage`. All rules are pure TypeScript in `src/game/`, fully unit-tested and free of clock access (date strings are passed in):

- `shapes.ts` — the letterform classes and silhouette logic (the game's identity)
- `feedback.ts` — Wordle-style marking with correct duplicate-letter handling
- `daily.ts` — deterministic puzzle-of-the-day (`EPOCH_DATE` + curated rotation)
- `stats.ts` / `share.ts` — streaks, distribution, and the share grid
- `state/reducer.ts` — the whole app as one pure state machine
- `data/puzzles.ts` — the curated daily rotation (60 words, ~25 shape-iconic), guarded by a dataset test
- `data/dictionary.ts` — generated 74k-word guess list (lazy-loaded chunk); rebuild with `node scripts/build-dict.mjs`

### Adding a puzzle

Append to `src/data/puzzles.ts` (the rotation wraps, so order = calendar order):

```ts
p('droop', 'to bend or hang down limply, like a thirsty plant',
  'The flowers drooped in the afternoon heat.', 'B2',
  'The oo sags into the tail of the p.', [2, 3, 4])
```

`npm test` validates every entry: 4–7 lowercase letters, clue never contains the answer, iconic indices in range, answers present in the guess dictionary.

## Future ideas

- First-language glosses in the dossier (the `translations` field is already in the schema)
- A hard mode (revealed hits must be reused, Wordle-style)
- An archive of past puzzles + "practice" mode
- Sound-iconicity days (*buzz*, *hiss* — words that sound like what they mean, too)
- Server-side daily word so the rotation can't be read from the bundle
