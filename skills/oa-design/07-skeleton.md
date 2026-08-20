# Skeleton

## When to use

Every data wait. Three rules, in order of importance:

1. **Chrome never waits.** Frames, titles and toggles render real on the
   first frame; only the data area is skeleton.
2. **Pixel-matched.** A bar sits inside the same line-height slot as the text
   it stands for, so the swap moves nothing. Mock the real layout, never a
   generic shimmer block.
3. **Arrive by focus, not by pop.** Landing data plays `.oa-arrive`
   (`_root.css`): a one-shot animation from `opacity 0.4 + blur(4px)` to
   sharp. An animation, not a transition: the content mounts already final,
   and a transition would have no previous value to run from.

## Usage

```tsx
{data === null ? (
  <div className="flex flex-col gap-1 px-3.5">
    <SkeletonLine bar="h-3 w-2/3" />
    <SkeletonLine bar="h-3 w-1/2" />
  </div>
) : (
  <Arrive>
    {data.rows.map((row) => <SquircleCardRow key={row.id} label={row.name} value={row.count} />)}
  </Arrive>
)}
```

## Code

Type-checked source, also at `components/skeleton/`. Requires the
`oa-skeleton` / `oa-arrive` keyframes from `_root.css`.

<!-- oa:code components/skeleton/skeleton.tsx -->
```tsx
"use client";

import * as React from "react";
import { cn } from "../_lib/cn";

/**
 * OA skeletons obey three rules, in order:
 *
 * 1. Chrome never waits. Frames, titles and toggles render real on the first
 *    frame; only the data area is skeleton.
 * 2. Pixel-matched. A bar sits inside the same line-height slot as the text
 *    it stands for, so the swap moves nothing. Mock the real layout, never a
 *    generic shimmer block.
 * 3. Data arrives by focus, not by pop: a one-shot blur+opacity ANIMATION
 *    (`.oa-arrive` in _root.css). An animation, not a transition, because the
 *    content mounts already in its final state and a transition would have no
 *    previous value to run from.
 */

/** One grey bar. Size it with width/height utilities at the call site. */
export function SkeletonBar({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("block rounded bg-muted-foreground/15", className)}
    />
  );
}

/** A text-line slot: the bar centered in the same line-height as the text it
 *  stands for. `slot` is the line height (h-6 for leading-6 text-sm). */
export function SkeletonLine({
  slot = "h-6",
  bar = "h-3 w-2/3",
}: {
  slot?: string;
  bar?: string;
}) {
  return (
    <span className={cn("flex items-center", slot)}>
      <SkeletonBar className={cn("max-w-full", bar)} />
    </span>
  );
}

/** Wrap arriving content: children mount with the blur-reveal. */
export function Arrive({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("oa-arrive", className)}>{children}</div>;
}
```
<!-- /oa:code -->
