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

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  qty: z.string().optional(),
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      qty: "",
      deliveryMethod: "pickup",
      pickupTime: "",
      phone: "",
      shippingAddress: "",
      message: "",
    },
  });

  const deliveryMethod = form.watch("deliveryMethod");

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          dahliaName,
          dahliaSlug,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to send");
      }

      toast.success("Message sent! Dorrie will get back to you soon.");
      form.reset();
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
      {dahliaName && (
        <p className="rounded-lg bg-sage-50 p-3 text-sm text-muted-foreground">
          Inquiring about: <strong className="text-foreground">{dahliaName}</strong>
        </p>
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
        <Label htmlFor="qty">Quantity</Label>
        <Input
          id="qty"
          type="number"
          min="1"
          {...form.register("qty")}
          className="mt-1"
          placeholder="How many?"
        />
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
