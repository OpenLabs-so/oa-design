# Modal

## When to use

Confirmations, focused single-purpose surfaces ("See all" expansions). For
multi-step flows use `06-multi-step-dialog.md` instead.

## Rules

- Modals POP, they never slide from an edge: entrance at POP (400/26) from
  `scale 0.96, y 8`, exit at POP_EXIT (380/28). Exits are always a touch
  softer and faster.
- Backdrop is a plain 0.15s fade at `black/30`; clicking it closes, Escape
  closes.
- Panel: `rounded-3xl`, hairline border, floating shadow, white.

## Usage

```tsx
<Modal open={open} onClose={() => setOpen(false)}>
  <h2 className="text-sm font-medium text-foreground/80">Delete site</h2>
  <p className="mt-2 text-sm text-muted-foreground">This removes the site and its data.</p>
  <div className="mt-4 flex justify-end gap-2">
    <Button size="xs" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
    <Button size="xs" variant="destructive" onClick={remove}>Delete site</Button>
  </div>
</Modal>
```

## Code

Type-checked source, also at `components/modal/`.

<!-- oa:code components/modal/modal.tsx -->
```tsx
"use client";

import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { cn } from "../_lib/cn";
import { POP, POP_EXIT } from "../_lib/springs";

/**
 * The OA modal pops; it never slides from an edge. Entrance at POP (400/26)
 * from a slight shrink, exit at POP_EXIT (380/28): exits are always a touch
 * softer and faster, because a leaving surface should get out of the way.
 * The backdrop is a plain fade and clicking it closes, as does Escape.
 */
export function Modal({
  open,
  onClose,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1, transition: { duration: 0.15 } }}
        >
          <motion.button
            aria-label="Close"
            type="button"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.15 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: POP }}
            exit={{ opacity: 0, scale: 0.96, y: 8, transition: POP_EXIT }}
            className={cn(
              "relative w-full max-w-md rounded-3xl border border-border bg-card p-5",
              "shadow-[0_1px_2px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.08)]",
              className
            )}
          >
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
```
<!-- /oa:code -->
