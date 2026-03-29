import { createCloudinarySignature } from "@/blog/services/blog-api";
import type { MediaAsset } from "@/blog/utils/types";

function getResourceType(file: File) {
  return file.type.startsWith("image/") ? "image" : "raw";
}

function injectTransformations(url: string, transformation: string) {
  if (!url.includes("/upload/")) {
    return url;
  }

  return url.replace("/upload/", `/upload/${transformation}/`);
}

function getPreviewUrl(url: string, resourceType: string) {
  if (resourceType !== "image") {
    return url;
  }

  return injectTransformations(url, "w_auto,q_auto,f_auto");
}

export async function uploadCloudinaryAsset(input: {
  file: File;
  target: "cover" | "content" | "og" | "file";
  alt?: string;
}) {
  const resourceType = getResourceType(input.file) as "image" | "raw";
  const signature = await createCloudinarySignature({
    target: input.target,
    resourceType,
  });

  const form = new FormData();
  form.append("file", input.file);
  form.append("api_key", signature.apiKey);
  form.append("timestamp", String(signature.timestamp));
  form.append("signature", signature.signature);
  form.append("folder", signature.folder);

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/${resourceType}/upload`,
    {
      method: "POST",
      body: form,
    },
  );

  const uploadPayload = await uploadResponse.json().catch(() => null);

  if (!uploadResponse.ok) {
    throw new Error(uploadPayload?.error?.message || "Cloudinary upload failed");
  }

  const assetUrl = uploadPayload?.secure_url || uploadPayload?.url;

  if (!assetUrl || !uploadPayload?.public_id) {
    throw new Error("Cloudinary upload response was incomplete");
  }

  return {
    id: `temp:${uploadPayload.public_id}`,
    kind:
      resourceType === "raw"
        ? "FILE"
        : String(uploadPayload.format || "").toLowerCase() === "svg"
          ? "SVG"
          : "IMAGE",
    url: assetUrl,
    optimizedUrl: getPreviewUrl(assetUrl, resourceType),
    publicId: uploadPayload.public_id,
    width: uploadPayload.width ? Number(uploadPayload.width) : null,
    height: uploadPayload.height ? Number(uploadPayload.height) : null,
    mime: input.file.type || null,
    sizeBytes: uploadPayload.bytes ? Number(uploadPayload.bytes) : input.file.size || null,
    alt: input.alt || "",
    title: input.file.name,
    caption: null,
    resourceType,
    createdAt: null,
    updatedAt: null,
    isTemporary: true,
  } satisfies MediaAsset;
}
