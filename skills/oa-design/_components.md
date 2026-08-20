# Components (prose guide)

The component patterns in prose, cross-referenced and stack-agnostic. The
numbered recipe files beside this one carry the same patterns with the full
type-checked React source embedded; read this file for the reasoning and the
values, read a recipe when you are building that component.

## The squircle surface

The signature silhouette: continuous-curvature corners (Apple-style), not
circular arcs. Implemented as a CSS `shape()` clip-path parameterized by two
custom properties, with `corner-shape: squircle` where supported:

```css
.squircle {
  border-radius: 26px;                 /* fallback + the layout's idea of the shape */
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
/* desktop steps the whole silhouette up */
@media (min-width: 640px) {
  .squircle { border-radius: 50px; --card-clip-radius: 20px; --card-clip-handle: 3px; }
}
```

## The mini card (two-layer anatomy)

Every data card is the same sandwich:

```
outer squircle: bg-card, border border-border, p-1,
                shadow 0 1px 2px rgba(0,0,0,0.06)
├── header strip: flex justify-between, pb-2 pl-3.5 pr-2 pt-1.5
│   ├── icon (16px, muted) + title (text-sm font-medium text-foreground/80)
│   ├── optional status chip on the title's own centreline
│   └── "See all ›" (text-xs muted, hover: accent wash + arrow slides 2px)
└── inner squircle: bg #f6f6f6, border, rounded-[22px] sm:rounded-[44px],
                    FIXED height (h-44 = five 32px rows + py-2)
    └── the rows
```

Load-bearing details:

- **Fixed height.** Cards never grow with their data; longer lists scroll
  inside the inset. The grid's baseline is sacred.
- **Scroll affordance.** When content overflows, a 24px round chip with a
  chevron sits bottom-right, bobbing (`y: [0, 2.5, 0]`, 1.4s, easeInOut,
  repeat). At the end of the scroll it fades out (`opacity/scale 0.7`, 0.18s)
  so it never covers the last row's numbers. Scrollbars are hidden; a bottom
  scroll fade masks mid-list overlap.
- **Rows.** 32px tall, full-bleed hover wash (`--accent`), percentage bars
  behind the numbers where relevant, `tabular-nums` on the values.

## Buttons

All buttons are pills (`rounded-full` base with size-specific `rounded-lg` on
compact sizes), `font-medium`, and physically press:

```
active:translate-y-px active:scale-[0.98]
```

Variants:

- **default (primary)**: the accent blue with a crafted bevel: border and
  background are `color-mix` of primary toward a deep indigo (#3a3480), plus
  `inset 0 1px 0 rgba(255,255,255,0.22)` on top and a dark inset at the
  bottom. Hover lightens toward pure primary.
- **secondary**: flat `--secondary` grey, transparent border, hover mixes 5%
  ink in. This is the workhorse: footer actions, "Back", notice buttons.
- **ghost**: text-only muted, for tertiary actions.
- **destructive**: red fill, reserved for the confirm step itself.

Sizes: default h-9, sm h-8, xs h-7 (the app chrome mostly runs on xs and sm).

Loading: the button keeps its label, gains a 14px ring spinner
(`border-2 border-current border-t-transparent`, spinning) on the left, and
sets `aria-disabled`. Never swap the label for the spinner; the width must not
jump.

Focus: `focus-visible:ring-[3px]` in `--ring` at 50% opacity. Never remove it.

## Dropdown panels (user menu, interval select, site switcher)

One pattern everywhere:

- Trigger is a pill; open state anchors a floating panel with the floating
  shadow (`0 1px 2px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.08)`), border,
  `rounded-2xl`+, white background.
- Enter/exit: `opacity 0 → 1` with a small `y`/`scale` offset on the panel,
  spring `550/38`. Exit is faster than enter (a closing menu should get out of
  the way).
- Items: 32px rows, `rounded-lg`, hover = accent wash, the active item gets a
  moving highlight rather than each item repainting (see `motion.md`).
- Close on outside pointerdown and on Escape, always.

## Modals and dialogs

Modals pop, they do not slide from an edge:

- Backdrop: black at low opacity, fading in over ~0.15s.
- Panel: spring in at `400/26` from `opacity 0, scale ~0.96`, exit at
  `380/28`. Content inside can slide directionally between steps.
- Multi-step dialogs (create flows) keep ONE panel whose height animates to
  the measured size of each step (spring `550/40`, ResizeObserver on the
  border box) while steps slide horizontally through it (`x: ±12px`,
  popLayout). The panel is the constant; the content is what travels.
- Footer strip: a fixed-height row (h-12) holding "Back" (secondary, xs) and
  the primary action (xs), right-aligned. Escape-hatch actions ("I'll do this
  later") are secondary and honest: only offer one when leaving truly is safe.

## Tab bar

The floating dashboard tab bar is a pill window with a sliding label:

- The active pill is a fixed window; labels are a strip sliding behind it. The
  incoming label enters from the travel direction at `110%` of its own width;
  the outgoing one exits a fixed `130px` the other way (a percentage would
  leave the old label's tail visible when the pill is growing toward a longer
  word). Both ride the `550/40` spring, clipped by the pill's mask, full
  opacity throughout: it reads as one label becoming the next.
- Pill width and height follow the measured label via springs (`550/40`).
- Icon-only collapsed states get tooltips; rows swap with a `±16px x` slide
  plus fade.

## Skeletons

Three rules, in order of importance:

1. **Chrome never waits.** Frames, headers, titles, toggles render real on the
   first frame; only the data area is skeleton.
2. **Pixel-matched.** A skeleton line sits inside the same line-height slot as
   the text it stands for (`flex h-6 items-center` wrapping a `h-3` bar), so
   the swap moves nothing. Mock the real layout, not a generic shimmer block.
3. **Arrive by focus, not by pop.** When data lands, run a one-shot
   animation from `opacity ~0.4 + blur(4px)` to sharp (an animation, not a
   transition: the content mounts already in its final state, and a
   transition would have no previous value to run from). Keep
   `filter: blur(0)` on the element afterwards.

The bar itself: `rounded bg-muted-foreground/15`, pulsing by a slow
`background-position` sweep (2s linear infinite, started at -1s so two bars
are never in phase).

## Notices, empty states, and the floating pill

**Notice strip** (inline, above the content it explains):

```html
<div class="flex flex-col gap-2 rounded-2xl border border-border bg-card
            px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
     role="status">
  <p class="text-sm leading-6 text-muted-foreground">
    <span class="font-medium text-foreground">No events yet.</span>
    If the snippet is live, browse your site and we'll pick up the first
    pageview within seconds.
  </p>
  <button class="…secondary sm pill…">Check the install</button>
</div>
```

One bold opening claim, one grey sentence, one secondary action. Stacks under
`sm:`. Lives exactly as long as the state does; no dismiss button.

**Floating pill** (app-wide standing conditions, e.g. a failed payment):
fixed, `top-16`, centered, `rounded-full bg-card py-1.5 pl-3 pr-4 text-xs
font-medium`, floating shadow, a 8px status dot (pulsing when urgent), spring
in at `400/30` from `y: -8`, exit 0.15s. The whole pill is a link to where the
state is resolved. State pills never dismiss themselves; event pills retire
after ~6s.

**Empty states** invite the one next action; they never apologize and never
show a ghost of fake data without labeling it as sample.

## Toasts

Two physical signatures, both under 0.35s, easing `cubic-bezier(0.5, 1, 0.89, 1)`:

- **Success**: a contented pulse. `scale 1 → 1.025 → 0.99 → 1` over 0.32s.
- **Error**: a refusal shake. `translateX 0 → -3px → 3px → -3px → 0` over 0.28s.

Alternate two identical keyframe sets (odd/even) so repeated toasts of the
same kind still restart their animation.
