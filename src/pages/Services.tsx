import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Brain, Globe, Lightbulb, BarChart3, Code2, Layers, ArrowRight } from "lucide-react";
import { fadeUp, staggerContainer, heroStagger, heroChild, viewport } from "@/lib/motion";

const services = [
  { icon: Brain, title: "AI & Automation", description: "Harness the power of artificial intelligence and automation to optimize processes, reduce costs, and unlock new capabilities. From intelligent chatbots to predictive analytics.", href: "/services/ai-automation", benefits: ["Process automation", "Predictive analytics", "AI-powered insights"] },
  { icon: Code2, title: "Custom Software Development", description: "Purpose-built applications designed around your exact business requirements. We architect, build, and deploy robust software solutions.", href: "/services/custom-software", benefits: ["Tailored solutions", "Scalable architecture", "Modern tech stack"] },
  { icon: Globe, title: "Web & App Development", description: "Modern, performant web applications and mobile experiences built with the latest frameworks and best practices.", href: "/services/web-development", benefits: ["Responsive design", "Performance optimized", "SEO-friendly"] },
  { icon: BarChart3, title: "Data & Analytics", description: "Turn your data into a competitive advantage. We build dashboards, pipelines, and analytics platforms that drive smarter decisions.", href: "/services/data-analytics", benefits: ["Real-time dashboards", "Data pipelines", "Business intelligence"] },
  { icon: Lightbulb, title: "Digital Transformation Consulting", description: "Strategic guidance to modernize your technology stack, processes, and digital capabilities for the future.", href: "/services/digital-transformation", benefits: ["Technology roadmaps", "Process optimization", "Change management"] },
  { icon: Layers, title: "Cloud Solutions", description: "Design, migrate, and manage cloud infrastructure that's secure, scalable, and cost-effective.", href: "/services/cloud-solutions", benefits: ["Cloud migration", "Infrastructure design", "Cost optimization"] },
];

const Services = () => {
  return (
    <PageLayout>
      <section className="hero-bg text-primary-foreground section-padding py-24 md:py-32">
        <div className="container-narrow text-center">
          <motion.div variants={heroStagger} initial="hidden" animate="visible">
            <motion.p variants={heroChild} className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Our Services</motion.p>
            <motion.h1 variants={heroChild} className="text-4xl md:text-5xl font-extrabold mb-6">End-to-End Digital Solutions</motion.h1>
            <motion.p variants={heroChild} className="text-lg opacity-70 max-w-2xl mx-auto">
              We offer a comprehensive suite of technology services designed to help businesses modernize, automate, and scale.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="container-narrow space-y-8">
          {services.map((service) => (
            <motion.div key={service.title} variants={fadeUp}>
              <Link
                to={service.href}
                className="group flex flex-col md:flex-row gap-6 rounded-xl border border-border bg-card p-8 transition-all duration-200 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-0.5"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                  <service.icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-2 group-hover:text-accent transition-colors duration-200">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">{service.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.benefits.map((b) => (
                      <span key={b} className="text-xs font-medium px-3 py-1 rounded-full bg-secondary text-secondary-foreground">{b}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center">
                  <ArrowRight size={20} className="text-muted-foreground group-hover:text-accent transition-all duration-200 group-hover:translate-x-0.5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </PageLayout>
  );
};

export default Services;
