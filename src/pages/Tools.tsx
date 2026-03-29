import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  FileArchive,
  FileImage,
  FileOutput,
  Files,
  LockOpen,
  Minimize2,
  RotateCw,
  Scissors,
  Search,
  Sparkles,
  Upload,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { fadeUp, heroChild, heroStagger, staggerContainer, viewport } from "@/lib/motion";

const tools = [
  {
    title: "Merge PDF",
    description: "Combine files into one PDF.",
    icon: Files,
    status: "Popular",
    shell: "bg-[#F4F8FF]",
    panel: "bg-[#E7F0FF]",
    glow: "from-[#60A5FA]/30 via-[#38BDF8]/18 to-transparent",
    iconWrap: "bg-white/80 text-[#0F4C81] border-[#BFDBFE]",
    button: "bg-[#0F4C81] hover:bg-[#0C3D67] text-white",
  },
  {
    title: "Split PDF",
    description: "Break pages into separate files.",
    icon: Scissors,
    status: "Fast",
    shell: "bg-[#F3FCF8]",
    panel: "bg-[#DDF7EC]",
    glow: "from-[#34D399]/28 via-[#10B981]/18 to-transparent",
    iconWrap: "bg-white/80 text-[#0F766E] border-[#A7F3D0]",
    button: "bg-[#0F766E] hover:bg-[#0B5E58] text-white",
  },
  {
    title: "Compress PDF",
    description: "Reduce file size for sharing.",
    icon: Minimize2,
    status: "Useful",
    shell: "bg-[#FFF8F1]",
    panel: "bg-[#FDEBD3]",
    glow: "from-[#F59E0B]/28 via-[#FB923C]/18 to-transparent",
    iconWrap: "bg-white/85 text-[#9A3412] border-[#FED7AA]",
    button: "bg-[#C2410C] hover:bg-[#9A3412] text-white",
  },
  {
    title: "PDF to Word",
    description: "Convert PDF into Word format.",
    icon: FileOutput,
    status: "Convert",
    shell: "bg-[#F7F4FF]",
    panel: "bg-[#ECE6FF]",
    glow: "from-[#8B5CF6]/28 via-[#A855F7]/18 to-transparent",
    iconWrap: "bg-white/85 text-[#6D28D9] border-[#DDD6FE]",
    button: "bg-[#6D28D9] hover:bg-[#5B21B6] text-white",
  },
  {
    title: "JPG to PDF",
    description: "Turn images into one PDF.",
    icon: FileArchive,
    status: "Images",
    shell: "bg-[#FFF5F7]",
    panel: "bg-[#FFE3EB]",
    glow: "from-[#F43F5E]/26 via-[#FB7185]/18 to-transparent",
    iconWrap: "bg-white/85 text-[#BE185D] border-[#FECDD3]",
    button: "bg-[#BE185D] hover:bg-[#9D174D] text-white",
  },
  {
    title: "PDF to JPG",
    description: "Export pages as images.",
    icon: FileImage,
    status: "Export",
    shell: "bg-[#F4FBFF]",
    panel: "bg-[#DDF3FF]",
    glow: "from-[#0EA5E9]/26 via-[#22D3EE]/18 to-transparent",
    iconWrap: "bg-white/85 text-[#0369A1] border-[#BAE6FD]",
    button: "bg-[#0369A1] hover:bg-[#075985] text-white",
  },
  {
    title: "Rotate PDF",
    description: "Rotate pages quickly.",
    icon: RotateCw,
    status: "Quick Fix",
    shell: "bg-[#F7FAF2]",
    panel: "bg-[#E7F2D5]",
    glow: "from-[#84CC16]/24 via-[#65A30D]/18 to-transparent",
    iconWrap: "bg-white/85 text-[#3F6212] border-[#D9F99D]",
    button: "bg-[#4D7C0F] hover:bg-[#3F6212] text-white",
  },
  {
    title: "Unlock PDF",
    description: "Open supported restricted files.",
    icon: LockOpen,
    status: "Access",
    shell: "bg-[#F8F7FB]",
    panel: "bg-[#ECEAF3]",
    glow: "from-[#64748B]/24 via-[#94A3B8]/18 to-transparent",
    iconWrap: "bg-white/85 text-[#334155] border-[#CBD5E1]",
    button: "bg-[#334155] hover:bg-[#1E293B] text-white",
  },
] as const;

const featurePills = ["8 PDF tools", "Fast everyday workflows", "Built for practical use"];
const cardGlow = "shadow-[0_24px_60px_-42px_rgba(15,23,42,0.35)]";

const Tools = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return tools;

    return tools.filter(
      (tool) =>
        tool.title.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.status.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <PageLayout>
      <section className="hero-bg relative overflow-hidden text-primary-foreground section-padding py-24 md:py-32">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "34px 34px",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(195 100% 50%), transparent 70%)" }}
        />

        <div className="container-narrow relative z-10 text-center">
          <motion.div variants={heroStagger} initial="hidden" animate="visible">
            <motion.div variants={heroChild} className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium">
              <Sparkles size={14} className="text-accent" />
              BluSapiens Tools
            </motion.div>
            <motion.h1 variants={heroChild} className="mb-6 text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
              Practical PDF tools for everyday document work
            </motion.h1>
            <motion.p variants={heroChild} className="mx-auto max-w-3xl text-lg leading-relaxed opacity-70">
              Merge, split, compress, convert, rotate, and manage PDF files from one focused workspace. This section is designed to help teams handle common document tasks faster and with less friction.
            </motion.p>
            <motion.div variants={heroChild} className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm">
              {featurePills.map((pill) => (
                <div key={pill} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/80">
                  {pill}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className={`mb-10 rounded-[1.75rem] border border-border/80 bg-card/90 p-6 ${cardGlow}`}
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Tool Search</p>
                <h2 className="mt-2 text-2xl font-bold">Find the exact PDF workflow you need</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Search by task and jump directly to the tool that matches your document workflow, whether you need file conversion, page editing, or quick cleanup.
                </p>
              </div>
              <div className="w-full max-w-md">
                <label htmlFor="tool-search" className="sr-only">
                  Search tools
                </label>
                <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="tool-search"
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search Merge PDF, Rotate PDF..."
                    className="w-full rounded-2xl border border-input bg-background pl-11 pr-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-6 xl:grid-cols-2"
          >
            {filteredTools.length > 0 ? (
              filteredTools.map((tool) => {
                const Icon = tool.icon;

                return (
                  <motion.div
                    key={tool.title}
                    variants={fadeUp}
                    className={`relative overflow-hidden rounded-[1.9rem] border border-black/5 p-6 ${tool.shell} ${cardGlow}`}
                  >
                    <div className={`absolute inset-x-6 top-4 h-24 rounded-full bg-gradient-to-r ${tool.glow} blur-2xl`} />

                    <div className="relative z-10 flex h-full flex-col">
                      <div className="mb-5 flex items-start justify-between gap-4">
                        <div>
                          <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${tool.iconWrap}`}>
                            <Icon size={22} />
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-xl font-bold text-slate-900">{tool.title}</h3>
                            <span className="rounded-full border border-black/5 bg-white/70 px-3 py-1 text-[11px] font-medium text-slate-500">
                              {tool.status}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-slate-600">{tool.description}</p>
                        </div>
                      </div>

                      <div className={`mt-auto rounded-[1.5rem] border border-black/5 ${tool.panel} p-4`}>
                        <div className="flex items-center gap-3 rounded-2xl bg-white/75 px-4 py-4">
                          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900/5 text-slate-700">
                            <Upload size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">Upload files</p>
                            <p className="text-xs text-slate-500">Input area for this tool</p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className="rounded-2xl bg-white/75 px-4 py-3 text-xs text-slate-500">
                            Result and progress area
                          </div>
                          <button
                            type="button"
                            className={`rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 ${tool.button}`}
                          >
                            Start
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                variants={fadeUp}
                className={`col-span-full rounded-[1.75rem] border border-dashed border-border bg-card/80 px-6 py-14 text-center ${cardGlow}`}
              >
                <p className="text-lg font-semibold">No matching tools found</p>
                <p className="mt-2 text-sm text-muted-foreground">Try searching for terms like `PDF`, `merge`, `rotate`, `compress`, or `image`.</p>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="mt-14 overflow-hidden rounded-[2rem] border border-border/80 bg-primary text-primary-foreground"
          >
            <div className="grid gap-8 p-8 md:grid-cols-[1.1fr_0.9fr] md:p-10">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Visual Direction</p>
                <h3 className="mt-3 text-2xl font-bold">A focused tool library for common document operations</h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/70">
                  These tools are planned around the most common PDF and document workflows teams need every day, from combining files and exporting pages to simplifying sharing and access tasks.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-sm font-medium text-primary-foreground/75">Included workflows</p>
                <ol className="mt-4 space-y-3 text-sm text-primary-foreground/80">
                  <li>1. Merge and organize PDFs</li>
                  <li>2. Convert between PDF, Word, and images</li>
                  <li>3. Rotate, compress, and unlock documents</li>
                </ol>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="mt-14 text-center">
            <p className="mb-4 text-muted-foreground">Need a custom document workflow or a utility tailored to your business process?</p>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20"
            >
              Talk to BluSapiens
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Tools;
