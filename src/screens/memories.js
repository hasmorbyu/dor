import { createFragment } from '../secret.js';
import { createNarratorStage } from '../narrator.js';
import { state } from '../state.js';

const FOLDERS = [
  {
    id: 'file01',
    title: 'FILE 01\nEMBARRASSING\nEVIDENCE',
    photos: [
      { photo: '[PHOTO_01]', caption: '[CAPTION_01]' },
      { photo: '[PHOTO_02]', caption: '[CAPTION_02]' },
    ],
  },
  {
    id: 'file02',
    title: 'FILE 02\nTHE OLD DAYS',
    photos: [
      { photo: '[PHOTO_03]', caption: '[CAPTION_03]' },
      { photo: '[PHOTO_04]', caption: '[CAPTION_04]' },
      { photo: '[PHOTO_05]', caption: '[CAPTION_05]' },
    ],
  },
  {
    id: 'file03',
    title: 'FILE 03\nSLIGHTLY TOO\nWHOLESOME',
    photos: [
      { photo: '[PHOTO_06]', caption: '[CAPTION_06]' },
      { photo: '[PHOTO_07]', caption: '[CAPTION_07]' },
    ],
  },
];

export function mount(stage, api) {
  const card = document.createElement('div');
  card.className = 'card memories';
  card.innerHTML = `
    <div class="card__rule-lines"></div>
    <div class="tape tape--left"></div>
    <div class="kicker">The Sibling Archives</div>
    <h1 class="headline">classified evidence</h1>
    <div class="memories__narrator-slot"></div>
    <div class="memories__folders"></div>
    <div class="memories__viewer" hidden></div>
    <div class="continue-row">
      <button class="btn btn--primary" data-primary-action disabled>Continue</button>
    </div>
  `;
  stage.appendChild(card);

  const narrator = createNarratorStage({ role: 'archivist', pos: 'top-left' });
  card.querySelector('.memories__narrator-slot').replaceWith(narrator.el);
  narrator.play([{ gifKey: 'memories', action: 'enter', pause: 400 }]);

  const foldersEl = card.querySelector('.memories__folders');
  const viewer = card.querySelector('.memories__viewer');
  const continueBtn = card.querySelector('[data-primary-action]');

  let openId = null;
  let photoIndex = 0;

  function updateContinue() {
    if (FOLDERS.every((f) => state.memoriesOpened.has(f.id))) continueBtn.disabled = false;
  }

  function renderViewer() {
    if (!openId) {
      viewer.hidden = true;
      viewer.innerHTML = '';
      return;
    }
    const folder = FOLDERS.find((f) => f.id === openId);
    const photo = folder.photos[photoIndex];
    viewer.hidden = false;
    viewer.innerHTML = `
      <div class="polaroid">
        <div class="polaroid__frame">${photo.photo}</div>
        <div class="polaroid__caption">${photo.caption}</div>
      </div>
      <div class="memories__nav">
        <button class="btn btn--ghost" data-prev ${photoIndex === 0 ? 'disabled' : ''}>← prev</button>
        <button class="btn btn--ghost" data-close>close folder</button>
        <button class="btn btn--ghost" data-next ${photoIndex === folder.photos.length - 1 ? 'disabled' : ''}>next →</button>
      </div>
      <div class="memories__count">${photoIndex + 1} / ${folder.photos.length}</div>
    `;
    viewer.querySelector('[data-prev]').addEventListener('click', () => {
      photoIndex = Math.max(0, photoIndex - 1);
      renderViewer();
    });
    viewer.querySelector('[data-next]').addEventListener('click', () => {
      photoIndex = Math.min(folder.photos.length - 1, photoIndex + 1);
      renderViewer();
    });
    viewer.querySelector('[data-close]').addEventListener('click', () => {
      openId = null;
      narrator.setPosition('top-left');
      narrator.pose('idle');
      renderFolders();
      renderViewer();
    });

    if (openId === 'file02') {
      const fragment = createFragment('memories');
      fragment.style.cssText = 'position:absolute; bottom:28px; left:calc(50% - 118px); opacity:.4;';
      viewer.querySelector('.polaroid').appendChild(fragment);
    }
  }

  function renderFolders() {
    foldersEl.innerHTML = '';
    FOLDERS.forEach((folder) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `folder${openId === folder.id ? ' folder--open' : ''}`;
      btn.innerHTML = folder.title.split('\n').join('<br/>');
      btn.addEventListener('click', () => {
        state.memoriesOpened.add(folder.id);
        updateContinue();
        if (openId === folder.id) {
          openId = null;
          narrator.setPosition('top-left');
        } else {
          openId = folder.id;
          photoIndex = 0;
          const idx = FOLDERS.findIndex((f) => f.id === folder.id);
          narrator.setPosition(idx % 2 === 0 ? 'top-right' : 'top-left');
          narrator.pose('point');
        }
        renderFolders();
        renderViewer();
      });
      foldersEl.appendChild(btn);
    });
  }

  renderFolders();
  continueBtn.addEventListener('click', () => api.next('bead'));
}
