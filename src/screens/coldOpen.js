import { createNarratorStage } from '../narrator.js';
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
    <div class="coldopen__narrator-slot"></div>
    <div class="coldopen__buttons">
      <button class="btn btn--primary coldopen__yes" data-primary-action>YES</button>
      <button class="btn btn--outline coldopen__no">NO</button>
    </div>
  `;
  stage.appendChild(card);

  const narrator = createNarratorStage({ role: 'gatekeeper', pos: 'top-right' });
  card.querySelector('.coldopen__narrator-slot').replaceWith(narrator.el);
  narrator.play([
    { gifKey: 'coldOpen', action: 'enter', text: 'He spent way too much time on this.', emphasis: 'aside', pause: 1100 },
  ]);

  const fragment = createFragment('coldOpen');
  fragment.style.cssText = 'position:absolute; right:22px; bottom:16px; z-index:1;';
  card.appendChild(fragment);

  const yesBtn = card.querySelector('.coldopen__yes');
  const noBtn = card.querySelector('.coldopen__no');
  const buttonsBox = card.querySelector('.coldopen__buttons');

  let dodgeCount = 0;

  function proceed() {
    api.next('knot');
  }

  function flee() {
    const bounds = buttonsBox.getBoundingClientRect();
    const noBounds = noBtn.getBoundingClientRect();
    const maxLeft = Math.max(0, bounds.width - noBounds.width);
    const maxTop = Math.max(0, bounds.height - noBounds.height);
    noBtn.style.left = `${Math.random() * maxLeft}px`;
    noBtn.style.top = `${Math.random() * maxTop}px`;
  }

  function onNoEnter() {
    if (dodgeCount >= 3) return;
    flee();
  }

  function onNoClick() {
    if (dodgeCount < 3) {
      narrator.pose('react');
      narrator.say(DODGE_LINES[dodgeCount], 'reaction');
      dodgeCount += 1;
      flee();
      return;
    }
    runFakeClose();
  }

  function runFakeClose() {
    yesBtn.remove();
    noBtn.remove();
    fragment.remove();
    narrator.leave();
    const closing = document.createElement('div');
    closing.className = 'coldopen__closing';
    closing.textContent = 'okay. closing the website.';
    buttonsBox.replaceWith(closing);

    t(() => {
      closing.textContent = 'just kidding.';
      narrator.setPosition('center');
      narrator.pose('enter');
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
