import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import { Target, Eye, Heart, Lightbulb, Handshake } from "lucide-react";

const values = [
  { icon: Lightbulb, title: "Innovation", description: "We constantly explore new technologies and approaches." },
  { icon: Eye, title: "Transparency", description: "Clear communication and honest partnerships." },
  { icon: Target, title: "Quality", description: "Excellence in every line of code and every deliverable." },
  { icon: Handshake, title: "Long-Term Partnerships", description: "We invest in relationships, not just projects." },
  { icon: Heart, title: "Continuous Improvement", description: "Always learning, always getting better." },
];

const About = () => {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="hero-bg text-primary-foreground section-padding py-24 md:py-32">
        <div className="container-narrow text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">About Us</p>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Smarter Technology for Evolving Businesses</h1>
            <p className="text-lg opacity-70 max-w-2xl mx-auto">
              BluSapiens exists to help organizations evolve through intelligent technology and modern digital infrastructure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding">
        <div className="container-narrow grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">Our Mission</p>
            <h2 className="text-2xl font-bold mb-4">Empowering Digital Evolution</h2>
            <p className="text-muted-foreground leading-relaxed">
              BluSapiens exists to help organizations evolve through intelligent technology and modern digital infrastructure. We believe every business deserves access to powerful, well-engineered technology solutions.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">Our Vision</p>
            <h2 className="text-2xl font-bold mb-4">A Trusted Technology Partner</h2>
            <p className="text-muted-foreground leading-relaxed">
              To become the most trusted partner for businesses adopting AI and advanced digital systems. We envision a world where technology simplifies complexity and empowers people to focus on what matters most.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section-padding section-alt-bg">
        <div className="container-narrow">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">Our Philosophy</p>
            <h2 className="text-3xl font-bold mb-4">Technology Should Work for People</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {["Simplify complexity", "Empower people", "Unlock innovation", "Scale businesses"].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-border bg-card p-6"
              >
                <p className="font-semibold">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="section-padding">
        <div className="container-narrow">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">Our Approach</p>
            <h2 className="text-3xl font-bold mb-4">Where Engineering Meets Strategy</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">BluSapiens combines engineering expertise, modern architecture, AI-powered thinking, and business strategy to deliver real results.</p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding section-alt-bg">
        <div className="container-narrow">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">Our Values</p>
            <h2 className="text-3xl font-bold">What Drives Us</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                  <v.icon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default About;
