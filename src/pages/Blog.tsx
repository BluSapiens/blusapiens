import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Clock, Mail, Search, Sparkles, Tag } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { fadeUp, heroChild, heroStagger, staggerContainer, viewport } from "@/lib/motion";
import { blogPosts, categories, getPostsByCategory, searchPosts, type BlogPost } from "@/lib/blog-data";

const BlogCard = ({ post, featured = false }: { post: BlogPost; featured?: boolean }) => {
  if (featured) {
    return (
      <motion.div variants={fadeUp}>
        <Link
          to={`/blog/${post.slug}`}
          className="group block overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/95 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.5)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_30px_90px_-40px_rgba(6,182,212,0.35)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative flex min-h-[320px] items-end overflow-hidden bg-gradient-to-br from-primary via-primary to-slate-950 p-8 lg:min-h-[100%] lg:p-10">
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)",
                  backgroundSize: "30px 30px",
                }}
              />
              <div
                className="absolute right-[-15%] top-[-5%] h-64 w-64 rounded-full opacity-30 blur-3xl"
                style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent 70%)" }}
              />
              <div className="relative z-10 max-w-sm">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/75 backdrop-blur">
                  <Sparkles size={12} className="text-accent" />
                  Featured story
                </div>
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-2xl font-bold text-white shadow-lg shadow-slate-950/20 backdrop-blur">
                  {post.title.charAt(0)}
                </div>
                <p className="text-sm leading-relaxed text-white/70">
                  Strategic thinking on AI, product, systems, and delivery for modern teams building with intent.
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center p-8 lg:p-10">
              <div className="mb-5 flex flex-wrap items-center gap-3 text-xs">
                <span className="rounded-full bg-accent/10 px-3 py-1 font-semibold uppercase tracking-[0.2em] text-accent">
                  {post.category}
                </span>
                {new Date().getTime() - new Date(post.publishDate).getTime() < 30 * 24 * 60 * 60 * 1000 ? (
                  <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.13em] text-emerald-200">
                    New
                  </span>
                ) : null}
                <span className="rounded-full bg-secondary px-3 py-1 text-muted-foreground">
                  {new Date(post.publishDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              <h2 className="text-2xl font-bold leading-tight transition-colors duration-200 group-hover:text-accent lg:text-3xl">
                {post.title}
              </h2>
              <p className="mb-6 mt-4 text-base leading-relaxed text-muted-foreground">{post.excerpt}</p>

              <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5">
                  <Clock size={12} />
                  {post.readingTime}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5">
                  <BookOpen size={12} />
                  {post.author.name}
                </span>
              </div>

              <div className="mb-8 flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full border border-border/80 bg-secondary/60 px-3 py-1 text-xs text-muted-foreground">
                    #{tag}
                  </span>
                ))}
              </div>

              <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition-all duration-200 group-hover:gap-3">
                Read article
                <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div variants={fadeUp}>
      <Link
        to={`/blog/${post.slug}`}
        className="group flex h-full flex-col rounded-[1.5rem] border border-accent/40 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-zinc-900/80 p-6 shadow-[0_20px_80px_-42px_rgba(6,182,212,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:border-accent hover:shadow-[0_26px_90px_-42px_rgba(6,182,212,0.45)]"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex rounded-full bg-cyan-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
                {post.category}
              </span>
              {new Date().getTime() - new Date(post.publishDate).getTime() < 30 * 24 * 60 * 60 * 1000 ? (
                <span className="rounded-full bg-gradient-to-r from-emerald-700 to-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.13em] text-white shadow-lg shadow-emerald-900/40">
                  New
                </span>
              ) : null}
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 text-accent">
              <BookOpen size={18} />
            </div>
          </div>
          <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] text-accent">
            {new Date(post.publishDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>

        <h3 className="mb-3 text-lg font-extrabold leading-snug text-white transition-all duration-200 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent group-hover:via-cyan-300 group-hover:to-indigo-300">
          {post.title}
        </h3>
        <p className="mb-5 flex-1 text-sm leading-relaxed text-slate-300">{post.excerpt}</p>

        <div className="mb-5 flex flex-wrap gap-2">
          {post.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="rounded-full bg-secondary px-2.5 py-1 text-[11px] text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{post.author.name}</span>
            <span className="inline-flex items-center gap-1">
              <Clock size={11} />
              {post.readingTime}
            </span>
          </div>
          <ArrowRight size={14} className="text-muted-foreground transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent" />
        </div>
      </Link>
    </motion.div>
  );
};

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<"Newest" | "Oldest" | "Fastest read" | "Longest read">("Newest");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const featuredPost = blogPosts.find((post) => post.featured);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
      setShowBackToTop(scrollTop > 450);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const trendingPosts = useMemo(() => {
    return [...blogPosts]
      .sort((a, b) => {
        const featuredScore = (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        if (featuredScore !== 0) return featuredScore;
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      })
      .slice(0, 6);
  }, []);

  const filteredPosts = useMemo(() => {
    let posts = searchQuery ? searchPosts(searchQuery) : getPostsByCategory(activeCategory);
    if (featuredPost && !searchQuery && activeCategory === "All") {
      posts = posts.filter((post) => post.id !== featuredPost.id);
    }

    const sorted = [...posts].sort((a, b) => {
      if (sortOption === "Newest") {
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      }
      if (sortOption === "Oldest") {
        return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
      }
      const timeA = Number(a.readingTime.split(" ")[0]);
      const timeB = Number(b.readingTime.split(" ")[0]);
      if (sortOption === "Fastest read") {
        return timeA - timeB;
      }
      if (sortOption === "Longest read") {
        return timeB - timeA;
      }
      return 0;
    });

    return sorted;
  }, [activeCategory, searchQuery, featuredPost, sortOption]);

  return (
    <PageLayout>
      <div className="fixed inset-x-0 top-0 z-50 h-1 bg-white/10">
        <div className="h-full bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-300 transition-all duration-150" style={{ width: `${scrollProgress}%` }} />
      </div>
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-400 px-4 py-3 text-xs font-semibold text-white shadow-lg shadow-cyan-500/40 transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          Back to top
        </button>
      )}

      <section className="hero-bg relative overflow-hidden text-primary-foreground section-padding py-24 md:py-32">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "34px 34px",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(195 100% 50%), transparent 70%)" }}
        />

        <div className="container-narrow relative z-10 text-center">
          <motion.div variants={heroStagger} initial="hidden" animate="visible">
            <motion.div variants={heroChild} className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium">
              <Sparkles size={14} className="text-accent" />
              BluSapiens Journal
            </motion.div>
            <motion.h1 variants={heroChild} className="mb-6 text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
              Ideas, systems, and strategies that feel worth reading
            </motion.h1>
            <motion.p variants={heroChild} className="mx-auto max-w-3xl text-lg leading-relaxed opacity-70">
              Practical thinking on AI, digital transformation, automation, product strategy, and modern technology from the BluSapiens team.
            </motion.p>
            <motion.div variants={heroChild} className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm">
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/80">
                {blogPosts.length} published stories
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/80">
                AI, product, growth, and execution
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/80">
                Built for founders and operators
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow mb-8">
          <div className="overflow-hidden rounded-[1.75rem] border border-accent/25 bg-gradient-to-r from-cyan-700/80 via-indigo-700/75 to-purple-700/80 p-4 text-white">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-white">Trending articles</h3>
            <div className="relative overflow-hidden">
              <motion.div
                className="flex items-center gap-3"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              >
                {trendingPosts.concat(trendingPosts).map((post, i) => (
                  <Link
                    key={`${post.id}-${i}`}
                    to={`/blog/${post.slug}`}
                    className="inline-flex min-w-[260px] items-center justify-center whitespace-normal rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white shadow-md shadow-cyan-900/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-xl"
                  >
                    <span className="mr-2 inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                    {post.title}
                  </Link>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        <div className="container-narrow">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-10 rounded-[1.75rem] border border-border/80 bg-card/80 p-5 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.4)] md:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Explore articles</p>
                <h2 className="mt-2 text-2xl font-bold">Browse by topic or search for a specific idea</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Everything here is shaped to feel clear, strategic, and useful for teams making real product and business decisions.
                </p>
              </div>

              <div className="relative w-full max-w-md">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles, tags, or themes"
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    if (event.target.value) setActiveCategory("All");
                  }}
                  className="w-full rounded-2xl border border-input bg-background pl-11 pr-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="rounded-full bg-secondary/40 px-3 py-1.5 font-semibold">
                  Showing {filteredPosts.length} of {blogPosts.length} articles
                </div>
                <label className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5">
                  Sort by
                  <select
                    value={sortOption}
                    onChange={(event) => setSortOption(event.target.value as "Newest" | "Oldest" | "Fastest read" | "Longest read")}
                    className="rounded-full border border-border bg-transparent px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="Newest">Newest</option>
                    <option value="Oldest">Oldest</option>
                    <option value="Fastest read">Fastest read</option>
                    <option value="Longest read">Longest read</option>
                  </select>
                </label>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-6">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Hot topics</div>
            <div className="flex flex-wrap gap-2">
              {["AI & Automation", "Product Strategy", "Cloud & Infrastructure", "Startup Growth"].map((topic) => (
                <button
                  key={topic}
                  onClick={() => {
                    setActiveCategory(topic);
                    setSearchQuery("");
                  }}
                  className="rounded-full border border-border/60 px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-accent/15 to-primary/10 text-accent transition hover:scale-[1.02]"
                >
                  #{topic}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-12 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setSearchQuery("");
                }}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 ${
                  activeCategory === category && !searchQuery
                    ? "bg-accent text-accent-foreground shadow-sm shadow-accent/20"
                    : "bg-secondary text-secondary-foreground hover:bg-accent/10 hover:text-accent"
                }`}
              >
                {category !== "All" ? <Tag size={12} /> : null}
                {category}
              </button>
            ))}
          </motion.div>

          {featuredPost && !searchQuery && activeCategory === "All" && (
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="mb-12">
              <BlogCard post={featuredPost} featured />
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + searchQuery}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => <BlogCard key={post.id} post={post} />)
              ) : (
                <motion.div variants={fadeUp} className="col-span-full rounded-[1.75rem] border border-dashed border-border bg-secondary/20 px-6 py-16 text-center">
                  <p className="mb-2 text-muted-foreground">No articles found</p>
                  <p className="text-sm text-muted-foreground/70">Try a different search term or category.</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {!searchQuery && activeCategory === "All" && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="section-alt-bg mt-20 rounded-[2rem] border border-border/60 p-8 md:p-10"
            >
              <motion.div variants={fadeUp} className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Recommended reading</p>
                  <h2 className="mt-2 text-2xl font-bold">A strong place to start if you are new here</h2>
                </div>
                <p className="max-w-md text-sm text-muted-foreground">
                  A curated mix of product, architecture, and transformation thinking that reflects the rest of the site.
                </p>
              </motion.div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {blogPosts.slice(2, 5).map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="mt-20 overflow-hidden rounded-[2rem] border border-border/70 bg-primary text-primary-foreground shadow-[0_30px_90px_-45px_rgba(15,23,42,0.8)]"
          >
            <div className="grid gap-8 p-8 md:grid-cols-[1.1fr_0.9fr] md:p-10">
              <div className="relative">
                <div
                  className="absolute -left-20 top-0 h-40 w-40 rounded-full opacity-20 blur-3xl"
                  style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent 70%)" }}
                />
                <div className="relative">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-accent">
                    <Mail size={22} />
                  </div>
                  <h3 className="text-2xl font-bold">Stay in the loop without the noise</h3>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-primary-foreground/70">
                    Get the latest insights on AI, digital transformation, and technology strategy delivered in a clean, practical format.
                  </p>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="mb-4 text-sm font-medium text-primary-foreground/75">Join the BluSapiens update list</p>
                <div className="flex flex-col gap-3">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button className="rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-accent/20">
                    Subscribe
                  </button>
                </div>
                <p className="mt-3 text-xs text-primary-foreground/50">Occasional insights. No spam. Always relevant.</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="mt-16 text-center">
            <p className="mb-4 text-muted-foreground">Need help applying these ideas to your business?</p>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20 active:translate-y-0"
            >
              Talk to BluSapiens
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Blog;
