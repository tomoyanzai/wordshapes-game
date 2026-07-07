// Curated word sets backing the semantic goal cards. Exact-match,
// lowercase, 2–9 letters. A vitest asserts every entry exists in the
// game dictionary, so a semantic goal can never demand a word the
// placement engine would reject.

export const CATEGORIES: Record<string, ReadonlySet<string>> = {
  animal: new Set([
    'cat', 'dog', 'fish', 'bird', 'horse', 'cow', 'pig', 'duck', 'lion', 'tiger',
    'bear', 'wolf', 'fox', 'deer', 'goat', 'sheep', 'mouse', 'rat', 'bat', 'owl',
    'hawk', 'eagle', 'crow', 'swan', 'frog', 'toad', 'snake', 'worm', 'bee', 'ant',
    'fly', 'moth', 'wasp', 'crab', 'clam', 'squid', 'whale', 'shark', 'seal', 'otter',
    'mole', 'hare', 'rabbit', 'monkey', 'ape', 'camel', 'zebra', 'llama', 'moose', 'bison',
    'elk', 'boar', 'hen', 'chick', 'lamb', 'foal', 'colt', 'mare', 'hog', 'cub',
    'pup', 'emu', 'ibis', 'heron', 'stork', 'finch', 'robin', 'wren', 'lark', 'dove',
    'pigeon', 'gull', 'tern', 'loon', 'newt', 'gecko', 'iguana', 'lizard', 'turtle', 'snail',
    'slug', 'leech', 'gnat', 'flea', 'tick', 'mite', 'shrimp', 'prawn', 'krill', 'trout',
    'salmon', 'tuna', 'cod', 'carp', 'pike', 'perch', 'bass', 'eel', 'ray', 'spider',
  ]),
  food: new Set([
    'bread', 'rice', 'egg', 'milk', 'cheese', 'butter', 'apple', 'pear', 'plum', 'peach',
    'grape', 'lemon', 'lime', 'melon', 'mango', 'berry', 'cherry', 'olive', 'bean', 'pea',
    'corn', 'wheat', 'oat', 'rye', 'soup', 'stew', 'salad', 'pasta', 'noodle', 'pizza',
    'burger', 'taco', 'cake', 'pie', 'tart', 'scone', 'bun', 'roll', 'toast', 'jam',
    'honey', 'sugar', 'salt', 'pepper', 'spice', 'herb', 'basil', 'thyme', 'sage', 'mint',
    'tea', 'coffee', 'cocoa', 'juice', 'wine', 'beer', 'cider', 'soda', 'ham', 'pork',
    'beef', 'veal', 'steak', 'bacon', 'sausage', 'nut', 'almond', 'pecan', 'walnut', 'cashew',
    'fig', 'date', 'kiwi', 'banana', 'onion', 'garlic', 'ginger', 'carrot', 'potato', 'tomato',
    'radish', 'turnip', 'beet', 'kale', 'spinach', 'lettuce', 'celery', 'leek', 'squash', 'yam',
    'tofu', 'curry', 'gravy', 'sauce', 'syrup', 'cream', 'yogurt', 'candy', 'fudge', 'toffee',
    'waffle', 'pancake', 'muffin', 'bagel', 'cookie', 'brownie',
  ]),
  nature: new Set([
    'tree', 'leaf', 'root', 'bark', 'twig', 'branch', 'flower', 'grass', 'moss', 'fern',
    'vine', 'seed', 'soil', 'sand', 'rock', 'stone', 'cliff', 'hill', 'mountain', 'valley',
    'river', 'lake', 'pond', 'sea', 'ocean', 'wave', 'tide', 'shore', 'beach', 'coast',
    'island', 'storm', 'rain', 'snow', 'hail', 'sleet', 'wind', 'breeze', 'gale', 'fog',
    'mist', 'dew', 'frost', 'ice', 'cloud', 'sky', 'sun', 'moon', 'star', 'comet',
    'meteor', 'dawn', 'dusk', 'night', 'day', 'summer', 'winter', 'spring', 'autumn', 'thunder',
    'lightning', 'rainbow', 'forest', 'jungle', 'desert', 'swamp', 'marsh', 'bog', 'cave', 'canyon',
    'glacier', 'volcano', 'lava', 'magma', 'quake', 'flood', 'drought', 'ember', 'flame', 'fire',
    'smoke', 'ash', 'pebble', 'boulder', 'dune', 'reef', 'coral', 'algae', 'kelp',
  ]),
  body: new Set([
    'head', 'hair', 'brow', 'eye', 'ear', 'nose', 'cheek', 'chin', 'jaw', 'lip',
    'mouth', 'tooth', 'teeth', 'tongue', 'throat', 'neck', 'chest', 'heart', 'lung', 'liver',
    'kidney', 'spine', 'rib', 'bone', 'skin', 'arm', 'elbow', 'wrist', 'hand', 'palm',
    'finger', 'thumb', 'nail', 'hip', 'leg', 'thigh', 'knee', 'shin', 'ankle', 'foot',
    'toe', 'heel', 'brain', 'nerve', 'vein', 'artery', 'blood', 'muscle', 'skull', 'scalp',
    'waist', 'belly', 'navel', 'shoulder', 'stomach', 'gut', 'spleen', 'gland',
  ]),
  color: new Set([
    'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white',
    'gray', 'grey', 'gold', 'silver', 'beige', 'cream', 'ivory', 'tan', 'navy', 'teal',
    'cyan', 'magenta', 'maroon', 'crimson', 'scarlet', 'violet', 'indigo', 'lavender', 'olive', 'coral',
    'amber', 'jade', 'ruby', 'rose', 'lilac', 'peach', 'mint', 'plum', 'azure', 'sepia',
    'khaki',
  ]),
}
