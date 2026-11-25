// Learners come from the Uplore family (shared storage `pipmaths.v1`, managed on the Uplore home page).
// English keeps its own progress per learner in `uplore.english.v1`, backed up to the English tables.
const FAM = 'pipmaths.v1', KEY = 'uplore.english.v1';
const read = k => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } };
let fam = read(FAM) || {}, E = read(KEY) || {};
const blankEn = () => ({ progress: {}, bests: {}, coins: 0, stickers: [], sessions: [], t: 0 });
const listeners = [];
export const onSave = fn => { listeners.push(fn); };
function write() { try { localStorage.setItem(KEY, JSON.stringify(E)); } catch (e) {} }
// Listeners first (cloud sync stamps "t"), then write, so another tab can tell which copy is newer.
export function save() { listeners.forEach(f => { try { f(); } catch (e) {} }); write(); }

// A learner as English sees it: who they are (from the family) plus their English progress.
const cache = new Map();
function learner(f) {
  if (!f) return null;
  const en = E[f.id] || (E[f.id] = blankEn());
  let o = cache.get(f.id);
  if (!o || o._en !== en) { o = { _en: en }; cache.set(f.id, o); }
  Object.assign(o, { id: f.id, name: f.name || 'Learner', age: f.age || 8, color: f.color || '#4dabf7', modeOverride: f.modeOverride || null, lang: 'en' });
  ['progress', 'bests', 'stickers', 'sessions'].forEach(k => { if (!en[k]) en[k] = k === 'progress' || k === 'bests' ? {} : []; o[k] = en[k]; });
  Object.defineProperty(o, 'coins', { get: () => en.coins || 0, set: v => { en.coins = v; }, configurable: true, enumerable: true });
  return o;
}
export const profiles = () => (fam.profiles || []).filter(p => p && p.id).map(learner);
export const activeId = () => fam.active || null;
export const profile = () => learner((fam.profiles || []).find(p => p.id === fam.active));
export const settings = () => ({ sound: true, voice: true, ...(fam.settings || {}) });
export const english = () => E;
export const blank = blankEn;
// Replace English progress after a sync (no change event, so it does not echo back).
export function setEnglish(next) { E = next; cache.clear(); write(); }
export function resetProgress() { const p = profile(); if (!p) return; E[p.id] = { ...blankEn(), t: Date.now() }; cache.delete(p.id); save(); }
// Another tab changed the family (Uplore) or English progress: read both again. Newer English copy wins per learner.
export function reload() {
  const before = JSON.stringify([fam, E]);
  fam = read(FAM) || {};
  const stored = read(KEY) || {};
  for (const id of Object.keys(stored)) if (!E[id] || (stored[id].t || 0) > (E[id].t || 0)) E[id] = stored[id];
  cache.clear();
  return JSON.stringify([fam, E]) !== before;
}

export function modeForAge(age) { return age <= 7 ? 'little' : age <= 13 ? 'explore' : age <= 18 ? 'achieve' : 'adult'; }
export function effectiveMode(p) { return p.modeOverride || modeForAge(p.age); }
