import { requireEdgeAdmin } from "../_shared/admin.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EXTRACTION_PROMPT = `You are an expert at analyzing websites and extracting key project information.

Analyze this website and extract the following information in JSON format:

{
  "projectName": "Name of the website/company",
  "description": "Brief description of what the site/business does (2-3 sentences)",
  "goals": "Primary business goals or objectives (3-5 bullet points)",
  "targetAudience": "Who is the target audience? (demographics, interests)",
  "competitors": ["List 3-5 direct competitors (just domain names)"]
}

Be concise and factual. If information is unclear, make reasonable inferences based on the content.`;

serve(async (req) => {
  const denied = await requireEdgeAdmin(req);
  if (denied) return denied;
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { url, html } = await req.json();

    if (!url) {
      throw new Error("URL is required");
    }

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      throw new Error("Lovable API key not configured");
    }

    const context = `
Website URL: ${url}
HTML Preview: ${html ? html.substring(0, 3000) : "Not available"}
`;

    // Call Lovable AI API
    const response = await fetch("https://api.lovable.dev/v1/analyze", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: EXTRACTION_PROMPT,
        context,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Lovable AI API error: ${error}`);
    }

    const data = await response.json();
    const extractedText = data.response || data.analysis || "";

    // Try to parse JSON from the response
    let extractedInfo;
    try {
      // Look for JSON in the response
      const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedInfo = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      // Fallback: extract basic info from HTML
      extractedInfo = {
        projectName: url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0],
        description: "Unable to extract automatically. Please fill in manually.",
        goals: "Please specify your goals",
        targetAudience: "Please specify your target audience",
        competitors: [],
      };
    }

    return new Response(
      JSON.stringify(extractedInfo),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});