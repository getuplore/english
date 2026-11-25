// Word bank for Little Learners. Pictures are emoji (on every device, no image files).
// Sound groups follow the usual phonics order: s a t p, i n m d, g o c k, e u r h, b f l j, v w x y z qu.
export const GROUPS = { s1: ['s', 'a', 't', 'p'], s2: ['i', 'n', 'm', 'd'], s3: ['g', 'o', 'c', 'k'], s4: ['e', 'u', 'r', 'h', 'ck'], s5: ['b', 'f', 'l', 'j'], s6: ['v', 'w', 'x', 'y', 'z', 'qu'] };
export const ORDER = ['s1', 's2', 's3', 's4', 's5', 's6'];
export const lettersUpTo = g => ORDER.slice(0, ORDER.indexOf(g) + 1).flatMap(k => GROUPS[k]);

// Words that start with each sound ("x" is heard at the end: box, fox, six).
export const START = {
  s: [['sun', '☀️'], ['sock', '🧦'], ['snake', '🐍']], a: [['apple', '🍎'], ['ant', '🐜'], ['alligator', '🐊']], t: [['tiger', '🐯'], ['tent', '⛺'], ['tap', '🚰']], p: [['pig', '🐷'], ['pen', '🖊️'], ['panda', '🐼']],
  i: [['insect', '🐛'], ['ink', '🖋️'], ['iguana', '🦎']], n: [['nose', '👃'], ['nut', '🥜'], ['net', '🥅']], m: [['moon', '🌙'], ['mouse', '🐭'], ['milk', '🥛']], d: [['dog', '🐶'], ['duck', '🦆'], ['drum', '🥁']],
  g: [['goat', '🐐'], ['gift', '🎁'], ['grapes', '🍇']], o: [['octopus', '🐙'], ['ox', '🐂'], ['orange', '🍊']], c: [['cat', '🐱'], ['cup', '☕'], ['cake', '🍰']], k: [['kite', '🪁'], ['key', '🔑'], ['kangaroo', '🦘']],
  e: [['egg', '🥚'], ['elephant', '🐘'], ['elf', '🧝']], u: [['umbrella', '☂️'], ['up', '⬆️']], r: [['rabbit', '🐰'], ['rocket', '🚀'], ['ring', '💍']], h: [['hat', '🎩'], ['horse', '🐴'], ['hen', '🐔']],
  ck: [['duck', '🦆'], ['sock', '🧦'], ['clock', '⏰']],
  b: [['ball', '⚽'], ['bus', '🚌'], ['banana', '🍌']], f: [['fish', '🐟'], ['fox', '🦊'], ['frog', '🐸']], l: [['lion', '🦁'], ['leaf', '🍃'], ['lemon', '🍋']], j: [['juice', '🧃'], ['jeans', '👖'], ['jacket', '🧥']],
  v: [['van', '🚐'], ['violin', '🎻'], ['volcano', '🌋']], w: [['watch', '⌚'], ['web', '🕸️'], ['wave', '🌊']], x: [['box', '📦'], ['fox', '🦊'], ['six', '6️⃣']], y: [['yo-yo', '🪀'], ['yawn', '🥱']],
  z: [['zebra', '🦓'], ['zero', '0️⃣']], qu: [['queen', '👸'], ['question', '❓']]
};
// "ck" comes at the end of a word, like x.
export const ENDS = new Set(['x', 'ck']);

// Three-sound words to read and spell, split into their sounds.
export const CVC = [
  ['tap', '🚰'], ['pin', '📌'], ['tin', '🥫'], ['map', '🗺️'], ['man', '👨'], ['pan', '🍳'], ['ant', '🐜'], ['nap', '😴'], ['sad', '😢'],
  ['dog', '🐶'], ['cat', '🐱'], ['pig', '🐷'], ['pot', '🍲'], ['cap', '🧢'], ['kid', '🧒'],
  ['hen', '🐔'], ['pen', '🖊️'], ['ten', '🔟'], ['net', '🥅'], ['sun', '☀️'], ['cup', '☕'], ['nut', '🥜'], ['rat', '🐀'], ['hat', '🎩'], ['duck', '🦆'], ['sock', '🧦'], ['hug', '🤗'],
  ['bat', '🦇'], ['bed', '🛏️'], ['bus', '🚌'], ['bug', '🐛'], ['bag', '👜'], ['leg', '🦵'], ['lip', '👄'], ['jet', '✈️'], ['bin', '🗑️'],
  ['van', '🚐'], ['web', '🕸️'], ['fox', '🦊'], ['box', '📦'], ['six', '6️⃣']
];
export const sounds = w => { const out = []; for (let i = 0; i < w.length; i++) { if (w.slice(i, i + 2) === 'ck' || w.slice(i, i + 2) === 'qu') { out.push(w.slice(i, i + 2)); i++; } else out.push(w[i]); } return out; };
export const decodable = (w, known) => sounds(w).every(s => known.includes(s));

// Tricky words: read by sight, they do not follow the sound rules (yet).
export const TRICKY = {
  t1: ['I', 'the', 'to', 'no', 'go', 'into'],
  t2: ['he', 'she', 'we', 'me', 'be', 'was', 'my', 'you'],
  t3: ['they', 'her', 'all', 'are', 'said', 'have', 'like', 'so', 'do', 'some', 'come', 'were', 'there', 'one', 'what', 'when']
};

// Rhyming families (each word with its picture).
export const RHYMES = [
  [['cat', '🐱'], ['hat', '🎩'], ['bat', '🦇'], ['rat', '🐀']], [['hen', '🐔'], ['pen', '🖊️'], ['ten', '🔟']], [['dog', '🐶'], ['frog', '🐸']], [['fox', '🦊'], ['box', '📦']],
  [['jet', '✈️'], ['net', '🥅']], [['cake', '🍰'], ['snake', '🐍']], [['king', '👑'], ['ring', '💍']], [['moon', '🌙'], ['spoon', '🥄']], [['bee', '🐝'], ['tree', '🌳'], ['three', '3️⃣']],
  [['car', '🚗'], ['star', '⭐']], [['goat', '🐐'], ['boat', '⛵'], ['coat', '🧥']], [['mouse', '🐭'], ['house', '🏠']], [['bear', '🐻'], ['pear', '🍐'], ['chair', '🪑']],
  [['snail', '🐌'], ['whale', '🐋']], [['light', '💡'], ['kite', '🪁']], [['clock', '⏰'], ['sock', '🧦']], [['fish', '🐟'], ['dish', '🍽️']], [['bell', '🔔'], ['shell', '🐚']],
  [['tie', '👔'], ['pie', '🥧']], [['nose', '👃'], ['rose', '🌹']], [['hand', '✋'], ['sand', '🏖️']], [['bug', '🐛'], ['mug', '☕']]
];
// Easy families (short words) for the first rhyme lesson.
export const RHYMES_EASY = RHYMES.filter(f => f.every(([w]) => w.length <= 4));

// Picture words by topic (for first- and second-language learners).
export const VOCAB = {
  animals: [['cat', '🐱'], ['dog', '🐶'], ['cow', '🐄'], ['horse', '🐴'], ['pig', '🐷'], ['sheep', '🐑'], ['duck', '🦆'], ['lion', '🦁'], ['tiger', '🐯'], ['elephant', '🐘'], ['monkey', '🐒'], ['rabbit', '🐰'], ['fish', '🐟'], ['bird', '🐦'], ['frog', '🐸'], ['bear', '🐻'], ['zebra', '🦓'], ['giraffe', '🦒']],
  food: [['apple', '🍎'], ['banana', '🍌'], ['grapes', '🍇'], ['orange', '🍊'], ['bread', '🍞'], ['milk', '🥛'], ['egg', '🥚'], ['cake', '🍰'], ['rice', '🍚'], ['carrot', '🥕'], ['cheese', '🧀'], ['strawberry', '🍓'], ['pizza', '🍕'], ['tomato', '🍅'], ['mango', '🥭'], ['biscuit', '🍪']],
  body: [['eye', '👁️'], ['ear', '👂'], ['nose', '👃'], ['mouth', '👄'], ['hand', '✋'], ['foot', '🦶'], ['leg', '🦵'], ['tooth', '🦷'], ['arm', '💪']],
  clothes: [['shirt', '👕'], ['dress', '👗'], ['shoe', '👟'], ['hat', '🎩'], ['sock', '🧦'], ['coat', '🧥'], ['trousers', '👖'], ['scarf', '🧣'], ['cap', '🧢'], ['gloves', '🧤']],
  home: [['bed', '🛏️'], ['chair', '🪑'], ['door', '🚪'], ['light', '💡'], ['key', '🔑'], ['cup', '☕'], ['clock', '⏰'], ['sofa', '🛋️'], ['bath', '🛁'], ['phone', '📱'], ['book', '📖'], ['TV', '📺']],
  travel: [['car', '🚗'], ['bus', '🚌'], ['train', '🚆'], ['plane', '✈️'], ['boat', '⛵'], ['bike', '🚲'], ['ship', '🚢'], ['truck', '🚚'], ['rocket', '🚀'], ['tractor', '🚜'], ['helicopter', '🚁']]
};
// Colours are shown as swatches, not emoji.
export const COLOURS = [['red', '#e03131'], ['blue', '#1c7ed6'], ['green', '#2f9e44'], ['yellow', '#fcc419'], ['orange', '#fd7e14'], ['purple', '#9c36b5'], ['pink', '#f783ac'], ['black', '#212529'], ['white', '#ffffff'], ['brown', '#8a5a3b'], ['grey', '#adb5bd']];

// Short original stories, each with questions. Words are mostly ones the learner can sound out.
export const STORIES = {
  cat: { title: 'Sam and the cat', pic: '🐱', text: 'Sam has a cat. The cat is on a mat. The cat naps on the mat. Sam pats the cat.',
    qs: [['Who has a cat?', ['Sam', 'Pip', 'Tim']], ['Where does the cat nap?', ['on the mat', 'in a box', 'on a bus']], ['What does Sam do?', ['pats the cat', 'runs to the shop', 'gets a hat']]] },
  hen: { title: 'The red hen', pic: '🐔', text: 'A red hen is in a pen. The hen has ten eggs. A big dog sits by the pen. The dog is kind to the hen.',
    qs: [['What colour is the hen?', ['red', 'blue', 'pink']], ['How many eggs does the hen have?', ['ten', 'six', 'two']], ['Who sits by the pen?', ['a dog', 'a cat', 'a fox']]] },
  bus: { title: 'Pip and the bus', pic: '🚌', text: 'Pip got on the bus with Mum. The bus went up the hill. Pip had a bun in a bag. At the top, Pip and Mum got off and sat in the sun.',
    qs: [['Who did Pip go with?', ['Mum', 'Dad', 'Sam']], ['Where did the bus go?', ['up the hill', 'to the sea', 'into a tunnel']], ['What was in the bag?', ['a bun', 'a cup', 'a hat']]] },
  fox: { title: 'The fox and the box', pic: '🦊', text: 'A fox saw a big box. "What is in the box?" said the fox. The fox put his nose in. It was a pup! The pup and the fox ran off to play.',
    qs: [['What did the fox see?', ['a big box', 'a bus', 'a hen']], ['What was in the box?', ['a pup', 'a cat', 'a rock']], ['What did they do next?', ['ran off to play', 'went to bed', 'had a cake']]] },
  kite: { title: "Jen's red kite", pic: '🪁', text: 'Jen has a red kite. It is windy, so Jen runs up the hill. The kite goes up, up, up! Then it lands in a tree. Dad gets it down.',
    qs: [['What colour is the kite?', ['red', 'green', 'yellow']], ['Where does the kite land?', ['in a tree', 'in a pond', 'on a bus']], ['Who gets the kite down?', ['Dad', 'Jen', 'a dog']]] },
  bug: { title: 'Ben and the bug', pic: '🐛', text: 'Ben has a cup. In the cup is a bug. The bug is green and it has six legs. Ben lets the bug go on a leaf.',
    qs: [['What is in the cup?', ['a bug', 'a nut', 'a sock']], ['How many legs does the bug have?', ['six', 'ten', 'two']], ['Where does Ben let the bug go?', ['on a leaf', 'in the bin', 'on the bed']]] }
};
