// Low-level narrator assets: the hand-drawn doodle fallback SVG, and the
// sticker-swap primitive that drops a bundled Shinchan sticker (see
// narratorStickers.js / src/assets/stickers/README.md) into a figure
// element, falling back to the doodle for any beat without a sticker file
// yet. Consumed by narrator.js's staging/sequencing engine — screens should
// use `createNarratorStage` from there rather than these directly.
import { getStickerUrl } from './narratorStickers.js';

export function doodleSvg() {
  return `
    <svg viewBox="0 0 150 170" fill="none">
      <path d="M50,160 C44,124 38,110 56,98 C44,92 40,74 56,68" stroke="var(--ink)" stroke-width="3.5" stroke-linecap="round" fill="none" opacity=".85"/>
      <path d="M44,112 C18,100 12,80 27,66" stroke="var(--ink)" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      <path d="M96,110 C122,94 128,72 114,60" stroke="var(--ink)" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      <path d="M58,152 L48,170 M80,152 L94,170" stroke="var(--ink)" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="72" cy="56" r="34" stroke="var(--maroon)" stroke-width="4" fill="var(--paper)"/>
      <path d="M56,48 L64,52 M88,48 L80,52" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="72" cy="70" rx="9" ry="7" fill="var(--maroon)"/>
    </svg>
  `;
}

function isVideoUrl(url) {
  return /\.(webm|mp4)$/i.test(url);
}

/**
 * Swap the bundled sticker for the given beat key into `figureEl`, keeping
 * the doodle in place if no sticker file exists yet for that beat.
 * Reusable so screens like Roast can re-target the same figure per reveal.
 */
export function setFigureGif(figureEl, gifKey, role = '') {
  const url = getStickerUrl(gifKey);
  if (!url) {
    console.warn(
      `[stickers] no sticker file for beat "${gifKey}" yet — showing the doodle fallback. ` +
        `Drop one into src/assets/stickers/ named "${gifKey}.<ext>" (see that folder's README).`
    );
    return;
  }

  const alt = role ? `Shinchan — ${role}` : 'Shinchan reacting';
  let el;
  if (isVideoUrl(url)) {
    el = document.createElement('video');
    el.src = url;
    el.autoplay = true;
    el.loop = true;
    el.muted = true;
    el.playsInline = true;
    el.setAttribute('aria-label', alt);
  } else {
    el = document.createElement('img');
    el.src = url;
    el.alt = alt;
    el.loading = 'lazy';
  }
  el.className = 'narrator__sticker';
  figureEl.replaceChildren(el);
}
