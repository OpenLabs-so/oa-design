/**
 * The whole motion vocabulary. Seven springs cover the entire product; a new
 * component borrows from this table instead of inventing its own curve, and
 * that inheritance is why screens built months apart feel like siblings.
 */
export const PANEL = { type: "spring", stiffness: 550, damping: 38 } as const;
export const LAYOUT = { type: "spring", stiffness: 550, damping: 40 } as const;
export const POP = { type: "spring", stiffness: 400, damping: 26 } as const;
export const POP_EXIT = { type: "spring", stiffness: 380, damping: 28 } as const;
export const BANNER = { type: "spring", stiffness: 400, damping: 30 } as const;
export const FLICK = { type: "spring", stiffness: 900, damping: 50 } as const;
export const CHART = { type: "spring", stiffness: 300, damping: 28 } as const;

/** Micro fades that accompany the springs: 0.1s out, 0.16s in, easeOut.
 *  Nothing in app chrome tweens longer than 0.2s. */
export const FADE_IN = { duration: 0.16, ease: "easeOut" } as const;
export const FADE_OUT = { duration: 0.1, ease: "easeOut" } as const;
