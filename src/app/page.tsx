export const dynamic = "force-dynamic";

import Link from "next/link";
import { Suspense } from "react";
import { isSortOrderUnsupportedError, prisma } from "@/lib/db";
import { DahliaCard } from "@/components/dahlia-card";
import { DahliaFilters } from "@/components/dahlia-filters";

async function getDahlias(filters?: {
  category?: string;
  color?: string;
}) {
  const where: { category?: string; color?: string } = {};
  if (filters?.category) where.category = filters.category;
  if (filters?.color) where.color = filters.color;

  const dahlias = await prisma.dahlia
    .findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    })
    .catch((error) => {
      if (!isSortOrderUnsupportedError(error)) throw error;
      return prisma.dahlia.findMany({
        where,
        orderBy: [{ name: "asc" }],
      });
    });

  // Out-of-stock items last (sort in memory to avoid SQLite boolean orderBy issues)
  dahlias.sort((a, b) => (a.inStock === b.inStock ? 0 : a.inStock ? -1 : 1));

  return dahlias.map((d) => ({
    ...d,
    images: JSON.parse(d.images) as string[],
  }));
}

function toSingle(value: string | string[] | undefined): string | undefined {
  if (value == null) return undefined;
  const s = Array.isArray(value) ? value[0] : value;
  return s && s !== "All" ? s : undefined;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[]; color?: string | string[] }>;
}) {
  const params = await searchParams;
  const dahlias = await getDahlias({
    category: toSingle(params?.category),
    color: toSingle(params?.color),
  });

  return (
    <div className="min-h-screen">
      <header className="relative min-h-[45vh] overflow-hidden bg-gradient-to-b from-sage-100/80 to-background">
        <div className="absolute inset-0 bg-[url('/hero-dahlias.png')] bg-cover bg-center opacity-100" />
      </header>

      <section className="border-b border-sage-200/60 bg-background py-12">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            What&apos;s The Buzz Gardens
          </h1>
          <p className="mt-4 font-serif text-xl text-muted-foreground sm:text-2xl">
            Beautiful dahlias, grown with care
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse our collection and message Dorrie to request your favorites
          </p>
        </div>
      </section>

      <section className="border-b border-sage-200/60 bg-white/50">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center">
          <p className="text-lg leading-relaxed text-muted-foreground">
            Whether you&apos;re starting a new garden or adding something new to an existing one,
            I have a great selection of spring, summer and fall blooming plants.
          </p>
          <p className="mt-4 text-muted-foreground">
            Plants are already potted and ready to plant. There are several sizes and prices to meet your budget.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-12">
        <Suspense fallback={<div className="h-10 w-48 animate-pulse rounded-lg bg-sage-100" />}>
          <DahliaFilters />
        </Suspense>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dahlias.map((dahlia) => (
            <DahliaCard key={dahlia.id} dahlia={dahlia} />
          ))}
        </div>
        {dahlias.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            No dahlias match your filters. Try adjusting your selection.
          </p>
        )}
      </main>

      <footer className="mt-16 border-t border-sage-200/60 bg-sage-50/30 py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
          <p>What&apos;s The Buzz Gardens — Dahlia flowers for every occasion</p>
          <div className="mt-2 flex items-center justify-center gap-4">
            <Link
              href="/cart"
              className="text-rose-800 hover:underline"
            >
              View Cart
            </Link>
            <span className="text-sage-200">·</span>
            <Link
              href="/contact"
              className="text-rose-800 hover:underline"
            >
              Message Dorrie
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
