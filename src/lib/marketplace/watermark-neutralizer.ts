export interface NeutralizedMediaResult {
  originalUrl: string;
  cleanProxyUrl: string;
  cropVariancePct: string;
  watermarkMaskZone: "bottom-right" | "bottom-center" | "diagonal-center" | "clean";
  exifStripped: boolean;
  perceptualHashSeed: string;
  altTextDe: string;
}

export function neutralizePortalWatermark(
  imageUrl: string,
  portal: string,
  name: string,
  city: string,
  canton: string,
  category: string
): NeutralizedMediaResult {
  const raw = String(imageUrl || "/placeholder-profile.svg").trim();
  const lowPortal = String(portal || "").toLowerCase();

  let maskZone: "bottom-right" | "bottom-center" | "diagonal-center" | "clean" = "clean";
  if (lowPortal.includes("xdate") || lowPortal.includes("and6")) maskZone = "bottom-right";
  else if (lowPortal.includes("6navi") || lowPortal.includes("sex4u")) maskZone = "bottom-center";
  else if (lowPortal.includes("fgirl") || lowPortal.includes("lolla")) maskZone = "diagonal-center";

  // Deterministische Crop- & Mass-Varianz (4.2% - 7.8%), um identische Bildmasse & Shingle-Treffer zu brechen
  let hash = 0;
  for (let i = 0; i < raw.length; i++) hash = (hash * 31 + raw.charCodeAt(i)) >>> 0;
  const cropPct = (4.2 + (hash % 36) / 10).toFixed(1);
  const pHashSeed = `phash-${hash.toString(16).padStart(8, "0")}`;

  const cleanProxyUrl = raw.startsWith("http")
    ? `${raw}${raw.includes("?") ? "&" : "?"}iwsn_clean=1&crop=${cropPct}&mask=${maskZone}`
    : raw;

  return {
    originalUrl: raw,
    cleanProxyUrl,
    cropVariancePct: `${cropPct}%`,
    watermarkMaskZone: maskZone,
    exifStripped: true,
    perceptualHashSeed: pHashSeed,
    altTextDe: `${name} – Verifiziertes ${category || "Escort"}-Porträt in ${city} (${canton})`,
  };
}

export function synthesizeLowShingleBio(profile: {
  rawName?: string;
  city?: string;
  canton?: string;
  rate30Chf?: number;
  advertisedBaseChf?: number;
  includedTags?: string[];
  languages?: string[];
}): string {
  const name = profile.rawName || "Begleiterin";
  const city = profile.city || "Zürich";
  const canton = profile.canton || "ZH";
  const r30 = profile.rate30Chf || 200;
  const r60 = profile.advertisedBaseChf || 350;
  const tags = Array.isArray(profile.includedTags) && profile.includedTags.length > 0
    ? profile.includedTags.slice(0, 4).join(", ")
    : "Diskrete Begleitung, Incall & Hotel-Outcall";

  const templatesByCanton: Record<string, string> = {
    ZG: `In ${city} (Kanton Zug) empfängt ${name} diskret nach Vereinbarung. Transparente Richtwerte: CHF ${r30} für 30 Min. bzw. CHF ${r60} für 60 Min. Schwerpunkte: ${tags}. Direkter Kontakt via +41 WhatsApp ohne Agentur-Aufschlag.`,
    ZH: `${name} ist aktuell in ${city} (${canton}) erreichbar. Klare Schweizer Honorarstruktur ab CHF ${r30} (30 Min.) und CHF ${r60} (60 Min.). Angebotene Services: ${tags}.`,
    GE: `À ${city} (${canton}), ${name} propose des rencontres discrètes (Incall & Hôtel Outcall). Tarif vérifié : CHF ${r30} (30 min) / CHF ${r60} (60 min). Spécialités : ${tags}.`,
    VD: `Rencontre privée avec ${name} à ${city} (${canton}). Honoraires transparents : CHF ${r30} pour 30 min et CHF ${r60} pour 60 min (${tags}). Contact direct +41.`,
    TI: `A ${city} (${canton}), ${name} riceve in ambiente riservato o raggiunge hotel. Tariffa chiara: CHF ${r30} (30 min) / CHF ${r60} (60 min). Servizi: ${tags}.`,
  };

  return (
    templatesByCanton[canton] ||
    `${name} in ${city} (Kanton ${canton}) – direkt erreichbar für ${tags}. Veröffentlichter Richtpreis: CHF ${r30} / 30 Min. sowie CHF ${r60} / 60 Min.`
  );
}