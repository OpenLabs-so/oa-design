# Header morph

## When to use

Marketing/landing headers. The signature: a transparent full-width bar that
morphs into a floating glass pill on scroll.

## The values

```
base:     h-14 sm:h-16, max-w-4xl, transparent, borderless
scrolled: mt-3, h-11 sm:h-12, max-w-[calc(100%-1.5rem)] sm:max-w-2xl,
          bg #d9d9d9/50, border #8f8f8f/30, backdrop-blur-xl + saturate-125,
          glass shadow (inset 0 1px 0 white/.35, inset 0 -1px 0 white/.12,
          0 1px 1px black/.06, 0 8px 24px black/.10)
motion:   700ms cubic-bezier(0.32, 0.72, 0, 1)
```

## Rules

- Drive it with a `data-scrolled` attribute and CSS transitions, never by
  animating styles from JS: one composited interpolation.
- The wrapper keeps a CONSTANT flow height; only the inner pill morphs, so
  the page never reflows under it.
- The slow clock belongs to scroll effects only. Menus opening from the
  header use PANEL (550/38); icon swaps inside them use FLICK (900/50).
- Optional: a faint noise texture at `mix-blend-overlay` fading in with the
  glass keeps the blur from looking plastic.

## Usage

```tsx
<HeaderMorph>
  <a href="/" className="…logo…">Acme</a>
  <nav className="…links…" />
  <Button size="xs">Get started</Button>
</HeaderMorph>
```

## Code

Type-checked source, also at `components/header-morph/`.

<!-- oa:code components/header-morph/header-morph.tsx -->
```tsx
"use client";

import * as React from "react";
import { cn } from "../_lib/cn";

/**
 * The landing header's signature: a transparent full-width bar that morphs
 * into a floating glass pill on scroll.
 *
 * Implementation rules that carry the effect:
 *
 * - Drive it with a `data-scrolled` attribute and CSS transitions, never by
 *   animating styles from JS: the browser interpolates max-width, height,
 *   background and shadow in one composited pass.
 * - The wrapper keeps a CONSTANT flow height; only the pill inside morphs,
 *   so the page never reflows under it.
 * - The clock is slow on purpose: 700ms cubic-bezier(0.32, 0.72, 0, 1). The
 *   slow clock belongs to scroll effects only; menus opening from the header
 *   stay on the app's PANEL spring.
 */
export function HeaderMorph({
  threshold = 8,
  stickyTop = "top-0",
  children,
  className,
}: {
  /** Scroll-Y in px after which the pill state engages. */
  threshold?: number;
  /** Pass the height of a bar above (e.g. an announcement bar), as a class. */
  stickyTop?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return (
    <header
      data-scrolled={scrolled}
      className={cn("group sticky z-40 h-16 sm:h-20", stickyTop, className)}
    >
      <div
        className={cn(
          "relative mx-auto flex h-14 w-full max-w-full items-center justify-between rounded-full border border-transparent px-0 sm:h-16 sm:max-w-4xl sm:px-4",
          "transition-[max-width,height,margin,padding,background-color,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
          // the pill state: narrower, shorter, glassed
          "group-data-[scrolled=true]:mt-3 group-data-[scrolled=true]:h-11 sm:group-data-[scrolled=true]:h-12",
          "group-data-[scrolled=true]:max-w-[calc(100%-1.5rem)] sm:group-data-[scrolled=true]:max-w-2xl",
          "group-data-[scrolled=true]:border-[#8f8f8f]/30 group-data-[scrolled=true]:bg-[#d9d9d9]/50",
          "group-data-[scrolled=true]:px-2 sm:group-data-[scrolled=true]:px-2.5",
          "group-data-[scrolled=true]:backdrop-blur-xl group-data-[scrolled=true]:backdrop-saturate-125",
          "group-data-[scrolled=true]:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(255,255,255,0.12),0_1px_1px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.10)]"
        )}
      >
        {children}
      </div>
    </header>
  );
}
```
<!-- /oa:code -->
