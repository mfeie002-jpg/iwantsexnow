import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import rawOffers from "@/data/harvested-offers.json";
import { cleanSwissDigits, extractPhotoUrls, toProxiedImg, getLocalAiPortrait } from "@/components/LuxuryPhotoCard";

const QUICK_CANTONS = [
  { code: "ALL", label: "Ganze Schweiz" },
  { code: "ZH", label: "Zürich" },
  { code: "ZG", label: "Zug & Cham" },
  { code: "BS", label: "Basel" },
  { code: "BE", label: "Bern" },
  { code: "LU", label: "Luzern" },
  { code: "GE", label: "Genève" },
  { code: "VD", label: "Lausanne" },
  { code: "AG", label: "Aargau" },
  { code: "TI", label: "Lugano" }
];

const QUICK_DESIRES = [
  { id: "", label: "✨ Alles zeigen" },
  { id: "gfe", label: "🥂 Escort & GFE" },
  { id: "massage", label: "🪷 Tantra & Massage" },
  { id: "bdsm", label: "⛓️ Domina & BDSM" },
  { id: "vip", label: "💎 High-Class VIP" },
  { id: "outcall", label: "🏨 Hotelbesuch" }
];

const INSTANT_ANSWERS: Record<string, { title: string; body: string; ctaLabel: string; ctaHref: string }> = {
  portals: {
    title: "Welches Schweizer Portal ist wofür am besten?",
    body: "Klassische Portale wie and6.com, xdate.ch oder fgirl.ch sind reine Anzeigenbretter mit vielen Mehrfach-Inseraten. Auf iwantsexnow.ch durchsuchst du alle grossen Schweizer Quellen gleichzeitig, siehst bereinigte 30m/60m CHF-Richtwerte und kontaktierst Anbieterinnen mit 0% Aufschlag direkt per +41 WhatsApp.",
    ctaLabel: "Vollständigen Top-10-Portalvergleich öffnen →",
    ctaHref: "/reviews"
  },
  pricing: {
    title: "Was kostet 30 / 60 Min. realistisch in der Schweiz?",
    body: "In Zürich, Zug, Basel und Genf liegen seriöse Direkt-Honorare meist bei CHF 150–250 für 30 Min. und CHF 250–450 für 60 Min. (High-Class Dinner-Dates ab CHF 600+). Reine Lockvogel-Zahlen wie 'CHF 50' oder Postleitzahlen-Fehler filtert unsere Engine automatisch heraus.",
    ctaLabel: "Live CHF-Honorar-Kompass pro Kanton öffnen →",
    ctaHref: "/pricing"
  },
  hotels: {
    title: "Diskrete Outcall- & Tageszimmer (Day-Use)",
    body: "Für diskrete Treffen ohne Rezeptions-Hektik eignen sich Schweizer Business- & Boutique-Hotels mit direktem Tiefgaragen-Lift in Zürich, Zug/Baar, Luzern, Basel und Genf.",
    ctaLabel: "Schweizer Outcall-Hotel-Guide ansehen →",
    ctaHref: "/hotels"
  },
  creator: {
    title: "Für Anbieterinnen: 0% Provision & sofortiges 1-Klick Opt-Out",
    body: "Du kannst dein bestehendes Profil in 30 Sekunden kostenlos übernehmen (inkl. 4h-Live-Schalter & 80% Anteil bei digitalen Zusatzverkäufen) – oder jeden externen Index-Eintrag ohne Login mit 1 Klick dauerhaft ausblenden lassen.",
    ctaLabel: "Profil gratis übernehmen / Claim →",
    ctaHref: "/login"
  }
};

export function XeniaConcierge() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [canton, setCanton] = useState("ZH");
  const [desire, setDesire] = useState("");
  const [onlyWhatsapp, setOnlyWhatsapp] = useState(true);
  const [maxChf, setMaxChf] = useState<number>(0);
  const [activeTopic, setActiveTopic] = useState<string>("");

  const offers: any[] = useMemo(() => (Array.isArray(rawOffers) ? (rawOffers as any[]) : []), []);

  const topMatches = useMemo(() => {
    const q = desire.toLowerCase();
    return offers
      .filter((o) => {
        if (canton !== "ALL" && String(o?.canton || "").toUpperCase() !== canton) return false;
        if (onlyWhatsapp && cleanSwissDigits(o?.rawPhone || "").length < 10) return false;
        const rate = Number(o?.advertisedBaseChf || o?.rate60Chf || 350);
        if (maxChf > 0 && rate > maxChf) return false;
        if (q) {
          const hay = [o?.rawName, o?.rubric, o?.bio, ...(o?.includedTags || [])].filter(Boolean).join(" ").toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .slice(0, 3);
  }, [offers, canton, desire, onlyWhatsapp, maxChf]);

  const applyOnPage = () => {
    setOpen(false);
    const params = new URLSearchParams();
    if (canton !== "ALL") params.set("canton", canton);
    if (desire) params.set("q", desire);
    if (onlyWhatsapp) params.set("wa", "1");
    if (maxChf > 0) params.set("max", String(maxChf));
    if (router.pathname === "/") {
      window.dispatchEvent(
        new CustomEvent("xenia:filter", {
          detail: { canton, query: desire, onlyWhatsapp, maxChf }
        })
      );
      const gridEl = document.getElementById("profiles-anchor");
      if (gridEl) gridEl.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/?" + params.toString());
    }
  };

  // Auf Admin-Routen dezent ausblenden
  if (router.pathname.startsWith("/admin")) return null;

  return (
    <>
      {/* Schwebende Zero-Typing Xenia-Kapsel in der Daumenzone */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 z-50 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="group flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full bg-gradient-to-r from-[#1E0E1A] via-[#2B1222] to-[#1A0D16] border border-[#E2B887]/65 shadow-[0_10px_30px_rgba(225,29,72,0.35)] hover:border-[#E2B887] transition cursor-pointer"
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#E2B887] shrink-0">
            <img
              src="/images/ai/xenia-avatar.webp"
              alt="Xenia KI-Concierge"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black" />
          </div>
          <div className="text-left">
            <div className="text-[11px] font-extrabold text-[#E2B887] leading-tight">
              ✨ Xenia · KI-Guide
            </div>
            <div className="text-[10px] text-white/90 leading-tight">
              Ohne Tippen finden →
            </div>
          </div>
        </button>
      </div>

      {/* Interaktives Zero-Typing Concierge-Panel */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[#140B12] border border-[#E2B887]/40 text-[#F8F1F4] shadow-2xl p-5 space-y-5">
            {/* Kopfbereich mit Xenia */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <img
                  src="/images/ai/xenia-avatar.webp"
                  alt="Xenia"
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#E2B887]"
                />
                <div>
                  <div className="text-xs uppercase tracking-widest text-[#E2B887] font-bold">
                    Schweizer Zero-Typing Concierge
                  </div>
                  <h3 className="text-lg font-serif font-bold text-white">
                    Hoi, ich bin Xenia — tippe einfach deine Stimmung an.
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* 1. Ort antippen */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#E2B887]">1. Wo bist du gerade?</div>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_CANTONS.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setCanton(c.code)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ${
                      canton === c.code
                        ? "bg-[#E11D48] border-[#FB7185] text-white"
                        : "bg-white/5 border-white/15 text-gray-200 hover:border-[#E2B887]/60"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Erlebnis antippen */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#E2B887]">2. Worauf hast du Lust?</div>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_DESIRES.map((d) => (
                  <button
                    key={d.id || "all"}
                    type="button"
                    onClick={() => setDesire(d.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ${
                      desire === d.id
                        ? "bg-[#E2B887] border-[#E2B887] text-[#140B12]"
                        : "bg-white/5 border-white/15 text-gray-200 hover:border-[#E2B887]/60"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Rahmen & Budget ohne Tippen */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#E2B887]">3. Direktkontakt & Honorar-Rahmen (60 Min.)</div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setOnlyWhatsapp(!onlyWhatsapp)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer ${
                    onlyWhatsapp ? "bg-emerald-500 text-black border-emerald-400" : "bg-white/5 text-white border-white/15"
                  }`}
                >
                  📞 Direkter +41 WhatsApp
                </button>
                {[
                  [0, "Alle Preise"],
                  [300, "Bis CHF 300"],
                  [400, "Bis CHF 400"]
                ].map(([val, lbl]) => (
                  <button
                    key={String(val)}
                    type="button"
                    onClick={() => setMaxChf(Number(val))}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer ${
                      maxChf === Number(val)
                        ? "bg-[#E2B887] text-black border-[#E2B887]"
                        : "bg-white/5 text-white border-white/15"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            {/* Sofortige Mini-Vorschau der besten 3 Treffer direkt in Xenia */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Sofort-Empfehlungen für deine Auswahl:</span>
                <button
                  type="button"
                  onClick={applyOnPage}
                  className="text-xs font-extrabold text-[#E2B887] hover:underline cursor-pointer"
                >
                  Alle passenden Profile im Grid öffnen →
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {topMatches.map((m, idx) => {
                  const pid = String(m.id || m.dedupClusterId || idx);
                  const pics = extractPhotoUrls(m);
                  const fb = getLocalAiPortrait(pid);
                  const src = pics.length > 0 ? toProxiedImg(pics[0], pid) : fb;
                  return (
                    <Link
                      key={pid}
                      href={`/profile/${encodeURIComponent(pid)}`}
                      onClick={() => setOpen(false)}
                      className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-white/15 no-underline"
                    >
                      <img
                        src={src}
                        alt={m.rawName || "Profil"}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = fb;
                        }}
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="text-[11px] font-bold text-white truncate">{m.rawName}</div>
                        <div className="text-[10px] text-[#E2B887] font-extrabold">
                          {m.city} · CHF {m.advertisedBaseChf || 350}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={applyOnPage}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] hover:opacity-95 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg cursor-pointer"
              >
                Auswahl jetzt auf der Seite anzeigen →
              </button>
            </div>

            {/* 1-Tap Wissens- & Vertrauens-Kapseln (Point of Doubt) */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <div className="text-[11px] uppercase tracking-wider text-[#B9A5AD] font-bold">
                1-Klick Sofort-Antworten ohne Tippen:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  ["portals", "⚖️ Welche Portale sind am besten?"],
                  ["pricing", "💰 Was kostet 30/60 Min. realistisch?"],
                  ["hotels", "🏨 Diskrete Outcall-Hotels"],
                  ["creator", "🛡️ Profil-Claim & 1-Klick Opt-Out"]
                ].map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveTopic(activeTopic === key ? "" : key)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border cursor-pointer ${
                      activeTopic === key
                        ? "bg-white/15 border-[#E2B887] text-white"
                        : "bg-white/5 border-white/10 text-gray-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {activeTopic && INSTANT_ANSWERS[activeTopic] && (
                <div className="p-3.5 rounded-2xl bg-white/5 border border-[#E2B887]/35 space-y-2 text-xs">
                  <div className="font-bold text-[#E2B887]">{INSTANT_ANSWERS[activeTopic].title}</div>
                  <p className="text-gray-200 leading-relaxed">{INSTANT_ANSWERS[activeTopic].body}</p>
                  <Link
                    href={INSTANT_ANSWERS[activeTopic].ctaHref}
                    onClick={() => setOpen(false)}
                    className="inline-block text-[#FB7185] font-bold hover:underline no-underline"
                  >
                    {INSTANT_ANSWERS[activeTopic].ctaLabel}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default XeniaConcierge;