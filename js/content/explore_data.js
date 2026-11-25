// Explorers (Grades 2–8): spelling, grammar and punctuation, vocabulary, comprehension and sentences.
// All sentences and passages are original. In option lists the right answer comes first (the app shuffles).

// ---------- Spelling: build the word you hear, with a sentence to show its meaning ----------
// [word, picture or '', sentence with ___]
export const SPELL = {
  teams1: [
    ['rain', '🌧️', 'Take a coat. It may ___ later.'], ['snail', '🐌', 'A ___ moves very slowly.'], ['train', '🚆', 'We went to the city by ___.'], ['paint', '🎨', 'Let us ___ a picture.'],
    ['play', '', 'Can I ___ outside?'], ['day', '', 'Today is a sunny ___.'], ['tree', '🌳', 'The bird is in the ___.'], ['sheep', '🐑', 'The ___ says baa.'], ['green', '', 'Grass is ___.'],
    ['sleep', '😴', 'I ___ in my bed.'], ['read', '📖', 'I like to ___ books.'], ['beach', '🏖️', 'We built a sandcastle on the ___.'], ['leaf', '🍃', 'A ___ fell off the tree.'],
    ['boat', '⛵', 'The ___ sails on the sea.'], ['coat', '🧥', 'Put on your ___.'], ['road', '', 'Look both ways before you cross the ___.'], ['snow', '❄️', 'The ___ is cold and white.'], ['soap', '🧼', 'Wash your hands with ___.']
  ],
  teams2: [
    ['night', '🌙', 'The stars come out at ___.'], ['light', '💡', 'Switch on the ___.'], ['high', '', 'The kite flew ___ in the sky.'], ['pie', '🥧', 'We baked an apple ___.'],
    ['spoon', '🥄', 'Eat your soup with a ___.'], ['book', '📕', 'I am reading a good ___.'], ['foot', '🦶', 'I hurt my ___ on a stone.'], ['star', '⭐', 'Make a wish on a ___.'],
    ['farm', '🚜', 'Cows and pigs live on a ___.'], ['fork', '🍴', 'Eat with a knife and ___.'], ['house', '🏠', 'We live in a red ___.'], ['mouse', '🐭', 'The ___ ran under the bed.'],
    ['cow', '🐄', 'The ___ gives us milk.'], ['owl', '🦉', 'An ___ hoots at night.'], ['bird', '🐦', 'A ___ sang in the tree.'], ['girl', '👧', 'The ___ waved to her friend.'],
    ['turn', '', 'It is your ___ to play.'], ['ship', '🚢', 'The ___ sailed across the ocean.'], ['shop', '🏪', 'We bought bread at the ___.'], ['chin', '', 'He rested his ___ on his hand.']
  ],
  silent: [
    ['knee', '🦵', 'I fell and hurt my ___.'], ['knock', '🚪', 'Please ___ before you come in.'], ['write', '✍️', 'Please ___ your name at the top.'], ['lamb', '🐑', 'A baby sheep is called a ___.'],
    ['thumb', '👍', 'I cut my ___ on the paper.'], ['comb', '', 'Use a ___ to tidy your hair.'], ['whale', '🐋', 'A ___ is a huge sea animal.'], ['phone', '📱', 'Answer the ___, please.'],
    ['photo', '📷', 'Let us take a ___ of the view.'], ['knife', '🔪', 'Cut the bread with a ___.'], ['wrist', '⌚', 'I wear my watch on my ___.'], ['white', '', 'Snow is ___.']
  ]
};

// ---------- Spelling: which is spelt correctly? [right, wrong, wrong] ----------
export const SPOT = {
  easy: [['rain', 'rane', 'rayn'], ['play', 'plai', 'plae'], ['tree', 'tre', 'trea'], ['boat', 'bote', 'bowt'], ['green', 'grean', 'grene'], ['snow', 'sno', 'snoa'],
    ['beach', 'beatch', 'bech'], ['sheep', 'sheap', 'shep'], ['coat', 'cote', 'cowt'], ['night', 'nite', 'nigt'], ['house', 'hows', 'howse'], ['friend', 'freind', 'frend'], ['said', 'sed', 'sayd'], ['because', 'becuase', 'becos']],
  hard: [['station', 'stashun', 'stasion'], ['famous', 'famus', 'fameous'], ['believe', 'beleive', 'belive'], ['receive', 'recieve', 'receeve'], ['possible', 'possable', 'posible'],
    ['comfortable', 'comfortible', 'confortable'], ['necessary', 'neccessary', 'necesary'], ['separate', 'seperate', 'separete'], ['different', 'diffrent', 'diferent'], ['February', 'Febuary', 'Febraury'],
    ['beautiful', 'beutiful', 'beautifull'], ['island', 'iland', 'islend'], ['library', 'libary', 'liberry'], ['knowledge', 'knowlege', 'nolledge'], ['government', 'goverment', 'govenment'], ['definitely', 'definately', 'defenitely']]
};

// ---------- Spelling: words that sound the same. [sentence, right, ...wrong] ----------
export const HOMO = {
  h1: [['I want ___ go to the park.', 'to', 'too', 'two'], ['I have ___ cats.', 'two', 'to', 'too'], ['Can I come ___?', 'too', 'to', 'two'],
    ['The children put on ___ coats.', 'their', 'there', "they're"], ['Put the box over ___.', 'there', 'their', "they're"], ["___ going to be late!", "They're", 'Their', 'There'],
    ['Come over ___ and sit down.', 'here', 'hear'], ['I can ___ the birds singing.', 'hear', 'here'], ['We swam in the ___.', 'sea', 'see'], ['I can ___ the moon.', 'see', 'sea'],
    ['The wind ___ the leaves away.', 'blew', 'blue'], ['The sky is ___.', 'blue', 'blew']],
  h2: [["___ welcome to stay.", "You're", 'Your'], ['Is this ___ bag?', 'your', "you're"], ['The dog wagged ___ tail.', 'its', "it's"], ["___ raining again.", "It's", 'Its'],
    ['___ are my shoes?', 'Where', 'Wear', 'Were'], ['What will you ___ to the party?', 'wear', 'where', 'were'], ['We ___ late for school.', 'were', 'where', 'wear'],
    ['Please ___ your name here.', 'write', 'right'], ['Turn ___ at the shop.', 'right', 'write'], ['___ book is yours?', 'Which', 'Witch'], ['The ___ flew on a broomstick.', 'witch', 'which']],
  h3: [['The rain will not ___ our plans.', 'affect', 'effect'], ['The medicine had a good ___.', 'effect', 'affect'], ['Everyone came ___ Sam.', 'except', 'accept'], ['Please ___ this gift.', 'accept', 'except'],
    ['Do not ___ your keys.', 'lose', 'loose'], ['My tooth is ___.', 'loose', 'lose'], ['Please be ___ in the library.', 'quiet', 'quite'], ['The film was ___ good.', 'quite', 'quiet'],
    ['My brother is taller ___ me.', 'than', 'then'], ['We ate, and ___ we played.', 'then', 'than'], ['She gave me some good ___.', 'advice', 'advise'], ['I ___ you to rest.', 'advise', 'advice'],
    ['The ___ of the school gave a speech.', 'principal', 'principle']]
};

// ---------- Plurals: [one, right plural, wrong, wrong] ----------
export const PLURAL = {
  p1: [['cat', 'cats', 'cates', 'catss'], ['box', 'boxes', 'boxs', 'boxies'], ['bus', 'buses', 'buss', 'busies'], ['dish', 'dishes', 'dishs', 'dishies'], ['fox', 'foxes', 'foxs', 'foxies'],
    ['dog', 'dogs', 'doges', 'dogies'], ['watch', 'watches', 'watchs', 'watchies'], ['bench', 'benches', 'benchs', 'benchies'], ['brush', 'brushes', 'brushs', 'brushies'], ['hat', 'hats', 'hates', 'hatss']],
  p2: [['baby', 'babies', 'babys', 'babyes'], ['party', 'parties', 'partys', 'partyes'], ['city', 'cities', 'citys', 'cityes'], ['leaf', 'leaves', 'leafs', 'leafes'], ['knife', 'knives', 'knifes', 'knifs'],
    ['wolf', 'wolves', 'wolfs', 'wolfes'], ['child', 'children', 'childs', 'childes'], ['mouse', 'mice', 'mouses', 'mices'], ['tooth', 'teeth', 'tooths', 'teeths'], ['foot', 'feet', 'foots', 'feets'],
    ['man', 'men', 'mans', 'mens'], ['sheep', 'sheep', 'sheeps', 'sheepes'], ['day', 'days', 'daies', 'dayes'], ['toy', 'toys', 'toies', 'toyes']]
};

// ---------- Adding endings: [word, ending, right, wrong, wrong] ----------
export const SUFFIX = [['hop', 'ing', 'hopping', 'hoping', 'hopeing'], ['run', 'ing', 'running', 'runing', 'runnning'], ['swim', 'ing', 'swimming', 'swiming', 'swimeing'], ['make', 'ing', 'making', 'makeing', 'makking'],
  ['ride', 'ing', 'riding', 'rideing', 'ridding'], ['play', 'ing', 'playing', 'plaing', 'plaiing'], ['hope', 'ed', 'hoped', 'hopped', 'hopeed'], ['stop', 'ed', 'stopped', 'stoped', 'stopt'],
  ['jump', 'ed', 'jumped', 'jumpped', 'jumpt'], ['carry', 'ed', 'carried', 'carryed', 'carred'], ['cry', 'ed', 'cried', 'cryed', 'cride'], ['big', 'er', 'bigger', 'biger', 'bigest'],
  ['happy', 'er', 'happier', 'happyer', 'happer'], ['nice', 'est', 'nicest', 'niceest', 'nicist'], ['sad', 'ness', 'sadness', 'sadnes', 'saddness'], ['care', 'ful', 'careful', 'carefull', 'carful'], ['hope', 'less', 'hopeless', 'hopless', 'hopeles']];

// ---------- Grammar: tap the word. *marks the one answer; the sentence has no other word of that kind ----------
export const TAP = {
  noun: ['The *dog is happy.', 'My *teacher smiled.', 'A *bird sang sweetly.', '*Grandma laughed loudly.', 'The *ball is red.', 'Our *garden looks lovely.', 'That *cake was delicious.', 'A small *kitten slept.', 'The *rain stopped suddenly.', 'Her *bike is very fast.'],
  verb: ['The frog *jumps.', 'Birds *sing in spring.', 'My sister *runs fast.', 'The baby *cried.', 'We *played outside.', 'Tom *kicked the ball.', 'The sun *shines brightly.', 'Dad *cooks dinner.', 'The children *laughed loudly.', 'A duck *swam across the pond.'],
  adjective: ['The *tall girl waved.', 'We saw a *huge whale.', 'I ate a *juicy apple.', 'The *noisy crowd cheered.', 'She has a *red kite.', 'The soup is *hot.', 'My *old shoes need cleaning.', 'A *friendly dog wagged its tail.', 'The film was *scary.', 'He wore a *woolly hat.'],
  adverb: ['The tortoise walked *slowly.', 'She sang *beautifully.', 'The children waited *patiently.', 'He *quickly closed the door.', 'The wind blew *fiercely.', 'We *carefully crossed the road.', 'The baby slept *peacefully.', 'They laughed *happily.', 'The car stopped *suddenly.', 'She answered the question *correctly.'],
  capital: ['My friend *sam likes football.', 'We visited *london last year.', 'My birthday is in *june.', 'On *monday we have art.', 'Ravi and *i went swimming.', 'Our dog is called *max.', 'Dad was born in *india.', 'Is it *friday today?', 'We live near *paris.', 'My cousin *maya is seven.']
};
export const TAP_ASK = { noun: 'Tap the noun (a person, place or thing).', verb: 'Tap the verb (the doing word).', adjective: 'Tap the adjective (the describing word).', adverb: 'Tap the adverb (it tells how something is done).', capital: 'Tap the word that needs a capital letter.' };

// ---------- Grammar and punctuation: choose. [question html, right, ...wrong] ----------
export const PICKS = {
  endmark: [['Where is my hat', '?', '.', '!'], ['I like apples', '.', '?', '!'], ['What a huge cake', '!', '?', '.'], ['Can you help me', '?', '.', '!'], ['The bus is late', '.', '?', '!'],
    ['Watch out', '!', '?', '.'], ['Do you like dogs', '?', '.', '!'], ['We are going to the zoo', '.', '?', '!'], ['Ouch, that hurts', '!', '?', '.'], ['How old are you', '?', '.', '!'], ['My dog is brown', '.', '?', '!'], ['Hooray, we won', '!', '?', '.']],
  article: [['___ apple 🍎', 'an', 'a'], ['___ egg 🥚', 'an', 'a'], ['___ umbrella ☂️', 'an', 'a'], ['___ orange 🍊', 'an', 'a'], ['___ owl 🦉', 'an', 'a'], ['___ elephant 🐘', 'an', 'a'], ['___ ant 🐜', 'an', 'a'], ['___ octopus 🐙', 'an', 'a'],
    ['___ banana 🍌', 'a', 'an'], ['___ dog 🐶', 'a', 'an'], ['___ car 🚗', 'a', 'an'], ['___ pear 🍐', 'a', 'an'], ['___ kite 🪁', 'a', 'an'], ['___ lion 🦁', 'a', 'an']],
  past: [['Yesterday I ___ to the park. (go)', 'went', 'goed', 'gone'], ['Last night we ___ a film. (see)', 'saw', 'seed', 'seen'], ['She ___ a letter to Gran. (write)', 'wrote', 'writed', 'written'],
    ['He ___ his lunch at noon. (eat)', 'ate', 'eated', 'eaten'], ['They ___ a big sandcastle. (make)', 'made', 'maked', 'maden'], ['We ___ home at six. (come)', 'came', 'comed', 'comen'],
    ['The dog ___ the ball. (catch)', 'caught', 'catched', 'caughted'], ['Mum ___ me a story. (tell)', 'told', 'telled', 'tolled'], ['The children ___ a song. (sing)', 'sang', 'singed', 'sunged'],
    ['She ___ fast in the race. (run)', 'ran', 'runned', 'runed'], ['He ___ the bus to school. (take)', 'took', 'taked', 'tooked']],
  agree: [['The dogs ___ barking.', 'are', 'is'], ['My brother ___ tall.', 'is', 'are'], ['The apples ___ sweet.', 'are', 'is'], ['This book ___ funny.', 'is', 'are'], ['We ___ ready.', 'are', 'is'],
    ['The sky ___ blue.', 'is', 'are'], ['Sam and Ali ___ friends.', 'are', 'is'], ['They ___ late yesterday.', 'were', 'was'], ['I ___ tired last night.', 'was', 'were'], ['The birds ___ singing.', 'are', 'is']],
  conj: [['I was hungry, ___ I ate an apple.', 'so', 'but', 'because'], ['I wanted to play, ___ it was raining.', 'but', 'so', 'because'], ['We stayed inside ___ it was raining.', 'because', 'so', 'but'],
    ['She was tired, ___ she kept running.', 'but', 'so', 'because'], ['He smiled ___ he was happy.', 'because', 'but', 'so'], ['It was cold, ___ we wore coats.', 'so', 'but', 'because'], ['You can have juice ___ milk.', 'or', 'so', 'because']],
  pronoun: [['Sam lost ___ hat.', 'his', 'him', 'he'], ['Mia and I went out. ___ had fun.', 'We', 'Us', 'Our'], ['The cat licked ___ paws.', 'its', 'it', "it's"], ['Tom is my friend. I like ___.', 'him', 'he', 'his'],
    ['Priya is here. ___ is ready.', 'She', 'Her', 'Hers'], ['That ball belongs to me. It is ___.', 'mine', 'my', 'me'], ['Can you help my sister and me? Please help ___.', 'us', 'we', 'our'], ['The children waved. ___ were excited.', 'They', 'Them', 'Their']],
  prep: [['We have lunch ___ noon.', 'at', 'on', 'in'], ['My birthday is ___ May.', 'in', 'on', 'at'], ['The party is ___ Saturday.', 'on', 'in', 'at'], ['She was born ___ 2015.', 'in', 'on', 'at'],
    ["I will see you ___ five o'clock.", 'at', 'in', 'on'], ['We go to school ___ bus.', 'by', 'on', 'with'], ['The picture hangs ___ the wall.', 'on', 'at', 'of'], ["I'm afraid ___ spiders.", 'of', 'from', 'at'], ['She jumped ___ the pool.', 'into', 'onto', 'at']],
  contract: [['do not', "don't", "dont'", "do'nt"], ['cannot', "can't", "cant'", "ca'nt"], ['I am', "I'm", "Im'", "I'am"], ['we are', "we're", "were'", "we'are"], ['she will', "she'll", "shel'l", "she'ill"],
    ['they have', "they've", "theyv'e", "they'ave"], ['would not', "wouldn't", "would'nt", "wouldnt'"], ['you are', "you're", "your'e", "you'are"], ['it is', "it's", "its'", "i'ts"]],
  possess: [['the bone belonging to the dog', "the dog's bone", 'the dogs bone', "the dogs' bone"], ['the toys belonging to the children', "the children's toys", "the childrens' toys", 'the childrens toys'],
    ['the nests belonging to the birds', "the birds' nests", "the bird's nests", 'the birds nests'], ['the bike belonging to Sam', "Sam's bike", 'Sams bike', "Sams' bike"], ['the tails of the cats', "the cats' tails", "the cat's tails", 'the cats tails'],
    ['the hat of the man', "the man's hat", "the mans' hat", 'the mans hat'], ["the books of the girls", "the girls' books", "the girl's books", 'the girls books'], ['the room of the women', "the women's room", "the womens' room", 'the womens room']],
  tense: [['Tomorrow we ___ to the beach.', 'will go', 'went', 'go'], ['Right now she ___ a book.', 'is reading', 'read', 'will read'], ['Last week they ___ a museum.', 'visited', 'visit', 'will visit'],
    ['Every day he ___ his teeth.', 'brushes', 'brushed', 'will brush'], ['Next year I ___ ten.', 'will be', 'was', 'am'], ['At the moment we ___ dinner.', 'are having', 'had', 'will have'],
    ['Yesterday it ___ all day.', 'rained', 'rains', 'will rain'], ['She ___ already finished her homework.', 'has', 'have', 'is']],
  speech: [['Which is punctuated correctly?', '"Come here," said Mum.', '"Come here" said Mum.', 'Come here, said Mum.'], ['Which is punctuated correctly?', '"Are you ready?" asked Ben.', '"Are you ready" asked Ben?', 'Are you ready? asked Ben.'],
    ['Which is punctuated correctly?', 'Sara shouted, "Watch out!"', 'Sara shouted "Watch out!"', 'Sara shouted, "watch out"!'], ['Which is punctuated correctly?', '"I like pizza," said Leo.', '"I like pizza" said Leo.', '"I like pizza." said Leo'],
    ['Which is punctuated correctly?', 'Dad asked, "Where are my keys?"', 'Dad asked, "Where are my keys"?', 'Dad asked "where are my keys?"'], ['Which is punctuated correctly?', '"Let\'s go!" cried Ava.', '"Let\'s go" cried Ava!', 'Let\'s go! cried Ava.']],
  passive: [['The cat chased the mouse.', 'The mouse was chased by the cat.', 'The cat was chased by the mouse.', 'The mouse chased the cat.'], ['Ravi painted the fence.', 'The fence was painted by Ravi.', 'Ravi was painted by the fence.', 'The fence painted Ravi.'],
    ['The chef cooked the meal.', 'The meal was cooked by the chef.', 'The chef was cooked by the meal.', 'The meal cooks the chef.'], ['The wind broke the window.', 'The window was broken by the wind.', 'The wind was broken by the window.', 'The window breaks the wind.'],
    ['Children planted the trees.', 'The trees were planted by children.', 'The trees was planted by children.', 'Children were planted by the trees.'], ['The teacher marked the tests.', 'The tests were marked by the teacher.', 'The tests was marked by the teacher.', 'The teacher was marked by the tests.'],
    ['A storm damaged the roof.', 'The roof was damaged by a storm.', 'The roof damaged a storm.', 'A storm was damaged by the roof.']],
  reported: [['Mia said, "I have finished my work."', 'Mia said that she had finished her work.', 'Mia said that I have finished my work.', 'Mia said that she has finish her work.'],
    ['Tom said, "I will call you."', 'Tom said that he would call me.', 'Tom said that I will call you.', 'Tom said that he will called me.'], ['The teacher said, "Open your books."', 'The teacher told us to open our books.', 'The teacher told us open your books.', 'The teacher said us to open our books.'],
    ['Ali asked, "Where is the station?"', 'Ali asked where the station was.', 'Ali asked where was the station?', 'Ali asked where is the station.'], ['Gran said, "I am going to the market."', 'Gran said that she was going to the market.', 'Gran said that I am going to the market.', 'Gran said that she going to the market.']],
  conditional: [['If it rains, we ___ indoors.', 'will stay', 'would stay', 'stayed'], ['If I were a bird, I ___ fly over the sea.', 'would', 'will', 'did'], ['If you heat ice, it ___.', 'melts', 'melted', 'would melted'],
    ['If I had studied, I ___ passed the test.', 'would have', 'will have', 'would'], ['If we leave now, we ___ catch the bus.', 'will', 'would have', 'had'], ['If she had seen the sign, she ___ stopped.', 'would have', 'will have', 'would']],
  colon: [['Which is punctuated correctly?', 'I need three things: pens, paper and glue.', 'I need three things; pens, paper and glue.', 'I need: three things, pens, paper and glue.'],
    ['Which is punctuated correctly?', 'It was raining; we stayed indoors.', 'It was raining, we stayed indoors.', 'It was; raining we stayed indoors.'], ['Which is punctuated correctly?', 'She had one dream: to fly.', 'She had one dream; to fly.', 'She had: one dream to fly.'],
    ['Which is punctuated correctly?', 'The sun had set; the sky was dark.', 'The sun had set, the sky was dark.', 'The sun; had set the sky was dark.'], ['Which is punctuated correctly?', 'Bring these items: a torch, a map and water.', 'Bring these items; a torch, a map and water.', 'Bring: these items a torch, a map and water.']],
  join: [['It was raining. We took umbrellas.', 'It was raining, so we took umbrellas.', 'It was raining, but we took umbrellas.', 'It was raining because we took umbrellas.'],
    ['I was tired. I went to bed early.', 'I was tired, so I went to bed early.', 'I was tired, but I went to bed early.', 'I was tired because I went to bed early.'],
    ['The shop was shut. We went home.', 'The shop was shut, so we went home.', 'The shop was shut, but we went home.', 'The shop was shut because we went home.'],
    ['Sam is small. He is very strong.', 'Sam is small, but he is very strong.', 'Sam is small, so he is very strong.', 'Sam is small because he is very strong.'],
    ['We stayed inside. It was too hot.', 'We stayed inside because it was too hot.', 'We stayed inside, so it was too hot.', 'We stayed inside, but it was too hot.']]
};
export const PICK_ASK = {
  endmark: 'Which mark ends this sentence?', article: 'Which word goes in the gap?', past: 'Choose the right past tense.', agree: 'Which word fits?', conj: 'Which joining word fits best?',
  pronoun: 'Which word fits?', prep: 'Which word fits?', contract: 'What is the short form?', possess: 'Which is written correctly?', tense: 'Which verb fits the sentence?', speech: '',
  passive: 'Which sentence says the same thing in the passive voice?', reported: 'Which is the correct reported speech?', conditional: 'Which words fit?', colon: '', join: 'Which joins the two sentences best?'
};

// ---------- Vocabulary ----------
export const OPPOSITE = [['hot', 'cold'], ['big', 'small'], ['happy', 'sad'], ['up', 'down'], ['fast', 'slow'], ['day', 'night'], ['wet', 'dry'], ['full', 'empty'], ['tall', 'short'], ['loud', 'quiet'], ['hard', 'soft'], ['early', 'late'], ['push', 'pull'], ['first', 'last']];
export const SYNONYM = [['big', 'large'], ['small', 'tiny'], ['happy', 'glad'], ['fast', 'quick'], ['begin', 'start'], ['shut', 'close'], ['angry', 'cross'], ['scared', 'afraid'], ['smart', 'clever'], ['shout', 'yell'], ['tired', 'sleepy'], ['jump', 'leap'], ['quiet', 'silent'], ['funny', 'amusing']];
// [meaning, right, wrong, wrong]
export const PREFIX = [['not happy', 'unhappy', 'dishappy', 'rehappy'], ['not kind', 'unkind', 'diskind', 'miskind'], ['not agree', 'disagree', 'unagree', 'misagree'], ['go out of sight', 'disappear', 'unappear', 'misappear'],
  ['build again', 'rebuild', 'unbuild', 'disbuild'], ['not tidy', 'untidy', 'distidy', 'mistidy'], ['not obey', 'disobey', 'unobey', 'misobey'], ['write again', 'rewrite', 'diswrite', 'unwrite'], ['not able', 'unable', 'misable', 'reable'], ['spell wrongly', 'misspell', 'unspell', 'disspell']];
// [sentence with <b>word</b>, right meaning, wrong, wrong]
export const CONTEXT = [['The path was <b>narrow</b>, so we walked in a line.', 'not wide', 'very long', 'very dark'], ['Sam was <b>exhausted</b> after the long race.', 'very tired', 'very happy', 'very hungry'],
  ['The old house looked <b>gloomy</b> in the rain.', 'dark and sad', 'bright and cheerful', 'new and clean'], ['She gave a <b>brief</b> speech and sat down.', 'short', 'loud', 'funny'],
  ['The <b>timid</b> puppy hid behind the sofa.', 'shy and nervous', 'brave and bold', 'hungry and thirsty'], ['We shared an <b>enormous</b> pizza.', 'very big', 'very small', 'very cold'],
  ['The water was <b>shallow</b>, so we could stand up.', 'not deep', 'very cold', 'very dirty'], ['He was <b>furious</b> when his bike was stolen.', 'very angry', 'very sleepy', 'very pleased'],
  ['The instructions were <b>clear</b>, so we finished quickly.', 'easy to understand', 'very long', 'hard to read'], ['The village was <b>remote</b>, far from any town.', 'far away from others', 'very busy', 'very large']];
export const IDIOM = [["It's raining cats and dogs.", 'It is raining very heavily.', 'Animals are falling from the sky.', 'It is a light shower.'], ['Break a leg!', 'Good luck!', 'Be careful, you might fall.', 'Go away!'],
  ['That test was a piece of cake.', 'It was very easy.', 'It was delicious.', 'It was very hard.'], ['Hold your horses.', 'Wait a moment.', 'Ride faster.', 'Hold on tight.'],
  ["I'm feeling under the weather.", 'I feel a bit ill.', 'I am outside in the rain.', 'I feel very happy.'], ['She let the cat out of the bag.', 'She told a secret.', 'She set a pet free.', 'She went shopping.'],
  ['We go there once in a blue moon.', 'We go there very rarely.', 'We go there every night.', 'We go there when the moon is blue.'], ['He has a heart of gold.', 'He is very kind.', 'He is very rich.', 'He is very ill.'],
  ['Time to hit the books.', 'Time to study hard.', 'Time to throw the books.', 'Time to tidy the shelves.']];
// [noun, adjective, adverb]
export const FAMILY = [['happiness', 'happy', 'happily'], ['danger', 'dangerous', 'dangerously'], ['beauty', 'beautiful', 'beautifully'], ['success', 'successful', 'successfully'], ['strength', 'strong', 'strongly'],
  ['silence', 'silent', 'silently'], ['anger', 'angry', 'angrily'], ['honesty', 'honest', 'honestly'], ['energy', 'energetic', 'energetically'], ['comfort', 'comfortable', 'comfortably']];
// [informal situation, formal, informal, informal]
export const FORMAL = [['Asking for information', 'I would like to request more information.', 'Tell me more, yeah?', 'Gimme the details.'], ['Complaining to a bus company', 'I am writing to complain about the delay.', 'Your bus was super late, not cool.', 'Ugh, the bus again!'],
  ['Asking for a form', 'Could you please send me the form?', 'Send the form, OK?', 'Shoot me the form.'], ['Saying sorry to a customer', 'I apologise for the inconvenience.', 'Sorry, my bad!', 'Oops, sorry about that!'],
  ['Ending a letter to a new school', 'We look forward to meeting you.', "Can't wait to see ya!", 'See you soon, yeah?'], ['Sending a report to a manager', 'Please find my report attached.', "Here's the report thing.", "Report's attached, have a look."]];

// ---------- Sentences: put the words in order. Punctuation stays on its word, so only one order works ----------
export const ORDER = {
  s1: ['The cat is on the mat.', 'I can see a red bus.', 'We went to the park.', 'My dog likes to run.', 'She has a big hat.', 'The sun is hot today.', 'Can you see the bird?', 'I like to read books.'],
  s2: ['The children played in the garden after school.', 'My grandmother makes the best soup.', 'Three ducks swam across the pond.', 'We wore our coats because it was cold.', 'Can you help me carry this box?', 'Our train left exactly on time.'],
  s3: ['When the bell rang, everyone ran outside.', 'Although it was late, we kept reading.', 'The boy who lives next door has a puppy.', 'If you are hungry, you can have a snack.', 'After the storm, the garden was full of puddles.', 'Before we eat, we wash our hands.']
};

// ---------- Comprehension: original passages, first option of each question is right ----------
export const PASSAGES = {
  garden: { title: "Lily's garden", pic: '🌻', text: 'Lily has a small garden behind her house. Every morning she waters her sunflowers. One sunflower is taller than her dad! In the summer, bees visit the yellow flowers. Lily likes to sit on a bench and watch them.',
    qs: [['What does Lily water every morning?', ['her sunflowers', 'her cat', 'her bike']], ['Who is shorter than one of the sunflowers?', ["Lily's dad", 'the bees', 'the bench']], ['When do the bees visit?', ['in the summer', 'at night', 'in the winter']], ['Where does Lily sit?', ['on a bench', 'on the roof', 'in the pond']]] },
  trip: { title: 'The school trip', pic: '🦕', text: 'On Friday, Class 3 went to the museum. They travelled in a big blue bus. First, they saw the dinosaur bones. Leo thought the T. rex was the scariest thing he had ever seen. After lunch, they made clay pots in the art room. Everyone was tired but happy on the way home.',
    qs: [['On which day was the trip?', ['Friday', 'Monday', 'Sunday']], ['What did the class see first?', ['dinosaur bones', 'clay pots', 'the art room']], ['How did Leo feel about the T. rex?', ['it scared him', 'it bored him', 'it made him laugh']], ['How did the children feel on the way home?', ['tired but happy', 'sad and hungry', 'cross and grumpy']]] },
  bees: { title: 'Honey bees', pic: '🐝', text: 'Honey bees live together in a hive. Each hive has one queen, who lays all the eggs. Worker bees fly from flower to flower collecting nectar, a sweet juice. Back at the hive, they turn the nectar into honey and store it in wax cells. In winter, the bees huddle together to keep warm and eat the honey they saved.',
    qs: [['Who lays the eggs?', ['the queen', 'the worker bees', 'the flowers']], ['What is nectar?', ['a sweet juice from flowers', 'a kind of wax', 'a type of egg']], ['Where do the bees store honey?', ['in wax cells', 'inside flowers', 'under the ground']], ['Why do the bees save honey?', ['to eat in winter', 'to sell it', 'to feed the flowers']]] },
  storm: { title: 'The storm', pic: '⛈️', text: 'The sky turned the colour of a bruise as Amara cycled home. A cold wind tugged at her jacket, and the first fat drops of rain began to fall. She pedalled harder, her heart thumping. By the time she reached her gate, thunder was rolling overhead. Her grandfather was waiting at the door with a towel and a grin. "Just in time," he said.',
    qs: [['What was the weather like?', ['stormy', 'sunny', 'snowy']], ['Why did Amara pedal harder?', ['to get home before the storm', 'she was in a race', 'her bike was broken']], ['What does "the colour of a bruise" tell us about the sky?', ['it was dark purple and grey', 'it was bright blue', 'it was pink and gold']], ['How did her grandfather feel?', ['glad she was home', 'angry she was late', 'worried about his towel']]] },
  plastic: { title: 'Plastic in the ocean', pic: '🌊', text: 'Every year, millions of tonnes of plastic end up in the ocean. Sea turtles can mistake floating bags for jellyfish, one of their favourite foods. Tiny pieces of plastic are swallowed by fish, and some of these fish end up on our plates. The good news is that we can help. Using refillable bottles, saying no to plastic straws and recycling properly all make a difference.',
    qs: [['Why do turtles eat plastic bags?', ['they look like jellyfish', 'they taste sweet', 'they keep them warm']], ['How can plastic reach our plates?', ['through fish that swallow it', 'in the rain', 'from the turtles']], ['What is the main purpose of this text?', ['to persuade us to use less plastic', 'to teach us how to swim', 'to describe a holiday']], ['Which is one way to help?', ['use a refillable bottle', 'buy more straws', 'leave bags on the beach']]] },
  letter: { title: 'A letter from camp', pic: '🏕️', text: 'Dear Mum and Dad, Camp is brilliant! Yesterday we paddled a canoe across the lake, and I only fell in once. The food is not as good as yours, but the campfire sausages are amazing. Tomorrow we are climbing Eagle Rock, so wish me luck. I miss Biscuit. Please give him a pat from me. Love, Arjun',
    qs: [['Who wrote the letter?', ['Arjun', 'Mum', 'Biscuit']], ['What happened in the canoe?', ['Arjun fell in once', 'the canoe sank', 'Arjun caught a fish']], ['What is Biscuit most likely to be?', ['a pet', 'a teacher', 'a canoe']], ['How does Arjun feel about tomorrow?', ['a little nervous', 'very bored', 'angry']]] }
};

// ================= Hands-on activities =================
// Sort it: boxes and the words that go in each.
export const SORTS = {
  pos3: { boxes: ['Noun', 'Verb', 'Adjective'], ask: 'Sort the words: naming, doing or describing?', items: {
    Noun: ['teacher', 'garden', 'city', 'apple', 'river', 'chair', 'pencil', 'bicycle'], Verb: ['jump', 'eat', 'write', 'laugh', 'build', 'sing', 'carry', 'throw'], Adjective: ['happy', 'tall', 'noisy', 'brave', 'tiny', 'gentle', 'hungry', 'shiny'] } },
  advadj: { boxes: ['Adjective', 'Adverb'], ask: 'Sort the words: describing a thing, or how something is done?', items: {
    Adjective: ['quick', 'slow', 'loud', 'happy', 'careful', 'gentle', 'quiet', 'bad'], Adverb: ['quickly', 'slowly', 'loudly', 'happily', 'carefully', 'gently', 'quietly', 'badly'] } },
  plural: { boxes: ['add -s', 'add -es', 'y → -ies'], ask: 'How does each word make its plural?', items: {
    'add -s': ['dog', 'book', 'tree', 'car', 'toy', 'day'], 'add -es': ['box', 'bus', 'dish', 'watch', 'fox', 'church'], 'y → -ies': ['baby', 'city', 'party', 'story', 'lady', 'pony'] } },
  past: { boxes: ['add -ed', 'special past'], ask: 'How does each verb make its past tense?', items: {
    'add -ed': ['walk', 'play', 'jump', 'look', 'help', 'want', 'kick', 'climb'], 'special past': ['go', 'see', 'eat', 'run', 'take', 'write', 'sing', 'come'] } },
  fact: { boxes: ['Fact', 'Opinion'], ask: 'Can it be checked (fact), or is it what someone thinks (opinion)?', items: {
    Fact: ['A week has seven days.', 'Paris is in France.', 'Spiders have eight legs.', 'The Sun is a star.', 'Bees make honey.', 'Ice is frozen water.'],
    Opinion: ['Cats are the best pets.', 'Summer is better than winter.', 'Pizza is the tastiest food.', 'That film was too long.', 'Blue is a lovely colour.', 'Football is more fun than tennis.'] } },
  formal: { boxes: ['Formal', 'Informal'], ask: 'Formal (a letter to a school) or informal (a text to a friend)?', items: {
    Formal: ['Dear Sir or Madam', 'Yours faithfully', 'Please find attached', 'I would be grateful if', 'I look forward to hearing from you', 'Kind regards'],
    Informal: ['Hey there!', 'See ya!', 'Cheers!', 'No worries', 'Gonna be late', 'Catch you later'] } }
};
// Match pairs: [left, right].
export const PAIRS = {
  opp: [['hot', 'cold'], ['big', 'small'], ['happy', 'sad'], ['fast', 'slow'], ['day', 'night'], ['wet', 'dry'], ['full', 'empty'], ['loud', 'quiet'], ['early', 'late'], ['push', 'pull']],
  syn: [['big', 'large'], ['small', 'tiny'], ['begin', 'start'], ['shut', 'close'], ['scared', 'afraid'], ['smart', 'clever'], ['shout', 'yell'], ['jump', 'leap'], ['quick', 'fast'], ['glad', 'happy']],
  contract: [['do not', "don't"], ['I am', "I'm"], ['we are', "we're"], ['she will', "she'll"], ['they have', "they've"], ['would not', "wouldn't"], ['you are', "you're"], ['cannot', "can't"], ['it is', "it's"], ['let us', "let's"]],
  irregular: [['child', 'children'], ['mouse', 'mice'], ['tooth', 'teeth'], ['foot', 'feet'], ['man', 'men'], ['woman', 'women'], ['goose', 'geese'], ['person', 'people']],
  prefix: [['unhappy', 'not happy'], ['rebuild', 'build again'], ['disagree', 'not agree'], ['misspell', 'spell wrongly'], ['untidy', 'not tidy'], ['rewrite', 'write again'], ['dislike', 'not like'], ['unlock', 'open a lock']],
  idiom: [['raining cats and dogs', 'raining heavily'], ['a piece of cake', 'very easy'], ['break a leg', 'good luck'], ['under the weather', 'a bit ill'], ['once in a blue moon', 'very rarely'], ['hit the books', 'study hard'], ['hold your horses', 'wait a moment']],
  compound: [['sun', 'flower'], ['foot', 'ball'], ['rain', 'bow'], ['butter', 'fly'], ['tooth', 'brush'], ['star', 'fish'], ['bed', 'room'], ['snow', 'man']]
};
export const PAIRS_ASK = { opp: 'Match each word to its opposite.', syn: 'Match the words that mean the same.', contract: 'Match each pair of words to its short form.', irregular: 'Match each word to its plural.',
  prefix: 'Match each word to its meaning.', idiom: 'Match each saying to what it means.', compound: 'Join the halves to make compound words.' };
// Spot and fix: *marks the mistake; then [right fix, other choices].
export const FIX = {
  homo: [['*Their going to the park.', "They're", 'There'], ['I can *here the birds.', 'hear', 'hare'], ['We swam in the *see.', 'sea', 'sew'], ['Put it over *their.', 'there', "they're"],
    ['Is this *you\'re bag?', 'your', 'yore'], ['The dog wagged *it\'s tail.', 'its', "its'"], ['I want *too go home.', 'to', 'two'], ['*Witch book is yours?', 'Which', 'Wich'], ['Turn *write at the shop.', 'right', 'rite'], ['We *where late again.', 'were', 'wear']],
  spell: [['My *freind is coming over.', 'friend', 'frend'], ['I *beleive you.', 'believe', 'belive'], ['It is a *beautifull day.', 'beautiful', 'beutiful'], ['We went to the *libary.', 'library', 'liberry'],
    ['See you in *Febuary.', 'February', 'Febraury'], ['Please be *carefull.', 'careful', 'carfull'], ['That answer is *definately right.', 'definitely', 'defenitely'], ['We were *runing late.', 'running', 'runnning'], ['The *stoped bus started again.', 'stopped', 'stopt'], ['Two *babys were asleep.', 'babies', 'babyes']],
  grammar: [['The dogs *is barking.', 'are', 'be'], ['Yesterday I *goed home.', 'went', 'gone'], ['She *catched the ball.', 'caught', 'catch'], ['We *was late.', 'were', 'be'], ['He *don\'t like peas.', "doesn't", 'do'],
    ['I have *ate my lunch.', 'eaten', 'eat'], ['There *is three apples.', 'are', 'be'], ['The children *plays outside.', 'play', 'playing'], ['She *runned to school.', 'ran', 'run'], ['They *was singing.', 'were', 'be']]
};
// Punctuate it: {mark} after a word. Marks offered: . , ? !
export const PUNCT = {
  end: ['Where is my coat{?}', 'I like ice cream{.}', 'What a lovely surprise{!}', 'Can you hear the rain{?}', 'The cat is asleep{.}', 'Hooray{,} we won{!}', 'Do you want an apple{?}', 'We are going home{.}'],
  list: ['I packed a hat{,} a coat{,} some gloves and a scarf{.}', 'We saw lions{,} tigers{,} zebras and monkeys{.}', 'Can you bring milk{,} eggs and bread{?}', 'Mum bought apples{,} pears{,} plums and grapes{.}', 'My bag has pens{,} pencils and a ruler{.}', 'We need flour{,} sugar{,} butter and eggs{.}'],
  front: ['After lunch{,} we played football{.}', 'Slowly{,} the tortoise crossed the road{.}', 'In the morning{,} we went swimming{.}', 'Without a sound{,} the cat crept away{.}', 'Before school{,} I brush my teeth{.}', 'Suddenly{,} the lights went out{!}', 'Later that day{,} it began to snow{.}']
};
export const PUNCT_ASK = { end: 'Add the mark at the end.', list: 'Add the commas and the end mark.', front: 'Add the comma after the opening words, and the end mark.' };
