"use client";

import * as React from "react";
import { cn } from "../_lib/cn";

/**
 * The marketing scroll reveal. Pure CSS transition (`.reveal` in _root.css:
 * opacity + 14px of travel over 0.7s ease-out) driven by an
 * IntersectionObserver that fires ONCE and disconnects: reveals never replay
 * on scroll-up.
 *
 * `rootMargin: 0 0 -10% 0` means the element is genuinely on screen before
 * it plays. Stagger siblings in 80ms beats (80 / 160 / 320); three staggered
 * children is the tasteful maximum. Reduced-motion users see everything
 * immediately (handled in the CSS).
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  /** Transition delay in ms, for staggering siblings. */
  delay?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          node.classList.add("is-inview");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal", className)}
      style={delay ? { ["--reveal-delay" as string]: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
