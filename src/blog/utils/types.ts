export type MediaKind = "IMAGE" | "VIDEO" | "FILE" | "AUDIO" | "SVG";

export type BlogBlockType =
  | "PARAGRAPH"
  | "HEADING"
  | "IMAGE"
  | "EMBED"
  | "CODE"
  | "QUOTE"
  | "LIST"
  | "TABLE"
  | "CTA"
  | "AFFILIATE";

export type BlogStatus = "DRAFT" | "PUBLISHED";

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type MediaAsset = {
  id: string;
  kind: MediaKind;
  url: string;
  optimizedUrl: string | null;
  publicId: string | null;
  width: number | null;
  height: number | null;
  mime: string | null;
  sizeBytes: number | null;
  alt: string | null;
  title: string | null;
  caption: string | null;
  resourceType: string;
  createdAt: string | null;
  updatedAt: string | null;
  isTemporary?: boolean;
};

export type BlogCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  image: MediaAsset | null;
  count?: number;
};

export type BlogFaq = {
  id?: string;
  question: string;
  answer: string;
  order: number;
  schemaEnabled?: boolean;
};

export type BlogAffiliate = {
  id: string;
  ord: number;
  label: string | null;
  note: string | null;
  offer: {
    id: string;
    slug: string;
    name: string;
    url: string;
    finalUrl: string | null;
    code: string | null;
    note: string | null;
    type: string;
    partner: {
      id: string;
      slug: string;
      name: string;
    } | null;
  };
};

export type BlogBlock = {
  id: string;
  type: BlogBlockType;
  ord: number;
  title: string | null;
  text: string | null;
  data: Record<string, unknown>;
  anchorId: string | null;
  includeInToc: boolean;
  mediaId: string | null;
  media: MediaAsset | null;
  postAffiliateId: string | null;
  affiliate: BlogAffiliate | null;
};

export type TocItem = {
  id: string;
  level: number;
  text: string;
};

export type BlogPostRecord = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  metaTitle: string;
  metaDescription: string;
  seoTitle: string | null;
  seoDescription: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  excerpt: string;
  status: BlogStatus;
  tags: string[];
  publishDate: string | null;
  updatedDate: string | null;
  readingTime: string;
  readMins: number | null;
  wordCount: number | null;
  featured: boolean;
  canonicalUrl: string | null;
  focusKeyword: string | null;
  noIndex: boolean;
  noFollow: boolean;
  coverAlt: string | null;
  cover: MediaAsset | null;
  ogImage: MediaAsset | null;
  body: string[];
  headings: string[];
  blocks: BlogBlock[];
  toc: TocItem[];
  faqs: BlogFaq[];
  author: string;
  catId: string;
  cat: BlogCategory;
  slugHistory?: Array<{
    id: string;
    slug: string;
    createdAt: string | null;
  }>;
  createdAt: string | null;
  updatedAt: string | null;
};

export type BlogEditorMeta = {
  cats: BlogCategory[];
  tags: Array<{
    id: string;
    slug: string;
    name: string;
  }>;
  statuses: BlogStatus[];
  blockTypes: BlogBlockType[];
  mediaFolders: Record<string, string>;
  cloudinary: {
    enabled: boolean;
  };
};

export type PublicBlogPostSummary = {
  id: string;
  slug: string;
  resolvedSlug: string;
  title: string;
  subtitle: string | null;
  metaTitle: string;
  metaDescription: string;
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
  excerpt: string;
  category: string;
  cat: BlogCategory;
  tags: string[];
  author: string;
  publishDate: string | null;
  updatedDate: string | null;
  readingTime: string;
  readMins: number | null;
  wordCount: number | null;
  featured: boolean;
  canonicalUrl: string | null;
  focusKeyword: string | null;
  noIndex: boolean;
  noFollow: boolean;
  coverAlt: string | null;
  cover: MediaAsset | null;
  ogImage: MediaAsset | null;
};

export type PublicBlogPostDetail = PublicBlogPostSummary & {
  body: string[];
  headings: string[];
  blocks: BlogBlock[];
  toc: TocItem[];
  faqs: BlogFaq[];
  schemaData?: Record<string, unknown> | null;
};

export type BlogEditorDraft = {
  id?: string;
  slug: string;
  title: string;
  subtitle: string;
  metaTitle: string;
  metaDescription: string;
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
  excerpt: string;
  status: BlogStatus;
  tags: string[];
  publishDate: string;
  featured: boolean;
  canonicalUrl: string;
  focusKeyword: string;
  noIndex: boolean;
  noFollow: boolean;
  coverAlt: string;
  cover: MediaAsset | null;
  ogImage: MediaAsset | null;
  blocks: BlogBlock[];
  faqs: BlogFaq[];
  author: string;
  catId: string;
  readMins: number;
  wordCount: number;
  readingTime: string;
};
