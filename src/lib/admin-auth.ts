import { cookies } from "next/headers";

const ADMIN_COOKIE = "admin_session";

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE)?.value;
  return session === "authenticated";
}
