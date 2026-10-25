import React, { useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { BrandLogo } from "@/components/BrandLogo";

export default function CreatorDashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "bidding" | "vault" | "profile">("overview");
  const [isOnlineNow, setIsOnlineNow] = useState(true);
  const [isLiveCamReady, setIsLiveCamReady] = useState(true);
  const [officialVerified, setOfficialVerified] = useState(true);

  // Bidding & Boost State
  const [bidCity, setBidCity] = useState("Zürich");
  const [bidAmountChf, setBidAmountChf] = useState(39);
  const [bidMode, setBidMode] = useState<"bidding" | "impressions" | "duration">("bidding");
  const [bidActive, setBidActive] = useState(false);

  // Locked VIP Content State
  const [vaultItems, setVaultItems] = useState([
    { id: "v1", title: "Uncensored 4K Hotel Teaser Video (2:40 Min.)", priceChf: 29, sales: 18 },
    { id: "v2", title: "Private Lingerie & Shower Photo-Set (14 HD Fotos)", priceChf: 19, sales: 24 },
  ]);
  const [newVaultTitle, setNewVaultTitle] = useState("");
  const [newVaultPrice, setNewVaultPrice] = useState(29);

  // Profile Editor State
  const [displayName, setDisplayName] = useState("Sophia VIP");
  const [city, setCity] = useState("Zürich Paradeplatz & Zug");
  const [rate60, setRate60] = useState(450);
  const [savedNotice, setSavedNotice] = useState("");

  const addVaultItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVaultTitle.trim()) return;
    setVaultItems([
      { id: "v-" + Date.now(), title: newVaultTitle, priceChf: Number(newVaultPrice) || 29, sales: 0 },
      ...vaultItems,
    ]);
    setNewVaultTitle("");
  };

  const totalVaultRevenue80 = vaultItems.reduce((sum, item) => sum + Math.round(item.priceChf * item.sales * 0.8), 0);

  return (
    <div className="min-h-screen bg-[#0D1826] text-white">
      <SEO
        title="Model & Creator Cockpit: Statistiken, Top-Spot Bidding & Locked Content | iwantsexnow.ch"
        description="Verwalte dein Profil, schalte dein grünes Online-Badge auf dem Profilbild, biete auf Platz 1 in deiner Stadt und verkaufe Locked VIP Videos."
        noindex
      />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#08101A]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <BrandLogo compact />
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
              🎁 Gratis-VIP-Monat aktiv (noch 28 Tage kostenlos)
            </span>
            <Link href="/" className="text-xs text-[#C8A97E] hover:underline font-bold">
              Live-Seite ansehen →
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* TOP STATUS BAR: DIRECT PHOTO BADGE CONTROLS */}
        <div className="p-5 rounded-3xl bg-[#111F30] border border-[#C8A97E]/40 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#C8A97E]">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
              {isOnlineNow && (
                <span className="absolute top-1 left-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-black animate-pulse" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-serif font-bold">{displayName}</h1>
                {officialVerified && (
                  <span className="px-2 py-0.5 rounded-full bg-sky-500 text-black text-[11px] font-extrabold">
                    ✓ Offiziell Verifiziert
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-300 mt-0.5">
                📍 {city} · Stundentarif: <strong className="text-[#C8A97E]">CHF {rate60}</strong>
              </p>
            </div>
          </div>

          {/* 1-CLICK LIVE BADGE TOGGLES (Visible directly on profile photo) */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsOnlineNow(!isOnlineNow)}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold border transition flex items-center gap-2 ${
                isOnlineNow
                  ? "bg-emerald-500 text-black border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                  : "bg-white/5 text-gray-300 border-white/15"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-current" />
              {isOnlineNow ? "🟢 AUF BILD: ONLINE & VERFÜGBAR" : "⚫ AUF BILD: OFFLINE"}
            </button>

            <button
              onClick={() => setIsLiveCamReady(!isLiveCamReady)}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold border transition ${
                isLiveCamReady
                  ? "bg-rose-500 text-white border-rose-400"
                  : "bg-white/5 text-gray-300 border-white/15"
              }`}
            >
              {isLiveCamReady ? "🔴 1:1 LIVE-CAM BEREIT" : "📹 LIVE-CAM PAUSIERT"}
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
          {[
            { id: "overview", label: "📊 1. Echtzeit-Statistiken & Leads" },
            { id: "bidding", label: "🏆 2. Sponsored Top-Rankings & Live-Bidding" },
            { id: "vault", label: "🔒 3. Locked VIP Fotos/Videos verkaufen (80%)" },
            { id: "profile", label: "✏️ 4. Profil, Bilder & Verifizierung verwalten" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === t.id
                  ? "bg-[#C8A97E] text-[#0D1826]"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: ANALYTICS & IMPRESSIONS */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#111F30] border border-white/10">
                <div className="text-[11px] text-gray-400 uppercase">Profil-Impressions (7 Tage)</div>
                <div className="text-3xl font-extrabold text-white mt-1">3.840</div>
                <div className="text-[11px] text-emerald-400 mt-1">↑ +42% durch ✓ Haken</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#111F30] border border-white/10">
                <div className="text-[11px] text-gray-400 uppercase">Direkte Kontakt-Klicks</div>
                <div className="text-3xl font-extrabold text-[#C8A97E] mt-1">184</div>
                <div className="text-[11px] text-gray-300 mt-1">4.8% Klickrate (CTR)</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#111F30] border border-white/10">
                <div className="text-[11px] text-gray-400 uppercase">Locked Content & Cam Erlös (80%)</div>
                <div className="text-3xl font-extrabold text-purple-300 mt-1">CHF {totalVaultRevenue80 + 420}</div>
                <div className="text-[11px] text-purple-200 mt-1">Sofort auszahlbar (TWINT/USDT)</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#111F30] border border-white/10">
                <div className="text-[11px] text-gray-400 uppercase">Aktueller Stadtrang ({bidCity})</div>
                <div className="text-3xl font-extrabold text-emerald-400 mt-1">
                  {bidActive ? "Platz #1 👑" : "Platz #4"}
                </div>
                <button
                  onClick={() => setActiveTab("bidding")}
                  className="text-[11px] text-[#C8A97E] underline mt-1"
                >
                  Auf Platz #1 bieten →
                </button>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#111F30] border border-white/10 space-y-4">
              <h2 className="text-lg font-bold">📈 Woher kommen deine Besucher diese Woche?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                  <div className="font-bold text-[#C8A97E] mb-1">Top Such-Vorlieben (Bild-Klicks):</div>
                  <p className="text-gray-300">1. Girlfriend Experience (GFE) – 41%</p>
                  <p className="text-gray-300">2. Blonde / Luxury – 33%</p>
                  <p className="text-gray-300">3. Hotel-Outcall Zürich/Zug – 26%</p>
                </div>
                <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                  <div className="font-bold text-emerald-300 mb-1">Top Städte deiner Profil-Besucher:</div>
                  <p className="text-gray-300">1. Zürich City & Airport – 54%</p>
                  <p className="text-gray-300">2. Zug / Cham / Baar – 27%</p>
                  <p className="text-gray-300">3. Luzern & Basel – 19%</p>
                </div>
                <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                  <div className="font-bold text-sky-300 mb-1">Dein Tarif-Status:</div>
                  <p className="text-gray-300">✅ 1. Monat 100% Gratis aktiv</p>
                  <p className="text-gray-300">✅ CHF 50 Start-Guthaben für Top-Spot Bidding bereit</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SPONSORED RANKINGS & LIVE BIDDING */}
        {activeTab === "bidding" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#111F30] border border-[#C8A97E]/50 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase text-[#C8A97E]">
                🏆 Sponsored Rankings · Biete dich auf Platz 1 in deiner Stadt
              </span>
              <h2 className="text-2xl font-serif font-bold mt-1">
                Wähle dein Boost-Modell: Live-Bidding, Fixe Impressions oder Fixe Dauer
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">
                Du kannst dein <strong>CHF 50 Willkommens-Startguthaben</strong> direkt hier einsetzen, um dein Profil ganz oben auf der Startseite (👑 TOP SPONSORED #1) zu platzieren:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => setBidMode("bidding")}
                className={`p-4 rounded-2xl border text-left ${
                  bidMode === "bidding" ? "bg-[#C8A97E]/20 border-[#C8A97E]" : "bg-white/5 border-white/10"
                }`}
              >
                <div className="text-sm font-bold text-[#C8A97E]">1. Live-Auktion (Bidding für Platz 1)</div>
                <div className="text-xs text-gray-300 mt-1">
                  Überbiete das aktuelle Höchstgebot in deiner Stadt um CHF 2.– und springe sofort auf Platz #1.
                </div>
              </button>

              <button
                onClick={() => setBidMode("impressions")}
                className={`p-4 rounded-2xl border text-left ${
                  bidMode === "impressions" ? "bg-[#C8A97E]/20 border-[#C8A97E]" : "bg-white/5 border-white/10"
                }`}
              >
                <div className="text-sm font-bold text-emerald-300">2. Nach Impressions (Pay-per-View)</div>
                <div className="text-xs text-gray-300 mt-1">
                  Zahle nur für garantierte Sichtbarkeit: z.B. 2.500 Top-Impressions auf Platz 1–3 für pauschal CHF 49.
                </div>
              </button>

              <button
                onClick={() => setBidMode("duration")}
                className={`p-4 rounded-2xl border text-left ${
                  bidMode === "duration" ? "bg-[#C8A97E]/20 border-[#C8A97E]" : "bg-white/5 border-white/10"
                }`}
              >
                <div className="text-sm font-bold text-sky-300">3. Fixe Zeitdauer (24h / Weekend)</div>
                <div className="text-xs text-gray-300 mt-1">
                  Garantierter Top-Spot für 24 Stunden (CHF 29) oder das ganze Wochenende Fr–So (CHF 69).
                </div>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#08101A] border border-white/10 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Ziel-Stadt / Region</label>
                  <select
                    value={bidCity}
                    onChange={(e) => setBidCity(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#111F30] border border-white/15 text-sm text-white"
                  >
                    <option value="Zürich">Zürich (Aktuelles Höchstgebot Platz #1: CHF 35/Tag)</option>
                    <option value="Zug & Cham">Zug & Cham (Aktuelles Höchstgebot Platz #1: CHF 29/Tag)</option>
                    <option value="Basel">Basel (Aktuelles Höchstgebot Platz #1: CHF 25/Tag)</option>
                    <option value="Bern">Bern (Aktuelles Höchstgebot Platz #1: CHF 25/Tag)</option>
                    <option value="Genève">Genève (Aktuelles Höchstgebot Platz #1: CHF 32/Tag)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                    Dein Gebot / Budget: <strong className="text-[#C8A97E]">CHF {bidAmountChf}</strong>
                  </label>
                  <input
                    type="range"
                    min={20}
                    max={120}
                    step={1}
                    value={bidAmountChf}
                    onChange={(e) => setBidAmountChf(Number(e.target.value))}
                    className="w-full accent-[#C8A97E] mt-2"
                  />
                  <div className="text-[11px] text-emerald-400 mt-1">
                    {bidAmountChf >= 36
                      ? `👑 Mit CHF ${bidAmountChf} überbietest du Platz #1 in ${bidCity} und stehst SOFORT ganz oben!`
                      : `Mit CHF ${bidAmountChf} erreichst du aktuell Platz #2–3 in ${bidCity}.`}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setBidActive(true)}
                className="px-6 py-3 rounded-xl bg-[#C8A97E] hover:bg-[#d8b98e] text-[#0D1826] font-extrabold text-xs sm:text-sm"
              >
                {bidActive
                  ? `✓ Platz #1 Boost in ${bidCity} ist LIVE!`
                  : `🚀 Jetzt Platz #1 in ${bidCity} mit Startguthaben aktivieren`}
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: LOCKED VIP CONTENT MANAGER */}
        {activeTab === "vault" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-[#111F30] border border-purple-400/40 space-y-4">
              <span className="text-xs font-bold uppercase text-purple-300">
                🔒 Passives Einkommen · 80% Direkt-Auszahlung
              </span>
              <h2 className="text-xl font-serif font-bold">
                Neues Locked Foto-Set oder 4K-Video auf deinem Profil anbieten
              </h2>
              <form onSubmit={addVaultItem} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">Titel des gesperrten Inhalts</label>
                  <input
                    required
                    value={newVaultTitle}
                    onChange={(e) => setNewVaultTitle(e.target.value)}
                    placeholder="z.B. Uncensored Hotel-Video (4 Min.) + 10 Privatfotos"
                    className="w-full p-3 rounded-xl bg-[#08101A] border border-white/15"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Freischalt-Preis für Kunden (in CHF)</label>
                  <input
                    type="number"
                    min={9}
                    max={199}
                    value={newVaultPrice}
                    onChange={(e) => setNewVaultPrice(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-[#08101A] border border-white/15"
                  />
                  <span className="text-[11px] text-emerald-300 mt-1 block">
                    Du erhältst netto <strong>CHF {Math.round(newVaultPrice * 0.8)}.– (80%)</strong> pro Verkauf!
                  </span>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-black font-extrabold"
                >
                  + Locked VIP Paket auf Profil veröffentlichen
                </button>
              </form>
            </div>

            <div className="p-6 rounded-3xl bg-[#111F30] border border-white/10 space-y-4">
              <h3 className="text-lg font-bold">Deine aktiven Locked Content Pakete</h3>
              <div className="space-y-3">
                {vaultItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#08101A] border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-sm font-bold text-white">{item.title}</div>
                      <div className="text-xs text-gray-400">
                        Preis: CHF {item.priceChf} · Verkäufe: <strong className="text-emerald-300">{item.sales}x</strong>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-gray-400">Dein 80% Anteil</div>
                      <div className="text-sm font-extrabold text-purple-300">
                        CHF {Math.round(item.priceChf * item.sales * 0.8)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE & MEDIA MANAGER */}
        {activeTab === "profile" && (
          <div className="p-6 rounded-3xl bg-[#111F30] border border-white/10 space-y-4 max-w-2xl">
            <h2 className="text-xl font-serif font-bold">✏️ Profil, Tarife & Offizielle Verifizierung</h2>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Künstlername</label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#08101A] border border-white/15"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Stadt / Einsatzgebiet</label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#08101A] border border-white/15"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Stundentarif (60 Min. in CHF)</label>
                <input
                  type="number"
                  value={rate60}
                  onChange={(e) => setRate60(Number(e.target.value))}
                  className="w-full p-3 rounded-xl bg-[#08101A] border border-white/15"
                />
              </div>
              <button
                type="button"
                onClick={() => setSavedNotice("✓ Deine Änderungen wurden sofort live auf deinem Profil gespeichert!")}
                className="px-6 py-3 rounded-xl bg-[#C8A97E] text-[#0D1826] font-extrabold"
              >
                Änderungen speichern
              </button>
              {savedNotice && <div className="text-emerald-400 font-bold pt-1">{savedNotice}</div>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}