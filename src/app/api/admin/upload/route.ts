import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
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

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const { createHash } = await import("crypto");
    const signature = createHash("sha1")
      .update(`folder=whats-the-buzz&timestamp=${timestamp}${apiSecret}`)
      .digest("hex");

    const uploadForm = new FormData();
    uploadForm.append("file", base64);
    uploadForm.append("folder", "whats-the-buzz");
    uploadForm.append("timestamp", timestamp);
    uploadForm.append("api_key", apiKey);
    uploadForm.append("signature", signature);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: uploadForm }
    );

    const result = await res.json();

    if (!res.ok) {
      console.error("Cloudinary error:", result);
      return NextResponse.json(
        { error: result?.error?.message ?? "Cloudinary upload failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload image" },
      { status: 500 }
    );
  }
}
