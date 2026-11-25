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
    host.innerHTML = `<div class="t-choose${d.letters ? ' letters' : ''}${d.words ? ' words' : ''}${d.pics ? ' pics' : ''}">${d.show ? `<div class="show">${d.show}</div>` : ''}${opts(d)}</div>`;
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
    host.innerHTML = `<div class="t-spell"><div class="show"><div class="bigpic"><span class="pic">${d.pic}</span></div><button class="btn hear" aria-label="${t('ui.listen')}">${ICON.speak}</button></div>
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
    const words = st.text.split(/(\s+)/).map(w => /\s/.test(w) ? w : `<button class="sw" data-w="${esc(w.replace(/[^A-Za-z'-]/g, ''))}">${esc(w)}</button>`).join('');
    host.innerHTML = `<div class="t-story"><article class="storycard"><div class="stop"><span class="pic">${st.pic}</span><h3>${esc(st.title)}</h3><button class="btn readme">${ICON.speak}<span>Read to me</span></button></div><p class="stext">${words}</p></article>${opts(d)}</div>`;
    host.querySelector('.stext').addEventListener('click', e => { const b = e.target.closest('.sw'); if (b && b.dataset.w) { say(b.dataset.w); squash(b); } });
    host.querySelector('.readme').onclick = () => say(st.text);
    const g = optionsGrid(host, d, ctx);
    return { hint: l => g.hint(l, act.answer) };
  }
};
