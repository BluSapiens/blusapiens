import { ADMIN_API_BASE_URL, adminRequest } from "@/lib/admin-auth";
import type {
  BlogCategory,
  BlogEditorDraft,
  BlogEditorMeta,
  BlogPostRecord,
  MediaAsset,
  PaginationMeta,
  PublicBlogPostDetail,
  PublicBlogPostSummary,
} from "@/blog/utils/types";

function serializeTemporaryMedia(asset: MediaAsset | null | undefined) {
  if (!asset?.isTemporary || !asset.publicId) {
    return null;
  }

  return {
    publicId: asset.publicId,
    url: asset.url,
    width: asset.width,
    height: asset.height,
    sizeBytes: asset.sizeBytes,
    mime: asset.mime,
    alt: asset.alt,
    title: asset.title,
    caption: asset.caption,
    resourceType: asset.resourceType,
  };
}

async function readJson<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as { message?: string } | null;

  if (!response.ok) {
    throw new Error(payload?.message || "Request failed");
  }

  return payload as T;
}

async function publicRequest(path: string) {
  return fetch(`${ADMIN_API_BASE_URL}${path}`);
}

export async function getAdminBlogMeta() {
  const response = await adminRequest("/api/admin/blog/meta", {
    method: "GET",
  });

  return readJson<BlogEditorMeta & { success: boolean }>(response);
}

export async function getAdminBlogPost(id: string) {
  const response = await adminRequest(`/api/admin/blog/posts/${id}`, {
    method: "GET",
  });

  const payload = await readJson<{ item: BlogPostRecord }>(response);
  return payload.item;
}

export async function saveAdminBlogPost(draft: BlogEditorDraft) {
  const payload = {
    title: draft.title,
    slug: draft.slug,
    subtitle: draft.subtitle || null,
    metaTitle: draft.metaTitle,
    metaDescription: draft.metaDescription,
    seoTitle: draft.seoTitle || null,
    seoDescription: draft.seoDescription || null,
    ogTitle: draft.ogTitle || null,
    ogDescription: draft.ogDescription || null,
    excerpt: draft.excerpt,
    status: draft.status,
    tags: draft.tags,
    publishDate: draft.publishDate,
    featured: draft.featured,
    canonicalUrl: draft.canonicalUrl || null,
    focusKeyword: draft.focusKeyword || null,
    noIndex: draft.noIndex,
    noFollow: draft.noFollow,
    coverAlt: draft.coverAlt || null,
    coverId: draft.cover && !draft.cover.isTemporary ? draft.cover.id : null,
    coverUpload: serializeTemporaryMedia(draft.cover),
    ogImageId: draft.ogImage && !draft.ogImage.isTemporary ? draft.ogImage.id : null,
    ogImageUpload: serializeTemporaryMedia(draft.ogImage),
    blocks: draft.blocks.map((block, index) => ({
      ...block,
      ord: index,
      mediaId: block.media && !block.media.isTemporary ? block.media.id : null,
      mediaUpload: serializeTemporaryMedia(block.media),
    })),
    faqs: draft.faqs.map((faq, index) => ({
      ...faq,
      order: index + 1,
    })),
    author: draft.author,
    catId: draft.catId,
  };
  const response = await adminRequest(
    draft.id ? `/api/admin/blog/posts/${draft.id}` : "/api/admin/blog/posts",
    {
      method: draft.id ? "PATCH" : "POST",
      body: JSON.stringify(payload),
    },
  );

  const result = await readJson<{ item: BlogPostRecord }>(response);
  return result.item;
}

export async function createAdminBlogCategory(input: {
  name: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
}) {
  const response = await adminRequest("/api/admin/blog/cats", {
    method: "POST",
    body: JSON.stringify(input),
  });

  const payload = await readJson<{ item: BlogCategory }>(response);
  return payload.item;
}

export async function listAdminMediaAssets(params: {
  q?: string;
  kind?: string;
  page?: number;
  limit?: number;
}) {
  const search = new URLSearchParams();

  if (params.q) {
    search.set("q", params.q);
  }

  if (params.kind) {
    search.set("kind", params.kind);
  }

  if (params.page) {
    search.set("page", String(params.page));
  }

  if (params.limit) {
    search.set("limit", String(params.limit));
  }

  const response = await adminRequest(`/api/admin/blog/media/assets?${search.toString()}`, {
    method: "GET",
  });

  return readJson<{ items: MediaAsset[]; meta: PaginationMeta }>(response);
}

export async function createCloudinarySignature(input: {
  target: "cover" | "content" | "og" | "file";
  resourceType: "image" | "raw";
}) {
  const response = await adminRequest("/api/admin/blog/media/signature", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return readJson<{
    cloudName: string;
    apiKey: string;
    timestamp: number;
    signature: string;
    folder: string;
    publicId: string | null;
    resourceType: string;
  }>(response);
}

export async function registerMediaAsset(input: Record<string, unknown>) {
  const response = await adminRequest("/api/admin/blog/media/assets", {
    method: "POST",
    body: JSON.stringify(input),
  });

  const payload = await readJson<{ item: MediaAsset }>(response);
  return payload.item;
}

export async function cleanupCloudinaryUploads(
  items: Array<{ publicId: string; resourceType: string }>,
  options?: { keepalive?: boolean },
) {
  if (items.length === 0) {
    return { deleted: 0 };
  }

  const response = await adminRequest("/api/admin/blog/media/cleanup", {
    method: "POST",
    body: JSON.stringify({ items }),
    keepalive: options?.keepalive,
  });

  return readJson<{ deleted: number }>(response);
}

export async function getPublicBlogCats() {
  const response = await publicRequest("/api/blog/cats");
  const payload = await readJson<{ items: Array<{ id: string; name: string; slug: string; count: number }> }>(
    response,
  );
  return payload.items;
}

export async function getPublicBlogPosts(params: { q?: string; cat?: string; page?: number }) {
  const search = new URLSearchParams();

  if (params.q) {
    search.set("q", params.q);
  }

  if (params.cat) {
    search.set("cat", params.cat);
  }

  if (params.page) {
    search.set("page", String(params.page));
  }

  const response = await publicRequest(`/api/blog/posts?${search.toString()}`);
  return readJson<{
    featured: PublicBlogPostSummary | null;
    items: PublicBlogPostSummary[];
    meta: PaginationMeta;
  }>(response);
}

export async function getPublicBlogPost(slug: string) {
  const response = await publicRequest(`/api/blog/posts/${slug}`);
  return readJson<{
    post: PublicBlogPostDetail;
    related: PublicBlogPostSummary[];
    prev: PublicBlogPostSummary | null;
    next: PublicBlogPostSummary | null;
  }>(response);
}
