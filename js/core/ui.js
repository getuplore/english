// Small DOM + motion helpers shared by every screen and template.
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export function h(html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
export const pick = a => a[Math.floor(Math.random() * a.length)];
export const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const wait = ms => new Promise(r => setTimeout(r, ms));
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const BOUNCE = 'cubic-bezier(.34,1.56,.64,1)';
export const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const ctr = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };

export function choices(n, k, lo, hi) {
  const s = new Set([n]);
  for (let d = 1; d < 40 && s.size < k; d++) for (const v of shuffle([n - d, n + d])) if (v >= lo && v <= hi && s.size < k) s.add(v);
  return shuffle([...s]);
}
export function squash(el) { el.animate?.([{ transform: 'scale(1)' }, { transform: 'scale(1.18,.84)' }, { transform: 'scale(.94,1.08)' }, { transform: 'scale(1)' }], { duration: 360, easing: 'ease-out' }); }
export function wiggle(el) { el.animate?.([{ transform: 'translateX(0)' }, { transform: 'translateX(-8px) rotate(-3deg)' }, { transform: 'translateX(7px) rotate(2deg)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(0)' }], { duration: 420 }); }
export function popIn(el, delay = 0) { el.animate?.([{ transform: 'scale(.4)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 420, delay, easing: BOUNCE, fill: 'backwards' }); }

let toastT;
export function toast(msg) { const el = $('#toast'); if (!el) return; el.textContent = msg; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('on'), 2200); }

// Press-and-hold gate for the grown-ups area.
export function holdButton(btn, ms, fn) {
  let t; const stop = () => { clearTimeout(t); btn.classList.remove('holding'); };
  btn.style.setProperty('--hold', ms + 'ms');
  btn.addEventListener('pointerdown', e => { e.preventDefault(); btn.classList.add('holding'); t = setTimeout(() => { stop(); fn(); }, ms); });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => btn.addEventListener(ev, stop));
  btn.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); fn(); } });
  btn.addEventListener('contextmenu', e => e.preventDefault());
}

// Pointer drag with a tap fallback: a tap sends the item to the first target.
export function draggable(el, { targets, onDrop, onTap = null, canStart = () => true }) {
  el.style.touchAction = 'none'; el._x = 0; el._y = 0;
  const set = (x, y, extra = '') => { el._x = x; el._y = y; el.style.transform = `translate(${x}px,${y}px) ${extra}`; };
  el.addEventListener('pointerdown', e => {
    if (!canStart() || el.dataset.used) return;
    e.preventDefault(); try { el.setPointerCapture(e.pointerId); } catch (_) {}
    const sx = e.clientX, sy = e.clientY, tgs = targets(); let moved = false; el.classList.add('lift');
    const mv = ev => { const dx = ev.clientX - sx, dy = ev.clientY - sy; if (Math.hypot(dx, dy) > 10) moved = true; set(dx, dy, 'scale(1.08)'); tgs.forEach(t => t.classList.toggle('over', hit(t, ev.clientX, ev.clientY))); };
    const up = ev => {
      el.removeEventListener('pointermove', mv); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
      el.classList.remove('lift'); tgs.forEach(t => t.classList.remove('over'));
      if (!moved && onTap) { goHome(el); onTap(el); return; }
      let tg = tgs.find(t => hit(t, ev.clientX, ev.clientY)); if (!moved) tg = tgs[0];
      if (!tg || ev.type === 'pointercancel') { goHome(el); return; }
      onDrop(el, tg);
    };
    el.addEventListener('pointermove', mv); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  });
  el.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && canStart() && !el.dataset.used) { e.preventDefault(); onDrop(el, targets()[0]); } });
}
const hit = (t, x, y) => { const r = t.getBoundingClientRect(), p = 24; return x > r.left - p && x < r.right + p && y > r.top - p && y < r.bottom + p; };
export function goHome(el) {
  const x = el._x || 0, y = el._y || 0;
  el.animate?.([{ transform: `translate(${x}px,${y}px)` }, { transform: 'translate(0,0)' }], { duration: 520, easing: BOUNCE });
  el._x = el._y = 0; el.style.transform = '';
}
export function flyTo(el, tg) {
  return new Promise(res => {
    const [ex, ey] = ctr(el), [tx, ty] = ctr(tg), x0 = el._x || 0, y0 = el._y || 0, x1 = x0 + tx - ex, y1 = y0 + ty - ey;
    const a = el.animate?.([{ transform: `translate(${x0}px,${y0}px)` }, { transform: `translate(${(x0 + x1) / 2}px,${(y0 + y1) / 2 - 40}px)` }, { transform: `translate(${x1}px,${y1}px)` }], { duration: RM ? 10 : 380, easing: 'ease-in-out' });
    el._x = x1; el._y = y1; el.style.transform = `translate(${x1}px,${y1}px)`;
    if (a) { a.onfinish = res; a.oncancel = res; } else res();
  });
}

// Shared on-screen number pad (used by several templates).
export function numpad({ onKey, allowNeg = false, allowDot = false, okLabel = 'OK' }) {
  const keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', allowNeg ? '−' : '', '0', allowDot ? '.' : ''];
  const el = h(`<div class="numpad">${keys.map(k => k ? `<button class="k" data-k="${k}">${k}</button>` : '<span></span>').join('')}<button class="k del" data-k="del" aria-label="Delete">⌫</button><button class="k ok" data-k="ok">${okLabel}</button></div>`);
  el.addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (b) onKey(b.dataset.k); });
  return el;
}
