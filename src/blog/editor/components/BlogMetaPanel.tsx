import { useState } from "react";
import { slugify } from "@/blog/utils/editor";
import type { BlogEditorDraft, BlogEditorMeta } from "@/blog/utils/types";

type CreateCategoryInput = {
  name: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
};

type Props = {
  draft: BlogEditorDraft;
  meta: BlogEditorMeta;
  onChange: (next: BlogEditorDraft) => void;
  onCreateCategory: (input: CreateCategoryInput) => Promise<void>;
  isCreatingCategory: boolean;
};

function updateTags(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

const emptyCategoryForm = {
  name: "",
  description: "",
  metaTitle: "",
  metaDescription: "",
};

export default function BlogMetaPanel({
  draft,
  meta,
  onChange,
  onCreateCategory,
  isCreatingCategory,
}: Props) {
  const slugPreview = draft.title.trim() ? slugify(draft.title) : "blog-post";
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);

  const submitCategory = async () => {
    if (!categoryForm.name.trim()) {
      return;
    }

    await onCreateCategory({
      name: categoryForm.name,
      description: categoryForm.description || undefined,
      metaTitle: categoryForm.metaTitle || undefined,
      metaDescription: categoryForm.metaDescription || undefined,
    });

    setCategoryForm(emptyCategoryForm);
    setShowCategoryForm(false);
  };

  return (
    <section className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Blog Meta</p>
        <h2 className="mt-2 text-2xl font-semibold">Core article details</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium">Title</span>
          <input
            value={draft.title}
            onChange={(event) => onChange({ ...draft, title: event.target.value })}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
          />
        </label>
        <div className="space-y-2">
          <span className="text-sm font-medium">Slug</span>
          <div className="rounded-xl border border-input bg-secondary px-4 py-3 text-sm text-muted-foreground">
            /blog/{slugPreview}
          </div>
          <p className="text-xs text-muted-foreground">Generated automatically from the title.</p>
        </div>
      </div>

      <label className="space-y-2">
        <span className="text-sm font-medium">Excerpt</span>
        <textarea
          rows={3}
          value={draft.excerpt}
          onChange={(event) => onChange({ ...draft, excerpt: event.target.value })}
          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium">Meta Title</span>
          <input
            value={draft.metaTitle}
            onChange={(event) => onChange({ ...draft, metaTitle: event.target.value })}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">Meta Description</span>
          <textarea
            rows={3}
            value={draft.metaDescription}
            onChange={(event) => onChange({ ...draft, metaDescription: event.target.value })}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">Category</span>
            <button
              type="button"
              onClick={() => setShowCategoryForm((open) => !open)}
              className="text-xs font-semibold text-accent"
            >
              {showCategoryForm ? "Close" : "New category"}
            </button>
          </div>
          <select
            value={draft.catId}
            onChange={(event) => onChange({ ...draft, catId: event.target.value })}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
          >
            <option value="">Select a category</option>
            {meta.cats.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <label className="space-y-2">
          <span className="text-sm font-medium">Author</span>
          <input
            value={draft.author}
            onChange={(event) => onChange({ ...draft, author: event.target.value })}
            placeholder="Author name"
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Status</span>
          <select
            value={draft.status}
            onChange={(event) =>
              onChange({ ...draft, status: event.target.value as BlogEditorDraft["status"] })
            }
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
          >
            {meta.statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Publish Date</span>
          <input
            type="datetime-local"
            value={draft.publishDate.slice(0, 16)}
            onChange={(event) =>
              onChange({
                ...draft,
                publishDate: new Date(event.target.value).toISOString(),
              })
            }
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
          />
        </label>
      </div>

      {showCategoryForm ? (
        <div className="grid gap-4 rounded-2xl border border-border bg-secondary/40 p-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium">Category Name</span>
            <input
              value={categoryForm.name}
              onChange={(event) =>
                setCategoryForm((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Example: Strategy"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium">Meta Title</span>
            <input
              value={categoryForm.metaTitle}
              onChange={(event) =>
                setCategoryForm((current) => ({ ...current, metaTitle: event.target.value }))
              }
              placeholder="Optional SEO title"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium">Description</span>
            <textarea
              rows={3}
              value={categoryForm.description}
              onChange={(event) =>
                setCategoryForm((current) => ({ ...current, description: event.target.value }))
              }
              placeholder="Short internal or public description"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium">Meta Description</span>
            <textarea
              rows={3}
              value={categoryForm.metaDescription}
              onChange={(event) =>
                setCategoryForm((current) => ({
                  ...current,
                  metaDescription: event.target.value,
                }))
              }
              placeholder="Optional SEO description"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
            />
          </label>
          <div className="flex flex-wrap items-center gap-3 md:col-span-2">
            <button
              type="button"
              onClick={() => void submitCategory()}
              disabled={isCreatingCategory || !categoryForm.name.trim()}
              className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isCreatingCategory ? "Creating..." : "Create category"}
            </button>
            <button
              type="button"
              onClick={() => {
                setCategoryForm(emptyCategoryForm);
                setShowCategoryForm(false);
              }}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-2">
          <span className="text-sm font-medium">Tags</span>
          <input
            value={draft.tags.join(", ")}
            onChange={(event) => onChange({ ...draft, tags: updateTags(event.target.value) })}
            placeholder="ai, automation, product"
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Featured</span>
          <select
            value={draft.featured ? "yes" : "no"}
            onChange={(event) => onChange({ ...draft, featured: event.target.value === "yes" })}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </label>

        <div className="space-y-2">
          <span className="text-sm font-medium">Reading Time</span>
          <div className="rounded-xl border border-input bg-secondary px-4 py-3 text-sm text-muted-foreground">
            {draft.readingTime}
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium">Word Count</span>
          <div className="rounded-xl border border-input bg-secondary px-4 py-3 text-sm text-muted-foreground">
            {draft.wordCount}
          </div>
        </div>
      </div>
    </section>
  );
}
