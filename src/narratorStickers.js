// Local Shinchan sticker assets, one bundled file per narrator beat, dropped
// by hand into src/assets/stickers/ (see that folder's README for the naming
// convention and the full list of beat keys). Vite bundles whatever's there
// at build time — no network fetch, no Giphy — so the narrator renders
// instantly, at full size, with no "embedded clip" chrome around it.
const files = import.meta.glob('./assets/stickers/*.{webp,gif,png,apng,webm,mp4,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const STICKERS = {};
for (const [path, url] of Object.entries(files)) {
  const base = path.split('/').pop().replace(/\.[^.]+$/, '');
  // Filenames may carry a human-readable " - emotion note" suffix for the
  // folder to self-document (see the placeholder files) — only the part
  // before that separator has to match a beat key. If that note ends in a
  // number (e.g. "quiz - droopy judge energy 2"), it's a second variant of
  // the same beat — folded into the key as "quiz-2" so a screen that wants
  // more than one reaction per beat (Quiz, one per round) can ask for it
  // directly, instead of colliding with the unnumbered ("quiz") variant.
  const [prefix, note = ''] = base.split(' - ');
  const key = prefix.trim();
  const variant = note.trim().match(/(\d+)$/);
  STICKERS[variant ? `${key}-${variant[1]}` : key] = url;
}

/**
 * @param {string} key - a narrator beat id, e.g. 'coldOpen' or 'roast-chef'
 * @returns {string | null} the bundled sticker URL, or null if none exists yet
 */
export function getStickerUrl(key) {
  return STICKERS[key] ?? null;
}
