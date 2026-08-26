import './style.css';
import { thread } from './thread.js';
import { state, currentScreenId, goToIndex, resetForReplay, SCREEN_ORDER } from './state.js';
import { reducedMotion } from './utils.js';
import { screens } from './screens/index.js';

const stage = document.getElementById('stage');
const threadRoot = document.getElementById('thread-root');
thread.mount(threadRoot);

let cleanup = null;

export const api = {
  next(markId) {
    if (markId && !thread.hasMark(markId)) thread.addMark(markId);
    goToIndex(state.screenIndex + 1);
    render();
  },
  prev() {
    goToIndex(state.screenIndex - 1);
    render();
  },
  goTo(id) {
    const i = SCREEN_ORDER.indexOf(id);
    if (i >= 0) {
      goToIndex(i);
      render();
    }
  },
  replay() {
    resetForReplay();
    thread.reset();
    render({ transition: false });
  },
  thread,
};

function render({ transition = true } = {}) {
  const id = currentScreenId();
  const mod = screens[id];

  const doRender = () => {
    if (cleanup) {
      cleanup();
      cleanup = null;
    }
    stage.innerHTML = '';
    stage.dataset.screen = id;
    const result = mod.mount(stage, api);
    cleanup = typeof result === 'function' ? result : null;
  };

  if (transition && !reducedMotion() && stage.children.length) {
    stage.classList.add('stage--exit');
    window.setTimeout(() => {
      stage.classList.remove('stage--exit');
      doRender();
      stage.classList.add('stage--enter');
      requestAnimationFrame(() => {
        stage.classList.add('stage--enter-active');
      });
      window.setTimeout(() => {
        stage.classList.remove('stage--enter', 'stage--enter-active');
      }, 320);
    }, 180);
  } else {
    doRender();
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'Enter') {
    const btn = stage.querySelector('[data-primary-action]:not([disabled])');
    if (btn && document.activeElement !== btn) btn.click();
  } else if (e.key === 'ArrowLeft') {
    if (state.screenIndex > 0) api.prev();
  }
});

render({ transition: false });
