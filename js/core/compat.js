// Small stand-ins for browser features that older iPads (Safari 12–13) do not have.
if (typeof Element !== 'undefined') {
  // Safari 14+: replace all children of an element.
  if (!Element.prototype.replaceChildren) Element.prototype.replaceChildren = function (...nodes) { while (this.lastChild) this.removeChild(this.lastChild); this.append(...nodes); };
  // Web Animations: without them, skip the animation but keep the code working.
  if (!Element.prototype.animate) Element.prototype.animate = function () { const a = { onfinish: null, cancel() {}, play() {}, finish() {}, finished: Promise.resolve() }; setTimeout(() => a.onfinish && a.onfinish(), 0); return a; };
}

// iPads up to iOS 13 ignore `touch-action: none`, so the page scrolls (and the drag is cancelled)
// when a child drags a tile. Block scrolling ourselves when the touch starts on such an element.
if (typeof document !== 'undefined' && window.getComputedStyle) {
  let lock = false;
  const blocks = el => { for (; el && el.nodeType === 1; el = el.parentElement) { if (getComputedStyle(el).touchAction === 'none') return true; } return false; };
  document.addEventListener('touchstart', e => { lock = blocks(e.target); }, { passive: true, capture: true });
  document.addEventListener('touchmove', e => { if (lock && e.cancelable) e.preventDefault(); }, { passive: false, capture: true });
  document.addEventListener('touchend', () => { lock = false; }, { passive: true, capture: true });
}

// Keep the last few errors so the diagnostics page (diag.html) can show them.
if (typeof window !== 'undefined') {
  const keep = m => { try { const k = 'pipmaths.errors', l = JSON.parse(localStorage.getItem(k) || '[]'); l.push(new Date().toISOString().slice(0, 19) + ' ' + String(m).slice(0, 300)); localStorage.setItem(k, JSON.stringify(l.slice(-15))); } catch (e) {} };
  window.addEventListener('error', e => keep((e.message || 'error') + ' @' + ((e.filename || '').split('/').pop().split('?')[0]) + ':' + (e.lineno || '') + ':' + (e.colno || '')));
  window.addEventListener('unhandledrejection', e => keep('promise: ' + (e.reason && (e.reason.stack || e.reason.message) || e.reason)));
}

// Older iPads (Safari before 13) have no pointer events. This turns touch and mouse events into
// pointerdown / pointermove / pointerup so dragging, the abacus and hold-to-open buttons still work.
if (typeof window !== 'undefined' && !window.PointerEvent) {
  let cap = null, touching = false;
  Element.prototype.setPointerCapture = function () { cap = this; };
  Element.prototype.releasePointerCapture = function () { cap = null; };
  Element.prototype.hasPointerCapture = function () { return cap === this; };
  const fire = (type, kind, pt, orig, target) => {
    if (!target) return;
    const ev = document.createEvent('Event'); ev.initEvent(type, true, true);
    ev.clientX = pt.clientX; ev.clientY = pt.clientY; ev.pageX = pt.pageX; ev.pageY = pt.pageY;
    ev.pointerId = kind === 'touch' ? pt.identifier : 1; ev.pointerType = kind; ev.button = 0; ev.buttons = type === 'pointerup' ? 0 : 1; ev.isPrimary = true;
    const pd = ev.preventDefault.bind(ev);
    // Stopping a move should stop the page scrolling while something is dragged.
    ev.preventDefault = () => { pd(); if (type === 'pointermove' && orig.cancelable) orig.preventDefault(); };
    target.dispatchEvent(ev);
  };
  const opt = { passive: false, capture: true };
  document.addEventListener('touchstart', e => { touching = true; fire('pointerdown', 'touch', e.changedTouches[0], e, e.target); }, opt);
  document.addEventListener('touchmove', e => { fire('pointermove', 'touch', e.changedTouches[0], e, cap || e.target); }, opt);
  const end = type => e => { fire(type, 'touch', e.changedTouches[0], e, cap || e.target); cap = null; setTimeout(() => { touching = false; }, 600); };
  document.addEventListener('touchend', end('pointerup'), opt);
  document.addEventListener('touchcancel', end('pointercancel'), opt);
  document.addEventListener('mousedown', e => { if (!touching) fire('pointerdown', 'mouse', e, e, e.target); }, true);
  document.addEventListener('mousemove', e => { if (!touching) fire('pointermove', 'mouse', e, e, cap || e.target); }, true);
  document.addEventListener('mouseup', e => { if (!touching) { fire('pointerup', 'mouse', e, e, cap || e.target); cap = null; } }, true);
}
