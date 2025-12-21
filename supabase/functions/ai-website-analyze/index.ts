import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ANALYSIS_PROMPT = `You are an expert website analyzer. Analyze this website comprehensively and provide a detailed, actionable report.

Your analysis should include:

## EXECUTIVE SUMMARY
Brief overview of the website's current state and biggest opportunities.

## TOP 5 CRITICAL ISSUES
List the most severe problems that are actively hurting the business:
1. Issue name - Impact description - Estimated revenue loss
2. ...

## QUICK WINS (30-Day Plan)
Easy improvements with high ROI that can be done in the next 30 days:
- Action item (Effort: Low/Medium/High, Impact: Low/Medium/High)
- ...

## SEO ANALYSIS
- Meta tags quality
- Heading structure (H1-H6)
- Content optimization
- Mobile-friendliness
- Page speed insights
- Technical SEO issues

## UX/UI PROBLEMS
- Navigation issues
- Call-to-action effectiveness
- Visual hierarchy
- Mobile responsiveness
- Conversion blockers

## SECURITY & TRUST
- SSL/HTTPS status
- Trust signals present/missing
- Privacy policy
- Contact information visibility

## PRIORITIZED ACTION PLAN
Organize all recommendations by priority:

### P0 - Critical (Fix Immediately)
- [ ] Issue description (Hours: X, Cost estimate: $Y)

### P1 - High Priority (This Month)
- [ ] Issue description (Hours: X, Cost estimate: $Y)

### P2 - Medium Priority (Next Quarter)
- [ ] Issue description (Hours: X, Cost estimate: $Y)

### P3 - Nice to Have (Future)
- [ ] Issue description (Hours: X, Cost estimate: $Y)

## BUSINESS IMPACT ESTIMATE
- Current monthly revenue loss: $X
- Projected revenue increase after fixes: $Y
- Total implementation cost: $Z
- Expected ROI: X%
- Payback period: X months

Format your response in clean, actionable Markdown.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { url, screenshotUrl, html, projectName, projectDescription, pageCount = 5, urls = [] } = await req.json();

    if (!url) {
      throw new Error("URL is required");
    }

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      throw new Error("Lovable API key not configured");
    }

    // Build context for multi-page analysis
    let contextPages = "";
    if (urls && urls.length > 0) {
      contextPages = `\n\nAnalyzing ${urls.length} pages:\n` + urls.map((u: string, i: number) => `${i + 1}. ${u}`).join("\n");
    } else {
      contextPages = `\n\nAnalyzing homepage only: ${url}`;
    }

    // Prepare context for AI
    const context = `
Website URL: ${url}
${projectName ? `Project Name: ${projectName}` : ""}
${projectDescription ? `Project Description: ${projectDescription}` : ""}
${contextPages}

Screenshot: ${screenshotUrl || "Not available"}
HTML Preview: ${html ? html.substring(0, 5000) : "Not available"}

Please provide a comprehensive analysis focusing on business impact and actionable recommendations.
`;

    console.log(`[AI Analysis] Starting analysis for ${url} with ${pageCount} pages`);

    // Call Lovable AI API with retry logic
    let attempt = 0;
    let lastError = null;
    const maxRetries = 3;

    while (attempt < maxRetries) {
      try {
        const response = await fetch("https://api.lovable.dev/v1/analyze", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${lovableApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: ANALYSIS_PROMPT,
            context,
            max_tokens: 4000,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          
          // Handle rate limit (429)
          if (response.status === 429) {
            console.warn(`[AI Analysis] Rate limit hit, attempt ${attempt + 1}/${maxRetries}`);
            lastError = new Error("Rate limit exceeded. Please try again in a few moments.");
            
            if (attempt < maxRetries - 1) {
              // Exponential backoff: 2s, 4s, 8s
              const waitTime = Math.pow(2, attempt + 1) * 1000;
              console.log(`[AI Analysis] Waiting ${waitTime}ms before retry...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
              attempt++;
              continue;
            }
          }
          
          // Handle credit exhaustion (402)
          if (response.status === 402) {
            throw new Error("AI analysis credits exhausted. Please contact support or try again later.");
          }
          
          throw new Error(`Lovable AI API error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        const analysis = data.response || data.analysis || "";

        if (!analysis) {
          throw new Error("No analysis returned from AI");
        }

        console.log(`[AI Analysis] Successfully completed analysis (${analysis.length} chars)`);

        return new Response(
          JSON.stringify({
            analysis,
            timestamp: new Date().toISOString(),
            pageCount: urls.length || 1,
            url,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );

      } catch (fetchError) {
        lastError = fetchError;
        console.error(`[AI Analysis] Attempt ${attempt + 1} failed:`, fetchError);
        
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          attempt++;
          continue;
        }
      }
    }

    // All retries failed
    throw lastError || new Error("AI analysis failed after multiple attempts");

  } catch (error) {
    console.error("[AI Analysis] Fatal error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Analysis failed",
        timestamp: new Date().toISOString(),
      }),
      {
        status: error.message.includes("Rate limit") ? 429 : 
                error.message.includes("credits exhausted") ? 402 : 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});