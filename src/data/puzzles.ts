import type { Puzzle } from '../game/types'

// The daily rotation, in curated order (day 1 = index 0, wrapping).
// Rules for entries: word is 4–7 lowercase a-z letters; the clue never
// contains the answer or its root; shapeNote/iconicIndices only where the
// letterforms genuinely echo the meaning (playful mnemonics, not claims —
// in the spirit of Sidhu 2026, "The word 'bed' looks like a bed").

function p(
  word: string,
  clue: string,
  exampleSentence: string,
  level: Puzzle['level'],
  shapeNote?: string,
  iconicIndices?: number[],
): Puzzle {
  return { word, clue, exampleSentence, level, shapeNote, iconicIndices, translations: {} }
}

export const PUZZLES: Puzzle[] = [
  p('ooze', 'to flow out slowly, like honey from a spoon', 'Mud oozed between his toes.', 'B2', 'The oo practically drips out of the front of the word.', [0, 1]),
  p('lanky', 'tall and thin, all arms and legs', 'A lanky teenager ducked through the doorway.', 'B2', 'A tall l, a tall k, and a leggy y trailing behind.', [0, 3, 4]),
  p('buzz', 'the low hum of a bee — or a phone on a table', 'My phone buzzed twice during dinner.', 'A2', 'Two z’s vibrating at the end of the word.', [2, 3]),
  p('murky', 'dark, cloudy and hard to see through', 'They dove into the murky water.', 'B2', 'The y sinks below the line, into the depths.', [4]),
  p('wobble', 'to rock unsteadily from side to side', 'The old table wobbles on the uneven floor.', 'B2', 'The bb teeters in the middle of the word.', [2, 3]),
  p('dusk', 'the dim light just after sunset', 'Bats come out at dusk.', 'B2'),
  p('ripple', 'a small wave spreading across still water', 'The stone sent ripples across the pond.', 'B1', 'The pp bobs on the surface of the word.', [2, 3]),
  p('gloat', 'to enjoy your victory a little too openly', 'He gloated over the trophy for days.', 'C1'),
  p('plump', 'pleasantly round and full', 'A plump cat dozed on the sofa.', 'B1', 'Two p’s with round bellies at either end.', [0, 4]),
  p('gust', 'a sudden rush of wind', 'A gust snatched the map from her hands.', 'B1'),
  p('zigzag', 'a path of sharp left-right turns', 'The trail zigzags up the cliff face.', 'B1', 'The z’s cut back and forth, just like the line.', [0, 3]),
  p('weary', 'deeply tired, worn out', 'The weary hikers finally reached the hut.', 'B2'),
  p('droop', 'to bend or hang down limply, like a thirsty plant', 'The flowers drooped in the afternoon heat.', 'B2', 'The oo sags into the tail of the p.', [2, 3, 4]),
  p('brisk', 'quick and energetic, like a cold-morning walk', 'They set off at a brisk pace.', 'B2'),
  p('hollow', 'empty on the inside', 'The old tree trunk was completely hollow.', 'B1', 'Two round o’s — empty space held inside the word.', [1, 4]),
  p('echo', 'a sound that bounces back to you', 'Her shout echoed off the canyon walls.', 'B1'),
  p('sizzle', 'the sound of bacon hitting a hot pan', 'Onions sizzled in the oil.', 'B1', 'The zz spits and crackles in the middle.', [2, 3]),
  p('void', 'a completely empty space', 'The door opened onto a black void.', 'C1'),
  p('mimic', 'to copy someone’s voice or movements', 'Parrots can mimic human speech.', 'B2', 'mi-mi — the word copies itself, letter for letter.', [0, 1, 2, 3]),
  p('thaw', 'to melt after being frozen', 'The lake thaws in early April.', 'B2'),
  p('jagged', 'having sharp, uneven, broken edges', 'Jagged rocks lined the shore.', 'B2', 'The gg snags below the line like broken teeth.', [2, 3]),
  p('hush', 'a sudden silence', 'A hush fell over the crowd.', 'B1'),
  p('swoop', 'to dive down suddenly through the air', 'The owl swooped on the mouse.', 'B2', 'The oo glides into the plunging tail of the p.', [2, 3, 4]),
  p('gleam', 'a soft flash of reflected light', 'The knife gleamed in the moonlight.', 'B1'),
  p('abyss', 'a hole so deep it seems to have no bottom', 'She stood at the edge and stared into the abyss.', 'C1', 'The y hangs over the edge, halfway down already.', [2]),
  p('snug', 'warm, tight and comfortable', 'The cabin stayed snug despite the storm.', 'B2'),
  p('dangle', 'to hang and swing loosely', 'Keys dangled from his belt loop.', 'B2', 'The g dangles below the line, holding on by its stem.', [3]),
  p('frost', 'the thin white ice coating a cold morning', 'Frost covered the car windows.', 'B1'),
  p('jumble', 'a confused, mixed-up pile', 'His desk is a jumble of papers and cables.', 'B2'),
  p('loom', 'to appear large and threatening ahead', 'Storm clouds loomed over the bay.', 'C1', 'The oo stares down at you like two dark eyes.', [1, 2]),
  p('tangle', 'a knotted, twisted mess', 'The headphone cables are in a hopeless tangle.', 'B1'),
  p('crisp', 'pleasingly dry, cold or crunchy', 'The autumn air was crisp and clear.', 'B1'),
  p('canyon', 'a deep valley with steep rock walls', 'The river carved this canyon over millions of years.', 'B1', 'The y drops into the gap between the walls.', [3]),
  p('vivid', 'so bright and clear it feels real', 'She has vivid memories of that summer.', 'B2'),
  p('stubby', 'short and thick, like a worn-down pencil', 'He kept score with a stubby pencil.', 'C1', 'The bb stands squat in the middle — short and thick.', [3, 4]),
  p('dawn', 'the first light of the day', 'We left at dawn to beat the traffic.', 'B1'),
  p('hiss', 'the sharp sound of a snake or escaping steam', 'The kettle hissed on the stove.', 'B1', 'The ss keeps the air escaping at the end.', [2, 3]),
  p('drift', 'to be carried slowly along by water or air', 'The empty boat drifted from the shore.', 'B1'),
  p('gully', 'a narrow channel cut into a hillside by running water', 'Rain carved a gully down the slope.', 'C1', 'The g and y sink below the line, cutting the channel.', [0, 4]),
  p('glare', 'a long, angry stare — or a blinding light', 'She glared at the ringing phone.', 'B1'),
  p('rumble', 'a long, deep rolling sound', 'Thunder rumbled somewhere in the distance.', 'B1'),
  p('husk', 'the dry outer shell of a seed or grain', 'Peel the husk off the corn.', 'C1'),
  p('topple', 'to lose balance and fall over', 'The stack of books toppled onto the floor.', 'B2', 'The pp leans past its tipping point.', [2, 3]),
  p('shiver', 'to tremble from cold or fear', 'She shivered and pulled the blanket closer.', 'B1'),
  p('bloat', 'to swell up with air or water', 'The dead fish bloated in the sun.', 'C1', 'The b puffs out its round belly at the front.', [0]),
  p('limp', 'to walk unevenly on an injured leg', 'He limped off the field.', 'B1', 'The p drags behind the word like the bad leg.', [3]),
  p('bicker', 'to argue about small, silly things', 'The kids bickered over the last slice.', 'C1'),
  p('plume', 'a feather — or a rising column of smoke', 'A plume of smoke rose from the chimney.', 'C1', 'The p plants the stem the rest rises from.', [0]),
  p('squint', 'to narrow your eyes to see better', 'He squinted at the tiny print.', 'B2', 'The q peers below the line, eye half-closed.', [1]),
  p('mellow', 'soft, smooth and relaxed', 'The lights were low and the music mellow.', 'B2'),
  p('dwindle', 'to shrink away little by little', 'Their savings dwindled to almost nothing.', 'C1'),
  p('fable', 'a short story with a lesson, often starring animals', 'The tortoise and the hare is a famous fable.', 'B2'),
  p('flicker', 'to burn or shine unsteadily', 'The candle flickered in the draft.', 'B2'),
  p('grumble', 'to complain in a low voice', 'He grumbled about the early start.', 'B1'),
  p('clutter', 'a messy crowd of things filling a space', 'Clear the clutter off your desk first.', 'B2'),
  p('shimmer', 'to shine with a soft, trembling light', 'Heat shimmered above the asphalt.', 'B2'),
  p('fidget', 'to keep making small restless movements', 'Stop fidgeting and sit still.', 'B2', 'The g and j-like dots twitch around the word’s middle.', [2]),
  p('glimpse', 'a view that lasts only a split second', 'I caught a glimpse of the fox before it vanished.', 'B2'),
  p('bounce', 'to spring back up after hitting the ground', 'The ball bounced twice and rolled away.', 'A2'),
  p('crumble', 'to break apart into small pieces', 'The old stone wall is slowly crumbling.', 'B1'),
]

export const PUZZLE_WORDS: ReadonlySet<string> = new Set(PUZZLES.map((x) => x.word))
