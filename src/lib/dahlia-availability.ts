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
 * - If inventory has ever been tracked (`totalQty > 0` or `qtySold > 0`), trust remaining count only.
 * - Otherwise (`totalQty === 0` and `qtySold === 0`), use legacy `inStock` checkbox (new listings).
 */
export function isListedAsAvailable(d: {
  totalQty?: unknown;
  qtySold?: unknown;
  inStock: boolean;
}): boolean {
  const totalQty = qty(d.totalQty);
  const qtySold = qty(d.qtySold);
  const remaining = Math.max(0, totalQty - qtySold);
  const inventoryTouched = totalQty > 0 || qtySold > 0;
  if (inventoryTouched) return remaining > 0;
  return d.inStock;
}
