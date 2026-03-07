export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function parseCartItems(cartItems: string): { name: string; slug: string; qty: number; price: number }[] {
  try {
    return JSON.parse(cartItems);
  } catch {
    return [];
  }
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let order: Awaited<ReturnType<typeof prisma.orderInquiry.findUnique>> = null;
  if (prisma.orderInquiry) {
    try {
      order = await prisma.orderInquiry.findUnique({
        where: { id: parseInt(id) },
      });
    } catch {
      // model may not exist if Prisma client is stale
    }
  }

  if (!order) notFound();

  const items = parseCartItems(order.cartItems);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="min-h-screen bg-sage-50/30">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold">Order #{order.id}</h1>
          <Link href="/admin/orders">
            <Button variant="outline">Back to Orders</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Name:</strong> {order.name}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a
                href={`mailto:${order.email}`}
                className="text-rose-800 hover:underline"
              >
                {order.email}
              </a>
            </p>
            <p>
              <strong>Submitted:</strong>{" "}
              {new Date(order.createdAt).toLocaleString("en-US", { timeZone: "America/New_York" })}
            </p>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Delivery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Method:</strong>{" "}
              {order.deliveryMethod === "pickup" ? "Local Pickup" : "Shipping"}
            </p>
            {order.deliveryMethod === "pickup" && (
              <>
                {order.pickupTime && (
                  <p>
                    <strong>Preferred time:</strong> {order.pickupTime}
                  </p>
                )}
                {order.phone && (
                  <p>
                    <strong>Phone:</strong>{" "}
                    <a
                      href={`tel:${order.phone}`}
                      className="text-rose-800 hover:underline"
                    >
                      {order.phone}
                    </a>
                  </p>
                )}
              </>
            )}
            {order.deliveryMethod === "shipping" && order.shippingAddress && (
              <p>
                <strong>Address:</strong>
                <br />
                <span className="whitespace-pre-wrap">{order.shippingAddress}</span>
              </p>
            )}
          </CardContent>
        </Card>

        {items.length > 0 && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Cart</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sage-200">
                    <th className="py-2 text-left font-medium">Item</th>
                    <th className="py-2 text-right font-medium">Qty</th>
                    <th className="py-2 text-right font-medium">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.slug} className="border-b border-sage-100">
                      <td className="py-2">{item.name}</td>
                      <td className="py-2 text-right">{item.qty}</td>
                      <td className="py-2 text-right">
                        ${(item.price * item.qty).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2} className="py-2 font-medium">
                      Total
                    </td>
                    <td className="py-2 text-right font-medium">
                      ${total.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </CardContent>
          </Card>
        )}

        {order.message && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Message</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {order.message}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
