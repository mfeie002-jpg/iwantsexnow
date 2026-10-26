import { requireEdgeAdmin } from "../_shared/admin.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  const denied = await requireEdgeAdmin(req);
  if (denied) return denied;
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { url, limit = 50 } = await req.json();

    if (!url) {
      throw new Error("URL is required");
    }

    const firecrawlApiKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!firecrawlApiKey) {
      throw new Error("Firecrawl API key not configured");
    }

    // Use Firecrawl's map API to discover URLs
    const response = await fetch("https://api.firecrawl.dev/v1/map", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${firecrawlApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        options: {
          limit,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Firecrawl API error: ${error}`);
    }

    const data = await response.json();
    const urls = data.links || data.data?.links || [];

    return new Response(
      JSON.stringify({
        urls,
        totalCount: urls.length,
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