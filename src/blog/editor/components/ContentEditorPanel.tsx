import { useState } from "react";
import MediaManager from "@/blog/editor/components/MediaManager";
import { BLOG_BLOCK_LABELS, createBlock, normalizeBlockOrder, reorderBlocks, updateBlockMedia } from "@/blog/utils/editor";
import type { BlogBlock, BlogBlockType, BlogEditorDraft, MediaAsset } from "@/blog/utils/types";

const quickBlocks: Array<{ label: string; factory: () => BlogBlock }> = [
  { label: "Callout", factory: () => ({ ...createBlock("CTA"), data: { variant: "callout", tone: "default", body: "" } }) },
  { label: "Internal Link", factory: () => ({ ...createBlock("CTA"), data: { variant: "internal-link", href: "/services", buttonText: "Open page" } }) },
  { label: "External Link", factory: () => ({ ...createBlock("CTA"), data: { variant: "external-link", href: "https://", buttonText: "Visit site" } }) },
  { label: "File Attachment", factory: () => ({ ...createBlock("CTA"), data: { variant: "file", buttonText: "Download file", href: "" } }) },
  { label: "Doc Reference", factory: () => ({ ...createBlock("CTA"), data: { variant: "reference", referenceType: "folder", referenceValue: "" } }) },
  { label: "Bullet List", factory: () => createBlock("LIST") },
  { label: "Numbered List", factory: () => ({ ...createBlock("LIST"), data: { style: "numbered", items: ["Step one", "Step two"] } }) },
];

type Props = {
  draft: BlogEditorDraft;
  onChange: (next: BlogEditorDraft) => void;
};

function BlockCard({
  block,
  onChange,
  onRemove,
  onMove,
  onOpenMedia,
  onDragStart,
  onDrop,
}: {
  block: BlogBlock;
  onChange: (block: BlogBlock) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
  onOpenMedia: (kind?: "IMAGE" | "FILE") => void;
  onDragStart: () => void;
  onDrop: () => void;
}) {
  return (
    <article
      draggable
      onDragStart={onDragStart}
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDrop}
      className="space-y-4 rounded-2xl border border-border bg-background p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            {BLOG_BLOCK_LABELS[block.type]}
          </p>
          <p className="text-sm text-muted-foreground">Drag to reorder</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => onMove(-1)} className="rounded-lg border border-border px-3 py-2 text-xs">
            Up
          </button>
          <button type="button" onClick={() => onMove(1)} className="rounded-lg border border-border px-3 py-2 text-xs">
            Down
          </button>
          <button type="button" onClick={onRemove} className="rounded-lg border border-border px-3 py-2 text-xs text-destructive">
            Remove
          </button>
        </div>
      </div>

      {block.type === "PARAGRAPH" || block.type === "QUOTE" ? (
        <textarea
          rows={5}
          value={String(block.text || "")}
          onChange={(event) =>
            onChange({
              ...block,
              text: event.target.value,
              data: { ...block.data, text: event.target.value },
            })
          }
          className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm"
        />
      ) : null}

      {block.type === "HEADING" ? (
        <div className="grid gap-3 md:grid-cols-[120px_1fr]">
          <select
            value={String(block.data.level || 2)}
            onChange={(event) =>
              onChange({
                ...block,
                title: String(block.title || ""),
                data: { ...block.data, level: Number(event.target.value), text: block.title || "" },
              })
            }
            className="rounded-xl border border-input bg-card px-4 py-3 text-sm"
          >
            {[1, 2, 3, 4].map((level) => (
              <option key={level} value={level}>
                H{level}
              </option>
            ))}
          </select>
          <input
            value={String(block.title || "")}
            onChange={(event) =>
              onChange({
                ...block,
                title: event.target.value,
                anchorId: event.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                data: { ...block.data, text: event.target.value },
              })
            }
            className="rounded-xl border border-input bg-card px-4 py-3 text-sm"
          />
        </div>
      ) : null}

      {block.type === "IMAGE" ? (
        <div className="space-y-3">
          <button type="button" onClick={() => onOpenMedia("IMAGE")} className="rounded-xl border border-border px-4 py-3 text-sm">
            {block.media ? "Change image" : "Select image"}
          </button>
          {block.media ? (
            <img src={block.media.optimizedUrl || block.media.url} alt={block.media.alt || ""} className="h-48 w-full rounded-2xl object-cover" />
          ) : null}
          <input
            value={String(block.data.alt || "")}
            onChange={(event) => onChange({ ...block, data: { ...block.data, alt: event.target.value } })}
            placeholder="Alt text"
            className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm"
          />
          <input
            value={String(block.data.caption || "")}
            onChange={(event) => onChange({ ...block, data: { ...block.data, caption: event.target.value } })}
            placeholder="Caption"
            className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm"
          />
        </div>
      ) : null}

      {block.type === "LIST" ? (
        <div className="space-y-3">
          <select
            value={String(block.data.style || "bullet")}
            onChange={(event) => onChange({ ...block, data: { ...block.data, style: event.target.value } })}
            className="rounded-xl border border-input bg-card px-4 py-3 text-sm"
          >
            <option value="bullet">Bullet list</option>
            <option value="numbered">Numbered list</option>
          </select>
          <textarea
            rows={5}
            value={Array.isArray(block.data.items) ? (block.data.items as string[]).join("\n") : ""}
            onChange={(event) =>
              onChange({
                ...block,
                data: {
                  ...block.data,
                  items: event.target.value.split("\n").filter(Boolean),
                },
              })
            }
            className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm"
          />
        </div>
      ) : null}

      {block.type === "CODE" ? (
        <div className="space-y-3">
          <input
            value={String(block.data.language || "ts")}
            onChange={(event) => onChange({ ...block, data: { ...block.data, language: event.target.value } })}
            placeholder="Language"
            className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm"
          />
          <textarea
            rows={7}
            value={String(block.data.code || block.text || "")}
            onChange={(event) =>
              onChange({
                ...block,
                text: event.target.value,
                data: { ...block.data, code: event.target.value },
              })
            }
            className="w-full rounded-xl border border-input bg-card px-4 py-3 font-mono text-sm"
          />
        </div>
      ) : null}

      {block.type === "EMBED" ? (
        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={String(block.data.provider || "")}
            onChange={(event) => onChange({ ...block, data: { ...block.data, provider: event.target.value } })}
            placeholder="Provider"
            className="rounded-xl border border-input bg-card px-4 py-3 text-sm"
          />
          <input
            value={String(block.data.url || "")}
            onChange={(event) => onChange({ ...block, data: { ...block.data, url: event.target.value } })}
            placeholder="Embed URL"
            className="rounded-xl border border-input bg-card px-4 py-3 text-sm"
          />
        </div>
      ) : null}

      {block.type === "TABLE" ? (
        <div className="space-y-3">
          <input
            value={Array.isArray(block.data.headers) ? (block.data.headers as string[]).join(", ") : ""}
            onChange={(event) =>
              onChange({
                ...block,
                data: { ...block.data, headers: event.target.value.split(",").map((item) => item.trim()) },
              })
            }
            placeholder="Headers, comma separated"
            className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm"
          />
          <textarea
            rows={5}
            value={
              Array.isArray(block.data.rows)
                ? (block.data.rows as string[][]).map((row) => row.join(" | ")).join("\n")
                : ""
            }
            onChange={(event) =>
              onChange({
                ...block,
                data: {
                  ...block.data,
                  rows: event.target.value.split("\n").map((row) => row.split("|").map((item) => item.trim())),
                },
              })
            }
            placeholder="Each row on a new line. Separate cells with |"
            className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm"
          />
        </div>
      ) : null}

      {block.type === "CTA" ? (
        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={String(block.data.variant || "callout")}
            onChange={(event) => onChange({ ...block, data: { ...block.data, variant: event.target.value } })}
            placeholder="Variant"
            className="rounded-xl border border-input bg-card px-4 py-3 text-sm"
          />
          <input
            value={String(block.data.label || block.title || "")}
            onChange={(event) => onChange({ ...block, title: event.target.value, data: { ...block.data, label: event.target.value } })}
            placeholder="Label / title"
            className="rounded-xl border border-input bg-card px-4 py-3 text-sm"
          />
          <input
            value={String(block.data.href || "")}
            onChange={(event) => onChange({ ...block, data: { ...block.data, href: event.target.value } })}
            placeholder="Link URL or path"
            className="rounded-xl border border-input bg-card px-4 py-3 text-sm"
          />
          <input
            value={String(block.data.buttonText || "")}
            onChange={(event) => onChange({ ...block, data: { ...block.data, buttonText: event.target.value } })}
            placeholder="Button text"
            className="rounded-xl border border-input bg-card px-4 py-3 text-sm"
          />
          <textarea
            rows={4}
            value={String(block.data.body || "")}
            onChange={(event) => onChange({ ...block, data: { ...block.data, body: event.target.value } })}
            placeholder="Supporting text"
            className="md:col-span-2 rounded-xl border border-input bg-card px-4 py-3 text-sm"
          />
          {String(block.data.variant || "") === "file" ? (
            <button
              type="button"
              onClick={() => onOpenMedia("FILE")}
              className="md:col-span-2 rounded-xl border border-border px-4 py-3 text-sm"
            >
              {block.media ? "Change attached file" : "Select attachment"}
            </button>
          ) : null}
        </div>
      ) : null}

      {block.type === "AFFILIATE" ? (
        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={String(block.data.productName || "")}
            onChange={(event) => onChange({ ...block, data: { ...block.data, productName: event.target.value } })}
            placeholder="Product name"
            className="rounded-xl border border-input bg-card px-4 py-3 text-sm"
          />
          <input
            value={String(block.data.priceLabel || "")}
            onChange={(event) => onChange({ ...block, data: { ...block.data, priceLabel: event.target.value } })}
            placeholder="Price label"
            className="rounded-xl border border-input bg-card px-4 py-3 text-sm"
          />
          <input
            value={String(block.data.affiliateUrl || "")}
            onChange={(event) => onChange({ ...block, data: { ...block.data, affiliateUrl: event.target.value } })}
            placeholder="Affiliate URL"
            className="md:col-span-2 rounded-xl border border-input bg-card px-4 py-3 text-sm"
          />
          <input
            value={String(block.data.buttonText || "View offer")}
            onChange={(event) => onChange({ ...block, data: { ...block.data, buttonText: event.target.value } })}
            placeholder="Button text"
            className="rounded-xl border border-input bg-card px-4 py-3 text-sm"
          />
          <button type="button" onClick={() => onOpenMedia("IMAGE")} className="rounded-xl border border-border px-4 py-3 text-sm">
            {block.media ? "Change product image" : "Select product image"}
          </button>
          <textarea
            rows={4}
            value={String(block.data.description || "")}
            onChange={(event) => onChange({ ...block, data: { ...block.data, description: event.target.value } })}
            placeholder="Product description"
            className="md:col-span-2 rounded-xl border border-input bg-card px-4 py-3 text-sm"
          />
        </div>
      ) : null}
    </article>
  );
}

export default function ContentEditorPanel({ draft, onChange }: Props) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [mediaTarget, setMediaTarget] = useState<{ blockId: string; kind: "IMAGE" | "FILE"; target: "cover" | "content" | "og" | "file" } | null>(null);

  const updateBlocks = (blocks: BlogBlock[]) => {
    onChange({
      ...draft,
      blocks: normalizeBlockOrder(blocks),
    });
  };

  const setBlock = (blockId: string, updater: (block: BlogBlock) => BlogBlock) => {
    updateBlocks(draft.blocks.map((block) => (block.id === blockId ? updater(block) : block)));
  };

  const applySelectedMedia = (asset: MediaAsset) => {
    if (!mediaTarget) {
      return;
    }

    setBlock(mediaTarget.blockId, (block) => {
      const next = updateBlockMedia(block, asset);

      if (next.type === "CTA" && String(next.data.variant || "") === "file") {
        return {
          ...next,
          data: {
            ...next.data,
            href: asset.url,
            label: String(next.data.label || asset.title || "Download attachment"),
          },
        };
      }

      return next;
    });
    setMediaTarget(null);
  };

  return (
    <section className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Flexible Content Editor</p>
          <h2 className="mt-2 text-2xl font-semibold">Structured blocks</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(BLOG_BLOCK_LABELS) as BlogBlockType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => updateBlocks([...draft.blocks, createBlock(type)])}
              className="rounded-full border border-border px-3 py-2 text-xs font-medium transition hover:border-accent/40 hover:text-accent"
            >
              {BLOG_BLOCK_LABELS[type]}
            </button>
          ))}
          {quickBlocks.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => updateBlocks([...draft.blocks, item.factory()])}
              className="rounded-full bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {draft.blocks.map((block, index) => (
          <BlockCard
            key={block.id}
            block={block}
            onChange={(nextBlock) => setBlock(block.id, () => nextBlock)}
            onRemove={() => updateBlocks(draft.blocks.filter((item) => item.id !== block.id))}
            onMove={(direction) => {
              const targetIndex = index + direction;
              if (targetIndex < 0 || targetIndex >= draft.blocks.length) {
                return;
              }
              const next = [...draft.blocks];
              [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
              updateBlocks(next);
            }}
            onOpenMedia={(kind = "IMAGE") =>
              setMediaTarget({
                blockId: block.id,
                kind,
                target: kind === "FILE" ? "file" : "content",
              })
            }
            onDragStart={() => setDraggingId(block.id)}
            onDrop={() => {
              if (!draggingId || draggingId === block.id) {
                return;
              }

              updateBlocks(reorderBlocks(draft.blocks, draggingId, block.id));
              setDraggingId(null);
            }}
          />
        ))}
      </div>

      <MediaManager
        open={Boolean(mediaTarget)}
        kind={mediaTarget?.kind || "IMAGE"}
        target={mediaTarget?.target || "content"}
        onClose={() => setMediaTarget(null)}
        onSelect={applySelectedMedia}
      />
    </section>
  );
}
