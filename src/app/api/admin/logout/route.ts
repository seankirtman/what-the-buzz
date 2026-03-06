import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "admin_session";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  return NextResponse.json({ success: true });
}
