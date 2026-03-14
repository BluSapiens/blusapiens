import type { BlogBlock, BlogEditorDraft, PublicBlogPostSummary } from "@/blog/utils/types";
import { getBlockText, slugify } from "@/blog/utils/editor";

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

function getHeadingBlocks(blocks: BlogBlock[]) {
  return blocks.filter((block) => block.type === "HEADING");
}

function getParagraphBlocks(blocks: BlogBlock[]) {
  return blocks.filter((block) => block.type === "PARAGRAPH");
}

function getImageBlocks(blocks: BlogBlock[]) {
  return blocks.filter((block) => block.type === "IMAGE");
}

export function getKeywordSuggestions(draft: BlogEditorDraft) {
  const bag = tokenize([draft.title, draft.excerpt, ...draft.blocks.map(getBlockText)].join(" "));
  const counts = new Map<string, number>();

  bag.forEach((token) => {
    counts.set(token, (counts.get(token) || 0) + 1);
  });

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 8)
    .map(([word]) => word);
}

export function getInternalLinkSuggestions(draft: BlogEditorDraft, posts: PublicBlogPostSummary[]) {
  const primaryTokens = new Set(tokenize(`${draft.title} ${draft.excerpt}`));

  return posts
    .filter((post) => slugify(post.slug) !== slugify(draft.slug))
    .filter((post) => tokenize(`${post.title} ${post.excerpt}`).some((token) => primaryTokens.has(token)))
    .slice(0, 5)
    .map((post) => ({
      title: post.title,
      slug: post.slug,
      category: post.category,
    }));
}

export function analyzeDraftSeo(draft: BlogEditorDraft, posts: PublicBlogPostSummary[]) {
  const headings = getHeadingBlocks(draft.blocks);
  const paragraphs = getParagraphBlocks(draft.blocks);
  const images = getImageBlocks(draft.blocks);
  const keywordSuggestions = getKeywordSuggestions(draft);
  const primaryKeyword = draft.focusKeyword.trim().toLowerCase();
  const densityBase = tokenize(
    [draft.title, draft.excerpt, ...draft.blocks.map(getBlockText)].join(" "),
  );
  const keywordCount = primaryKeyword
    ? densityBase.filter((word) => word === primaryKeyword).length
    : 0;
  const keywordDensity = densityBase.length ? keywordCount / densityBase.length : 0;
  const longParagraphs = paragraphs.filter((block) => getBlockText(block).length > 420).length;
  const missingImageAlt = images.filter((block) => !String(block.data.alt || block.media?.alt || "").trim()).length;

  return {
    metaTitlePreview: draft.seoTitle || draft.metaTitle || draft.title,
    metaDescriptionPreview: draft.seoDescription || draft.metaDescription || draft.excerpt,
    slugPreview: `/blog/${draft.slug || slugify(draft.title)}`,
    keywordSuggestions,
    headingStructure: headings.map((block) => ({
      level: Number(block.data.level || 2),
      text: String(block.title || block.data.text || ""),
    })),
    estimatedReadingTime: draft.readingTime,
    internalLinkSuggestions: getInternalLinkSuggestions(draft, posts),
    issues: {
      missingHeadings: headings.length === 0,
      longParagraphs,
      missingImageAlt,
      keywordDensityLow: Boolean(primaryKeyword) && keywordDensity < 0.005,
      keywordDensityHigh: Boolean(primaryKeyword) && keywordDensity > 0.03,
    },
  };
}
