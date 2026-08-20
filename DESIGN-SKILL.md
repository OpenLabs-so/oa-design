# DESIGN-SKILL.md

The design language of [Open Analytics](https://getopen.so) in a single file,
written for AI agents and the humans who direct them. Every value here ships
in the product: hex codes, spring constants, radii, easings. Paste this file
into your agent's context (or drop it in your repo as a rule file) and ask for
screens "in the OA style".

This is the compiled, one-file edition, made for pasting. The same language
also ships in this repository as a proper agent skill
(`skills/oa-design/`: per-component recipes with the full type-checked source
embedded) and as a CLI (`npx getopen-design add <component>`); prefer those
for Claude Code and other skill-aware agents.

The look in one sentence: **white surfaces with continuous-curvature corners,
resting on a quiet grey stage, drawn in a single ink, moved by a single
spring.**

---

## 1. The ten rules

1. **One ink, everything derived.** The whole neutral system is one color
   mixed into transparency at fixed percentages. Never pick a second grey.
2. **Two layers, and the gap is the page.** Surfaces are a white frame holding
   a recessed grey inset; sections are plates and the page background between
   them is the only divider. No horizontal rules.
3. **Squircles for surfaces, pills for actions.** Cards get
   continuous-curvature corners; everything clickable that is not a card is a
   pill.
4. **One spring family.** Seven named springs cover the entire product. Do not
   invent an eighth.
5. **Chrome never waits.** Layout and titles render instantly; only data swaps
   from a pixel-matched skeleton, arriving by blur, not by pop.
6. **Weight stops at 500.** No bold anywhere. Hierarchy comes from size,
   color and spacing.
7. **One accent, spent in one place.** A single blue for primary actions and
   the primary chart line; semantic colors are text tints, not fills.
8. **States get pills, events end themselves.** Standing conditions render
   non-dismissable strips that live exactly as long as the state; one-off
   outcomes are toasts that retire alone.
9. **Copy is part of the design.** Sentence case; buttons say what happens;
   errors name the cause and the way out, without blame.
10. **Quality floor, always.** Focus rings, `role="status"`, `aria-hidden`
    decorations, `prefers-reduced-motion`, and no horizontal page scroll.

---

## 2. Tokens

### Light

```css
:root {
  --ink: #292929;

  --background: #f6f6f6;     /* the grey stage between plates */
  --card: #ffffff;
  --popover: #ffffff;

  /* ink-derived neutrals: the percentages ARE the system */
  --border: color-mix(in srgb, var(--ink) 12%, transparent);
  --input:  color-mix(in srgb, var(--ink) 14%, transparent);
  --accent: color-mix(in srgb, var(--ink) 5%, transparent);  /* hover wash */
  --muted:  color-mix(in srgb, var(--ink) 5%, transparent);
  --muted-foreground: #6d6d6d;
  --foreground: var(--ink);

  --primary: #305dde;             /* the one accent */
  --primary-foreground: #ffffff;
  --ring: #3ba6f1;

  --secondary: #e9e9e9;           /* flat grey controls, no border */
  --secondary-foreground: var(--ink);

  /* semantic, as TEXT tints on light (Tailwind scale, 700 row) */
  --destructive: var(--color-red-500);
  --destructive-foreground: var(--color-red-700);
  --success-foreground: var(--color-emerald-700);
  --warning-foreground: var(--color-amber-700);
  --info-foreground: var(--color-blue-700);

  --chart-1: #296FF0;             /* primary chart line */
  --radius: 0.625rem;
}
```

Need a stronger divider? Raise the ink percentage (the product uses only 4, 5,
10, 12, 14). Semantic colors go on words and 8px dots, never on panel fills.

### Dark

Same recipe, re-inked, with two systematic shifts: hairline percentages rise
by 2 points, and semantic text moves from the 700 row to the 400 row.

```css
.dark {
  --ink: #ededed;
  --background: #191919;
  --card: #212121;
  --popover: #242424;
  --border: color-mix(in srgb, var(--ink) 14%, transparent);
  --input:  color-mix(in srgb, var(--ink) 16%, transparent);
  --muted-foreground: #969696;
  --secondary: #2e2e2e;
  --primary: #296FF0;
  --destructive-foreground: var(--color-red-400);
  --success-foreground: var(--color-emerald-400);
}
```

### Radius

One base, multiplied; never a bespoke radius:

```css
--radius: 0.625rem;  /* sm ×0.6, md ×0.8, lg ×1, xl ×1.4,
                        2xl ×1.8, 3xl ×2.2, 4xl ×2.6 */
```

`rounded-full` is reserved for pills. Squircle surfaces carry their own larger
radii (section 4).

### Typography

- **Inter Tight**, variable, weights **300 to 500**, self-hosted (font CDNs
  fail builds; keep the woff2 in the repo).
- **Geist Mono** for `code, kbd, samp, pre`, keys and snippets.
- **The weight ceiling is the identity**: nothing renders heavier than 500.
  Hierarchy comes from size, `text-foreground/80` vs `text-muted-foreground`,
  and spacing.
- Headings: `font-medium tracking-tight`; marketing headlines add
  `text-wrap: balance`.
- Data: `tabular-nums` on any number in a column or updating in place.
- Default UI voice is 14px; secondary lines 12px, with `leading-5`/`leading-6`.

### Shadows

Elevation is binary:

```css
/* resting card */    box-shadow: 0 1px 2px rgba(0,0,0,0.06);
/* floating chrome */ box-shadow: 0 1px 2px rgba(0,0,0,0.08),
                                  0 8px 24px rgba(0,0,0,0.08);
```

### Background discipline

`body` is **white** (overscroll shows the body; grey peeking past a white
screen reads as a different page). Screens that want the grey stage paint
their own backdrop. Root gets `overflow-x: clip`.

---

## 3. Layout

**Plates.** Sections are self-contained panels; the page background showing
between them is the only boundary. Vertical gaps generous
(`gap-12 sm:gap-20` marketing, `gap-6` in-app), side padding tighter
(`px-4 sm:px-6`). Siblings are spaced by the parent's `gap`, never by
per-child margins. No `<hr>`, no border-b between sections.

**Widths per scope**: marketing 76rem (`6.5xl`), app site pages `max-w-6xl`,
list/picker screens `max-w-5xl`, reading surfaces ~65ch. Centered, `mx-auto`.

**App page anatomy**:

```
fixed header (h-14) → container pt-14
  optional floating pill (fixed top-16, centered)
  <main class="px-4 pb-36 pt-8 sm:px-6 bg-white">
    title row: h1 text-xl font-medium tracking-tight + ONE control on the right
    optional notice strip(s)
    plates: flex flex-col gap-6
```

The title row holds exactly one control. `pb-36` keeps content off the
viewport edge.

**Grids**: `grid gap-3`, responsive columns (`grid-cols-2 sm:grid-cols-4` for
stats). Cards share a fixed content height and scroll internally; the grid's
baseline never breaks.

**Responsive**: design at 390px and 1280px. Horizontal pairings stack under
`sm:` with the action last. Wide content scrolls in its own
`overflow-x-auto` container; the page never scrolls sideways.

**Settings**: narrow tab rail + content column of section panels; each section
opens with a heading block (title + one grey sentence, optional single action
on the right). Deep-link tabs via `?tab=<id>`.

---

## 4. Components

### The squircle surface

Continuous-curvature corners via a CSS `shape()` clip-path parameterized by
two variables, with `corner-shape: squircle` where supported:

```css
.squircle {
  border-radius: 26px;
  --card-clip-radius: 14px;
  --card-clip-handle: 2.25px;
  clip-path: shape(
    from var(--card-clip-radius) 0px,
    line to calc(100% - var(--card-clip-radius)) 0px,
    curve to 100% var(--card-clip-radius)
      with calc(100% - var(--card-clip-handle)) 0px / 100% var(--card-clip-handle),
    line to 100% calc(100% - var(--card-clip-radius)),
    curve to calc(100% - var(--card-clip-radius)) 100%
      with 100% calc(100% - var(--card-clip-handle)) / calc(100% - var(--card-clip-handle)) 100%,
    line to var(--card-clip-radius) 100%,
    curve to 0px calc(100% - var(--card-clip-radius))
      with var(--card-clip-handle) 100% / 0px calc(100% - var(--card-clip-handle)),
    line to 0px var(--card-clip-radius),
    curve to var(--card-clip-radius) 0px
      with 0px var(--card-clip-handle) / var(--card-clip-handle) 0px,
    close
  );
  corner-shape: squircle;
}
@media (min-width: 640px) {
  .squircle { border-radius: 50px; --card-clip-radius: 20px; --card-clip-handle: 3px; }
}
```

### The mini card

```
outer squircle: bg-card, border, p-1, resting shadow
├── header strip (pb-2 pl-3.5 pr-2 pt-1.5):
│     16px muted icon + text-sm font-medium text-foreground/80 title
│     optional chip on the title's centreline
│     "See all ›" (text-xs muted; hover: accent wash, arrow slides 2px)
└── inner squircle: bg #f6f6f6, border, rounded-[22px] sm:rounded-[44px],
      FIXED height (h-44 = five 32px rows), overflow hidden
```

Cards never grow with data; longer lists scroll inside. Overflow shows a 24px
chevron chip bottom-right, bobbing `y:[0,2.5,0]` (1.4s easeInOut loop), fading
out (`0.18s`, scale 0.7) at the end of the scroll. Rows: 32px, full-bleed
accent-wash hover, `tabular-nums` values.

### Buttons

Pills, `font-medium`, physically pressed:
`active:translate-y-px active:scale-[0.98]`.

- **primary**: accent blue with a bevel (background/border color-mixed toward
  a deep indigo, `inset 0 1px 0 rgba(255,255,255,0.22)` top, dark inset
  bottom); hover lightens toward pure primary.
- **secondary**: flat `--secondary`, transparent border, hover mixes 5% ink.
  The workhorse.
- **ghost**: muted text only. **destructive**: red fill, confirm step only.
- Sizes h-9 / h-8 / h-7; app chrome runs mostly on the small ones.
- Loading keeps the label and adds a 14px ring spinner
  (`border-2 border-current border-t-transparent`); width never jumps.
- `focus-visible:ring-[3px]` in `--ring`/50. Never removed.

### Dropdown panels (menus, selects, switchers)

Trigger pill → floating panel (floating shadow, border, white, rounded-2xl+),
spring in at PANEL (550/38) with small y/scale offset, faster exit. 32px
rounded-lg items with accent-wash hover; the active highlight is one shared
element that travels (layoutId or width/height springs), never per-item
repaints. Close on outside pointerdown and Escape.

### Modals

Backdrop fades ~0.15s; panel springs in at POP (400/26) from
`opacity 0, scale .96`, exits at 380/28. Multi-step dialogs keep one panel
whose height animates to each step's measured size (LAYOUT 550/40 +
ResizeObserver) while steps slide through (`x: ±12px`, popLayout, 0.16s
easeOut fades). Footer: h-12 strip, Back (secondary xs) + primary xs, right
aligned.

### Tab bar

The active pill is a fixed window; labels slide behind it. Incoming label
enters from the travel direction at 110% of its own width; outgoing exits a
fixed 130px the other way (a percentage falls short when the pill grows toward
a longer word). Pill width/height follow the measured label on LAYOUT springs.
Full opacity throughout; the mask does the work.

### Skeletons

1. Chrome never waits; only the data area is skeleton.
2. Pixel-matched: a bar sits inside the same line-height slot as the text it
   stands for (`flex h-6 items-center` wrapping an `h-3` bar); the swap moves
   nothing.
3. Data arrives by focus: a one-shot animation from
   `opacity ~0.4 + blur(4px)` to sharp. An animation, not a transition (the
   content mounts already final; a transition has no previous value). Keep
   `filter: blur(0)` afterwards.

Bar: `rounded bg-muted-foreground/15`, slow background-position sweep
(2s linear infinite, `-1s` start offset so bars are out of phase).

### Notices, empty states, the floating pill

**Notice strip** above the content it explains:

```html
<div class="flex flex-col gap-2 rounded-2xl border border-border bg-card
            px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
     role="status">
  <p class="text-sm leading-6 text-muted-foreground">
    <span class="font-medium text-foreground">No events yet.</span>
    If the snippet is live, browse your site and we'll pick up the first
    pageview within seconds.
  </p>
  <button class="…secondary pill…">Check the install</button>
</div>
```

One bold claim, one grey sentence, one secondary action; stacks under `sm:`;
lives exactly as long as the state; no dismiss.

**Floating pill** for app-wide standing conditions: fixed `top-16`, centered,
`rounded-full bg-card py-1.5 pl-3 pr-4 text-xs font-medium`, floating shadow,
8px status dot (pulsing when urgent), spring in at BANNER (400/30) from
`y:-8`, exit 0.15s. The whole pill links to where the state is resolved.
State pills never self-dismiss; event pills retire after ~6s.

### Toasts

Under 0.35s, easing `cubic-bezier(0.5, 1, 0.89, 1)`:

- **Success**: pulse `scale 1 → 1.025 → 0.99 → 1` (0.32s).
- **Error**: shake `x 0 → -3 → 3 → -3 → 0` px (0.28s).

Alternate odd/even keyframe copies so repeats restart.

---

## 5. Motion

| Name | Value | Used for |
| --- | --- | --- |
| PANEL | 550 / 38 | dropdowns, menus, boards, toggles |
| LAYOUT | 550 / 40 | measured height/width, sliding pills |
| POP | 400 / 26 | modal entrance |
| POP_EXIT | 380 / 28 | modal exit |
| BANNER | 400 / 30 | floating pills, page banners |
| FLICK | 900 / 50 | icon micro-moves |
| CHART | 300 / 25-30 | chart tooltips, crosshair |

Micro fades: 0.1s to 0.18s easeOut. Nothing in app chrome tweens longer than
0.2s; if it feels slow, lower damping, don't lengthen duration.

Signature moves: measured-height choreography (one constant panel, steps
sliding through), the traveling highlight (one shared active element, never
per-item repaints), enter/exit asymmetry (exits always faster), hover as
color-only (plus at most a 2px arrow slide; cards never lift or scale), and at
most one tiny ambient loop per screen.

Rules: AnimatePresence for everything that unmounts; respect
`prefers-reduced-motion` (reveals collapse to visible, loops stop); never
animate unmeasured layout; never read the wall clock during render (subscribe
to a ticking store in minute buckets).

---

## 6. Landing pages

Same tokens, slower clock: scroll-driven CSS instead of interaction springs.

**Header morph**, the signature: a transparent full-width bar that becomes a
floating glass pill on scroll.

```
base:     h-14 sm:h-16, max-w-4xl, transparent
scrolled: mt-3, h-11 sm:h-12, max-w-[calc(100%-1.5rem)] sm:max-w-2xl,
          bg #d9d9d9/50, border #8f8f8f/30, backdrop-blur-xl + saturate-125,
          glass shadow (inset 0 1px 0 white/.35, inset 0 -1px 0 white/.12,
          0 1px 1px black/.06, 0 8px 24px black/.10)
motion:   700ms cubic-bezier(0.32, 0.72, 0, 1) on
          max-width/height/margin/padding/background/border/shadow
```

Drive it with a `data-scrolled` attribute and CSS. The header keeps constant
flow height; only the inner pill morphs. A faint noise texture at
`mix-blend-overlay` fades in with the glass. Menus opening from the header use
PANEL (550/38); the slow clock is for scroll only.

**Reveals**, one primitive:

```css
.reveal { opacity: 0; translate: 0 14px;
          transition: opacity .7s ease-out, translate .7s ease-out;
          transition-delay: var(--reveal-delay, 0s); }
.reveal.is-inview { opacity: 1; translate: 0 0; }
```

IntersectionObserver, `rootMargin: 0 0 -10% 0`, fires once then disconnects.
Stagger in 80ms beats (hero: 80/160/320); three staggered children is the
maximum. 14px is the whole travel.

**Hero**: display Inter Tight 500 `tracking-tight text-wrap:balance`, the
muted half of the sentence in `text-muted-foreground`; two CTAs max (primary +
"see the demo" that opens the real product); shots in squircle frames on a
slightly springier reveal (420/30-34).

**Furniture**: eyebrows `text-xs uppercase tracking-[0.12em]` only where
needed; numbered markers only for true sequences; pricing highlights the
recommended tier by accent border, not scale; FAQ is plain disclosure rows on
the measured-height choreography.

---

## 7. Copy

- Sentence case everywhere; small words, short sentences; one sentence per
  thought.
- Name things by what people control (notifications, not webhook config).
- Buttons say what happens and keep their name through the flow ("Save
  changes" → toast "Saved"); destructive confirms name the object.
- Errors name the cause and the way out; never apologize, never exclaim,
  never blame. Report all field problems at once.
- Empty states are invitations: bold claim of the state + plain next step +
  one action.
- Waiting states say what is awaited and how long it usually takes; promise
  only measured durations.
- Never claim what the system has not confirmed ("Confirming your payment…"
  until the source of truth answers).
- Numbers: tabular in columns, compact for big counts, absolute dates where a
  decision hangs on them.

---

## 8. Quality floor

Non-negotiable on every screen: visible keyboard focus
(`focus-visible:ring-[3px]` ring/50), `aria-hidden` on decorative elements,
`role="status"` on notices, labels tied to inputs, `prefers-reduced-motion`
respected, no horizontal page scroll, and real content in mocks, never lorem.

---

Stack assumptions: React + Tailwind v4 + the `motion` package; but everything
above is plain CSS values and spring constants, so port freely. If the
project already has a design system, it wins; use this to fill gaps.

MIT licensed. From the makers of Open Analytics: https://getopen.so
