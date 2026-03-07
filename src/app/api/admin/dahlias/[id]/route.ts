import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";

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
      slug,
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

    const dahlia = await prisma.dahlia.update({
      where: { id: parseInt(id) },
      data: {
        ...(name != null && { name }),
        ...(slug != null && {
          slug: slug.toLowerCase().replace(/\s+/g, "-"),
        }),
        ...(description != null && { description }),
        ...(detailedDescription != null && { detailedDescription }),
        ...(price != null && { price: parseFloat(price) }),
        ...(images != null && {
          images: JSON.stringify(Array.isArray(images) ? images : images ? [images] : []),
        }),
        ...(category != null && { category }),
        ...(color != null && { color }),
        ...(size != null && { size }),
        ...(availableForShipping != null && { availableForShipping }),
        ...(availableForPickup != null && { availableForPickup }),
        ...(inStock != null && { inStock }),
        ...(totalQty != null && { totalQty: typeof totalQty === "number" ? totalQty : parseInt(totalQty, 10) || 0 }),
        ...(qtySold != null && { qtySold: typeof qtySold === "number" ? qtySold : parseInt(qtySold, 10) || 0 }),
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
