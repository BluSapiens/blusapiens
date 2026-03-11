import { Link } from "react-router-dom";
import { Linkedin, Twitter, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewport } from "@/lib/motion";

const footerSections = [
  {
    title: "Services",
    links: [
      { label: "AI & Automation", href: "/services/ai-automation" },
      { label: "Web Development", href: "/services/web-development" },
      { label: "Custom Software", href: "/services/custom-software" },
      { label: "Data & Analytics", href: "/services/data-analytics" },
      { label: "Cloud Solutions", href: "/services/cloud-solutions" },
      { label: "Digital Transformation", href: "/services/digital-transformation" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Process", href: "/process" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className="container-wide section-padding"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <motion.div variants={fadeUp} className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3" aria-label="BluSapiens home">
              <img
                src="/blusapiens.svg"
                alt="BluSapiens logo"
                width={1184}
                height={864}
                className="logo-pixel h-16 w-auto shrink-0"
              />
              <span className="font-heading font-bold text-xl">
                <span className="text-accent">Blu</span>Sapiens
              </span>
            </Link>
            <p className="mt-4 text-sm opacity-70 max-w-md leading-relaxed">
              Smarter technology for evolving businesses. We help companies adopt AI, automation, and modern digital technologies to improve efficiency, innovation, and growth.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="opacity-60 hover:opacity-100 transition-opacity duration-200" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="#" className="opacity-60 hover:opacity-100 transition-opacity duration-200" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="mailto:hello@blusapiens.com" className="opacity-60 hover:opacity-100 transition-opacity duration-200" aria-label="Email">
                <Mail size={18} />
              </a>
            </div>
          </motion.div>

          {footerSections.map((section) => (
            <motion.div key={section.title} variants={fadeUp}>
              <h4 className="font-semibold text-sm mb-4">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm opacity-60 hover:opacity-100 transition-opacity duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-primary-foreground/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs opacity-50">
            © {new Date().getFullYear()} BluSapiens — Intelligent digital solutions for modern businesses.
          </p>
          <div className="flex items-center gap-6 text-xs opacity-50">
            <Link to="/privacy" className="hover:opacity-100 transition-opacity duration-200">Privacy Policy</Link>
            <Link to="/terms" className="hover:opacity-100 transition-opacity duration-200">Terms of Service</Link>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
