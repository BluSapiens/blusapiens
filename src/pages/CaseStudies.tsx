import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { ArrowRight } from "lucide-react";

const placeholderStudies = [
  { title: "AI-Powered Customer Support Platform", industry: "SaaS", challenge: "High support ticket volume with slow response times.", solution: "Built an AI chatbot with NLP that handles 70% of queries automatically.", result: "60% reduction in response time, 40% cost savings." },
  { title: "E-commerce Analytics Dashboard", industry: "E-commerce", challenge: "Scattered data across multiple platforms with no unified view.", solution: "Created a real-time analytics dashboard integrating all data sources.", result: "30% increase in data-driven decisions, 25% revenue growth." },
  { title: "Healthcare Patient Portal", industry: "Healthcare", challenge: "Paper-based processes causing delays and errors.", solution: "Developed a digital patient portal with automated workflows.", result: "50% reduction in administrative time, improved patient satisfaction." },
];

const CaseStudies = () => {
  return (
    <PageLayout>
      <section className="hero-bg text-primary-foreground section-padding py-24 md:py-32">
        <div className="container-narrow text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Case Studies</p>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Our Work in Action</h1>
            <p className="text-lg opacity-70 max-w-2xl mx-auto">
              See how we've helped businesses transform their operations with intelligent technology solutions.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow space-y-8">
          {placeholderStudies.map((study, i) => (
            <motion.div
              key={study.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-border bg-card p-8 md:p-10"
            >
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">{study.industry}</span>
              <h3 className="text-2xl font-bold mt-2 mb-4">{study.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-semibold mb-1">Challenge</p>
                  <p className="text-sm text-muted-foreground">{study.challenge}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">Solution</p>
                  <p className="text-sm text-muted-foreground">{study.solution}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">Results</p>
                  <p className="text-sm text-muted-foreground">{study.result}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-padding section-alt-bg">
        <div className="container-narrow text-center">
          <h2 className="text-3xl font-bold mb-4">Want results like these?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">Let's discuss how we can help your business achieve similar transformations.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground hover:opacity-90">
            Book a Consultation <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </PageLayout>
  );
};

export default CaseStudies;
