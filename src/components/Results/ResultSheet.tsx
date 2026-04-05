import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X, MapPin, Share2, RotateCcw, Leaf, Droplets, Zap, ShoppingBag } from "lucide-react";
import CategoryBadge from "./CategoryBadge";
import WasteScore from "./WasteScore";
import VideoSuggestions from "./VideoSuggestions";
import ShareScanModal from "./ShareScanModal";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ScanResult {
  name: string;
  confidence: number;
  category: "Recyclable" | "Compostable" | "Hazardous" | "Landfill" | "Upcyclable";
  material: string;
  wasteScore: number;
  disposalSteps: string[];
  upcycleIdeas: { title: string; difficulty: string; time: string }[];
  impact: { co2: string; water: string; readable: string };
}

interface ResultSheetProps {
  result: ScanResult | null;
  onClose: () => void;
  onScanAgain: () => void;
}

const categoryToEnum: Record<string, string> = {
  Recyclable: "recyclable",
  Compostable: "compostable",
  Hazardous: "hazardous",
  Landfill: "landfill",
  Upcyclable: "upcyclable",
};

const ResultSheet = ({ result, onClose, onScanAgain }: ResultSheetProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [shareOpen, setShareOpen] = useState(false);
  const [savedScanId, setSavedScanId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const saveAndShare = async () => {
    if (!user || !result) {
      toast.error("Login to share scans");
      return;
    }

    // Save to scan_history if not already saved
    if (!savedScanId) {
      setSaving(true);
      try {
        const co2Num = parseFloat(result.impact.co2.replace(/[^\d.]/g, "")) || 0;
        const { data, error } = await supabase.from("scan_history").insert({
          user_id: user.id,
          item_name: result.name,
          category: categoryToEnum[result.category] as any,
          material: result.material,
          carbon_saved: co2Num,
          credits_earned: Math.round(co2Num * 10),
          disposal_method: result.disposalSteps.join(" → "),
        }).select("id").single();

        if (error) throw error;
        setSavedScanId(data.id);
      } catch {
        toast.error("Failed to save scan");
        setSaving(false);
        return;
      }
      setSaving(false);
    }

    setShareOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {result && (
          <motion.div
            className="fixed inset-x-0 bottom-0 z-40 max-h-[75vh] overflow-y-auto rounded-t-2xl bg-card border-t border-border lg:inset-x-auto lg:right-6 lg:bottom-6 lg:left-auto lg:w-[480px] lg:rounded-2xl lg:border lg:max-h-[85vh]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="p-6 pb-24 lg:pb-6">
              {/* Handle (mobile) */}
              <div className="w-10 h-1 rounded-full bg-border mx-auto mb-4 lg:hidden" />

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground">{result.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <CategoryBadge category={result.category} />
                    <span className="text-xs font-data text-muted-foreground">
                      {result.confidence}% match
                    </span>
                  </div>
                  <span className="text-xs font-data text-muted-foreground mt-1 block">
                    Material: {result.material}
                  </span>
                </div>
                <WasteScore score={result.wasteScore} />
              </div>

              {/* Disposal Steps */}
              <div className="mb-6">
                <h3 className="text-sm font-display font-bold text-foreground mb-3 uppercase tracking-wider">
                  How to Dispose
                </h3>
                <ol className="space-y-2">
                  {result.disposalSteps.map((step, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-data font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-sm text-foreground/80">{step}</span>
                    </motion.li>
                  ))}
                </ol>
              </div>

              {/* Impact Card */}
              <motion.div
                className="p-4 rounded-xl bg-surface-alt border border-border mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-xs font-data text-muted-foreground uppercase tracking-wider mb-3">
                  Environmental Impact
                </h3>
                <div className="flex gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <Leaf size={14} className="text-category-compost" />
                    <span className="text-sm font-data text-foreground">{result.impact.co2} CO₂</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets size={14} className="text-category-recycle" />
                    <span className="text-sm font-data text-foreground">{result.impact.water} water</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{result.impact.readable}</p>
              </motion.div>

              {/* Upcycle Ideas */}
              <div className="mb-6">
                <h3 className="text-sm font-display font-bold text-foreground mb-3 uppercase tracking-wider">
                  Upcycle Ideas
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {result.upcycleIdeas.map((idea, i) => (
                    <motion.div
                      key={i}
                      className="flex-shrink-0 w-48 p-4 rounded-xl bg-surface-alt border border-border"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                    >
                      <Zap size={14} className="text-category-upcycle mb-2" />
                      <h4 className="text-sm font-display font-bold text-foreground mb-1">{idea.title}</h4>
                      <div className="flex gap-2 text-[10px] font-data text-muted-foreground">
                        <span>{idea.difficulty}</span>
                        <span>•</span>
                        <span>{idea.time}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* YouTube Videos */}
              <VideoSuggestions category={result.category} itemName={result.name} />

              {/* Actions */}
              <div className="flex gap-3 mb-3">
                <button
                  onClick={onScanAgain}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold"
                >
                  <RotateCcw size={16} />
                  Scan Again
                </button>
                <button
                  onClick={() => navigate("/facilities")}
                  className="px-4 py-3 rounded-xl bg-secondary text-secondary-foreground border border-border"
                >
                  <MapPin size={16} />
                </button>
                <button
                  onClick={saveAndShare}
                  disabled={saving}
                  className="px-4 py-3 rounded-xl bg-secondary text-secondary-foreground border border-border hover:border-primary/30 transition-colors"
                >
                  <Share2 size={16} />
                </button>
              </div>

              {/* List as upcycled CTA */}
              <button
                onClick={() => navigate(`/marketplace/new?waste_type=${encodeURIComponent(result.material || result.name)}`)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-category-upcycle/15 text-category-upcycle border border-category-upcycle/20 font-display font-bold text-sm hover:bg-category-upcycle/25 transition-colors"
              >
                <ShoppingBag size={16} />
                List This as Upcycled
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ShareScanModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        scanId={savedScanId}
        itemName={result?.name || ""}
      />
    </>
  );
};

export default ResultSheet;
