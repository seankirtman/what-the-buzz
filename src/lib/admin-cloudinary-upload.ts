/**
 * Direct browser → Cloudinary upload (multipart). Avoids Vercel request size limits
 * and base64 bloat from proxying the file through our API.
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  const sigRes = await fetch("/api/admin/upload/signature", {
    credentials: "include",
  });
  if (!sigRes.ok) {
    const err = await sigRes.json().catch(() => ({}));
    throw new Error(
      (err as { error?: string }).error ?? "Not authorized or Cloudinary not configured"
    );
  }

  const { cloudName, apiKey, timestamp, signature, folder } = (await sigRes.json()) as {
    cloudName: string;
    apiKey: string;
    timestamp: number;
    signature: string;
    folder: string;
  };

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);
  form.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: form }
  );

  const data = (await res.json()) as { secure_url?: string; error?: { message?: string } };

  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Cloudinary upload failed");
  }
  if (!data.secure_url) {
    throw new Error("No image URL returned from Cloudinary");
  }
  return data.secure_url;
}
