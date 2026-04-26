/**
 * Match admin API: POST/PUT use slug.toLowerCase().replace(/\s+/g, "-")
 * so URLs that differ only by case or use spaces still resolve to the same row.
 */
export function normalizeDahliaSlugParam(param: string): string {
  return param.trim().toLowerCase().replace(/\s+/g, "-");
}
