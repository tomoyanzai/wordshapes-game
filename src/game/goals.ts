import { CATEGORIES } from '../data/categories'
import { colOf, letterOf, rowOf, SIZE, type Board, type FormedWord, type Placement } from './board'
import { shapeOf, silhouette } from './shapes'
import { RARE_LETTERS, VOWELS } from './tiles'

export interface PlayContext {
  /** the main word of the play, lowercase, blanks resolved */
  mainWord: string
  /** every word formed this turn (main + crossings) */
  words: string[]
  formed: FormedWord[]
  placements: Placement[]
  boardBefore: Board
  boardAfter: Board
  turnNumber: number
}

export interface GoalCard {
  id: string
  category: 'length' | 'letters' | 'placement' | 'semantic' | 'shape'
  /** player-facing, imperative */
  text: string
  difficulty: 1 | 2 | 3
  check(ctx: PlayContext): boolean
}

export function buildContext(
  boardBefore: Board,
  boardAfter: Board,
  words: FormedWord[],
  placements: Placement[],
  turnNumber: number,
): PlayContext {
  return {
    mainWord: words.find((w) => w.isMain)?.word ?? '',
    words: words.map((w) => w.word),
    formed: words,
    placements,
    boardBefore,
    boardAfter,
    turnNumber,
  }
}

const vowelCount = (w: string) => [...w].filter((ch) => VOWELS.has(ch)).length
const some = (ctx: PlayContext, f: (w: string) => boolean) => ctx.words.some(f)
const main = (ctx: PlayContext) => ctx.formed.find((w) => w.isMain)

const goal = (
  id: string,
  category: GoalCard['category'],
  difficulty: GoalCard['difficulty'],
  text: string,
  check: GoalCard['check'],
): GoalCard => ({ id, category, difficulty, text, check })

const semantic = (id: string, difficulty: GoalCard['difficulty'], text: string): GoalCard =>
  goal(id, 'semantic', difficulty, text, (ctx) => some(ctx, (w) => CATEGORIES[id].has(w)))

export const GOALS: GoalCard[] = [
  // ---- length ----
  goal('len5', 'length', 1, 'Make a word of 5+ letters', (c) => some(c, (w) => w.length >= 5)),
  goal('len6', 'length', 2, 'Make a word of 6+ letters', (c) => some(c, (w) => w.length >= 6)),
  goal('len7', 'length', 3, 'Make a word of 7+ letters', (c) => some(c, (w) => w.length >= 7)),
  goal('short', 'length', 1, 'Make a little word (2–3 letters)', (c) => some(c, (w) => w.length <= 3)),

  // ---- letters ----
  goal('double-letter', 'letters', 1, 'Make a word with a double letter (like oo or ll)', (c) =>
    some(c, (w) => /(.)\1/.test(w))),
  goal('bookends', 'letters', 2, 'Make a word that starts and ends with the same letter', (c) =>
    some(c, (w) => w.length >= 3 && w[0] === w[w.length - 1])),
  goal('three-vowels', 'letters', 1, 'Make a word with 3 or more vowels', (c) =>
    some(c, (w) => vowelCount(w) >= 3)),
  goal('one-vowel', 'letters', 2, 'Make a 4+ letter word with exactly one vowel', (c) =>
    some(c, (w) => w.length >= 4 && vowelCount(w) === 1)),
  goal('rare-letter', 'letters', 2, 'Play a J, K, X or Z tile', (c) =>
    c.placements.some((p) => RARE_LETTERS.has(letterOf(p)))),
  goal('no-repeats', 'letters', 1, 'Make a 5+ letter word with no repeated letters', (c) =>
    some(c, (w) => w.length >= 5 && new Set(w).size === w.length)),
  goal('vowel-start', 'letters', 1, 'Make a word that starts with a vowel', (c) =>
    some(c, (w) => VOWELS.has(w[0]))),
  goal('digraph', 'letters', 1, 'Make a word containing CH, SH, TH or WH', (c) =>
    some(c, (w) => /ch|sh|th|wh/.test(w))),

  // ---- placement ----
  goal('hook', 'placement', 1, 'Build your main word through a tile already on the board', (c) => {
    const m = main(c)
    return m !== undefined && m.cells.some((cell) => !cell.isNew)
  }),
  goal('multi-word', 'placement', 2, 'Form 2 or more words in one turn', (c) => c.words.length >= 2),
  goal('crossroads', 'placement', 3, 'Form 3 or more words in one turn', (c) => c.words.length >= 3),
  goal('big-spend', 'placement', 2, 'Place 5 or more tiles in one turn', (c) => c.placements.length >= 5),
  goal('edge', 'placement', 2, 'Place a tile on the outer border of the board', (c) =>
    c.placements.some((p) => rowOf(p.index) === 0 || rowOf(p.index) === SIZE - 1 || colOf(p.index) === 0 || colOf(p.index) === SIZE - 1)),
  goal('vertical', 'placement', 1, 'Make your main word vertical', (c) => main(c)?.axis === 'V'),
  goal('center-line', 'placement', 1, 'Make your main word use the center row or column', (c) => {
    const m = main(c)
    const mid = (SIZE - 1) / 2
    return m !== undefined && m.cells.some((cell) => rowOf(cell.index) === mid || colOf(cell.index) === mid)
  }),

  // ---- semantic (curated lists in src/data/categories.ts) ----
  semantic('animal', 2, 'Make a word that is an animal'),
  semantic('food', 2, 'Make a word that is food or drink'),
  semantic('nature', 2, 'Make a word from nature (weather, plants, land)'),
  semantic('body', 2, 'Make a word that is a body part'),
  semantic('color', 3, 'Make a word that is a color'),

  // ---- shape (letterform silhouettes — the WordShapes DNA) ----
  goal('symmetric', 'shape', 2, 'Make a 4+ letter word whose shape is symmetric', (c) =>
    some(c, (w) => {
      if (w.length < 4) return false
      const sil = silhouette(w)
      if (new Set(sil).size < 2) return false
      return sil.every((cls, i) => cls === sil[sil.length - 1 - i])
    })),
  goal('flat', 'shape', 1, 'Make a 4+ letter word with only small letters (no stems, no tails)', (c) =>
    some(c, (w) => w.length >= 4 && [...w].every((ch) => shapeOf(ch) === 'small'))),
  goal('skyline', 'shape', 2, 'Make a word with 3+ tall letters', (c) =>
    some(c, (w) => [...w].filter((ch) => shapeOf(ch) === 'tall').length >= 3)),
  goal('tails', 'shape', 2, 'Make a word with 2+ letters that hang below the line (g j p q y)', (c) =>
    some(c, (w) => [...w].filter((ch) => shapeOf(ch) === 'tail').length >= 2)),
]

export const GOALS_BY_ID: ReadonlyMap<string, GoalCard> = new Map(GOALS.map((g) => [g.id, g]))
