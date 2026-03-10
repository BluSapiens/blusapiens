import { useState } from "react";
import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import { Mail, Clock, Linkedin, Send } from "lucide-react";
import { fadeUp, staggerContainer, heroStagger, heroChild, viewport } from "@/lib/motion";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", company: "", description: "", budget: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PageLayout>
      <section className="hero-bg text-primary-foreground section-padding py-24 md:py-32">
        <div className="container-narrow text-center">
          <motion.div variants={heroStagger} initial="hidden" animate="visible">
            <motion.p variants={heroChild} className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Contact Us</motion.p>
            <motion.h1 variants={heroChild} className="text-4xl md:text-5xl font-extrabold mb-6">Let's Build Something Great</motion.h1>
            <motion.p variants={heroChild} className="text-lg opacity-70 max-w-2xl mx-auto">
              Start your digital transformation journey with BluSapiens. We'd love to hear about your project.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="container-narrow grid grid-cols-1 lg:grid-cols-5 gap-12">
          <motion.div variants={fadeUp} className="lg:col-span-3">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="rounded-xl border border-accent/30 bg-accent/5 p-12 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
                  <Send size={28} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Thank you!</h2>
                <p className="text-muted-foreground">We've received your message and will get back to you shortly.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-input bg-card px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-input bg-card px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full rounded-lg border border-input bg-card px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Project Description *</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-lg border border-input bg-card px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                    placeholder="Tell us about your project, challenges, and goals..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Budget Range (optional)</label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full rounded-lg border border-input bg-card px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  >
                    <option value="">Select a range</option>
                    <option value="<10k">Under $10,000</option>
                    <option value="10k-25k">$10,000 – $25,000</option>
                    <option value="25k-50k">$25,000 – $50,000</option>
                    <option value="50k-100k">$50,000 – $100,000</option>
                    <option value="100k+">$100,000+</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="group inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-all duration-200 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Send Message
                  <Send size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </form>
            )}
          </motion.div>

          <motion.div variants={fadeUp} className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="font-semibold mb-4">Get in Touch</h3>
              <div className="space-y-4">
                <a href="mailto:hello@blusapiens.com" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition-colors duration-200">
                  <Mail size={18} className="text-accent" />
                  hello@blusapiens.com
                </a>
                <a href="#" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition-colors duration-200">
                  <Linkedin size={18} className="text-accent" />
                  LinkedIn
                </a>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Clock size={18} className="text-accent" />
                  Mon – Fri, 9:00 AM – 6:00 PM
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h4 className="font-semibold mb-2">What happens next?</h4>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>We review your message within 24 hours</li>
                <li>Schedule a discovery call</li>
                <li>Prepare a tailored proposal</li>
                <li>Begin the engagement</li>
              </ol>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </PageLayout>
  );
};

export default Contact;
