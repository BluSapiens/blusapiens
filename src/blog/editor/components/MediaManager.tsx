import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { listAdminMediaAssets } from "@/blog/services/blog-api";
import { uploadCloudinaryAsset } from "@/blog/media/cloudinaryService";
import type { MediaAsset } from "@/blog/utils/types";

type MediaManagerProps = {
  open: boolean;
  kind: "IMAGE" | "FILE";
  target: "cover" | "content" | "og" | "file";
  onClose: () => void;
  onSelect: (asset: MediaAsset) => void;
};

export default function MediaManager({
  open,
  kind,
  target,
  onClose,
  onSelect,
}: MediaManagerProps) {
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);

  const mediaQuery = useQuery({
    queryKey: ["admin-media-assets", kind, search],
    queryFn: () => listAdminMediaAssets({ kind, q: search, limit: 24 }),
    enabled: open,
  });

  if (!open) {
    return null;
  }

  const handleUpload = async (file: File | null) => {
    if (!file) {
      return;
    }

    setUploading(true);

    try {
      const asset = await uploadCloudinaryAsset({
        file,
        target,
      });
      onSelect(asset);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4 py-8">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Cloudinary Media</p>
            <h3 className="mt-1 text-xl font-semibold">Select or upload media</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-border px-3 py-2 text-sm">
            Close
          </button>
        </div>

        <div className="grid gap-6 px-6 py-6 lg:grid-cols-[320px_1fr]">
          <div className="space-y-4 rounded-2xl border border-border bg-card p-4">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, alt, or public id"
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
            />
            <label className="block rounded-2xl border border-dashed border-accent/40 bg-accent/5 px-4 py-8 text-center text-sm">
              <span className="block font-medium text-foreground">
                {uploading ? "Uploading..." : "Upload to Cloudinary"}
              </span>
              <span className="mt-2 block text-muted-foreground">
                Images go to `BluSaps/blusapiens/blog/{target === "file" ? "files" : target === "og" ? "og" : target === "cover" ? "covers" : "content"}`
              </span>
              <input
                type="file"
                className="hidden"
                accept={kind === "IMAGE" ? "image/*" : ".pdf,.doc,.docx,.zip,.txt,.csv"}
                onChange={(event) => handleUpload(event.target.files?.[0] || null)}
              />
            </label>
            <p className="text-xs text-muted-foreground">
              Uploads go directly to Cloudinary and stay temporary until the blog save succeeds.
            </p>
          </div>

          <div className="grid max-h-[60vh] grid-cols-2 gap-4 overflow-y-auto pr-2 md:grid-cols-3">
            {(mediaQuery.data?.items || []).map((asset) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => onSelect(asset)}
                className="overflow-hidden rounded-2xl border border-border bg-card text-left transition hover:border-accent/40"
              >
                {asset.kind === "IMAGE" ? (
                  <img
                    src={asset.optimizedUrl || asset.url}
                    alt={asset.alt || asset.title || ""}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center bg-secondary text-sm font-semibold text-muted-foreground">
                    {asset.mime || asset.kind}
                  </div>
                )}
                <div className="space-y-1 px-4 py-3">
                  <p className="line-clamp-1 text-sm font-semibold">{asset.title || asset.publicId || "Untitled asset"}</p>
                  <p className="line-clamp-1 text-xs text-muted-foreground">{asset.alt || asset.url}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
