"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/lib/cart-context";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  deliveryMethod: z.enum(["pickup", "shipping"]),
  pickupTime: z.string().optional(),
  phone: z.string().optional(),
  shippingAddress: z.string().optional(),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface ContactFormProps {
  dahliaSlug?: string;
  dahliaName?: string;
}

export function ContactForm({ dahliaSlug, dahliaName }: ContactFormProps) {
  const cart = useCart();
  const items = cart.items;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      deliveryMethod: "pickup",
      pickupTime: "",
      phone: "",
      shippingAddress: "",
      message: "",
    },
  });

  const deliveryMethod = form.watch("deliveryMethod");

  const cartItems = items.length > 0 ? items : dahliaSlug && dahliaName
    ? [{ slug: dahliaSlug, name: dahliaName, price: 0, qty: 1 }]
    : [];

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          cartItems: items.length > 0 ? items : (dahliaSlug && dahliaName
            ? [{ slug: dahliaSlug, name: dahliaName, price: 0, qty: 1 }]
            : []),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to send");
      }

      toast.success("Message sent! Dorrie will get back to you soon.");
      form.reset();
      if (cart && items.length > 0) cart.clearCart();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mt-8 space-y-6 rounded-xl border border-sage-200/60 bg-white p-6 shadow-sm"
    >
      {cartItems.length > 0 && (
        <div className="rounded-lg bg-sage-50 p-4">
          <p className="mb-2 font-medium text-foreground">Your cart</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {cartItems.map((item) => (
              <li
                key={item.slug}
                className="flex items-center justify-between gap-2"
              >
                <span>
                  {item.name} × {item.qty}
                </span>
                <span className="flex items-center gap-2">
                  {item.price > 0 && (
                    <span className="font-medium text-foreground">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  )}
                  {cart && items.some((i) => i.slug === item.slug) && (
                    <button
                      type="button"
                      onClick={() => cart.removeItem(item.slug)}
                      className="text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </span>
              </li>
            ))}
          </ul>
          {items.length > 0 && (
            <p className="mt-2 text-sm font-medium text-foreground">
              Total: $
              {items
                .reduce((sum, i) => sum + i.price * i.qty, 0)
                .toFixed(2)}
            </p>
          )}
        </div>
      )}

      <div>
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          {...form.register("name")}
          className="mt-1"
          placeholder="Your name"
        />
        {form.formState.errors.name && (
          <p className="mt-1 text-sm text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          {...form.register("email")}
          className="mt-1"
          placeholder="your@email.com"
        />
        {form.formState.errors.email && (
          <p className="mt-1 text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div>
        <Label>Delivery preference</Label>
        <div className="mt-2 flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="pickup"
              {...form.register("deliveryMethod")}
              className="h-4 w-4"
            />
            Local pickup
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="shipping"
              {...form.register("deliveryMethod")}
              className="h-4 w-4"
            />
            Shipping (standard rate)
          </label>
        </div>
      </div>

      {deliveryMethod === "pickup" && (
        <>
          <p className="text-sm text-muted-foreground">
            Pickup location: S. Hamilton, MA
          </p>
          <div>
            <Label htmlFor="pickupTime">Preferred pickup time</Label>
            <Input
              id="pickupTime"
              {...form.register("pickupTime")}
              className="mt-1"
              placeholder="e.g. Saturday morning, after 2pm"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              type="tel"
              {...form.register("phone")}
              className="mt-1"
              placeholder="(555) 123-4567"
            />
          </div>
        </>
      )}

      {deliveryMethod === "shipping" && (
        <div>
          <Label htmlFor="shippingAddress">Shipping address</Label>
          <Textarea
            id="shippingAddress"
            {...form.register("shippingAddress")}
            className="mt-1 min-h-[80px]"
            placeholder="Street, city, state, zip"
          />
          <p className="mt-1 text-sm text-muted-foreground">
            Standard shipping rate applies.
          </p>
        </div>
      )}

      <div>
        <Label htmlFor="message">Message (optional)</Label>
        <Textarea
          id="message"
          {...form.register("message")}
          className="mt-1 min-h-[80px]"
          placeholder="Any additional notes for Dorrie..."
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
