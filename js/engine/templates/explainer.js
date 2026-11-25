// Animated "Learn first" introduction: frames with a picture, spoken words, and an optional try-it question.
import { esc } from '../../core/ui.js';
import { t } from '../../core/i18n.js';
import { sfx, say } from '../../core/audio.js';
import { ICON } from '../../core/art.js';

export function explainer(host, ex) {
  return new Promise(resolve => {
    let i = 0;
    host.innerHTML = `<div class="t-ex"><h3>${esc(ex.title)}</h3><div class="frame"></div><div class="exdots">${ex.frames.map(() => '<i></i>').join('')}</div>
      <div class="exnav"><button class="btn exback">${t('ui.back')}</button><button class="btn exsay" aria-label="${t('ui.listen')}">${ICON.speak}</button><button class="btn primary exnext">${t('ui.next')}</button></div><button class="linkbtn exskip">${t('ui.skip')}</button></div>`;
    const fr = host.querySelector('.frame');
    const show = () => {
      fr.innerHTML = ex.frames[i].html; fr.animate?.([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'ease-out' });
      // A "try it" frame: one question with Pip before practice. Next waits for a first answer.
      const tr = ex.frames[i].try, nx = host.querySelector('.exnext');
      nx.disabled = !!tr && !tr.done;
      if (tr) {
        const box = document.createElement('div'); box.className = 'extry';
        box.innerHTML = `<div class="exopts">${tr.options.map((o, k) => `<button class="btn exopt" data-k="${k}">${o}</button>`).join('')}</div><p class="exfb" role="status"></p>`;
        fr.append(box);
        box.querySelectorAll('.exopt').forEach(b => b.onclick = () => {
          const k = +b.dataset.k, fb = box.querySelector('.exfb');
          if (k === tr.answer) { b.classList.add('ok'); box.querySelectorAll('.exopt').forEach(x => { x.disabled = true; }); fb.textContent = tr.right; fb.className = 'exfb ok'; sfx.chime(); say(tr.right); }
          else { b.classList.add('no'); b.disabled = true; fb.textContent = tr.wrong; fb.className = 'exfb no'; sfx.boing(); say(tr.wrong); }
          tr.done = true; nx.disabled = false;
        });
      }
      host.querySelectorAll('.exdots i').forEach((d, k) => d.classList.toggle('on', k <= i));
      host.querySelector('.exback').disabled = i === 0;
      host.querySelector('.exnext').textContent = i === ex.frames.length - 1 ? t('ex.start') : t('ui.next');
      say(ex.frames[i].say);
    };
    host.querySelector('.exnext').onclick = () => { sfx.tap(); if (i < ex.frames.length - 1) { i++; show(); } else resolve(); };
    host.querySelector('.exback').onclick = () => { if (i > 0) { i--; show(); } };
    host.querySelector('.exsay').onclick = () => say(ex.frames[i].say);
    host.querySelector('.exskip').onclick = () => resolve();
    show();
  });
}
