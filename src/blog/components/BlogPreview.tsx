import BlogBlockRenderer from "@/blog/components/BlogBlockRenderer";
import type { BlogEditorDraft } from "@/blog/utils/types";

export default function BlogPreview({
  draft,
  viewport = "desktop",
}: {
  draft: BlogEditorDraft;
  viewport?: "desktop" | "mobile";
}) {
  return (
    <div
      className={`mx-auto rounded-[28px] border border-border bg-background shadow-sm ${
        viewport === "mobile" ? "max-w-sm" : "max-w-4xl"
      }`}
    >
      <div className="hero-bg rounded-t-[28px] px-6 py-10 text-primary-foreground">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          Live Preview
        </p>
        <h1 className="mt-3 text-3xl font-bold">{draft.title || "Untitled draft"}</h1>
        <p className="mt-3 max-w-2xl text-sm text-primary-foreground/70">
          {draft.excerpt || "Your article summary will appear here."}
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-xs text-primary-foreground/70">
          <span>{draft.readingTime}</span>
          <span>{draft.publishDate ? new Date(draft.publishDate).toLocaleDateString("en-US") : "Unscheduled"}</span>
          <span>{draft.tags.length} tags</span>
        </div>
      </div>

      <div className="space-y-6 px-6 py-8">
        {draft.cover ? (
          <img
            src={draft.cover.optimizedUrl || draft.cover.url}
            alt={draft.coverAlt || draft.cover.alt || ""}
            className="h-auto w-full rounded-2xl object-cover"
          />
        ) : null}

        {draft.blocks.map((block) => (
          <BlogBlockRenderer key={block.id} block={block} />
        ))}

        {draft.faqs.length > 0 ? (
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
            <div className="mt-4 space-y-4">
              {draft.faqs.map((faq) => (
                <div key={`${faq.question}-${faq.order}`} className="rounded-xl border border-border px-4 py-3">
                  <p className="font-medium">{faq.question || "Untitled question"}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer || "Answer preview"}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
