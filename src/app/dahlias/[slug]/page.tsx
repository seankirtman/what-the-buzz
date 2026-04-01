export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { isListedAsAvailable } from "@/lib/dahlia-availability";
import { presentString } from "@/lib/present-string";
import { Badge } from "@/components/ui/badge";
import { AddToCart } from "@/components/add-to-cart";
import { DahliaImageGallery } from "@/components/dahlia-image-gallery";

export default async function DahliaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dahlia = await prisma.dahlia.findUnique({
    where: { slug },
  });

  if (!dahlia) notFound();

  const images = JSON.parse(dahlia.images) as string[];
  const available = isListedAsAvailable(dahlia);
  const categoryLabel = presentString(dahlia.category);
  const colorLabel = presentString(dahlia.color);
  const sizeLabel = presentString(dahlia.size);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to all dahlias
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          <DahliaImageGallery images={images} name={dahlia.name} />

          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              {dahlia.name}
            </h1>
            <p className="mt-2 font-serif text-2xl font-semibold text-rose-800">
              ${dahlia.price.toFixed(2)}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {categoryLabel && <Badge variant="outline">{categoryLabel}</Badge>}
              {colorLabel && <Badge variant="outline">{colorLabel}</Badge>}
              {sizeLabel && <Badge variant="outline">{sizeLabel}</Badge>}
              {dahlia.availableForPickup && (
                <Badge variant="secondary">Local pickup</Badge>
              )}
              {dahlia.availableForShipping && (
                <Badge variant="secondary">Shipping available</Badge>
              )}
              {!available && <Badge variant="destructive">Sold out</Badge>}
            </div>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              {dahlia.detailedDescription}
            </p>

            {available && (
              <AddToCart
                slug={dahlia.slug}
                name={dahlia.name}
                price={dahlia.price}
                inStock={available}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
