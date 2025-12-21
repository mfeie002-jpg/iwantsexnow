import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ANALYSIS_PROMPT = `You are an expert website analyzer. Analyze this website and provide a comprehensive report.

Focus on:
1. TOP 3 Conversion Killers - Critical issues preventing conversions
2. Quick Wins - Easy improvements with high impact
3. SEO Problems - Search engine optimization issues
4. Mobile UX Issues - Mobile user experience problems
5. Prioritized Action Plan - Step-by-step improvements

Format your response in clear Markdown with actionable insights.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { url, screenshotUrl, html, projectName, projectDescription } = await req.json();

    if (!url) {
      throw new Error("URL is required");
    }

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      throw new Error("Lovable API key not configured");
    }

    // Prepare context for AI
    const context = `
Website URL: ${url}
${projectName ? `Project Name: ${projectName}` : ""}
${projectDescription ? `Project Description: ${projectDescription}` : ""}

Screenshot: ${screenshotUrl || "Not available"}
HTML Preview: ${html ? html.substring(0, 5000) : "Not available"}
`;

    // Call Lovable AI API
    const response = await fetch("https://api.lovable.dev/v1/analyze", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: ANALYSIS_PROMPT,
        context,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Lovable AI API error: ${error}`);
    }

    const data = await response.json();
    const analysis = data.response || data.analysis || "";

    return new Response(
      JSON.stringify({
        analysis,
        timestamp: new Date().toISOString(),
      }),
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