import { motion } from "framer-motion";
import { Shield, Cpu, Boxes, TrendingUp, Wrench, Users } from "lucide-react";

const reasons = [
  { icon: Cpu, title: "Technology-First Approach", description: "We lead with engineering excellence, not just strategy decks." },
  { icon: Shield, title: "AI-Driven Solutions", description: "Intelligent systems that learn, adapt, and optimize your operations." },
  { icon: Wrench, title: "Custom-Built Systems", description: "No cookie-cutter templates — every solution is tailored to your needs." },
  { icon: Boxes, title: "Scalable Architecture", description: "Systems built to handle growth from day one to millions of users." },
  { icon: TrendingUp, title: "Business-Focused Outcomes", description: "Technology should drive measurable results, not just check boxes." },
  { icon: Users, title: "Experienced Engineering Mindset", description: "Senior engineers who think strategically about your challenges." },
];

const WhyChooseUs = () => {
  return (
    <section className="section-padding section-alt-bg">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Why BluSapiens</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Built Different, By Design</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            We combine deep technical expertise with business strategy to deliver solutions that actually work.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center mt-0.5">
                <r.icon size={20} />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{r.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
