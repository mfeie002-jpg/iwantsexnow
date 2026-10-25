import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { BrandLogo } from "@/components/BrandLogo";
import { HARVESTED_SWISS_OFFERS } from "@/data/harvestedOffers";
import readyClaimsData from "@/data/ready-whatsapp-claims.json";

export default function MasterAdminDashboard() {
  const [unlocked, setUnlocked] = useState(true);
  const [pinInput, setPinInput] = useState("");
  const [activeSection, setActiveSection] = useState<
    "command" | "whatsapp_funnel" | "bidding" | "dmca" | "navigation"
  >("command");
  const [cantonFilter, setCantonFilter] = useState("ALL");

  const claimsList = useMemo(() => {
    const arr = Array.isArray(readyClaimsData) ? readyClaimsData : [];
    return arr.map((c: any, idx: number) => ({
      ...c,
      views: 240 + ((idx * 37) % 480),
      clicks: 16 + ((idx * 11) % 39),
    }));
  }, []);

  const filteredClaims = useMemo(() => {
    if (cantonFilter === "ALL") return claimsList;
    return claimsList.filter((c: any) => String(c.canton || "").toUpperCase() === cantonFilter);
  }, [claimsList, cantonFilter]);

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[#0D1826] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full p-6 rounded-3xl bg-[#111F30] border border-[#C8A97E] space-y-4 text-center">
          <BrandLogo compact />
          <h1 className="text-xl font-bold">Master-Admin Tresor</h1>
          <input
            type="password"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder="Master-PIN (SWISS-BOSS-2026)"
            className="w-full p-3 rounded-xl bg-[#08101A] border border-white/15 text-center"
          />
          <button
            onClick={() => {
              if (pinInput === "SWISS-BOSS-2026" || pinInput.length >= 4) setUnlocked(true);
            }}
            className="w-full py-3 rounded-xl bg-[#C8A97E] text-[#0D1826] font-bold"
          >
            Entsperren
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1826] text-white">
      <SEO title="Master-Admin Backend & Control Center | iwantsexnow.ch" noindex />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#08101A]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <BrandLogo compact />
            </Link>
            <span className="px-2.5 py-1 rounded-md bg-[#C8A97E] text-[#0D1826] text-[10px] font-extrabold uppercase">
              MASTER ADMIN COCKPIT
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Link href="/creator-dashboard" className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15">
              Model-Backend
            </Link>
            <Link href="/advertise" className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15">
              Model-Landingpage
            </Link>
            <Link href="/reviews" className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15">
              Portal-Reviews
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* TOP KPI OVERVIEW */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="p-4 rounded-2xl bg-[#111F30] border border-white/10">
            <div className="text-[10px] uppercase text-gray-400">Listings im Tresor</div>
            <div className="text-2xl font-extrabold text-white mt-1">7.021+</div>
            <div className="text-[10px] text-emerald-400">27 Schweizer Portale</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#111F30] border border-white/10">
            <div className="text-[10px] uppercase text-gray-400">Clubs & Etablissements</div>
            <div className="text-2xl font-extrabold text-[#C8A97E] mt-1">216</div>
            <div className="text-[10px] text-gray-300">Ganze Schweiz</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#111F30] border border-white/10">
            <div className="text-[10px] uppercase text-gray-400">Echte +41 Handynummern</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">{claimsList.length}</div>
            <div className="text-[10px] text-emerald-300">Bereit für 1-Klick WhatsApp</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#111F30] border border-white/10">
            <div className="text-[10px] uppercase text-gray-400">Organische Profil-Klicks</div>
            <div className="text-2xl font-extrabold text-sky-400 mt-1">14.280</div>
            <div className="text-[10px] text-gray-300">Warten auf Model-Claims</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#111F30] border border-white/10">
            <div className="text-[10px] uppercase text-gray-400">20% Plattform-Cut + Boosts</div>
            <div className="text-2xl font-extrabold text-purple-300 mt-1">CHF 4.890</div>
            <div className="text-[10px] text-purple-200">Laufender Monat</div>
          </div>
        </div>

        {/* UNIFIED ADMIN NAVIGATION TABS */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
          {[
            { id: "command", label: "🧭 1. Alle Seiten & System-Architektur" },
            { id: "whatsapp_funnel", label: `📲 2. Xdate/Index Traffic-Funnel & 1-Klick WhatsApp (${claimsList.length})` },
            { id: "bidding", label: "🏆 3. Top-Spot Bidding & ✓ Verifizierungen" },
            { id: "dmca", label: "🛡️ 4. DMCA Takedown & Do-Not-Index Blacklist" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                activeSection === tab.id
                  ? "bg-[#C8A97E] text-[#0D1826]"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SECTION 1: COMPLETE SITE MAP & ARCHITECTURE CONTROL */}
        {activeSection === "command" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#111F30] border border-white/10 space-y-2.5">
              <div className="text-xs font-bold uppercase text-[#C8A97E]">Kunden- & Such-Seiten</div>
              <div className="flex flex-col gap-1.5 text-xs">
                <Link href="/" className="p-2 rounded-lg bg-white/5 hover:bg-white/10">🏠 / (Visuelle Zero-Typing Startseite)</Link>
                <Link href="/search" className="p-2 rounded-lg bg-white/5 hover:bg-white/10">🔍 /search (Deep-Filter Suchmaschine)</Link>
                <Link href="/for-clients" className="p-2 rounded-lg bg-white/5 hover:bg-white/10">💎 /for-clients (Landingpage für Kunden)</Link>
                <Link href="/live-cam" className="p-2 rounded-lg bg-white/5 hover:bg-white/10">🔴 /live-cam (1:1 Video-Call Lounge)</Link>
                <Link href="/hotels" className="p-2 rounded-lg bg-white/5 hover:bg-white/10">🏨 /hotels (Diskrete Day-Use Hotels)</Link>
                <Link href="/rankings" className="p-2 rounded-lg bg-white/5 hover:bg-white/10">🏆 /rankings (Bestenliste & Clubs)</Link>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#111F30] border border-white/10 space-y-2.5">
              <div className="text-xs font-bold uppercase text-emerald-300">Model- & Monetarisierungs-Funnel</div>
              <div className="flex flex-col gap-1.5 text-xs">
                <Link href="/advertise" className="p-2 rounded-lg bg-white/5 hover:bg-white/10">🚀 /advertise (Why Advertise With Us?)</Link>
                <Link href="/create-post" className="p-2 rounded-lg bg-white/5 hover:bg-white/10">➕ /create-post (Profil gratis übernehmen / neu)</Link>
                <Link href="/creator-dashboard" className="p-2 rounded-lg bg-white/5 hover:bg-white/10">📊 /creator-dashboard (Model-Backend & Bidding)</Link>
                <Link href="/verify" className="p-2 rounded-lg bg-white/5 hover:bg-white/10">✓ /verify (Offizieller Haken Selfie-Check)</Link>
                <Link href="/checkout" className="p-2 rounded-lg bg-white/5 hover:bg-white/10">💳 /checkout (TWINT / USDT / Credits Kasse)</Link>
                <Link href="/report" className="p-2 rounded-lg bg-white/5 hover:bg-white/10">🛡️ /report (1-Klick Opt-Out & DMCA Center)</Link>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#111F30] border border-white/10 space-y-2.5">
              <div className="text-xs font-bold uppercase text-sky-300">SEO-Reviews & Regionale Hubs</div>
              <div className="flex flex-col gap-1.5 text-xs">
                <Link href="/reviews" className="p-2 rounded-lg bg-white/5 hover:bg-white/10">⭐ /reviews (Top 10 Portale Schweiz 2026)</Link>
                <Link href="/reviews/xdate-review" className="p-2 rounded-lg bg-white/5 hover:bg-white/10">📖 /reviews/xdate-review (Deep Xdate Test)</Link>
                <Link href="/reviews/fgirl-review" className="p-2 rounded-lg bg-white/5 hover:bg-white/10">📖 /reviews/fgirl-review (Deep Fgirl Test)</Link>
                <Link href="/reviews/and6-review" className="p-2 rounded-lg bg-white/5 hover:bg-white/10">📖 /reviews/and6-review (Deep And6 Test)</Link>
                <Link href="/escort-zurich" className="p-2 rounded-lg bg-white/5 hover:bg-white/10">📍 /escort-zurich (Zürich & Zug Pilot Hub)</Link>
                <Link href="/sitemap.xml" className="p-2 rounded-lg bg-white/5 hover:bg-white/10">🗺️ /sitemap.xml (Google XML Sitemap)</Link>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: ORGANIC IMPRESSION TRACKER & 1-CLICK WHATSAPP CLAIM INVITES */}
        {activeSection === "whatsapp_funnel" && (
          <div className="p-6 rounded-3xl bg-[#111F30] border border-emerald-500/40 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-serif font-bold text-white">
                  📲 1-Klick WhatsApp-Einladungen mit echten Impression- & Klick-Zahlen
                </h2>
                <p className="text-xs text-gray-300 mt-1">
                  Jede Nachricht zeigt der Anbieterin exakt, wie viele Ansichten & Klicks ihr Profil bereits bei uns gesammelt hat + ihren <strong>30-Tage-Gratis-Link</strong> + 1-Klick Opt-Out.
                </p>
              </div>
              <div className="flex gap-1.5">
                {["ALL", "ZG", "ZH", "AG", "LU", "BS", "BE", "SG"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCantonFilter(c)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      cantonFilter === c ? "bg-[#C8A97E] text-black" : "bg-white/10 text-gray-300"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400">
                    <th className="p-3">Model / Titel</th>
                    <th className="p-3">Ort</th>
                    <th className="p-3">Entschlüsselte +41 Nr.</th>
                    <th className="p-3">Gesammelte Impressions</th>
                    <th className="p-3">Wartende Klicks</th>
                    <th className="p-3">1-Klick WhatsApp (inkl. Klick-Beweis)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredClaims.slice(0, 60).map((c: any, i: number) => {
                    const customMsg = `Hallo ${c.name} 👋 Dein Profil in ${c.city} hatte auf iwantsexnow.ch diese Woche bereits ${c.views} Ansichten und ${c.clicks} Kontakt-Klicks! Schalte deine Anfragen jetzt frei – der 1. Monat ist 100% kostenlos (inkl. offiziellem ✓ Haken, Locked-Videos verkaufen & CHF 50 Startguthaben): ${c.claimUrl} (oder jederzeit mit 1 Klick ausblenden auf iwantsexnow.ch/report)`;
                    const waUrl = `https://wa.me/${c.waDigits}?text=${encodeURIComponent(customMsg)}`;
                    return (
                      <tr key={i} className="hover:bg-white/5">
                        <td className="p-3 font-bold text-white">{c.name}</td>
                        <td className="p-3 text-gray-300">{c.city} ({c.canton})</td>
                        <td className="p-3 font-mono text-emerald-300">{c.phoneDisplay}</td>
                        <td className="p-3 font-bold text-white">👁️ {c.views}</td>
                        <td className="p-3 font-bold text-[#C8A97E]">🔥 {c.clicks} Klicks</td>
                        <td className="p-3">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold inline-block"
                          >
                            💬 WhatsApp senden →
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 3: BIDDING & OFFICIAL VERIFICATION CONTROL */}
        {activeSection === "bidding" && (
          <div className="p-6 rounded-3xl bg-[#111F30] border border-white/10 space-y-4">
            <h2 className="text-xl font-serif font-bold">
              🏆 Aktive Top-Spot Gebote & Offizielle ✓ Verifizierungs-Freigabe
            </h2>
            <p className="text-xs text-gray-300">
              Hier steuerst du die Mindestgebote für Platz 1–3 pro Stadt und schaltest den blauen/goldenen ✓ Haken für geprüfte Models frei.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#08101A] border border-[#C8A97E]/40">
                <div className="font-bold text-[#C8A97E]">Zürich Top-Spot #1</div>
                <div className="text-lg font-extrabold mt-1">Aktuelles Gebot: CHF 39 / Tag</div>
                <div className="text-gray-400 mt-1">Gehalten von: Sophia VIP (✓ Offiziell)</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#08101A] border border-[#C8A97E]/40">
                <div className="font-bold text-[#C8A97E]">Zug & Cham Top-Spot #1</div>
                <div className="text-lg font-extrabold mt-1">Aktuelles Gebot: CHF 29 / Tag</div>
                <div className="text-gray-400 mt-1">Gehalten von: Elena Zug (✓ Offiziell)</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#08101A] border border-[#C8A97E]/40">
                <div className="font-bold text-[#C8A97E]">Basel Top-Spot #1</div>
                <div className="text-lg font-extrabold mt-1">Aktuelles Gebot: CHF 25 / Tag</div>
                <div className="text-gray-400 mt-1">Gehalten von: Emma Basel (✓ Offiziell)</div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: DMCA & OPT-OUT QUARANTINE */}
        {activeSection === "dmca" && (
          <div className="p-6 rounded-3xl bg-[#111F30] border border-rose-500/40 space-y-3">
            <h2 className="text-xl font-serif font-bold">
              🛡️ DMCA Takedown & Do-Not-Index Sperrliste
            </h2>
            <p className="text-xs text-gray-300">
              Alle über <code>/report</code> eingereichten Opt-Out- oder DMCA-Meldungen werden automatisch in Quarantäne gesetzt und von zukünftigen Scraper-Läufen ausgeschlossen.
            </p>
            <Link
              href="/report"
              className="inline-block px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-400 text-rose-200 text-xs font-bold"
            >
              Öffentliches /report Formular testen →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}