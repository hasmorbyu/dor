# Dor — Masterplan Part 1: Design Instructions Only

**Purpose of this file**: render **3 distinct visual directions** for the whole site before any development starts. No personal copy, names, or final content lives in this file on purpose — that's Part 2. This file is pure design system: materials, color, type, layout, motion, and the physical behavior of each screen *shape*.
DIRECTION A — FESTIVAL WARM
├── Cold Open
├── Roast
├── Rakhi Note
└── Memory Folder interaction

DIRECTION B — NOTEBOOK FADED
├── Cold Open
├── Roast
├── Rakhi Note
└── Memory Folder interaction

DIRECTION C — CRAYON BOX
├── Cold Open
├── Roast
├── Rakhi Note
└── Memory Folder interaction
---

## 1. Concept in one line

A handmade, notebook-and-crayon Rakhi story where a physical thread (Dor) is carried across every screen, gathering a mark at each milestone, and finally ties itself into a bow — narrated throughout by Shinchan reaction GIFs that behave like they've physically entered the page rather than sitting in a UI box.

## 2. Material world

Everything on the site should read as **one physical object**, not a UI with decorations on top.

- Base surface: warm torn notebook-paper texture. Kraft/corkboard texture may appear only as a secondary surface for specific memory/archive moments.
- Ink: hand-scribbled marker lines for headlines and reactions
- Fasteners: washi/masking tape corners, small stitches
- The thread: twisted red-and-gold cord, rendered as an SVG path, present on every screen
- Avoid polished paper textures, photorealistic 3D paper, excessive grain, or AI-generated "vintage scrapbook" aesthetics. The material should feel like a real child's notebook assembled by hand.
- Shinchan GIFs: treated as a character standing on/overlapping the page — allowed to overlap card edges, point at things, sit slightly outside the card boundary. Never inside a clean rounded rectangle with a drop shadow like a generic avatar.

## 3. Color palette (3 directions to explore, pick or blend)

**Direction A — Festival Warm** (marigold/maroon, closest to the original plan)
| Token | Hex | Use |
|---|---|---|
| `--paper` | `#FBF3E7` | background |
| `--paper-line` | `#E8D9BE` | faint rule lines, borders |
| `--marigold` | `#F2A03D` | primary accent, thread gold |
| `--maroon` | `#8C2F2B` | headlines, thread red, ink |
| `--crayon-red` | `#E14B3D` | roast callouts, stickers |
| `--leaf` | `#5C7A4E` | sparing secondary accent |
| `--ink` | `#2B2420` | body text |

**Direction B — Notebook Faded** (cooler, more "old photograph" nostalgic, lets the thread's red/gold pop harder by contrast)
| Token | Hex | Use |
|---|---|---|
| `--paper` | `#F4F1E8` | background, slightly cooler cream |
| `--paper-line` | `#D8D2C0` | rule lines |
| `--faded-blue` | `#6E8CA0` | secondary ink, doodle color |
| `--maroon` | `#7A2E2A` | thread red, headlines |
| `--marigold` | `#E8A33D` | thread gold, accents |
| `--ink` | `#332E28` | body text |

**Direction C — Crayon Box** (louder, more chaotic-kid-energy, higher saturation — matches Shinchan's chaos beats harder, sincerity beats need to work extra hard to contrast against it)
| Token | Hex | Use |
|---|---|---|
| `--paper` | `#FFF8EC` | background |
| `--crayon-red` | `#EF4B3A` | primary accent |
| `--crayon-yellow` | `#F6C445` | secondary accent |
| `--crayon-green` | `#4C9A6A` | tertiary accent, sparing |
| `--maroon` | `#7A2321` | headlines, thread |
| `--ink` | `#231F1B` | body text |

Render all three as a palette swatch + one sample screen (Roast, since it has the most going on) so the choice is easy to make visually.

## 4. Typography

- **Headlines / narrator lines**: chunky hand-marker face — *Permanent Marker* or *Patrick Hand*
- **Sincere/letter content** (used only on the Rakhi Note and the certificate signature): genuine handwriting script — *Caveat* or *Kalam*
- **Body / UI / labels / quiz options**: clean rounded sans — *Quicksand* or *Nunito*
- Rule: never two hand-style faces on screen at once.
- Use one hand-style family per screen. Marker-style typography is for energetic narration/headlines; handwriting-style typography is reserved for intimate/sentimental content and signatures. Never use both simultaneously as competing display fonts.
## 5. The Dor thread — visual system

Three states, one continuous SVG path fixed near the top of the viewport (or running down one side on wider viewports — try both in the design pass):

1. **Loose** — incomplete, slightly tangled, present from the Prelude
2. **Collecting** — gains a distinct visual mark at each milestone as the story progresses (a knot, a stitched loop, a small bead, a stitched red section, a tiny charm, a final knot, and — only if found — a hidden tiny star)
3. **Understood** — at the finale, all marks pull together and the thread visibly reassembles itself into a bow, built from the exact path the user has been watching the whole time — not a swapped-in static bow asset.

Design deliverable: show all three states of the thread as its own isolated component study, plus how it sits on a screen (top bar vs. side ribbon vs. woven into the card border itself).

## 6. Screen shapes (structure only — copy lives in Part 2)

Design each of these as a distinct component/layout, consistent within one material system:

| Screen | Shape needed |
|---|---|
| Prelude | Empty paper, thread draws in, single character beat, minimal chrome |
| Cold Open | Full-bleed card, two buttons, one of which evades touch/cursor |
| Roast | Radial/scattered label layout around a central character reaction, tap-to-reveal one label at a time |
| Memories | Folder/tab system — 3 folders, each opens into a swipe/flip photo sequence, then closes |Folders should feel like physical notebook tabs or paper file folders, not modern SaaS tabs.Opening a folder should physically reveal the photographs rather than simply switching a content panel.|
| Award | Certificate layout — formal parody framing (seal, "ministry" letterhead feel) built from the same handmade materials, not a clean corporate certificate template |
| Rakhi Note | The stillest screen on the site — vertically **scrollable** letter (not a fixed card), almost no decoration, thread stitches the border slowly, continue action appears only after a delay/scroll — no character presence after the opening beat |
| Gifts | Three boxes with a **drag-the-ribbon-to-unwrap** interaction, not a simple tap | Drag is the primary interaction, with a keyboard/tap alternative for accessibility and mobile reliability.
| Quiz | Two-option choice cards, reaction beat after each answer, ends in a "report card" style summary, not a numeric score |
| Secret layer | A small recurring loose-thread-end doodle appears in five specific screens (not all), tappable, counts across the whole site (not per-screen) |
| Finale | Card disappears entirely — full page becomes the completed thread converging into the bow, then the closing reveal |

## 7. Interaction language (keep consistent site-wide)

| Action | Used for |
|---|---|
| Pull | thread / progression |
| Reveal | roast labels |
| Open | memory folders |
| Unfold | award / note |
| Unwrap (drag) | gifts |
| Choose | quiz |
| Discover | secret thread fragments |
| Tie | finale |

Don't invent a new interaction gimmick per screen — everything should feel like it belongs to this same small vocabulary of physical actions.

## 8. Motion principles

- Thread animates first on load (draws in), then card content follows — one orchestrated sequence per screen, not simultaneous effects.
- Card transitions: slide + slight rotate-settle (~250ms ease-out), card rotation varies ±1–2° per screen, never perfectly straight.
- One idle wobble max per screen (a sticker or doodle, 2–3° loop, ~4s) — not everything moving at once.
- Rakhi Note screen is the deliberate exception: near-zero motion, no character, to make it read as a tonal shift.
- Respect `prefers-reduced-motion`: fall back to simple fades everywhere, and specifically disable the note's stitch animation.

## 9. Design deliverable ask

Render **3 full-direction mockups** (pick 2-3 representative screens each — suggest Cold Open, Roast, and Rakhi Note, since they cover chaotic/comedic/sincere tones) using palettes A, B, and C above, so the visual direction can be picked before any screen-by-screen build work starts. Each direction should demonstrate:
- the paper/card material treatment
- the thread in at least one state
- how a Shinchan GIF is framed/overlapped on the page
- headline + body type pairing in use
