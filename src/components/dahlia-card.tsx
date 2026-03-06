"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Dahlia } from "@/types/dahlia";

interface DahliaCardProps {
  dahlia: Dahlia;
}

export function DahliaCard({ dahlia }: DahliaCardProps) {
  const imageUrl =
    dahlia.images?.[0] ??
    "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800";

  return (
    <Link href={`/dahlias/${dahlia.slug}`} className="block">
      <Card className="group overflow-hidden border-sage-200/60 bg-white/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden bg-sage-50">
          <Image
            src={imageUrl}
            alt={dahlia.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={imageUrl.startsWith("http")}
          />
          {!dahlia.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Badge variant="secondary" className="text-sm">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-serif text-xl font-semibold text-foreground">
            {dahlia.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {dahlia.description}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs">
              {dahlia.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {dahlia.color}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t border-sage-100/60 bg-sage-50/30 px-4 py-3">
          <span className="font-serif text-lg font-semibold text-rose-800">
            ${dahlia.price.toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground">View details →</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
