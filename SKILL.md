---
name: oa-design
description: "Open Analytics' design language, extracted from the shipped product: an ink-derived neutral system, squircle surface anatomy, one small spring vocabulary, pixel-matched skeletons, and a plain-spoken copy voice. Use this whenever you build or restyle a dashboard, SaaS app, analytics UI, settings screen, onboarding flow, or marketing/landing page that should feel calm, dense and native, and whenever the user mentions Open Analytics' look, 'clean SaaS design', cards, dropdowns, tab bars, empty states, skeletons, or UI animation quality, even if they never say the words 'design system'."
---

# OA Design

This is the design language of [Open Analytics](https://getopen.so), written down
so an agent can reproduce it. Nothing here is aspirational: every value in this
skill is lifted from the shipped product, springs and hex codes included.

The look in one sentence: **white surfaces with continuous-curvature corners,
resting on a quiet grey stage, drawn in a single ink, moved by a single spring.**

## The ten rules

1. **One ink, everything derived.** The entire neutral system is one color,
   `--ink`, mixed into transparency at fixed percentages: borders are 12% ink,
   hover washes 5%, inputs 14%. Never introduce a second grey. When you need a
   new neutral, mix ink; the UI stays coherent because it literally cannot
   drift. See `references/tokens.md`.

2. **Two layers, and the gap is the page.** Surfaces are a white frame holding
   a recessed grey inset; sections on a page are separate plates and the page
   background showing between them is the only divider. No horizontal rules,
   no full-width hairlines between sections. See `references/layout.md`.

3. **Squircles for surfaces, pills for actions.** Cards and panels use
   continuous-curvature corners (a CSS `shape()` clip-path). Anything you
   click that is not a card is a pill: buttons, tabs, chips, notices. A
   rectangle with `rounded-lg` is the smell of a foreign component. See
   `references/components.md`.

4. **One spring family.** Panels open at `stiffness 550, damping 38`. Layout
   height animates at `550/40`. Modals pop at `400/26` and leave at `380/28`.
   Micro flicks (icons) use `900/50`. Do not invent new curves per component;
   the app feels like one hand because it moves like one hand. See
   `references/motion.md`.

5. **Chrome never waits.** Frames, titles and layout render instantly; only
   data swaps from skeleton to content, and the skeleton is pixel-matched to
   what replaces it so nothing shifts. Arrival is a blur-and-opacity reveal,
   not a pop. See `references/components.md`, "Skeletons".

6. **Weight stops at 500.** Inter Tight, variable, 300 to 500. There is no
   bold anywhere; `font-medium` is the loudest voice in the room, and that is
   what makes the numbers feel calm. Data aligns with `tabular-nums`. Code and
   keys use Geist Mono.

7. **One accent, spent in one place.** A single blue carries every primary
   action and the primary chart line. Semantic colors (success, warning,
   destructive) exist but are text-level tints, not fills. A screen with two
   competing accents is a bug.

8. **States get pills, events end themselves.** Standing conditions (a failed
   payment, a site with no events yet) are described by a small pill or strip
   that exists exactly as long as the state does and is never dismissable.
   One-off outcomes (saved, copied) are toasts that retire on their own.

9. **Copy is part of the design.** Sentence case everywhere. A button says
   what happens ("Save changes", never "Submit"). An error names the cause and
   the way out, and never blames the user. See `references/copy.md`.

10. **Quality floor, always.** Visible `focus-visible` ring on everything
    interactive, `aria-hidden` on decorations, `role="status"` on notices,
    `prefers-reduced-motion` respected, and the page body never scrolls
    horizontally.

## Core tokens (light)

```css
:root {
  --ink: #292929;
  --background: #f6f6f6;          /* the stage; the body itself stays white */
  --card: #ffffff;
  --border: color-mix(in srgb, var(--ink) 12%, transparent);
  --accent: color-mix(in srgb, var(--ink) 5%, transparent);   /* hover wash */
  --muted: color-mix(in srgb, var(--ink) 5%, transparent);
  --muted-foreground: #6d6d6d;
  --input: color-mix(in srgb, var(--ink) 14%, transparent);
  --secondary: #e9e9e9;           /* secondary buttons, toggles */
  --primary: #305dde;             /* the one accent */
  --ring: #3ba6f1;
  --radius: 0.625rem;             /* radius-sm..4xl derive from this */
  /* semantic colors are Tailwind's scale, used as TEXT tints on light: */
  --destructive-foreground: var(--color-red-700);
  --success-foreground: var(--color-emerald-700);
  --warning-foreground: var(--color-amber-700);
}
```

The full palette, the dark theme, typography and radius scale are in
`references/tokens.md`.

## How to use this skill

Read the reference that matches what you are building, then build with real
content, never lorem:

- `references/tokens.md`: colors, dark theme, type, radius, shadows.
- `references/layout.md`: page anatomy, plates, widths, responsive rules.
- `references/components.md`: squircle cards, buttons, dropdowns, modals,
  tab bar, skeletons, notices and empty states.
- `references/motion.md`: the spring vocabulary and the signature moves.
- `references/landing.md`: marketing pages, the header morph, scroll reveals.
- `references/copy.md`: voice, button labels, errors, empty states.

The stack the values were written for is React + Tailwind v4 + the `motion`
package, but everything is expressed as plain CSS values and spring constants,
so port freely. When the user's project already has a design system, theirs
wins; use this skill to fill gaps, not to overwrite their identity.
