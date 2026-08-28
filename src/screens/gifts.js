import { createFragment } from '../secret.js';
import { createNarrator } from '../doodle.js';
import { state } from '../state.js';

const BOXES = [
  {
    id: 'joke',
    label: 'Box 1',
    html: `
      <h3>ONE OFFICIAL APOLOGY COUPON</h3>
      <p>Valid for one (1) argument.</p>
      <p>I will:<br/>☐ admit I was wrong<br/>☐ say sorry first</p>
      <p class="fine-print">Terms and conditions: absolutely no guarantee this will happen.</p>
    `,
  },
  {
    id: 'memory',
    label: 'Box 2',
    html: `
      <h3>REMEMBER WHEN...</h3>
      <p>[A SHORT MEMORY THAT ONLY THE TWO OF YOU WOULD UNDERSTAND]</p>
      <p>I still can't believe we survived that.</p>
    `,
  },
  {
    id: 'real',
    label: 'Box 3',
    html: `
      <h3>YOUR ACTUAL GIFT IS WAITING.</h3>
      <p>CLUE #01:<br/>Go to the place where [PERSONAL CLUE].</p>
      <p class="fine-print">And no, I'm not helping you more than that.</p>
    `,
  },
];

export function mount(stage, api) {
  const card = document.createElement('div');
  card.className = 'card gifts';
  card.innerHTML = `
    <div class="card__rule-lines"></div>
    <div class="tape tape--left"></div>
    <div class="kicker">Gifts</div>
    <h1 class="headline">unwrap.</h1>
    <p class="sub">drag the ribbon — or just tap the box.</p>
    <div class="gifts__narrator-slot"></div>
    <div class="gifts__grid"></div>
    <div class="gift-reveal" hidden></div>
    <div class="continue-row">
      <button class="btn btn--primary" data-primary-action disabled>Continue</button>
    </div>
  `;
  stage.appendChild(card);

  const narrator = createNarrator({ gifKey: 'gifts', role: 'chaos agent', side: 'right' });
  card.querySelector('.gifts__narrator-slot').replaceWith(narrator);

  const grid = card.querySelector('.gifts__grid');
  const revealPanel = card.querySelector('.gift-reveal');
  const continueBtn = card.querySelector('[data-primary-action]');

  function showReveal(box) {
    revealPanel.hidden = false;
    revealPanel.innerHTML = box.html;
  }

  function unwrap(box, boxEl) {
    if (!boxEl.classList.contains('gift-box--open')) {
      boxEl.classList.add('gift-box--open');
      state.giftsUnwrapped.add(box.id);
      if (state.giftsUnwrapped.size === BOXES.length) continueBtn.disabled = false;
    }
    showReveal(box);
  }

  BOXES.forEach((box) => {
    const boxEl = document.createElement('button');
    boxEl.type = 'button';
    boxEl.className = 'gift-box';
    const opened = state.giftsUnwrapped.has(box.id);
    if (opened) boxEl.classList.add('gift-box--open');
    boxEl.innerHTML = `
      <div class="gift-box__ribbon-v"></div>
      <div class="gift-box__ribbon-h" data-ribbon></div>
      <svg class="gift-box__bow" viewBox="0 0 46 30" fill="none">
        <path d="M23,15 C23,15 8,4 4,10 C0,17 14,18 23,15 C32,18 46,17 42,10 C38,4 23,15 23,15 Z" fill="var(--crayon-red)" stroke="var(--maroon)" stroke-width="1.4"/>
      </svg>
      <span class="gift-box__label">${box.label}</span>
    `;
    boxEl.addEventListener('click', () => unwrap(box, boxEl));

    const ribbon = boxEl.querySelector('[data-ribbon]');
    let dragStartX = null;
    let dragStartY = null;
    ribbon.addEventListener('pointerdown', (e) => {
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      ribbon.setPointerCapture(e.pointerId);
    });
    ribbon.addEventListener('pointermove', (e) => {
      if (dragStartX == null) return;
      const dist = Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY);
      if (dist > 30) {
        dragStartX = null;
        unwrap(box, boxEl);
      }
    });
    ribbon.addEventListener('pointerup', () => {
      dragStartX = null;
    });

    grid.appendChild(boxEl);
  });

  const fragment = createFragment('gifts');
  fragment.style.cssText = 'position:absolute; left:14px; bottom:14px; z-index:1;';
  card.appendChild(fragment);

  if (state.giftsUnwrapped.size === BOXES.length) continueBtn.disabled = false;

  continueBtn.addEventListener('click', () => api.next('charm'));
}
