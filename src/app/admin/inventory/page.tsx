export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryTable } from "@/components/inventory-table";

export default async function AdminInventoryPage() {
  const dahlias = await prisma.dahlia.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <div className="min-h-screen bg-sage-50/30">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold">Inventory</h1>
          <Link href="/admin">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dahlias — spreadsheet view</CardTitle>
            <p className="text-sm text-muted-foreground">
              Click Total or Qty sold to edit. Changes save automatically.
            </p>
          </CardHeader>
          <CardContent>
            {dahlias.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                No dahlias yet. Add your first one from the dashboard.
              </p>
            ) : (
              <InventoryTable dahlias={dahlias} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
