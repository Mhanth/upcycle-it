import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Recycle, Lightbulb, ArrowRight, Leaf } from "lucide-react";
import FloatingWaste from "@/components/FloatingWaste";

const stats = [
  { value: "12,847", label: "Items scanned" },
  { value: "3.2t", label: "Diverted" },
  { value: "89%", label: "Accuracy" },
];

const pillars = [
  {
    icon: Camera,
    title: "Identify",
    description: "Point your camera at any waste item. AI recognizes it instantly.",
  },
  {
    icon: Recycle,
    title: "Dispose Right",
    description: "Step-by-step disposal instructions tailored to your local rules.",
  },
  {
    icon: Lightbulb,
    title: "Upcycle",
    description: "Creative AI-generated project ideas to give waste a second life.",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-6 overflow-hidden">
        <FloatingWaste />

        {/* Decorative gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-primary/3 blur-[120px]" />

        <motion.div
          className="relative z-10 text-center max-w-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo / badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Leaf size={14} className="text-primary" />
            <span className="text-xs font-data text-primary tracking-widest uppercase">Waste-to-Worth</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-foreground leading-[1.1] text-balance mb-5">
            Start Recycling{" "}
            <span className="text-primary">Today</span>
          </h1>

          <p className="text-base text-muted-foreground mb-10 max-w-sm mx-auto leading-relaxed">
            Point. Scan. Know exactly how to dispose, recycle, or upcycle any waste item.
          </p>

          <Link to="/scan">
            <motion.button
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-base glow-primary transition-all"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <Camera size={20} />
              Start Scanning
              <ArrowRight size={16} />
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="relative z-10 flex gap-2 mt-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="px-5 py-3 rounded-2xl glass-card text-center min-w-[100px]"
            >
              <div className="text-lg font-display font-bold text-foreground tabular-nums">
                {stat.value}
              </div>
              <div className="text-[10px] font-data text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Pillars */}
      <section className="px-6 py-16 max-w-lg mx-auto">
        <motion.h2
          className="text-xl font-display font-bold text-foreground text-center mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Three steps to zero waste
        </motion.h2>

        <div className="space-y-4">
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-4 p-5 rounded-2xl glass-card"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
            >
              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center">
                <pillar.icon size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-display font-bold text-foreground mb-1">
                  {pillar.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
