import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const row = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    return NextResponse.json({ heroCoverUrl: row?.heroCoverUrl ?? null });
  } catch (error) {
    console.error("site-settings GET:", error);
    return NextResponse.json({ heroCoverUrl: null });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { heroCoverUrl?: string | null };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const raw = body.heroCoverUrl;
  const heroCoverUrl =
    raw == null || String(raw).trim() === "" ? null : String(raw).trim();

  try {
    await prisma.siteSettings.upsert({
      where: { id: 1 },
      create: { id: 1, heroCoverUrl },
      update: { heroCoverUrl },
    });
    return NextResponse.json({ heroCoverUrl });
  } catch (error) {
    console.error("site-settings PUT:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save" },
      { status: 500 }
    );
  }
}
