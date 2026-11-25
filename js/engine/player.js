// Lesson player: runs a skill's activities, applies the hint ladder, records mastery, shows results.
import { h, esc, wait, squash, popIn, RM } from '../core/ui.js';
import { t, tr } from '../core/i18n.js';
import { sfx, say, hush } from '../core/audio.js';
import { ICON, PIP, sticker } from '../core/art.js';
import { record, pct } from '../core/mastery.js';
import { profile, effectiveMode, save } from '../core/store.js';
import { TEMPLATES, explainer } from './templates/index.js';
import { GEN } from '../content/generators.js';
import { loc } from '../core/region.js';

// Praise changes with the age group; little ones hear it spoken.
const PRAISE = {
  little: ['Great job!', 'You did it!', 'Yay!', 'Brilliant!', 'High five!', 'Wow, super!', 'Amazing!', 'Well done!', 'Fantastic!', 'You are a star!'],
  explore: ['Correct!', 'Nailed it!', 'Spot on!', 'Brilliant!', 'Great thinking!', 'You got it!', 'Excellent!', 'Superb!', 'Smart work!', 'Bang on!'],
  achieve: ['Correct.', 'Exactly right.', 'Spot on.', 'Well reasoned.', 'Nicely done.', 'Right.'],
  adult: ['Correct.', 'Exactly.', 'Right.', 'Spot on.', 'Good.']
};
const COMEBACK = ['You worked it out!', 'Fixed it, well done!', 'Got there!', 'That is the way: keep trying!'];
const plainText = s => String(s || '').replace(/<[^>]*>/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();

export async function playSkill(skill, content, { mount, onExit, mode: forced, learn = false }) {
  const p = profile(), mode = forced || effectiveMode(p), started = Date.now();
  const root = h(`<section class="player">
    <header class="ptop"><button class="icon pclose" aria-label="${t('ui.close')}">${ICON.close}</button>
      <div class="pbar" role="progressbar" aria-label="Progress"><i></i></div>
      ${mode === 'little' ? `<div class="pipmini">${PIP()}</div>` : ''}
      ${skill.intro && content.explainers[skill.intro] ? `<button class="btn plearn" aria-label="${t('ui.learn')}">📖<span>${t('ui.learn')}</span></button>` : ''}<button class="icon pspeak" aria-label="${t('ui.listen')}">${ICON.speak}</button></header>
    <div class="ptitle">${esc(tr(skill.title))}</div>
    <main class="stage"><div class="prompt"></div><div class="host"></div><div class="solution"></div></main>
    <footer class="pfoot"><div class="fb" aria-live="polite"></div><button class="btn hintb">${ICON.bulb}<span>${t('ui.hint')}</span></button></footer></section>`);
  mount(root);
  let exited = false, cleanups = [];
  const $ = s => root.querySelector(s), host = $('.host'), promptEl = $('.prompt');
  const runCleanups = () => { cleanups.forEach(f => { try { f(); } catch (e) {} }); cleanups = []; };
  const exit = () => { if (exited) return; exited = true; runCleanups(); hush(); onExit(); };
  // A running test can ask before it is closed (its answers would be lost).
  let guard = null;
  $('.pclose').onclick = () => { if (guard && guard(exit)) return; exit(); };
  // Watch the lesson again: restart with the explainer.
  if ($('.plearn')) $('.plearn').onclick = () => { if (exited) return; exited = true; runCleanups(); hush(); playSkill(skill, content, { mount, onExit, mode: forced, learn: true }); };
  const pip = $('.pipmini svg');
  const setPip = (c, ms) => { if (!pip) return; pip.classList.remove('cheer', 'think'); pip.classList.add(c); setTimeout(() => pip.classList.remove(c), ms); };
  const feedback = (msg, kind, detail) => { const f = $('.fb'); f.className = 'fb ' + kind; f.innerHTML = msg ? `<span><b>${esc(msg)}</b>${detail ? `<small>${esc(detail)}</small>` : ''}</span>` : ''; if (msg) squash(f); };
  let streak = 0, lastPraise = '';
  const praise = list => { let w; do { w = list[Math.floor(Math.random() * list.length)]; } while (w === lastPraise && list.length > 1); lastPraise = w; return w; };
  // A small burst of stars from the feedback bar.
  const burst = () => { if (RM || mode === 'adult') return; const f = $('.fb'), r = f.getBoundingClientRect();
    for (let k = 0; k < 10; k++) { const s = h(`<i class="burst">${['★', '✦', '●'][k % 3]}</i>`); s.style.left = (r.left + 30 + Math.random() * Math.min(160, r.width)) + 'px'; s.style.top = (r.top + r.height / 2) + 'px'; s.style.color = ['#ffd23f', '#ff6b4a', '#4dabf7', '#5cc96b', '#9775fa'][k % 5]; document.body.append(s);
      const a = s.animate([{ transform: 'translate(0,0) scale(.6)', opacity: 1 }, { transform: `translate(${Math.random() * 120 - 60}px,${-50 - Math.random() * 80}px) scale(1.2)`, opacity: 0 }], { duration: 700 + Math.random() * 300, easing: 'cubic-bezier(.2,.7,.3,1)' }); a.onfinish = () => s.remove(); setTimeout(() => s.remove(), 1200); } };
  const progress = r => { $('.pbar i').style.width = (r * 100) + '%'; };

  // Intro explainer on first visit.
  if (skill.intro && content.explainers[skill.intro] && (learn || !p.progress[skill.id])) {
    root.classList.add('explaining');
    await explainer(host, content.explainers[skill.intro]);
    root.classList.remove('explaining');
    if (exited) return;
  }

  let seqI = 0;
  const genOf = () => skill.seq ? skill.seq[seqI++ % skill.seq.length] : skill.mix ? skill.mix[Math.floor(Math.random() * skill.mix.length)] : skill.gen;
  // No question twice in one lesson (small question pools are re-drawn a few times).
  const seen = new Set();
  // What makes a question different: its options, sentence words, word to spell, tiles or passage.
  const keyOf = a => { const d = a.data || {}; return [a.template, String(a.prompt).replace(/<svg[\s\S]*?<\/svg>/g, ''), JSON.stringify(a.answer),
    JSON.stringify(d.options || d.words || d.word || (d.tiles && [...d.tiles].sort()) || ''), d.show || d.sentence || (d.story && d.story.title) || ''].join('|'); };
  const nextAct = () => { let a; for (let k = 0; k < 15; k++) { a = loc(GEN[genOf()](skill.params || {})); if (!seen.has(keyOf(a))) break; if (skill.seq && k < 14) seqI--; } seen.add(keyOf(a)); return a; };
  const firstAct = nextAct();

  // ----- Item-by-item lesson -----
  const n = skill.items || (mode === 'little' ? 5 : 6);
  let correct = 0;
  for (let i = 0; i < n && !exited; i++) {
    if (!root.isConnected) { exited = true; runCleanups(); hush(); return; }   // another screen replaced this lesson
    const act = i === 0 ? firstAct : nextAct();
    progress(i / n);
    const first = await runItem(act);
    runCleanups();
    if (first) correct++;
    progress((i + 1) / n);
  }
  if (exited) return;
  results({ correct, total: n });

  function runItem(act) {
    return new Promise(resolve => {
      let tries = 0, settled = false, assistedByHint = false;
      $('.solution').innerHTML = ''; $('.solution').classList.remove('on'); feedback('', '');
      promptEl.innerHTML = act.prompt; host.innerHTML = '';
      if (location.hash === '#debug') window.__act = act;
      const speakIt = () => {
        const c = promptEl.cloneNode(true); if (act.say) c.querySelectorAll('.expr').forEach(e => e.remove());
        say(`${c.textContent} ${act.say || ''}`.trim());
      };
      $('.pspeak').onclick = speakIt;
      if (mode === 'little' || mode === 'explore') setTimeout(() => { if (!settled && !exited) speakIt(); }, 300);
      const T = TEMPLATES[act.template];
      const ctx = {
        mode, t, say, sfx, onCleanup: f => cleanups.push(f),
        submit(v, opt = {}) {
          if (settled) return { ok: false };
          const ok = act.check ? act.check(v) : String(v).trim() === String(act.answer);
          if (ok) {
            settled = true; const firstTry = tries === 0 && !opt.assisted && !assistedByHint;
            streak = firstTry ? streak + 1 : 0;
            const list = PRAISE[mode] || PRAISE.explore;
            const msg = !firstTry && tries > 0 ? praise(COMEBACK) : streak === 3 ? '3 in a row! 🔥' : streak === 5 ? '5 in a row! You are on fire! 🔥' : streak > 5 && streak % 5 === 0 ? `${streak} in a row! Unstoppable! 🚀` : praise(list);
            // Older learners also see why it is right: the last line of the worked solution.
            const steps = mode !== 'little' && act.solution ? act.solution.map(plainText).filter(Boolean) : [];
            const all = steps.join(' · '), why = all.length <= 90 ? all : (steps[steps.length - 1] || '');
            (/in a row/.test(msg) ? sfx.streak : sfx.chime)();
            setPip('cheer', 1500); feedback(msg, 'ok', why.length <= 90 ? why : ''); burst();
            if (mode === 'little') say(msg.replace(/[🔥🚀]/g, ''));
            record(p, skill.id, firstTry); save();
            setTimeout(() => resolve(firstTry), mode === 'little' ? 1500 : 1000);
            return { ok: true };
          }
          tries++; sfx.boing(); setPip('think', 1200);
          if (tries === 1) { feedback(t('fb.try'), 'bad'); inst.hint?.(1); }
          else if (tries === 2) { feedback(act.hint || t('fb.hint'), 'hint'); inst.hint?.(2); if (mode === 'little' || mode === 'explore') say(act.hint); }
          else { settled = true; record(p, skill.id, false); save(); showSolution(act).then(() => resolve(false)); }
          return { ok: false };
        }
      };
      const inst = T.render(host, act, ctx) || {};
      $('.hintb').hidden = mode === 'little';
      $('.hintb').onclick = () => { assistedByHint = true; feedback(act.hint || t('fb.hint'), 'hint'); inst.hint?.(2); };
    });
  }

  function showSolution(act) {
    return new Promise(res => {
      const s = $('.solution');
      s.innerHTML = `<div class="solin"><h4>${t('fb.solution')}</h4><ol>${(act.solution || []).map(l => `<li>${l}</li>`).join('')}</ol><button class="btn primary">${t('fb.gotit')}</button></div>`;
      s.classList.add('on'); feedback('', '');
      s.querySelector('button').onclick = () => { s.classList.remove('on'); res(); };
    });
  }

  function results({ correct, total, newBest, best }) {
    (p.sessions ||= []).push({ id: skill.id, t: Date.now(), ms: Date.now() - started, c: correct, n: total }); if (p.sessions.length > 300) p.sessions.splice(0, p.sessions.length - 300);
    const r = p.progress[skill.id], m = pct(r);
    let reward = '';
    if (mode === 'little') { const got = correct >= Math.ceil(total * .6); if (got) p.stickers.push(skill.icon); reward = got ? `<div class="rsticker">${sticker(skill.icon, p.stickers.length)}</div><p class="rline">${t('res.sticker')}</p>` : ''; }
    else if (mode === 'explore') { const c = correct * 5; p.coins += c; reward = `<p class="rline coins">${ICON.coin}<span>${t('res.coins', { n: c })}</span></p>`; }
    save();
    root.innerHTML = `<section class="results">${mode === 'little' ? `<div class="rpip">${PIP('cheer')}</div>` : ''}
      <h2>${correct === total ? 'Perfect round! ⭐' : correct >= total * .8 ? 'Brilliant work!' : correct >= total * .6 ? t('fb.wellDone') : 'Good practice! Play again to beat your score.'}</h2>
      <p class="rscore">${t('res.score', { c: correct, n: total })}</p>${reward}
      ${newBest ? `<p class="rline best">${t('res.newBest')}</p>` : best != null ? `<p class="rline">${t('res.best', { n: best })}</p>` : ''}
      ${mode !== 'little' ? `<div class="rmast"><div class="mbar"><i style="width:${m}%"></i></div><span>${t('res.mastery', { p: m })}</span></div>` : ''}
      <div class="ract"><button class="btn primary ragain">${ICON.replay}<span>${t('ui.again')}</span></button><button class="btn rhome">${t('ui.home')}</button></div></section>`;
    sfx.fanfare(); if (mode === 'little') say(t('fb.wellDone'));
    if (!RM && mode !== 'adult') confetti(root);
    root.querySelector('.ragain').onclick = () => { exited = true; playSkill(skill, content, { mount, onExit, mode: forced }); };
    root.querySelector('.rhome').onclick = exit;
  }
}

function confetti(root) {
  for (let k = 0; k < 50; k++) {
    const c = h('<i class="cf"></i>'); c.style.left = Math.random() * 100 + 'vw';
    c.style.background = ['#ffd23f', '#ff6b4a', '#4dabf7', '#5cc96b', '#ff6b8a', '#9775fa'][k % 6]; root.append(c);
    c.animate([{ transform: 'translateY(0) rotate(0)' }, { transform: `translate(${Math.random() * 160 - 80}px,110vh) rotate(${360 + Math.random() * 720}deg)` }], { duration: 1800 + Math.random() * 1400, delay: Math.random() * 400, easing: 'cubic-bezier(.3,.6,.6,1)', fill: 'backwards' }).onfinish = () => c.remove();
  }
}
