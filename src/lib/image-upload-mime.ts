/** Map extensions to MIME when the browser omits or mis-reports type (common with HEIC). */
const EXT_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  bmp: "image/bmp",
  svg: "image/svg+xml",
  avif: "image/avif",
  heic: "image/heic",
  heif: "image/heif",
  tif: "image/tiff",
  tiff: "image/tiff",
};

const ACCEPTABLE_EXT = new Set(Object.keys(EXT_TO_MIME));

export function isUploadableImageFile(file: File): boolean {
  const mime = (file.type ?? "").toLowerCase();
  if (mime.startsWith("image/")) return true;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ACCEPTABLE_EXT.has(ext)) return false;
  // HEIC often has empty or generic MIME
  if (!mime || mime === "application/octet-stream") return true;
  return false;
}

/** MIME for Cloudinary data URL upload (must be accurate for HEIC/HEIF). */
export function normalizeImageMimeType(file: File): string {
  const mime = (file.type ?? "").trim();
  if (mime.startsWith("image/")) return mime;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return EXT_TO_MIME[ext] ?? "image/jpeg";
}
