export const dynamic = "force-dynamic";

import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { DahliaCard } from "@/components/dahlia-card";
import { DahliaFilters } from "@/components/dahlia-filters";

async function getDahlias(filters?: {
  category?: string;
  color?: string;
}) {
  const dahlias = await prisma.dahlia.findMany({
    where: {
      ...(filters?.category && { category: filters.category }),
      ...(filters?.color && { color: filters.color }),
    },
    orderBy: { name: "asc" },
  });

  return dahlias.map((d) => ({
    ...d,
    images: JSON.parse(d.images) as string[],
  }));
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; color?: string }>;
}) {
  const params = await searchParams;
  const dahlias = await getDahlias({
    category: params.category && params.category !== "All" ? params.category : undefined,
    color: params.color && params.color !== "All" ? params.color : undefined,
  });

  return (
    <div className="min-h-screen">
      <header className="relative overflow-hidden bg-gradient-to-b from-sage-100/80 to-background">
        <div className="absolute inset-0 bg-[url('/hero-dahlias.png')] bg-cover bg-center opacity-20" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:py-28">
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
      </header>

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
