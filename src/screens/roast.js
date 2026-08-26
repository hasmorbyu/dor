import { doodleSvg, setFigureEmotion } from '../doodle.js';
import { createFragment } from '../secret.js';

const REVEALS = [
  { label: 'Maa Ki Chugli Saheli', emotion: 'laughing mischievous', pos: [2, 4] },
  { label: 'NAP-pur ki Devi', emotion: 'sleepy exhausted', pos: [58, 0] },
  { label: 'Papa ki Pyaari Perfect Pari', emotion: 'smug proud', pos: [80, 24] },
  { label: 'Raat mei Laath maarke bistar se gira dene wali', emotion: 'mischievous', pos: [82, 58] },
  {
    label: 'BEST SCOOTY RIDER 🛵',
    emotion: 'impressed proud',
    pos: [28, 62],
    wide: true,
    poem: ['never taught me how to drive,', 'just gave me the best seat in the back.'],
  },
  { label: 'Best Chef', emotion: 'eating happy', pos: [2, 58] },
  { label: 'Annoying Hero', emotion: 'soft warm proud', pos: [2, 30] },
];

export function mount(stage, api) {
  const card = document.createElement('div');
  card.className = 'card roast';
  card.innerHTML = `
    <div class="card__rule-lines"></div>
    <div class="tape tape--right"></div>
    <div class="kicker">Case File #01</div>
    <h1 class="headline">Identifying the Subject</h1>
    <p class="sub">tap each label to pull the file.</p>
    <div class="roast__stage">
      <svg class="roast-arrow" width="70" height="50" viewBox="0 0 70 50" style="left:8%; top:46%;">
        <path d="M4,40 C20,10 50,10 60,20" stroke="var(--maroon)" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M52,12 L60,20 L50,24" stroke="var(--maroon)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <div class="center-char">
        <div class="narrator__figure">${doodleSvg()}</div>
      </div>
    </div>
    <div class="continue-row">
      <button class="btn btn--primary" data-primary-action disabled>Continue</button>
    </div>
  `;
  stage.appendChild(card);

  const stageEl = card.querySelector('.roast__stage');
  const figure = card.querySelector('.center-char .narrator__figure');
  const continueBtn = card.querySelector('[data-primary-action]');

  const arrow = card.querySelector('.roast-arrow');
  const fragment = createFragment('roast');
  fragment.style.cssText = 'position:absolute; left:44px; top:6px; z-index:1;';
  arrow.after(fragment);

  let revealedCount = 0;

  REVEALS.forEach((reveal, i) => {
    const sticker = document.createElement('button');
    sticker.type = 'button';
    sticker.className = `sticker${reveal.wide ? ' sticker--wide' : ''}`;
    sticker.style.left = `${reveal.pos[0]}%`;
    sticker.style.top = `${reveal.pos[1]}%`;
    sticker.innerHTML = `
      <span class="sticker__face">?</span>
      <span class="sticker__content">
        "${reveal.label}"
        ${reveal.poem ? `<div class="sticker__poem">${reveal.poem.join('<br/>')}</div>` : ''}
      </span>
    `;
    sticker.addEventListener('click', () => {
      if (sticker.classList.contains('sticker--revealed')) return;
      sticker.classList.add('sticker--revealed', 'thread-mark--pop');
      setFigureEmotion(figure, reveal.emotion, 'investigator');
      revealedCount += 1;
      if (revealedCount === REVEALS.length) continueBtn.disabled = false;
    });
    stageEl.appendChild(sticker);
  });

  continueBtn.addEventListener('click', () => api.next('loop'));
}
