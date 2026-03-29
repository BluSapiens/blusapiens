import type {
  BlogBlock,
  BlogBlockType,
  BlogEditorDraft,
  BlogEditorMeta,
  BlogFaq,
  BlogPostRecord,
  MediaAsset,
} from "@/blog/utils/types";

export const BLOG_BLOCK_LABELS: Record<BlogBlockType, string> = {
  PARAGRAPH: "Paragraph",
  HEADING: "Heading",
  IMAGE: "Image",
  EMBED: "Embed",
  CODE: "Code",
  QUOTE: "Quote",
  LIST: "List",
  TABLE: "Table",
  CTA: "Callout / Link",
  AFFILIATE: "Affiliate Product",
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "blog-post";
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getBlockText(block: BlogBlock) {
  if (block.type === "PARAGRAPH" || block.type === "QUOTE" || block.type === "CODE") {
    return String(block.text || block.data.text || "");
  }

  if (block.type === "HEADING") {
    return String(block.title || block.data.text || "");
  }

  if (block.type === "LIST") {
    return Array.isArray(block.data.items) ? block.data.items.join(" ") : "";
  }

  if (block.type === "TABLE") {
    const headers = Array.isArray(block.data.headers) ? block.data.headers.join(" ") : "";
    const rows = Array.isArray(block.data.rows)
      ? (block.data.rows as string[][]).flat().join(" ")
      : "";
    return `${headers} ${rows}`.trim();
  }

  if (block.type === "CTA" || block.type === "EMBED" || block.type === "AFFILIATE") {
    return Object.values(block.data).join(" ");
  }

  return "";
}

export function countWords(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export function getMetricsFromDraft(draft: Pick<BlogEditorDraft, "title" | "excerpt" | "blocks">) {
  const text = [draft.title, draft.excerpt, ...draft.blocks.map(getBlockText)].join(" ").trim();
  const wordCount = countWords(text);
  const readMins = Math.max(1, Math.ceil(wordCount / 220));

  return {
    wordCount,
    readMins,
    readingTime: `${readMins} min read`,
  };
}

export function createBlock(type: BlogBlockType): BlogBlock {
  const base: BlogBlock = {
    id: uid("block"),
    type,
    ord: 0,
    title: null,
    text: null,
    data: {},
    anchorId: null,
    includeInToc: type === "HEADING",
    mediaId: null,
    media: null,
    postAffiliateId: null,
    affiliate: null,
  };

  switch (type) {
    case "PARAGRAPH":
      return { ...base, text: "Start writing..." };
    case "HEADING":
      return {
        ...base,
        title: "Section heading",
        anchorId: "section-heading",
        data: { level: 2, text: "Section heading" },
      };
    case "IMAGE":
      return {
        ...base,
        data: { alt: "", caption: "", align: "center" },
      };
    case "EMBED":
      return {
        ...base,
        data: { provider: "YouTube", url: "", title: "" },
      };
    case "CODE":
      return {
        ...base,
        text: "",
        data: { language: "ts", code: "" },
      };
    case "QUOTE":
      return {
        ...base,
        text: "",
        data: { citation: "" },
      };
    case "LIST":
      return {
        ...base,
        data: { style: "bullet", items: ["First point", "Second point"] },
      };
    case "TABLE":
      return {
        ...base,
        data: { headers: ["Column 1", "Column 2"], rows: [["", ""], ["", ""]] },
      };
    case "CTA":
      return {
        ...base,
        title: "Callout title",
        data: { variant: "callout", tone: "default", body: "", buttonText: "", href: "" },
      };
    case "AFFILIATE":
      return {
        ...base,
        data: {
          productName: "",
          description: "",
          affiliateUrl: "",
          buttonText: "View offer",
          priceLabel: "",
        },
      };
    default:
      return base;
  }
}

export function normalizeBlockOrder(blocks: BlogBlock[]) {
  return blocks.map((block, index) => ({
    ...block,
    ord: index,
  }));
}

export function reorderBlocks(blocks: BlogBlock[], fromId: string, toId: string) {
  const fromIndex = blocks.findIndex((block) => block.id === fromId);
  const toIndex = blocks.findIndex((block) => block.id === toId);

  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
    return blocks;
  }

  const next = [...blocks];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return normalizeBlockOrder(next);
}

export function createEmptyFaq(index: number): BlogFaq {
  return {
    question: "",
    answer: "",
    order: index + 1,
    schemaEnabled: true,
  };
}

export function createEmptyDraft(meta?: BlogEditorMeta): BlogEditorDraft {
  const draft: BlogEditorDraft = {
    slug: "",
    title: "",
    subtitle: "",
    metaTitle: "",
    metaDescription: "",
    seoTitle: "",
    seoDescription: "",
    ogTitle: "",
    ogDescription: "",
    excerpt: "",
    status: "DRAFT",
    tags: [],
    publishDate: new Date().toISOString(),
    featured: false,
    canonicalUrl: "",
    focusKeyword: "",
    noIndex: false,
    noFollow: false,
    coverAlt: "",
    cover: null,
    ogImage: null,
    blocks: normalizeBlockOrder([createBlock("PARAGRAPH")]),
    faqs: [],
    author: "",
    catId: meta?.cats[0]?.id || "",
    readMins: 1,
    wordCount: 0,
    readingTime: "1 min read",
  };

  return { ...draft, ...getMetricsFromDraft(draft) };
}

export function createDraftFromPost(post: BlogPostRecord): BlogEditorDraft {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    subtitle: post.subtitle || "",
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    seoTitle: post.seoTitle || "",
    seoDescription: post.seoDescription || "",
    ogTitle: post.ogTitle || "",
    ogDescription: post.ogDescription || "",
    excerpt: post.excerpt,
    status: post.status,
    tags: post.tags,
    publishDate: post.publishDate || new Date().toISOString(),
    featured: post.featured,
    canonicalUrl: post.canonicalUrl || "",
    focusKeyword: post.focusKeyword || "",
    noIndex: post.noIndex,
    noFollow: post.noFollow,
    coverAlt: post.coverAlt || "",
    cover: post.cover,
    ogImage: post.ogImage,
    blocks: normalizeBlockOrder(
      post.blocks.map((block) => ({
        ...block,
        id: block.id || uid("block"),
      })),
    ),
    faqs: post.faqs.map((faq, index) => ({
      ...faq,
      order: index + 1,
      schemaEnabled: faq.schemaEnabled ?? true,
    })),
    author: post.author,
    catId: post.catId,
    readMins: post.readMins || 1,
    wordCount: post.wordCount || 0,
    readingTime: post.readingTime,
  };
}

export function withRecomputedMetrics(draft: BlogEditorDraft) {
  return {
    ...draft,
    ...getMetricsFromDraft(draft),
  };
}

export function updateBlockMedia(block: BlogBlock, media: MediaAsset | null) {
  return {
    ...block,
    mediaId: media && !media.isTemporary ? media.id : null,
    media,
  };
}

export function isTemporaryMediaAsset(asset: MediaAsset | null | undefined): asset is MediaAsset {
  return Boolean(asset?.isTemporary && asset.publicId);
}

export function getTemporaryMediaAssetKey(asset: Pick<MediaAsset, "publicId" | "resourceType" | "id">) {
  return `${asset.resourceType || "image"}:${asset.publicId || asset.id}`;
}

export function collectTemporaryMediaAssets(draft: BlogEditorDraft) {
  const uploads = new Map<string, MediaAsset>();

  const include = (asset: MediaAsset | null | undefined) => {
    if (!isTemporaryMediaAsset(asset)) {
      return;
    }

    uploads.set(getTemporaryMediaAssetKey(asset), asset);
  };

  include(draft.cover);
  include(draft.ogImage);
  draft.blocks.forEach((block) => include(block.media));

  return Array.from(uploads.values());
}
