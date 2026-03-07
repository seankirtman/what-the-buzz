import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      message,
      deliveryMethod,
      pickupTime,
      phone,
      shippingAddress,
      cartItems = [],
    } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Always save to database first
    await prisma.orderInquiry.create({
      data: {
        name,
        email,
        deliveryMethod: deliveryMethod ?? "pickup",
        pickupTime: pickupTime ?? null,
        phone: phone ?? null,
        shippingAddress: shippingAddress ?? null,
        message: message ?? null,
        cartItems: JSON.stringify(cartItems),
      },
    });

    // Increment qtySold for each dahlia in the order
    for (const item of cartItems as { slug?: string; qty?: number }[]) {
      const slug = item?.slug;
      const qty = typeof item?.qty === "number" ? item.qty : 1;
      if (slug && qty > 0) {
        try {
          await prisma.dahlia.updateMany({
            where: { slug },
            data: { qtySold: { increment: qty } },
          });
        } catch {
          // ignore if model doesn't have qtySold yet
        }
      }
    }

    // Optionally send email if Resend is configured
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
      const toEmail = process.env.DORRIE_EMAIL ?? "dorrie@example.com";

      const cartHtml =
        cartItems.length > 0
          ? `
        <h3>Cart / Order</h3>
        <table style="border-collapse: collapse; width: 100%; margin-bottom: 1rem;">
          <tr style="background: #f3f4f6;">
            <th style="padding: 0.5rem; text-align: left; border: 1px solid #e5e7eb;">Item</th>
            <th style="padding: 0.5rem; text-align: right; border: 1px solid #e5e7eb;">Qty</th>
            <th style="padding: 0.5rem; text-align: right; border: 1px solid #e5e7eb;">Price</th>
          </tr>
          ${cartItems
            .map(
              (i: { name: string; qty: number; price: number }) =>
                `<tr>
              <td style="padding: 0.5rem; border: 1px solid #e5e7eb;">${i.name}</td>
              <td style="padding: 0.5rem; text-align: right; border: 1px solid #e5e7eb;">${i.qty}</td>
              <td style="padding: 0.5rem; text-align: right; border: 1px solid #e5e7eb;">$${(i.price * i.qty).toFixed(2)}</td>
            </tr>`
            )
            .join("")}
        </table>
        <p><strong>Total:</strong> $${cartItems
          .reduce((s: number, i: { price: number; qty: number }) => s + i.price * i.qty, 0)
          .toFixed(2)}</p>
      `
          : "";

      const { error } = await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        subject: `Dahlia Order / Inquiry from ${name}`,
        html: `
        <h2>New Dahlia Order / Inquiry</h2>
        <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        ${cartHtml}
        <p><strong>Delivery preference:</strong> ${deliveryMethod === "pickup" ? "Local Pickup" : "Shipping"}</p>
        ${deliveryMethod === "pickup" ? `<p><strong>Preferred pickup time:</strong> ${pickupTime ?? "Not specified"}</p><p><strong>Phone:</strong> ${phone ?? "Not provided"}</p>` : ""}
        ${deliveryMethod === "shipping" ? `<p><strong>Shipping address:</strong> ${shippingAddress ?? "Not provided"}</p><p><em>Standard shipping rate applies</em></p>` : ""}
        ${message ? `<p><strong>Message:</strong></p><p>${message.replace(/\n/g, "<br>")}</p>` : ""}
      `,
      });

      if (error) {
        console.error("Resend error (order saved to DB):", error);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
