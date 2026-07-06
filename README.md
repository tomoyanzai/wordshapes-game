# WordShapes 🛏️

A casual, daily vocabulary mini-game for beginner/intermediate ESL learners — built on a fun idea from cognitive science: **some words look like what they mean.**

The word **bed** looks like a bed (b and d are the posts). **loop** has a loop in it. The **oo** in **moon** are two full moons. WordShapes turns these letter-shape resemblances into memorable "aha" moments while you build everyday vocabulary.

> Inspired by Sidhu, D. M. (2026). *The word "bed" looks like a bed: Orthographic iconicity in English.* **Cognition**. The paper shows people agree on which written words visually resemble their meaning — and that such words are recognized measurably faster. The letter-shape hints in this game are playful mnemonics in that spirit, not linguistic claims.

## How it plays

1. **One pack a day** — ~10 quick multiple-choice questions (2–4 minutes). See a picture + simple definition, pick the word; or see a word, pick the meaning.
2. **The shape reveal ✨** — when you answer one of the ~28 *iconic* words, its shape-carrying letters light up and pulse, with a one-line hint: *"the oo are two eyes looking at you!"* That visual hook is the mnemonic.
3. **Come back tomorrow 🔥** — completing a pack keeps your streak alive. Words you missed come back sooner (spaced repetition); words you know return at growing intervals until mastered.
4. **Collect 📖** — every word you meet joins your "My words" gallery with its art, mastery dots, and hint.

## Product goals

| Goal | Mechanic |
|------|----------|
| Retention (come back daily) | daily pack, streak + best streak, due-review badge |
| Vocabulary growth | ~10 words/day, Leitner spaced repetition (boxes 1–5, intervals 1/2/4/7/14 days) |
| Educational integrity | beginner-English definitions, example sentences, CEFR levels (A1–B1) |
| Delight | iconic shape reveals, combo scoring, XP, perfect-pack bonus |
| Fast sessions | 10 questions, instant feedback, no signup, no backend |

## Run it

```bash
npm install
npm run dev       # play at http://localhost:5173
npm test          # 53 unit tests over the pure game logic
npm run build     # typecheck + production bundle
```

Dev-only trick: append `?today=2026-07-07` to the URL to time-travel — handy for testing streaks and review scheduling without waiting for real tomorrows.

## Architecture

- **Vite + React + TypeScript**, mobile-first, zero runtime deps beyond React. No backend: all progress lives in `localStorage` (`wordshapes:v1`).
- **`src/game/`** — pure TypeScript, no React, no clock access. Everything takes a date string / day number as a parameter, so it's deterministic and fully unit-tested:
  - `pack.ts` — the daily pack: a pure function of `(dateString, progress)`. Up to 5 due review words (most overdue first) topped up with new words (easiest CEFR level first, seeded-shuffled by date).
  - `srs.ts` — Leitner scheduling: correct promotes a box, wrong drops to box 1.
  - `streak.ts`, `scoring.ts`, `rng.ts` (seeded — same date = same pack everywhere), `dates.ts` (local date strings + integer day numbers; DST/timezone safe).
- **`src/state/reducer.ts`** — the whole app is one pure `useReducer` state machine (home → quiz → reveal → summary), also unit-tested.
- **`src/data/words.ts`** — 137 curated words (A1/A2/B1), 28 flagged iconic. A dataset test enforces unique ids, valid letter indices, and ≥15 words per level.

### Adding words

Add a line in `src/data/words.ts`:

```ts
w('igloo', '🏔️', 'A2', 'a small round house made of snow', 'An igloo is warm inside.',
  ['places', 'noun'], ic('the oo are the round snow blocks of the dome!', [3, 4]))
```

The `translations: {}` field on every word is ready for future first-language glosses (e.g. `{ ja: 'イグルー' }`) — the schema is bilingual-ready even though the MVP UI is English-only. Run `npm test` and the dataset validation will catch mistakes.

## Future ideas

- Japanese (and other L1) glosses using the existing `translations` field
- A daily *shape puzzle* mode: guess the word from its letter silhouette
- Typing/spelling questions once a word reaches box 4
- Sound: pronunciation audio and phonological iconicity ("boom", "pop" sound like what they mean too)
- Sharing: "my word of the day" card generator
