"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DeleteDahliaButtonProps {
  id: number;
  name: string;
}

export function DeleteDahliaButton({ id, name }: DeleteDahliaButtonProps) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/dahlias/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Dahlia deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete dahlia");
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete} className="text-destructive hover:text-destructive">
      Delete
    </Button>
  );
}
