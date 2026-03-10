import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { ArrowRight } from "lucide-react";

const categories = ["AI & Automation", "Digital Transformation", "Software Engineering", "Startup Technology", "Productivity Systems"];

const placeholderPosts = [
  { title: "How AI is Transforming Small Business Operations", category: "AI & Automation", date: "Coming Soon", excerpt: "Explore how artificial intelligence is making enterprise-grade capabilities accessible to businesses of all sizes." },
  { title: "5 Signs Your Business Needs Digital Transformation", category: "Digital Transformation", date: "Coming Soon", excerpt: "Learn the key indicators that it's time to modernize your technology stack and business processes." },
  { title: "Building Scalable Applications: A Founder's Guide", category: "Software Engineering", date: "Coming Soon", excerpt: "Essential architecture decisions for startups building products that need to scale." },
  { title: "The ROI of Automation: What to Expect", category: "Productivity Systems", date: "Coming Soon", excerpt: "Understanding the real return on investment when implementing automation in your workflows." },
  { title: "Choosing the Right Tech Stack for Your Startup", category: "Startup Technology", date: "Coming Soon", excerpt: "A practical guide to selecting technologies that balance speed, cost, and scalability." },
  { title: "Data-Driven Decision Making for Growth", category: "AI & Automation", date: "Coming Soon", excerpt: "How to build a data culture and leverage analytics for smarter business decisions." },
];

const Blog = () => {
  return (
    <PageLayout>
      <section className="hero-bg text-primary-foreground section-padding py-24 md:py-32">
        <div className="container-narrow text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Blog</p>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Insights & Ideas</h1>
            <p className="text-lg opacity-70 max-w-2xl mx-auto">
              Thoughts on technology, business, and the future of digital solutions.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-12">
            <span className="text-xs font-semibold px-4 py-2 rounded-full bg-accent text-accent-foreground">All</span>
            {categories.map((cat) => (
              <span key={cat} className="text-xs font-medium px-4 py-2 rounded-full bg-secondary text-secondary-foreground cursor-pointer hover:bg-accent/10 transition-colors">{cat}</span>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placeholderPosts.map((post, i) => (
              <motion.div
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
              >
                <span className="text-xs font-semibold text-accent">{post.category}</span>
                <h3 className="font-bold text-lg mt-2 mb-3 group-hover:text-accent transition-colors">{post.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                  <ArrowRight size={16} className="text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Blog;
