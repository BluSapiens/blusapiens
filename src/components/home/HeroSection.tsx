import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { heroStagger, heroChild, EASE } from "@/lib/motion";

const HeroSection = () => {
  return (
    <section className="hero-bg text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, hsl(195 100% 50%), transparent 70%)' }} />

      <div className="container-narrow section-padding relative z-10 py-28 md:py-36 lg:py-44">
        <motion.div
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div variants={heroChild} className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-4 py-1.5 text-xs font-medium mb-8">
            <Sparkles size={14} className="text-accent" />
            Engineering smarter digital futures
          </motion.div>

          <motion.h1 variants={heroChild} className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6">
            Transform Your Business with{" "}
            <span className="text-gradient">Intelligent Digital Solutions</span>
          </motion.h1>

          <motion.p variants={heroChild} className="text-lg md:text-xl opacity-70 max-w-2xl mx-auto mb-10 leading-relaxed">
            BluSapiens helps companies adopt AI, automation, and modern digital technologies to improve efficiency, innovation, and growth.
          </motion.p>

          <motion.div variants={heroChild} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-all duration-200 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/20 px-7 py-3.5 text-sm font-semibold transition-all duration-200 hover:bg-primary-foreground/5 hover:border-primary-foreground/30"
            >
              Book a Consultation
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
