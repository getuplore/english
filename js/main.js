import './core/compat.js';
// Uplore English: home, lessons, progress and settings. Learners and sign-in come from the Uplore home page.
import { $, $$, h, esc, popIn, toast } from './core/ui.js';
import { t, tr } from './core/i18n.js';
import { profile, profiles, effectiveMode, reload, resetProgress } from './core/store.js';
import { sfx, say, unlockAudio, hush } from './core/audio.js';
import { status, pct, nextSkill } from './core/mastery.js';
import { PIP, ICON, badge, sticker } from './core/art.js';
import { playSkill } from './engine/player.js';
import { EXPLAINERS } from './content/explainers.js';
import { signedIn, syncNow, onStatus, checkSession, isAdmin, isAdminCached } from './core/cloud.js';
import { loc, lvShort, lvLong } from './core/region.js';

const app = $('#app');
let RAW = [], content = { skills: [], explainers: EXPLAINERS }, tab = null, lastOpen = 0, leaving = false;
// Little Learners see phonics first; older learners see their own tracks first, with phonics after ("Starting out").
const TRACKS_LL = ['sounds', 'reading', 'tricky', 'words', 'stories'], TRACKS_EX = ['spelling', 'grammar', 'vocab', 'comp', 'sentences'];
const tracksFor = mode => mode === 'little' ? [...TRACKS_LL, ...TRACKS_EX] : [...TRACKS_EX, ...TRACKS_LL];
const groupFor = mode => mode === 'little' ? 'll' : 'ex';
const LEVELS = ['JK', 'SK', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12'];
const openLevels = new Map();
const mount = el => { app.replaceChildren(el); window.scrollTo(0, 0); };
const applyMode = () => { const p = profile(); document.documentElement.dataset.mode = p ? effectiveMode(p) : 'little'; };
const applyRegion = () => { content.skills = RAW.map(s => loc({ ...s })); };
const UPLORE = `<a class="btn grownbtn uplink" href="../" aria-label="Uplore home">← Uplore</a>`;

// Signing in and choosing the learner happen on the Uplore home page.
function toHub(hash) { if (leaving) return; leaving = true; location.replace('../' + (hash || '')); }
function otherTab() {
  if (leaving) return;
  const s = checkSession();
  if (s === 'gone') return toHub('#signin');
  if (s === 'changed') { leaving = true; location.reload(); return; }
  if (reload()) { if (!profile()) return toHub(); afterSync(); }
}

async function boot() {
  window.__enStarted = true;
  document.addEventListener('pointerdown', unlockAudio, { once: true });
  if (!signedIn()) return toHub('#signin');
  try { RAW = (await fetch('content/skills.json').then(r => r.json())).skills; } catch (e) { app.innerHTML = '<p class="err">Could not load lessons. Please reload the page.</p>'; return; }
  applyRegion();
  onStatus(() => { if (!signedIn()) toHub('#signin-again'); });
  window.addEventListener('storage', e => { if (e.key === null || /^(pipmaths\.(session|v1)|uplore\.english\.(v1|synced))$/.test(e.key)) otherTab(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) otherTab(); });
  window.addEventListener('pageshow', e => { if (e.persisted) otherTab(); });
  window.addEventListener('en-synced', afterSync);
  // No learner chosen yet (or none in the family): choose or add one on Uplore.
  if (!profile()) return toHub();
  syncNow().then(ok => { if (ok) afterSync(); });
  applyMode(); home();
  if (location.hash === '#settings') { history.replaceState(null, '', location.pathname); gate(settingsSheet); }
}
function afterSync() {
  applyRegion();
  if (document.querySelector('.sheet.on') || !document.querySelector('#app > section.home:not(.dash)')) return;
  applyMode(); home();
}

// ---------- Home ----------
const skillsFor = () => content.skills;
function byAge(p, list) {
  const target = Math.max(0, Math.min(13, p.age - 4)), idx = s => { const i = LEVELS.indexOf(s.level); return i < 0 ? target : i; };
  return [...list].sort((a, b) => Math.abs(idx(a) - target) - Math.abs(idx(b) - target) || LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level));
}
function home() {
  const p = profile(); if (!p) return toHub();
  applyMode();
  const mode = effectiveMode(p), list = skillsFor(p);
  const tracks = tracksFor(mode).filter(tk => list.some(s => s.track === tk));
  if (!tracks.includes(tab)) tab = tracks[0];
  // Up next: from the learner's own group, nearest their level first.
  const own_ = list.filter(s => s.group === groupFor(mode));
  // Phonics is a sequence: little ones start at the beginning. Older learners start at their own grade.
  const pool = own_.length ? own_ : list;
  const up = nextSkill(p, mode === 'little' ? pool.slice().sort((a, b) => LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level)) : byAge(p, pool));
  const shown = list.filter(s => s.track === tab);
  const groups = LEVELS.map(lv => [lv, shown.filter(s => s.level === lv)]).filter(([, l]) => l.length);
  const own = LEVELS[Math.max(0, Math.min(13, p.age - 4))], key = p.id + '|' + tab;
  if (!openLevels.has(key)) { const have = groups.map(g => g[0]); openLevels.set(key, new Set(groups.length <= 1 ? have : [have.includes(own) ? own : have[have.length - 1]])); }
  const opened = openLevels.get(key);
  const stat = mode === 'little' ? `<button class="pill book" aria-label="${t('book.title')}">${sticker('⭐', 0)}<b>${p.stickers.length}</b></button>`
    : mode === 'explore' ? `<span class="pill">${ICON.coin}<b>${p.coins}</b></span>`
    : `<span class="pill">${ICON.star}<b>${list.filter(s => status(p.progress[s.id]) === 'mastered').length}/${list.length}</b></span>`;
  const el = h(`<section class="home en">
    <header class="htop">${UPLORE}<a class="who" href="../" aria-label="Change learner on Uplore"><span class="av" style="--c:${p.color}">${esc(p.name[0] || '?').toUpperCase()}</span><span class="nm">${esc(p.name)}</span></a>
      <span class="modechip">${t('mode.' + mode)}</span>${stat}<button class="btn grownbtn progbtn" aria-label="${t('g.progress')}">${ICON.chart}<span>${t('g.progress')}</span></button><button class="btn grownbtn gear" aria-label="${t('ui.settings')}">${ICON.gear}<span>${t('ui.settings')}</span></button></header>
    <div class="hero">${mode !== 'adult' ? `<div class="hpip">${PIP()}</div>` : ''}
      <button class="upnext" data-id="${up.id}"><span class="ic">${badge(up.icon)}</span><span class="ut"><small>${t('ui.upNext')}</small><b>${esc(tr(up.title))}</b><em>${esc(lvShort(up.level))} · ${esc(up.strand)}</em></span><span class="go">${ICON.play}</span></button></div>
    ${mode === 'achieve' || mode === 'adult' ? `<p class="note enmore">${t('home.more')}</p>` : ''}
    <nav class="tabs" role="tablist">${tracks.map(tk => `<button role="tab" class="tab${tk === tab ? ' on' : ''}" aria-selected="${tk === tab}" data-t="${tk}">${t('track.' + tk)}</button>`).join('')}</nav>
    ${groups.map(([lv, l]) => `<details class="lvl" data-lv="${lv}"${opened.has(lv) ? ' open' : ''}><summary class="lvlh"><span class="lvn">${lvLong(lv)}</span>${lv === own ? `<span class="you">${t('lvl.yours')}</span>` : ''}<small>${l.filter(s => status(p.progress[s.id]) === 'mastered').length}/${l.length}</small><span class="chev" aria-hidden="true"></span></summary><div class="skills">${l.map(s => card(p, s, mode)).join('')}</div></details>`).join('')}
  </section>`);
  mount(el);
  $$('details[open] .skill', el).forEach((c, i) => popIn(c, i * 40));
  $$('details.lvl', el).forEach(d => d.addEventListener('toggle', () => { d.open ? opened.add(d.dataset.lv) : opened.delete(d.dataset.lv); if (d.open) { sfx.tap(); $$('.skill', d).forEach((c, i) => popIn(c, i * 30)); } }));
  $$('.tab', el).forEach(b => b.onclick = () => { tab = b.dataset.t; sfx.tap(); home(); });
  const open = id => { if (Date.now() - lastOpen < 1500) return; lastOpen = Date.now(); const s = content.skills.find(x => x.id === id); if (mode === 'little') say(tr(s.title).replace(/^\w+:\s*/, '')); sfx.pop(); setTimeout(() => playSkill(s, content, { mount, onExit: home }), mode === 'little' ? 500 : 0); };
  $$('[data-id]', el).forEach(b => b.onclick = () => open(b.dataset.id));
  if ($('.pill.book', el)) $('.pill.book', el).onclick = () => { sfx.pop(); stickerBook(); };
  $('.progbtn', el).onclick = () => { sfx.tap(); progressSheet(); };
  $('.gear', el).onclick = () => gate(settingsSheet);
}
function card(p, s, mode) {
  const r = p.progress[s.id], st = status(r), m = pct(r);
  return `<button class="skill st-${st}" data-id="${s.id}"><span class="ring" style="--p:${m}">${badge(s.icon)}</span>
    <span class="sk"><b>${esc(tr(s.title))}</b>${mode === 'little' ? '' : `<small>${esc(lvShort(s.level))} · ${esc(s.strand)}</small>`}</span>
    ${mode === 'little' ? (st === 'mastered' ? `<span class="done">${ICON.star}</span>` : '') : `<span class="chip s-${st}">${t('status.' + st)}</span>`}</button>`;
}
function stickerBook() {
  const p = profile(), n = Math.max(12, Math.ceil((p.stickers.length + 1) / 6) * 6);
  const el = h(`<section class="home"><header class="htop"><button class="icon aback" aria-label="${t('ui.back')}">${ICON.back}</button><h1 class="admh">${t('book.title')}</h1><span class="pill">${sticker('⭐', 0)}<b>${p.stickers.length}</b></span></header>
    ${p.stickers.length ? '' : `<p class="note">${t('book.empty')}</p>`}
    <div class="bookpage">${Array.from({ length: n }, (_, i) => `<div class="bslot"${p.stickers[i] ? ' style="border:0"' : ''}>${p.stickers[i] ? sticker(p.stickers[i], i + 1) : ''}</div>`).join('')}</div></section>`);
  mount(el); say(p.stickers.length ? t('book.title') : t('book.empty'));
  $('.aback', el).onclick = home;
}
function progressSheet() {
  const p = profile(), list = skillsFor(p);
  const by = { mastered: [], review: [], learning: [], new: [] };
  list.forEach(s => { const st = status(p.progress[s.id]); (by[st] || by.new).push(s); });
  const rows = [...by.review, ...by.learning, ...by.mastered].sort((a, b) => pct(p.progress[b.id]) - pct(p.progress[a.id])).map(s => { const r = p.progress[s.id], st = status(r);
    return `<tr><td>${badge(s.icon)}<span>${esc(tr(s.title))}<small>${t('track.' + s.track)} · ${esc(lvShort(s.level))}</small></span></td><td><span class="chip s-${st}">${t('status.' + st)}</span></td><td class="r"><span class="pbar"><i style="width:${pct(r)}%"></i></span>${pct(r)}%</td></tr>`; }).join('');
  const el = h(`<div class="sheet on prog"><div class="sheetin wide" role="dialog" aria-modal="true" aria-labelledby="prh">
    <div class="ghead"><h3 id="prh">${t('prog.title', { name: esc(p.name) })}</h3><button class="icon gclose" aria-label="${t('ui.close')}">${ICON.close}</button></div>
    <div class="ptiles"><div class="kpi"><b>${by.mastered.length + by.review.length}</b><span>${t('status.mastered')}</span></div><div class="kpi"><b>${by.learning.length}</b><span>${t('status.learning')}</span></div><div class="kpi"><b>${by.new.length}</b><span>${t('prog.notyet')}</span></div></div>
    ${rows ? `<div class="scroll"><table class="ptab"><thead><tr><th>Lesson</th><th>Status</th><th class="r">${t('prog.score')}</th></tr></thead><tbody>${rows}</tbody></table></div>` : `<p class="note">${t('prog.empty')}</p>`}
  </div></div>`);
  document.body.append(el);
  const close = () => el.remove();
  $('.gclose', el).onclick = close; el.onclick = e => { if (e.target === el) close(); };
}

// ---------- Grown-ups sum, then English settings ----------
function gate(next) {
  const p = profile(); if (p && effectiveMode(p) === 'adult') return next();
  const a = 3 + Math.floor(Math.random() * 7), b = 6 + Math.floor(Math.random() * 7);
  const el = h(`<div class="sheet on"><div class="sheetin" role="dialog" aria-modal="true" aria-labelledby="gq"><div class="ghead"><h3 id="gq">${t('pgate.title')}</h3><button class="icon gx" aria-label="${t('ui.close')}">${ICON.close}</button></div>
    <p>${t('pgate.ask')}</p><div class="gsum">${a} × ${b} = <input id="gans" inputmode="numeric" autocomplete="off" aria-label="${t('pgate.answer')}"></div>
    <div class="row" style="justify-content:flex-start"><button class="btn primary gok">${t('ui.ok')}</button></div></div></div>`);
  document.body.append(el);
  const inp = $('#gans', el), close = () => el.remove();
  const check = () => { if (+inp.value === a * b) { close(); next(); } else { toast(t('pgate.wrong')); close(); gate(next); } };
  $('.gok', el).onclick = check; inp.onkeydown = e => { if (e.key === 'Enter') check(); };
  $('.gx', el).onclick = close; el.addEventListener('click', e => { if (e.target === el) close(); });
  inp.focus();
}
function settingsSheet() {
  const p = profile();
  const el = h(`<div class="sheet on grown"><div class="sheetin wide" role="dialog" aria-modal="true" aria-labelledby="gt">
    <div class="ghead"><h3 id="gt">${t('g.title')}</h3><button class="icon gclose" aria-label="${t('ui.close')}">${ICON.close}</button></div>
    <h4>${esc(p.name)}</h4>
    <div class="row" style="justify-content:flex-start"><button class="btn primary gprog">${ICON.chart}<span>${t('g.progress')}</span></button><button class="btn ghost greset">${t('ui.reset')}</button>${isAdminCached() ? '<a class="btn" href="../admin/">Admin</a>' : ''}</div>
    <div class="acct"><b>Grown-ups</b><p>${t('g.onUplore')}</p><div class="row" style="justify-content:flex-start"><a class="btn primary gup" href="../#grownups">${t('g.openUplore')}</a></div></div>
    <p class="gnote">${t('g.note')}</p></div></div>`);
  document.body.append(el);
  const close = () => { el.remove(); home(); };
  $('.gclose', el).onclick = close; el.addEventListener('click', e => { if (e.target === el) close(); });
  $('.gprog', el).onclick = () => { el.remove(); progressSheet(); };
  const r = $('.greset', el); r.onclick = () => { if (!r.dataset.arm) { r.dataset.arm = 1; r.textContent = t('ui.resetConfirm'); return; } resetProgress(); el.remove(); home(); };
  if (!isAdminCached()) isAdmin().then(yes => { if (yes && el.isConnected) { el.remove(); settingsSheet(); } });
}

boot();
