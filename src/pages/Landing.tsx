import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, ArrowRight, Leaf, ChevronDown } from "lucide-react";
import DecayTimeline from "@/components/DecayTimeline";

const Landing = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero — editorial, asymmetric */}
      <section className="relative min-h-[94vh] flex flex-col justify-end px-6 pb-12 overflow-hidden">
        {/* Large decorative text in background */}
        <div className="absolute top-8 -right-4 select-none pointer-events-none">
          <span className="text-[120px] sm:text-[180px] font-display font-bold text-foreground/[0.03] leading-none tracking-tighter">
            W2W
          </span>
        </div>

        {/* Organic blob shapes */}
        <div className="absolute top-20 right-8 w-32 h-32 rounded-full bg-category-compost/8 blur-[40px]" />
        <div className="absolute top-48 left-4 w-48 h-48 rounded-full bg-category-recycle/6 blur-[60px]" />
        <div className="absolute bottom-40 right-12 w-24 h-24 rounded-full bg-category-upcycle/8 blur-[30px]" />

        {/* Top bar */}
        <motion.div
          className="absolute top-6 left-6 right-6 flex items-center justify-between z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
              <Leaf size={14} className="text-primary" />
            </div>
            <span className="text-xs font-data text-foreground/60 tracking-[0.15em] uppercase">Waste-to-Worth</span>
          </div>
          <div className="flex items-center gap-1 text-[9px] font-data text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-glow-pulse" />
            Lucknow, IN
          </div>
        </motion.div>

        {/* Main content — left aligned, editorial */}
        <motion.div
          className="relative z-10 max-w-md"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-6">
            <motion.div
              className="inline-block px-2.5 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-data tracking-wider uppercase mb-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              AI-powered waste scanner
            </motion.div>

            <h1 className="text-[42px] sm:text-[56px] font-display font-bold text-foreground leading-[0.95] tracking-tight">
              Know your
              <br />
              waste.
              <br />
              <span className="text-primary/80">Save the planet.</span>
            </h1>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-8">
            Point your camera at any piece of garbage. Get instant disposal instructions, 
            upcycling ideas, and find nearby recycling facilities.
          </p>

          <div className="flex items-center gap-3">
            <Link to="/scan">
              <motion.button
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-foreground text-background font-display font-bold text-sm transition-all"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Camera size={17} />
                Scan now
                <ArrowRight size={14} />
              </motion.button>
            </Link>

            <Link to="/community" className="text-xs font-data text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 decoration-border">
              Explore community
            </Link>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={16} className="text-muted-foreground/40" />
        </motion.div>

        {/* Stats strip — horizontally laid, editorial */}
        <motion.div
          className="absolute bottom-4 right-6 z-10 flex items-end gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[
            { value: "12.8k", label: "scans" },
            { value: "3.2t", label: "diverted" },
            { value: "89%", label: "accuracy" },
          ].map((stat, i) => (
            <div key={i} className="text-right">
              <div className="text-lg font-display font-bold text-foreground tabular-nums leading-none">{stat.value}</div>
              <div className="text-[8px] font-data text-muted-foreground uppercase tracking-wider mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Decay Timeline — the USP */}
      <section className="px-6 py-16 max-w-lg mx-auto">
        <DecayTimeline />
      </section>

      {/* How it works — horizontal scroll cards */}
      <section className="px-6 py-12 max-w-lg mx-auto">
        <p className="text-[10px] font-data text-muted-foreground uppercase tracking-[0.2em] mb-2">How it works</p>
        <h2 className="text-xl font-display font-bold text-foreground mb-6">
          Three steps. Zero confusion.
        </h2>

        <div className="space-y-3">
          {[
            { num: "01", title: "Point & scan", desc: "Open the camera. Frame the item. One tap identifies it using multimodal vision AI.", accent: "border-l-category-recycle" },
            { num: "02", title: "Get instructions", desc: "Receive step-by-step disposal, recycling, or composting guidance specific to your city.", accent: "border-l-category-compost" },
            { num: "03", title: "Upcycle or find facility", desc: "Browse creative reuse ideas or navigate to the nearest drop-off point on the map.", accent: "border-l-category-upcycle" },
          ].map((step, i) => (
            <motion.div
              key={i}
              className={`p-4 rounded-xl bg-card/60 border border-border border-l-[3px] ${step.accent}`}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-start gap-3">
                <span className="text-[10px] font-data text-muted-foreground/50 mt-0.5">{step.num}</span>
                <div>
                  <h3 className="text-sm font-display font-bold text-foreground mb-0.5">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-12 max-w-lg mx-auto text-center">
        <motion.div
          className="p-8 rounded-3xl bg-gradient-to-br from-primary/8 to-category-recycle/5 border border-primary/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[10px] font-data text-primary uppercase tracking-[0.15em] mb-2">
            Every scan counts
          </p>
          <h2 className="text-xl font-display font-bold text-foreground mb-2">
            Start making a difference
          </h2>
          <p className="text-xs text-muted-foreground mb-6 max-w-xs mx-auto">
            Join thousands reducing landfill waste one scan at a time. It takes 3 seconds.
          </p>
          <Link to="/scan">
            <motion.button
              className="px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-sm glow-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Open Scanner
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;
