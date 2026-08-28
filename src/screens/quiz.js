import { createNarratorStage } from '../narrator.js';

const QUESTIONS = [
  {
    id: 'q1',
    prompt: 'Who starts most of our arguments?',
    options: ['You', 'Me'],
    react: () => 'Evidence suggests: both of you.',
  },
  {
    id: 'q2',
    prompt: 'Who will be driving the scooty?',
    options: ['Me', 'You'],
    react: (choice) => (choice === 'Me' ? 'Obviously.' : 'Nice try. You literally gave him the back seat.'),
  },
  {
    id: 'q3',
    prompt: "Who is mom's favourite?",
    options: ['Me', 'You'],
    react: () => 'Congratulations. You have both lost.',
  },
];

export function mount(stage, api) {
  const card = document.createElement('div');
  card.className = 'card quiz';
  card.innerHTML = `
    <div class="card__rule-lines"></div>
    <div class="tape tape--right"></div>
    <div class="kicker">Quiz</div>
    <h1 class="headline">final interrogation.</h1>
    <div class="quiz__narrator-slot"></div>
    <div class="quiz__questions"></div>
    <div class="report-card-slot"></div>
    <div class="continue-row"></div>
  `;
  stage.appendChild(card);

  const narrator = createNarratorStage({ role: 'judge', pos: 'top-right' });
  card.querySelector('.quiz__narrator-slot').replaceWith(narrator.el);
  narrator.play([{ gifKey: 'quiz-1', action: 'enter', pause: 400 }]);

  const questionsEl = card.querySelector('.quiz__questions');
  const reportSlot = card.querySelector('.report-card-slot');
  const answers = {};

  QUESTIONS.forEach((q, i) => {
    const qEl = document.createElement('div');
    qEl.className = 'quiz__q';
    qEl.innerHTML = `
      <p class="quiz__prompt">${q.prompt}</p>
      <div class="quiz__options"></div>
      <p class="quiz__reaction" hidden></p>
    `;
    const optionsEl = qEl.querySelector('.quiz__options');
    const reactionEl = qEl.querySelector('.quiz__reaction');

    q.options.forEach((label) => {
      const opt = document.createElement('button');
      opt.type = 'button';
      opt.className = 'quiz__option';
      opt.textContent = label;
      opt.addEventListener('click', () => {
        if (answers[q.id]) return;
        answers[q.id] = label;
        [...optionsEl.children].forEach((b) => (b.disabled = true));
        opt.classList.add('quiz__option--picked');
        reactionEl.textContent = q.react(label);
        reactionEl.hidden = false;
        narrator.setGif(`quiz-${i + 1}`);
        narrator.pose('react');
        narrator.setPosition(['top-left', 'top-right', 'center'][i] ?? 'top-right');
        maybeShowReport();
      });
      optionsEl.appendChild(opt);
    });

    questionsEl.appendChild(qEl);
  });

  function maybeShowReport() {
    if (Object.keys(answers).length < QUESTIONS.length) return;
    reportSlot.innerHTML = `
      <div class="report-card">
        <h3>Shinchan's Final Report</h3>
        <dl>
          <dt>ARGUMENT EXPERTISE</dt><dd>confirmed</dd>
          <dt>SCOOTY KNOWLEDGE</dt><dd>questionable</dd>
          <dt>MOM'S FAVOURITE</dt><dd>classified</dd>
        </dl>
        <div class="report-card__verdict">FINAL VERDICT:<br/>definitely siblings.<br/>unfortunately.</div>
      </div>
    `;
    const row = card.querySelector('.continue-row');
    row.innerHTML = `<button class="btn btn--primary" data-primary-action>Continue</button>`;
    row.querySelector('button').addEventListener('click', () => api.next('finalKnot'));
  }
}
