import { NextRequest, NextResponse } from "next/server";
import { isSortOrderUnsupportedError, prisma } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";
import { uniqueDahliaSlugFromName } from "@/lib/dahlia-slug";

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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
    } = body;

    if (!name || !String(name).trim() || price == null || price === "") {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 }
      );
    }

    const priceNum = parseFloat(String(price));
    if (Number.isNaN(priceNum) || priceNum < 0) {
      return NextResponse.json(
        { error: "Valid price is required" },
        { status: 400 }
      );
    }

    const slug = await uniqueDahliaSlugFromName(String(name).trim());

    let sortOrderData = {};
    try {
      const maxOrder = await prisma.dahlia
        .aggregate({ _max: { sortOrder: true } })
        .then((r) => (r._max.sortOrder ?? -1) + 1);
      sortOrderData = { sortOrder: maxOrder };
    } catch (error) {
      if (!isSortOrderUnsupportedError(error)) throw error;
    }

    const tq =
      typeof totalQty === "number" ? totalQty : parseInt(String(totalQty), 10) || 0;

    const dahlia = await prisma.dahlia.create({
      data: {
        name: String(name).trim(),
        slug,
        description: String(description ?? ""),
        detailedDescription: String(detailedDescription ?? ""),
        price: priceNum,
        images: JSON.stringify(Array.isArray(images) ? images : images ? [images] : []),
        category: String(category ?? ""),
        color: String(color ?? ""),
        size: String(size ?? ""),
        availableForShipping: availableForShipping !== false,
        availableForPickup: availableForPickup !== false,
        inStock: inStock !== false,
        totalQty: tq,
        ...sortOrderData,
      },
    });

    return NextResponse.json({
      ...dahlia,
      images: JSON.parse(dahlia.images) as string[],
    });
  } catch (error) {
    console.error("Create dahlia error:", error);
    return NextResponse.json(
      { error: "Failed to create dahlia" },
      { status: 500 }
    );
  }
}
