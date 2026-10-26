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
    const { url } = await req.json();

    if (!url) {
      throw new Error("URL is required");
    }

    const firecrawlApiKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!firecrawlApiKey) {
      throw new Error("Firecrawl API key not configured");
    }

    // Use Firecrawl's scrape API to get rendered HTML
    const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${firecrawlApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        formats: ["html"],
        options: {
          waitFor: 3000, // Wait 3 seconds for JS to render
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Firecrawl API error: ${error}`);
    }

    const data = await response.json();
    const renderedHtml = data.html || data.data?.html || "";

    // Extract meta tags from rendered HTML
    const metaTags: Record<string, string> = {};
    const metaRegex = /<meta\s+([^>]+)>/gi;
    let match;

    while ((match = metaRegex.exec(renderedHtml)) !== null) {
      const attrs = match[1];
      const nameMatch = attrs.match(/(?:name|property)=["']([^"']+)["']/i);
      const contentMatch = attrs.match(/content=["']([^"']+)["']/i);

      if (nameMatch && contentMatch) {
        metaTags[nameMatch[1]] = contentMatch[1];
      }
    }

    // Extract headings
    const headings: { level: string; text: string }[] = [];
    const headingRegex = /<(h[1-6])(?:[^>]*)>(.*?)<\/\1>/gi;

    while ((match = headingRegex.exec(renderedHtml)) !== null) {
      headings.push({
        level: match[1].toUpperCase(),
        text: match[2].replace(/<[^>]+>/g, "").trim(),
      });
    }

    return new Response(
      JSON.stringify({
        html: renderedHtml,
        metaTags,
        headings,
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