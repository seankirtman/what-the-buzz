"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronDownIcon } from "lucide-react";

const CATEGORIES = [
  { value: "", label: "All categories" },
  { value: "Dinnerplate", label: "Dinnerplate" },
  { value: "Decorative", label: "Decorative" },
  { value: "Pompon", label: "Pompon" },
  { value: "Ball", label: "Ball" },
  { value: "Cactus", label: "Cactus" },
  { value: "Other", label: "Other" },
];

const COLORS = [
  { value: "", label: "All colors" },
  { value: "Cream/Blush", label: "Cream/Blush" },
  { value: "Red", label: "Red" },
  { value: "Purple", label: "Purple" },
  { value: "Burgundy", label: "Burgundy" },
  { value: "Mixed", label: "Mixed" },
  { value: "Pink", label: "Pink" },
  { value: "Yellow", label: "Yellow" },
  { value: "Orange", label: "Orange" },
  { value: "White", label: "White" },
];

const selectClass =
  "appearance-none rounded-lg border border-sage-200/80 bg-white py-2.5 pl-4 pr-10 text-sm text-foreground shadow-sm transition-colors hover:border-sage-300 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 min-w-[140px]";

export function DahliaFilters() {
  const searchParams = useSearchParams();

  const category = searchParams.get("category") ?? "";
  const color = searchParams.get("color") ?? "";

  const hasFilters = category || color;

  return (
    <form
      method="GET"
      action="/"
      className="flex flex-wrap items-center gap-3"
    >
      <div className="relative">
        <select
          name="category"
          defaultValue={category}
          onChange={(e) => e.currentTarget.form?.submit()}
          className={selectClass}
          aria-label="Filter by category"
        >
          {CATEGORIES.map(({ value, label }) => (
            <option key={value || "all"} value={value}>
              {label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      <div className="relative">
        <select
          name="color"
          defaultValue={color}
          onChange={(e) => e.currentTarget.form?.submit()}
          className={selectClass}
          aria-label="Filter by color"
        >
          {COLORS.map(({ value, label }) => (
            <option key={value || "all"} value={value}>
              {label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      {hasFilters && (
        <Link
          href="/"
          className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-sage-100 hover:text-foreground"
        >
          Clear filters
        </Link>
      )}
    </form>
  );
}
