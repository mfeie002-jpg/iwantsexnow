import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body || {};
  const priceChf = Number(body.priceChf || 29);
  const providerShareChf = Math.round(priceChf * 0.8);
  const platformFeeChf = priceChf - providerShareChf;
  const unlockRef = `PPV-${Math.floor(100000 + Math.random() * 900000)}`;

  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChatId = process.env.TELEGRAM_CHAT_ID;

  if (tgToken && tgChatId) {
    try {
      const text = [
        `💎 *iWantSexNow.ch · Locked VIP Content verkauft!*`,
        `*Ref:* \`${unlockRef}\``,
        `*Anbieterin:* ${body.providerName || "Sophia"}`,
        `*Medium:* ${body.itemTitle || "VIP Video/Foto-Set"}`,
        `*Verkaufspreis:* CHF ${priceChf}.00`,
        `*Dein 20% Plattform-Gewinn:* *CHF ${platformFeeChf}.00*`,
        `*80% Provider-Gutschrift:* CHF ${providerShareChf}.00`,
      ].join("\n");

      await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: tgChatId,
          text,
          parse_mode: "Markdown",
        }),
      });
    } catch {
      // non-blocking
    }
  }

  return res.status(200).json({
    status: "ok",
    unlockRef,
    priceChf,
    providerShareChf,
    platformFeeChf,
    unlockedAt: new Date().toISOString(),
  });
}