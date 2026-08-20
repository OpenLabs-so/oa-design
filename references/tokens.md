# Tokens

Every value below ships in the product. The system's one idea: **derive, don't
pick**. A neutral is never chosen by eye; it is `--ink` mixed into transparency
at a stated percentage, so every grey in the app agrees by construction.

## Light theme

```css
:root {
  --ink: #292929;

  /* stage and surfaces */
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

  /* the one accent, and its focus ring */
  --primary: #305dde;
  --primary-foreground: #ffffff;
  --ring: #3ba6f1;

  /* secondary controls: flat grey, no border */
  --secondary: #e9e9e9;
  --secondary-foreground: var(--ink);

  /* semantic, as text tints on light (Tailwind scale, 700 weight) */
  --destructive: var(--color-red-500);
  --destructive-foreground: var(--color-red-700);
  --success: var(--color-emerald-600);
  --success-foreground: var(--color-emerald-700);
  --warning: var(--color-amber-500);
  --warning-foreground: var(--color-amber-700);
  --info: var(--color-blue-500);
  --info-foreground: var(--color-blue-700);

  /* charts: primary line is the accent's chart cousin */
  --chart-1: #296FF0;

  --radius: 0.625rem;
}
```

Rules that follow from it:

- Need a slightly stronger divider? Raise the ink percentage, do not reach for
  a grey hex. The product itself uses only 4, 5, 10, 12, 14 percent.
- Semantic colors are for words and small dots, not for panel fills. A success
  state is a sentence with an emerald dot, not a green card.
- `--primary` appears on primary buttons and the primary chart line and almost
  nowhere else. If a screen has the accent in three places, remove two.

## Dark theme

Same construction, re-inked. Dark is not an inversion; it is the same recipe
run from a light ink on near-black surfaces:

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
  --primary: #296FF0;   /* one notch brighter than light's #305dde */
  /* semantic tints move from the 700 row to the 400 row */
  --destructive-foreground: var(--color-red-400);
  --success-foreground: var(--color-emerald-400);
}
```

Note the two systematic shifts: border/input percentages rise by 2 points
(hairlines need more presence on dark), and semantic text moves from 700-row
to 400-row so it stays legible without glowing.

## Radius scale

One base, multiplied. Never a bespoke radius on a one-off element:

```css
--radius: 0.625rem;                       /* 10px */
--radius-sm: calc(var(--radius) * 0.6);
--radius-md: calc(var(--radius) * 0.8);
--radius-lg: var(--radius);
--radius-xl: calc(var(--radius) * 1.4);
--radius-2xl: calc(var(--radius) * 1.8);  /* notices, strips */
--radius-3xl: calc(var(--radius) * 2.2);
--radius-4xl: calc(var(--radius) * 2.6);
```

Fully round (`rounded-full`) is reserved for pills: buttons, tabs, chips, the
floating banner. Squircle surfaces carry their own larger radii (see
`components.md`).

## Typography

- **Inter Tight**, variable, weight range **300 to 500**, self-hosted (a font
  CDN is a build-time network dependency, and it has failed in production;
  keep the woff2 in the repo). `--font-sans`.
- **Geist Mono**, 400 to 500, for code, keys, snippets. `--font-mono`, and it
  is applied to `code, kbd, samp, pre` at the base layer.
- **The weight ceiling is the identity.** `font-semibold` and `font-bold` do
  not exist visually; the variable font clamps at 500, so hierarchy comes from
  size, color (`text-foreground/80` vs `text-muted-foreground`) and spacing,
  never from heaviness.
- Headings: `font-medium tracking-tight`, with `text-wrap: balance` on
  marketing headlines.
- Data: `tabular-nums` on anything numeric that sits in a column or updates in
  place. Money and counts always.
- Body sizes run small: 14px (`text-sm`) is the default UI voice, 12px
  (`text-xs`) for secondary lines, with `leading-5` or `leading-6` giving the
  air.

## Shadows

Two shadows in the whole product:

```css
/* resting card */
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);

/* floating chrome: dropdown panels, the fixed pill banner */
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.08);
```

Elevation is binary: a thing is resting or it is floating. There is no
ten-step elevation ramp, and blur-heavy halos read as foreign.

## Background discipline

The page `body` is **white**, not the grey stage: the body is what shows
through overscroll bounce, and grey peeking past a white screen reads as a
different page. Screens that want the grey stage (login, onboarding) paint
their own full-height backdrop. Set `overflow-x: clip` on the root so nothing
ever produces a horizontal scrollbar.
