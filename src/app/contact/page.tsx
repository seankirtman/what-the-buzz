export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/db";
import { normalizeDahliaSlugParam } from "@/lib/dahlia-slug";
import { ContactForm } from "@/components/contact-form";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ dahlia?: string }>;
}) {
  const params = await searchParams;
  const rawDahlia = params.dahlia ?? undefined;

  let dahliaSlug: string | undefined;
  let dahliaName: string | undefined;
  if (rawDahlia) {
    let row = await prisma.dahlia.findUnique({
      where: { slug: normalizeDahliaSlugParam(rawDahlia) },
      select: { slug: true, name: true },
    });
    if (!row) {
      try {
        row = await prisma.dahlia.findFirst({
          where: { slug: { equals: rawDahlia, mode: "insensitive" } },
          select: { slug: true, name: true },
        });
      } catch {
        row = null;
      }
    }
    if (row) {
      dahliaSlug = row.slug;
      dahliaName = row.name;
    }
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-xl px-4 py-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to dahlias
        </Link>

        <h1 className="font-serif text-3xl font-bold">Message Dorrie</h1>
        <p className="mt-2 text-muted-foreground">
          Review your cart and send a message to request your flowers. Include your preferred delivery method.
        </p>

        <ContactForm dahliaSlug={dahliaSlug} dahliaName={dahliaName} />
      </div>
    </div>
  );
}
