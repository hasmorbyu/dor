// Hand-picked Giphy GIF ids, one per narrator beat. Reviewed for tone
// against Part 2's role/emotion table — see the note in giphy.js for why
// these are pinned by id instead of live-searched per screen.
//
// key                 -> giphy id   (what's actually in the clip)
export const CURATED_GIFS = {
  prelude: 'FoCmkVg8X4ZuJi14ae', // deadpan, out of place in a crowd — "I forgot who"
  coldOpen: 'l4EpjuaFkL8Z8CScg', // cheeky, mischievous grin
  'roast-chugli': 'S6rXCwPhiN1edHbFLp', // big laughing blush
  'roast-nappur': 'l4EoOvde5SmpthZL2', // droopy, worn out
  'roast-pari': 'ovRNg6o9XohAX9ceXE', // proud family group shot
  'roast-laath': 'Ywj2iCO1TOkyQ', // frustrated fist-up
  'roast-scooty': '26FfanWpoZKKf4efm', // wide-eyed, impressed
  'roast-chef': '3ov9k2PgNjBSAb29bi', // "food is food, let's eat"
  'roast-hero': '26Ff9rUlpfr78QySA', // warm, tender hug
  memories: 'ovRNg6o9XohAX9ceXE', // proud family group shot — reused, fits archives
  award: 'S6rXCwPhiN1edHbFLp', // big laughing blush — reused, ceremony energy
  rakhiNote: 'qtu45GLo1qxhDjvu6N', // quiet, subdued — the opening beat only
  gifts: 'UQA6mbhNOl8sVQQzLI', // happy dance, chaos energy
  quiz: 'l4EoOvde5SmpthZL2', // droopy/deadpan — reused, judge energy
  secret: '26FfanWpoZKKf4efm', // wide-eyed, shocked — reused
  finale: 'UQA6mbhNOl8sVQQzLI', // happy dance — reused, warm and playful
};
