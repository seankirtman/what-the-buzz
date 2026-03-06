import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      qty,
      message,
      deliveryMethod,
      pickupTime,
      phone,
      shippingAddress,
      dahliaName,
      dahliaSlug,
    } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Email not configured" },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
    const toEmail = process.env.DORRIE_EMAIL ?? "dorrie@example.com";

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `Dahlia Inquiry from ${name}`,
      html: `
        <h2>New Dahlia Inquiry</h2>
        <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        ${dahliaName ? `<p><strong>Interested in:</strong> ${dahliaName}</p>` : ""}
        ${qty ? `<p><strong>Quantity:</strong> ${qty}</p>` : ""}
        <p><strong>Delivery preference:</strong> ${deliveryMethod === "pickup" ? "Local Pickup" : "Shipping"}</p>
        ${deliveryMethod === "pickup" ? `<p><strong>Preferred pickup time:</strong> ${pickupTime ?? "Not specified"}</p><p><strong>Phone:</strong> ${phone ?? "Not provided"}</p>` : ""}
        ${deliveryMethod === "shipping" ? `<p><strong>Shipping address:</strong> ${shippingAddress ?? "Not provided"}</p><p><em>Standard shipping rate applies</em></p>` : ""}
        ${message ? `<p><strong>Message:</strong></p><p>${message.replace(/\n/g, "<br>")}</p>` : ""}
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
