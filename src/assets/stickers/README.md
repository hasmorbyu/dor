# Narrator stickers

This folder already has one placeholder `.svg` per narrator beat, each
labeled with its beat key, its screen, and the emotion it's meant to carry —
open any of them to see the shape. **Replace each placeholder with a real
sticker** and the site picks it up automatically, no code changes needed.

## Naming

`narratorStickers.js` globs this folder at build time and reads the key as
everything in the filename *before* the first ` - `, so the emotion note is
optional and purely for your own reference — only the prefix has to match a
beat key from the table below. Both of these resolve to `coldOpen`:

```
coldOpen.webm
coldOpen - cheeky mischievous grin.webm
```

The simplest workflow: keep each placeholder's filename as-is and just
overwrite its *contents* with your real sticker, changing only the
extension (e.g. rename `coldOpen - cheeky mischievous grin.svg` to
`coldOpen - cheeky mischievous grin.webm` once you drop the real file in).
Renaming away the emotion suffix entirely also works fine — only the prefix
before ` - ` matters.

### Multiple reactions for one beat

A screen that wants more than one sticker for the same beat can number the
emotion note per variant, e.g. Quiz has one file per round:

```
quiz - droopy deadpan judge energy 1.gif   -> key "quiz-1"
quiz - droopy deadpan judge energy 2.gif   -> key "quiz-2"
quiz - droopy deadpan judge energy 3.gif   -> key "quiz-3"
```

The screen's code asks for each by name via `setFigureGif` (or `gifKey` on
`createNarrator` for the first one shown). A file with no trailing number
resolves to the plain, unsuffixed key, as with every other beat.

## Supported formats

- **Animated, preferred:** `.webm`, `.mp4` (rendered as an autoplay/loop/muted
  `<video>`) — this is what "motionised" stickers usually come as (Telegram/
  WhatsApp sticker exports).
- **Also fine:** `.gif`, `.webp`, `.png`, `.apng`, `.svg` (rendered as an `<img>`).

Note: alpha-channel (transparent-background) `.webm` is not universally
supported across browsers (Safari in particular does not render webm alpha),
so a sticker with visible background may look better as `.gif`/`.webp` if
transparency matters more than a perfect loop.

## Beat keys

One file per key below. Any key left unfilled falls back to the hand-drawn
doodle placeholder — the site stays fully functional either way, this is
purely additive.

| key | used on | emotional fit |
|---|---|---|
| `prelude` | Prelude | deadpan, "I forgot who" |
| `coldOpen` | Cold Open | cheeky, mischievous grin |
| `roast-chugli` | Roast | big laughing blush |
| `roast-nappur` | Roast | droopy, worn out |
| `roast-pari` | Roast | proud family group shot |
| `roast-laath` | Roast | frustrated fist-up |
| `roast-scooty` | Roast | wide-eyed, impressed |
| `roast-chef` | Roast | "food is food, let's eat" |
| `roast-hero` | Roast | warm, tender hug |
| `memories` | Memories | proud/nostalgic |
| `award` | Award | big laughing blush, ceremony energy |
| `rakhiNote` | Rakhi Note | quiet, subdued (opening beat only) |
| `gifts` | Gifts | happy dance, chaos energy |
| `quiz` | Quiz | droopy/deadpan, judge energy |
| `secret` | Secret reveal | wide-eyed, shocked |
| `finale` | Finale | happy dance, warm and playful |
