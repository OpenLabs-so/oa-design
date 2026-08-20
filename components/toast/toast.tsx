"use client";

import * as React from "react";
import { cn } from "../_lib/cn";

/**
 * OA toast physics: an outcome gets a body reaction, under 0.35s, easing
 * cubic-bezier(0.5, 1, 0.89, 1).
 *
 * - Success: a contented pulse (scale 1 -> 1.025 -> 0.99 -> 1, 0.32s).
 * - Error: a refusal shake (x 0 -> -3 -> 3 -> -3 -> 0 px, 0.28s).
 *
 * The keyframes live in _root.css as odd/even twins; alternating the two
 * identical copies is what lets a REPEATED toast of the same kind restart
 * its animation (re-declaring the same animation name is a no-op).
 */
export function Toast({
  kind,
  children,
  className,
  /** Flip on every re-fire so the odd/even keyframe twins alternate. */
  beat = 0,
}: {
  kind: "success" | "error";
  children: React.ReactNode;
  className?: string;
  beat?: number;
}) {
  const parity = beat % 2 === 0 ? "odd" : "even";
  return (
    <div
      role="status"
      className={cn(
        "flex items-center gap-2 rounded-full border border-border bg-card py-1.5 pl-3 pr-4 text-xs font-medium",
        "shadow-[0_1px_2px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.08)]",
        className
      )}
      style={{
        animation:
          kind === "success"
            ? `oa-toast-success-${parity} 0.32s cubic-bezier(0.5, 1, 0.89, 1)`
            : `oa-toast-error-${parity} 0.28s cubic-bezier(0.5, 1, 0.89, 1)`,
      }}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-2 rounded-full",
          kind === "success" ? "bg-success-foreground" : "bg-destructive"
        )}
      />
      {children}
    </div>
  );
}
