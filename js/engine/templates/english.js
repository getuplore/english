// English activity templates: choose (pictures, letters or words), blend, spell, story.
import { h, esc, squash, wiggle, popIn, $$ } from '../../core/ui.js';
import { t } from '../../core/i18n.js';
import { sfx, say } from '../../core/audio.js';
import { mouth, ICON } from '../../core/art.js';

function optionsGrid(host, d, ctx, after) {
  const box = host.querySelector('.opts');
  box.addEventListener('click', e => {
    const b = e.target.closest('.opt'); if (!b || b.disabled) return;
    const i = +b.dataset.i;
    if (d.speak) say(d.options[i].label);
    const r = ctx.submit(i);
    if (r.ok) { b.classList.add('ok'); squash(b); after && after(); } else { b.classList.add('bad'); b.disabled = true; wiggle(b); }
  });
  $$('.opt', host).forEach((b, i) => popIn(b, i * 70));
  return { hint(l, answer) { if (l < 2) return; const wrong = $$('.opt:not([disabled])', host).filter(b => +b.dataset.i !== answer); if (wrong.length > 1) { wrong[0].disabled = true; wrong[0].classList.add('dim'); } } };
}
const opts = d => `<div class="opts n${d.options.length}">${d.options.map((o, i) => `<button class="opt" data-i="${i}" aria-label="${esc(o.label)}">${o.html}</button>`).join('')}</div>`;

export const choose = {
  render(host, act, ctx) {
    const d = act.data;
    host.innerHTML = `<div class="t-choose${d.letters ? ' letters' : ''}${d.words ? ' words' : ''}${d.pics ? ' pics' : ''}${d.long ? ' long' : ''}">${d.show ? `<div class="show">${d.show}</div>` : ''}${opts(d)}</div>`;
    const g = optionsGrid(host, d, ctx);
    return { hint: l => g.hint(l, act.answer) };
  }
};

export const blend = {
  render(host, act, ctx) {
    const d = act.data;
    host.innerHTML = `<div class="t-blend"><div class="tiles">${d.sounds.map((s, i) => `<button class="tile" data-i="${i}">${esc(s)}</button>`).join('')}</div>
      <div class="mouthbox" aria-live="polite"></div>${opts(d)}</div>`;
    const mb = host.querySelector('.mouthbox');
    $$('.tile', host).forEach(b => b.onclick = () => { $$('.tile', host).forEach(x => x.classList.toggle('on', x === b)); b.classList.add('seen'); sfx.tap(); squash(b); mb.innerHTML = mouth(d.sounds[+b.dataset.i]); });
    const g = optionsGrid(host, d, ctx, () => say(d.word, true));
    return { hint(l) {
      $$('.tile', host).forEach((b, i) => setTimeout(() => { b.classList.add('on'); squash(b); mb.innerHTML = mouth(d.sounds[i]); setTimeout(() => b.classList.remove('on'), 500); }, i * 650));
      g.hint(l, act.answer);
    } };
  }
};

export const spell = {
  render(host, act, ctx) {
    const d = act.data, filled = [];
    host.innerHTML = `<div class="t-spell"><div class="show">${d.pic ? `<div class="bigpic"><span class="pic">${d.pic}</span></div>` : ''}<button class="btn hear" aria-label="${t('ui.listen')}">${ICON.speak}</button></div>${d.sentence ? `<div class="qcard ssent">${esc(d.sentence).replace('___', '<span class="gap">___</span>')}</div>` : ''}
      <div class="slots">${Array.from({ length: d.n }, () => '<span class="slot"></span>').join('')}</div>
      <div class="tiles">${d.tiles.map((s, i) => `<button class="tile" data-i="${i}">${esc(s)}</button>`).join('')}</div>
      <div class="row spellrow"><button class="btn sback">⌫</button><button class="btn primary scheck" disabled>${t('ui.check')}</button></div></div>`;
    const slots = $$('.slot', host), tiles = $$('.tile', host), chk = host.querySelector('.scheck');
    const draw = () => { slots.forEach((s, i) => { s.textContent = filled[i] != null ? d.tiles[filled[i]] : ''; s.classList.toggle('on', filled[i] != null); }); tiles.forEach((b, i) => { b.disabled = filled.includes(i); }); chk.disabled = filled.length !== d.n; };
    tiles.forEach((b, i) => b.onclick = () => { if (filled.length >= d.n) return; filled.push(i); sfx.pop(); squash(b); draw(); });
    host.querySelector('.sback').onclick = () => { filled.pop(); sfx.tap(); draw(); };
    slots.forEach((s, i) => s.onclick = () => { if (i < filled.length) { filled.splice(i); draw(); } });
    host.querySelector('.hear').onclick = () => say(d.word);
    chk.onclick = () => { const r = ctx.submit(filled.map(i => d.tiles[i]).join('')); if (!r.ok) { wiggle(host.querySelector('.slots')); filled.length = 0; draw(); } };
    const target = act.answer;
    return { hint(l) { if (l < 2) return; filled.length = 0; const i = d.tiles.findIndex(x => target.startsWith(x)); if (i >= 0) filled.push(i); draw(); wiggle(slots[0]); } };
  }
};

export const story = {
  render(host, act, ctx) {
    const d = act.data, st = d.story;
    const words = st.text.split(/(\s+)/).map(w => /\s/.test(w) ? w : `<button class="wd" data-w="${esc(w.replace(/[^A-Za-z'-]/g, ''))}">${esc(w)}</button>`).join('');
    host.innerHTML = `<div class="t-story"><article class="storycard"><div class="stop"><span class="pic">${st.pic}</span><h3>${esc(st.title)}</h3><button class="btn readme">${ICON.speak}<span>Read to me</span></button></div><p class="stext">${words}</p></article>${opts(d)}</div>`;
    host.querySelector('.stext').addEventListener('click', e => { const b = e.target.closest(".wd"); if (b && b.dataset.w) { say(b.dataset.w); squash(b); } });
    host.querySelector('.readme').onclick = () => say(st.text);
    const g = optionsGrid(host, d, ctx);
    return { hint: l => g.hint(l, act.answer) };
  }
};

// Tap a word in a sentence (find the verb, the word that needs a capital…).
export const tapword = {
  render(host, act, ctx) {
    const d = act.data;
    host.innerHTML = `<div class="t-tapword"><p class="tapsent">${d.words.map((w, i) => `<button class="tapw" data-i="${i}">${esc(w)}</button>`).join(' ')}</p></div>`;
    host.querySelector('.tapsent').addEventListener('click', e => {
      const b = e.target.closest(".tapw"); if (!b || b.disabled) return;
      const r = ctx.submit(+b.dataset.i);
      if (r.ok) { b.classList.add('ok'); squash(b); } else { b.classList.add('bad'); b.disabled = true; wiggle(b); }
    });
    return { hint(l) { if (l < 2) return; $$(".tapw:not([disabled])", host).filter(b => +b.dataset.i !== act.answer).slice(0, Math.floor(d.words.length / 2)).forEach(b => { b.disabled = true; b.classList.add('dim'); }); } };
  }
};

// Put word tiles in order to build a sentence.
export const order = {
  render(host, act, ctx) {
    const d = act.data, line = [];
    host.innerHTML = `<div class="t-order"><div class="oline" aria-live="polite"></div><div class="otiles">${d.tiles.map((w, i) => `<button class="ot" data-i="${i}">${esc(w)}</button>`).join('')}</div>
      <div class="row spellrow"><button class="btn oback">⌫</button><button class="btn primary ocheck" disabled>${t('ui.check')}</button></div></div>`;
    const ol = host.querySelector('.oline'), tiles = $$('.ot', host), chk = host.querySelector('.ocheck');
    const draw = () => { ol.innerHTML = line.length ? line.map((i, k) => `<button class="ow" data-k="${k}">${esc(d.tiles[i])}</button>`).join(' ') : '<span class="ohint">Tap the words in order.</span>'; tiles.forEach((b, i) => { b.disabled = line.includes(i); }); chk.disabled = line.length !== d.n; };
    tiles.forEach((b, i) => b.onclick = () => { line.push(i); sfx.pop(); draw(); });
    ol.addEventListener('click', e => { const b = e.target.closest('.ow'); if (b) { line.splice(+b.dataset.k); sfx.tap(); draw(); } });
    host.querySelector('.oback').onclick = () => { line.pop(); sfx.tap(); draw(); };
    chk.onclick = () => { const r = ctx.submit(line.map(i => d.tiles[i]).join(' ')); if (!r.ok) { wiggle(ol); line.length = 0; draw(); } };
    draw();
    const target = act.answer.split(' ');
    return { hint(l) { if (l < 2) return; line.length = 0; const i = d.tiles.findIndex(w => w === target[0]); if (i >= 0) line.push(i); draw(); } };
  }
};

// ---------- Hands-on templates ----------
import { draggable, goHome, flyTo } from '../../core/ui.js';
// A finished hands-on round counts as right first time only if there were no slips.
const finish = (ctx, slips) => ctx.submit('done', { assisted: slips > 0 });

// Sort it: drag (or tap, then tap a box) each word into its box.
export const sortit = {
  render(host, act, ctx) {
    const d = act.data; let picked = null, slips = 0, left = d.words.length;
    host.innerHTML = `<div class="t-esort"><div class="echips">${d.words.map((x, i) => `<button class="echip" data-i="${i}">${esc(x.w)}</button>`).join('')}</div>
      <div class="boxes n${d.boxes.length}">${d.boxes.map(b => `<div class="sbox" role="button" tabindex="0" data-b="${esc(b)}"><b>${esc(b)}</b><div class="sin"></div></div>`).join('')}</div></div>`;
    const boxes = $$('.sbox', host), chips = $$('.echip', host);
    const place = (el, box) => {
      const w = d.words[+el.dataset.i];
      if (w.b !== box.dataset.b) { slips++; sfx.boing(); wiggle(box); goHome(el); el.classList.remove('is-sel'); picked = null; return; }
      sfx.pop(); el.dataset.used = 1; el.classList.remove('is-sel'); el.classList.add('placed');
      el.style.transform = ''; el._x = el._y = 0; box.querySelector('.sin').append(el); squash(box); picked = null;
      if (--left === 0) setTimeout(() => finish(ctx, slips), 250);
    };
    chips.forEach(el => draggable(el, { targets: () => boxes, onDrop: place, onTap: e => { chips.forEach(c => c.classList.toggle('is-sel', c === e && !e.dataset.used)); picked = e.dataset.used ? null : e; sfx.tap(); } }));
    boxes.forEach(b => { const go = () => { if (picked) place(picked, b); }; b.addEventListener('click', go); b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } }); });
    return { hint() { const c = chips.find(x => !x.dataset.used); if (!c) return; const b = boxes.find(x => x.dataset.b === d.words[+c.dataset.i].b); c.classList.add('is-sel'); picked = c; b.classList.add('glow'); setTimeout(() => b.classList.remove('glow'), 1400); } };
  }
};

// Match pairs: tap a word on the left, then its partner on the right.
export const pairs = {
  render(host, act, ctx) {
    const d = act.data; let sel = null, slips = 0, done = 0;
    const partner = Object.fromEntries(d.pairs);
    host.innerHTML = `<div class="t-pairs"><div class="pcol">${d.left.map((w, i) => `<button class="pw L" data-w="${esc(w)}">${esc(w)}</button>`).join('')}</div>
      <div class="pcol">${d.right.map(w => `<button class="pw R" data-w="${esc(w)}">${esc(w)}</button>`).join('')}</div></div>`;
    const L = $$('.pw.L', host), Rr = $$('.pw.R', host), colours = ['#ffd43b', '#74c0fc', '#8ce99a', '#ffa8a8'];
    L.forEach(b => b.onclick = () => { if (b.disabled) return; sel = b; L.forEach(x => x.classList.toggle('is-sel', x === b)); sfx.tap(); });
    Rr.forEach(b => b.onclick = () => {
      if (b.disabled) return;
      if (!sel) { wiggle(L.find(x => !x.disabled) || b); return; }
      if (partner[sel.dataset.w] === b.dataset.w) {
        const c = colours[done % colours.length]; [sel, b].forEach(x => { x.disabled = true; x.classList.remove('is-sel'); x.classList.add('matched'); x.style.setProperty('--m', c); squash(x); });
        if (d.joiner === '') { b.textContent = sel.dataset.w + b.dataset.w; }
        sfx.pop(); sel = null; if (++done === d.pairs.length) setTimeout(() => finish(ctx, slips), 300);
      } else { slips++; sfx.boing(); wiggle(b); }
    });
    return { hint() { const a = L.find(x => !x.disabled); if (!a) return; const b = Rr.find(x => x.dataset.w === partner[a.dataset.w]); [a, b].forEach(x => x.classList.add('glow')); setTimeout(() => [a, b].forEach(x => x.classList.remove('glow')), 1400); } };
  }
};

// Spot and fix: tap the wrong word, then choose its fix.
export const fixit = {
  render(host, act, ctx) {
    const d = act.data;
    host.innerHTML = `<div class="t-fix"><p class="tapsent">${d.words.map((w, i) => `<button class="tapw" data-i="${i}">${esc(w)}</button>`).join(' ')}</p><div class="fixbox" aria-live="polite"></div></div>`;
    const box = host.querySelector('.fixbox');
    host.querySelector('.tapsent').addEventListener('click', e => {
      const b = e.target.closest('.tapw'); if (!b || b.disabled) return;
      if (+b.dataset.i !== d.at) { const r = ctx.submit('tap:' + b.dataset.i); if (!r.ok) { b.classList.add('bad'); b.disabled = true; wiggle(b); } return; }
      b.classList.add('found'); squash(b); sfx.pop();
      box.innerHTML = `<p class="fixq">Change <b>${esc(d.wrong)}</b> to:</p><div class="opts n${d.options.length}">${d.options.map((o, k) => `<button class="opt" data-k="${k}"><span class="word">${esc(o)}</span></button>`).join('')}</div>`;
      $$('.opt', box).forEach(o => o.onclick = () => {
        if (o.disabled) return; const r = ctx.submit('fix:' + d.options[+o.dataset.k]);
        if (r.ok) { o.classList.add('ok'); b.textContent = d.words[d.at].replace(d.wrong, d.options[+o.dataset.k]); b.classList.add('fixed'); } else { o.classList.add('bad'); o.disabled = true; wiggle(o); }
      });
    });
    return { hint(l) { if (l < 2) return; const b = host.querySelector(`.tapw[data-i="${d.at}"]`); b.classList.add('glow'); setTimeout(() => b.classList.remove('glow'), 1600); } };
  }
};

// Punctuate it: pick a mark, then tap the gap after a word. Tap again to remove.
export const punctuate = {
  render(host, act, ctx) {
    const d = act.data, MARKS = ['.', ',', '?', '!'], placed = {}; let mark = '.';
    host.innerHTML = `<div class="t-punct"><div class="marks">${MARKS.map(m => `<button class="mk${m === mark ? ' on' : ''}" data-m="${m}" aria-label="${{ '.': 'full stop', ',': 'comma', '?': 'question mark', '!': 'exclamation mark' }[m]}">${m}</button>`).join('')}</div>
      <p class="psent">${d.words.map((w, i) => `<span class="pword">${esc(w)}</span><button class="pgap" data-i="${i}" aria-label="Gap after ${esc(w)}"></button>`).join(' ')}</p>
      <div class="row spellrow"><button class="btn primary pcheck">${t('ui.check')}</button></div></div>`;
    const gaps = $$('.pgap', host);
    const draw = () => gaps.forEach(g => { const m = placed[g.dataset.i]; g.textContent = m || ''; g.classList.toggle('on', !!m); });
    $$('.mk', host).forEach(b => b.onclick = () => { mark = b.dataset.m; $$('.mk', host).forEach(x => x.classList.toggle('on', x === b)); sfx.tap(); });
    gaps.forEach(g => g.onclick = () => { const i = g.dataset.i; if (placed[i] === mark) delete placed[i]; else placed[i] = mark; sfx.pop(); squash(g); draw(); });
    host.querySelector('.pcheck').onclick = () => {
      const key = Object.keys(placed).sort((a, b) => a - b).map(k => `${k}${placed[k]}`).join('|');
      const r = ctx.submit(key);
      if (!r.ok) { const want = Object.fromEntries(act.answer.split('|').map(x => [x.slice(0, -1), x.slice(-1)])); Object.keys(placed).forEach(k => { if (want[k] !== placed[k]) { delete placed[k]; } }); draw(); wiggle(host.querySelector('.psent')); }
    };
    draw();
    return { hint(l) { if (l < 2) return; const want = act.answer.split('|')[0]; const g = gaps[+want.slice(0, -1)]; g.classList.add('glow'); setTimeout(() => g.classList.remove('glow'), 1600); } };
  }
};
