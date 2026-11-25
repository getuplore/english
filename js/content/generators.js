// Question makers for English. Each returns { template, prompt, answer, data, say, hint, solution }.
import { pick, shuffle } from '../core/ui.js';
import { mouth, MOUTH_TIP, mouthShape } from '../core/art.js';
import { GEN_EX } from './explore.js';
import { GROUPS, lettersUpTo, START, ENDS, CVC, sounds, decodable, TRICKY, RHYMES, RHYMES_EASY, VOCAB, COLOURS, STORIES } from './words.js';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const picOpt = ([w, e], label = true) => ({ html: `<span class="pic">${e}</span>${label ? `<b>${esc(w)}</b>` : ''}`, label: w });
const take = (list, n, not = []) => shuffle(list.filter(x => !not.includes(x))).slice(0, n);
const placeAnswer = (right, wrong) => { const opts = shuffle([right, ...wrong]); return { options: opts, answer: opts.indexOf(right) }; };
const allStartWords = letters => letters.flatMap(l => START[l].map(w => [l, w]));
const letterBig = l => `<div class="bigl"><span class="glyph">${esc(l)}</span>${mouth(l)}</div>`;

// Which picture starts (or ends, for x and ck) with this sound?
function soundPic({ group, upTo }) {
  const letters = GROUPS[group], l = pick(letters), [w, e] = pick(START[l]);
  const others = allStartWords(upTo ? lettersUpTo(upTo) : Object.keys(START)).filter(([ol, [ow]]) => ol !== l && !sounds(ow).includes(l) && ow[0] !== w[0]);
  const seen = new Set([w]), uniq = others.filter(([, [ow]]) => !seen.has(ow) && seen.add(ow));
  const wrong = take(uniq, 2).map(([, x]) => x);
  const { options, answer } = placeAnswer([w, e], wrong);
  const end = ENDS.has(l);
  return { template: 'choose', prompt: `Which picture ${end ? 'ends' : 'starts'} with this sound?`, answer,
    data: { show: letterBig(l), options: options.map(o => picOpt(o)), speak: true },
    hint: `${MOUTH_TIP[mouthShape(l)]} Say each picture's name and listen to the ${end ? 'end' : 'start'}.`,
    solution: [`<b>${esc(w)}</b> ${end ? 'ends' : 'starts'} with <b>${esc(l)}</b>.`] };
}
// Which sound does this word start with?
function firstLetter({ group, upTo }) {
  const letters = GROUPS[group].filter(l => !ENDS.has(l)), l = pick(letters), [w, e] = pick(START[l]);
  const pool = (upTo ? lettersUpTo(upTo) : Object.keys(START)).filter(x => !ENDS.has(x) && x !== l && x.length === 1);
  const { options, answer } = placeAnswer(l, take(pool, 2));
  return { template: 'choose', prompt: `Which sound does <b>${esc(w)}</b> start with?`, answer,
    data: { show: `<div class="bigpic"><span class="pic">${e}</span></div>`, options: options.map(x => ({ html: `<span class="letter">${esc(x)}</span>`, label: x })), letters: true },
    hint: `Say "${w}" slowly. What is the very first sound?`, solution: [`<b>${esc(w)}</b> starts with <b>${esc(l)}</b>.`] };
}
// Blend the sounds and find the picture.
function blend({ upTo }) {
  const known = lettersUpTo(upTo), words = CVC.filter(([w]) => decodable(w, known)), [w, e] = pick(words);
  const wrong = take(CVC.filter(([x]) => x !== w && x[0] !== w[0]), 2);
  const { options, answer } = placeAnswer([w, e], wrong);
  const s = sounds(w);
  return { template: 'blend', prompt: 'Say each sound, blend them, then find the picture.', answer,
    data: { sounds: s, word: w, options: options.map(o => picOpt(o, false)) },
    hint: `Tap each letter and say its sound, then say them faster and faster: ${s.join(' - ')}.`, solution: [`${s.map(esc).join(' - ')} makes <b>${esc(w)}</b>.`] };
}
// Spell the word you hear.
function spellWord({ upTo }) {
  const known = lettersUpTo(upTo), words = CVC.filter(([w]) => decodable(w, known)), [w, e] = pick(words), s = sounds(w);
  const extra = take(known.filter(x => !s.includes(x)), Math.max(2, 6 - s.length));
  return { template: 'spell', prompt: 'Listen, then spell the word.', say: w, answer: w,
    data: { word: w, pic: e, tiles: shuffle([...s, ...extra]), n: s.length },
    hint: `It starts with ${s[0]}. Say the word slowly: ${s.join(' - ')}.`, solution: [`<b>${esc(w)}</b> is spelt ${s.map(x => `<b>${esc(x)}</b>`).join(' ')}.`] };
}
// Tricky words: tap the word you hear.
function tricky({ set }) {
  const list = TRICKY[set], w = pick(list);
  const { options, answer } = placeAnswer(w, take(list.filter(x => x.toLowerCase()[0] !== w.toLowerCase()[0] || x.length !== w.length), 2, [w]));
  return { template: 'choose', prompt: 'Tap the word you hear.', say: w, answer,
    data: { show: '<div class="bigear" aria-hidden="true">👂</div>', options: options.map(x => ({ html: `<span class="word">${esc(x)}</span>`, label: x })), words: true },
    hint: `The word starts with "${w[0]}".`, solution: [`The word was <b>${esc(w)}</b>.`] };
}
const ending = (a, b) => { let i = 0; while (i < Math.min(a.length, b.length) && a[a.length - 1 - i] === b[b.length - 1 - i]) i++; return a.slice(a.length - Math.max(i, 2)); };
// Which picture rhymes with this one?
function rhyme({ easy }) {
  const fams = easy ? RHYMES_EASY : RHYMES, fam = pick(fams), [t, r] = shuffle(fam);
  const wrong = take(fams.filter(f => f !== fam).flat().filter(([w]) => w.slice(-2) !== t[0].slice(-2)), 2);
  const { options, answer } = placeAnswer(r, wrong);
  return { template: 'choose', prompt: `Which one rhymes with <b>${esc(t[0])}</b>?`, answer,
    data: { show: `<div class="bigpic"><span class="pic">${t[1]}</span></div>`, options: options.map(o => picOpt(o)), speak: true },
    hint: `Say "${t[0]}" and each picture's name. Which ends with the same sound?`, solution: [`<b>${esc(t[0])}</b> and <b>${esc(r[0])}</b> both end in "-${esc(ending(t[0], r[0]))}".`] };
}
// Picture words: hear a word, tap its picture (or read a word, tap its picture).
function vocab({ set, read }) {
  const list = set === 'colours' ? COLOURS : VOCAB[set], item = pick(list);
  const wrong = take(list.filter(x => x !== item), read ? 2 : 3);
  const { options, answer } = placeAnswer(item, wrong);
  const opt = x => set === 'colours' ? { html: `<span class="swatch" style="background:${x[1]}"></span>`, label: x[0] } : picOpt(x, false);
  return { template: 'choose', prompt: read ? `Find the <b>${esc(item[0])}</b>.` : 'Tap the one you hear.', say: read ? '' : item[0], answer,
    data: { show: read ? '' : '<div class="bigear" aria-hidden="true">👂</div>', options: options.map(opt), speak: !read, pics: true },
    hint: `Listen again: "${item[0]}".`, solution: [`That is the <b>${esc(item[0])}</b>.`] };
}
// Story questions: read (or listen to) the story, then answer.
function story({ ids }) {
  const id = pick(ids), st = STORIES[id], [q, opts] = pick(st.qs), right = opts[0];
  const { options, answer } = placeAnswer(right, opts.slice(1));
  return { template: 'story', prompt: esc(q), answer,
    data: { story: st, options: options.map(x => ({ html: esc(x), label: x })) },
    hint: 'Read the story again. Tap any word to hear it.', solution: [`The answer is <b>${esc(right)}</b>.`] };
}

export const GEN = { soundPic, firstLetter, blend, spellWord, tricky, rhyme, vocab, story, ...GEN_EX };
