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

/**
 * Persists an incoming enquiry to Supabase via REST API (zero extra npm dependencies required)
 * and dispatches an instant Telegram / Webhook alert if configured.
 */
export async function persistEnquiryAndNotify(record: EnquiryRecord): Promise<{
  persistedToSupabase: boolean;
  telegramSent: boolean;
}> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let persistedToSupabase = false;
  let telegramSent = false;

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

  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChatId = process.env.TELEGRAM_CHAT_ID;

  if (tgToken && tgChatId) {
    try {
      const text = [
        `🛡 *iWantSexNow.ch · Neue Fixpreis-Anfrage*`,
        `*Ref:* \`${record.referenceCode}\``,
        `*Provider:* ${record.providerName}`,
        `*Ort:* ${record.city}`,
        `*Zeit:* ${record.requestedTime}`,
        `*Dauer & Extras:* ${record.duration} Min. (${record.extras.join(", ") || "Standard"})`,
        `*Garantierter Endpreis:* CHF ${record.guaranteedTotalChf}`,
        `*Kunden-Kontakt:* \`${record.contact}\``,
      ].join("\n");

      const tgRes = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: tgChatId,
          text,
          parse_mode: "Markdown",
        }),
      });
      telegramSent = tgRes.ok;
    } catch {
      telegramSent = false;
    }
  }

  return { persistedToSupabase, telegramSent };
}