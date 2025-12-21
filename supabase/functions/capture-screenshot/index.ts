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
    const { url, viewportWidth = 1920, viewportHeight = 1080, waitFor = 0, fullPage = false } = await req.json();

    if (!url) {
      throw new Error("URL is required");
    }

    const firecrawlApiKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!firecrawlApiKey) {
      throw new Error("Firecrawl API key not configured");
    }

    // Use Firecrawl's screenshot API
    const response = await fetch("https://api.firecrawl.dev/v1/screenshot", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${firecrawlApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        formats: ["png"],
        options: {
          viewport: {
            width: viewportWidth,
            height: viewportHeight,
          },
          waitFor: waitFor * 1000,
          fullPage,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Firecrawl API error: ${error}`);
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({
        screenshotUrl: data.screenshot || data.data?.screenshot,
        viewportWidth,
        viewportHeight,
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