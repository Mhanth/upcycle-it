import { motion } from "framer-motion";
import { Heart, MessageCircle, Filter } from "lucide-react";

const mockPosts = [
  { id: 1, title: "Bottle Terrarium", item: "Glass Bottle", creator: "EcoAlex", difficulty: "Easy", votes: 234, comments: 18, color: "bg-category-recycle" },
  { id: 2, title: "Can Wind Chimes", item: "Aluminum Cans", creator: "GreenMia", difficulty: "Medium", votes: 187, comments: 12, color: "bg-category-recycle" },
  { id: 3, title: "T-Shirt Tote Bag", item: "Old Clothing", creator: "UpCycleKing", difficulty: "Easy", votes: 312, comments: 45, color: "bg-category-upcycle" },
  { id: 4, title: "Pallet Coffee Table", item: "Wood Pallet", creator: "WoodCraft99", difficulty: "Hard", votes: 156, comments: 8, color: "bg-category-compost" },
  { id: 5, title: "Tire Swing Planter", item: "Car Tire", creator: "GardenGuru", difficulty: "Medium", votes: 198, comments: 22, color: "bg-category-landfill" },
  { id: 6, title: "CD Mosaic Frame", item: "Old CDs", creator: "ArtEco", difficulty: "Easy", votes: 145, comments: 14, color: "bg-category-upcycle" },
];

const Community = () => {
  return (
    <div className="min-h-screen bg-background pb-24 pt-6 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-display font-bold text-foreground">Community</h1>
          <button className="p-2 rounded-xl glass-card text-muted-foreground">
            <Filter size={16} />
          </button>
        </div>

        {/* Weekly Challenge */}
        <motion.div
          className="p-5 rounded-xl bg-gradient-to-br from-category-upcycle/20 to-card border border-category-upcycle/30 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-[10px] font-data text-category-upcycle uppercase tracking-widest">Weekly Challenge</span>
          <h2 className="text-lg font-display font-bold text-foreground mt-1">
            Upcycle a plastic bottle into something useful
          </h2>
          <p className="text-xs text-muted-foreground mt-1">3 days left • 47 submissions</p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3">
          {mockPosts.map((post, i) => (
            <motion.div
              key={post.id}
              className="rounded-xl bg-card border border-border overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className={`h-28 ${post.color} opacity-20`} />
              <div className="p-3">
                <span className="text-[10px] font-data text-muted-foreground">{post.item}</span>
                <h3 className="text-sm font-display font-bold text-foreground mt-0.5">{post.title}</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">by {post.creator}</p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart size={10} /> {post.votes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={10} /> {post.comments}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;
