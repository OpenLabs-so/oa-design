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
