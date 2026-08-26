import { createNarrator } from '../doodle.js';

const LINES = [
  'okay...',
  'I was told to give this to someone.',
  'I forgot who.',
];
const NOTE = "HEY. IT'S FOR DIDDI. — SUBHAM";
const LINES_AFTER = ['oh. right.', 'this is going to be easy. probably.'];

export function mount(stage, api) {
  const card = document.createElement('div');
  card.className = 'card prelude';
  card.innerHTML = `
    <div class="card__rule-lines"></div>
    <div class="prelude__lines">
      ${LINES.map((l, i) => `<p class="prelude__line" style="--i:${i}">${l}</p>`).join('')}
    </div>
    <div class="prelude__note" style="--i:${LINES.length}">${NOTE}</div>
    <div class="prelude__lines prelude__lines--after">
      ${LINES_AFTER.map((l, i) => `<p class="prelude__line" style="--i:${LINES.length + 1 + i}">${l}</p>`).join('')}
    </div>
    <div class="continue-row">
      <button class="btn btn--outline" data-primary-action>Continue</button>
    </div>
  `;
  stage.appendChild(card);

  const narrator = createNarrator({
    emotion: 'confused',
    role: 'confused courier',
    side: 'left',
  });
  card.querySelector('.prelude__lines--after').after(narrator);

  card.querySelector('[data-primary-action]').addEventListener('click', () => api.next());
}
