// The narrator engine: stages Shinchan as an active actor delivering a
// short beat script — enter/point/react/leave poses, one line on stage at a
// time with setup/reaction/punchline emphasis — instead of a static image
// sitting under a wall of text. Each screen builds its own stage (usually
// mounted inside its `.card`, which is already `position: relative`), then
// hands it a beat list; this module owns timing, positioning, and pose
// animation so every screen gets the same physical vocabulary.
import { doodleSvg, setFigureGif } from './doodle.js';
import { reducedMotion } from './utils.js';

const DEFAULT_PAUSE = 900;

/**
 * @typedef {object} Beat
 * @property {string} [gifKey] - sticker to swap in for this beat
 * @property {string} [pos] - position slot, e.g. 'bottom-left', 'top-right', 'center'
 * @property {string} [action] - transient pose: 'enter' | 'point' | 'lean' | 'react' | 'leave'
 * @property {string} [text] - the line to say (omit to stay silent this beat)
 * @property {'setup'|'reaction'|'punchline'|'aside'} [emphasis]
 * @property {number} [pause] - ms to hold before the next beat (skippable by tap)
 */

/**
 * @param {object} opts
 * @param {string} [opts.role] - for the sticker's alt text
 * @param {string} [opts.pos] - starting position slot
 */
export function createNarratorStage({ role = '', pos = 'bottom-left' } = {}) {
  const el = document.createElement('div');
  el.className = 'narrator-stage';
  el.dataset.pos = pos;
  el.innerHTML = `
    <div class="narrator-figure" aria-hidden="true">${doodleSvg()}</div>
    <div class="narrator-textbox">
      <p class="narrator-line narrator-line--history"></p>
      <p class="narrator-line narrator-line--current" hidden></p>
    </div>
  `;
  const figure = el.querySelector('.narrator-figure');
  const historyLine = el.querySelector('.narrator-line--history');
  const currentLine = el.querySelector('.narrator-line--current');

  el.setAttribute('role', 'button');
  el.setAttribute('aria-label', 'tap to advance');
  el.tabIndex = 0;

  let skip = null;
  const requestSkip = () => skip?.();
  el.addEventListener('click', requestSkip);
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      requestSkip();
    }
  });

  function wait(ms) {
    const t = reducedMotion() ? Math.min(ms, 180) : ms;
    return new Promise((resolve) => {
      const id = setTimeout(() => {
        skip = null;
        resolve();
      }, t);
      skip = () => {
        clearTimeout(id);
        skip = null;
        resolve();
      };
    });
  }

  function setPosition(next) {
    if (next) el.dataset.pos = next;
  }

  // 'enter' / 'point' / 'react' are one-shot beats that can legitimately
  // repeat back to back (Roast/Gifts/Quiz all call pose('react') on every
  // interaction) — a plain `data-pose` attribute wouldn't restart the CSS
  // animation when the value doesn't change, so these retrigger through a
  // class + forced reflow instead. 'idle' / 'leave' / 'lean' are held
  // states (a loop or a static end frame), so they stay attribute-driven
  // and pause automatically while a one-shot pose is playing, then resume.
  const RETRIGGER_POSES = ['enter', 'point', 'react'];
  let heldPose = null;

  function pose(name) {
    if (!name) return;
    if (RETRIGGER_POSES.includes(name)) {
      el.dataset.pose = '';
      if (reducedMotion()) {
        if (heldPose) el.dataset.pose = heldPose;
        return;
      }
      RETRIGGER_POSES.forEach((p) => figure.classList.remove(`pose-${p}`));
      // eslint-disable-next-line no-unused-expressions
      figure.offsetWidth; // force reflow so the animation restarts even on a repeat
      const cls = `pose-${name}`;
      figure.classList.add(cls);
      figure.addEventListener(
        'animationend',
        () => {
          figure.classList.remove(cls);
          if (heldPose) el.dataset.pose = heldPose;
        },
        { once: true }
      );
    } else {
      heldPose = name;
      figure.classList.remove(...RETRIGGER_POSES.map((p) => `pose-${p}`));
      el.dataset.pose = name;
    }
  }

  function setGif(key) {
    if (key) setFigureGif(figure, key, role);
  }

  function say(text, emphasis = 'setup') {
    if (!currentLine.hidden && currentLine.textContent) {
      historyLine.textContent = currentLine.textContent;
      historyLine.classList.add('narrator-line--settled');
    }
    if (!text) {
      currentLine.hidden = true;
      return;
    }
    currentLine.hidden = false;
    currentLine.textContent = text;
    currentLine.className = `narrator-line narrator-line--current narrator-line--${emphasis}`;
    if (!reducedMotion()) {
      currentLine.classList.remove('narrator-line--in');
      // eslint-disable-next-line no-unused-expressions
      currentLine.offsetWidth;
      currentLine.classList.add('narrator-line--in');
    } else {
      currentLine.classList.add('narrator-line--in');
    }
  }

  /**
   * Run a beat list in sequence. Never blocks the caller — this returns a
   * promise, but screens fire it and move on so their real interactive
   * elements (buttons, options, boxes) stay usable while it plays. Tapping
   * the stage skips the current beat's pause immediately.
   * @param {Beat[]} beats
   * @param {object} [opts]
   * @param {string|null} [opts.idlePose] - pose to settle into once done ('idle' by default)
   * @param {(beat: Beat, index: number) => void} [opts.onBeat] - fired right
   *   after a beat's pose/line/position land, before its pause — lets a
   *   screen sync its own DOM (e.g. revealing a prop) to the sequence.
   */
  async function play(beats, { idlePose = 'idle', onBeat } = {}) {
    for (let i = 0; i < beats.length; i++) {
      const beat = beats[i];
      setPosition(beat.pos);
      setGif(beat.gifKey);
      pose(beat.action);
      if ('text' in beat) say(beat.text, beat.emphasis);
      onBeat?.(beat, i);
      await wait(beat.pause ?? DEFAULT_PAUSE);
    }
    if (idlePose) pose(idlePose);
  }

  function leave(nextPos = 'offstage-right') {
    pose('leave');
    setPosition(nextPos);
  }

  return { el, figure, setPosition, pose, setGif, say, play, leave };
}
