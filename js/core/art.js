// Drawings: Pip, interface icons, mouth pictures for letter sounds, and lesson badges. All inline, so it works offline.
export const PIP = (c = '') => `<svg class="pip ${c}" viewBox="0 0 200 200" aria-hidden="true"><ellipse cx="100" cy="190" rx="52" ry="8" fill="#1d2b5333"/><g class="pip-b"><path class="arm l" d="M44 118q-28 4-34-18"/><path class="arm r" d="M156 116q30-6 30-40"/><path d="M100 26c48 0 72 40 72 86s-30 70-72 70-72-24-72-70 24-86 72-86z" fill="#ff8a3d"/><ellipse cx="78" cy="50" rx="20" ry="10" fill="#ffffff40" transform="rotate(-25 78 50)"/><path d="M94 28c-6-14 2-22 8-24 0 8 4 14 10 18" fill="#ff8a3d"/><ellipse cx="100" cy="140" rx="44" ry="32" fill="#ffd9a8"/><g class="eyes"><circle cx="76" cy="92" r="17" fill="#fff"/><circle cx="124" cy="92" r="17" fill="#fff"/><circle class="pu" cx="79" cy="95" r="9" fill="#1d2b53"/><circle class="pu" cx="121" cy="95" r="9" fill="#1d2b53"/><circle cx="82" cy="91" r="3" fill="#fff"/><circle cx="124" cy="91" r="3" fill="#fff"/></g><path d="M84 120q16 16 32 0" stroke="#1d2b53" stroke-width="5" fill="#ff6b4a" stroke-linecap="round" stroke-linejoin="round"/><circle cx="58" cy="116" r="8" fill="#ff6b8a" opacity=".5"/><circle cx="142" cy="116" r="8" fill="#ff6b8a" opacity=".5"/><ellipse cx="78" cy="182" rx="16" ry="8" fill="#e8702a"/><ellipse cx="122" cy="182" rx="16" ry="8" fill="#e8702a"/></g></svg>`;

const sv = (d, vb = '0 0 24 24') => `<svg viewBox="${vb}" aria-hidden="true">${d}</svg>`;
const st = 'fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"';
export const ICON = {
  home: sv(`<path d="M4 11.5 12 4l8 7.5M6.5 9.5V20h11V9.5" ${st}/><path d="M10 20v-5h4v5" ${st}/>`),
  close: sv(`<path d="M6 6l12 12M18 6 6 18" ${st}/>`),
  speak: sv(`<path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" ${st}/>`),
  chart: sv(`<path d="M4 20V11M10 20V5M16 20v-6M2.5 20.5h19" ${st}/>`),
  gear: sv(`<circle cx="12" cy="12" r="3.4" ${st}/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" ${st}/>`),
  play: sv('<path d="M8 5.5v13a1 1 0 0 0 1.5.9l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5z" fill="currentColor"/>'),
  back: sv(`<path d="M15 5l-7 7 7 7" ${st}/>`),
  check: sv(`<path d="M5 12.5l4.5 4.5L19 7.5" ${st} stroke-width="3"/>`),
  bulb: sv(`<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" ${st}/>`),
  lock: sv(`<rect x="5" y="11" width="14" height="9" rx="2" ${st}/><path d="M8 11V8a4 4 0 0 1 8 0v3" ${st}/>`),
  coin: sv('<circle cx="12" cy="12" r="9" fill="#ffd23f"/><circle cx="12" cy="12" r="6" fill="none" stroke="#e0a800" stroke-width="2"/>'),
  star: sv('<path d="M12 2.8l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" stroke-linejoin="round"/>'),
  flag: sv(`<path d="M6 21V4M6 4h11l-2 4 2 4H6" ${st}/>`),
  replay: sv(`<path d="M5 12a7 7 0 1 0 2.1-5" ${st} stroke-width="2.8"/><path d="M4 3v5h5" ${st} stroke-width="2.8"/>`)
};

// Lesson icons (100×100), coloured, used on skill cards.

// Pictures of things are emoji in a soft tile: they are on every device and need no image files.
export const pic = (e, label = '') => `<span class="pic" role="img" aria-label="${label}">${e}</span>`;

// Lesson badge: an emoji on a coloured disc (also used for stickers).
export const badge = (e, c = '#ffd23f') => `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" fill="${c}" fill-opacity=".28"/><text x="50" y="52" text-anchor="middle" dominant-baseline="central" font-size="50">${e}</text></svg>`;
const burst = (() => { let d = ''; for (let i = 0; i < 32; i++) { const r = i % 2 ? 42 : 48, a = Math.PI * i / 16; d += (i ? 'L' : 'M') + (50 + r * Math.cos(a)).toFixed(1) + ' ' + (50 + r * Math.sin(a)).toFixed(1); } return d + 'Z'; })();
export const sticker = (e, i = 0) => `<svg viewBox="0 0 100 100" class="stkr" style="--r:${(i * 37) % 17 - 8}deg"><path d="${burst}" fill="#fff"/><circle cx="50" cy="50" r="37" fill="#ffd23f" fill-opacity=".35"/><text x="50" y="53" text-anchor="middle" dominant-baseline="central" font-size="42">${e || '⭐'}</text></svg>`;

// Mouth pictures: how the mouth looks when making a sound (the device voice cannot say single sounds).
// Each shape: lips path, teeth, tongue, and a tip shown under it.
const MOUTH_OF = {
  open: 'a', round: 'o u w qu', smile: 'e i y', lips: 'm b p', teeth: 'f v', tip: 't d n l', hiss: 's z x', back: 'c k g ck', breath: 'h', growl: 'r', j: 'j'
};
export const MOUTH_TIP = {
  open: 'Open your mouth wide.', round: 'Make your lips round.', smile: 'Smile a little and keep your mouth a bit open.', lips: 'Press your lips together, then open.',
  teeth: 'Top teeth gently on your bottom lip.', tip: 'Tongue tip up behind your top teeth.', hiss: 'Teeth close together, let the air hiss out.',
  back: 'Back of your tongue up, then let go.', breath: 'Open your mouth and breathe out, like fogging a mirror.', growl: 'Lips a little round, tongue pulled back.', j: 'Lips pushed forward, teeth close.'
};
export function mouthShape(letter) { for (const [k, v] of Object.entries(MOUTH_OF)) if (v.split(' ').includes(letter)) return k; return 'open'; }
export function mouth(letter) {
  const k = mouthShape(letter);
  const face = '<circle cx="60" cy="60" r="56" fill="#ffd9a8"/>';
  const m = {
    open: '<ellipse cx="60" cy="74" rx="24" ry="22" fill="#7a2a2a"/><path d="M40 62h40" stroke="#fff" stroke-width="6" stroke-linecap="round"/><ellipse cx="60" cy="88" rx="13" ry="6" fill="#ff8a8a"/>',
    round: '<ellipse cx="60" cy="74" rx="13" ry="15" fill="#7a2a2a" stroke="#e8706a" stroke-width="7"/>',
    smile: '<path d="M34 68q26 18 52 0q-26 12-52 0z" fill="#7a2a2a" stroke="#e8706a" stroke-width="5" stroke-linejoin="round"/><path d="M40 69h40" stroke="#fff" stroke-width="4" stroke-linecap="round"/>',
    lips: '<path d="M36 74q24-10 48 0q-24 10-48 0z" fill="#e8706a"/><path d="M36 74h48" stroke="#a8433f" stroke-width="3" stroke-linecap="round"/>',
    teeth: '<path d="M38 70q22-8 44 0v8q-22 8-44 0z" fill="#7a2a2a"/><rect x="44" y="66" width="32" height="8" rx="3" fill="#fff"/><path d="M38 80q22 10 44 0" stroke="#e8706a" stroke-width="7" fill="none" stroke-linecap="round"/>',
    tip: '<path d="M38 70q22-10 44 0q-4 16-22 16t-22-16z" fill="#7a2a2a"/><path d="M42 68h36" stroke="#fff" stroke-width="5" stroke-linecap="round"/><path d="M48 80q12-14 24 0" fill="#ff8a8a"/>',
    hiss: '<path d="M38 72q22-8 44 0q-22 10-44 0z" fill="#7a2a2a"/><path d="M41 70h38M41 75h38" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M90 66q8 4 0 8q8 4 0 8" stroke="#4dabf7" stroke-width="3" fill="none" stroke-linecap="round"/>',
    back: '<ellipse cx="60" cy="74" rx="20" ry="13" fill="#7a2a2a"/><path d="M44 66h32" stroke="#fff" stroke-width="5" stroke-linecap="round"/><path d="M46 82q14-16 28 0" fill="#ff8a8a"/>',
    breath: '<ellipse cx="60" cy="74" rx="20" ry="16" fill="#7a2a2a"/><path d="M88 60q10 0 14-6M90 70q12 0 18-4" stroke="#adb5bd" stroke-width="3" fill="none" stroke-linecap="round"/>',
    growl: '<ellipse cx="60" cy="74" rx="15" ry="12" fill="#7a2a2a" stroke="#e8706a" stroke-width="6"/><path d="M52 80q8-6 16 0" fill="#ff8a8a"/>',
    j: '<ellipse cx="60" cy="75" rx="15" ry="11" fill="#7a2a2a" stroke="#e8706a" stroke-width="8"/><path d="M50 72h20" stroke="#fff" stroke-width="4" stroke-linecap="round"/>'
  }[k];
  return `<svg class="mouth" viewBox="0 0 120 120" role="img" aria-label="${MOUTH_TIP[k]}">${face}<circle cx="40" cy="40" r="6" fill="#1d2b53"/><circle cx="80" cy="40" r="6" fill="#1d2b53"/>${m}</svg>`;
}
