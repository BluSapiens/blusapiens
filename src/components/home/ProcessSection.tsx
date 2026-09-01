import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { fadeUp, staggerContainer, viewport } from "@/lib/motion";

const steps = [
  { number: "01", title: "Discovery", description: "Understand your business challenges, goals, and technical landscape." },
  { number: "02", title: "Strategy", description: "Design technology solutions tailored to your specific problems." },
  { number: "03", title: "Development", description: "Build scalable, secure digital systems with modern architecture." },
  { number: "04", title: "Implementation", description: "Deploy and integrate seamlessly with your existing workflows." },
  { number: "05", title: "Optimization", description: "Continuous improvements and performance monitoring post-launch." },
];

type ProcessStepProps = {
  step: (typeof steps)[number];
  index: number;
  progress: MotionValue<number>;
};

const ProcessStep = ({ step, index, progress }: ProcessStepProps) => {
  const start = index * 0.16;
  const end = Math.min(start + 0.3, 1);
  const opacity = useTransform(progress, [start, end], [0.25, 1]);
  const y = useTransform(progress, [start, end], [32, 0]);
  const scale = useTransform(progress, [start, end], [0.97, 1]);

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className={`relative flex items-start gap-6 md:gap-12 ${
        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent border-2 border-background z-10 mt-1.5" />
      <div className={`ml-14 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"}`}>
        <span className="text-xs font-bold text-accent">{step.number}</span>
        <h3 className="font-bold text-lg mt-1 mb-2">{step.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
      </div>
      <div className="hidden md:block md:w-1/2" />
    </motion.div>
  );
};

const ProcessSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 75%", "end 30%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.2 });

  return (
    <section ref={sectionRef} className="section-padding relative">
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
            style={{ scaleY: progress }}
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-accent origin-top md:-translate-x-px"
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="space-y-12"
          >
            {steps.map((step, i) => (
              <ProcessStep key={step.number} step={step} index={i} progress={progress} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
