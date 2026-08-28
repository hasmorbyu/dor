# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

The site is built: a Vite + vanilla JS single-page app implementing all 9 screens plus the secret layer, against **Direction C (Crayon Box)** from Part 1. [Dor Masterplan Part 1.md](Dor%20Masterplan%20Part%201.md) is the design system; [dor-masterplan-part2-content-and-build.md](dor-masterplan-part2-content-and-build.md) is the real copy, per-screen behavior spec, and build sequence — both are the source of truth for anything not obvious from the code itself.

## Commands

- `npm install` — install dependencies (just Vite).
- `npm run dev` — start the dev server (default port 5173).
- `npm run build` — production build to `dist/`.
- `npm run preview` — serve the production build locally.
- No test suite or linter is configured.

### Narrator sticker assets
The narrator is no longer Giphy-sourced. `src/narratorStickers.js` globs `src/assets/stickers/` at build time and keys each bundled file by its filename (without extension) against the beat keys documented in that folder's README. Drop a real Shinchan sticker file (`.webm`/`.mp4` for animated, `.gif`/`.webp`/`.png`/`.apng` otherwise) named for a beat — e.g. `coldOpen.webm` — and it renders immediately at full size, no network fetch involved. Any beat without a matching file falls back to the hand-drawn doodle in `src/doodle.js`; this is expected, not an error. Because these are real copyrighted Shinchan art files bundled into the repo (a deliberate reversal of this project's earlier live-fetch-only approach), they should be sourced/supplied by the user, not invented or fetched by Claude.

## What "Dor" is

Dor is a single-page, narrative Rakhi (sibling festival) web experience built as a sequence of distinct "screens" the visitor moves through, narrated throughout by large, animated Shinchan stickers. The whole site is meant to read as **one physical handmade object** (torn notebook paper, marker ink, washi tape, a literal thread), not a conventional UI with decorative skin on top.

The core visual motif is **the Dor** — a twisted red-and-gold cord rendered as a single continuous SVG path that is present on every screen and has three states:
1. **Loose** — incomplete/tangled, present from the Prelude.
2. **Collecting** — gains a distinct mark (knot, stitched loop, bead, stitched red section, charm, hidden star, etc.) at each story milestone.
3. **Understood** — at the finale, all marks pull together and the same path visibly reassembles into a bow (must be an animation of the tracked path itself, never a swapped-in static bow asset).

[Dor Masterplan Part 1.md](Dor%20Masterplan%20Part%201.md) is Part 1 of the plan: pure design system (materials, color, type, layout, motion) with **no personal copy, names, or final content** — that content lives in a not-yet-written Part 2. Do not invent or fill in personal/final copy when implementing screens from Part 1 alone; treat placeholder/structural content as structural only.

## Design system (from the masterplan)

### Three competing color/material directions
The masterplan defines three full palettes — **A: Festival Warm** (marigold/maroon), **B: Notebook Faded** (cooler, faded-photo, blue secondary), **C: Crayon Box** (louder, higher saturation) — as CSS custom properties (`--paper`, `--ink`, `--maroon`, etc.). **C is the one built** (tokens live in `:root` at the top of `src/style.css`). If asked to switch directions, swap that token block for A's or B's values from Part 1 §3 rather than introducing a theme-switcher — nothing in the build was designed to run more than one palette at once.

### Typography rule
- Headlines/narration: one chunky hand-marker face (Permanent Marker / Patrick Hand).
- Sincere content only (Rakhi Note, certificate signature): one genuine handwriting script (Caveat / Kalam).
- Body/UI/labels: a clean rounded sans (Quicksand / Nunito).
- **Never use two hand-style display fonts on the same screen at once.**

### Screen inventory
Ten distinct screen types are specified, each with its own required interaction shape (not just visual skin): Prelude, Cold Open, Roast, Memories (folder/tab system with real open/reveal physicality, not a SaaS tab switch), Award (certificate parody), Rakhi Note (the stillest screen — scrollable letter, near-zero motion, delayed continue action, no character), Gifts (drag-to-unwrap, not tap), Quiz (report-card style summary, not a numeric score), a site-wide Secret layer (a tappable loose-thread doodle appearing on exactly five screens, counted globally, not per-screen), and Finale (card disappears; the page itself becomes the completed thread tying into a bow).

### Fixed interaction vocabulary
Each screen must reuse one of these verbs, not invent new gimmicks: Pull (thread), Reveal (roast labels), Open (folders), Unfold (award/note), Unwrap-via-drag (gifts, with a keyboard/tap fallback for accessibility), Choose (quiz), Discover (secret fragments), Tie (finale).

### Motion rules
- One orchestrated sequence per screen: thread draws in first, then card content follows — not simultaneous effects.
- Card transitions: slide + slight rotate-settle (~250ms ease-out), rotation varies ±1–2° per screen (never perfectly straight).
- At most one idle wobble per screen (2–3°, ~4s loop).
- Rakhi Note is the deliberate exception: near-zero motion, no character.
- Must respect `prefers-reduced-motion` (fall back to simple fades; specifically disable the note's stitch animation).

## Code architecture

State-driven single-page app; there's no router beyond an in-memory screen index.

- `src/main.js` — entry point and screen router. Owns `#stage`, wires the enter/exit card transition (`stage--exit`/`stage--enter`), and global keyboard nav (→/Enter clicks whichever `[data-primary-action]` is enabled; ← goes back). Exposes an `api` object (`next(markId)`, `prev()`, `goTo(id)`, `replay()`) that every screen module receives as its second argument.
- `src/state.js` — the single source of truth: current screen index, thread marks earned, per-screen completion sets (`roastRevealed`, `memoriesOpened`, `giftsUnwrapped`, `quizAnswered`), and the secret-fragment `Set` (persisted to `localStorage`, since that easter egg is meant to survive a reload/replay while the rest of the story state is not).
- `src/thread.js` — the Dor itself: one `<path>` (`.thread-spine`) whose `d` is generated from an array of anchor points via Catmull-Rom-to-bezier smoothing (`catmullRomPath`). `addMark(id)` drops a decoration at a fixed arc-length fraction using `getPointAtLength`. `morphToBow()` doesn't swap assets — it lerps the SAME point array from the wavy `WAVE_POINTS` to a bow-shaped `BOW_POINTS` frame-by-frame (both arrays have matching length so point-for-point interpolation stays coherent), then fades the accumulated marks into it. A second `.thread-highlight` path is purely decorative (the two-tone twist) and never gets read back — the spine is the one that's "the exact path the user has been watching."
- `src/doodle.js` — the Shinchan narrator. `createNarrator()` renders the doodle fallback immediately, then synchronously swaps in a bundled sticker (`<video>` for `.webm`/`.mp4`, `<img>` otherwise) if `getStickerUrl()` finds one; `setFigureGif()` is the same swap exposed standalone for screens (Roast) that re-target one figure across multiple reveals rather than creating a new narrator each time.
- `src/narratorStickers.js` — builds the beat-key → bundled-sticker-URL map via `import.meta.glob` over `src/assets/stickers/`; see that folder's README for the naming convention and full beat-key list.
- `src/secret.js` — the five hidden thread-fragment doodles. Each screen that hides one calls `createFragment(screenId)` and positions it with its own scoped inline style (there's no shared layout for these — the whole point is each is disguised differently per screen, per the masterplan's table). Taps are deduped by fragment id in `state.js`; the 5th distinct one fires the reveal modal exactly once (gated by `localStorage`'s `dor:secretRevealed`).
- `src/screens/*.js` — one module per screen, each exporting `mount(stage, api)` that builds its own DOM into `stage` and returns an optional cleanup function (for `setTimeout`/listener teardown) that `main.js` calls before switching away. Screens are intentionally NOT uniform in shape (Finale renders no `.card` at all, per the brief's "card disappears"); `src/style.css` scopes most per-screen layout via `[data-screen="..."] .card` selectors rather than per-screen stylesheets.

### A CSS trap worth knowing about
`style.css` had a real bug from exactly the failure mode this project's tooling warns about: `.gift-box:nth-of-type(2)` (two selector components) silently beat `.gift-box--open` (one component) on specificity, so an unwrapped gift box never visually changed color. The fix was `.gift-box.gift-box--open`. When adding state-modifier classes to an element that also has a structural/positional selector (`:nth-of-type`, `:nth-child`, a type selector), match or exceed that selector's specificity, don't just rely on source order.

## Open placeholders (see Part 2's "Remaining requirements checklist")
These are intentionally left as clearly-marked placeholders in the code, not invented — fill them in directly rather than asking Claude to guess:
- The 7 Memory Archive photos + captions (`src/screens/memories.js`, `[PHOTO_0X]` / `[CAPTION_0X]`).
- The final Rakhi Note letter text (`src/screens/rakhiNote.js` — currently literal Lorem Ipsum, per Part 2's own instruction).
- Gift Box 2's "remember when" memory, and Box 3's real clue text (`src/screens/gifts.js`, both still bracketed).
- Real Shinchan sticker files in `src/assets/stickers/`, one per beat key (see that folder's README) — currently unfilled, so every beat still shows the hand-drawn doodle fallback.
