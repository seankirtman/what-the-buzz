/** Trimmed non-empty string for display, or null if missing / whitespace-only. */
export function presentString(s: unknown): string | null {
  if (s == null) return null;
  const t = String(s).trim();
  return t.length > 0 ? t : null;
}
