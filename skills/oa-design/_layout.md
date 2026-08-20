# Layout

## Which surface is which

The grey stage (`--background`, #f6f6f6) is NOT the app page's background.
App screens sit on a white body; the grey appears as card insets and as the
full-height backdrop of standalone moments (login, onboarding, marketing
plates). A dashboard or settings screen painted grey edge to edge reads as a
different product; when in doubt, the page is white and the grey is inside
the cards.

## Plates, and the gap between them

The page is not divided by rules; it is composed of **plates**. Each section
is a self-contained panel (usually a squircle surface) and the page background
showing between plates is the only boundary. The vertical gaps are generous
(3rem, 5rem on desktop for marketing; 1.5rem inside app screens) while the
side paddings stay tighter (`px-4 sm:px-6`): plates are stacked, so the space
that separates them is the one that has to be read as a boundary.

Consequences:

- No `<hr>`, no full-width border-b between sections.
- A section owns its own internal padding; siblings are spaced by the parent's
  `gap`, never by per-child margins that collapse or double.
- The last plate is not pinned to the viewport bottom; the page ends with the
  same breathing room it uses between plates (`pb-12 sm:pb-20`).

## Widths

Content width is per-scope, not global:

- Marketing frame: `max-w-6.5xl` (76rem, halfway between Tailwind's 6xl and
  7xl).
- Dashboard, site pages: `max-w-6xl`.
- Dashboard, sites list / picker screens: `max-w-5xl`.
- Reading surfaces (docs bodies, legal): roughly 65ch of running text.

Center with `mx-auto`, pad with `px-4 sm:px-6`.

## App page anatomy

```
fixed header (h-14), out of flow
└── page container: pt-14 compensates for it
    ├── optional floating pill (fixed, top-16, centered)  see components.md
    └── <main class="w-full flex-1 px-4 pb-36 pt-8 sm:px-6 bg-white">
        ├── title row: h1 text-xl font-medium tracking-tight
        │              + the screen's one control on the right
        ├── optional notice strip(s)
        └── content plates, flex flex-col gap-6
```

- The title row holds exactly one control (an interval select, an action
  button). Two controls up there means one of them belongs inside a plate.
- `pb-36`: the deep bottom padding is deliberate, content never ends pressed
  against the viewport edge.

## Grids

Card grids are `grid gap-3` (0.75rem) with responsive columns
(`grid-cols-2 sm:grid-cols-4` for stat cards, `sm:grid-cols-2` for content
cards). Cards in a row share a fixed content height and scroll internally
rather than growing with their data, so the grid's baseline never breaks.

## Responsive rules

- Design at 390px and at 1280px; the middle takes care of itself.
- A horizontal arrangement (sentence + button, label + toggle) becomes a
  vertical stack under `sm:` with the action last.
- Wide content (tables, code, charts) scrolls inside its own
  `overflow-x-auto` container. The page body never scrolls sideways; root has
  `overflow-x: clip` as the guarantee.
- Squircle radii and paddings step down on mobile (the components carry both
  values; see `components.md`).

## Settings screens

Settings are a two-column arrangement: a narrow tab rail (labels + icons) and
a content column of section panels. Each section opens with a heading block
outside the panels:

```html
<div class="flex items-start justify-between gap-4 px-1">
  <div>
    <h2 class="text-base font-medium text-foreground/80">Installation</h2>
    <p class="mt-1 text-sm text-muted-foreground">One line on what this group does for you.</p>
  </div>
  <!-- optional: the group's one action, e.g. a docs link -->
</div>
```

Deep-link tabs through the query string (`?tab=installation`) so any screen in
the product can point at a specific settings group.
