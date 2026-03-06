"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddToCartProps {
  slug: string;
  name: string;
  price: number;
  inStock: boolean;
}

export function AddToCart({ slug, name, price, inStock }: AddToCartProps) {
  const cart = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!inStock) return null;

  function handleAdd() {
    cart.addItem({ slug, name, price }, qty);
    setAdded(true);
  }

  if (added) {
    return (
      <div className="mt-8 space-y-4 rounded-lg border border-green-200 bg-green-50 p-6">
        <div className="flex items-center gap-2 text-green-800">
          <Check className="size-5" />
          <p className="font-medium">
            {qty} &times; {name} added to cart!
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-lg bg-rose-800 px-5 py-2.5 font-serif text-sm font-medium text-white transition-colors hover:bg-rose-900"
          >
            <ShoppingCart className="size-4" />
            View Cart
          </Link>
          <button
            type="button"
            onClick={() => {
              setAdded(false);
              setQty(1);
            }}
            className="rounded-lg border border-sage-200 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-sage-50"
          >
            Add More
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      <div>
        <Label htmlFor="detail-qty">Quantity</Label>
        <Input
          id="detail-qty"
          type="number"
          min={1}
          value={qty}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (v >= 1) setQty(v);
          }}
          className="mt-1 w-24"
        />
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-rose-800 px-6 py-3 font-serif text-lg font-medium text-white transition-colors hover:bg-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2"
      >
        <ShoppingCart className="size-5" />
        Add to Cart
      </button>
    </div>
  );
}
