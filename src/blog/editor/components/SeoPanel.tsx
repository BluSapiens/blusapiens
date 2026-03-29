import type { BlogEditorDraft, PublicBlogPostSummary } from "@/blog/utils/types";
import { analyzeDraftSeo } from "@/blog/seo/analysis";

export default function SeoPanel({
  draft,
  posts,
  onChange,
}: {
  draft: BlogEditorDraft;
  posts: PublicBlogPostSummary[];
  onChange: (next: BlogEditorDraft) => void;
}) {
  const analysis = analyzeDraftSeo(draft, posts);

  return (
    <section className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">SEO Panel</p>
        <h2 className="mt-2 text-2xl font-semibold">Search and sharing signals</h2>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium">SEO Title</span>
          <input
            value={draft.seoTitle}
            onChange={(event) => onChange({ ...draft, seoTitle: event.target.value })}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">OG Title</span>
          <input
            value={draft.ogTitle}
            onChange={(event) => onChange({ ...draft, ogTitle: event.target.value })}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">SEO Description</span>
          <textarea
            rows={3}
            value={draft.seoDescription}
            onChange={(event) => onChange({ ...draft, seoDescription: event.target.value })}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">OG Description</span>
          <textarea
            rows={3}
            value={draft.ogDescription}
            onChange={(event) => onChange({ ...draft, ogDescription: event.target.value })}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-border bg-background p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Search Preview</p>
        <p className="mt-3 text-lg font-semibold text-accent">{analysis.metaTitlePreview || "Untitled page"}</p>
        <p className="mt-1 text-sm text-emerald-700">{analysis.slugPreview}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {analysis.metaDescriptionPreview || "Meta description preview"}
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-background p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Insights</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Reading time: {analysis.estimatedReadingTime}</li>
            <li>Missing headings: {analysis.issues.missingHeadings ? "Yes" : "No"}</li>
            <li>Long paragraphs: {analysis.issues.longParagraphs}</li>
            <li>Missing image alt text: {analysis.issues.missingImageAlt}</li>
            <li>
              Keyword density:
              {analysis.issues.keywordDensityHigh
                ? " too high"
                : analysis.issues.keywordDensityLow
                  ? " too low"
                  : " balanced"}
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-background p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Keyword Suggestions</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {analysis.keywordSuggestions.map((keyword) => (
              <button
                key={keyword}
                type="button"
                onClick={() => onChange({ ...draft, focusKeyword: keyword })}
                className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-background p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Heading Structure</p>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            {analysis.headingStructure.map((heading, index) => (
              <p key={`${heading.text}-${index}`}>H{heading.level}: {heading.text}</p>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Internal Linking Suggestions</p>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            {analysis.internalLinkSuggestions.map((item) => (
              <p key={item.slug}>
                {item.title} ({item.category})
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
