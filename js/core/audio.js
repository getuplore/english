// Synthesised sound effects (Web Audio) and spoken prompts (SpeechSynthesis).
import { settings } from './store.js';
import { lang, VOICE_LANG } from './i18n.js';
import { R } from './region.js';

let ac;
export function unlockAudio() { try { if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume(); } catch (e) {} return ac; }

// iPads only allow sound and speech after a real tap that plays something straight away.
// On each of the first taps: wake the audio with a silent blip and speak a silent word. Stops once both work.
let speechReady = false, soundReady = false;
function unlockOnTap() {
  try {
    const c = unlockAudio();
    if (c && !soundReady) { const b = c.createBuffer(1, 1, 22050), src = c.createBufferSource(); src.buffer = b; src.connect(c.destination); (src.start || src.noteOn).call(src, 0); soundReady = c.state === 'running'; }
  } catch (e) {}
  try {
    if (!speechReady && 'speechSynthesis' in window) { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); speechReady = true; }
  } catch (e) {}
  if (soundReady && speechReady) ['touchend', 'click', 'keydown'].forEach(ev => document.removeEventListener(ev, unlockOnTap, true));
}
if (typeof document !== 'undefined') ['touchend', 'click', 'keydown'].forEach(ev => document.addEventListener(ev, unlockOnTap, true));
function tone(f1, f2, dur, type = 'sine', vol = .2, delay = 0) {
  if (!settings().sound) return; const c = unlockAudio(); if (!c) return;
  const t = c.currentTime + delay, o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
  o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + .05);
}
export const sfx = {
  tap: () => tone(600, 720, .06, 'sine', .1),
  pop: () => tone(320, 980, .11, 'sine', .22),
  chime: () => [659, 784, 988, 1319].forEach((f, i) => tone(f, f * 1.01, .35, 'triangle', .12, i * .07)),
  boing: () => { tone(260, 110, .3, 'sine', .22); tone(390, 170, .3, 'triangle', .06); },
  tick: () => tone(1200, 1100, .03, 'square', .04),
  bead: () => tone(900, 600, .05, 'triangle', .14),
  streak: () => [784, 988, 1175, 1568, 1976].forEach((f, i) => tone(f, f * 1.02, .3, 'triangle', .11, i * .06)),
  fanfare: () => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, f, .24, 'square', .045, i * .11))
};

let voices = [];
function loadVoices() { try { voices = speechSynthesis.getVoices(); } catch (e) {} }
if ('speechSynthesis' in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
function voiceFor(l) {
  const tag = R().voice || VOICE_LANG[l] || 'en-IN', base = tag.slice(0, 2);
  return voices.find(v => (v.lang || '').replace('_', '-') === tag) || voices.find(v => (v.lang || '').replace('_', '-').startsWith(base)) || (l === 'mr' ? voices.find(v => v.lang?.startsWith('hi')) : null) || voices.find(v => v.lang?.startsWith('en')) || null;
}
export function say(text, queue = false) {
  if (!settings().voice || !('speechSynthesis' in window) || !text) return;
  try {
    const u = new SpeechSynthesisUtterance(String(text).replace(/<[^>]+>/g, ' '));
    if (!voices.length) loadVoices();
    const v = voiceFor(lang()); if (v) { u.voice = v; u.lang = v.lang; } else u.lang = R().voice; u.rate = .92; u.pitch = 1.15;
    // Safari drops speech that starts right after cancel(), so give it a moment when something is still talking.
    if (!queue && (speechSynthesis.speaking || speechSynthesis.pending)) { speechSynthesis.cancel(); setTimeout(() => speechSynthesis.speak(u), 120); }
    else speechSynthesis.speak(u);
  } catch (e) {}
}
export function hush() { try { speechSynthesis.cancel(); } catch (e) {} }
