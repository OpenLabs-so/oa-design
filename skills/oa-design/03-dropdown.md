# Dropdown

## When to use

User menus, interval selects, site switchers, contextual menus: anything
that opens from a trigger and floats. One pattern serves them all.

## Rules

- Panel springs open in place at PANEL (550/38) from a 4px offset and 0.98
  scale; exit is a 0.1s fade because a closing menu should get out of the way.
- Floating shadow, hairline border, white panel, `rounded-2xl`, `p-1`.
- Items are 32px `rounded-lg` rows with the accent hover wash; a selected
  item keeps the wash (`selected`).
- Outside pointerdown and Escape always close. Manners, not options.
- The active highlight in segmented variants travels as one shared element;
  never per-item background flips.

## Usage

```tsx
<Dropdown trigger={(open) => <span className="…pill…">Last 7 days</span>}>
  <DropdownItem selected onSelect={() => pick("7d")}>Last 7 days</DropdownItem>
  <DropdownItem onSelect={() => pick("30d")}>Last 30 days</DropdownItem>
  <DropdownSeparator />
  <DropdownItem destructive onSelect={signOut}>Sign out</DropdownItem>
</Dropdown>
```

## Code

Type-checked source, also at `components/dropdown/`.

<!-- oa:code components/dropdown/dropdown.tsx -->
```tsx
"use client";

import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { cn } from "../_lib/cn";
import { PANEL } from "../_lib/springs";

/**
 * The OA dropdown: a pill trigger anchoring a floating panel.
 *
 * One pattern serves the user menu, the interval select, the site switcher
 * and every contextual menu: the panel springs open in place (PANEL, 550/38)
 * from a small offset and leaves faster than it arrived, because a closing
 * menu should get out of the way. Items are 32px rows with the accent hover
 * wash. Outside pointerdown and Escape always close; that is the pattern's
 * manners, not an option.
 */

export function Dropdown({
  trigger,
  children,
  align = "end",
  className,
  panelClassName,
}: {
  /** Render the trigger; receives open state for styling. */
  trigger: (open: boolean) => React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "end";
  className?: string;
  panelClassName?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative inline-flex", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        className="cursor-pointer outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 rounded-full"
      >
        {trigger(open)}
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: -4,
              scale: 0.98,
              transition: { duration: 0.1 },
            }}
            transition={PANEL}
            className={cn(
              "absolute top-full z-40 mt-2 min-w-44 origin-top rounded-2xl border border-border bg-popover p-1",
              "shadow-[0_1px_2px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.08)]",
              align === "end" ? "right-0" : "left-0",
              panelClassName
            )}
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/** A 32px menu row. `selected` gets the wash permanently, like an interval
 *  select's current choice. */
export function DropdownItem({
  children,
  onSelect,
  selected = false,
  destructive = false,
  className,
}: {
  children: React.ReactNode;
  onSelect?: () => void;
  selected?: boolean;
  destructive?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onSelect}
      className={cn(
        "flex h-8 w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 text-sm outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-ring/50",
        destructive
          ? "text-destructive-foreground hover:bg-destructive/10"
          : "hover:bg-accent",
        selected && "bg-accent font-medium",
        className
      )}
    >
      {children}
    </button>
  );
}

/** A hairline between item groups; use sparingly. */
export function DropdownSeparator() {
  return <div className="mx-2 my-1 h-px bg-border" aria-hidden="true" />;
}
```
<!-- /oa:code -->
