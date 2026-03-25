import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Recycle, Lightbulb, ArrowRight } from "lucide-react";
import FloatingWaste from "@/components/FloatingWaste";

const stats = [
  { value: "12,847", label: "Items scanned today" },
  { value: "3.2 tons", label: "Diverted from landfill" },
  { value: "89%", label: "Recycling accuracy" },
];

const pillars = [
  {
    icon: Camera,
    title: "Identify",
    description: "Point your camera at any piece of waste. AI recognizes it instantly with material-level precision.",
    color: "text-category-recycle",
  },
  {
    icon: Recycle,
    title: "Dispose Right",
    description: "Get step-by-step disposal instructions tailored to your local recycling rules and facilities.",
    color: "text-category-compost",
  },
  {
    icon: Lightbulb,
    title: "Upcycle Creatively",
    description: "Discover creative ways to transform waste into something valuable. AI-generated project ideas.",
    color: "text-category-upcycle",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden">
        <FloatingWaste />

        <motion.div
          className="relative z-10 text-center max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/50 backdrop-blur mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
            <span className="text-xs font-data text-muted-foreground">AI-POWERED WASTE SCANNER</span>
          </motion.div>

          <h1 className="text-4xl sm:text-6xl font-display font-bold text-foreground leading-tight text-balance mb-4">
            Garbage has a{" "}
            <span className="text-primary">second life.</span>
            <br />
            Find it.
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Point. Scan. Know exactly what to do.
          </p>

          <Link to="/scan">
            <motion.button
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-display font-bold text-lg glow-primary hover:brightness-110 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <Camera size={22} />
              Start Scanning
              <ArrowRight size={18} />
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats ticker */}
        <motion.div
          className="relative z-10 flex flex-wrap justify-center gap-6 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-display font-bold text-foreground tabular-nums">
                {stat.value}
              </div>
              <div className="text-xs font-data text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Pillars */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <motion.h2
          className="text-2xl font-display font-bold text-foreground text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Three steps to zero waste
        </motion.h2>

        <div className="grid sm:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              className="p-6 rounded-xl bg-card border border-border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <pillar.icon size={28} className={`${pillar.color} mb-4`} />
              <h3 className="text-lg font-display font-bold text-foreground mb-2">
                {pillar.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
