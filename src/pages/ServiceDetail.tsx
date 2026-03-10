import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import { Brain, Globe, Lightbulb, BarChart3, Code2, Layers, ArrowRight, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ServiceData {
  icon: LucideIcon;
  title: string;
  tagline: string;
  overview: string;
  problems: string[];
  solutions: string[];
  features: string[];
  benefits: string[];
  useCases: string[];
}

const serviceData: Record<string, ServiceData> = {
  "ai-automation": {
    icon: Brain, title: "AI & Automation Solutions", tagline: "Intelligent systems that work smarter so you don't have to work harder.",
    overview: "Leverage artificial intelligence and automation to streamline operations, reduce manual effort, and unlock capabilities that weren't possible before. From intelligent process automation to predictive analytics, we build AI solutions that deliver real business value.",
    problems: ["Manual, repetitive processes draining resources", "Inability to process and analyze large data volumes", "Slow decision-making due to lack of real-time insights", "Customer service bottlenecks"],
    solutions: ["Intelligent process automation", "Machine learning models for prediction and optimization", "Natural language processing for customer interactions", "Computer vision and document processing"],
    features: ["Custom AI model development", "Workflow automation platforms", "Chatbot and virtual assistant deployment", "Predictive analytics dashboards"],
    benefits: ["Reduce operational costs by up to 40%", "Make data-driven decisions in real time", "Scale operations without proportional headcount", "Improve customer experience with 24/7 AI support"],
    useCases: ["Automated customer support with AI chatbots", "Predictive maintenance for manufacturing", "Intelligent document processing for finance", "Personalized recommendations for e-commerce"],
  },
  "web-development": {
    icon: Globe, title: "Web & Application Development", tagline: "Modern, performant digital experiences that users love.",
    overview: "Build world-class web applications and digital experiences with cutting-edge technologies. We create responsive, fast, and accessible applications that delight users and drive business results.",
    problems: ["Outdated web presence hurting credibility", "Slow, unresponsive applications losing users", "Poor mobile experience", "Inability to scale with growing traffic"],
    solutions: ["Modern frontend frameworks (React, Next.js)", "Progressive web applications", "Responsive mobile-first design", "Performance-optimized architecture"],
    features: ["Custom web application development", "E-commerce platforms", "Content management systems", "API development and integration"],
    benefits: ["Lightning-fast load times", "Seamless cross-device experience", "Higher conversion rates", "Easy content management"],
    useCases: ["SaaS application dashboards", "E-commerce storefronts", "Corporate websites and portals", "Customer-facing web apps"],
  },
  "custom-software": {
    icon: Code2, title: "Custom Software Development", tagline: "Purpose-built software for your unique challenges.",
    overview: "When off-the-shelf solutions don't cut it, we build custom software tailored to your exact business requirements. Our engineering team delivers robust, scalable, and maintainable systems.",
    problems: ["Generic software limiting business processes", "Integration challenges between multiple tools", "Scaling limitations with current systems", "Data silos preventing unified insights"],
    solutions: ["Custom application architecture and development", "System integration and API development", "Legacy system modernization", "Microservices and event-driven architecture"],
    features: ["Full-stack application development", "Database design and optimization", "Third-party integrations", "DevOps and CI/CD pipelines"],
    benefits: ["Software that fits your workflow perfectly", "Reduced dependency on multiple vendors", "Full ownership and control", "Built to scale with your growth"],
    useCases: ["Internal operations platforms", "Customer relationship management tools", "Inventory and supply chain systems", "Booking and scheduling platforms"],
  },
  "data-analytics": {
    icon: BarChart3, title: "Data & Analytics Solutions", tagline: "Turn raw data into your most valuable business asset.",
    overview: "Transform scattered data into actionable intelligence. We build analytics platforms, data pipelines, and visualization tools that empower teams to make smarter, faster decisions.",
    problems: ["Data scattered across multiple systems", "No real-time visibility into business performance", "Manual reporting consuming valuable time", "Inability to predict trends or outcomes"],
    solutions: ["Data warehouse and lake architecture", "Real-time analytics pipelines", "Business intelligence dashboards", "Predictive and prescriptive analytics"],
    features: ["Custom dashboard development", "ETL pipeline engineering", "Data modeling and governance", "Self-service analytics platforms"],
    benefits: ["Real-time business visibility", "Data-driven decision making", "Automated reporting workflows", "Predictive insights for strategic planning"],
    useCases: ["Executive performance dashboards", "Marketing analytics platforms", "Financial reporting automation", "Customer behavior analysis"],
  },
  "digital-transformation": {
    icon: Lightbulb, title: "Digital Transformation Consulting", tagline: "Strategic technology guidance for modern businesses.",
    overview: "Navigate the complexities of digital transformation with expert guidance. We help organizations assess, plan, and execute technology strategies that align with business goals.",
    problems: ["Uncertain about which technologies to adopt", "Legacy systems hindering growth", "Disconnected digital initiatives", "Lack of internal technical expertise"],
    solutions: ["Technology assessment and roadmapping", "Digital strategy development", "Process re-engineering", "Change management and training"],
    features: ["Technology audit and assessment", "Digital roadmap creation", "Vendor evaluation and selection", "Implementation oversight"],
    benefits: ["Clear technology direction aligned with goals", "Reduced risk in technology investments", "Faster digital adoption across teams", "Measurable ROI on technology spending"],
    useCases: ["Enterprise digital strategy overhaul", "Startup technology stack selection", "Cloud migration planning", "Digital-first business model design"],
  },
  "cloud-solutions": {
    icon: Layers, title: "Cloud Solutions", tagline: "Secure, scalable infrastructure that grows with you.",
    overview: "Design, migrate, and optimize cloud infrastructure for performance, security, and cost efficiency. We work with leading cloud platforms to build architectures that scale seamlessly.",
    problems: ["Rising infrastructure costs", "Security and compliance concerns", "Difficulty scaling for peak demand", "Complex multi-cloud management"],
    solutions: ["Cloud architecture design", "Migration and modernization", "Security and compliance implementation", "Cost optimization and monitoring"],
    features: ["Multi-cloud strategy", "Infrastructure as Code", "Container orchestration", "Monitoring and alerting systems"],
    benefits: ["Reduced infrastructure costs", "Enhanced security posture", "Elastic scaling capabilities", "Improved reliability and uptime"],
    useCases: ["Cloud migration for enterprise workloads", "Kubernetes deployment for microservices", "Serverless architecture for startups", "Hybrid cloud for regulated industries"],
  },
};

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? serviceData[slug] : null;

  if (!service) {
    return (
      <PageLayout>
        <div className="section-padding container-narrow text-center">
          <h1 className="text-2xl font-bold mb-4">Service not found</h1>
          <Link to="/services" className="text-accent hover:underline">View all services</Link>
        </div>
      </PageLayout>
    );
  }

  const Icon = service.icon;

  return (
    <PageLayout>
      {/* Hero */}
      <section className="hero-bg text-primary-foreground section-padding py-24 md:py-32">
        <div className="container-narrow">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-accent/20 text-accent flex items-center justify-center">
                <Icon size={24} />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{service.title}</h1>
            <p className="text-xl opacity-70 max-w-2xl">{service.tagline}</p>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="section-padding">
        <div className="container-narrow max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">{service.overview}</p>
          </motion.div>
        </div>
      </section>

      {/* Problems & Solutions */}
      <section className="section-padding section-alt-bg">
        <div className="container-narrow grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold mb-6">Problems We Solve</h2>
            <ul className="space-y-3">
              {service.problems.map((p) => (
                <li key={p} className="flex gap-3 text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 flex-shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <h2 className="text-2xl font-bold mb-6">Our Solutions</h2>
            <ul className="space-y-3">
              {service.solutions.map((s) => (
                <li key={s} className="flex gap-3 text-muted-foreground">
                  <Check size={18} className="text-accent mt-0.5 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Features & Benefits */}
      <section className="section-padding">
        <div className="container-narrow grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold mb-6">Key Features</h2>
            <ul className="space-y-3">
              {service.features.map((f) => (
                <li key={f} className="flex gap-3">
                  <Check size={18} className="text-accent mt-0.5 flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <h2 className="text-2xl font-bold mb-6">Benefits</h2>
            <ul className="space-y-3">
              {service.features.map((_, i) => (
                <li key={service.benefits[i]} className="flex gap-3">
                  <Check size={18} className="text-accent mt-0.5 flex-shrink-0" />
                  <span>{service.benefits[i]}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="section-padding section-alt-bg">
        <div className="container-narrow">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-2xl font-bold">Example Use Cases</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.useCases.map((uc, i) => (
              <motion.div key={uc} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-6"
              >
                <p className="font-medium">{uc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-narrow text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">Let's discuss how we can help transform your business with {service.title.toLowerCase()}.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground hover:opacity-90">
            Book a Consultation <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </PageLayout>
  );
};

export default ServiceDetail;
