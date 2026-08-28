import { createNarratorStage } from '../narrator.js';

const NOTE = "HEY. IT'S FOR DIDDI. — SUBHAM";

const BEATS = [
  { gifKey: 'prelude', pos: 'bottom-left', action: 'enter', text: 'okay...', emphasis: 'setup', pause: 900 },
  { text: 'I was told to give this to someone.', emphasis: 'setup', pause: 1100 },
  { text: 'I forgot who.', emphasis: 'reaction', pause: 700 },
  { pos: 'top-right', action: 'point', pause: 900, reveal: true },
  { text: 'oh. right.', emphasis: 'reaction', pause: 900 },
  { pos: 'bottom-left', action: 'react', text: 'this is going to be easy. probably.', emphasis: 'punchline', pause: 900 },
];

export function mount(stage, api) {
  const card = document.createElement('div');
  card.className = 'card prelude';
  card.innerHTML = `
    <div class="card__rule-lines"></div>
    <div class="prelude__note" hidden>${NOTE}</div>
    <div class="prelude__narrator-slot"></div>
    <div class="continue-row">
      <button class="btn btn--outline" data-primary-action>Continue</button>
    </div>
  `;
  stage.appendChild(card);

  const note = card.querySelector('.prelude__note');
  const narrator = createNarratorStage({ role: 'confused courier' });
  card.querySelector('.prelude__narrator-slot').replaceWith(narrator.el);

  narrator.play(BEATS, {
    onBeat(beat) {
      if (beat.reveal) {
        note.hidden = false;
        note.classList.add('prelude__note--reveal');
      }
    },
  });

  card.querySelector('[data-primary-action]').addEventListener('click', () => api.next());
}
