import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { ArrowRight, Search, Clock, Mail } from "lucide-react";
import { fadeUp, staggerContainer, heroStagger, heroChild, viewport } from "@/lib/motion";
import { blogPosts, categories, getPostsByCategory, searchPosts, type BlogPost } from "@/lib/blog-data";

const BlogCard = ({ post, featured = false }: { post: BlogPost; featured?: boolean }) => {
  if (featured) {
    return (
      <motion.div variants={fadeUp}>
        <Link
          to={`/blog/${post.slug}`}
          className="group block rounded-xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="aspect-[16/10] lg:aspect-auto bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center p-8 lg:p-12">
              <div className="w-full max-w-xs text-center">
                <div className="w-16 h-16 rounded-2xl bg-accent/15 text-accent flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">{post.title.charAt(0)}</span>
                </div>
                <p className="text-xs text-muted-foreground font-medium">Featured Article</p>
              </div>
            </div>
            <div className="p-8 lg:p-10 flex flex-col justify-center">
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">{post.category}</span>
              <h2 className="text-2xl lg:text-3xl font-bold mt-2 mb-3 group-hover:text-accent transition-colors duration-200">{post.title}</h2>
              <p className="text-muted-foreground leading-relaxed mb-5">{post.excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-5">
                <span>{new Date(post.publishDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                <span className="flex items-center gap-1"><Clock size={12} />{post.readingTime}</span>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent group-hover:gap-3 transition-all duration-200">
                Read Article <ArrowRight size={14} />
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
        className="group flex flex-col h-full rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1"
      >
        <span className="text-xs font-semibold text-accent uppercase tracking-wider">{post.category}</span>
        <h3 className="font-bold text-lg mt-2 mb-3 group-hover:text-accent transition-colors duration-200 leading-snug">{post.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{post.excerpt}</p>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{new Date(post.publishDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
            <span className="flex items-center gap-1"><Clock size={11} />{post.readingTime}</span>
          </div>
          <ArrowRight size={14} className="text-muted-foreground group-hover:text-accent transition-all duration-200 group-hover:translate-x-0.5" />
        </div>
      </Link>
    </motion.div>
  );
};

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const featuredPost = blogPosts.find(p => p.featured);
  
  const filteredPosts = useMemo(() => {
    let posts = searchQuery ? searchPosts(searchQuery) : getPostsByCategory(activeCategory);
    if (featuredPost && !searchQuery && activeCategory === "All") {
      posts = posts.filter(p => p.id !== featuredPost.id);
    }
    return posts;
  }, [activeCategory, searchQuery, featuredPost]);

  return (
    <PageLayout>
      {/* Hero */}
      <section className="hero-bg text-primary-foreground section-padding py-24 md:py-32">
        <div className="container-narrow text-center">
          <motion.div variants={heroStagger} initial="hidden" animate="visible">
            <motion.p variants={heroChild} className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Journal</motion.p>
            <motion.h1 variants={heroChild} className="text-4xl md:text-5xl font-extrabold mb-6">Insights & Ideas</motion.h1>
            <motion.p variants={heroChild} className="text-lg opacity-70 max-w-2xl mx-auto">
              Practical thinking on AI, digital transformation, automation, product strategy, and modern technology — from the BluSapiens team.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow">
          {/* Search */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
            <div className="relative max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); if (e.target.value) setActiveCategory("All"); }}
                className="w-full rounded-lg border border-input bg-card pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
              />
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-wrap gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setSearchQuery(""); }}
                className={`text-xs font-medium px-4 py-2 rounded-full transition-all duration-200 ${
                  activeCategory === cat && !searchQuery
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "bg-secondary text-secondary-foreground hover:bg-accent/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Featured */}
          {featuredPost && !searchQuery && activeCategory === "All" && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="mb-12"
            >
              <BlogCard post={featuredPost} featured />
            </motion.div>
          )}

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + searchQuery}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))
              ) : (
                <motion.div variants={fadeUp} className="col-span-full text-center py-16">
                  <p className="text-muted-foreground mb-2">No articles found</p>
                  <p className="text-sm text-muted-foreground/70">Try a different search term or category</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Popular / Recommended */}
          {!searchQuery && activeCategory === "All" && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="mt-20"
            >
              <motion.div variants={fadeUp} className="mb-8">
                <h2 className="text-2xl font-bold">Recommended Reading</h2>
                <p className="text-sm text-muted-foreground mt-1">Editor's picks for getting started</p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {blogPosts.slice(2, 5).map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Newsletter CTA */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="mt-20 rounded-xl border border-border bg-card p-8 md:p-10 text-center"
          >
            <Mail size={24} className="text-accent mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Stay informed</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              Get the latest insights on AI, digital transformation, and technology strategy delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
              />
              <button className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-all duration-200 hover:shadow-md hover:shadow-accent/20 hover:-translate-y-0.5 active:translate-y-0">
                Subscribe
              </button>
            </div>
          </motion.div>

          {/* Blog-to-Service CTA */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="mt-16 text-center"
          >
            <p className="text-muted-foreground mb-4">Need help applying these ideas to your business?</p>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-all duration-200 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-0.5 active:translate-y-0"
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
