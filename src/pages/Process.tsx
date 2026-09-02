import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { ArrowRight, Search, Map, Code, TestTube, Rocket } from "lucide-react";
import { fadeUp, staggerContainer, heroStagger, heroChild, viewport } from "@/lib/motion";

const steps = [
  { icon: Search, number: "01", title: "Discovery & Research", description: "We dive deep into your business, goals, challenges, and technical landscape. Through stakeholder interviews and analysis, we map out exactly what needs to happen.", details: ["Stakeholder interviews", "Business process analysis", "Technical audit", "Competitive landscape review"] },
  { icon: Map, number: "02", title: "Strategy & Architecture", description: "Based on our findings, we design a technology strategy and system architecture that aligns with your business objectives and scales for the future.", details: ["Technology roadmap", "System architecture design", "Resource planning", "Timeline and milestone definition"] },
  { icon: Code, number: "03", title: "Design & Development", description: "Our engineering team brings the strategy to life. We build iteratively with regular checkpoints, ensuring alignment with your vision at every stage.", details: ["Agile development sprints", "UI/UX design", "Backend engineering", "API development"] },
  { icon: TestTube, number: "04", title: "Testing & Optimization", description: "Rigorous testing ensures everything works flawlessly. We optimize for performance, security, and user experience before launch.", details: ["Quality assurance testing", "Performance optimization", "Security auditing", "User acceptance testing"] },
  { icon: Rocket, number: "05", title: "Deployment & Scaling", description: "Smooth deployment with comprehensive monitoring. We continue supporting and optimizing post-launch to ensure ongoing success.", details: ["Production deployment", "Monitoring setup", "Performance tracking", "Ongoing optimization"] },
];

const Process = () => {
  return (
    <PageLayout>
      <section className="hero-bg text-primary-foreground section-padding py-24 md:py-32">
        <div className="container-narrow text-center">
          <motion.div variants={heroStagger} initial="hidden" animate="visible">
            <motion.p variants={heroChild} className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">How We Work</motion.p>
            <motion.h1 variants={heroChild} className="text-4xl md:text-5xl font-extrabold mb-6">Our Process</motion.h1>
            <motion.p variants={heroChild} className="text-lg opacity-70 max-w-2xl mx-auto">
              A structured, proven approach that transforms your ideas into reliable, scalable digital solutions.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="container-narrow space-y-16">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              variants={fadeUp}
              className={`flex flex-col md:flex-row gap-8 items-start ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center transition-transform duration-200 hover:scale-105">
                <step.icon size={28} />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-accent">{step.number}</span>
                <h2 className="text-2xl font-bold mt-1 mb-3">{step.title}</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">{step.description}</p>
                <div className="flex flex-wrap gap-2">
                  {step.details.map((d) => (
                    <span key={d} className="text-xs font-medium px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground">{d}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="section-padding section-alt-bg">
        <div className="container-narrow text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
            <h2 className="text-3xl font-bold mb-4">Ready to start your project?</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">Let's work together to build something exceptional.</p>
            <Link to="/contact" className="group inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-all duration-200 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-0.5 active:translate-y-0">
              Book a Free Consultation <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Process;
