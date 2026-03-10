import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { ArrowRight, MapPin, Users, Heart } from "lucide-react";
import { fadeUp, staggerContainer, heroStagger, heroChild, viewport } from "@/lib/motion";

const Careers = () => {
  return (
    <PageLayout>
      <section className="hero-bg text-primary-foreground section-padding py-24 md:py-32">
        <div className="container-narrow text-center">
          <motion.div variants={heroStagger} initial="hidden" animate="visible">
            <motion.p variants={heroChild} className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Careers</motion.p>
            <motion.h1 variants={heroChild} className="text-4xl md:text-5xl font-extrabold mb-6">Join the Team</motion.h1>
            <motion.p variants={heroChild} className="text-lg opacity-70 max-w-2xl mx-auto">
              Help us build intelligent digital solutions for businesses around the world.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: MapPin, title: "Remote First", description: "Work from anywhere in the world." },
              { icon: Users, title: "Small Team, Big Impact", description: "Every person makes a meaningful difference." },
              { icon: Heart, title: "Growth Focused", description: "We invest in your professional development." },
            ].map((perk) => (
              <motion.div key={perk.title} variants={fadeUp}
                className="rounded-xl border border-border bg-card p-6 text-center transition-all duration-200 hover:border-accent/30 hover:shadow-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
                  <perk.icon size={20} />
                </div>
                <h3 className="font-semibold mb-1">{perk.title}</h3>
                <p className="text-sm text-muted-foreground">{perk.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="text-center rounded-xl border border-border bg-card p-12">
            <h2 className="text-2xl font-bold mb-3">No open positions right now</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <Link to="/contact" className="group inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-all duration-200 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-0.5 active:translate-y-0">
              Get in Touch <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Careers;
