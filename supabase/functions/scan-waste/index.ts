import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { image } = await req.json();
    if (!image) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert waste identification and environmental science AI. Analyze images of waste items and return structured JSON data. You MUST respond with ONLY valid JSON, no markdown, no code blocks, no explanation text.

Return this exact JSON structure:
{
  "name": "specific item name",
  "confidence": 85,
  "category": "Recyclable",
  "material": "material type",
  "wasteScore": 75,
  "disposalSteps": ["step 1", "step 2", "step 3"],
  "upcycleIdeas": [
    {"title": "idea name", "difficulty": "Easy", "time": "15 min"},
    {"title": "idea name", "difficulty": "Medium", "time": "30 min"},
    {"title": "idea name", "difficulty": "Hard", "time": "1 hour"}
  ],
  "impact": {
    "co2": "95g",
    "water": "1.2L",
    "readable": "Human readable impact statement"
  }
}

Rules:
- "category" must be one of: "Recyclable", "Compostable", "Hazardous", "Landfill", "Upcyclable"
- "confidence" is 0-100 integer
- "wasteScore" is 0-100 (higher = more eco-friendly disposal available)
- Provide 3-5 disposal steps
- Provide exactly 3 upcycle ideas with varying difficulty
- Impact data should be realistic estimates
- If the image doesn't contain a clear waste item, still identify what you see and categorize it appropriately`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Identify this waste item. Return ONLY the JSON object, nothing else."
              },
              {
                type: "image_url",
                image_url: { url: image }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) throw new Error("No content in AI response");

    // Parse the JSON from the response, stripping any markdown code blocks
    let cleanContent = content.trim();
    if (cleanContent.startsWith("```")) {
      cleanContent = cleanContent.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const result = JSON.parse(cleanContent);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("scan-waste error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
