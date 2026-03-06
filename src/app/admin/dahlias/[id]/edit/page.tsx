import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { DahliaForm } from "@/components/dahlia-form";

export default async function EditDahliaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dahlia = await prisma.dahlia.findUnique({
    where: { id: parseInt(id) },
  });

  if (!dahlia) notFound();

  const initialData = {
    ...dahlia,
    images: JSON.parse(dahlia.images) as string[],
  };

  return (
    <div className="min-h-screen bg-sage-50/30">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold">Edit {dahlia.name}</h1>
          <Link href="/admin">
            <Button variant="outline">Back to dashboard</Button>
          </Link>
        </div>
        <DahliaForm initialData={initialData} />
      </div>
    </div>
  );
}
