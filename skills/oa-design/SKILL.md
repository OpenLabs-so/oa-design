---
name: oa-design
description: "Open Analytics' design language, extracted from the shipped product: an ink-derived neutral system, squircle surface anatomy, one small spring vocabulary, pixel-matched skeletons, and a plain-spoken copy voice, with type-checked component recipes. Use this whenever you build or restyle a dashboard, SaaS app, analytics UI, settings screen, onboarding flow, or marketing/landing page that should feel calm, dense and native, and whenever the user mentions Open Analytics' look, 'clean SaaS design', cards, dropdowns, tab bars, empty states, skeletons, or UI animation quality, even if they never say the words 'design system'."
---

# OA Design

The design language of [Open Analytics](https://getopen.so), written down so
an agent can reproduce it. Nothing here is aspirational: every value is
lifted from the shipped product, springs and hex codes included.

The look in one sentence: **white surfaces with continuous-curvature corners,
resting on a quiet grey stage, drawn in a single ink, moved by a single
spring.**

Start by dropping `_root.css` into the project's global stylesheet: every
recipe reads from those token names. Then read the recipe for what you are
building. Build with real content, never lorem.

## The ten rules

1. **One ink, everything derived.** The entire neutral system is one color,
   `--ink`, mixed into transparency at fixed percentages: borders 12%, hover
   washes 5%, inputs 14%. Never introduce a second grey; when you need a new
   neutral, mix ink.
2. **Two layers, and the gap is the page.** Surfaces are a white frame
   holding a recessed grey inset; sections are plates and the page background
   between them is the only divider. No horizontal rules.
3. **Squircles for surfaces, pills for actions.** Cards get
   continuous-curvature corners; everything clickable that is not a card is a
   pill. A `rounded-lg` rectangle is the smell of a foreign component.
4. **One spring family.** Seven named springs cover the entire product (table
   below). Do not invent an eighth.
5. **Chrome never waits.** Layout and titles render instantly; only data
   swaps from a pixel-matched skeleton, arriving by blur, not by pop.
6. **Weight stops at 500.** Inter Tight 300 to 500; no bold anywhere.
   Hierarchy comes from size, color and spacing. Data aligns with
   `tabular-nums`; code is Geist Mono.
7. **One accent, spent in one place.** A single blue for primary actions and
   the primary chart line; semantic colors are text tints, never fills.
8. **States get pills, events end themselves.** Standing conditions render
   non-dismissable strips or pills that live exactly as long as the state;
   one-off outcomes are toasts that retire alone.
9. **Copy is part of the design.** Sentence case; buttons say what happens;
   errors name the cause and the way out, without blame. Read `_copy.md`.
10. **Quality floor, always.** Focus rings, `role="status"`, `aria-hidden`
    decorations, `prefers-reduced-motion`, no horizontal page scroll.

## The springs

| Name | Value | Used for |
| --- | --- | --- |
| PANEL | 550 / 38 | dropdowns, menus, boards, toggles |
| LAYOUT | 550 / 40 | measured height/width, traveling pills |
| POP | 400 / 26 | modal entrance |
| POP_EXIT | 380 / 28 | modal exit |
| BANNER | 400 / 30 | floating pills, page banners |
| FLICK | 900 / 50 | icon micro-moves |
| CHART | 300 / 28 | chart tooltips, crosshair |

Micro fades: 0.1s out, 0.16s in, easeOut; nothing in app chrome tweens past
0.2s. The constants ship as code in `components/_lib/springs.ts`.

## Component recipes

Each recipe is self-contained: when to use it, the load-bearing details, and
the full type-checked source embedded.

| File | What |
| --- | --- |
| `01-squircle-card.md` | the surface system and the fixed-height mini card |
| `02-button.md` | pills that press, the bevel, honest loading |
| `03-dropdown.md` | menus, selects, switchers; one anchored-panel pattern |
| `04-tab-bar.md` | the traveling highlight and the label mask |
| `05-modal.md` | pop in, softer pop out |
| `06-multi-step-dialog.md` | the measured-height choreography |
| `07-skeleton.md` | pixel-matched waits and the blur arrival |
| `08-notice-strip.md` | explaining a standing state |
| `09-floating-pill.md` | the app chrome's one word |
| `10-toast.md` | success pulses, error shakes |
| `11-header-morph.md` | the landing glass pill |
| `12-reveal.md` | scroll reveals in 80ms beats |

## Guides

| File | What |
| --- | --- |
| `_tokens.md` | the full palette, dark theme, type, radius, shadows |
| `_layout.md` | plates, widths, page anatomy, settings screens |
| `_components.md` | the component patterns in prose, cross-referenced |
| `_motion.md` | the vocabulary and the signature moves, with rules |
| `_landing.md` | marketing pages: hero, reveals, furniture |
| `_copy.md` | voice, buttons, errors, states, numbers |
| `_root.css` | the installable token block every recipe reads from |

Stack assumptions: React + Tailwind v4 + the `motion` package; but every
value is plain CSS numbers and spring constants, so port freely. If the
project already has a design system, theirs wins; use this to fill gaps, not
to overwrite their identity.
