"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  detailedDescription: z.string().min(1, "Detailed description is required"),
  price: z.string().min(1, "Price is required"),
  category: z.string().min(1, "Category is required"),
  color: z.string(),
  size: z.string(),
  availableForShipping: z.boolean(),
  availableForPickup: z.boolean(),
  inStock: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface DahliaFormProps {
  initialData?: {
    id: number;
    name: string;
    slug: string;
    description: string;
    detailedDescription: string;
    price: number;
    images: string[];
    category: string;
    color: string;
    size: string;
    availableForShipping: boolean;
    availableForPickup: boolean;
    inStock: boolean;
  };
}

export function DahliaForm({ initialData }: DahliaFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(initialData?.images ?? []);
  const [newImageUrl, setNewImageUrl] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      description: initialData?.description ?? "",
      detailedDescription: initialData?.detailedDescription ?? "",
      price: initialData?.price?.toString() ?? "",
      category: initialData?.category ?? "Decorative",
      color: initialData?.color ?? "",
      size: initialData?.size ?? "Medium",
      availableForShipping: initialData?.availableForShipping ?? true,
      availableForPickup: initialData?.availableForPickup ?? true,
      inStock: initialData?.inStock ?? true,
    },
  });

  function addImageUrl() {
    const trimmed = newImageUrl.trim();
    if (trimmed) {
      setImages((prev) => [...prev, trimmed]);
      setNewImageUrl("");
    }
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(data: FormData) {
    try {
      const payload = {
        ...data,
        price: parseFloat(data.price),
        images,
      };

      if (initialData) {
        const res = await fetch(`/api/admin/dahlias/${initialData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update");
        toast.success("Dahlia updated");
      } else {
        const res = await fetch("/api/admin/dahlias", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create");
        toast.success("Dahlia created");
      }

      router.push("/admin");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 rounded-xl border border-sage-200/60 bg-white p-6 shadow-sm"
    >
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...form.register("name")} className="mt-1" placeholder="Café au Lait" />
        {form.formState.errors.name && (
          <p className="mt-1 text-sm text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input id="slug" {...form.register("slug")} className="mt-1" placeholder="cafe-au-lait" />
      </div>

      <div>
        <Label htmlFor="description">Short description</Label>
        <Textarea
          id="description"
          {...form.register("description")}
          className="mt-1 min-h-[80px]"
          placeholder="Brief description for cards..."
        />
        {form.formState.errors.description && (
          <p className="mt-1 text-sm text-destructive">{form.formState.errors.description.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="detailedDescription">Detailed description</Label>
        <Textarea
          id="detailedDescription"
          {...form.register("detailedDescription")}
          className="mt-1 min-h-[120px]"
          placeholder="Full description for detail page..."
        />
        {form.formState.errors.detailedDescription && (
          <p className="mt-1 text-sm text-destructive">{form.formState.errors.detailedDescription.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="price">Price ($)</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          {...form.register("price")}
          className="mt-1"
          placeholder="12.00"
        />
        {form.formState.errors.price && (
          <p className="mt-1 text-sm text-destructive">{form.formState.errors.price.message}</p>
        )}
      </div>

      <div>
        <Label>Images</Label>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste image URLs (one per line) or add individually
        </p>
        <div className="mt-2 flex flex-wrap gap-4">
          {images.map((url, i) => (
            <div key={i} className="relative">
              <img src={url} alt="" className="h-24 w-24 rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -right-2 -top-2 rounded-full bg-destructive px-2 py-0.5 text-xs text-white"
              >
                ×
              </button>
            </div>
          ))}
          <div className="flex flex-col gap-1">
            <div className="flex gap-1">
              <Input
                placeholder="Paste image URL"
                className="w-48"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImageUrl())}
              />
              <Button type="button" variant="outline" size="sm" onClick={addImageUrl}>
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="category">Category</Label>
          <Input id="category" {...form.register("category")} className="mt-1" placeholder="Decorative" />
        </div>
        <div>
          <Label htmlFor="color">Color</Label>
          <Input id="color" {...form.register("color")} className="mt-1" placeholder="Cream/Blush" />
        </div>
        <div>
          <Label htmlFor="size">Size</Label>
          <Input id="size" {...form.register("size")} className="mt-1" placeholder="Medium" />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...form.register("availableForShipping")} className="h-4 w-4" />
          Available for shipping
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...form.register("availableForPickup")} className="h-4 w-4" />
          Available for pickup
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...form.register("inStock")} className="h-4 w-4" />
          In stock
        </label>
      </div>

      <div className="flex gap-2">
        <Button type="submit">{initialData ? "Save changes" : "Create dahlia"}</Button>
        <Link href="/admin">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
