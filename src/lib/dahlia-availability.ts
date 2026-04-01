/** Remaining sellable count when inventory is tracked (totalQty > 0). */
export function remainingQty(d: { totalQty: number; qtySold: number }): number {
  return Math.max(0, d.totalQty - d.qtySold);
}

/**
 * Available on the public catalog when:
 * - totalQty > 0: remaining > 0
 * - else: legacy `inStock` flag
 */
export function isListedAsAvailable(d: {
  totalQty: number;
  qtySold: number;
  inStock: boolean;
}): boolean {
  if (d.totalQty > 0) return remainingQty(d) > 0;
  return d.inStock;
}
