import { state } from '../state.js';
import { thread } from '../thread.js';

const CLOSING = `we'll probably keep fighting.
you'll probably keep annoying me.
and I'll probably keep annoying you back.

but no matter what changes,
you'll always be my sister.
and I'll always be here.

Happy Raksha Bandhan, Diddi. ❤️`;

export function mount(stage, api) {
  const wrap = document.createElement('div');
  wrap.className = 'finale';
  wrap.innerHTML = `
    <p class="finale__text">${CLOSING}</p>
    <p class="finale__shinchan">Shinchan: "Okay. That's enough emotions for today."</p>
    ${state.secretRevealed ? '<p class="finale__secret">You found the secret too? Show-off.</p>' : ''}
    <div class="continue-row">
      <button class="btn btn--outline" data-primary-action>[ replay the nonsense ↻ ]</button>
    </div>
  `;
  stage.appendChild(wrap);

  thread.morphToBow({
    onDone: () => wrap.classList.add('finale--visible'),
  });

  wrap.querySelector('[data-primary-action]').addEventListener('click', () => api.replay());
}
