import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Brain, Globe, Lightbulb, BarChart3, Code2, Layers, ArrowRight } from "lucide-react";

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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Our Services</p>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">End-to-End Digital Solutions</h1>
            <p className="text-lg opacity-70 max-w-2xl mx-auto">
              We offer a comprehensive suite of technology services designed to help businesses modernize, automate, and scale.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow space-y-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                to={service.href}
                className="group flex flex-col md:flex-row gap-6 rounded-xl border border-border bg-card p-8 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                  <service.icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-2 group-hover:text-accent transition-colors">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">{service.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.benefits.map((b) => (
                      <span key={b} className="text-xs font-medium px-3 py-1 rounded-full bg-secondary text-secondary-foreground">{b}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center">
                  <ArrowRight size={20} className="text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
};

export default Services;
