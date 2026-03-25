import { motion } from "framer-motion";

const wasteItems = [
  { emoji: "🍾", x: "10%", y: "15%", delay: 0, size: 40 },
  { emoji: "🥫", x: "75%", y: "20%", delay: 1.2, size: 32 },
  { emoji: "📦", x: "85%", y: "55%", delay: 0.8, size: 36 },
  { emoji: "🔋", x: "20%", y: "60%", delay: 2.1, size: 28 },
  { emoji: "👟", x: "60%", y: "70%", delay: 0.4, size: 34 },
  { emoji: "📱", x: "40%", y: "25%", delay: 1.6, size: 30 },
  { emoji: "🥤", x: "90%", y: "35%", delay: 0.6, size: 32 },
  { emoji: "🛍️", x: "5%", y: "40%", delay: 1.8, size: 36 },
];

const FloatingWaste = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {wasteItems.map((item, i) => (
        <motion.div
          key={i}
          className="absolute opacity-20"
          style={{ left: item.x, top: item.y, fontSize: item.size }}
          animate={{
            y: [0, -15, -8, 0],
            rotate: [0, 2, -1, 0],
          }}
          transition={{
            duration: 6,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingWaste;
