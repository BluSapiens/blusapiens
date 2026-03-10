import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Brain, Globe, BarChart3, Code2, Lightbulb, Layers } from "lucide-react";
import { fadeUp, staggerContainer, viewport } from "@/lib/motion";

const services = [
  { icon: Brain, title: "AI & Automation Solutions", description: "Leverage artificial intelligence and automation to streamline operations and unlock new capabilities.", href: "/services/ai-automation" },
  { icon: Globe, title: "Web & Application Development", description: "Build modern, scalable web applications with cutting-edge frameworks and best practices.", href: "/services/web-development" },
  { icon: Lightbulb, title: "Digital Transformation Consulting", description: "Strategic guidance to modernize your business processes and technology infrastructure.", href: "/services/digital-transformation" },
  { icon: BarChart3, title: "Data & Analytics Solutions", description: "Transform raw data into actionable insights that drive smarter business decisions.", href: "/services/data-analytics" },
  { icon: Code2, title: "Custom Software Development", description: "Purpose-built software solutions designed around your unique business requirements.", href: "/services/custom-software" },
  { icon: Layers, title: "Cloud Solutions", description: "Scalable, secure cloud infrastructure that grows with your business needs.", href: "/services/cloud-solutions" },
];

const ServicesOverview = () => {
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
          <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">What We Do</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Solutions Built for Growth</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            From AI-powered automation to scalable web platforms, we deliver technology that moves your business forward.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => (
            <motion.div key={service.title} variants={fadeUp}>
              <Link
                to={service.href}
                className="group block rounded-xl border border-border bg-card p-7 transition-all duration-200 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1"
              >
                <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-accent/10 text-accent mb-5 transition-transform duration-200 group-hover:scale-105">
                  <service.icon size={22} />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-card-foreground group-hover:text-accent transition-colors duration-200">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesOverview;
