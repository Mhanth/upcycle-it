import { motion } from "framer-motion";
import { Flame, Leaf, Trophy, Droplets } from "lucide-react";

const mockLog = [
  { date: "Today", items: [
    { name: "PET Plastic Bottle", category: "Recyclable", time: "2:34 PM" },
    { name: "Banana Peel", category: "Compostable", time: "12:15 PM" },
  ]},
  { date: "Yesterday", items: [
    { name: "Aluminum Can", category: "Recyclable", time: "6:20 PM" },
    { name: "AA Battery", category: "Hazardous", time: "3:45 PM" },
    { name: "Cardboard Box", category: "Recyclable", time: "10:00 AM" },
  ]},
];

const categoryDot: Record<string, string> = {
  Recyclable: "bg-category-recycle",
  Compostable: "bg-category-compost",
  Hazardous: "bg-category-hazard",
  Landfill: "bg-category-landfill",
  Upcyclable: "bg-category-upcycle",
};

const MyLog = () => {
  return (
    <div className="min-h-screen bg-background pb-24 pt-6 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-display font-bold text-foreground mb-6">My Log</h1>

        {/* Impact Summary */}
        <motion.div
          className="grid grid-cols-2 gap-3 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[
            { icon: Leaf, value: "23", label: "Items Scanned", color: "text-category-compost" },
            { icon: Droplets, value: "4.2kg", label: "CO₂ Saved", color: "text-category-recycle" },
            { icon: Flame, value: "7 days", label: "Scan Streak", color: "text-destructive" },
            { icon: Trophy, value: "Eco Warrior", label: "Current Level", color: "text-category-upcycle" },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-xl bg-card border border-border">
              <stat.icon size={16} className={stat.color} />
              <div className="text-xl font-display font-bold text-foreground mt-2 tabular-nums">{stat.value}</div>
              <div className="text-[10px] font-data text-muted-foreground uppercase">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* XP Bar */}
        <div className="p-4 rounded-xl bg-card border border-border mb-6">
          <div className="flex justify-between text-xs font-data text-muted-foreground mb-2">
            <span>Level 4: Eco Warrior</span>
            <span>680 / 1000 XP</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "68%" }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Timeline */}
        {mockLog.map((day, di) => (
          <div key={di} className="mb-6">
            <h3 className="text-xs font-data text-muted-foreground uppercase tracking-wider mb-3">{day.date}</h3>
            <div className="space-y-2">
              {day.items.map((item, ii) => (
                <motion.div
                  key={ii}
                  className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (di * 3 + ii) * 0.08 }}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${categoryDot[item.category]}`} />
                  <div className="flex-1">
                    <div className="text-sm font-display font-bold text-foreground">{item.name}</div>
                    <div className="text-[10px] font-data text-muted-foreground">{item.category}</div>
                  </div>
                  <span className="text-[10px] font-data text-muted-foreground">{item.time}</span>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyLog;
