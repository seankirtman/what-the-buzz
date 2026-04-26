import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";
import { uniqueDahliaSlugFromName } from "@/lib/dahlia-slug";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      description,
      detailedDescription,
      price,
      images,
      category,
      color,
      size,
      availableForShipping,
      availableForPickup,
      inStock,
      totalQty,
      qtySold,
    } = body;

    const dahliaId = parseInt(id, 10);

    if (price != null) {
      const p = parseFloat(String(price));
      if (Number.isNaN(p) || p < 0) {
        return NextResponse.json(
          { error: "Valid price is required" },
          { status: 400 }
        );
      }
    }

    const newSlug =
      name != null
        ? await uniqueDahliaSlugFromName(String(name).trim(), dahliaId)
        : undefined;

    const dahlia = await prisma.dahlia.update({
      where: { id: dahliaId },
      data: {
        ...(name != null && { name: String(name).trim() }),
        ...(newSlug != null && { slug: newSlug }),
        ...(description != null && { description: String(description) }),
        ...(detailedDescription != null && { detailedDescription: String(detailedDescription) }),
        ...(price != null && { price: parseFloat(String(price)) }),
        ...(images != null && {
          images: JSON.stringify(Array.isArray(images) ? images : images ? [images] : []),
        }),
        ...(category != null && { category: String(category) }),
        ...(color != null && { color: String(color) }),
        ...(size != null && { size: String(size) }),
        ...(availableForShipping != null && { availableForShipping }),
        ...(availableForPickup != null && { availableForPickup }),
        ...(inStock != null && { inStock }),
        ...(totalQty != null && { totalQty: typeof totalQty === "number" ? totalQty : parseInt(String(totalQty), 10) || 0 }),
        ...(qtySold != null && { qtySold: typeof qtySold === "number" ? qtySold : parseInt(String(qtySold), 10) || 0 }),
      },
    });

    return NextResponse.json({
      ...dahlia,
      images: JSON.parse(dahlia.images) as string[],
    });
  } catch (error) {
    console.error("Update dahlia error:", error);
    return NextResponse.json(
      { error: "Failed to update dahlia" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.dahlia.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete dahlia error:", error);
    return NextResponse.json(
      { error: "Failed to delete dahlia" },
      { status: 500 }
    );
  }
}
