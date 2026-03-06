import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteDahliaButton } from "@/components/delete-dahlia-button";
import { LogoutButton } from "@/components/logout-button";

export default async function AdminDashboardPage() {
  const dahlias = await prisma.dahlia.findMany({
    orderBy: { name: "asc" },
  });

  const inStockCount = dahlias.filter((d) => d.inStock).length;

  return (
    <div className="min-h-screen bg-sage-50/30">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline">View site</Button>
            </Link>
            <Link href="/admin/dahlias/new">
              <Button>Add Dahlia</Button>
            </Link>
            <LogoutButton />
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Total listings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{dahlias.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">In stock</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{inStockCount}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dahlias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dahlias.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between rounded-lg border border-sage-200/60 bg-white p-4"
                >
                  <div>
                    <p className="font-medium">{d.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {d.category} · {d.color} · ${d.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/dahlias/${d.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <DeleteDahliaButton id={d.id} name={d.name} />
                  </div>
                </div>
              ))}
            </div>
            {dahlias.length === 0 && (
              <p className="py-8 text-center text-muted-foreground">
                No dahlias yet. Add your first one!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
