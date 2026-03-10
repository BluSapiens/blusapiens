import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="section-padding">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="hero-bg text-primary-foreground rounded-2xl p-12 md:p-16 text-center relative overflow-hidden"
        >
          {/* Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, hsl(195 100% 50%), transparent 70%)' }} />

          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">
            Ready to build smarter digital systems?
          </h2>
          <p className="opacity-70 max-w-lg mx-auto mb-8 relative z-10">
            Let's discuss how BluSapiens can help your business evolve with technology.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-all hover:opacity-90 relative z-10"
          >
            Book a Consultation
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
