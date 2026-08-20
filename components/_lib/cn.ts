/** Tiny class joiner. No tailwind-merge on purpose: recipes are written so
 *  classes never fight, and zero dependencies is part of being copyable. */
export type ClassValue = string | false | null | undefined;

export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
