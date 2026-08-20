# Floating pill

## When to use

The one word the app chrome speaks: an app-wide condition worth interrupting
for (a failed renewal, a payment being confirmed). Centered under the header,
fixed `top-16`, on every screen.

## Rules

- Springs in at BANNER (400/30) from 8px above; exits in 0.15s.
- Two kinds, one shape: a STATE pill never dismisses itself (ending the state
  is the dismissal) and links to where the state is resolved; an EVENT pill
  retires itself after ~6s.
- The 8px dot carries the tone; it pulses only when urgent.
- Never stack pills; if two conditions hold, the more urgent one wins.

## Usage

```tsx
<FloatingPill show={paymentFailed} tone="bad" urgent href="/billing">
  The last payment failed. Update your card
</FloatingPill>
```

## Code

Type-checked source, also at `components/floating-pill/`.

<!-- oa:code components/floating-pill/floating-pill.tsx -->
```tsx
"use client";

import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { cn } from "../_lib/cn";
import { BANNER } from "../_lib/springs";

/**
 * The floating pill: the one word the app chrome speaks, centered under the
 * header on every screen, shown only while something is worth interrupting
 * for. Springs in at BANNER (400/30) from 8px above, leaves in 0.15s.
 *
 * Two kinds, one shape:
 * - A STATE pill (a failed payment, a sync problem) never dismisses itself;
 *   it describes a condition and ending the condition is the dismissal. The
 *   whole pill links to where the condition is resolved.
 * - An EVENT pill (a confirmation just landed) retires itself after ~6s.
 *
 * The dot carries the tone: pulsing destructive for urgent states, success
 * green for good news, muted for neutral notes.
 */
export function FloatingPill({
  show,
  tone = "neutral",
  urgent = false,
  href,
  onClick,
  children,
  className,
}: {
  show: boolean;
  tone?: "neutral" | "good" | "bad";
  /** Pulse the dot. */
  urgent?: boolean;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const pill = cn(
    "pointer-events-auto flex items-center gap-2 rounded-full bg-card py-1.5 pl-3 pr-4 text-xs font-medium",
    "shadow-[0_1px_2px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.08)] ring-1 ring-border outline-none",
    "transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
  );
  const dot = (
    <span
      aria-hidden="true"
      className={cn(
        "size-2 rounded-full",
        tone === "bad" && "bg-destructive",
        tone === "good" && "bg-success-foreground",
        tone === "neutral" && "bg-muted-foreground",
        urgent && "animate-pulse"
      )}
    />
  );
  const body = (
    <>
      {dot}
      {children}
    </>
  );
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "pointer-events-none fixed inset-x-0 top-16 z-30 flex justify-center px-4",
            className
          )}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
          initial={{ opacity: 0, y: -8 }}
          transition={BANNER}
        >
          {href ? (
            <a className={pill} href={href}>
              {body}
            </a>
          ) : (
            <button className={cn(pill, "cursor-pointer")} onClick={onClick} type="button">
              {body}
            </button>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
```
<!-- /oa:code -->
