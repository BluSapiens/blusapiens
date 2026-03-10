import { motion } from "framer-motion";
import { Rocket, Building2, ShoppingCart, HeartPulse, Landmark, Truck, GraduationCap } from "lucide-react";

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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Industries</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Industries We Serve</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            We partner with organizations across diverse sectors to deliver impactful technology solutions.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4">
          {industries.map((ind, i) => (
            <motion.div
              key={ind.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex items-center gap-3 rounded-full border border-border bg-card px-6 py-3"
            >
              <ind.icon size={18} className="text-accent" />
              <span className="text-sm font-medium">{ind.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustriesSection;
