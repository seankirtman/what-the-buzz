/** Coerce DB/driver values (number, string, bigint) safely. */
function qty(d: unknown): number {
  if (d == null) return 0;
  if (typeof d === "bigint") return Number(d);
  const n = Number(d);
  return Number.isFinite(n) ? n : 0;
}

/** Remaining sellable count (total − sold, floored at 0). */
export function remainingQty(d: { totalQty?: unknown; qtySold?: unknown }): number {
  return Math.max(0, qty(d.totalQty) - qty(d.qtySold));
}

/**
 * Public catalog availability:
 * - `inStock` off → always unavailable (manual sold out; qty fields unchanged in admin).
 * - `inStock` on → must have remaining > 0 (`totalQty - qtySold`). Total 0 and sold 0 → sold out.
 */
export function isListedAsAvailable(d: {
  totalQty?: unknown;
  qtySold?: unknown;
  inStock: boolean;
}): boolean {
  if (!d.inStock) return false;
  return remainingQty(d) > 0;
}
