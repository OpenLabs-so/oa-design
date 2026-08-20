"use client";

import * as React from "react";
import { cn } from "../_lib/cn";

/**
 * The OA button: a pill that physically presses. Two rules carry the feel:
 *
 * - `active:translate-y-px active:scale-[0.98]` on every variant. The press
 *   is the only geometry change a pointer ever causes in this system; cards
 *   and rows answer with color only.
 * - A loading button KEEPS its label and gains a ring spinner beside it, so
 *   its width never jumps and the layout never flinches.
 *
 * The primary variant's bevel is built by color-mixing the accent toward a
 * deep indigo (#3a3480) for its border and resting fill, then lightening to
 * pure `--primary` on hover, with a white inset highlight on top and a dark
 * inset seat at the bottom.
 */

type Variant = "primary" | "secondary" | "ghost" | "destructive";
type Size = "md" | "sm" | "xs";

const BASE =
  "inline-flex cursor-pointer items-center justify-center gap-1 whitespace-nowrap font-medium outline-none transition-all " +
  "focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "active:translate-y-px active:scale-[0.98]";

const VARIANTS: Record<Variant, string> = {
  primary:
    "border border-[color-mix(in_srgb,var(--primary)_80%,#3a3480)] " +
    "bg-[color-mix(in_srgb,var(--primary)_90%,#3a3480)] text-primary-foreground " +
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(58,52,128,0.30)] " +
    "hover:bg-primary hover:border-[color-mix(in_srgb,var(--primary)_70%,#3a3480)]",
  secondary:
    "border border-transparent bg-secondary text-secondary-foreground " +
    "hover:bg-[color-mix(in_srgb,var(--secondary)_95%,var(--ink))]",
  ghost: "text-muted-foreground hover:text-accent-foreground",
  destructive: "bg-destructive text-white hover:bg-destructive/90",
};

const SIZES: Record<Size, string> = {
  md: "h-9 rounded-lg px-3 py-1.5 text-sm",
  sm: "h-8 rounded-lg gap-1.5 px-3 text-sm",
  xs: "h-7 rounded-lg px-2 text-xs",
};

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-label="Loading"
      role="status"
      className={cn(
        "inline-block size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent",
        className
      )}
    />
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  type,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      disabled={loading || disabled}
      aria-disabled={loading || undefined}
      type={type ?? "button"}
      {...props}
    >
      {loading ? <Spinner className="pointer-events-none size-3.5" /> : null}
      {children}
    </button>
  );
}
