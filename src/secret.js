// The secret layer: a tiny loose-thread-end doodle hidden in five specific
// screens. Taps count globally, not per-screen. On the 5th distinct
// fragment found, a reveal modal fires once, ever.
import { registerSecretTap, markSecretRevealed, state } from './state.js';
import { thread } from './thread.js';

function fragmentSvg() {
  return `
    <svg viewBox="0 0 30 30" fill="none">
      <path d="M15,26 C15,18 8,18 8,12 C8,7 13,5 16,8" stroke="var(--maroon)" stroke-width="2.4" stroke-linecap="round" fill="none"/>
      <path d="M16,8 L14,6 M16,8 L18,6.5 M16,8 L17,10.5" stroke="var(--crayon-yellow)" stroke-width="1.6" stroke-linecap="round"/>
    </svg>
  `;
}

/**
 * @param {string} id - unique fragment id, one of the five hidden spots
 * @param {string} [extraClass] - screen supplies its own positioning class
 */
export function createFragment(id, extraClass = '') {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `thread-fragment ${extraClass}`.trim();
  btn.setAttribute('aria-label', 'a loose thread end');
  btn.innerHTML = fragmentSvg();
  if (state.secretFragmentsFound.has(id)) btn.classList.add('thread-fragment--found');

  btn.addEventListener('click', () => {
    btn.classList.add('thread-fragment--found');
    const { justCompleted } = registerSecretTap(id);
    if (justCompleted) {
      thread.addMark('star');
      showReveal();
    }
  });

  return btn;
}

function showReveal() {
  const overlay = document.createElement('div');
  overlay.className = 'secret-overlay';
  overlay.innerHTML = `
    <div class="secret-card" role="dialog" aria-modal="true" aria-label="a secret">
      <div class="secret-warn">⚠ THREAD DETECTED ⚠</div>
      <div class="secret-lines">
        <p><b>SHINCHAN:</b> "Wait." "I found something."</p>
        <p><b>YOU:</b> "don't open that."</p>
        <p><b>SHINCHAN:</b> "..."</p>
      </div>
      <button class="btn btn--primary" data-open>[ OPEN ANYWAY ]</button>
      <div class="secret-final" hidden>
        <p class="secret-final__text">If you found this, you either pay way too much attention or you're just incredibly curious. Either way, here's one thing I didn't know where else to put: no matter how annoying you are, I hope you always know you've got me.</p>
        <button class="btn btn--ghost" data-close>okay, that's enough sincerity. go back.</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.querySelector('[data-open]').addEventListener('click', (e) => {
    e.currentTarget.hidden = true;
    overlay.querySelector('.secret-final').hidden = false;
  });
  overlay.querySelector('[data-close]').addEventListener('click', () => {
    markSecretRevealed();
    overlay.remove();
  });
}
