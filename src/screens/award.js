import { createFragment } from '../secret.js';

export function mount(stage, api) {
  const card = document.createElement('div');
  card.className = 'card award';
  card.innerHTML = `
    <div class="card__rule-lines"></div>
    <svg class="award__seal" viewBox="0 0 56 56">
      <circle cx="28" cy="28" r="25" fill="none" stroke="var(--maroon)" stroke-width="2.5"/>
      <circle cx="28" cy="28" r="19" fill="none" stroke="var(--crayon-yellow)" stroke-width="2" stroke-dasharray="3 4"/>
      <text x="28" y="32" text-anchor="middle" font-family="Permanent Marker, cursive" font-size="11" fill="var(--maroon)">★</text>
    </svg>
    <div class="kicker">Sibling Award</div>
    <div class="award__title">THE "YOU'RE STUCK WITH ME" AWARD</div>

    <div class="award__body">
      THIS CERTIFIES THAT
      <span class="award__name">Ananya Roy</span>
      HAS SUCCESSFULLY SURVIVED<br/>
      20 years of unsolicited opinions from me,<br/>
      countless arguments that were definitely my fault*,<br/>
      me stealing/borrowing things and returning them<br/>
      at an unspecified time.
      <div class="award__footnote">*the legal department disputes this claim.</div>
    </div>

    <div class="award__genuine">and, somehow, still being there when I needed you.</div>

    <div class="award__issuer">
      OFFICIALLY ISSUED BY<br/>
      THE MINISTRY OF DEALING WITH SUBHAM
    </div>
    <div class="award__sign-block">
      SIGNED:<br/>
      <span class="award__signature">Subham</span><br/>
      <span class="award__sign-role">Definitely Not Under Pressure</span>
    </div>

    <div class="continue-row">
      <button class="btn btn--primary" data-primary-action>Unfold complete</button>
    </div>
  `;
  stage.appendChild(card);

  const fragment = createFragment('award');
  fragment.style.cssText = 'position:absolute; right:8px; bottom:64px; z-index:1; opacity:.4;';
  card.querySelector('.award__sign-block').appendChild(fragment);

  card.querySelector('[data-primary-action]').addEventListener('click', () => api.next('stitch'));
}
