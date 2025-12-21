import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { url, strategy = "mobile" } = await req.json();

    if (!url) {
      throw new Error("URL is required");
    }

    // Google PageSpeed Insights API
    const apiKey = Deno.env.get("GOOGLE_PAGESPEED_API_KEY");
    const apiUrl = apiKey
      ? `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&key=${apiKey}`
      : `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`PageSpeed API error: ${error}`);
    }

    const data = await response.json();

    // Extract key metrics
    const lighthouseResult = data.lighthouseResult;
    const categories = lighthouseResult?.categories || {};
    const audits = lighthouseResult?.audits || {};

    const results = {
      url,
      strategy,
      scores: {
        performance: Math.round((categories.performance?.score || 0) * 100),
        accessibility: Math.round((categories.accessibility?.score || 0) * 100),
        bestPractices: Math.round((categories["best-practices"]?.score || 0) * 100),
        seo: Math.round((categories.seo?.score || 0) * 100),
      },
      metrics: {
        firstContentfulPaint: audits["first-contentful-paint"]?.displayValue || "N/A",
        largestContentfulPaint: audits["largest-contentful-paint"]?.displayValue || "N/A",
        totalBlockingTime: audits["total-blocking-time"]?.displayValue || "N/A",
        cumulativeLayoutShift: audits["cumulative-layout-shift"]?.displayValue || "N/A",
        speedIndex: audits["speed-index"]?.displayValue || "N/A",
      },
      opportunities: Object.entries(audits)
        .filter(([_, audit]: [string, any]) => 
          audit.score !== null && 
          audit.score < 0.9 && 
          audit.details?.type === "opportunity"
        )
        .map(([key, audit]: [string, any]) => ({
          id: key,
          title: audit.title,
          description: audit.description,
          score: Math.round((audit.score || 0) * 100),
          displayValue: audit.displayValue,
        }))
        .slice(0, 10),
      fetchTime: new Date().toISOString(),
    };

    return new Response(
      JSON.stringify(results),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error.message,
        scores: { performance: 0, accessibility: 0, bestPractices: 0, seo: 0 },
        metrics: {},
        opportunities: [],
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});