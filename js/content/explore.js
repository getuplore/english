// Question makers for Explorers (Grades 2–8). Data is in explore_data.js.
import { pick, shuffle } from '../core/ui.js';
import { SPELL, SPOT, HOMO, PLURAL, SUFFIX, TAP, TAP_ASK, PICKS, PICK_ASK, OPPOSITE, SYNONYM, PREFIX, CONTEXT, IDIOM, FAMILY, FORMAL, ORDER, PASSAGES } from './explore_data.js';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const textOpt = x => ({ html: `<span class="word">${esc(x)}</span>`, label: x });
const placeAnswer = (right, wrong) => { const opts = shuffle([right, ...wrong]); return { options: opts, answer: opts.indexOf(right) }; };
const gap = s => esc(s).replace('___', '<span class="gap">___</span>');
const choice = (prompt, show, right, wrong, { hint, solution, say, long } = {}) => {
  const { options, answer } = placeAnswer(right, wrong);
  return { template: 'choose', prompt, say, answer, data: { show, options: options.map(textOpt), words: true, long: long ?? options.some(o => o.length > 14) }, hint, solution: solution || [`The answer is <b>${esc(right)}</b>.`] };
};
const card = html => `<div class="qcard">${html}</div>`;

// Spell the word you hear (letter tiles), with a sentence for meaning.
function spellIt({ set }) {
  const [w, e, sent] = pick(SPELL[set]), letters = w.split('');
  const extra = shuffle('abcdefghijklmnopqrstuvwxyz'.split('').filter(c => !letters.includes(c))).slice(0, 3);
  return { template: 'spell', prompt: 'Listen, then spell the word.', say: w, answer: w,
    data: { word: w, pic: e, sentence: sent, tiles: shuffle([...letters, ...extra]), n: letters.length },
    hint: `It starts with "${w[0]}" and has ${w.length} letters.`, solution: [`<b>${esc(w)}</b>: ${letters.map(esc).join(' ')}`] };
}
function spot({ set }) {
  const [r, ...w] = pick(SPOT[set]);
  return choice('Which word is spelt correctly?', '', r, w, { hint: 'Say each word slowly and look at each part.', long: false });
}
function homophone({ set }) {
  const [s, r, ...w] = pick(HOMO[set]);
  return choice('Which word fits?', card(gap(s)), r, w, { hint: 'These words sound the same. Think about what the sentence means.', solution: [esc(s).replace('___', `<b>${esc(r)}</b>`)] });
}
function plural({ set }) {
  const [one, r, ...w] = pick(PLURAL[set]);
  return choice(`One ${esc(one)}, two …`, '', r, w, { hint: set === 'p2' ? 'Some words change in a special way: -y → -ies, -f → -ves, or a new word.' : 'Words ending in s, x, sh or ch add -es.', solution: [`One ${esc(one)}, two <b>${esc(r)}</b>.`] });
}
function suffix() {
  const [b, s, r, ...w] = pick(SUFFIX);
  return choice(`${esc(b)} + ${esc(s)} =`, '', r, w, { hint: 'Short vowel and one last letter? Double it. Ends in e? Drop the e. Consonant then y? Change y to i.', solution: [`${esc(b)} + ${esc(s)} = <b>${esc(r)}</b>`] });
}
// Tap the word in the sentence.
function tapWord({ set }) {
  const s = pick(TAP[set]), words = s.split(' '), answer = words.findIndex(x => x.startsWith('*'));
  const clean = words.map(x => x.replace('*', ''));
  return { template: 'tapword', prompt: TAP_ASK[set], answer, data: { words: clean },
    hint: { noun: 'A noun names a person, a place or a thing.', verb: 'A verb is an action: what someone or something does.', adjective: 'An adjective describes a noun: what is it like?', adverb: 'Adverbs often end in -ly.', capital: 'Names of people, places, days and months, and the word "I", need capitals.' }[set],
    solution: [`<b>${esc(clean[answer].replace(/[.,!?]/g, ''))}</b>`] };
}
function pickOne({ set }) {
  const [q, r, ...w] = pick(PICKS[set]);
  const ask = PICK_ASK[set] || esc(q), show = PICK_ASK[set] ? card(set === 'endmark' ? esc(q) + ' <span class="gap">_</span>' : gap(q)) : '';
  const hints = { endmark: 'A question asks something. A ! shows strong feeling.', article: 'Use "an" before a vowel sound: a, e, i, o, u.', past: 'Some verbs have a special past form.', agree: 'One thing: is / was. More than one: are / were.',
    conj: 'so = what happened next; but = something different; because = the reason.', pronoun: 'Which word stands for the person or thing here?', prep: 'at for times, on for days, in for months and years.', contract: 'The apostrophe goes where letters are missing.',
    possess: "One owner: 's. More than one owner ending in s: s'.", tense: 'Look for the time words: yesterday, now, tomorrow, every day.', speech: 'The spoken words and their punctuation go inside the speech marks.',
    passive: 'In the passive, the thing that something happened to comes first: "was … by".', reported: 'In reported speech, the verb moves back in time and "I" becomes he or she.', conditional: 'Real possibility: will. Imagined: would. Past imagined: would have.',
    colon: 'A colon introduces a list or an explanation. A semicolon joins two linked sentences.', join: 'Choose the joining word that makes sense.' };
  return choice(ask, show, r, w, { hint: hints[set], solution: [set === 'endmark' ? `${esc(q)}<b>${esc(r)}</b>` : /___/.test(q) ? esc(q).replace('___', `<b>${esc(r)}</b>`) : `<b>${esc(r)}</b>`] });
}
function opposite() {
  const [a, b] = pick(OPPOSITE), flip = Math.random() < .5, q = flip ? b : a, r = flip ? a : b;
  const wrong = shuffle(OPPOSITE.flat().filter(x => x !== a && x !== b)).slice(0, 2);
  return choice(`What is the opposite of <b>${esc(q)}</b>?`, '', r, wrong, { hint: 'Opposites mean completely different things.', solution: [`The opposite of ${esc(q)} is <b>${esc(r)}</b>.`] });
}
function synonym() {
  const [a, b] = pick(SYNONYM), flip = Math.random() < .5, q = flip ? b : a, r = flip ? a : b;
  const wrong = shuffle(SYNONYM.flat().filter(x => x !== a && x !== b)).slice(0, 2);
  return choice(`Which word means the same as <b>${esc(q)}</b>?`, '', r, wrong, { hint: 'Try each word in a sentence instead of the first word.', solution: [`<b>${esc(q)}</b> and <b>${esc(r)}</b> mean the same.`] });
}
function prefix() { const [m, r, ...w] = pick(PREFIX); return choice(`Which word means "${esc(m)}"?`, '', r, w, { hint: 'un- and dis- mean "not"; re- means "again"; mis- means "wrongly".' }); }
function context() { const [s, r, ...w] = pick(CONTEXT); return choice('What does the word in bold mean?', card(s), r, w, { hint: 'Read the whole sentence: the other words give clues.' }); }
function idiom() { const [s, r, ...w] = pick(IDIOM); return choice('What does this mean?', card(esc(s)), r, w, { hint: 'Idioms do not mean exactly what the words say.', long: true }); }
function family() {
  const f = pick(FAMILY), k = pick([0, 1, 2]), names = ['noun', 'adjective', 'adverb'];
  return choice(`Which word is ${k === 0 ? 'a' : 'an'} <b>${names[k]}</b>?`, '', f[k], f.filter((_, i) => i !== k), { hint: 'Endings help: -ness, -ty, -th for nouns; -ful, -ous, -ic, -able for adjectives; -ly for adverbs.', long: false });
}
function formal() { const [sit, r, ...w] = pick(FORMAL); return choice('Which is the most formal?', card(esc(sit)), r, w, { hint: 'Formal writing uses full words and polite phrases, with no slang.', long: true }); }
// Put the words in order.
function order({ set }) {
  const s = pick(ORDER[set]), words = s.split(' ');
  return { template: 'order', prompt: 'Put the words in order to make a sentence.', answer: s, data: { tiles: shuffle(words), n: words.length },
    hint: `It starts with "${words[0]}".`, solution: [esc(s)] };
}
// Read a passage and answer.
function comprehension({ ids }) {
  const id = pick(ids), st = PASSAGES[id], [q, opts] = pick(st.qs), right = opts[0];
  const { options, answer } = placeAnswer(right, opts.slice(1));
  return { template: 'story', prompt: esc(q), answer, data: { story: st, options: options.map(x => ({ html: esc(x), label: x })) },
    hint: 'Read the passage again. The answer, or a clue to it, is there.', solution: [`The answer is <b>${esc(right)}</b>.`] };
}

export const GEN_EX = { spellIt, spot, homophone, plural, suffix, tapWord, pickOne, opposite, synonym, prefix, context, idiom, family, formal, order, comprehension };
