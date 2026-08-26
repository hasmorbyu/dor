import { createNarrator } from '../doodle.js';
import { reducedMotion } from '../utils.js';

const LOREM = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.',
  'In voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
];

export function mount(stage, api) {
  const timers = [];
  const t = (fn, ms) => timers.push(setTimeout(fn, ms));

  const card = document.createElement('div');
  card.className = 'card rakhi-note';
  card.innerHTML = `
    <svg class="stitch-border" viewBox="0 0 1000 1000" preserveAspectRatio="none">
      <rect class="stitch-gold" x="1" y="1" width="998" height="998" rx="18"/>
      <rect class="stitch-red" x="1" y="1" width="998" height="998" rx="18"/>
    </svg>
    <div class="kicker">A Note</div>
    <div class="rakhi-note__narrator-slot"></div>
    <div class="letter-scroll">
      ${LOREM.map((p) => `<p>${p}</p>`).join('')}
    </div>
    <div class="rakhi-note__gate">
      <button class="btn btn--outline" data-primary-action disabled>continue when you're ready →</button>
    </div>
  `;
  stage.appendChild(card);

  const stitch = card.querySelector('.stitch-border');
  if (!reducedMotion()) {
    stitch.style.setProperty('--start-offset', '900');
    requestAnimationFrame(() => stitch.classList.add('stitch-border--animate'));
  }

  const narratorSlot = card.querySelector('.rakhi-note__narrator-slot');
  const narrator = createNarrator({
    emotion: 'quiet soft',
    role: 'steps away',
    lines: ["Okay. This one's yours."],
    wobble: false,
  });
  narratorSlot.replaceWith(narrator);

  t(() => {
    narrator.style.transition = 'opacity 500ms ease';
    narrator.style.opacity = '0';
    t(() => narrator.remove(), 520);
  }, 1800);

  const gateBtn = card.querySelector('[data-primary-action]');
  const scrollEl = card.querySelector('.letter-scroll');

  let ready = false;
  function becomeReady() {
    if (ready) return;
    ready = true;
    gateBtn.disabled = false;
    gateBtn.classList.add('btn--ready');
  }

  t(becomeReady, 6000);

  function onScroll() {
    const { scrollTop, scrollHeight, clientHeight } = scrollEl;
    if (scrollHeight - clientHeight <= 4 || scrollTop + clientHeight >= scrollHeight - 8) {
      becomeReady();
    }
  }
  scrollEl.addEventListener('scroll', onScroll);
  onScroll();

  gateBtn.addEventListener('click', () => api.next());

  return () => {
    timers.forEach(clearTimeout);
    scrollEl.removeEventListener('scroll', onScroll);
  };
}
