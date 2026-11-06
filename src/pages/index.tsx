import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import offersData from "@/data/harvested-offers.json";
import clubsData from "@/data/swiss-establishments-vault.json";
import {
  Search,
  Sparkles,
  Flame,
  Video,
  Trophy,
  Scale,
  Building2,
  ShieldCheck,
  Heart,
  ArrowUpDown,
  Lock,
  RotateCcw,
  KeyRound,
  MapPin,
} from "lucide-react";

const FEATURE_MODULES = [
  { href: "/matches", title: "Quick-Matcher", sub: "In 10s zum Top-Match", icon: Sparkles, color: "text-[#C8A97E]" },
  { href: "/stories", title: "24h Live-Stories", sub: "Spontane 4h-Impulse", icon: Flame, color: "text-emerald-400" },
  { href: "/live-cam", title: "1:1 Video & Vault", sub: "Cam-Dates & 80/20 Tresor", icon: Video, color: "text-sky-400" },
  { href: "/rankings", title: "Top-50 Ranking", sub: "Gefragteste Profile", icon: Trophy, color: "text-amber-400" },
  { href: "/compare-escorts", title: "4-Profil Vergleich", sub: "CHF & Attribute live", icon: Scale, color: "text-[#C8A97E]" },
  { href: "/clubs", title: "108 Schweizer Clubs", sub: "FKK, Studios & Saunaclubs", icon: Building2, color: "text-purple-300" },
  { href: "/pricing", title: "CHF-Kompass", sub: "Kantonale Richtpreise", icon: ShieldCheck, color: "text-emerald-300" },
  { href: "/hotels", title: "Outcall-Hotels", sub: "Self-Check-in & Diskretion", icon: KeyRound, color: "text-[#C8A97E]" },
];

const SWISS_HOTSPOT_PILLS = [
  { label: "6300 Zug & Baar", canton: "ZG", q: "" },
  { label: "8001/8004 Zürich", canton: "ZH", q: "Zürich" },
  { label: "6003 Luzern", canton: "LU", q: "" },
  { label: "5400 Baden / AG", canton: "AG", q: "" },
  { label: "4051 Basel", canton: "BS", q: "" },
  { label: "3011 Bern", canton: "BE", q: "" },
  { label: "9000 St. Gallen", canton: "SG", q: "" },
  { label: "1201 Genève", canton: "GE", q: "" },
  { label: "6900 Lugano", canton: "TI", q: "" },
];

export default function HomePage() {
  const [serverStates, setServerStates] = useState<Record<string, any>>({});
  const [blockedIds, setBlockedIds] = useState<string[]>([]);
  const [favIds, setFavIds] = useState<string[]>([]);

  const [cantonFilter, setCantonFilter] = useState<string>("ALL");
  const [rubricFilter, setRubricFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyAvailable4h, setOnlyAvailable4h] = useState<boolean>(false);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [onlyWithWhatsApp, setOnlyWithWhatsApp] = useState<boolean>(false);
  const [maxRate60, setMaxRate60] = useState<number>(1200);
  const [sortBy, setSortBy] = useState<"recommended" | "available" | "price_asc" | "price_desc" | "age_asc">("recommended");
  const [visibleLimit, setVisibleLimit] = useState<number>(24);

  useEffect(() => {
    fetch("/api/vault/metrics")
      .then((r) => r.json())
      .then((d) => {
        if (d?.states) setServerStates(d.states);
        if (Array.isArray(d?.blockedIds)) setBlockedIds(d.blockedIds);
      })
      .catch(() => {});

    try {
      const saved = JSON.parse(localStorage.getItem("ch_favorite_profiles") || "[]");
      if (Array.isArray(saved)) setFavIds(saved);
    } catch {}
  }, []);

  const toggleFav = (id: string) => {
    const next = favIds.includes(id) ? favIds.filter((x) => x !== id) : [id, ...favIds];
    setFavIds(next);
    try {
      localStorage.setItem("ch_favorite_profiles", JSON.stringify(next));
      window.dispatchEvent(new Event("ch-favorites-updated"));
    } catch {}
  };

  const activeOffers = useMemo(() => {
    const blocked = new Set(blockedIds);
    const raw = (offersData as any[]) || [];
    const list: any[] = [];

    for (const o of raw) {
      const pid = o.id || o.dedupClusterId;
      if (!pid || blocked.has(pid)) continue;
      const st = serverStates[pid] || {};
      if (st.paused || st.hidden || st.removedByReport) continue;

      const r60 = Math.max(100, Math.min(1200, Number(st.rate60Chf || o.advertisedBaseChf) || 350));
      const r30 = Math.max(80, Math.min(800, Number(st.rate30Chf || o.rate30Chf) || Math.round((r60 * 0.6) / 10) * 10));
      const isAvail = Boolean(st.availabilityConfirmed || o.availabilityConfirmed);
      const isVerif = Boolean(st.identityVerified || o.identityVerified);
      const isFeatured = Boolean(st.featured);
      const hasPhone = Boolean(o.rawPhone && String(o.rawPhone).startsWith("+41"));

      if (cantonFilter !== "ALL" && String(o.canton || "").toUpperCase() !== cantonFilter) continue;
      if (rubricFilter !== "ALL" && (o.rubric || "female") !== rubricFilter) continue;
      if (onlyAvailable4h && !isAvail) continue;
      if (onlyVerified && !isVerif) continue;
      if (onlyWithWhatsApp && !hasPhone) continue;
      if (r60 > maxRate60) continue;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hay = `${o.rawName || ""} ${o.city || ""} ${o.canton || ""} ${o.postalCode || ""} ${(o.includedTags || []).join(" ")}`.toLowerCase();
        if (!hay.includes(q)) continue;
      }

      list.push({
        ...o,
        id: pid,
        rate60Chf: r60,
        rate30Chf: r30,
        isAvail,
        isVerif,
        isFeatured,
        hasPhone,
      });
    }

    list.sort((a, b) => {
      if (sortBy === "available") {
        if (a.isAvail !== b.isAvail) return a.isAvail ? -1 : 1;
        return a.rate60Chf - b.rate60Chf;
      }
      if (sortBy === "price_asc") return a.rate60Chf - b.rate60Chf;
      if (sortBy === "price_desc") return b.rate60Chf - a.rate60Chf;
      if (sortBy === "age_asc") return (a.age || 25) - (b.age || 25);

      const scoreA =
        (a.isFeatured ? 800 : 0) +
        (a.isAvail ? 450 : 0) +
        (a.isVerif ? 250 : 0) +
        (a.hasPhone ? 120 : 0) +
        Number(a.curationScore || 75);
      const scoreB =
        (b.isFeatured ? 800 : 0) +
        (b.isAvail ? 450 : 0) +
        (b.isVerif ? 250 : 0) +
        (b.hasPhone ? 120 : 0) +
        Number(b.curationScore || 75);
      return scoreB - scoreA;
    });

    return list;
  }, [
    serverStates,
    blockedIds,
    cantonFilter,
    rubricFilter,
    searchQuery,
    onlyAvailable4h,
    onlyVerified,
    onlyWithWhatsApp,
    maxRate60,
    sortBy,
  ]);

  const resetAll = () => {
    setCantonFilter("ALL");
    setRubricFilter("ALL");
    setSearchQuery("");
    setOnlyAvailable4h(false);
    setOnlyVerified(false);
    setOnlyWithWhatsApp(false);
    setMaxRate60(1200);
    setSortBy("recommended");
  };

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO
        title="IWANTSEXNOW.CH — Schweizer Escort, GFE, Tantra & Club Direktverzeichnis (0% Provision)"
        description="Über 2'515 geprüfte Schweizer Escort-, Tantra- & Studio-Profile sowie 108 stationäre Clubs in Zürich, Zug, Luzern, Basel, Bern & Genf. 100% direkter +41 Kontakt & echte CHF-Preise."
        url="https://iwantsexnow.ch"
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-7">
        {/* Hero-Kommandozentrale mit PLZ-Hotspot-Pills */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#141A29] via-[#121722] to-[#0D111A] border border-[#C8A97E]/40 space-y-5 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-extrabold">
              <span>● LIVE SCHWEIZER INDEX</span>
              <span>· {activeOffers.length} Profile aktiv</span>
              <span>· {((clubsData as any[]) || []).length} Clubs</span>
            </div>
            <Link href="/register" className="text-xs text-[#C8A97E] font-extrabold hover:underline">
              + Eigenes Profil kostenlos eintragen (0% Provision) →
            </Link>
          </div>

          <div className="space-y-2 max-w-4xl">
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
              Schweizer Escort-, Tantra- & Studio-Direktverzeichnis mit +41 Sofortkontakt.
            </h1>
            <p className="text-xs sm:text-sm text-gray-300">
              Geprüfte <strong>30m/60m CHF-Honorare</strong>, direkter <strong>1-Klick WhatsApp- & Telefonkontakt</strong> ohne Agentur-Aufschlag und <strong>80 % Direkt-Ausschüttung</strong> im privaten Creator-Vault.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
            <div className="sm:col-span-2 relative">
              <Search size={15} className="absolute left-3.5 top-3.5 text-[#C8A97E]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="PLZ (z.B. 6300, 8004), Stadt, Name oder Service eingeben..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0D111A] border border-white/15 text-xs text-white focus:border-[#C8A97E] outline-none"
              />
            </div>

            <select
              value={cantonFilter}
              onChange={(e) => setCantonFilter(e.target.value)}
              className="rounded-xl bg-[#0D111A] border border-white/15 px-3.5 py-3 text-xs font-bold text-white"
            >
              <option value="ALL">🇨🇭 Alle 26 Kantone ({activeOffers.length})</option>
              <option value="ZG">Kanton Zug (ZG)</option>
              <option value="ZH">Kanton Zürich (ZH)</option>
              <option value="LU">Kanton Luzern (LU)</option>
              <option value="AG">Kanton Aargau (AG)</option>
              <option value="BS">Kanton Basel (BS)</option>
              <option value="BE">Kanton Bern (BE)</option>
              <option value="SG">Kanton St. Gallen (SG)</option>
              <option value="GE">Kanton Genève (GE)</option>
              <option value="VD">Kanton Vaud / Lausanne (VD)</option>
              <option value="TI">Kanton Tessin / Lugano (TI)</option>
            </select>

            <select
              value={rubricFilter}
              onChange={(e) => setRubricFilter(e.target.value)}
              className="rounded-xl bg-[#0D111A] border border-white/15 px-3.5 py-3 text-xs font-bold text-white"
            >
              <option value="ALL">Alle Rubriken</option>
              <option value="female">Escort & Girlfriend Experience</option>
              <option value="massage">Tantra & Erotische Massage</option>
              <option value="bdsm">Domina, BDSM & Fetisch</option>
              <option value="trans">Trans & TS Escort</option>
            </select>
          </div>

          {/* PLZ- & Hotspot-Schnellauswahl */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            <span className="text-[11px] text-gray-400 font-bold shrink-0 flex items-center gap-1 mr-1">
              <MapPin size={12} className="text-[#C8A97E]" /> Hotspots:
            </span>
            {SWISS_HOTSPOT_PILLS.map((h) => {
              const isAct = cantonFilter === h.canton;
              return (
                <button
                  key={h.label}
                  type="button"
                  onClick={() => {
                    setCantonFilter(isAct ? "ALL" : h.canton);
                    setSearchQuery(isAct ? "" : h.q);
                  }}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 cursor-pointer transition ${
                    isAct
                      ? "bg-[#C8A97E] text-[#0D111A]"
                      : "bg-[#0D111A]/90 border border-white/10 text-gray-300 hover:border-[#C8A97E]"
                  }`}
                >
                  {h.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* 8-Modul Schnellzugriff-Grid */}
        <section className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {FEATURE_MODULES.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.href}
                href={m.href}
                className="p-3 rounded-2xl bg-[#121722] border border-white/10 hover:border-[#C8A97E]/60 transition flex flex-col justify-between gap-1.5 group"
              >
                <Icon size={16} className={`${m.color} group-hover:scale-110 transition`} />
                <div>
                  <div className="text-xs font-extrabold text-white group-hover:text-[#C8A97E] truncate">{m.title}</div>
                  <div className="text-[10px] text-gray-400 truncate">{m.sub}</div>
                </div>
              </Link>
            );
          })}
        </section>

        {/* Echtzeit-Filter- & 5-Wege-Sortier-Leiste */}
        <section className="p-4 rounded-2xl bg-[#121722] border border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlyAvailable4h(!onlyAvailable4h)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition ${
                onlyAvailable4h ? "bg-emerald-500 text-[#07120B]" : "bg-[#0D111A] border border-white/15 text-gray-300"
              }`}
            >
              ● Jetzt 4h verfügbar
            </button>
            <button
              type="button"
              onClick={() => setOnlyWithWhatsApp(!onlyWithWhatsApp)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition ${
                onlyWithWhatsApp ? "bg-emerald-500 text-[#07120B]" : "bg-[#0D111A] border border-white/15 text-gray-300"
              }`}
            >
              💬 Mit +41 WhatsApp
            </button>
            <button
              type="button"
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition ${
                onlyVerified ? "bg-[#C8A97E] text-[#0D111A]" : "bg-[#0D111A] border border-white/15 text-gray-300"
              }`}
            >
              ✓ Geprüfte Fotos
            </button>

            {[
              { label: "Alle CHF", val: 1200 },
              { label: "≤ CHF 250", val: 250 },
              { label: "≤ CHF 350", val: 350 },
              { label: "≤ CHF 500", val: 500 },
            ].map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => setMaxRate60(p.val)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer ${
                  maxRate60 === p.val ? "bg-[#C8A97E] text-[#0D111A]" : "bg-[#0D111A] border border-white/10 text-gray-400"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <div className="flex items-center gap-1.5 bg-[#0D111A] border border-white/15 rounded-xl px-3 py-1.5">
              <ArrowUpDown size={13} className="text-[#C8A97E]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer"
              >
                <option value="recommended" className="bg-[#121722]">Sortierung: Empfohlen & Kuratiert</option>
                <option value="available" className="bg-[#121722]">● Jetzt 4h verfügbar zuerst</option>
                <option value="price_asc" className="bg-[#121722]">CHF-Honorar: Aufsteigend</option>
                <option value="price_desc" className="bg-[#121722]">CHF-Honorar: Absteigend</option>
                <option value="age_asc" className="bg-[#121722]">Alter: Jüngste zuerst</option>
              </select>
            </div>
            <button
              type="button"
              onClick={resetAll}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 cursor-pointer"
              title="Alle Filter zurücksetzen"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </section>

        {/* Haupt-Profil-Grid mit 1-Klick WhatsApp & Vault */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {activeOffers.slice(0, visibleLimit).map((p: any) => {
            const isFav = favIds.includes(p.id);
            const cleanDigits = p.rawPhone ? String(p.rawPhone).replace(/\D/g, "") : "";
            return (
              <div
                key={p.id}
                className="rounded-2xl bg-[#121722] border border-white/10 hover:border-[#C8A97E]/60 overflow-hidden flex flex-col justify-between transition group"
              >
                <div>
                  <div className="relative h-64 bg-[#0D111A] overflow-hidden">
                    <img
                      src={p.thumbnail || "/images/escort-portrait-1.jpg"}
                      alt={p.rawName}
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/images/escort-portrait-1.jpg";
                      }}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                      {p.isFeatured && (
                        <span className="px-2 py-0.5 rounded-full bg-[#C8A97E] text-[#0D111A] text-[10px] font-extrabold shadow">
                          ★ TOP
                        </span>
                      )}
                      {p.isAvail && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-[#07120B] text-[10px] font-extrabold shadow">
                          ● 4h Live
                        </span>
                      )}
                      {p.isVerif && (
                        <span className="px-2 py-0.5 rounded-full bg-black/80 text-[#C8A97E] border border-[#C8A97E]/40 text-[10px] font-bold">
                          ✓ Geprüft
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleFav(p.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-black/75 hover:bg-black text-white cursor-pointer"
                      title="Auf Merkliste speichern"
                    >
                      <Heart size={14} className={isFav ? "text-rose-400 fill-rose-400" : "text-gray-300"} />
                    </button>

                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-black/85 border border-white/15 text-xs font-extrabold text-[#C8A97E]">
                      CHF {p.rate60Chf}.– <span className="text-[10px] text-gray-400 font-normal">/ 60m</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#C8A97E]">
                        {p.canton} · {p.city}
                      </span>
                      <span className="text-gray-400">30m: CHF {p.rate30Chf}.–</span>
                    </div>
                    <Link
                      href={`/profile/${encodeURIComponent(p.id)}`}
                      className="block text-base font-serif font-bold text-white hover:text-[#C8A97E] truncate"
                    >
                      {p.rawName}
                    </Link>
                    <div className="text-xs text-gray-300">
                      {p.age || 25} J. · {p.heightCm || 168} cm · Cup {p.cupSize || "C"} · {p.hairColor || "Brünett"}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 grid grid-cols-3 gap-1.5">
                  {cleanDigits ? (
                    <a
                      href={`https://wa.me/${cleanDigits}?text=${encodeURIComponent(
                        `Hallo ${p.rawName}, ich habe dein Profil auf iwantsexnow.ch (${p.city}) gesehen.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-[#07120B] border border-emerald-500/30 font-extrabold text-[11px] text-center transition"
                      title="Direkter WhatsApp-Chat"
                    >
                      💬 WhatsApp
                    </a>
                  ) : (
                    <Link
                      href={`/checkout?profileId=${encodeURIComponent(p.id)}`}
                      className="py-2 px-2 rounded-xl bg-white/5 hover:bg-white/10 border border-[#C8A97E]/30 text-[#C8A97E] font-bold text-[11px] text-center inline-flex items-center justify-center gap-1"
                    >
                      <Lock size={11} /> Vault
                    </Link>
                  )}
                  <Link
                    href={`/profile/${encodeURIComponent(p.id)}`}
                    className="col-span-2 py-2 px-3 rounded-xl bg-[#C8A97E] hover:bg-[#b89566] text-[#0D111A] font-extrabold text-[11px] text-center"
                  >
                    Profil & +41 Kontakt →
                  </Link>
                </div>
              </div>
            );
          })}
        </section>

        {visibleLimit < activeOffers.length && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setVisibleLimit((prev) => prev + 24)}
              className="px-6 py-3 rounded-xl bg-[#121722] hover:bg-white/10 border border-[#C8A97E]/50 text-xs font-extrabold text-[#C8A97E] cursor-pointer"
            >
              Weitere Schweizer Profile laden ({activeOffers.length - visibleLimit} weitere verfügbar) →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}