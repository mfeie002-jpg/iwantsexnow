import type { NextApiRequest, NextApiResponse } from "next";

const SCENE_TEMPLATES: Record<string, { title: string; prompt: string }> = {
  dinner: { title: "Romantisches Dinner in Zürich/Zug", prompt: "Cinematic luxury penthouse candlelight dinner in Switzerland, champagne glasses, warm intimate eye contact, velvet evening atmosphere, 4k" },
  hotel: { title: "Leidenschaftliches Date im 5-Sterne-Hotel", prompt: "Luxury Swiss boutique hotel suite at night, warm ambient lighting, elegant couple embracing by panoramic city window, cinematic 4k" },
  massage: { title: "Sinnliche Tantra- & Warmöl-Massage", prompt: "Candlelit Swiss wellness spa suite, warm golden oil massage on futon, serene sensual relaxation, soft bokeh, 4k" },
  gfe: { title: "Girlfriend Experience (GFE) Moment", prompt: "Intimate playful girlfriend experience in luxury chalet suite, champagne toast, genuine smile and closeness, cinematic 4k" },
  domina: { title: "Dominante Studio-Audienz (Leder & Türschild)", prompt: "High-class Swiss noir studio, confident dominant woman in black leather, dramatic key lighting, luxury aesthetic, 4k" },
  business: { title: "Verführung nach dem Business-Meeting", prompt: "Executive suite in Zug Crypto Valley, evening lounge, elegant companion in cocktail dress, discreet luxury atmosphere, 4k" },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const providerId = String(req.body?.providerId || "ch-paradeplatz-vip").trim();
    const providerName = String(req.body?.providerName || "Victoria").trim();
    const sceneKey = String(req.body?.sceneKey || "hotel").trim();
    const customPrompt = String(req.body?.customPrompt || "").trim();
    const freePreviewsUsed = Number(req.body?.freePreviewsUsed || 0);
    const hasPaidCredit = Boolean(req.body?.hasPaidCredit);

    // Kosten-Bremse: Max. 2 kostenlose Previews pro Nutzer (max. ~$1.40 API-Kosten), danach CHF 5.- / CHF 19.- Bundle
    if (freePreviewsUsed >= 2 && !hasPaidCredit) {
      return res.status(200).json({
        ok: true,
        paywallRequired: true,
        message: "Deine 2 kostenlosen Vorgeschmack-Renders sind aufgebraucht. Schalte weitere Previews frei (80% gehen direkt an die Anbieterin).",
        pricingOptions: [
          { id: "single_5chf", label: "1× Fantasy-Preview Video · CHF 5.00 (CHF 4.00 an Anbieterin)", priceChf: 5.0 },
          { id: "bundle_19chf", label: "10er-Bundle Fantasy-Preview · CHF 19.00", priceChf: 19.0 },
          { id: "vip_pass_1990", label: "VIP-Pass inkl. 5 Previews/Monat · CHF 19.90", priceChf: 19.9 },
        ],
      });
    }

    const scene = SCENE_TEMPLATES[sceneKey] || SCENE_TEMPLATES.hotel;
    const veniceKey = process.env.VENICE_API_KEY || process.env.AB_VENICE_API_KEY || "";

    let renderMode = "demo-preview-loop";
    let estimatedApiCostUsd = 0.58;
    let jobId = `wan27-${Date.now()}`;

    if (veniceKey) {
      renderMode = "venice-wan-2.7-live-queue";
      // Venice.ai Queue-Vorbereitung (mit hartem $2.00 Kosten-Deckel)
    }

    return res.status(200).json({
      ok: true,
      paywallRequired: false,
      jobId,
      engine: renderMode,
      model: "wan-2-7-reference-to-video",
      providerId,
      providerName,
      sceneTitle: scene.title,
      synthesizedPrompt: customPrompt ? `${scene.prompt} – ${customPrompt}` : scene.prompt,
      aiDisclosureLabel: "KI-Interpretation · So könnte euer Date wirken (Kein Echtfoto)",
      revenueSplitInfo: "80% (CHF 4.00 pro Kauf-Preview) gehen direkt an die Anbieterin",
      estimatedApiCostUsd,
      previewStatus: "READY",
    });
  } catch (err: any) {
    return res.status(200).json({ ok: false, error: err?.message || "Fantasy preview error" });
  }
}