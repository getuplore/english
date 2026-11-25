// Mastery: 80%+ over the last 10 first-try answers, across at least 2 different days.
// Spaced review after mastery: due again after 2, 7, then 30 days.
const DAY = 864e5;
const today = () => Math.floor(Date.now() / DAY);
const REVIEW_DAYS = [2, 7, 30];

export function record(p, skillId, ok) {
  const r = p.progress[skillId] || (p.progress[skillId] = { a: [], last: 0, mastered: 0, reviews: 0 });
  r.a.push([ok ? 1 : 0, today()]); if (r.a.length > 40) r.a.shift();
  if (r.mastered && isDue(r)) r.reviews++;
  r.last = Date.now();
  if (!r.mastered && isMastered(r)) r.mastered = Date.now();
}
export function isMastered(r) {
  if (!r) return false; const l = r.a.slice(-10); if (l.length < 10) return false;
  const acc = l.reduce((s, x) => s + x[0], 0) / 10, days = new Set(r.a.map(x => x[1])).size;
  return acc >= .8 && days >= 2;
}
// Progress toward mastery: first-try correct answers in the last 10.
export function pct(r) { if (!r || !r.a.length) return 0; return r.mastered ? 100 : Math.round(r.a.slice(-10).reduce((s, x) => s + x[0], 0) * 10); }
export function isDue(r) { if (!r?.mastered) return false; const gap = REVIEW_DAYS[Math.min(r.reviews, REVIEW_DAYS.length - 1)]; return Date.now() - r.last > gap * DAY; }
export function status(r) { if (!r || !r.a.length) return 'new'; if (isDue(r)) return 'review'; return r.mastered ? 'mastered' : 'learning'; }

const prereqMet = (p, s) => (s.prereq || []).every(id => { const r = p.progress[id]; return r && (r.mastered || pct(r) >= 60); });
// Recommend: reviews due → lessons in progress → new lessons whose prerequisites are met → anything.
export function nextSkill(p, skills) {
  const st = s => status(p.progress[s.id]);
  return skills.find(s => st(s) === 'review')
    || skills.find(s => st(s) === 'learning' && prereqMet(p, s))
    || skills.find(s => st(s) === 'new' && prereqMet(p, s))
    || skills.find(s => st(s) !== 'mastered') || skills[0];
}
