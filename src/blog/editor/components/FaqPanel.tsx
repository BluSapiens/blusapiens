import { createEmptyFaq } from "@/blog/utils/editor";
import type { BlogEditorDraft } from "@/blog/utils/types";

export default function FaqPanel({
  draft,
  onChange,
}: {
  draft: BlogEditorDraft;
  onChange: (next: BlogEditorDraft) => void;
}) {
  return (
    <section className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">FAQ Section</p>
          <h2 className="mt-2 text-2xl font-semibold">Schema-ready FAQs</h2>
        </div>
        <button
          type="button"
          onClick={() => onChange({ ...draft, faqs: [...draft.faqs, createEmptyFaq(draft.faqs.length)] })}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
        >
          Add FAQ
        </button>
      </div>

      <div className="space-y-4">
        {draft.faqs.map((faq, index) => (
          <div key={`${faq.order}-${index}`} className="space-y-3 rounded-2xl border border-border bg-background p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">FAQ {index + 1}</p>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...draft,
                    faqs: draft.faqs
                      .filter((_, itemIndex) => itemIndex !== index)
                      .map((item, itemIndex) => ({ ...item, order: itemIndex + 1 })),
                  })
                }
                className="rounded-lg border border-border px-3 py-2 text-xs text-destructive"
              >
                Remove
              </button>
            </div>
            <input
              value={faq.question}
              onChange={(event) =>
                onChange({
                  ...draft,
                  faqs: draft.faqs.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, question: event.target.value } : item,
                  ),
                })
              }
              placeholder="Question"
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm"
            />
            <textarea
              rows={4}
              value={faq.answer}
              onChange={(event) =>
                onChange({
                  ...draft,
                  faqs: draft.faqs.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, answer: event.target.value } : item,
                  ),
                })
              }
              placeholder="Answer"
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm"
            />
            <label className="inline-flex items-center gap-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={faq.schemaEnabled ?? true}
                onChange={(event) =>
                  onChange({
                    ...draft,
                    faqs: draft.faqs.map((item, itemIndex) =>
                      itemIndex === index
                        ? { ...item, schemaEnabled: event.target.checked }
                        : item,
                    ),
                  })
                }
              />
              Include in FAQ schema
            </label>
          </div>
        ))}
      </div>
    </section>
  );
}
