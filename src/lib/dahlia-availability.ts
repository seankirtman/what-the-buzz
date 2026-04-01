/** Coerce DB/driver values (number, string, bigint) safely. */
function qty(d: unknown): number {
  if (d == null) return 0;
  if (typeof d === "bigint") return Number(d);
  const n = Number(d);
  return Number.isFinite(n) ? n : 0;
}

/** Remaining sellable count (total − sold, floored at 0). */
export function remainingQty(d: { totalQty: unknown; qtySold: unknown }): number {
  return Math.max(0, qty(d.totalQty) - qty(d.qtySold));
}

/**
 * Public catalog availability:
 * - `inStock` off → always unavailable (manual out of stock; qty fields are not changed).
 * - `inStock` on → if inventory has been set (`totalQty > 0` or `qtySold > 0`), require remaining > 0.
 * - `inStock` on and no inventory numbers → available.
 */
export function isListedAsAvailable(d: {
  totalQty?: unknown;
  qtySold?: unknown;
  inStock: boolean;
}): boolean {
  if (!d.inStock) return false;
  const totalQty = qty(d.totalQty);
  const qtySold = qty(d.qtySold);
  const remaining = Math.max(0, totalQty - qtySold);
  const inventoryTouched = totalQty > 0 || qtySold > 0;
  if (inventoryTouched) return remaining > 0;
  return true;
}
