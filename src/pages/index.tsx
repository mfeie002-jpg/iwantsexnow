import React, { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import rawOffers from "@/data/harvested-offers.json";
import LuxuryPhotoCard, { extractPhotoUrls, cleanSwissDigits } from "@/components/LuxuryPhotoCard";

const CITIES = [
  { name: "Zürich", canton: "ZH", img: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=600&q=80" },
  { name: "Zug", canton: "ZG", img: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80" },
  { name: "Basel", canton: "BS", img: "https://images.unsplash.com/photo-1573108037329-37aa135a142e?auto=format&fit=crop&w=600&q=80" },
  { name: "Bern", canton: "BE", img: "https://images.unsplash.com/photo-1597926661998-969f6198622f?auto=format&fit=crop&w=600&q=80" },
  { name: "Genève", canton: "GE", img: "https://images.unsplash.com/photo-1574068468668-a05a11f871da?auto=format&fit=crop&w=600&q=80" },
  { name: "Luzern", canton: "LU", img: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=600&q=80" },
  { name: "Lausanne", canton: "VD", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" },
  { name: "St. Gallen", canton: "SG", img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80" },
  { name: "Lugano", canton: "TI", img: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80" },
  { name: "Aargau", canton: "AG", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80" }
];

const VIBES = [
  { id: "all", title: "Alle Top-Profile", sub: "Mit Originalfotos", q: "", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80" },
  { id: "gfe", title: "Girlfriend & Dinner", sub: "GFE · Begleitung", q: "gfe", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80" },
  { id: "massage", title: "Tantra & Massage", sub: "Sinnliche Rituale", q: "massage", img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80" },
  { id: "blond", title: "Blond & Klassisch", sub: "Visueller Filter", q: "blond", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80" },
  { id: "latina", title: "Latina & Brünett", sub: "Temperamentvoll", q: "latina", img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80" },
  { id: "asia", title: "Asian & Thai", sub: "Zart & Diskret", q: "asia", img: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=600&q=80" },
  { id: "bdsm", title: "Domina & Fetisch", sub: "BDSM · Studio", q: "bdsm", img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80" },
  { id: "vip", title: "VIP & High-Class", sub: "Exklusive Dates", q: "vip", img: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80" }
];

export default function HomePage() {
  const sortedOffers: any[] = useMemo(() => {
    const arr = Array.isArray(rawOffers) ? [...(rawOffers as any[])] : [];
    arr.sort((a, b) => {
      const hasPicA = extractPhotoUrls(a).length > 0 ? 1 : 0;
      const hasPicB = extractPhotoUrls(b).length > 0 ? 1 : 0;
      if (hasPicA !== hasPicB) return hasPicB - hasPicA;
      const hasPhA = cleanSwissDigits(a?.rawPhone || "").length >= 10 ? 1 : 0;
      const hasPhB = cleanSwissDigits(b?.rawPhone || "").length >= 10 ? 1 : 0;
      return hasPhB - hasPhA;
    });
    return arr;
  }, []);

  const [liveStates, setLiveStates] = useState<Record<string, any>>({});
  const [blockedIds, setBlockedIds] = useState<string[]>([]);
  const [canton, setCanton] = useState("ALL");
  const [vibe, setVibe] = useState("all");
  const [query, setQuery] = useState("");
  const [onlyWhatsapp, setOnlyWhatsapp] = useState(false);
  const [onlyLive, setOnlyLive] = useState(false);
  const [limit, setLimit] = useState(28);

  useEffect(() => {
    fetch("/api/vault/metrics")
      .then((r) => r.json())
      .then((d) => {
        if (d?.states) setLiveStates(d.states);
        if (Array.isArray(d?.blockedIds)) setBlockedIds(d.blockedIds);
      })
      .catch(() => {});
  }, []);

  const cantonCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const o of sortedOffers) {
      const c = String(o?.canton || "ZH").toUpperCase();
      m[c] = (m[c] || 0) + 1;
    }
    return m;
  }, [sortedOffers]);

  const filtered = useMemo(() => {
    const blocked = new Set(blockedIds);
    const q = query.trim().toLowerCase();
    return sortedOffers.filter((o) => {
      const pid = String(o?.id || o?.dedupClusterId || "");
      if (blocked.has(pid)) return false;
      const st = liveStates[pid];
      if (st?.hidden || st?.paused) return false;
      if (canton !== "ALL" && String(st?.canton || o?.canton || "").toUpperCase() !== canton) return false;
      if (onlyWhatsapp && cleanSwissDigits(st?.phoneDisplay || o?.rawPhone || "").length < 10) return false;
      if (onlyLive && !Boolean(st?.availabilityConfirmed || o?.availabilityConfirmed)) return false;
      if (q) {
        const hay = [st?.displayName, o?.rawName, o?.city, o?.canton, o?.hairColor, o?.bio, ...(Array.isArray(o?.includedTags) ? o.includedTags : [])]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [sortedOffers, liveStates, blockedIds, canton, onlyWhatsapp, onlyLive, query]);

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#F5F2EB]">
      <Head>
        <title>iwantsexnow.ch — Schweizer Escort-, Tantra- & Studio-Direktverzeichnis</title>
        <meta name="description" content="2.590+ echte Schweizer Escort-, Tantra- & Studio-Profile mit Originalfotos, 30/60 Min. CHF-Preisen und direktem +41 WhatsApp-Kontakt." />
      </Head>

      <header className="sticky top-0 z-40 bg-[#0B0E14]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <span className="w-9 h-9 rounded-xl bg-[#C8A97E] text-[#0B0E14] font-serif font-black text-lg flex items-center justify-center">X</span>
            <div>
              <span className="text-lg sm:text-xl font-serif font-bold text-white">iwantse<span className="text-[#C8A97E]">x</span>now.ch</span>
              <span className="hidden sm:block text-[10px] uppercase tracking-[0.2em] text-[#C8A97E]">Schweizer Meta-Index · 0% Provision</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-gray-300">
            <Link href="/" className="text-white hover:text-[#C8A97E] no-underline">Profile ({sortedOffers.length})</Link>
            <Link href="/clubs" className="hover:text-[#C8A97E] no-underline">Clubs & Studios (305)</Link>
            <Link href="/search" className="hover:text-[#C8A97E] no-underline">Deep-Filter</Link>
            <Link href="/pricing" className="hover:text-[#C8A97E] no-underline">CHF Honorare</Link>
            <Link href="/fantasy-preview" className="text-[#C8A97E] no-underline">✨ KI-Preview</Link>
            <Link href="/reviews" className="hover:text-[#C8A97E] no-underline">Portalvergleich</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/login" className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-white no-underline">Login / Claim</Link>
            <Link href="/create-post" className="px-4 py-2 rounded-xl bg-[#C8A97E] hover:bg-[#b89566] text-[#0B0E14] text-xs font-extrabold no-underline">+ Inserat gratis</Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/10">
        <img
          src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1800&q=80"
          alt="Swiss Nightlife"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0E14]/75 via-[#0B0E14]/85 to-[#0B0E14]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8A97E]/15 border border-[#C8A97E]/40 text-[#C8A97E] text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {sortedOffers.length.toLocaleString("de-CH")} Profile · 2.399 Original-Galerien · 305 Clubs
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
              Eine Suche für die ganze Schweiz. <span className="text-[#C8A97E]">Direkt per +41 WhatsApp.</span>
            </h1>
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setLimit(28); }}
                placeholder="Name, Stadt (z.B. Zürich, Zug, Cham), Service oder +41 Nummer…"
                className="flex-1 px-4 py-3.5 rounded-2xl bg-[#141926]/95 border border-white/15 text-sm text-white placeholder-gray-400 focus:border-[#C8A97E] outline-none"
              />
              <button
                type="button"
                onClick={() => setOnlyWhatsapp(!onlyWhatsapp)}
                className={`px-4 py-3.5 rounded-2xl text-xs font-extrabold border cursor-pointer ${onlyWhatsapp ? "bg-emerald-500 text-black border-emerald-400" : "bg-[#141926] text-white border-white/15"}`}
              >
                📞 +41 WhatsApp direkt
              </button>
              <button
                type="button"
                onClick={() => setOnlyLive(!onlyLive)}
                className={`px-4 py-3.5 rounded-2xl text-xs font-extrabold border cursor-pointer ${onlyLive ? "bg-[#C8A97E] text-black border-[#C8A97E]" : "bg-[#141926] text-white border-white/15"}`}
              >
                ● Frei / 4h Live
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <div className="flex items-end justify-between mb-3">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">Wo bist du heute?</h2>
          {canton !== "ALL" && (
            <button type="button" onClick={() => setCanton("ALL")} className="text-xs font-bold text-[#C8A97E] cursor-pointer">
              ✕ Alle Kantone zeigen ({sortedOffers.length})
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
          {CITIES.map((c) => (
            <button
              key={c.canton}
              type="button"
              onClick={() => { setCanton(canton === c.canton ? "ALL" : c.canton); setLimit(28); }}
              className={`group relative h-28 rounded-2xl overflow-hidden border text-left cursor-pointer ${canton === c.canton ? "border-2 border-[#C8A97E]" : "border-white/15 hover:border-[#C8A97E]/60"}`}
            >
              <img src={c.img} alt={c.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/75 text-[#C8A97E] text-[10px] font-extrabold">{cantonCounts[c.canton] || 0}</span>
              <div className="absolute bottom-2 left-2.5">
                <div className="text-xs font-extrabold text-white">{c.name}</div>
                <div className="text-[10px] text-gray-300">{c.canton}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-end justify-between mb-3">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">Worauf hast du Lust?</h2>
          <Link href="/clubs" className="text-xs font-bold text-[#C8A97E] no-underline">Alle 305 Clubs & Studios →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {VIBES.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => { setVibe(v.id); setQuery(v.q); setLimit(28); }}
              className={`group relative h-36 rounded-2xl overflow-hidden border text-left cursor-pointer ${vibe === v.id ? "border-2 border-[#C8A97E]" : "border-white/15 hover:border-[#C8A97E]/60"}`}
            >
              <img src={v.img} alt={v.title} loading="lazy" className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5">
                <div className="text-xs font-extrabold text-white leading-tight">{v.title}</div>
                <div className="text-[10px] text-[#C8A97E] mt-0.5 truncate">{v.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            {canton === "ALL" ? "Alle Profile" : `Kanton ${canton}`} <span className="text-[#C8A97E] text-base font-sans">({filtered.length.toLocaleString("de-CH")})</span>
          </h2>
          {(canton !== "ALL" || query || onlyWhatsapp || onlyLive) && (
            <button type="button" onClick={() => { setCanton("ALL"); setVibe("all"); setQuery(""); setOnlyWhatsapp(false); setOnlyLive(false); }} className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold text-white cursor-pointer">
              Filter zurücksetzen
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.slice(0, limit).map((offer, idx) => {
            const pid = String(offer?.id || offer?.dedupClusterId || `ch-${idx}`);
            return <LuxuryPhotoCard key={pid} offer={offer} idx={idx} liveState={liveStates[pid]} />;
          })}
        </div>

        {limit < filtered.length && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setLimit((n) => n + 28)}
              className="px-8 py-4 rounded-2xl bg-[#C8A97E] hover:bg-[#b89566] text-[#0B0E14] font-extrabold text-sm cursor-pointer"
            >
              Mehr Profile laden ({filtered.length - limit} weitere)
            </button>
          </div>
        )}
      </main>

      <footer className="mt-16 border-t border-white/10 bg-[#080A0F] py-10 px-4 sm:px-6 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>© 2026 iwantsexnow.ch · Schweizer Direkt- & Vergleichsindex (18+)</div>
          <div className="flex flex-wrap gap-4">
            <Link href="/imprint" className="hover:text-white no-underline">Impressum</Link>
            <Link href="/privacy" className="hover:text-white no-underline">Datenschutz (revDSG)</Link>
            <Link href="/terms" className="hover:text-white no-underline">AGB</Link>
            <Link href="/report" className="text-rose-300 hover:underline no-underline">1-Klick Opt-Out / Melden</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}