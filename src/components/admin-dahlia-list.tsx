"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteDahliaButton } from "@/components/delete-dahlia-button";

interface Dahlia {
  id: number;
  name: string;
  category: string;
  color: string;
  price: number;
  sortOrder?: number;
}

interface AdminDahliaListProps {
  dahlias: Dahlia[];
}

function SortableItem({
  dahlia,
}: {
  dahlia: Dahlia;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: dahlia.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between rounded-lg border border-sage-200/60 bg-white p-4 ${
        isDragging ? "z-10 shadow-lg opacity-90" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          <GripVertical className="size-5" />
        </button>
        <div>
          <p className="font-medium">{dahlia.name}</p>
          <p className="text-sm text-muted-foreground">
            {dahlia.category} · {dahlia.color} · ${dahlia.price.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Link href={`/admin/dahlias/${dahlia.id}/edit`}>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </Link>
        <DeleteDahliaButton id={dahlia.id} name={dahlia.name} />
      </div>
    </div>
  );
}

export function AdminDahliaList({ dahlias: initialDahlias }: AdminDahliaListProps) {
  const router = useRouter();
  const [dahlias, setDahlias] = useState(
    [...initialDahlias].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = dahlias.findIndex((d) => d.id === active.id);
    const newIndex = dahlias.findIndex((d) => d.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(dahlias, oldIndex, newIndex);
    setDahlias(reordered);

    const items = reordered.map((d, i) => ({ id: d.id, sortOrder: i }));
    const res = await fetch("/api/admin/dahlias/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });

    if (!res.ok) {
      setDahlias(dahlias);
      return;
    }
    router.refresh();
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={dahlias.map((d) => d.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {dahlias.map((d) => (
            <SortableItem key={d.id} dahlia={d} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
