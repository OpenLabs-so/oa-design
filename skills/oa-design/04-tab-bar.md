# Tab bar

## When to use

Primary navigation between sibling views: a floating pill row where the
active highlight travels and the active label slides through a masked window.

## The two numbers that make it read right

- **Enter at 110% of the label's own width**: the pill is exactly this label
  wide, so the incoming word always starts fully clear of the mask.
- **Exit a FIXED 130px**, not a percentage: a percentage of the old label
  falls short while the pill is still growing toward a longer word, and the
  old label's tail stays visible inside the wider mask. The constant just has
  to beat the widest pill.

Both ride LAYOUT (550/40) at full opacity; the mask does the work, not a
fade. The highlight is one shared `layoutId` element moving between tabs.

## Usage

```tsx
const [tab, setTab] = React.useState("overview");
<TabBar
  tabs={[
    { id: "overview", label: "Overview", icon: <ChartIcon /> },
    { id: "realtime", label: "Realtime", icon: <PulseIcon /> },
  ]}
  activeId={tab}
  onChange={setTab}
/>
```

## Code

Type-checked source, also at `components/tab-bar/`.

<!-- oa:code components/tab-bar/tab-bar.tsx -->
```tsx
"use client";

import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { cn } from "../_lib/cn";
import { LAYOUT } from "../_lib/springs";

/**
 * The OA tab bar: a floating pill row where the active highlight is one
 * shared element that TRAVELS between tabs, and the active label is a strip
 * sliding through a masked window.
 *
 * The two numbers that make the label swap read as one label becoming the
 * next rather than a crossfade:
 *
 * - Enter is measured in the label's own width (110%): the pill is exactly
 *   this label wide, so the incoming word always starts fully clear of the
 *   mask, whatever its length.
 * - Exit is a FIXED distance (130px), not a percentage: a percentage of the
 *   old label falls short while the pill is still growing toward a longer
 *   word, and the old label's tail stays visible inside the wider mask. The
 *   constant just has to beat the widest pill.
 *
 * Both ride the LAYOUT spring at full opacity; the mask does the work, not a
 * fade. Direction follows the travel: moving right slides labels leftward.
 */

const LABEL_EXIT_PX = 130;

const labelVariants = {
  enter: (dir: number) => ({ x: `${dir * 110}%` }),
  center: { x: "0%" },
  exit: (dir: number) => ({ x: dir * -LABEL_EXIT_PX }),
};

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export function TabBar({
  tabs,
  activeId,
  onChange,
  className,
}: {
  tabs: readonly Tab[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  const activeIndex = tabs.findIndex((tab) => tab.id === activeId);
  const previousIndex = React.useRef(activeIndex);
  const dir = activeIndex >= previousIndex.current ? 1 : -1;
  React.useEffect(() => {
    previousIndex.current = activeIndex;
  }, [activeIndex]);
  const active = tabs[activeIndex];

  return (
    <nav
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-card p-1",
        "shadow-[0_1px_2px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.08)]",
        className
      )}
    >
      {tabs.map((tab) => {
        const selected = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            aria-current={selected ? "page" : undefined}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm font-medium outline-none",
              "transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50",
              selected
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {selected ? (
              // The traveling highlight: one shared element moving between
              // tabs (never per-item background flips; the eye follows the
              // object, repainting reads as flicker).
              <motion.span
                layoutId="oa-tab-pill"
                transition={LAYOUT}
                className="absolute inset-0 rounded-full bg-secondary"
                aria-hidden="true"
              />
            ) : null}
            {tab.icon ? (
              <span className="relative z-10 [&_svg]:size-4">{tab.icon}</span>
            ) : null}
            {/* The masked window: only the active tab shows its label, and
                labels slide through it directionally. */}
            {selected && active ? (
              <span className="relative z-10 overflow-hidden">
                <AnimatePresence custom={dir} initial={false} mode="popLayout">
                  <motion.span
                    key={active.id}
                    custom={dir}
                    variants={labelVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={LAYOUT}
                    className="block whitespace-nowrap"
                  >
                    {active.label}
                  </motion.span>
                </AnimatePresence>
              </span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
```
<!-- /oa:code -->
