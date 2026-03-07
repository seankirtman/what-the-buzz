"use client";

import { useState } from "react";
import Image from "next/image";

interface DahliaImageGalleryProps {
  images: string[];
  name: string;
}

export function DahliaImageGallery({ images, name }: DahliaImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const imageUrl = images[selectedIndex] ?? images[0] ?? "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800";

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sage-50">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          unoptimized={imageUrl.startsWith("http")}
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 ${
                selectedIndex === i
                  ? "ring-2 ring-rose-600 ring-offset-2"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${name} ${i + 1}`}
                fill
                className="object-cover"
                unoptimized={img.startsWith("http")}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
