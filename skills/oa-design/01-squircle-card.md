# Squircle card

## When to use

Any data surface: stat cards, top-N lists, chart frames, settings panels.
This is THE surface of the system; a plain `rounded-xl` card next to these
reads as foreign.

## Anatomy

A two-layer sandwich: a white squircle frame (`p-1`, hairline border, resting
shadow) with a title strip, holding a recessed grey squircle inset with a
FIXED height (`h-44` = five 32px rows). Cards never grow with their data;
longer lists scroll inside the inset, so a grid's baseline never breaks. The
silhouette is a CSS `shape()` clip-path with continuous-curvature corners
(`corner-shape: squircle` where supported), parameterized by
`--card-clip-radius` and `--card-clip-handle`, stepping up at `sm:`.

## Usage

```tsx
<SquircleCard title="Top sources" icon={<GlobeIcon aria-hidden="true" />} seeAllHref="/sources">
  <SquircleCardRow label="google.com" value="1,204" />
  <SquircleCardRow label="x.com" value="486" />
</SquircleCard>
```

## Tunables

| Knob | Default | Notes |
| --- | --- | --- |
| frame radius / clip | `26px / 14px / 2.25px` | `50px / 20px / 3px` at `sm:` |
| inset radius / clip | `22px / 12px` | `44px / 17px` at `sm:` |
| inset height | `h-44` | five 32px rows + `py-2`; override via `contentClassName` |
| inset background | `#f6f6f6` | the stage color; `--background` in dark |

## Code

Type-checked source, also at `components/squircle-card/`.

<!-- oa:code components/squircle-card/squircle-card.tsx -->
```tsx
"use client";

import * as React from "react";
import { cn } from "../_lib/cn";

/**
 * The OA surface: continuous-curvature (squircle) corners via a CSS `shape()`
 * clip-path, with `corner-shape: squircle` where the browser supports it.
 * Two custom properties parameterize the silhouette so one path serves every
 * size: `--card-clip-radius` (corner size) and `--card-clip-handle` (how far
 * the curve's control points sit from the corner).
 *
 * The standard mini card is a two-layer sandwich: a white frame (`p-1`) with
 * a title strip, holding a recessed grey inset with a FIXED height. Cards
 * never grow with their data; longer lists scroll inside the inset, so a
 * grid's baseline never breaks.
 */

const CARD_CLIP_PATH =
  "shape(from var(--card-clip-radius) 0px, line to calc(100% - var(--card-clip-radius)) 0px, curve to 100% var(--card-clip-radius) with calc(100% - var(--card-clip-handle)) 0px / 100% var(--card-clip-handle), line to 100% calc(100% - var(--card-clip-radius)), curve to calc(100% - var(--card-clip-radius)) 100% with 100% calc(100% - var(--card-clip-handle)) / calc(100% - var(--card-clip-handle)) 100%, line to var(--card-clip-radius) 100%, curve to 0px calc(100% - var(--card-clip-radius)) with var(--card-clip-handle) 100% / 0px calc(100% - var(--card-clip-handle)), line to 0px var(--card-clip-radius), curve to var(--card-clip-radius) 0px with 0px var(--card-clip-handle) / var(--card-clip-handle) 0px, close)";

type SquircleStyle = React.CSSProperties & {
  "--card-clip-handle"?: string;
  "--card-clip-path"?: string;
  "--card-clip-radius"?: string;
};

export function SquircleSurface({
  className,
  style,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="squircle-surface"
      className={cn(
        "relative flex min-w-0 flex-col rounded-[26px] bg-card text-card-foreground",
        "[--card-clip-handle:2.25px] [--card-clip-radius:14px] [clip-path:var(--card-clip-path)] [corner-shape:squircle]",
        "sm:rounded-[50px] sm:[--card-clip-handle:3px] sm:[--card-clip-radius:20px]",
        className
      )}
      style={{ "--card-clip-path": CARD_CLIP_PATH, ...style } as SquircleStyle}
      {...props}
    >
      {children}
    </div>
  );
}

export interface SquircleCardProps {
  /** Header label shown in the frame's top strip. */
  title: React.ReactNode;
  /** Optional 16px header icon; tinted muted automatically. */
  icon?: React.ReactNode;
  /** The inset panel's content, typically 32px rows. */
  children: React.ReactNode;
  /** "See all" in the header strip; omit both to hide it. */
  seeAllHref?: string;
  onSeeAll?: () => void;
  className?: string;
  /** Override the inset (e.g. a different fixed height than `h-44`). */
  contentClassName?: string;
}

export function SquircleCard({
  title,
  icon,
  children,
  seeAllHref,
  onSeeAll,
  className,
  contentClassName,
}: SquircleCardProps) {
  const seeAll =
    "group/seeall flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 hover:bg-accent/60 hover:text-foreground";
  const arrow = (
    <span
      aria-hidden="true"
      className="transition-transform duration-200 group-hover/seeall:translate-x-0.5"
    >
      ›
    </span>
  );
  return (
    <SquircleSurface
      className={cn(
        "border border-border p-1 shadow-[0_1px_2px_rgba(0,0,0,0.06)]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 pb-2 pl-3.5 pr-2 pt-1.5">
        <h2 className="ml-1 flex min-w-0 items-center gap-2 text-sm font-medium text-foreground/80 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground">
          {icon}
          {title}
        </h2>
        {onSeeAll ? (
          <button type="button" onClick={onSeeAll} className={cn(seeAll, "cursor-pointer")}>
            See all {arrow}
          </button>
        ) : seeAllHref ? (
          <a href={seeAllHref} className={seeAll}>
            See all {arrow}
          </a>
        ) : null}
      </div>
      <SquircleSurface
        className={cn(
          // Five 32px rows + py-2. overflow-hidden clips row hover washes to
          // the rounded corners on the first and last rows.
          "h-44 overflow-hidden rounded-[22px] border border-border bg-[#f6f6f6] py-2 shadow-[0_1px_2px_rgba(0,0,0,0.06)] [--card-clip-radius:12px] sm:rounded-[44px] sm:[--card-clip-radius:17px]",
          "dark:bg-background",
          contentClassName
        )}
      >
        {children}
      </SquircleSurface>
    </SquircleSurface>
  );
}

/** A standard inset row: 32px tall, full-bleed hover wash, tabular numbers. */
export function SquircleCardRow({
  label,
  value,
  className,
}: {
  label: React.ReactNode;
  value?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-8 items-center justify-between gap-3 px-3.5 text-sm transition-colors hover:bg-accent",
        className
      )}
    >
      <span className="min-w-0 truncate">{label}</span>
      {value !== undefined ? (
        <span className="shrink-0 tabular-nums text-muted-foreground">
          {value}
        </span>
      ) : null}
    </div>
  );
}
```
<!-- /oa:code -->
