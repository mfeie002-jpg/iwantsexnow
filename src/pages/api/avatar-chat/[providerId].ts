import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const providerId = String(req.query.providerId || req.body?.providerId || "default").trim();
    const action = String(req.body?.action || "chat").trim();
    const message = String(req.body?.message || "").trim();
    const messageIndex = Number(req.body?.messageIndex || 0);
    const unlocked = Boolean(req.body?.unlocked);
    const archetypeKey = String(req.body?.archetype || "seductress").trim();
    const wantVoice = Boolean(req.body?.wantVoice);

    const dataPath = path.join(process.cwd(), "src", "data", "provider-avatars.json");
    const store = fs.existsSync(dataPath) ? JSON.parse(fs.readFileSync(dataPath, "utf8")) : { archetypes: {}, licensedAvatars: [] };

    // Update 9: 1-Klick Lizenz-Opt-Out / Opt-In Steuerung für Anbieterinnen
    if (action === "toggle_opt_out") {
      const optOut = Boolean(req.body?.optOut);
      const list = Array.isArray(store.licensedAvatars) ? store.licensedAvatars : [];
      const found = list.find((a: any) => a.providerId === providerId);
      if (found) {
        found.licenseConsent.optOutActive = optOut;
        found.licenseConsent.updatedAt = new Date().toISOString();
      } else {
        list.push({
          providerId,
          name: String(req.body?.name || "Anbieterin"),
          archetype: archetypeKey,
          licenseConsent: {
            optInConfirmed: !optOut,
            optOutActive: optOut,
            revenueSplitAccepted: "80/20",
            aiLabelVisible: true,
            updatedAt: new Date().toISOString(),
          },
        });
      }
      store.licensedAvatars = list;
      fs.writeFileSync(dataPath, JSON.stringify(store, null, 2), "utf8");
      return res.status(200).json({
        ok: true,
        providerId,
        optOutActive: optOut,
        message: optOut
          ? "Dein KI-Avatar und Fantasy-Preview wurden sofort deaktiviert (1-Klick Opt-Out aktiv)."
          : "Dein KI-Avatar ist aktiv (80% Umsatzbeteiligung auf alle Chats & Previews).",
      });
    }

    const avatarProfile = (store.licensedAvatars || []).find((a: any) => a.providerId === providerId);
    if (avatarProfile?.licenseConsent?.optOutActive) {
      return res.status(200).json({
        ok: false,
        optOutActive: true,
        text: "Diese Anbieterin nutzt ausschliesslich den direkten +41 WhatsApp-Kontakt (KI-Avatar deaktiviert).",
      });
    }

    const arch = store.archetypes?.[avatarProfile?.archetype || archetypeKey] || store.archetypes?.seductress || {
      label: "Die Verführerin",
      openingDe: "Schön, dass du auf meinem Profil bist. Wollen wir schauen, ob die Chemie zwischen uns stimmt?",
      lockedTeaserDe: "Schalte 10 weitere Nachrichten für CHF 2.50 frei oder kontaktiere mich direkt per WhatsApp. 🔒",
      quickReplies: ["Heute Abend frei?", "Honorar 30/60 Min.?", "Hotelbesuch möglich?"],
    };

    // Paywall-Gate nach 4 kostenlosen Nachrichten (Update 4 Monetarisierung)
    if (messageIndex >= 4 && !unlocked) {
      return res.status(200).json({
        ok: true,
        locked: true,
        aiDisclosure: "KI-Interpretation · 80% Erlösanteil direkt an die Anbieterin",
        text: arch.lockedTeaserDe,
        unlockOptions: [
          { id: "pack10", label: "10 Nachrichten freischalten · CHF 2.50", priceChf: 2.5 },
          { id: "flat_month", label: "Unbegrenzte Avatar-Flatrate · CHF 9.90 / Monat", priceChf: 9.9 },
        ],
        quickReplies: arch.quickReplies,
      });
    }

    const pName = avatarProfile?.name || String(req.body?.providerName || "Sofia");
    const pCity = avatarProfile?.city || String(req.body?.city || "Zürich / Zug");
    const r30 = avatarProfile?.pricesChf?.["30m"] || 200;
    const r60 = avatarProfile?.pricesChf?.["60m"] || 350;

    let replyText = arch.openingDe;
    const lowMsg = message.toLowerCase();
    if (lowMsg.includes("honorar") || lowMsg.includes("preis") || lowMsg.includes("chf") || lowMsg.includes("30") || lowMsg.includes("60")) {
      replyText = `Bei mir gibt es keine versteckten Agentur-Gebühren: 30 Min. liegen bei CHF ${r30}.– und 60 Min. bei CHF ${r60}.– in ${pCity}. Magst du lieber zu mir ins diskrete Apartment kommen oder soll ich dich im Hotel besuchen?`;
    } else if (lowMsg.includes("hotel") || lowMsg.includes("park") || lowMsg.includes("wo")) {
      replyText = `Ich empfange dich absolut diskret in ${pCity} (eigener Zugang) oder komme direkt zu dir ins Hotel. Sollen wir kurz ein 5-Sekunden Fantasy-Preview von uns beiden starten oder direkt auf WhatsApp wechseln?`;
    } else if (lowMsg.includes("frei") || lowMsg.includes("heute") || lowMsg.includes("termin")) {
      replyText = `Heute Abend habe ich noch ein Zeitfenster ab 19:30 Uhr in ${pCity} frei. Klick unten auf WhatsApp, dann reserviere ich die Zeit nur für dich.`;
    } else if (message) {
      replyText = `Das gefällt mir an dir – direkt und ohne Umwege. In ${pCity} nehme ich mir ohne Zeitdruck Zeit für dich (CHF ${r60} / 60 Min.). Willst du vorab ein KI-Preview von uns sehen oder direkt schreiben?`;
    }

    // Optionaler ElevenLabs Voice-Abruf (Update 4), falls ELEVENLABS_API_KEY / AB_ELEVENLABS_API_KEY vorhanden
    let audioBase64: string | null = null;
    const elevenKey = process.env.ELEVENLABS_API_KEY || process.env.AB_ELEVENLABS_API_KEY || "";
    if (wantVoice && elevenKey) {
      try {
        const voiceId = avatarProfile?.elevenLabsVoiceId || "EXAVITQu4vr4xnSDxMaL";
        const ttsRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": elevenKey,
          },
          body: JSON.stringify({
            text: replyText.slice(0, 220),
            model_id: "eleven_multilingual_v2",
          }),
        });
        if (ttsRes.ok) {
          const arrBuf = await ttsRes.arrayBuffer();
          audioBase64 = `data:audio/mpeg;base64,${Buffer.from(arrBuf).toString("base64")}`;
        }
      } catch {}
    }

    return res.status(200).json({
      ok: true,
      locked: false,
      providerId,
      archetypeLabel: arch.label,
      aiDisclosure: "KI-Interpretation · 80% an Anbieterin · 1-Klick Opt-Out jederzeit aktiv",
      text: replyText,
      audioDataUrl: audioBase64,
      voiceReady: Boolean(elevenKey),
      quickReplies: arch.quickReplies,
    });
  } catch (err: any) {
    return res.status(200).json({ ok: false, error: err?.message || "Avatar API error" });
  }
}