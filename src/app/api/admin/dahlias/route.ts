import { NextRequest, NextResponse } from "next/server";
import { isSortOrderUnsupportedError, prisma } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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
    } = body;

    if (!name || !slug || !description || !detailedDescription || price == null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let sortOrderData = {};
    try {
      const maxOrder = await prisma.dahlia
        .aggregate({ _max: { sortOrder: true } })
        .then((r) => (r._max.sortOrder ?? -1) + 1);
      sortOrderData = { sortOrder: maxOrder };
    } catch (error) {
      if (!isSortOrderUnsupportedError(error)) throw error;
    }

    const dahlia = await prisma.dahlia.create({
      data: {
        name,
        slug: slug.toLowerCase().replace(/\s+/g, "-"),
        description,
        detailedDescription,
        price: parseFloat(price),
        images: JSON.stringify(Array.isArray(images) ? images : images ? [images] : []),
        category: category ?? "Other",
        color: color ?? "",
        size: size ?? "Medium",
        availableForShipping: availableForShipping !== false,
        availableForPickup: availableForPickup !== false,
        inStock: inStock !== false,
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
