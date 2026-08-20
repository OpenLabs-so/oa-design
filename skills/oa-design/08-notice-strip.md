# Notice strip

## When to use

Explaining a standing state above the content it affects: no events yet, an
unsupported timezone, data still importing. NOT for one-off outcomes (those
are toasts) and NOT for errors inside a card.

## Rules

- One bold claim, one grey sentence, at most one secondary action.
- White on white, held by the hairline border: an explanation, not an alarm.
- `role="status"`, not dismissable. It describes a condition, lives exactly
  as long as the condition does, and the condition ending is the dismissal.
- Stacks vertically under `sm:` with the action last.
- The copy pattern is in `_copy.md`: state the fact, then the one next step.

## Usage

```tsx
<NoticeStrip
  claim="No events yet."
  action={<Button size="sm" variant="secondary" onClick={goToInstall}>Check the install</Button>}
>
  If the snippet is live, browse your site and we'll pick up the first
  pageview within seconds.
</NoticeStrip>
```

## Code

Type-checked source, also at `components/notice-strip/`.

<!-- oa:code components/notice-strip/notice-strip.tsx -->
```tsx
"use client";

import * as React from "react";
import { cn } from "../_lib/cn";

/**
 * The notice strip: how OA explains a state, above the content the state
 * affects. One bold claim, one grey sentence, at most one secondary action.
 *
 * It is deliberately not an alert and not dismissable: it describes a
 * standing condition, lives exactly as long as the condition does, and the
 * condition ending is the dismissal. White on white, held by the hairline
 * border: an explanation, not an alarm. Stacks under `sm:`.
 */
export function NoticeStrip({
  claim,
  children,
  action,
  className,
}: {
  /** The bold opening statement, e.g. "No events yet." */
  claim: React.ReactNode;
  /** The plain sentence after it. */
  children: React.ReactNode;
  /** One secondary-styled action, already wired. */
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col gap-2 rounded-2xl border border-border bg-card px-4 py-3",
        "sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <p className="text-sm leading-6 text-muted-foreground">
        <span className="font-medium text-foreground">{claim}</span> {children}
      </p>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
```
<!-- /oa:code -->
