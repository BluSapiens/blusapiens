import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { fadeUp, viewport } from "@/lib/motion";

const CTASection = () => {
  return (
    <section className="section-padding">
      <div className="container-narrow">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="hero-bg text-primary-foreground rounded-2xl p-12 md:p-16 text-center relative overflow-hidden"
        >
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
            className="group inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-all duration-200 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-0.5 active:translate-y-0 relative z-10"
          >
            Book a Consultation
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
