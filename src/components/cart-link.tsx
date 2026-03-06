"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export function CartLink() {
  const cart = useCart();
  const count = cart?.totalItems ?? 0;

  if (count === 0) return null;

  return (
    <Link
      href="/cart"
      className="inline-flex items-center gap-1.5 rounded-lg bg-rose-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-900"
    >
      <ShoppingCart className="size-4" />
      Cart ({count})
    </Link>
  );
}
