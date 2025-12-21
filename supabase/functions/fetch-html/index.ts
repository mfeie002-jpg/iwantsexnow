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
    const { url } = await req.json();

    if (!url) {
      throw new Error("URL is required");
    }

    // Fetch the raw HTML
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; WebAnalyzerBot/1.0)",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();

    // Extract meta tags
    const metaTags: Record<string, string> = {};
    const metaRegex = /<meta\s+([^>]+)>/gi;
    let match;

    while ((match = metaRegex.exec(html)) !== null) {
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

    while ((match = headingRegex.exec(html)) !== null) {
      headings.push({
        level: match[1].toUpperCase(),
        text: match[2].replace(/<[^>]+>/g, "").trim(),
      });
    }

    // Extract links
    const links: { href: string; text: string; isExternal: boolean }[] = [];
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1[^>]*>(.*?)<\/a>/gi;
    const baseUrl = new URL(url);

    while ((match = linkRegex.exec(html)) !== null) {
      const href = match[2];
      const text = match[3].replace(/<[^>]+>/g, "").trim();

      try {
        const linkUrl = new URL(href, url);
        links.push({
          href: linkUrl.href,
          text,
          isExternal: linkUrl.hostname !== baseUrl.hostname,
        });
      } catch {
        // Invalid URL, skip
      }
    }

    // Extract images
    const images: { src: string; alt: string }[] = [];
    const imgRegex = /<img\s+([^>]+)>/gi;

    while ((match = imgRegex.exec(html)) !== null) {
      const attrs = match[1];
      const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
      const altMatch = attrs.match(/alt=["']([^"']+)["']/i);

      if (srcMatch) {
        images.push({
          src: srcMatch[1],
          alt: altMatch ? altMatch[1] : "",
        });
      }
    }

    // Extract structured data (JSON-LD)
    const structuredData: any[] = [];
    const jsonLdRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gi;

    while ((match = jsonLdRegex.exec(html)) !== null) {
      try {
        const data = JSON.parse(match[1]);
        structuredData.push(data);
      } catch {
        // Invalid JSON, skip
      }
    }

    return new Response(
      JSON.stringify({
        html,
        metaTags,
        headings,
        links,
        images,
        structuredData,
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