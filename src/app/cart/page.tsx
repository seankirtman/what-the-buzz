"use client";

import Link from "next/link";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Input } from "@/components/ui/input";

export default function CartPage() {
  const cart = useCart();
  const items = cart.items;
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; Continue shopping
        </Link>

        <div className="flex items-center gap-3">
          <ShoppingCart className="size-7 text-rose-800" />
          <h1 className="font-serif text-3xl font-bold">Your Cart</h1>
        </div>

        {items.length === 0 ? (
          <div className="mt-12 text-center">
            <ShoppingCart className="mx-auto size-16 text-sage-200" />
            <p className="mt-4 text-lg text-muted-foreground">
              Your cart is empty
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-lg bg-rose-800 px-8 py-3 font-serif text-lg font-medium text-white transition-colors hover:bg-rose-900"
            >
              Browse Dahlias
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 divide-y divide-sage-200/60 rounded-xl border border-sage-200/60 bg-white shadow-sm">
              {items.map((item) => (
                <div
                  key={item.slug}
                  className="flex items-center justify-between gap-4 px-6 py-5"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/dahlias/${item.slug}`}
                      className="font-serif text-lg font-semibold text-foreground hover:text-rose-800 hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          item.qty > 1
                            ? cart.updateQty(item.slug, item.qty - 1)
                            : cart.removeItem(item.slug)
                        }
                        className="flex size-8 items-center justify-center rounded-md border border-sage-200 text-muted-foreground transition-colors hover:bg-sage-50"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <Input
                        type="number"
                        min={1}
                        value={item.qty}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (val >= 1) cart.updateQty(item.slug, val);
                        }}
                        className="h-8 w-14 text-center"
                      />
                      <button
                        type="button"
                        onClick={() => cart.updateQty(item.slug, item.qty + 1)}
                        className="flex size-8 items-center justify-center rounded-md border border-sage-200 text-muted-foreground transition-colors hover:bg-sage-50"
                        aria-label="Increase quantity"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>

                    <span className="w-20 text-right font-medium text-foreground">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>

                    <button
                      type="button"
                      onClick={() => cart.removeItem(item.slug)}
                      className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove item"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-sage-200/60 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-serif text-xl font-semibold">Total</span>
                <span className="font-serif text-2xl font-bold text-rose-800">
                  ${total.toFixed(2)}
                </span>
              </div>

              <Link
                href="/contact"
                className="mt-6 block w-full rounded-lg bg-rose-800 px-6 py-4 text-center font-serif text-lg font-medium text-white transition-colors hover:bg-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2"
              >
                Message Dorrie to Order
              </Link>
              <Link
                href="/"
                className="mt-3 block text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                &larr; Continue shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
