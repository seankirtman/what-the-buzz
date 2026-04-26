import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { isAdmin } from "@/lib/admin-auth";

const FOLDER = "whats-the-buzz";

/**
 * Returns signed upload params for direct browser → Cloudinary uploads.
 * Large files do not go through this server, avoiding Vercel body size limits
 * and base64 overhead from the old /api/admin/upload flow.
 */
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Cloudinary is not configured" },
      { status: 500 }
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const stringToSign = `folder=${FOLDER}&timestamp=${timestamp}`;
  const signature = createHash("sha1")
    .update(stringToSign + apiSecret)
    .digest("hex");

  return NextResponse.json({
    cloudName,
    apiKey,
    timestamp,
    signature,
    folder: FOLDER,
  });
}
