export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function parseCartItems(cartItems: string): { name: string; qty: number; price: number }[] {
  try {
    return JSON.parse(cartItems);
  } catch {
    return [];
  }
}

export default async function AdminOrdersPage() {
  let orders: Awaited<ReturnType<typeof prisma.orderInquiry.findMany>> = [];
  if (prisma.orderInquiry) {
    try {
      orders = await prisma.orderInquiry.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch {
      // model may not exist if Prisma client is stale
    }
  }

  return (
    <div className="min-h-screen bg-sage-50/30">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold">Orders & Inquiries</h1>
          <Link href="/admin">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                No orders or inquiries yet.
              </p>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const items = parseCartItems(order.cartItems);
                  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
                  return (
                    <div
                      key={order.id}
                      className="rounded-lg border border-sage-200/60 bg-white p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {order.name} &lt;{order.email}&gt;
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleString()} ·{" "}
                            {order.deliveryMethod === "pickup"
                              ? "Local Pickup"
                              : "Shipping"}
                          </p>
                          {items.length > 0 && (
                            <p className="mt-2 text-sm">
                              {items.map((i) => `${i.name} × ${i.qty}`).join(", ")} — $
                              {total.toFixed(2)}
                            </p>
                          )}
                          {order.message && (
                            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                              {order.message}
                            </p>
                          )}
                        </div>
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
