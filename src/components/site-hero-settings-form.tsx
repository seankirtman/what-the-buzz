"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isUploadableImageFile } from "@/lib/image-upload-mime";
import { uploadImageToCloudinary } from "@/lib/admin-cloudinary-upload";
import { DEFAULT_HERO_COVER } from "@/lib/site-settings-constants";

interface SiteHeroSettingsFormProps {
  initialHeroCoverUrl: string | null;
}

export function SiteHeroSettingsForm({
  initialHeroCoverUrl,
}: SiteHeroSettingsFormProps) {
  const [heroCoverUrl, setHeroCoverUrl] = useState(
    initialHeroCoverUrl?.trim() || ""
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayUrl = heroCoverUrl || DEFAULT_HERO_COVER;

  async function save(next: string | null) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroCoverUrl: next }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Save failed");
      }
      const data = await res.json();
      setHeroCoverUrl(data.heroCoverUrl?.trim() || "");
      toast.success("Home hero photo updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function uploadFiles(files: FileList | File[]) {
    const imageFiles = Array.from(files).filter(isUploadableImageFile);
    if (imageFiles.length === 0) {
      toast.error("Please select an image file");
      return;
    }
    const file = imageFiles[0];

    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setHeroCoverUrl(url);
      await save(url);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6 rounded-xl border border-sage-200/60 bg-white p-6 shadow-sm">
      <div>
        <Label>Home page hero (cover photo)</Label>
        <p className="mt-1 text-sm text-muted-foreground">
          This image appears behind the top section of the public home page. If unset, the site
          uses the default photo shipped with the app.
        </p>
      </div>

      <div
        className="relative min-h-[180px] overflow-hidden rounded-lg border border-sage-200 bg-sage-100/40 bg-cover bg-center"
        style={{ backgroundImage: `url(${JSON.stringify(displayUrl)})` }}
      >
        <div className="absolute inset-0 bg-black/20" aria-hidden />
        <p className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 text-xs text-white">
          Preview
        </p>
      </div>

      <div
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
          dragOver
            ? "border-rose-400 bg-rose-50"
            : "border-sage-200 hover:border-rose-300 hover:bg-sage-50/50"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
        onClick={() => !uploading && fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length > 0) uploadFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.heic,.heif"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) {
              uploadFiles(e.target.files);
              e.target.value = "";
            }
          }}
        />
        {uploading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Upload className="size-5 animate-pulse" />
            Uploading…
          </div>
        ) : (
          <>
            <ImagePlus className="size-8 text-muted-foreground/60" />
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              Click to upload or drag &amp; drop
            </p>
            <p className="text-xs text-muted-foreground/60">
              JPG, PNG, WebP, HEIC — routed through Cloudinary
            </p>
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Input
          className="max-w-xl flex-1"
          placeholder="Or paste image URL"
          value={heroCoverUrl}
          onChange={(e) => setHeroCoverUrl(e.target.value)}
        />
        <Button
          type="button"
          disabled={saving}
          onClick={() => save(heroCoverUrl.trim() || null)}
        >
          {saving ? "Saving…" : "Save URL"}
        </Button>
      </div>

      <Button
        type="button"
        variant="outline"
        disabled={saving}
        onClick={() => {
          setHeroCoverUrl("");
          void save(null);
        }}
      >
        Use default built-in photo
      </Button>
    </div>
  );
}
