import type { CefrLevel, IconicInfo, Word } from '../game/types'

// Iconic hints are playful mnemonics to help the word stick — not
// linguistic claims about English spelling. Inspired by Sidhu (2026),
// "The word 'bed' looks like a bed: Orthographic iconicity in English".

function w(
  word: string,
  emoji: string,
  cefrLevel: CefrLevel,
  definition: string,
  exampleSentence: string,
  tags: string[],
  iconic?: IconicInfo,
): Word {
  return { id: word, word, definition, emoji, exampleSentence, cefrLevel, tags, iconic, translations: {} }
}

const ic = (hint: string, letterIndices: number[]): IconicInfo => ({ hint, letterIndices })

export const WORDS: Word[] = [
  // ---- Iconic words (the shape-reveal stars) ----
  w('bed', '🛏️', 'A1', 'the thing you sleep on', 'I read in my bed every night.', ['home', 'noun'], ic('b and d are the bed posts — e is you sleeping!', [0, 2])),
  w('eye', '👁️', 'A1', 'the part of your body that sees', 'Close one eye and look here.', ['body', 'noun'], ic('two round e-eyes with a y nose between them!', [0, 2])),
  w('moon', '🌕', 'A1', 'the big light in the sky at night', 'The moon is very bright tonight.', ['nature', 'noun'], ic('oo — two full moons in the middle!', [1, 2])),
  w('bee', '🐝', 'A1', 'a small yellow insect that makes honey', 'A bee is sitting on the flower.', ['animals', 'noun'], ic('the ee are two tiny buzzing wings!', [1, 2])),
  w('look', '👀', 'A1', 'to turn your eyes to see something', 'Look at that big dog!', ['actions', 'verb'], ic('the oo are two eyes looking at you!', [1, 2])),
  w('book', '📕', 'A1', 'pages with words that you read', 'This book is about animals.', ['school', 'noun'], ic('the oo are two open pages!', [1, 2])),
  w('door', '🚪', 'A1', 'you open it to go into a room', 'Please close the door.', ['home', 'noun'], ic('the oo are two round door handles!', [1, 2])),
  w('pool', '🏊', 'A1', 'a place with water for swimming', 'We swim in the pool in summer.', ['places', 'noun'], ic('the oo is the round blue water!', [1, 2])),
  w('tooth', '🦷', 'A1', 'one of the white things in your mouth', 'My tooth hurts a little.', ['body', 'noun'], ic('the oo are two white teeth!', [1, 2])),
  w('foot', '🦶', 'A1', 'the part of your body you stand on', 'My left foot is cold.', ['body', 'noun'], ic('the oo are two feet standing together!', [1, 2])),
  w('roof', '🏠', 'A1', 'the top part of a house', 'There is a bird on the roof.', ['home', 'noun'], ic('the oo are round roof tiles!', [1, 2])),
  w('boot', '🥾', 'A1', 'a big strong shoe', 'I wear one boot on each foot.', ['clothes', 'noun'], ic('the oo are a pair of boots!', [1, 2])),
  w('sleep', '😴', 'A1', 'to close your eyes and rest at night', 'Babies sleep many hours.', ['actions', 'verb'], ic('the ee are two closed, sleeping eyes!', [2, 3])),
  w('balloon', '🎈', 'A1', 'a light colorful ball full of air', 'The red balloon flies up.', ['fun', 'noun'], ic('ll are the strings, oo are the balloons!', [2, 3, 4, 5])),
  w('cool', '😎', 'A2', 'a little cold; also: very nice', 'The water is nice and cool.', ['adjectives'], ic('the oo are sunglasses. Cool!', [1, 2])),
  w('boom', '💥', 'A2', 'a big loud sound', 'We heard a big boom outside.', ['sounds', 'noun'], ic('the oo is the big round blast!', [1, 2])),
  w('igloo', '🏔️', 'A2', 'a small round house made of snow', 'An igloo is warm inside.', ['places', 'noun'], ic('the oo are the round snow blocks of the dome!', [3, 4])),
  w('bubble', '🫧', 'A2', 'a small ball of air in liquid', 'Soap makes a big bubble.', ['nature', 'noun'], ic('the three b’s are round floating bubbles!', [0, 2, 3])),
  w('level', '📏', 'A2', 'flat and equal; a floor in a building', 'The table is not level.', ['adjectives'], ic('level reads the same both ways — perfectly level!', [0, 1, 2, 3, 4])),
  w('yoyo', '🪀', 'A2', 'a toy that goes down and up on a string', 'My yoyo goes up and down fast.', ['fun', 'noun'], ic('y-o-y-o goes down-up-down-up, just like the toy!', [0, 1, 2, 3])),
  w('pop', '🎉', 'A2', 'a short small sound, like a balloon breaking', 'The balloon went pop!', ['sounds'], ic('the round o pops between two p’s!', [0, 1, 2])),
  w('noon', '🕛', 'A2', '12 o’clock in the middle of the day', 'We eat lunch at noon.', ['time', 'noun'], ic('noon is the same forwards and backwards — the sun at the top of the day!', [0, 1, 2, 3])),
  w('kick', '⚽', 'A2', 'to hit something with your foot', 'Kick the ball to me!', ['actions', 'verb'], ic('the two k’s kick out their legs!', [0, 3])),
  w('loop', '➰', 'B1', 'a circle made by a line or string', 'Make a loop with the rope.', ['shapes', 'noun'], ic('the oo is the loop itself!', [1, 2])),
  w('wobble', '🍮', 'B1', 'to move from side to side, not stable', 'The old chair wobbles a lot.', ['actions', 'verb'], ic('the bb wobbles in the middle of the word!', [2, 3])),
  w('zigzag', '⚡', 'B1', 'a line that goes left-right-left, like Z', 'The road goes zigzag up the mountain.', ['shapes', 'noun'], ic('the z’s zig and zag, just like the line!', [0, 3])),
  w('ooze', '🍯', 'B1', 'to flow out very slowly, like honey', 'Honey oozes from the spoon.', ['actions', 'verb'], ic('the oo oozes out slowly at the front!', [0, 1])),
  w('eel', '🐍', 'B1', 'a long thin fish that looks like a snake', 'An eel swims like a snake.', ['animals', 'noun'], ic('e-e-l is one long body, like the eel!', [0, 1, 2])),

  // ---- A1: animals ----
  w('cat', '🐱', 'A1', 'a small animal that says meow', 'The cat sleeps on the chair.', ['animals', 'noun']),
  w('dog', '🐶', 'A1', 'a friendly animal that says woof', 'My dog loves to run.', ['animals', 'noun']),
  w('fish', '🐟', 'A1', 'an animal that swims in water', 'The fish swims in the river.', ['animals', 'noun']),
  w('bird', '🐦', 'A1', 'an animal with wings that can fly', 'A small bird sings in the tree.', ['animals', 'noun']),
  w('horse', '🐴', 'A1', 'a big animal that people can ride', 'The horse runs very fast.', ['animals', 'noun']),
  w('cow', '🐮', 'A1', 'a big farm animal that gives milk', 'The cow eats grass all day.', ['animals', 'noun']),
  w('pig', '🐷', 'A1', 'a pink farm animal', 'The pig plays in the mud.', ['animals', 'noun']),
  w('monkey', '🐵', 'A1', 'an animal that climbs trees and eats bananas', 'The monkey jumps from tree to tree.', ['animals', 'noun']),

  // ---- A1: food ----
  w('apple', '🍎', 'A1', 'a round red or green fruit', 'I eat an apple every day.', ['food', 'noun']),
  w('bread', '🍞', 'A1', 'a soft food made from flour', 'We buy fresh bread in the morning.', ['food', 'noun']),
  w('egg', '🥚', 'A1', 'a round white food from a chicken', 'I want one egg for breakfast.', ['food', 'noun']),
  w('milk', '🥛', 'A1', 'a white drink from a cow', 'The baby drinks warm milk.', ['food', 'noun']),
  w('rice', '🍚', 'A1', 'small white food, eaten in many countries', 'We eat rice with dinner.', ['food', 'noun']),
  w('cake', '🎂', 'A1', 'a sweet food for birthdays', 'The birthday cake is chocolate.', ['food', 'noun']),
  w('banana', '🍌', 'A1', 'a long yellow fruit', 'The monkey eats a banana.', ['food', 'noun']),
  w('cheese', '🧀', 'A1', 'a yellow food made from milk', 'I like cheese on my bread.', ['food', 'noun']),
  w('pizza', '🍕', 'A1', 'a flat round food with cheese on top', 'We share a big pizza.', ['food', 'noun']),

  // ---- A1: home & things ----
  w('key', '🔑', 'A1', 'a small metal thing that opens a door', 'I cannot find my key!', ['home', 'noun']),
  w('cup', '☕', 'A1', 'a small thing you drink from', 'A cup of tea, please.', ['home', 'noun']),
  w('clock', '🕐', 'A1', 'a thing that shows the time', 'The clock says three.', ['home', 'noun']),
  w('phone', '📱', 'A1', 'a thing you use to call and talk to people', 'My phone is in my bag.', ['things', 'noun']),
  w('chair', '🪑', 'A1', 'a thing you sit on', 'Please sit on this chair.', ['home', 'noun']),
  w('box', '📦', 'A1', 'a container with four sides', 'The toys are in the box.', ['things', 'noun']),

  // ---- A1: body ----
  w('hand', '✋', 'A1', 'the part of your body with five fingers', 'Raise your hand to answer.', ['body', 'noun']),
  w('ear', '👂', 'A1', 'the part of your body that hears', 'The rabbit has long ears.', ['body', 'noun']),
  w('nose', '👃', 'A1', 'the part of your face that smells', 'The clown has a red nose.', ['body', 'noun']),
  w('mouth', '👄', 'A1', 'the part of your face that eats and talks', 'Open your mouth and say ah.', ['body', 'noun']),
  w('heart', '❤️', 'A1', 'the part of your body that beats; also means love', 'My heart beats fast when I run.', ['body', 'noun']),
  w('leg', '🦵', 'A1', 'the long part of your body you walk with', 'The dog has four legs.', ['body', 'noun']),

  // ---- A1: actions ----
  w('run', '🏃', 'A1', 'to move very fast with your legs', 'I run to school every day.', ['actions', 'verb']),
  // same emoji as "pool" on purpose: the quiz never puts same-emoji words in one option set
  w('swim', '🏊', 'A1', 'to move through water', 'Fish swim, birds fly.', ['actions', 'verb']),
  w('dance', '💃', 'A1', 'to move your body to music', 'We dance at the party.', ['actions', 'verb']),
  w('write', '✍️', 'A1', 'to make words with a pen', 'Write your name here.', ['actions', 'verb']),
  w('sing', '🎤', 'A1', 'to make music with your voice', 'She sings a happy song.', ['actions', 'verb']),
  w('cook', '🍳', 'A1', 'to make food hot and ready to eat', 'Dad cooks dinner tonight.', ['actions', 'verb']),
  w('read', '📖', 'A1', 'to look at words and understand them', 'I read a story before bed.', ['actions', 'verb']),

  // ---- A1: feelings & adjectives ----
  w('happy', '😄', 'A1', 'feeling good, with a smile', 'I am happy on my birthday.', ['feelings', 'adjective']),
  w('sad', '😢', 'A1', 'feeling bad, maybe crying', 'She is sad because it rains.', ['feelings', 'adjective']),
  w('angry', '😠', 'A1', 'feeling very not happy about something', 'He is angry about the mess.', ['feelings', 'adjective']),
  w('hot', '🥵', 'A1', 'with a high temperature, like fire', 'The soup is too hot.', ['adjectives']),
  w('cold', '🥶', 'A1', 'with a low temperature, like ice', 'Winter is very cold here.', ['adjectives']),
  w('tired', '🥱', 'A1', 'needing rest or sleep', 'I am tired after school.', ['feelings', 'adjective']),

  // ---- A1: nature ----
  w('rain', '🌧️', 'A1', 'water that falls from clouds', 'Take an umbrella, there is rain.', ['weather', 'noun']),
  w('snow', '❄️', 'A1', 'soft white cold pieces that fall in winter', 'Children play in the snow.', ['weather', 'noun']),
  w('sun', '☀️', 'A1', 'the big hot light in the sky in the day', 'The sun is very bright today.', ['nature', 'noun']),
  w('cloud', '☁️', 'A1', 'a white or grey shape in the sky', 'That cloud looks like a cat.', ['weather', 'noun']),
  w('tree', '🌳', 'A1', 'a tall plant with leaves', 'The bird lives in the tree.', ['nature', 'noun']),
  w('flower', '🌸', 'A1', 'the colorful part of a plant', 'This flower smells nice.', ['nature', 'noun']),
  w('star', '⭐', 'A1', 'a small light in the night sky', 'I can see one bright star.', ['nature', 'noun']),
  w('sea', '🌊', 'A1', 'the big blue water around the land', 'We swim in the sea in July.', ['nature', 'noun']),
  w('fire', '🔥', 'A1', 'hot bright flames that burn', 'The fire keeps us warm.', ['nature', 'noun']),

  // ---- A1: travel & town ----
  w('bus', '🚌', 'A1', 'a big car that many people ride together', 'I take the bus to work.', ['travel', 'noun']),
  w('train', '🚂', 'A1', 'a long vehicle that runs on rails', 'The train leaves at nine.', ['travel', 'noun']),
  w('plane', '✈️', 'A1', 'a machine that flies in the sky', 'The plane flies over the sea.', ['travel', 'noun']),
  w('bicycle', '🚲', 'A1', 'a vehicle with two wheels that you push with your legs', 'She rides her bicycle to school.', ['travel', 'noun']),
  w('car', '🚗', 'A1', 'a vehicle with four wheels that you drive', 'Our car is small and red.', ['travel', 'noun']),
  w('school', '🏫', 'A1', 'the place where children learn', 'School starts at eight.', ['places', 'noun']),

  // ---- A2 ----
  w('duck', '🦆', 'A2', 'a water bird that says quack', 'The duck swims on the lake.', ['animals', 'noun']),
  w('lion', '🦁', 'A2', 'a big wild cat, the king of animals', 'The lion sleeps in the sun.', ['animals', 'noun']),
  w('penguin', '🐧', 'A2', 'a black and white bird that cannot fly but swims', 'The penguin walks on the ice.', ['animals', 'noun']),
  w('butterfly', '🦋', 'A2', 'an insect with big colorful wings', 'A butterfly lands on the flower.', ['animals', 'noun']),
  w('spider', '🕷️', 'A2', 'a small animal with eight legs', 'The spider makes a web.', ['animals', 'noun']),
  w('snail', '🐌', 'A2', 'a very slow animal that carries its house', 'The snail moves very slowly.', ['animals', 'noun']),
  w('umbrella', '☂️', 'A2', 'a thing that keeps rain off you', 'Open your umbrella, it rains!', ['things', 'noun']),
  w('guitar', '🎸', 'A2', 'a music instrument with strings', 'He plays guitar in a band.', ['music', 'noun']),
  w('scissors', '✂️', 'A2', 'a tool for cutting paper', 'Cut the paper with scissors.', ['things', 'noun']),
  w('lamp', '💡', 'A2', 'a light you can turn on and off', 'Turn on the lamp, please.', ['home', 'noun']),
  w('soap', '🧼', 'A2', 'a thing you use to wash your hands', 'Wash your hands with soap.', ['home', 'noun']),
  w('mountain', '⛰️', 'A2', 'a very high hill', 'We climb the mountain in summer.', ['nature', 'noun']),
  w('wind', '🌬️', 'A2', 'air that moves fast outside', 'The wind blows my hat away.', ['weather', 'noun']),
  w('storm', '⛈️', 'A2', 'very bad weather with rain, wind and thunder', 'The storm comes tonight.', ['weather', 'noun']),
  w('rainbow', '🌈', 'A2', 'a line of colors in the sky after rain', 'A rainbow has seven colors.', ['weather', 'noun']),
  w('ice', '🧊', 'A2', 'water that is frozen and hard', 'Put some ice in my drink.', ['nature', 'noun']),
  w('ship', '🚢', 'A2', 'a very big boat', 'The ship crosses the sea.', ['travel', 'noun']),
  w('taxi', '🚕', 'A2', 'a car you pay to ride in', 'We take a taxi to the airport.', ['travel', 'noun']),
  w('bridge', '🌉', 'A2', 'a road that goes over a river', 'The bridge crosses the river.', ['places', 'noun']),
  w('hospital', '🏥', 'A2', 'the place where doctors help sick people', 'The doctor works at the hospital.', ['places', 'noun']),
  w('ticket', '🎫', 'A2', 'a paper that lets you enter or travel', 'Show your ticket at the door.', ['travel', 'noun']),
  w('map', '🗺️', 'A2', 'a picture that shows where places are', 'Look at the map to find the way.', ['travel', 'noun']),
  w('climb', '🧗', 'A2', 'to go up something with your hands and feet', 'We climb the big rock.', ['actions', 'verb']),
  w('paint', '🎨', 'A2', 'to make a picture with colors', 'I paint a picture of my dog.', ['actions', 'verb']),
  w('fast', '🚄', 'A2', 'moving very quickly', 'This train is very fast.', ['adjectives']),
  w('slow', '🦥', 'A2', 'not fast; taking a long time', 'The old computer is slow.', ['adjectives']),
  w('rich', '💰', 'A2', 'having a lot of money', 'The rich man has three houses.', ['adjectives']),
  w('scared', '😱', 'A2', 'feeling afraid of something', 'I am scared of spiders.', ['feelings', 'adjective']),
  w('strong', '🏋️', 'A2', 'having a lot of power in your body', 'The strong man lifts the box.', ['adjectives']),
  w('soup', '🍲', 'A2', 'hot liquid food in a bowl', 'Hot soup is good in winter.', ['food', 'noun']),
  w('bell', '🔔', 'A2', 'a metal thing that rings', 'The school bell rings at nine.', ['things', 'noun']),

  // ---- B1 ----
  w('whale', '🐋', 'B1', 'the biggest animal in the sea', 'A blue whale is bigger than a bus.', ['animals', 'noun']),
  w('camel', '🐫', 'B1', 'a desert animal with a hill on its back', 'The camel walks through the desert.', ['animals', 'noun']),
  w('octopus', '🐙', 'B1', 'a sea animal with eight arms', 'The octopus hides between rocks.', ['animals', 'noun']),
  w('castle', '🏰', 'B1', 'a big strong building where kings lived', 'The old castle stands on the hill.', ['places', 'noun']),
  w('crown', '👑', 'B1', 'the gold circle a king wears on his head', 'The queen wears a golden crown.', ['things', 'noun']),
  w('ghost', '👻', 'B1', 'the spirit of a dead person in stories', 'The story is about a friendly ghost.', ['fun', 'noun']),
  w('robot', '🤖', 'B1', 'a machine that can work like a person', 'The robot cleans the floor.', ['things', 'noun']),
  w('magnet', '🧲', 'B1', 'a metal that pulls other metal to it', 'The magnet holds the note on the fridge.', ['things', 'noun']),
  w('anchor', '⚓', 'B1', 'a heavy metal thing that stops a ship from moving', 'The ship drops its anchor in the bay.', ['travel', 'noun']),
  w('candle', '🕯️', 'B1', 'a stick of wax with a small fire on top', 'She lights a candle in the dark.', ['home', 'noun']),
  w('volcano', '🌋', 'B1', 'a mountain that can explode with hot rock', 'The volcano has smoke at the top.', ['nature', 'noun']),
  w('diamond', '💎', 'B1', 'a very hard, expensive clear stone', 'The ring has a small diamond.', ['things', 'noun']),
  w('rocket', '🚀', 'B1', 'a machine that flies into space', 'The rocket goes to the moon.', ['travel', 'noun']),
  w('tent', '⛺', 'B1', 'a small cloth house for camping', 'We sleep in a tent by the lake.', ['travel', 'noun']),
  w('drum', '🥁', 'B1', 'a music instrument you hit', 'He plays the drum very loudly.', ['music', 'noun']),
  w('whisper', '🤫', 'B1', 'to speak very very quietly', 'She whispers a secret to me.', ['actions', 'verb']),
  w('celebrate', '🎊', 'B1', 'to do something fun for a special day', 'We celebrate the new year with friends.', ['actions', 'verb']),
  w('repair', '🔧', 'B1', 'to fix something that is broken', 'Can you repair my bicycle?', ['actions', 'verb']),
  w('juggle', '🤹', 'B1', 'to throw and catch many things quickly', 'The clown can juggle five balls.', ['actions', 'verb']),
  w('silly', '🤪', 'B1', 'funny in a crazy way, not serious', 'He makes a silly face.', ['feelings', 'adjective']),
  w('curious', '🧐', 'B1', 'wanting to know about everything', 'The curious child asks many questions.', ['feelings', 'adjective']),
]

export const WORDS_BY_ID: ReadonlyMap<string, Word> = new Map(WORDS.map((word) => [word.id, word]))
