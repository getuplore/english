// Country settings for English: the voice, level names and spelling (British or American).
import { settings } from './store.js';

export const REGIONS = {
  india: { name: 'India', locale: 'en-IN', voice: 'en-IN', us: false },
  us: { name: 'USA', locale: 'en-US', voice: 'en-US', us: true },
  canada: { name: 'Canada', locale: 'en-CA', voice: 'en-CA', us: false },
  uk: { name: 'UK', locale: 'en-GB', voice: 'en-GB', us: false }
};
export function guessRegion() {
  const l = (navigator.language || '').toLowerCase(); let tz = ''; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
  if (l.endsWith('-in') || /Kolkata|Calcutta/.test(tz)) return 'india';
  if (l.endsWith('-ca') || /Toronto|Vancouver|Edmonton|Winnipeg|Halifax|Regina|St_Johns|Montreal/.test(tz)) return 'canada';
  if (l.endsWith('-gb') || /London/.test(tz)) return 'uk';
  if (l.endsWith('-us') || /America\//.test(tz)) return 'us';
  return 'india';
}
export const regionId = () => settings().region || guessRegion();
export const R = () => REGIONS[regionId()] || REGIONS.india;
export const isUS = () => regionId() === 'us';

// Spelling: British for India, UK and Canada; American for the USA. "Mum" is "Mom" in North America.
const US = [[/\bcolour/g, 'color'], [/\bColour/g, 'Color'], [/\bfavourite/g, 'favorite'], [/\bFavourite/g, 'Favorite'], [/\bgrey\b/g, 'gray'], [/\bGrey\b/g, 'Gray'],
  [/\bcentre\b/g, 'center'], [/\bmum\b/g, 'mom'], [/\bMum\b/g, 'Mom'], [/\bpyjamas\b/g, 'pajamas'], [/\btrousers\b/g, 'pants'], [/\bjumper\b/g, 'sweater'], [/\bbiscuit/g, 'cookie'], [/\bmaths\b/g, 'math'], [/\bspelt\b/g, 'spelled'], [/\bapologise/g, 'apologize'], [/\btonnes\b/g, 'tons'], [/\btravelled\b/g, 'traveled'], [/\bpedalled\b/g, 'pedaled'], [/\btorch\b/g, 'flashlight']];
const CA = [[/\btorch\b/g, 'flashlight'], [/\bmum\b/g, 'mom'], [/\bMum\b/g, 'Mom'], [/\bjumper\b/g, 'sweater'], [/\bbiscuit/g, 'cookie']];
export function spell(s) {
  if (typeof s !== 'string') return s;
  const rules = regionId() === 'us' ? US : regionId() === 'canada' ? CA : [];
  for (const [a, b] of rules) s = s.replace(a, b);
  return s;
}
// Walk an activity and apply the country's spelling to every string (functions and numbers are left alone).
export function loc(o) {
  if (typeof o === 'string') return spell(o);
  if (Array.isArray(o)) { for (let i = 0; i < o.length; i++) o[i] = loc(o[i]); return o; }
  if (o && typeof o === 'object') { for (const k of Object.keys(o)) if (typeof o[k] !== 'function') o[k] = loc(o[k]); }
  return o;
}

// School level names differ by country (UK years run one ahead).
export function lvShort(code) {
  const r = regionId(), g = /^G(\d+)$/.exec(code);
  if (r === 'us') return code === 'JK' ? 'Pre-K' : code === 'SK' ? 'K' : code;
  if (r === 'uk') return code === 'JK' ? 'Nursery' : code === 'SK' ? 'Reception' : g ? `Y${+g[1] + 1}` : code;
  return code;
}
export function lvLong(code) {
  const r = regionId(), g = /^G(\d+)$/.exec(code);
  const early = { india: ['Junior KG', 'Senior KG'], canada: ['Junior Kindergarten', 'Senior Kindergarten'], us: ['Pre-K', 'Kindergarten'], uk: ['Nursery', 'Reception'] }[r];
  if (code === 'JK') return early[0]; if (code === 'SK') return early[1];
  if (g) return r === 'uk' ? `Year ${+g[1] + 1}` : `Grade ${g[1]}`;
  return code;
}
