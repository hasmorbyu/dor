# Dor — Masterplan Part 2: Content, Behavior & Build

Use this alongside Part 1 (design system) once a visual direction is picked. This file has the actual copy, per-screen behavior specs, the GIF/narrator mapping, and the build sequence.

Names: **Diddi** (display name throughout, used casually) / **Ananya Roy** (formal, certificate only) / **Subham** (you).

---

## Screen 0 — Prelude
- "okay..."
- "I was told to give this to someone."
- "I forgot who."
- Scribbled note: "HEY. IT'S FOR DIDDI. — SUBHAM"
- "oh. right."
- "this is going to be easy. probably."

**Narrator role**: confused courier. **Emotion**: confused.

## Screen 1 — Cold Open
- Header: "DIDDI DETECTED."
- "MISSION: show you something"
- "DIFFICULTY: apparently high"
- "He spent way too much time on this."
- Buttons: YES / NO (No dodges touch/cursor)
- Dodge lines, in order: "wrong button." → "you really want to leave already?" → "I haven't even started roasting you." → (No becomes pressable)
- If pressed: "okay. closing the website." (2s fade) → "just kidding." → thread pulls page back → `[ fine, show me ]`

**Narrator role**: gatekeeper. **Emotion**: mischievous.

## Screen 2 — Roast ("Case File #01")
Header: "CASE FILE #01 — IDENTIFYING THE SUBJECT"

| Reveal | Emotion needed |
|---|---|
| Maa Ki Chugli Saheli | mischievous/laughing |
| NAP-pur ki Devi | sleeping/exhausted |
| Papa ki Pyaari Perfect Pari | smug/proud |
| Raat mei Laath maarke bistar se gira dene wali | 
| **BEST SCOOTY RIDER 🛵** (two-part reveal — see below) | impressed/proud |
| Best Chef | eating/happy |
| Annoying Hero | soft/warm/proud |

Scooty label renders as a two-part reveal on its own beat:
```
BEST SCOOTY RIDER 🛵
never taught me how to drive,
just gave me the best seat in the back.
```

**Narrator role**: investigator. **Emotion**: laughing/reacting throughout, building to soft.

## Screen 3 — Memories ("The Sibling Archives")
Header: "THE SIBLING ARCHIVES — classified evidence"

Three folders, tap to open, swipe/flip through photos inside, tap to close:

**📁 FILE 01 — EMBARRASSING EVIDENCE** (photos 1–2)
- `[PHOTO_01]` — `[CAPTION_01]`
- `[PHOTO_02]` — `[CAPTION_02]`

**📁 FILE 02 — THE OLD DAYS** (photos 3–5)
- `[PHOTO_03]` — `[CAPTION_03]`
- `[PHOTO_04]` — `[CAPTION_04]`
- `[PHOTO_05]` — `[CAPTION_05]`

**📁 FILE 03 — SLIGHTLY TOO WHOLESOME** (photos 6–7)
- `[PHOTO_06]` — `[CAPTION_06]`
- `[PHOTO_07]` — `[CAPTION_07]`

Photos and captions arrive last — build the folder/flip mechanic against placeholder image blocks sized for whatever aspect ratio the real photos end up being (confirm portrait vs. landscape once photos are ready, or build the viewer to handle either).

**Narrator role**: archivist. **Emotion**: curious → nostalgic.

## Screen 4 — Sibling Award
Title: **THE "YOU'RE STUCK WITH ME" AWARD**

```
THIS CERTIFIES THAT

Ananya Roy

HAS SUCCESSFULLY SURVIVED

20 years of unsolicited opinions from me,
countless arguments that were definitely my fault*,
me stealing/borrowing things and returning them
at an unspecified time.
```
Asterisk footnote: *the legal department disputes this claim.*

Genuine line, standing alone at the bottom:
> and, somehow, still being there when I needed you.

```
OFFICIALLY ISSUED BY
THE MINISTRY OF DEALING WITH SUBHAM

SIGNED:
Subham
Definitely Not Under Pressure
```

**Narrator role**: ceremony host. **Emotion**: proud, turning quiet on the genuine line ("Oh. This one's real.").

## Screen 5 — Rakhi Note
**No GIF after the opening transition. No auto-advance.**

Flow:
1. Card enters
2. Shinchan: "Okay. This one's yours."
3. Shinchan exits quietly
4. Letter renders as a **vertically scrollable** block — do not force it into a fixed-height card; the placeholder is short now (Lorem Ipsum) but the final note may run longer
5. Thread slowly stitches the card border while she reads (disable this specific animation under `prefers-reduced-motion` — everything else on the site can keep its normal reduced-motion fallback, but this one is explicitly off, not just simplified)
6. No auto-advance
7. After a brief delay or scroll-to-bottom: "continue when you're ready →" appears

Content: placeholder Lorem Ipsum for now, final text to be dropped in later — leave the scroll container flexible for length.

**Narrator role**: steps away. **Emotion**: quiet/soft.

## Screen 6 — Gift Boxes
Progression: funny → personal → real. Interaction: drag ribbon to unwrap, not tap.

**🎁 Box 1 — Joke**
```
ONE OFFICIAL APOLOGY COUPON
Valid for one (1) argument.

I will:
☐ admit I was wrong
☐ say sorry first

Terms and conditions:
Absolutely no guarantee this will happen.
```

**🎁 Box 2 — Memory**
```
REMEMBER WHEN...

[A SHORT MEMORY THAT ONLY THE TWO OF YOU WOULD UNDERSTAND]

I still can't believe we survived that.
```

**🎁 Box 3 — Real-world gift** (pick one approach)

*Option A — physical gift hidden somewhere:*
```
YOUR ACTUAL GIFT IS WAITING.

CLUE #01:
Go to the place where [PERSONAL CLUE].

And no, I'm not helping you more than that.
```

*Option B — no physical gift, redeemable instead:*
```
REDEEMABLE FOR ONE:
🍔 food of your choice
🎬 movie night
🫡 favour without complaints
```

**Decision needed**: confirm Option A (with real clue text) or Option B before build.

**Narrator role**: chaos agent. **Emotion**: excited.

## Screen 7 — Quiz
No numeric score shown. Two options per question, both selectable, reactions per answer:

**Q1 — Who starts most of our arguments?**
Options: You / Me
Any answer → "Evidence suggests: both of you." (neither marked wrong)

**Q2 — Who will be driving the scooty?**
Options: Me / You
Correct: Me. If "You" selected → "Nice try. You literally gave him the back seat." (callback to Screen 2)

**Q3 — Who is mom's favourite?**
Options: Me / You
No correct answer → "Congratulations. You have both lost."

**Final report** (replaces a score):
```
SHINCHAN'S FINAL REPORT

ARGUMENT EXPERTISE: confirmed
SCOOTY KNOWLEDGE: questionable
MOM'S FAVOURITE: classified

FINAL VERDICT:
definitely siblings.
unfortunately.
```

**Narrator role**: judge. **Emotion**: smug/reactive.

## Secret / Easter Egg — the thread fragment
A tiny loose-thread-end doodle appears in **exactly five** specific screens (not every screen):

| Screen | Hidden location |
|---|---|
| Cold Open | behind/near the No button |
| Roast | mixed into a hand-drawn arrow |
| Memories | under a polaroid corner |
| Award | near the certificate signature |
| Gifts | disguised as a loose ribbon |

Mechanic: taps count **globally across the site**, not per screen. On the 5th total tap:
```
⚠ THREAD DETECTED ⚠

SHINCHAN: "Wait." "I found something."
YOU: "don't open that."
SHINCHAN: "..."

[ OPEN ANYWAY ]
```
Reveal:
> If you found this, you either pay way too much attention or you're just incredibly curious. Either way, here's one thing I didn't know where else to put: no matter how annoying you are, I hope you always know you've got me.

Then: "okay, that's enough sincerity. go back."

Thread gains a hidden tiny star. At the finale, if found: "You found the secret too? Show-off."

**Narrator role**: accidental revealer. **Emotion**: shocked.

**Implementation note**: needs a small persisted counter in site state (a simple JS variable/localStorage is fine for a single-session gift experience — no backend needed) that increments on any of the five fragment taps and fires the reveal at exactly 5, regardless of order or which screen they were found on.

## Screen 8 — Finale
Card disappears; full page becomes the completed thread pulling into the bow.The existing SVG thread must transform into the final Rakhi/bow. Do not crossfade to or swap in a separate pre-made bow graphic.

Closing message:
```
we'll probably keep fighting.
you'll probably keep annoying me.
and I'll probably keep annoying you back.

but no matter what changes,
you'll always be my sister.
and I'll always be here.

Happy Raksha Bandhan, Diddi. ❤️
```

Shinchan: "Okay. That's enough emotions for today."

Button: `[ replay the nonsense ↻ ]`

**Narrator role**: narrator. **Emotion**: warm → playful.

---

## Narrator / emotion script map (full table for GIF sourcing)

| Screen | Shinchan's role | Required emotion |
|---|---|---|
| Prelude | Confused courier | confused |
| Cold Open | Gatekeeper | mischievous |
| Roast | Investigator | laughing/reacting |
| Memories | Archivist | curious → nostalgic |
| Award | Ceremony host | proud |
| Rakhi Note | Steps away | quiet/soft (no GIF after opening beat) |
| Gifts | Chaos agent | excited |
| Quiz | Judge | smug/reactive |
| Secret | Accidental revealer | shocked |
| Finale | Narrator | warm → playful |

## GIF sourcing — technical note
- Fetched live via your Giphy API key.
- **Key handling**: store as an environment variable (`.env`, added to `.gitignore`), never hardcoded in source or committed. If Claude Code scaffolds a `.env.example` file, it should contain a placeholder only (`GIPHY_API_KEY=`), not the real value.
- Use the emotion column above as the search term basis per screen (e.g. "shinchan confused", "shinchan smug", "shinchan proud").
- Screens 0, 5, and 8 carry the most emotional weight — worth manually reviewing/curating the top search results for these three rather than auto-using the first hit, since tone-matching matters most there. Screen 5 specifically should have no GIF past its opening beat, per the behavior spec above.
Add a principle rather than writing every line now:

Every screen should have 1–2 short Shinchan narration beats maximum before the interaction begins. Avoid turning the narrator into continuous dialogue.

Otherwise Claude may produce:

GIF
text
GIF
text
GIF
text

on every screen.

The GIF should behave more like a reaction actor than an audiobook character.
---

## Build sequence for Claude Code

1. **Scaffold**: `index.html` / `style.css` / `app.js` (or lightweight framework if preferred) — single-page, state-driven, `.env` support for the Giphy key.
2. **Design tokens**: implement the chosen palette (from the Part 1 design pass) as CSS custom properties; load the three font families.
3. **Thread engine**: single fixed SVG path, state-driven marks appended per milestone, dash-offset animation tied to progress, final "tie into bow" transform for the finale.
4. **Screen engine**: `screens` array + `currentIndex`, card slide/rotate transition, keyboard + tap support.
5. **Giphy integration**: fetch-on-load per screen using the emotion search terms; cache results per session so repeat visits don't re-fetch; graceful fallback (static doodle or no GIF) if the API call fails.
6. **Build each screen** in order 0 → 8, referencing this file for exact copy and behavior:
   - Prelude, Cold Open (with dodge-button logic)
   - Roast (radial reveal, two-part scooty label)
   - Memories (folder/open/swipe/close, placeholder photo blocks)
   - Award (certificate layout)
   - Rakhi Note (scrollable letter, stitch animation, delayed continue, reduced-motion override)
   - Gifts (drag-to-unwrap ribbon interaction, Option A/B decision on Box 3)
   - Quiz (dual-acceptable answers, reaction beats, report-card summary)
   - Secret layer (five fragment locations, global tap counter, reveal at 5)
   - Finale (thread convergence, closing message, replay button)
7. **Reduced-motion pass**: global fallback to simple fades, explicit disable of the Note's stitch animation.
8. **Responsive pass**: test at ~375px width, confirm drag interaction (gifts) and scroll interaction (note) both work cleanly on touch.
9. **Placeholder audit**: confirm every `[FILL IN]`/`[PHOTO_0X]`/`[CAPTION_0X]` placeholder is either filled or clearly marked as pending final assets.
10. **Self-review pass**: walk all 10 screens (0–8 + secret) end to end, confirm the thread visibly carries marks from each milestone into the finale bow, confirm no GIF appears on the Rakhi Note past its opening beat.

---

## Remaining requirements checklist

- [ ] 7 final photos + captions for the Memory Archives (File 01: 2 photos, File 02: 3 photos, File 03: 2 photos)
- [ ] Decision: Gift Box 3 — Option A (physical gift + real clue text) or Option B (redeemable list)
- [ ] Final Rakhi Note text (currently Lorem Ipsum placeholder)
- [ ] The short "remember when" memory for Gift Box 2
- [ ] Giphy API key added to your local `.env` (not shared with Claude Code in chat/plaintext)
- [ ] Confirm which design direction (A/B/C from Part 1, or a blend) to build against once the 3 mockups are reviewed
- [ ] Background music — yes/no, and track if yes
