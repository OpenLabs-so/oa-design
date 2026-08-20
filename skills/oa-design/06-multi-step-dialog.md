# Multi-step dialog

## When to use

Create flows, onboarding, any panel that swaps faces. This is the system's
signature choreography: ONE constant panel, and the content is what travels.

## The choreography

Steps slide horizontally through the panel (12px of travel, 0.16s easeOut
fades, direction-aware: forward slides left, Back slides right) while the
panel's height springs (LAYOUT, 550/40) to each step's measured size.

Three details are load-bearing:

- `mode="popLayout"` pops the exiting step out of flow, so the incoming step
  is what the panel measures.
- The ResizeObserver reads the BORDER box; steps carry padding and
  `contentRect` would under-measure them.
- Direction comes from the navigation, passed in; it is never guessed from
  indexes inside the component.

## Usage

```tsx
const [step, setStep] = React.useState<"details" | "install">("details");
const [dir, setDir] = React.useState<1 | -1>(1);
const goTo = (next: typeof step, direction: 1 | -1) => { setDir(direction); setStep(next); };

<StepFrame title="Create your site" counter="1 / 2" footer={
  <Button size="xs" onClick={() => goTo("install", 1)}>Continue</Button>
}>
  <MeasuredSteps step={step} dir={dir}>
    {step === "details" ? <DetailsFields /> : <InstallSnippet />}
  </MeasuredSteps>
</StepFrame>
```

## Code

Type-checked source, also at `components/multi-step-dialog/`.

<!-- oa:code components/multi-step-dialog/multi-step-dialog.tsx -->
```tsx
"use client";

import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { cn } from "../_lib/cn";
import { LAYOUT } from "../_lib/springs";

/**
 * The measured-height choreography: OA's signature for multi-step flows
 * (create dialogs, onboarding, swapping panel faces).
 *
 * One constant panel; the content is what travels. Steps slide horizontally
 * through it (12px of travel, 0.16s easeOut fades, direction-aware) while
 * the panel's height springs (LAYOUT, 550/40) to each step's measured size.
 *
 * Three details are load-bearing:
 *
 * - `mode="popLayout"` pops the exiting step out of flow, so the incoming
 *   step is what the panel measures; without it the panel briefly holds both.
 * - The ResizeObserver reads the border box, because steps carry padding and
 *   `contentRect` would under-measure them.
 * - Direction comes from the navigation (forward 1, back -1), so Back slides
 *   the opposite way. Pass it; do not guess it from indexes inside.
 */
export function MeasuredSteps({
  step,
  dir,
  children,
  className,
}: {
  /** Key of the current step; changing it drives the slide. */
  step: string;
  /** 1 = forward, -1 = back. */
  dir: 1 | -1;
  children: React.ReactNode;
  className?: string;
}) {
  const [height, setHeight] = React.useState<number | "auto">("auto");

  const measure = React.useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      const box = entries[0]?.borderBoxSize?.[0];
      if (box) setHeight(box.blockSize);
    });
    observer.observe(node);
  }, []);

  return (
    <motion.div
      animate={{ height }}
      transition={LAYOUT}
      className={cn("relative overflow-hidden", className)}
    >
      <AnimatePresence custom={dir} initial={false} mode="popLayout">
        <motion.div
          key={step}
          ref={measure}
          custom={dir}
          initial={{ opacity: 0, x: dir * 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -12, transition: { duration: 0.1 } }}
          transition={{ duration: 0.16, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * The dialog frame the steps usually live in: title strip on the panel, a
 * fixed-height footer strip where the CTAs sit (Back as secondary on the
 * left of the primary, right-aligned). Compose with `MeasuredSteps` between
 * them and `Modal` (or your own overlay) around it.
 */
export function StepFrame({
  title,
  counter,
  footer,
  children,
  className,
}: {
  title: React.ReactNode;
  /** e.g. "2 / 4"; render only when the flow truly is a sequence. */
  counter?: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between gap-3 pb-2 pl-3.5 pr-3 pt-1">
        <h2 className="text-sm font-medium text-foreground/80">{title}</h2>
        {counter ? (
          <span className="text-xs tabular-nums text-muted-foreground">
            {counter}
          </span>
        ) : null}
      </div>
      {children}
      <div className="flex h-12 items-center justify-end gap-2 pb-1 pl-3.5 pr-1 pt-1">
        {footer}
      </div>
    </div>
  );
}
```
<!-- /oa:code -->
