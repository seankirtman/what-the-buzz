export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { SiteHeroSettingsForm } from "@/components/site-hero-settings-form";

export default async function AdminSiteSettingsPage() {
  let heroCoverUrl: string | null = null;
  try {
    const row = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    heroCoverUrl = row?.heroCoverUrl ?? null;
  } catch {
    heroCoverUrl = null;
  }

  return (
    <div className="min-h-screen bg-sage-50/30">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold">Site — home hero</h1>
          <Link href="/admin">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
        <SiteHeroSettingsForm initialHeroCoverUrl={heroCoverUrl} />
      </div>
    </div>
  );
}
