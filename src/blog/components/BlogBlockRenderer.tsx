import { Link } from "react-router-dom";
import type { BlogBlock } from "@/blog/utils/types";

const renderTable = (block: BlogBlock) => {
  const headers = Array.isArray(block.data.headers) ? (block.data.headers as string[]) : [];
  const rows = Array.isArray(block.data.rows) ? (block.data.rows as string[][]) : [];

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="min-w-full text-left text-sm">
        {headers.length > 0 ? (
          <thead className="bg-secondary">
            <tr>
              {headers.map((header, index) => (
                <th key={`${header}-${index}`} className="px-4 py-3 font-semibold text-foreground">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`} className="border-t border-border">
              {row.map((cell, cellIndex) => (
                <td key={`cell-${rowIndex}-${cellIndex}`} className="px-4 py-3 text-muted-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function BlogBlockRenderer({ block }: { block: BlogBlock }) {
  if (block.type === "PARAGRAPH") {
    return <p className="text-[15px] leading-[1.9] text-muted-foreground">{block.text}</p>;
  }

  if (block.type === "HEADING") {
    const level = Number(block.data.level || 2);
    const text = String(block.title || block.data.text || "");
    const className =
      level === 1
        ? "text-3xl font-bold"
        : level === 2
          ? "text-2xl font-bold"
          : level === 3
            ? "text-xl font-semibold"
            : "text-lg font-semibold";

    return (
      <div id={block.anchorId || undefined} className="scroll-mt-28">
        <h2 className={className}>{text}</h2>
      </div>
    );
  }

  if (block.type === "IMAGE") {
    const src = block.media?.optimizedUrl || block.media?.url;
    if (!src) {
      return null;
    }

    return (
      <figure className="overflow-hidden rounded-2xl border border-border bg-card">
        <img
          src={src}
          alt={String(block.data.alt || block.media?.alt || "")}
          className="h-auto w-full object-cover"
          loading="lazy"
        />
        {block.data.caption ? (
          <figcaption className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
            {String(block.data.caption)}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (block.type === "CODE") {
    return (
      <pre className="overflow-x-auto rounded-2xl border border-border bg-primary px-5 py-4 text-sm text-primary-foreground">
        <code>{String(block.data.code || block.text || "")}</code>
      </pre>
    );
  }

  if (block.type === "QUOTE") {
    return (
      <blockquote className="rounded-2xl border border-accent/20 bg-accent/5 px-6 py-5">
        <p className="text-lg italic text-foreground">{String(block.text || block.data.text || "")}</p>
        {block.data.citation ? (
          <footer className="mt-3 text-sm text-muted-foreground">{String(block.data.citation)}</footer>
        ) : null}
      </blockquote>
    );
  }

  if (block.type === "LIST") {
    const items = Array.isArray(block.data.items) ? (block.data.items as string[]) : [];
    const ListTag = block.data.style === "numbered" ? "ol" : "ul";
    const listClass = block.data.style === "numbered" ? "list-decimal" : "list-disc";

    return (
      <ListTag className={`space-y-2 pl-5 text-[15px] leading-[1.8] text-muted-foreground ${listClass}`}>
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ListTag>
    );
  }

  if (block.type === "TABLE") {
    return renderTable(block);
  }

  if (block.type === "EMBED") {
    const url = String(block.data.url || "");
    return (
      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          {String(block.data.provider || "Embed")}
        </p>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 block text-sm font-semibold text-foreground hover:text-accent"
        >
          {String(block.data.title || url)}
        </a>
      </div>
    );
  }

  if (block.type === "CTA") {
    const variant = String(block.data.variant || "callout");
    const href = String(block.data.href || "");
    const label = String(block.data.label || block.title || "Learn more");
    const body = String(block.data.body || "");
    const buttonText = String(block.data.buttonText || "Open");
    const isInternal = href.startsWith("/");

    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          {variant.replace(/-/g, " ")}
        </p>
        <h3 className="mt-3 text-lg font-semibold">{label}</h3>
        {body ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p> : null}
        {href ? (
          isInternal ? (
            <Link
              to={href}
              className="mt-4 inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
            >
              {buttonText}
            </Link>
          ) : (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
            >
              {buttonText}
            </a>
          )
        ) : null}
      </div>
    );
  }

  if (block.type === "AFFILIATE") {
    const image = block.media?.optimizedUrl || block.media?.url;
    return (
      <div className="grid gap-4 rounded-2xl border border-border bg-card p-6 md:grid-cols-[180px_1fr]">
        {image ? (
          <img src={image} alt={block.media?.alt || String(block.data.productName || "")} className="h-40 w-full rounded-xl object-cover" />
        ) : null}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Affiliate Product</p>
          <h3 className="mt-2 text-xl font-semibold">{String(block.data.productName || "")}</h3>
          {block.data.priceLabel ? (
            <p className="mt-1 text-sm font-medium text-foreground">{String(block.data.priceLabel)}</p>
          ) : null}
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {String(block.data.description || "")}
          </p>
          <a
            href={String(block.data.affiliateUrl || "#")}
            target="_blank"
            rel="noreferrer sponsored"
            className="mt-4 inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
          >
            {String(block.data.buttonText || "View offer")}
          </a>
        </div>
      </div>
    );
  }

  return null;
}
