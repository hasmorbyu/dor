# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This repository currently contains only a design brief — [Dor Masterplan Part 1.md](Dor%20Masterplan%20Part%201.md) — and no source code, no package manifest, and no build/lint/test tooling yet. There is nothing to build or run. When development starts, this file should be updated with the actual commands (install, dev server, build, lint, test) and the real code architecture once a framework/stack is chosen.

## What "Dor" is

Dor is a single-page, narrative Rakhi (sibling festival) web experience built as a sequence of distinct "screens" the visitor moves through, narrated throughout by Shinchan reaction GIFs. The whole site is meant to read as **one physical handmade object** (torn notebook paper, marker ink, washi tape, a literal thread), not a conventional UI with decorative skin on top.

The core visual motif is **the Dor** — a twisted red-and-gold cord rendered as a single continuous SVG path that is present on every screen and has three states:
1. **Loose** — incomplete/tangled, present from the Prelude.
2. **Collecting** — gains a distinct mark (knot, stitched loop, bead, stitched red section, charm, hidden star, etc.) at each story milestone.
3. **Understood** — at the finale, all marks pull together and the same path visibly reassembles into a bow (must be an animation of the tracked path itself, never a swapped-in static bow asset).

[Dor Masterplan Part 1.md](Dor%20Masterplan%20Part%201.md) is Part 1 of the plan: pure design system (materials, color, type, layout, motion) with **no personal copy, names, or final content** — that content lives in a not-yet-written Part 2. Do not invent or fill in personal/final copy when implementing screens from Part 1 alone; treat placeholder/structural content as structural only.

## Design system (from the masterplan)

### Three competing color/material directions
The masterplan defines three full palettes — **A: Festival Warm** (marigold/maroon), **B: Notebook Faded** (cooler, faded-photo, blue secondary), **C: Crayon Box** (louder, higher saturation) — as CSS custom properties (`--paper`, `--ink`, `--maroon`, etc.). Only one direction should be built out; the mockup deliverable was meant to help pick one. If build work starts before a direction is chosen, ask which palette to implement rather than guessing or blending.

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

## Working in this repo

- There is no chosen tech stack yet. Before writing implementation code, confirm the framework/tooling with the user rather than assuming one.
- Treat the masterplan's structural/interaction/motion rules as constraints to satisfy, not suggestions — they're deliberately specific (e.g. "not a swapped-in static bow asset", "not a numeric score", "no character presence after the opening beat" on Rakhi Note) because generic implementations of these screens are the known failure mode this brief is guarding against.
