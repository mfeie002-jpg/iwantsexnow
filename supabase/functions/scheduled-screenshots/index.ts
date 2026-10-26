import { requireEdgeAdmin } from "../_shared/admin.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// List of important URLs to monitor
const MONITORED_URLS = [
  "https://iwantsexnow.ch",
  "https://iwantsexnow.ch/escort-zurich",
  "https://iwantsexnow.ch/escort-geneva",
  "https://iwantsexnow.ch/escort-basel",
  "https://iwantsexnow.ch/escort-bern",
  "https://iwantsexnow.ch/escort-lausanne",
  "https://iwantsexnow.ch/premium",
  "https://iwantsexnow.ch/pricing",
  "https://iwantsexnow.ch/members",
  "https://iwantsexnow.ch/profile",
  "https://iwantsexnow.ch/register",
  "https://iwantsexnow.ch/login",
  "https://iwantsexnow.ch/safety",
  "https://iwantsexnow.ch/faq",
  "https://iwantsexnow.ch/about",
  "https://iwantsexnow.ch/content-feed",
  "https://iwantsexnow.ch/matches",
  "https://iwantsexnow.ch/stories",
  "https://iwantsexnow.ch/events",
  "https://iwantsexnow.ch/gifts",
];

serve(async (req) => {
  const denied = await requireEdgeAdmin(req);
  if (denied) return denied;
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const firecrawlApiKey = Deno.env.get("FIRECRAWL_API_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase credentials not configured");
    }

    if (!firecrawlApiKey) {
      throw new Error("Firecrawl API key not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const results = {
      total: MONITORED_URLS.length,
      successful: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Capture screenshots for all URLs
    for (const url of MONITORED_URLS) {
      try {
        // Capture screenshot via Firecrawl
        const screenshotResponse = await fetch("https://api.firecrawl.dev/v1/screenshot", {
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
                width: 1920,
                height: 1080,
              },
              fullPage: false,
            },
          }),
        });

        if (!screenshotResponse.ok) {
          throw new Error(`Screenshot failed for ${url}`);
        }

        const screenshotData = await screenshotResponse.json();
        const screenshotUrl = screenshotData.screenshot || screenshotData.data?.screenshot;

        if (!screenshotUrl) {
          throw new Error(`No screenshot URL returned for ${url}`);
        }

        // Download the screenshot
        const imageResponse = await fetch(screenshotUrl);
        const imageBlob = await imageResponse.blob();
        const imageBuffer = await imageBlob.arrayBuffer();

        // Generate filename
        const timestamp = new Date().toISOString().split("T")[0];
        const urlSlug = url.replace(/https?:\/\//, "").replace(/[^a-z0-9]/gi, "-");
        const filename = `${timestamp}-${urlSlug}.png`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("screenshots-archive")
          .upload(filename, imageBuffer, {
            contentType: "image/png",
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        // Update scheduled_screenshot_history table
        const { error: dbError } = await supabase
          .from("scheduled_screenshot_history")
          .insert({
            scheduled_url_id: null, // Can be linked to scheduled_screenshot_urls if needed
            screenshot_url: screenshotUrl,
            storage_path: filename,
            status: "success",
            captured_at: new Date().toISOString(),
          });

        if (dbError) {
          console.error("Database error:", dbError);
        }

        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push(`${url}: ${error.message}`);
        console.error(`Error capturing ${url}:`, error);
      }
    }

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
        total: MONITORED_URLS.length,
        successful: 0,
        failed: MONITORED_URLS.length,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});