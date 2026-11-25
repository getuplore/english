// "Learn first" introductions, shown the first time a lesson is opened (and from the Learn button).
import { GROUPS, START, ENDS, TRICKY, CVC, sounds } from './words.js';
import { mouth, MOUTH_TIP, mouthShape } from '../core/art.js';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const row = ws => `<div class="exwords">${ws.map(([w, e]) => `<span><span class="pic">${e}</span><b>${esc(w)}</b></span>`).join('')}</div>`;

function soundsIntro(g) {
  const letters = GROUPS[g];
  const frames = letters.map(l => {
    const ws = START[l], end = ENDS.has(l);
    return { html: `<div class="exsound"><span class="glyph">${esc(l)}</span>${mouth(l)}</div><p class="extip">${MOUTH_TIP[mouthShape(l)]}</p>${row(ws)}<p class="exnote">${end ? 'Listen to the end' : 'Listen to the start'} of each word.</p>`,
      say: `Listen to the ${end ? 'end' : 'start'} of ${ws.map(x => x[0]).join(', ')}.` };
  });
  const l = letters.find(x => !ENDS.has(x)) || letters[0], right = START[l][0], other = START[GROUPS[g === 's1' ? 's2' : 's1'][0]][0];
  frames.push({ html: `<div class="exsound"><span class="glyph">${esc(l)}</span>${mouth(l)}</div><p class="extip">Your turn: which one starts with this sound?</p>`, say: 'Your turn. Which one starts with this sound?',
    try: { options: [`<span class="pic">${right[1]}</span> ${esc(right[0])}`, `<span class="pic">${other[1]}</span> ${esc(other[0])}`], answer: 0, right: `Yes! ${right[0]} starts with that sound.`, wrong: `Listen again: ${right[0]}.` } });
  return { title: `Sounds: ${letters.join(' ')}`, frames };
}
const blendIntro = { title: 'Blending sounds', frames: [
  { html: '<div class="exblend"><span>c</span><span>a</span><span>t</span></div><p class="extip">Say each sound: c, a, t.</p>', say: 'Every letter makes a sound. Look at each one and say its sound.' },
  { html: '<div class="exblend fast"><span>c</span><span>a</span><span>t</span></div><p class="extip">Now say them faster and faster… <b>cat</b>!</p><div class="exwords"><span><span class="pic">🐱</span><b>cat</b></span></div>', say: 'Say the sounds faster and faster, and they blend into a word. Cat!' },
  { html: '<div class="exblend"><span>d</span><span>o</span><span>g</span></div><p class="extip">Your turn: blend the sounds. Which picture is it?</p>', say: 'Your turn. Blend the sounds. Which picture is it?',
    try: { options: ['<span class="pic">🐶</span>', '<span class="pic">🐱</span>'], answer: 0, right: 'Yes! d, o, g, dog.', wrong: 'Try again: d, o, g.' } }] };
const spellIntro = { title: 'Spelling words', frames: [
  { html: '<div class="exwords"><span><span class="pic">☀️</span><b>sun</b></span></div><p class="extip">Say the word slowly: s… u… n.</p>', say: 'To spell a word, say it slowly and listen for each sound. Sun.' },
  { html: '<div class="exblend"><span>s</span><span>u</span><span>n</span></div><p class="extip">Write a letter for each sound, in order.</p>', say: 'Then write a letter for each sound, in order.' }] };
const trickyIntro = set => ({ title: 'Tricky words', frames: [
  { html: `<div class="exwords tw">${TRICKY[set].map(w => `<span><b>${esc(w)}</b></span>`).join('')}</div><p class="extip">These words don't follow the sound rules, so we learn them by sight.</p>`, say: 'Some words do not follow the sound rules. We learn them by looking at the whole word.' },
  { html: `<div class="exwords tw"><span><b>${esc(TRICKY[set][1])}</b></span></div><p class="extip">Look, say it, then look again.</p>`, say: `This word is ${TRICKY[set][1]}.` }] });
const rhymeIntro = { title: 'Rhyming words', frames: [
  { html: '<div class="exwords"><span><span class="pic">🐱</span><b>cat</b></span><span><span class="pic">🎩</span><b>hat</b></span><span><span class="pic">🦇</span><b>bat</b></span></div><p class="extip">They all end with the same sound: <b>-at</b>.</p>', say: 'Cat, hat, bat. They rhyme: they end with the same sound.' },
  { html: '<div class="exwords"><span><span class="pic">🐶</span><b>dog</b></span></div><p class="extip">Which one rhymes with dog?</p>', say: 'Your turn. Which one rhymes with dog?',
    try: { options: ['<span class="pic">🐸</span> frog', '<span class="pic">🐱</span> cat'], answer: 0, right: 'Yes! Dog and frog rhyme.', wrong: 'Listen: dog, frog. They end the same.' } }] };

export const EXPLAINERS = {
  s1: soundsIntro('s1'), s2: soundsIntro('s2'), s3: soundsIntro('s3'), s4: soundsIntro('s4'), s5: soundsIntro('s5'), s6: soundsIntro('s6'),
  blend: blendIntro, spell: spellIntro, t1: trickyIntro('t1'), t2: trickyIntro('t2'), t3: trickyIntro('t3'), rhyme: rhymeIntro
};
