import { prisma } from "@/lib/db";

/**
 * Slug from a display name: lowercase, collapse whitespace to hyphens
 * (same as historic admin slug input).
 */
export function slugFromDahliaName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}

/**
 * For URL path segments, match stored slugs that differ in case or spacing.
 */
export function normalizeDahliaSlugParam(param: string): string {
  return param.trim().toLowerCase().replace(/\s+/g, "-");
}

/**
 * Resolves a unique `slug` for the DB from `name` (appends -2, -3, … on collision).
 */
export async function uniqueDahliaSlugFromName(
  name: string,
  excludeDahliaId?: number
): Promise<string> {
  const base = slugFromDahliaName(name) || "dahlia";
  let candidate = base;
  let n = 2;
  for (;;) {
    const conflict = await prisma.dahlia.findFirst({
      where: {
        slug: candidate,
        ...(excludeDahliaId != null ? { id: { not: excludeDahliaId } } : {}),
      },
    });
    if (!conflict) return candidate;
    candidate = `${base}-${n}`;
    n += 1;
  }
}
