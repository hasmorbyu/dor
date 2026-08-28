// The narrator: a Shinchan reaction, sourced live from Giphy via a curated
// per-beat GIF id (see narratorGifs.js) with a hand-drawn doodle fallback
// when there's no API key yet or the request fails. Framed to overlap the
// card edge like a character standing on the page, never a boxed-in avatar.
import { fetchNarratorGif } from './giphy.js';

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

/**
 * @param {object} opts
 * @param {string} opts.gifKey - key into narratorGifs.js's CURATED_GIFS
 * @param {string[]} [opts.lines] - 1-2 short narration beats, max
 * @param {string} [opts.role] - narrator role, for the image alt text
 * @param {'left'|'right'} [opts.side] - which edge the figure overlaps
 * @param {boolean} [opts.wobble] - allow the one-idle-wobble-per-screen loop
 */
export function createNarrator({ gifKey, lines = [], role = '', side = 'left', wobble = true }) {
  const wrap = document.createElement('div');
  wrap.className = `narrator narrator--${side}`;

  const figure = document.createElement('div');
  figure.className = `narrator__figure${wobble ? ' narrator__figure--wobble' : ''}`;
  figure.setAttribute('aria-hidden', 'true');
  figure.innerHTML = doodleSvg();
  wrap.appendChild(figure);

  if (lines.length) {
    const bubble = document.createElement('div');
    bubble.className = 'narrator__bubble';
    lines.slice(0, 2).forEach((line, i) => {
      const p = document.createElement('p');
      p.style.setProperty('--i', i);
      p.textContent = line;
      bubble.appendChild(p);
    });
    wrap.appendChild(bubble);
  }

  setFigureGif(figure, gifKey, role);

  return wrap;
}

/**
 * Fetch the curated GIF for the given beat key and swap it into `figureEl`,
 * keeping the doodle in place until (and unless) a real GIF resolves.
 * Reusable so screens like Roast can re-target the same figure per reveal.
 */
export function setFigureGif(figureEl, gifKey, role = '') {
  fetchNarratorGif(gifKey).then((gif) => {
    if (!gif) return;
    const img = document.createElement('img');
    img.src = gif.url;
    img.alt = role ? `Shinchan — ${role}` : 'Shinchan reacting';
    img.className = 'narrator__gif';
    img.loading = 'lazy';
    figureEl.replaceChildren(img);
  });
}
