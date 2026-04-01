import { prisma } from "@/lib/db";
import { DEFAULT_HERO_COVER } from "@/lib/site-settings-constants";

export { DEFAULT_HERO_COVER };

export async function getHeroCoverUrl(): Promise<string> {
  try {
    const row = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    const url = row?.heroCoverUrl?.trim();
    if (url) return url;
  } catch {
    // DB or table not ready
  }
  return DEFAULT_HERO_COVER;
}
