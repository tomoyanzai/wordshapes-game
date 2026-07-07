# WordGather

**A daily word board game about goals, not points.**

WordGather remixes the cooperative spirit of *Scrabble Together*: instead of out-scoring an opponent, you build words crossword-style on a compact 9×9 board to **clear 8 goal cards in at most 12 plays**. Everyone in the world gets the same board, the same tiles, and the same goals each day — then compares spoiler-free results.

## How a day plays

- You draw 6 tiles from the day's 60-tile bag. Your first word must cover the **✦ center**; every later word must connect, and *all* crossings must be real words (2–9 letters, 157k-word dictionary).
- **3 goal cards are visible** at a time — *"Make a word containing CH, SH, TH or WH"*, *"Form 3 words in one turn"*, *"Make a word that is an animal"*. Clear one and the next flips up. One clever play can clear several at once.
- Three one-shot helpers when you're stuck: **⇄ swap** up to 3 tiles (costs no turn), **↻ reroll** one goal card, **★ blank** turns any tile into a wildcard.
- Win when the 8th goal falls; lose when the 12 turns run out. Either way there's a streak, a stats histogram, and a share grid:

```
WordGather #12 — 8/8 goals in 10 turns
🟩🟩🟨🟩🟩🟨🟩🟩🟩🟩      ← each turn: cleared a goal / didn't
░▒░
▒▓▒
░░▒                        ← where your board grew (no spoilers)
🛟 swap
```

**Education woven in, never school-flavored:** tap any word you played for its definition (free dictionary API, cached, fully optional), semantic goal cards run on curated word lists, and the finish screen recaps the words you met. Some goal cards care about a word's *shape* — tall letters, small letters, letters with tails — a nod to the orthographic-iconicity research this project started from (Sidhu 2026, *Cognition*: "The word 'bed' looks like a bed").

## Run it

```bash
npm install
npm run dev       # play at http://localhost:5173
npm test          # 100 unit tests over the pure game logic
npm run build     # typecheck + production bundle
```

Dev-only: `?today=2026-07-16` in the URL time-travels to any date's board — handy for testing streaks and future days.

## Architecture

Vite + React + TypeScript, mobile-first, no backend; progress and stats live in `localStorage`. All rules are pure TypeScript under `src/game/`, tested before any UI existed:

- `placement.ts` — the crossword engine: single-line/contiguity/center/connectivity validation and main-word + cross-word extraction (the most heavily tested module)
- `goals.ts` — the 28-card goal catalog; every card is a pure predicate over a `PlayContext`
- `generate.ts` — seeded daily setup: bag shuffle, opening-rack vowel smoothing, difficulty-balanced goal draw, rare-letter nudge; a property test asserts the invariants across 365 consecutive dates
- `tiles.ts` — the 60-tile distribution (Q and V deliberately dropped — no scoring means they're pure pain)
- `dictionary.ts` — 157k words as a lazy chunk; Submit is gated until it loads (an invalid word would be committed forever)
- `state/reducer.ts` — the whole app as one pure state machine (tap-to-place, helpers, concede), snapshot-persisted every commit
- `data/categories.ts` — curated semantic word lists, test-asserted to be ⊂ dictionary

Regenerate the dictionary with `node scripts/build-dict.mjs`.

## Design notes & future ideas

- **Winnability without a solver**: 4 slack turns + 3 helpers + easy-first goal ordering + a concede button. Hard days are content; impossible days are bugs — report them with the date.
- Real co-op rooms (Cloudflare Workers + Durable Objects), pass-and-play mode, first-language glosses (`translations` is in the schema), a small offensive-word blocklist for the dictionary, hard mode (10 turns).
