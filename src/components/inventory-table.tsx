"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Dahlia {
  id: number;
  name: string;
  category: string;
  color: string;
  totalQty: number;
  qtySold: number;
}

interface InventoryTableProps {
  dahlias: Dahlia[];
}

function EditableCell({
  value,
  onSave,
  className = "",
}: {
  value: number;
  onSave: (v: number) => Promise<void>;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(value.toString());
  const [saving, setSaving] = useState(false);

  async function handleBlur() {
    const n = parseInt(input, 10);
    if (!Number.isNaN(n) && n >= 0 && n !== value) {
      setSaving(true);
      try {
        await onSave(n);
        setInput(n.toString());
      } catch {
        setInput(value.toString());
      } finally {
        setSaving(false);
      }
    } else {
      setInput(value.toString());
    }
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        type="number"
        min="0"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => e.key === "Enter" && (e.currentTarget.blur(), e.preventDefault())}
        className="w-16 rounded border border-sage-300 px-2 py-1 text-right text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
        autoFocus
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={`min-w-[2rem] cursor-pointer rounded px-1 py-0.5 text-right hover:bg-sage-100 ${saving ? "opacity-60" : ""} ${className}`}
      title="Click to edit"
    >
      {saving ? "…" : value}
    </button>
  );
}

export function InventoryTable({ dahlias }: InventoryTableProps) {
  const router = useRouter();
  const [updating, setUpdating] = useState<number | null>(null);

  async function updateField(id: number, field: "totalQty" | "qtySold", value: number) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/dahlias/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (res.ok) router.refresh();
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-sage-200 bg-sage-50/50">
            <th className="px-4 py-3 text-left font-medium">Name</th>
            <th className="px-4 py-3 text-left font-medium">Category</th>
            <th className="px-4 py-3 text-left font-medium">Color</th>
            <th className="px-4 py-3 text-right font-medium">Total</th>
            <th className="px-4 py-3 text-right font-medium">Qty sold</th>
            <th className="px-4 py-3 text-right font-medium">Qty remaining</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {dahlias.map((d) => {
            const total = d.totalQty ?? 0;
            const sold = d.qtySold ?? 0;
            const remaining = Math.max(0, total - sold);
            const isUpdating = updating === d.id;
            return (
              <tr
                key={d.id}
                className={`border-b border-sage-100 hover:bg-sage-50/30 ${isUpdating ? "opacity-70" : ""}`}
              >
                <td className="px-4 py-3 font-medium">{d.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{d.category}</td>
                <td className="px-4 py-3 text-muted-foreground">{d.color}</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  <EditableCell
                    value={total}
                    onSave={(v) => updateField(d.id, "totalQty", v)}
                  />
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  <EditableCell
                    value={sold}
                    onSave={(v) => updateField(d.id, "qtySold", v)}
                  />
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-medium">
                  {remaining}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/dahlias/${d.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
