import { createNarrator } from '../doodle.js';
import { createFragment } from '../secret.js';
import { thread } from '../thread.js';

const DODGE_LINES = [
  'wrong button.',
  'you really want to leave already?',
  "I haven't even started roasting you.",
];

export function mount(stage, api) {
  const timers = [];
  const t = (fn, ms) => timers.push(setTimeout(fn, ms));

  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="card__rule-lines"></div>
    <div class="tape tape--left"></div>
    <div class="kicker">Cold Open</div>
    <h1 class="headline">DIDDI DETECTED.</h1>
    <div class="coldopen__brief">MISSION: show you something<br/>DIFFICULTY: apparently high</div>
    <div class="coldopen-narrator-slot"></div>
    <div class="coldopen__buttons">
      <span class="dodge-caption"></span>
      <button class="btn btn--primary coldopen__yes" data-primary-action>YES</button>
      <button class="btn btn--outline coldopen__no">NO</button>
    </div>
  `;
  stage.appendChild(card);

  const narrator = createNarrator({
    gifKey: 'coldOpen',
    role: 'gatekeeper',
    lines: ['He spent way too much time on this.'],
  });
  card.querySelector('.coldopen-narrator-slot').replaceWith(narrator);

  const fragment = createFragment('coldOpen');
  fragment.style.cssText = 'position:absolute; right:22px; bottom:16px; z-index:1;';
  card.appendChild(fragment);

  const yesBtn = card.querySelector('.coldopen__yes');
  const noBtn = card.querySelector('.coldopen__no');
  const buttonsBox = card.querySelector('.coldopen__buttons');
  const caption = card.querySelector('.dodge-caption');

  let dodgeCount = 0;

  function proceed() {
    api.next('knot');
  }

  function flee() {
    const bounds = buttonsBox.getBoundingClientRect();
    const noBounds = noBtn.getBoundingClientRect();
    const maxLeft = Math.max(0, bounds.width - noBounds.width);
    const maxTop = Math.max(0, bounds.height - noBounds.height);
    const left = Math.random() * maxLeft;
    const top = Math.random() * maxTop;
    noBtn.style.left = `${left}px`;
    noBtn.style.top = `${top}px`;
    caption.style.left = `${Math.min(left, maxLeft - 20)}px`;
  }

  function onNoEnter() {
    if (dodgeCount >= 3) return;
    flee();
  }

  function onNoClick() {
    if (dodgeCount < 3) {
      dodgeCount += 1;
      caption.textContent = DODGE_LINES[dodgeCount - 1];
      caption.classList.add('dodge-caption--show');
      flee();
      return;
    }
    runFakeClose();
  }

  function runFakeClose() {
    yesBtn.remove();
    noBtn.remove();
    caption.remove();
    fragment.remove();
    const closing = document.createElement('div');
    closing.className = 'coldopen__closing';
    closing.textContent = 'okay. closing the website.';
    buttonsBox.replaceWith(closing);

    t(() => {
      closing.textContent = 'just kidding.';
    }, 2000);

    t(() => {
      thread.shell?.classList.add('thread-shell--pulse');
      const btnRow = document.createElement('div');
      btnRow.className = 'continue-row';
      btnRow.innerHTML = `<button class="btn btn--primary" data-primary-action>[ fine, show me ]</button>`;
      closing.after(btnRow);
      btnRow.querySelector('button').addEventListener('click', proceed);
    }, 2900);
  }

  yesBtn.addEventListener('click', proceed);
  noBtn.addEventListener('pointerenter', onNoEnter);
  noBtn.addEventListener('click', onNoClick);

  return () => timers.forEach(clearTimeout);
}
