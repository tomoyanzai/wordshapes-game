# Twenty Words

**A daily word-deduction game. Feel out the hidden secret — then name it in one shot.**

Every day there's a secret word you can't see. The board shows **16 everyday words**, and each one is a *question you can ask*. Tap a word to "probe" how it relates to the secret:

- **●●● joins it** — the word forms a real phrase with the secret (`winter` + `coat` → *winter coat*)
- **●● same world** — same topic, but no phrase (`snow` is winter's world, but "winter snow" isn't an expression)
- **○ far away** — no connection at all

You get **6 probes**, then **one chance** to name the secret. It's hot-and-cold deduction — triangulate the answer from how the clues land, then commit.

Everyone plays the same puzzle each day. Win or lose, the reveal shows how *every* word related to the secret — so the connection is always provable, never a vibe. That reveal is also the point: each puzzle quietly teaches 5–6 real English collocations (*fire drill, winter break, campfire…*), the exact vocabulary that separates textbook English from natural English.

## Why it's built this way

The game went through several designs before landing here (the log lives in the plan file). Two principles survived every iteration:

- **Fair by construction.** Early versions rated words by free association ("this feels related"), which felt rigged because it couldn't be checked. The **phrase rule** fixed it: every ●●● is a real phrase shown at the reveal. Puzzle authoring follows [the authoring guide](#authoring-puzzles).
- **Kind to learners.** Every word you need is on the screen — the challenge is *reasoning about meaning*, never knowing rare words. All board vocabulary stays A1–B1.

## Run it

```bash
npm install
npm run dev       # play at http://localhost:5173
npm test          # 44 unit tests over the pure game logic
npm run build     # typecheck + production bundle (~66 KB gzipped, no dictionary)
```

Dev-only: append `?today=2026-07-08` to the URL to jump to any day's puzzle — handy for testing streaks and future puzzles.

## Architecture

Vite + React + TypeScript, mobile-first, no backend; progress and stats live in `localStorage`. There is **no dictionary and no word validation** — the game only needs its puzzle data, so the bundle is tiny. All rules are pure TypeScript under `src/game/` + `src/state/`, tested before any UI:

- `state/reducer.ts` — the whole game as one pure state machine (probe → reveal tier; 6th probe forces the answer; one attempt → win/lose)
- `game/daily.ts` — deterministic puzzle-of-the-day (seeded rotation via `dates.ts` day numbers)
- `game/share.ts` — spoiler-free share grid (a neutral 🧭, never a themed emoji that would leak the day's answer)
- `game/stats.ts` — streak + distribution, idempotent per day
- `data/puzzles.ts` — the puzzle pack (currently WINTER + FIRE; the board and answer wheel are seed-shuffled at render so stored tier order never leaks the answer)

Components under `src/components/` are presentational (grid, flip cards, answer sheet, result panel, how-to, stats). `src/game/dates.ts` and `rng.ts` carried over from the project's earlier iterations.

## Authoring puzzles

Puzzle quality *is* the product. The full policy — the tier law, how to engineer fair misdirection, the QA checklist, and rules for AI-assisted drafting — lives in the authoring guide (`twenty-words-authoring-guide.md`, published as an artifact during design). A puzzle is data only:

```ts
{ id, secret, accept: [...], clue: "a TIME",
  words: [ { word, tier, note, phrase? } × 16 ],
  wheel: [ secret + 5 decoys ], winNote, difficulty }
```

`src/data/puzzles.test.ts` enforces the invariants (16 words, 6 wheel options, secret never on the board, every ●●● has its phrase).

## Roadmap

- Expand the puzzle pack to a launch set (~60), authored against the guide
- Deploy (Cloudflare) with the share link + OG cards so shares have somewhere to go
- Streak calendar, PWA install, first-language glosses on the reveal (the data model is ready for it)
