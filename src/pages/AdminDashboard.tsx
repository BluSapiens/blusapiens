import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Sparkles } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  getAdminBlogCats,
  getAdminBlogPosts,
  type AdminBlogCat,
  type AdminBlogPost,
} from "@/lib/admin-auth";
import { fadeUp, staggerContainer, viewport } from "@/lib/motion";

const PAGE_SIZE = 6;

const formatDate = (value: string | null) => {
  if (!value) {
    return "Unscheduled";
  }

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const AdminBlogCard = ({ post }: { post: AdminBlogPost }) => {
  return (
    <motion.article variants={fadeUp}>
      <div className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            {post.cat.name}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
              post.status === "PUBLISHED"
                ? "bg-emerald-500/10 text-emerald-600"
                : "bg-amber-500/10 text-amber-600"
            }`}
          >
            {post.status}
          </span>
          {post.featured ? (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              Featured
            </span>
          ) : null}
        </div>

        <h2 className="mt-4 text-xl font-bold leading-snug transition-colors duration-200 group-hover:text-accent">
          {post.title}
        </h2>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>

        <div className="mt-6 space-y-3 border-t border-border pt-4">
          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>{post.author}</span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {post.readingTime}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>{formatDate(post.publishDate)}</span>
            <span>{post.tags.length} tags</span>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <span className="text-xs text-muted-foreground">
              {post.faqs.length} FAQs • {post.headings.length} sections
            </span>
            <div className="flex items-center gap-3">
              <Link
                to={`/admin/blog/${post.id}`}
                className="text-sm font-semibold text-foreground transition-colors duration-200 hover:text-accent"
              >
                Edit
              </Link>
              {post.status === "PUBLISHED" ? (
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition-all duration-200 hover:gap-3"
                >
                  Open live <ArrowRight size={14} />
                </Link>
              ) : (
                <span className="text-sm font-semibold text-muted-foreground">Draft only</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

const BlogCardSkeleton = () => (
  <div className="h-full rounded-xl border border-border bg-card p-6">
    <div className="flex animate-pulse flex-col gap-4">
      <div className="flex gap-2">
        <div className="h-6 w-24 rounded-full bg-secondary" />
        <div className="h-6 w-20 rounded-full bg-secondary" />
      </div>
      <div className="h-6 w-4/5 rounded-full bg-secondary" />
      <div className="h-4 w-full rounded-full bg-secondary" />
      <div className="h-4 w-5/6 rounded-full bg-secondary" />
      <div className="mt-8 h-10 w-full rounded-xl bg-secondary" />
    </div>
  </div>
);

const StatCard = ({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) => (
  <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
      {label}
    </p>
    <p className="mt-4 text-3xl font-bold text-foreground">{value}</p>
    <p className="mt-2 text-sm text-muted-foreground">{note}</p>
  </div>
);

const getDraftCount = (posts: AdminBlogPost[]) =>
  posts.reduce((count, post) => count + (post.status === "DRAFT" ? 1 : 0), 0);

const getPublishedCount = (posts: AdminBlogPost[]) =>
  posts.reduce((count, post) => count + (post.status === "PUBLISHED" ? 1 : 0), 0);

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number.parseInt(searchParams.get("page") || "1", 10) || 1;
  const catId = searchParams.get("catId") || "";

  const catsQuery = useQuery({
    queryKey: ["admin-blog-cats"],
    queryFn: getAdminBlogCats,
    staleTime: 60_000,
  });

  const postsQuery = useQuery({
    queryKey: ["admin-blog-posts", page, catId],
    queryFn: () =>
      getAdminBlogPosts({
        page,
        limit: PAGE_SIZE,
        catId,
      }),
    placeholderData: (previousData) => previousData,
    staleTime: 30_000,
  });

  const cats = catsQuery.data || [];
  const posts = postsQuery.data?.items || [];
  const meta = postsQuery.data?.meta;
  const selectedCat =
    cats.find((cat) => cat.id === catId) || null;

  const setPage = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
  };

  const setCat = (cat: AdminBlogCat | null) => {
    const next = new URLSearchParams(searchParams);

    if (cat) {
      next.set("catId", cat.id);
    } else {
      next.delete("catId");
    }

    next.set("page", "1");
    setSearchParams(next);
  };

  return (
    <div className="pb-16">
      <AdminPageHeader
        eyebrow="Content Dashboard"
        title="Admin blog console"
        description="Review published and draft articles, switch categories, and keep the editorial pipeline organized from one place."
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground/60">
              Active view
            </p>
            <p className="mt-2 text-lg font-semibold text-primary-foreground">
              {selectedCat ? selectedCat.name : "All blog categories"}
            </p>
          </div>
          <Link
            to="/admin/blog/new"
            className="inline-flex items-center rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground"
          >
            Create Post
          </Link>
        </div>
      </AdminPageHeader>

      <section className="px-6 py-10 md:px-8 lg:px-12">
        <div className="container-wide space-y-10">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Visible Now"
              value={String(meta?.total ?? 0)}
              note="Posts in the current filtered view."
            />
            <StatCard
              label="Published"
              value={String(getPublishedCount(posts))}
              note="Published posts on this page."
            />
            <StatCard
              label="Drafts"
              value={String(getDraftCount(posts))}
              note="Draft posts on this page."
            />
            <StatCard
              label="Categories"
              value={String(cats.length)}
              note="Categories available for blog filtering."
            />
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                  Filter By Category
                </p>
                <h2 className="mt-2 text-2xl font-bold">Content inventory</h2>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  The cards below mirror the public blog listing style so editorial review feels
                  close to how the content appears on the live site.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm text-muted-foreground">
                <BookOpen size={15} />
                {meta ? `Page ${meta.page} of ${Math.max(meta.pages, 1)}` : "Loading posts"}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCat(null)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 ${
                  !catId
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "bg-secondary text-secondary-foreground hover:bg-accent/10"
                }`}
              >
                All
              </button>

              {cats.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCat(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 ${
                    catId === cat.id
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "bg-secondary text-secondary-foreground hover:bg-accent/10"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {postsQuery.isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                <BlogCardSkeleton key={index} />
              ))}
            </div>
          ) : posts.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              viewport={viewport}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
            >
              {posts.map((post) => (
                <AdminBlogCard key={post.id} post={post} />
              ))}
            </motion.div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border bg-card px-8 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <Sparkles size={20} />
              </div>
              <h3 className="mt-5 text-xl font-bold">No blog posts in this view</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Change the category filter or create the first post from the upcoming editor flow.
              </p>
            </div>
          )}

          {meta && meta.pages > 1 ? (
            <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-border bg-card px-6 py-5 md:flex-row">
              <p className="text-sm text-muted-foreground">
                Showing page {meta.page} of {meta.pages} across {meta.total} posts.
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage(Math.max(page - 1, 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent/30 hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ArrowLeft size={14} />
                  Prev
                </button>

                {Array.from({ length: meta.pages }, (_, index) => index + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`min-w-10 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      pageNumber === page
                        ? "bg-accent text-accent-foreground"
                        : "border border-border text-foreground hover:border-accent/30 hover:text-accent"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setPage(Math.min(page + 1, meta.pages))}
                  disabled={page === meta.pages}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent/30 hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
