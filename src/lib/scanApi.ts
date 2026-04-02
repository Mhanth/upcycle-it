import { supabase } from "@/integrations/supabase/client";
import type { ScanResult } from "@/components/Results/ResultSheet";

const creditRates: Record<string, number> = {
  Recyclable: 10,
  Compostable: 8,
  Upcyclable: 12,
  Hazardous: 15,
  Landfill: 2,
};

export async function scanWasteImage(imageBase64: string): Promise<ScanResult> {
  const { data, error } = await supabase.functions.invoke("scan-waste", {
    body: { image: imageBase64 },
  });

  if (error) {
    console.error("Scan error:", error);
    throw new Error(error.message || "Failed to scan image");
  }

  if (!data?.name || !data?.category) {
    throw new Error("Invalid scan result from AI");
  }

  const result: ScanResult = {
    name: data.name,
    confidence: data.confidence ?? 80,
    category: data.category,
    material: data.material ?? "Unknown",
    wasteScore: data.wasteScore ?? 50,
    disposalSteps: data.disposalSteps ?? ["Dispose of properly"],
    upcycleIdeas: data.upcycleIdeas ?? [],
    impact: data.impact ?? { co2: "N/A", water: "N/A", readable: "Impact data unavailable" },
  };

  // Save scan and award credits if user is logged in
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const credits = creditRates[result.category] ?? 2;
      const co2Num = parseFloat(result.impact.co2) || 0;

      // Save scan history
      await supabase.from("scan_history").insert({
        user_id: user.id,
        item_name: result.name,
        category: result.category.toLowerCase() as any,
        disposal_method: result.disposalSteps.join(" → "),
        material: result.material,
        carbon_saved: co2Num,
        credits_earned: credits,
      });

      // Update carbon credits
      const today = new Date().toISOString().split("T")[0];
      const { data: existing } = await supabase
        .from("carbon_credits")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (existing) {
        const lastDate = existing.last_scan_date;
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
        let newStreak = existing.current_streak;

        if (lastDate === yesterday) {
          newStreak += 1;
        } else if (lastDate !== today) {
          newStreak = 1;
        }

        const multiplier = newStreak >= 7 ? 3 : newStreak >= 5 ? 2 : newStreak >= 3 ? 1.5 : 1;
        const finalCredits = Math.round(credits * multiplier);

        await supabase
          .from("carbon_credits")
          .update({
            total_credits: existing.total_credits + finalCredits,
            current_streak: newStreak,
            longest_streak: Math.max(existing.longest_streak, newStreak),
            last_scan_date: today,
          })
          .eq("user_id", user.id);
      }
    }
  } catch (e) {
    console.warn("Could not save scan history:", e);
  }

  return result;
}
