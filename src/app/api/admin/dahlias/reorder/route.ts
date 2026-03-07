import { NextRequest, NextResponse } from "next/server";
import { isSortOrderUnsupportedError, prisma } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";

export async function PUT(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const items = body.items as Array<{ id: number; sortOrder: number }> | undefined;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "items array required" },
        { status: 400 }
      );
    }

    try {
      await prisma.$transaction(
        items.map(({ id, sortOrder }) =>
          prisma.dahlia.update({
            where: { id },
            data: { sortOrder },
          })
        )
      );
    } catch (error) {
      if (!isSortOrderUnsupportedError(error)) throw error;
      return NextResponse.json(
        { success: false, warning: "Sort order is not available in this deployment yet." },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reorder error:", error);
    return NextResponse.json(
      { error: "Failed to reorder" },
      { status: 500 }
    );
  }
}
