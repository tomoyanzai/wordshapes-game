import type { Puzzle } from '../game/types'

// Order here is the daily rotation order — see game/daily.ts::puzzleFor.
export const PUZZLES: Puzzle[] = [
  {
    id: 'winter',
    secret: 'winter',
    accept: ['winter'],
    clue: 'a TIME',
    difficulty: 'easy',
    words: [
      { word: 'coat', tier: 'joins-it', phrase: 'winter coat', note: 'winter coat — the phrase proves it' },
      { word: 'break', tier: 'joins-it', phrase: 'winter break', note: 'winter break' },
      { word: 'storm', tier: 'joins-it', phrase: 'winter storm', note: 'winter storm' },
      { word: 'sport', tier: 'joins-it', phrase: 'winter sports', note: 'winter sports' },
      { word: 'snow', tier: 'same-world', note: "its weather — but 'winter snow' isn't a phrase" },
      { word: 'ski', tier: 'same-world', note: 'what people do in it' },
      { word: 'fire', tier: 'same-world', note: 'fireplaces glow all through it' },
      { word: 'tea', tier: 'same-world', note: 'hot cups in the cold months' },
      { word: 'soup', tier: 'same-world', note: 'its comfort food' },
      { word: 'north', tier: 'same-world', note: 'where it bites hardest' },
      { word: 'dark', tier: 'same-world', note: 'its afternoons' },
      { word: 'mango', tier: 'far-away', note: 'a summer fruit' },
      { word: 'guitar', tier: 'far-away', note: 'no connection' },
      { word: 'paper', tier: 'far-away', note: 'no connection' },
      { word: 'bee', tier: 'far-away', note: 'asleep until spring' },
      { word: 'sofa', tier: 'far-away', note: 'cozy, but no connection' },
    ],
    wheel: ['winter', 'summer', 'christmas', 'school', 'night', 'morning'],
    winNote:
      "SUMMER makes 'summer break' and 'summer storm' too — but a summer COAT? Snow and ski settle it.",
  },
  {
    id: 'fire',
    secret: 'fire',
    accept: ['fire'],
    clue: 'a THING',
    difficulty: 'medium',
    words: [
      { word: 'camp', tier: 'joins-it', phrase: 'campfire', note: 'camp + fire = campfire' },
      { word: 'work', tier: 'joins-it', phrase: 'fireworks', note: 'fire + works = fireworks' },
      { word: 'place', tier: 'joins-it', phrase: 'fireplace', note: 'fire + place = fireplace' },
      { word: 'truck', tier: 'joins-it', phrase: 'fire truck', note: 'fire truck' },
      { word: 'drill', tier: 'joins-it', phrase: 'fire drill', note: 'fire drill' },
      { word: 'fly', tier: 'joins-it', phrase: 'firefly', note: 'fire + fly = firefly' },
      { word: 'smoke', tier: 'same-world', note: 'no phrase — but no smoke without it' },
      { word: 'heat', tier: 'same-world', note: 'what it gives' },
      { word: 'ash', tier: 'same-world', note: 'what it leaves behind' },
      { word: 'red', tier: 'same-world', note: 'its color' },
      { word: 'candle', tier: 'same-world', note: 'a tiny tame one' },
      { word: 'moon', tier: 'far-away', note: 'no connection' },
      { word: 'salad', tier: 'far-away', note: 'no connection' },
      { word: 'pencil', tier: 'far-away', note: 'no connection' },
      { word: 'pillow', tier: 'far-away', note: 'no connection' },
      { word: 'bicycle', tier: 'far-away', note: 'no connection' },
    ],
    wheel: ['fire', 'water', 'house', 'school', 'night', 'air'],
    winNote: 'WORK, DRILL and TRUCK point at an office or building site — until PLACE and FLY give it away.',
  },
]

export const PUZZLES_BY_ID: Map<string, Puzzle> = new Map(PUZZLES.map((p) => [p.id, p]))
