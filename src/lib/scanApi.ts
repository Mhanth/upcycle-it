import { supabase } from "@/integrations/supabase/client";
import type { ScanResult } from "@/components/Results/ResultSheet";

export async function scanWasteImage(imageBase64: string): Promise<ScanResult> {
  const { data, error } = await supabase.functions.invoke("scan-waste", {
    body: { image: imageBase64 },
  });

  if (error) {
    console.error("Scan error:", error);
    throw new Error(error.message || "Failed to scan image");
  }

  // Validate the response has required fields
  if (!data?.name || !data?.category) {
    throw new Error("Invalid scan result from AI");
  }

  return {
    name: data.name,
    confidence: data.confidence ?? 80,
    category: data.category,
    material: data.material ?? "Unknown",
    wasteScore: data.wasteScore ?? 50,
    disposalSteps: data.disposalSteps ?? ["Dispose of properly"],
    upcycleIdeas: data.upcycleIdeas ?? [],
    impact: data.impact ?? { co2: "N/A", water: "N/A", readable: "Impact data unavailable" },
  };
}
