import { motion } from "framer-motion";
import { Rocket, Building2, ShoppingCart, HeartPulse, Landmark, Truck, GraduationCap } from "lucide-react";
import { scaleIn, staggerContainer, viewport } from "@/lib/motion";

const industries = [
  { icon: Rocket, label: "Startups" },
  { icon: Building2, label: "SaaS Companies" },
  { icon: ShoppingCart, label: "E-commerce" },
  { icon: HeartPulse, label: "Healthcare" },
  { icon: Landmark, label: "Finance" },
  { icon: Truck, label: "Logistics" },
  { icon: GraduationCap, label: "Education" },
];

const IndustriesSection = () => {
  return (
    <section className="section-padding section-alt-bg">
      <div className="container-narrow">
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Industries</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Industries We Serve</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            We partner with organizations across diverse sectors to deliver impactful technology solutions.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="flex flex-wrap justify-center gap-4"
        >
          {industries.map((ind) => (
            <motion.div
              key={ind.label}
              variants={scaleIn}
              className="flex items-center gap-3 rounded-full border border-border bg-card px-6 py-3 transition-all duration-200 hover:border-accent/30 hover:shadow-sm"
            >
              <ind.icon size={18} className="text-accent" />
              <span className="text-sm font-medium">{ind.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default IndustriesSection;
