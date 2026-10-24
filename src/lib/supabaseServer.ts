export interface EnquiryRecord {
  referenceCode: string;
  providerName: string;
  duration: number;
  extras: string[];
  guaranteedTotalChf: number;
  requestedTime: string;
  city: string;
  contact: string;
  notes?: string;
}

export interface ClaimRecord {
  claimCode: string;
  artistName: string;
  phone: string;
  city: string;
  dailyCode?: string;
  mode: "claim" | "create" | "verify";
}

async function sendTelegramAlert(markdownLines: string[]): Promise<boolean> {
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChatId = process.env.TELEGRAM_CHAT_ID;
  if (!tgToken || !tgChatId) return false;

  try {
    const res = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: tgChatId,
        text: markdownLines.join("\n"),
        parse_mode: "Markdown",
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function persistEnquiryAndNotify(record: EnquiryRecord): Promise<{
  persistedToSupabase: boolean;
  telegramSent: boolean;
}> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let persistedToSupabase = false;

  if (supabaseUrl && supabaseKey) {
    try {
      const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/private_enquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          reference_code: record.referenceCode,
          provider_name: record.providerName,
          duration_minutes: record.duration,
          selected_extras: record.extras,
          guaranteed_total_chf: record.guaranteedTotalChf,
          requested_time: record.requestedTime,
          meeting_city: record.city,
          customer_contact: record.contact,
          notes: record.notes || "",
          status: "new",
        }),
      });
      persistedToSupabase = response.ok;
    } catch {
      persistedToSupabase = false;
    }
  }

  const telegramSent = await sendTelegramAlert([
    `🛡 *iWantSexNow.ch · Neue Fixpreis-Buchung*`,
    `*Ref:* \`${record.referenceCode}\``,
    `*Anbieterin:* ${record.providerName}`,
    `*Ort / Hotel:* ${record.city}`,
    `*Wunschzeit:* ${record.requestedTime}`,
    `*Dauer & Extras:* ${record.duration} Min. (${record.extras.join(", ") || "Basis"})`,
    `*Garantierter Endpreis:* CHF ${record.guaranteedTotalChf}`,
    `*Kunden-Kontakt:* \`${record.contact}\``,
  ]);

  return { persistedToSupabase, telegramSent };
}

export async function persistClaimAndNotify(claim: ClaimRecord): Promise<{
  persistedToSupabase: boolean;
  telegramSent: boolean;
}> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let persistedToSupabase = false;

  if (supabaseUrl && supabaseKey) {
    try {
      const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/profile_claims`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          claim_code: claim.claimCode,
          artist_name: claim.artistName,
          phone_number: claim.phone,
          city: claim.city,
          daily_verification_code: claim.dailyCode || "AUTO",
          bonus_credits_granted: 2,
          status: "pending",
        }),
      });
      persistedToSupabase = response.ok;
    } catch {
      persistedToSupabase = false;
    }
  }

  const telegramSent = await sendTelegramAlert([
    `✨ *iWantSexNow.ch · Neuer B2B Profil-Claim (${claim.mode.toUpperCase()})*`,
    `*Claim-ID:* \`${claim.claimCode}\``,
    `*Name / Studio:* ${claim.artistName}`,
    `*Rufnummer:* \`${claim.phone}\``,
    `*Region:* ${claim.city}`,
    `*Prüfcode:* \`${claim.dailyCode || "SMS-CLAIM"}\``,
    `*Start-Bonus:* 2 Gratis Lead-Credits (CHF 50) aktiviert`,
  ]);

  return { persistedToSupabase, telegramSent };
}