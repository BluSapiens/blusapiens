import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewport } from "@/lib/motion";

const steps = [
  { number: "01", title: "Discovery", description: "Understand your business challenges, goals, and technical landscape." },
  { number: "02", title: "Strategy", description: "Design technology solutions tailored to your specific problems." },
  { number: "03", title: "Development", description: "Build scalable, secure digital systems with modern architecture." },
  { number: "04", title: "Implementation", description: "Deploy and integrate seamlessly with your existing workflows." },
  { number: "05", title: "Optimization", description: "Continuous improvements and performance monitoring post-launch." },
];

const ProcessSection = () => {
  return (
    <section className="section-padding">
      <div className="container-narrow">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Our Process</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Work</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A proven, structured approach that transforms ideas into reliable, scalable digital solutions.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="space-y-12"
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                variants={fadeUp}
                className={`relative flex items-start gap-6 md:gap-12 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent border-2 border-background z-10 mt-1.5" />
                <div className={`ml-14 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"}`}>
                  <span className="text-xs font-bold text-accent">{step.number}</span>
                  <h3 className="font-bold text-lg mt-1 mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
