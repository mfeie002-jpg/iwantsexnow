import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { BrandLogo } from "@/components/BrandLogo";

export default function ReportAndTakedownPage() {
  const router = useRouter();
  const prefillName = String(router.query.name || "");
  const prefillUrl = String(router.query.url || "");

  const [mode, setMode] = useState<"opt_out" | "dmca" | "claim">("opt_out");
  const [profileName, setProfileName] = useState(prefillName);
  const [sourceUrl, setSourceUrl] = useState(prefillUrl);
  const [contact, setContact] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/vault/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: mode === "dmca" ? "dmca_takedown" : "opt_out",
        profileName,
        sourceUrl,
        contact,
        reason,
      }),
    });
    const data = await res.json();
    setSubmitted(data.entry || { id: "TD-OK" });
  };

  return (
    <div className="min-h-screen bg-[#0D1826] text-white">
      <SEO
        title="Profil-Schutz, 1-Klick Opt-Out & DMCA Meldung | iwantsexnow.ch"
        description="Eigenes Index-Profil kostenlos übernehmen (inkl. 30 Tage VIP) oder in 10 Sekunden aus dem Schweizer Suchindex ausblenden bzw. Identitätsmissbrauch (DMCA) melden."
      />
      <header className="border-b border-white/10 bg-[#08101A]/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <BrandLogo compact />
          </Link>
          <Link href="/" className="text-xs text-[#C8A97E] hover:underline">
            ← Zurück zur Startseite
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="p-6 md:p-8 rounded-3xl bg-[#111F30] border border-[#C8A97E]/40 shadow-2xl">
          <span className="px-3 py-1 rounded-full bg-[#C8A97E]/15 text-[#C8A97E] text-xs font-bold uppercase tracking-wider">
            🛡️ Schweizer Creator-Schutz · DMCA & 1-Klick Opt-Out
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold mt-3">
            Ist Ihr Profil bei uns im Index gelistet?
          </h1>
          <p className="text-sm text-gray-300 mt-2">
            Als Schweizer Suchmaschine indexieren wir öffentlich zugängliche Inserate-Metadaten. Sie haben jederzeit die 100%ige Kontrolle über Ihren Eintrag:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-6">
            <button
              type="button"
              onClick={() => setMode("claim")}
              className={`p-4 rounded-2xl border text-left transition ${
                mode === "claim"
                  ? "bg-emerald-500/20 border-emerald-400 text-white"
                  : "bg-white/5 border-white/10 text-gray-300"
              }`}
            >
              <div className="text-sm font-bold text-emerald-300">1. Kostenlos übernehmen</div>
              <div className="text-xs mt-1">
                1. Monat 100% gratis + offizieller Verifizierungs-Haken (✓) + alle gesammelten Kunden-Anfragen freischalten.
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMode("opt_out")}
              className={`p-4 rounded-2xl border text-left transition ${
                mode === "opt_out"
                  ? "bg-[#C8A97E]/20 border-[#C8A97E] text-white"
                  : "bg-white/5 border-white/10 text-gray-300"
              }`}
            >
              <div className="text-sm font-bold text-[#C8A97E]">2. In 10 Sek. ausblenden</div>
              <div className="text-xs mt-1">
                Sie möchten nicht im Schweizer Index erscheinen? Sofortige Löschung & Aufnahme auf die Do-Not-Index-Sperrliste.
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMode("dmca")}
              className={`p-4 rounded-2xl border text-left transition ${
                mode === "dmca"
                  ? "bg-rose-500/20 border-rose-400 text-white"
                  : "bg-white/5 border-white/10 text-gray-300"
              }`}
            >
              <div className="text-sm font-bold text-rose-300">3. DMCA / Fake melden</div>
              <div className="text-xs mt-1">
                Jemand verwendet Ihre Fotos oder Ihren Namen ohne Erlaubnis? Sofortige Quarantäne & Löschung.
              </div>
            </button>
          </div>

          {mode === "claim" ? (
            <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center">
              <h2 className="text-xl font-bold text-emerald-300">
                🎁 Ihr Profil hat bereits organische Aufrufe & Klicks gesammelt!
              </h2>
              <p className="text-sm text-gray-200 mt-2 max-w-xl mx-auto">
                Übernehmen Sie Ihr Profil jetzt in 30 Sekunden: Der 1. Monat ist komplett kostenlos, Sie erhalten den offiziellen Verifizierungs-Haken (✓) wie bei Instagram/YouTube und können sofort Locked-Videos & 1:1 Live-Cams verkaufen.
              </p>
              <Link
                href={`/create-post?claim=${encodeURIComponent(profileName || "VIP")}`}
                className="inline-block mt-4 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm"
              >
                ✓ Jetzt kostenlos übernehmen (1. Monat Gratis + CHF 50 Startguthaben) →
              </Link>
            </div>
          ) : submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-500/15 border border-emerald-400/50">
              <div className="text-lg font-bold text-emerald-300">
                ✓ Sofort-Sperre & Quarantäne aktiviert (Ref: {submitted.id})
              </div>
              <p className="text-sm text-gray-200 mt-1">
                Das gemeldete Profil wurde sofort auf unsere Do-Not-Index-Sperrliste gesetzt und für das Admin-Team markiert.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">
                  Profilname / Künstlername
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="z.B. Sophia Zürich"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#08101A] border border-white/15 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">
                  Profil-URL oder Quell-Portal (z.B. Xdate / Fgirl Link)
                </label>
                <input
                  type="text"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#08101A] border border-white/15 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">
                  Ihre Schweizer Rufnummer oder E-Mail (zur Bestätigung & Sperrlisten-Eintragung)
                </label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="+41 79 ... oder E-Mail"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#08101A] border border-white/15 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">
                  Grund / Hinweis
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Bitte Profil aus dem Index entfernen / Fremdes Profil nutzt meine Fotos..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#08101A] border border-white/15 text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#C8A97E] hover:bg-[#d8b98e] text-[#0D1826] font-bold text-sm"
              >
                {mode === "dmca" ? "🚨 DMCA Takedown & Foto-Missbrauch sofort melden" : "🛡️ Profil sofort aus dem Index entfernen (Opt-Out)"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}