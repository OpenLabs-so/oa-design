# Landing and marketing pages

The landing speaks the same token language as the app but moves on a slower
clock: scroll-driven CSS reveals instead of interaction springs. It should
feel like the calm older sibling of the dashboard, not a different company.

## Page shape

- One frame: `max-w-6.5xl` (76rem), `px-4 sm:px-6`, sections stacked with
  `gap-12 sm:gap-20`, `pb-12 sm:pb-20`.
- Sections are plates (see `layout.md`): each one a panel, the page background
  the only divider. The frame draws no rules of its own.
- Order earns its place: hero, product proof (screenshots/live numbers), how
  it works, features, comparison, pricing, FAQ, closing CTA. Cut sections
  before shrinking them.
- Copy is concrete: the hero states the outcome in one sentence, the CTA verbs
  are real actions, and nothing says "supercharge".

## The header morph

The header is the landing's signature move. It starts as a full-width
transparent bar and, on scroll, morphs into a floating glass pill:

```
base:      h-14 sm:h-16, max-w-4xl, transparent, borderless
scrolled:  mt-3, h-11 sm:h-12, max-w-[calc(100%-1.5rem)] sm:max-w-2xl,
           bg #d9d9d9/50, border #8f8f8f/30, backdrop-blur-xl,
           backdrop-saturate-125, glass shadow:
           inset 0 1px 0 rgba(255,255,255,.35),
           inset 0 -1px 0 rgba(255,255,255,.12),
           0 1px 1px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.10)
transition: max-width, height, margin, padding, background-color,
            border-color, box-shadow
            over 700ms cubic-bezier(0.32, 0.72, 0, 1)
```

Implementation notes that matter:

- Drive it with a `data-scrolled` attribute and CSS, not by animating styles
  from JS; the browser interpolates everything in one composited pass.
- The header keeps a constant flow height; only the pill inside morphs, so the
  page never reflows under it.
- A faint noise texture at `mix-blend-overlay` fades in with the glass
  (opacity 0 to 1 over the same 700ms) to keep the blur from looking plastic.
- Menus that open from the header (logo menu, mobile menu) use the app's
  PANEL spring (`550/38`); icon swaps inside them use FLICK (`900/50`). The
  slow clock is for scroll effects only; pointer interactions stay snappy.

## Scroll reveals

One primitive, used everywhere:

```css
.reveal {
  opacity: 0;
  translate: 0 14px;
  transition: opacity 0.7s ease-out, translate 0.7s ease-out;
  transition-delay: var(--reveal-delay, 0s);
}
.reveal.is-inview { opacity: 1; translate: 0 0; }
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; translate: 0 0; transition: none; }
}
```

- Triggered once by an IntersectionObserver with
  `rootMargin: "0px 0px -10% 0px"` (the element is genuinely on screen before
  it plays), then the observer disconnects: reveals never replay on scroll-up.
- Stagger siblings by delay, in beats of 80ms: the hero runs 80 / 160 / 320.
  Three staggered children is the tasteful maximum; a ten-item cascade is a
  loading screen.
- 14px is the whole travel. Sections do not fly in from off-screen.

## Hero

- Headline: display-size Inter Tight at 500, `tracking-tight`,
  `text-wrap: balance`, with the muted half of the sentence in
  `text-muted-foreground` rather than a second font.
- Two CTAs at most: primary (the accent, `size="md"`) and a ghost/secondary
  "see the demo" that opens the real product, not a video.
- Product shots sit in squircle frames with the resting shadow, entering with
  a slightly springier reveal (`420/30-34`) than the text around them.
- If numbers appear (live counters, charts), they are real or clearly sample;
  animated odometers use tabular-nums so nothing jitters.

## Section furniture

- Section eyebrows: `text-xs uppercase tracking-[0.12em] text-muted-foreground`,
  only where the section genuinely needs naming.
- Numbered markers (01/02/03) only when the content is truly a sequence.
- Pricing: cards as plates, the recommended tier marked by the accent border
  rather than a scale transform; the monthly/yearly switch is the app's own
  toggle (PANEL spring), and yearly prices show the real math, not "save 20%".
- FAQ: plain disclosure rows with the measured-height choreography, chevrons
  on FLICK. No accordion library styling.
