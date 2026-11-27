import React, { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import rawOffers from "@/data/harvested-offers.json";
import clubsData from "@/data/swiss-establishments-vault.json";
import LuxuryPhotoCard, { cleanSwissDigits } from "@/components/LuxuryPhotoCard";

const REGIONS = [
  { name: "Zürich", canton: "ZH", img: "/images/ai/regions/zurich.webp" },
  { name: "Zug & Cham", canton: "ZG", img: "/images/ai/regions/zug.webp" },
  { name: "Genf", canton: "GE", img: "/images/ai/regions/geneva.webp" },
  { name: "Basel", canton: "BS", img: "/images/ai/regions/basel.webp" },
  { name: "Bern", canton: "BE", img: "/images/ai/regions/bern.webp" },
  { name: "Luzern", canton: "LU", img: "/images/ai/regions/luzern.webp" },
  { name: "Lausanne", canton: "VD", img: "/images/ai/regions/lausanne.webp" },
  { name: "St. Gallen", canton: "SG", img: "/images/ai/regions/stgallen.webp" },
  { name: "Lugano", canton: "TI", img: "/images/ai/regions/lugano.webp" },
  { name: "Aargau / Baden", canton: "AG", img: "/images/ai/regions/aargau.webp" }
];

const DESIRE_WORLDS = [
  { id: "all", title: "Escort & GFE", sub: "Begleitung & Dates", q: "", img: "/images/ai/vibes/escort.webp" },
  { id: "massage", title: "Massage & Tantra", sub: "Sinnliche Rituale", q: "massage", img: "/images/ai/vibes/massage.webp" },
  { id: "clubs", title: "Clubs & Studios", sub: "305 Adressen", q: "", href: "/clubs", img: "/images/ai/vibes/clubs.webp" },
  { id: "private", title: "Private Kontakte", sub: "Direkt per +41", q: "", waOnly: true, img: "/images/ai/vibes/private.webp" },
  { id: "bdsm", title: "Domina & BDSM", sub: "Fetisch & Studio", q: "bdsm", img: "/images/ai/vibes/bdsm.webp" },
  { id: "vip", title: "High-Class VIP", sub: "Exklusive Suiten", q: "vip", img: "/images/ai/vibes/vip.webp" }
];

const SWISS_TOP_10_PORTALS = [
  {
    name: "and6.com",
    badge: "Grösste Reichweite",
    desc: "Das grösste und bekannteste Schweizer Erotik- und Kleinanzeigenportal mit enormer Auswahl in allen Kantonen.",
    img: "/images/ai/portals/and6.webp"
  },
  {
    name: "6navi.ch",
    badge: "Starke Filter",
    desc: "Sehr beliebtes Verzeichnis für Escorts, Clubs und private Kontakte mit umfangreichen Such- und Filterfunktionen.",
    img: "/images/ai/portals/6navi.webp"
  },
  {
    name: "sex.ch",
    badge: "Etabliert",
    desc: "Etabliertes Schweizer Portal mit regionaler Suche für Escort-Services, Studios und Massagen.",
    img: "/images/ai/portals/sexch.webp"
  },
  {
    name: "ladies.ch",
    badge: "Geprüfte Inserate",
    desc: "Bekannte Plattform für verifizierte Inserate, Begleitservices und Club-Angebote in der gesamten Schweiz.",
    img: "/images/ai/portals/ladies.webp"
  },
  {
    name: "Choice (saferchoice.ch)",
    badge: "Fokus Sicherheit",
    desc: "Moderne Schweizer Buchungsplattform mit Fokus auf Sicherheit, Ausweisverifizierung und klare Leistungsübersichten.",
    img: "/images/ai/portals/saferchoice.webp"
  },
  {
    name: "Lolla.ch",
    badge: "Romandie & Städte",
    desc: "Community-orientiertes Portal mit vielen Inseraten unabhängiger Anbieterinnen in Schweizer Städten.",
    img: "/images/ai/portals/lolla.webp"
  },
  {
    name: "Megaescort.ch",
    badge: "Überregional",
    desc: "Überregionales Verzeichnis mit einer grossen Auswahl an Escort-Damen und Agenturen.",
    img: "/images/ai/portals/megaescort.webp"
  },
  {
    name: "Target Escorts",
    badge: "High-Class Agentur",
    desc: "International tätige High-Class-Agentur mit starker Präsenz in Zürich, Genf und Basel.",
    img: "/images/ai/portals/target.webp"
  },
  {
    name: "Ladama Escort",
    badge: "Diskret & Exklusiv",
    desc: "Exklusive Begleitagentur mit Fokus auf gehobene Ansprüche und Diskretion.",
    img: "/images/ai/portals/ladama.webp"
  },
  {
    name: "Girls Deluxe",
    badge: "Ostschweiz & Privat",
    desc: "Schweizer Anbieter mit Fokus auf Escort-Services sowie Privat-Apartments in der Ostschweiz.",
    img: "/images/ai/portals/girlsdeluxe.webp"
  }
];

const ZERO_TYPING_CHIPS = [
  { label: "🔥 Zürich · Direkt +41 WhatsApp", canton: "ZH", q: "", wa: true, max: 0 },
  { label: "💎 Zug & Cham · Sofort-Auswahl", canton: "ZG", q: "", wa: false, max: 0 },
  { label: "🪷 Sinnliche Tantra-Massage", canton: "ALL", q: "massage", wa: false, max: 0 },
  { label: "🥂 Honorar bis CHF 300", canton: "ALL", q: "", wa: false, max: 300 },
  { label: "⛓️ Domina & Fetisch", canton: "ALL", q: "bdsm", wa: false, max: 0 }
];

export default function HomePage() {
  const router = useRouter();
  const allOffers: any[] = useMemo(() => (Array.isArray(rawOffers) ? (rawOffers as any[]) : []), []);
  const totalClubs = Array.isArray(clubsData) && clubsData.length > 0 ? clubsData.length : 305;

  const [liveStates, setLiveStates] = useState<Record<string, any>>({});
  const [blockedIds, setBlockedIds] = useState<string[]>([]);
  const [canton, setCanton] = useState("ALL");
  const [activeWorld, setActiveWorld] = useState("all");
  const [query, setQuery] = useState("");
  const [onlyWhatsapp, setOnlyWhatsapp] = useState(false);
  const [onlyLive, setOnlyLive] = useState(false);
  const [maxChf, setMaxChf] = useState<number>(0);
  const [searchFocused, setSearchFocused] = useState(false);
  const [limit, setLimit] = useState(28);
  const [xeniaReply, setXeniaReply] = useState<string>(
    "Wähle oben einfach Stadt oder Stimmung per Fingertipp – ich filtere dir sofort echte Schweizer Profile mit klaren 30/60-Min.-Preisen heraus."
  );

  useEffect(() => {
    fetch("/api/vault/metrics")
      .then((r) => r.json())
      .then((d) => {
        if (d?.states) setLiveStates(d.states);
        if (Array.isArray(d?.blockedIds)) setBlockedIds(d.blockedIds);
      })
      .catch(() => {});

    const onXeniaFilter = (ev: any) => {
      const d = ev?.detail || {};
      if (d.canton) setCanton(d.canton);
      if (d.query !== undefined) setQuery(d.query);
      if (d.onlyWhatsapp !== undefined) setOnlyWhatsapp(Boolean(d.onlyWhatsapp));
      if (d.maxChf !== undefined) setMaxChf(Number(d.maxChf) || 0);
      setLimit(28);
    };
    window.addEventListener("xenia:filter", onXeniaFilter);
    return () => window.removeEventListener("xenia:filter", onXeniaFilter);
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.canton) setCanton(String(router.query.canton).toUpperCase());
    if (router.query.q) setQuery(String(router.query.q));
    if (router.query.wa === "1") setOnlyWhatsapp(true);
    if (router.query.max) setMaxChf(Number(router.query.max) || 0);
  }, [router.isReady, router.query]);

  const cantonCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const o of allOffers) {
      const c = String(o?.canton || "ZH").toUpperCase();
      m[c] = (m[c] || 0) + 1;
    }
    return m;
  }, [allOffers]);

  const filtered = useMemo(() => {
    const blocked = new Set(blockedIds);
    const q = query.trim().toLowerCase();
    return allOffers.filter((o) => {
      const pid = String(o?.id || o?.dedupClusterId || "");
      if (blocked.has(pid)) return false;
      const st = liveStates[pid];
      if (st?.hidden || st?.paused) return false;
      if (canton !== "ALL" && String(st?.canton || o?.canton || "").toUpperCase() !== canton) return false;
      if (onlyWhatsapp && cleanSwissDigits(st?.phoneDisplay || o?.rawPhone || "").length < 10) return false;
      if (onlyLive && !Boolean(st?.availabilityConfirmed || o?.availabilityConfirmed)) return false;
      const r60 = Number(st?.rate60Chf || o?.advertisedBaseChf || 350);
      if (maxChf > 0 && r60 > maxChf) return false;
      if (q) {
        const hay = [
          st?.displayName,
          o?.rawName,
          o?.city,
          o?.canton,
          o?.rubric,
          o?.hairColor,
          o?.bio,
          ...(Array.isArray(o?.includedTags) ? o.includedTags : [])
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [allOffers, liveStates, blockedIds, canton, onlyWhatsapp, onlyLive, maxChf, query]);

  const scrollToGrid = () => {
    const el = document.getElementById("profiles-anchor");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0D070C] text-[#F8F1F4]">
      <Head>
        <title>iwantsexnow.ch — Dein Erotik-, Escort- & Massage-Guide für die ganze Schweiz</title>
        <meta
          name="description"
          content={`${allOffers.length.toLocaleString("de-CH")}+ echte Schweizer Escort-, Massage- & Studio-Profile, Top-10 Portalvergleich und Zero-Typing KI-Concierge Xenia. 0% Provision & +41 Direktkontakt.`}
        />
      </Head>

      {/* STICKY HEADER */}
      <header className="sticky top-0 z-40 bg-[#0D070C]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E11D48] to-[#9F1239] text-white font-serif font-black text-lg flex items-center justify-center shadow-lg">
              X
            </span>
            <div>
              <span className="text-lg sm:text-xl font-serif font-bold tracking-tight text-white">
                iwantse<span className="text-[#E11D48]">x</span>now<span className="text-[#E2B887]">.ch</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-[0.2em] text-[#E2B887]">
                Schweizer Direkt-Index & KI-Guide
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[#DECED4]">
            <a href="#profiles-anchor" className="text-white hover:text-[#E2B887] no-underline">
              Profile ({allOffers.length.toLocaleString("de-CH")})
            </a>
            <a href="#regions-anchor" className="hover:text-[#E2B887] no-underline">
              Regionen
            </a>
            <a href="#portals-anchor" className="hover:text-[#E2B887] no-underline">
              Portale vergleichen
            </a>
            <Link href="/clubs" className="hover:text-[#E2B887] no-underline">
              Clubs ({totalClubs})
            </Link>
            <Link href="/pricing" className="hover:text-[#E2B887] no-underline">
              CHF-Kompass
            </Link>
            <a href="#xenia-anchor" className="text-[#E2B887] hover:underline no-underline">
              Xenia ✨
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-white no-underline"
            >
              Anmelden
            </Link>
            <Link
              href="/create-post"
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#E11D48] to-[#BE123C] hover:opacity-95 text-white text-xs font-extrabold shadow-md no-underline"
            >
              + Inserieren
            </Link>
          </div>
        </div>
      </header>

      {/* 1. CINEMATIC SWISS HERO + ZERO-TYPING FINDER */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <img
            src="/images/ai/hero-swiss-night.webp"
            alt="Schweizer Escort & Erotik Guide"
            className="w-full h-full object-cover object-center opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D070C] via-[#0D070C]/85 to-[#0D070C]/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D070C] via-transparent to-[#0D070C]/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E11D48]/20 border border-[#FB7185]/40 text-[#FDA4AF] text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Schweizweit gebündelt · {allOffers.length.toLocaleString("de-CH")} Profile · {totalClubs} Clubs & Studios
            </div>

            <h1 className="text-3xl sm:text-6xl font-serif font-bold text-white leading-[1.08]">
              Escort, Massage & mehr –{" "}
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#FB7185] via-[#E11D48] to-[#E2B887]">
                in der ganzen Schweiz.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#E5D6DC] max-w-2xl leading-relaxed">
              Finde, vergleiche und kontaktiere geprüfte Direktprofile, Tantra-Ateliers und Clubs ohne Umwege – geführt durch unsere Zero-Typing KI <strong className="text-[#E2B887]">Xenia</strong>, ohne ein einziges Wort tippen zu müssen.
            </p>

            {/* 3-Spalten Auswahlbar wie im Mockup (0 Buchstaben nötig!) */}
            <div className="p-2 sm:p-2.5 rounded-3xl bg-[#1A0E17]/95 backdrop-blur-xl border border-[#E2B887]/35 shadow-2xl grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-4 px-3 py-2 rounded-2xl bg-white/5 border border-white/10">
                <label className="block text-[10px] uppercase tracking-wider text-[#E2B887] font-bold">📍 Wo?</label>
                <select
                  value={canton}
                  onChange={(e) => {
                    setCanton(e.target.value);
                    setLimit(28);
                  }}
                  className="w-full bg-transparent text-sm font-bold text-white outline-none mt-0.5 cursor-pointer"
                >
                  <option value="ALL" className="bg-[#140B12]">Alle Kantone ({allOffers.length})</option>
                  {REGIONS.map((r) => (
                    <option key={r.canton} value={r.canton} className="bg-[#140B12]">
                      {r.name} ({cantonCounts[r.canton] || 0})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-4 px-3 py-2 rounded-2xl bg-white/5 border border-white/10 relative">
                <label className="block text-[10px] uppercase tracking-wider text-[#E2B887] font-bold">💎 Was / Stichwort?</label>
                <input
                  type="text"
                  value={query}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setLimit(28);
                  }}
                  placeholder="Antippen oder leer lassen…"
                  className="w-full bg-transparent text-sm font-semibold text-white placeholder-[#A9929B] outline-none mt-0.5"
                />
                {searchFocused && !query && (
                  <div className="absolute left-0 right-0 top-full mt-2 p-3 rounded-2xl bg-[#190D16] border border-[#E2B887]/40 shadow-2xl z-30 space-y-1.5">
                    <div className="text-[10px] uppercase tracking-wider text-[#E2B887] font-bold">
                      ✨ Sofort-Auswahl ohne Tippen:
                    </div>
                    {["Girlfriend (GFE)", "Massage", "Blond", "Latina", "BDSM", "VIP"].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onMouseDown={() => {
                          setQuery(term === "Girlfriend (GFE)" ? "gfe" : term.toLowerCase());
                          scrollToGrid();
                        }}
                        className="mr-1.5 mb-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-[#E11D48] text-xs font-semibold text-white cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="sm:col-span-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setOnlyWhatsapp(!onlyWhatsapp)}
                  className={`flex-1 px-3 py-2 rounded-2xl text-xs font-extrabold border transition cursor-pointer ${
                    onlyWhatsapp
                      ? "bg-emerald-500 text-black border-emerald-400"
                      : "bg-white/5 text-white border-white/10 hover:border-[#E2B887]"
                  }`}
                >
                  📞 +41 Direkt
                </button>
                <button
                  type="button"
                  onClick={scrollToGrid}
                  className="flex-1 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] hover:opacity-95 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg cursor-pointer"
                >
                  🔍 Zeigen ({filtered.length})
                </button>
              </div>
            </div>

            {/* Xenia Zero-Typing Schnellkapseln direkt unter der Suche */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E2B887]">
                <img src="/images/ai/xenia-avatar.webp" alt="Xenia" className="w-6 h-6 rounded-full object-cover border border-[#E2B887]" />
                Xenia 1-Tap:
              </span>
              {ZERO_TYPING_CHIPS.map((chip, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setCanton(chip.canton);
                    setQuery(chip.q);
                    setOnlyWhatsapp(chip.wa);
                    setMaxChf(chip.max);
                    setLimit(28);
                    scrollToGrid();
                  }}
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-[#E11D48]/80 border border-white/15 text-xs font-semibold text-white transition cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. BELIEBTE REGIONEN IN DER SCHWEIZ */}
      <section id="regions-anchor" className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-5">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">Beliebte Regionen in der Schweiz</h2>
            <p className="text-xs sm:text-sm text-[#BBA7B0] mt-0.5">
              Ein Fingertipp auf deine Stadt filtert alle verfügbaren Profile ohne Tippen.
            </p>
          </div>
          {canton !== "ALL" && (
            <button
              type="button"
              onClick={() => setCanton("ALL")}
              className="text-xs font-extrabold text-[#E2B887] hover:underline cursor-pointer"
            >
              ✕ Alle Regionen ({allOffers.length})
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {REGIONS.map((r) => {
            const active = canton === r.canton;
            return (
              <button
                key={r.canton}
                type="button"
                onClick={() => {
                  setCanton(active ? "ALL" : r.canton);
                  setLimit(28);
                  scrollToGrid();
                }}
                className={`group relative h-32 sm:h-36 rounded-2xl overflow-hidden border text-left transition cursor-pointer ${
                  active ? "border-2 border-[#E11D48] ring-2 ring-[#E11D48]/40" : "border-white/15 hover:border-[#E2B887]/65"
                }`}
              >
                <img
                  src={r.img}
                  alt={r.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090408]/95 via-black/30 to-transparent" />
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/75 border border-[#E2B887]/40 text-[#E2B887] text-[10px] font-extrabold">
                  {cantonCounts[r.canton] || 0}
                </span>
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-white">{r.name}</div>
                    <div className="text-[10px] text-[#D8C5CD]">Kanton {r.canton}</div>
                  </div>
                  <span className="w-6 h-6 rounded-full bg-[#E11D48] text-white text-xs font-bold flex items-center justify-center">
                    →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. WORAUF HAST DU LUST? (6 KI-GENERIERTE ERLEBNIS-WELTEN) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Worauf hast du <span className="italic text-[#FB7185]">Lust?</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#BBA7B0] mt-0.5">Entdecke die Vielfalt – von Girlfriend-Begleitung bis Tantra & Studios.</p>
          </div>
          <Link href="/clubs" className="text-xs font-extrabold text-[#E2B887] hover:underline no-underline">
            Alle {totalClubs} Clubs & Studios →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {DESIRE_WORLDS.map((w) => {
            if (w.href) {
              return (
                <Link
                  key={w.id}
                  href={w.href}
                  className="group relative h-44 rounded-2xl overflow-hidden border border-white/15 hover:border-[#E2B887] block no-underline"
                >
                  <img src={w.img} alt={w.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090408]/95 via-black/25 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="text-sm font-bold text-white">{w.title}</div>
                    <div className="text-[11px] text-[#E2B887]">{w.sub}</div>
                  </div>
                </Link>
              );
            }
            const active = activeWorld === w.id;
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => {
                  setActiveWorld(w.id);
                  setQuery(w.q);
                  setOnlyWhatsapp(Boolean(w.waOnly));
                  setLimit(28);
                  scrollToGrid();
                }}
                className={`group relative h-44 rounded-2xl overflow-hidden border text-left transition cursor-pointer ${
                  active ? "border-2 border-[#E11D48] ring-2 ring-[#E11D48]/40" : "border-white/15 hover:border-[#E2B887]"
                }`}
              >
                <img src={w.img} alt={w.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090408]/95 via-black/25 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-sm font-bold text-white">{w.title}</div>
                  <div className="text-[11px] text-[#E2B887]">{w.sub}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. HAUPT-KATALOG: ALLE SCHWEIZER PROFILE (2-SPALTEN MOBILE / 4-SPALTEN DESKTOP, 0 SCHWARZE KARTEN) */}
      <main id="profiles-anchor" className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-white/10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              {canton === "ALL" ? "Alle Schweizer Profile" : `Profile im Kanton ${canton}`}{" "}
              <span className="text-[#E2B887] text-lg font-sans">({filtered.length.toLocaleString("de-CH")})</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlyLive(!onlyLive)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer ${
                onlyLive ? "bg-[#E2B887] text-black border-[#E2B887]" : "bg-white/5 text-white border-white/15"
              }`}
            >
              ● Nur 4h Live bestätigt
            </button>
            {(canton !== "ALL" || query || onlyWhatsapp || onlyLive || maxChf > 0) && (
              <button
                type="button"
                onClick={() => {
                  setCanton("ALL");
                  setActiveWorld("all");
                  setQuery("");
                  setOnlyWhatsapp(false);
                  setOnlyLive(false);
                  setMaxChf(0);
                }}
                className="px-3 py-1.5 rounded-full bg-[#E11D48]/25 border border-[#FB7185]/40 text-xs font-bold text-white cursor-pointer"
              >
                ✕ Filter zurücksetzen
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
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
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#E11D48] to-[#BE123C] hover:opacity-95 text-white font-extrabold text-sm shadow-xl cursor-pointer"
            >
              Mehr Profile laden (+{Math.min(28, filtered.length - limit)} von {filtered.length - limit} weiteren)
            </button>
          </div>
        )}
      </main>

      {/* 5. DIE 10 WICHTIGSTEN SCHWEIZER PORTALE IM ÜBERBLICK & VERGLEICH */}
      <section id="portals-anchor" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <div className="relative rounded-3xl overflow-hidden bg-[#180D15] border border-[#E2B887]/30 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5 h-52 sm:h-60 rounded-2xl overflow-hidden border border-white/10">
            <img
              src="/images/ai/portals/compare-hero.webp"
              alt="Schweizer Portale im Vergleich"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-7 space-y-3">
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#E2B887] font-bold">
              Unabhängige Marktübersicht
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
              Die wichtigsten Erotik-Portale der Schweiz <span className="italic text-[#FB7185]">im Überblick.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#D8C5CD] leading-relaxed">
              Statt 10 Tabs gleichzeitig zu öffnen: Wir ordnen die bekanntesten Schweizer Plattformen und Agenturen transparent ein – und bündeln öffentlich verfügbare Inserate mit klarer 30/60-Min.-Honorarorientierung an einem Ort.
            </p>
            <div className="pt-1 flex flex-wrap gap-3">
              <Link
                href="/reviews"
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white text-xs font-extrabold no-underline"
              >
                Detaillierten Portalvergleich öffnen →
              </Link>
              <Link
                href="/pricing"
                className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-[#E2B887]/40 text-[#E2B887] text-xs font-bold no-underline"
              >
                CHF-Honorar-Kompass nach Kanton →
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {SWISS_TOP_10_PORTALS.map((p) => (
            <Link
              key={p.name}
              href="/reviews"
              className="group relative rounded-2xl overflow-hidden bg-[#160C14] border border-white/10 hover:border-[#E2B887]/70 flex flex-col justify-between no-underline transition"
            >
              <div className="relative h-28 overflow-hidden">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#160C14] via-[#160C14]/35 to-transparent" />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/75 text-[#E2B887] text-[10px] font-bold">
                  {p.badge}
                </span>
              </div>
              <div className="p-4 pt-2 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <h3 className="text-base font-serif font-bold text-white">{p.name}</h3>
                  <p className="text-[11px] text-[#C6B2BA] leading-relaxed mt-1">{p.desc}</p>
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold text-[#FB7185]">
                  <span>Prüfbericht & Einordnung</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. SO FUNKTIONIERT IWANTSEXNOW.CH (3 KLARE SCHRITTE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="rounded-3xl bg-[#150B13] border border-white/10 p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              So einfach funktioniert <span className="text-[#E11D48]">iwantsexnow.ch</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#BBA7B0] mt-1">In drei Berührungen ohne Tippen zum verifizierten Direktkontakt.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              ["1", "Antippen statt Tippen", "Wähle deinen Kanton und deine Wunsch-Kategorie per Bildkachel oder lass dich von KI-Begleiterin Xenia führen."],
              ["2", "Ehrlich vergleichen in CHF", "Sieh 30-Min.- und 60-Min.-Richtwerte, gebündelte Portal-Quellen und echte 4-Stunden-Live-Freigaben auf einen Blick."],
              ["3", "Direkt per +41 kontaktieren", "Schreibe direkt per Schweizer +41 WhatsApp oder rufe ohne Vermittlungsgebühr und ohne Zwischenhändler an."]
            ].map(([num, title, text]) => (
              <div key={num} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E11D48] to-[#9F1239] text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                  {num}
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">{title}</h3>
                  <p className="text-xs text-[#C6B2BA] leading-relaxed mt-1">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. XENIA — DEINE SMARTE BEGLEITERIN + CREATOR 0% EINLADUNG */}
      <section id="xenia-anchor" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Xenia Live-Dialog-Karte */}
        <div className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-[#230E1C] via-[#170B14] to-[#11080F] border border-[#E2B887]/45 p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#E2B887] shadow-[0_0_30px_rgba(225,29,72,0.4)] shrink-0">
              <img src="/images/ai/xenia-avatar.webp" alt="Xenia KI Begleiterin" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[11px] uppercase tracking-widest text-[#E2B887] font-bold">Zero-Typing KI-Begleiterin</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                <span className="text-[#FB7185]">Xenia</span> – dein smarter Schweizer Lotse.
              </h2>
              <p className="text-xs sm:text-sm text-[#DFCFD6] leading-relaxed">
                Tippe einfach eine Frage an – Xenia antwortet sofort mit echten Schweizer Marktdaten oder filtert dir die passenden Profile heraus:
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs sm:text-sm text-[#F5E9EE] leading-relaxed">
            💬 <strong className="text-[#E2B887]">Xenia:</strong> „{xeniaReply}“
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              [
                "Escorts in Zürich – direkt erreichbar?",
                () => {
                  setCanton("ZH");
                  setOnlyWhatsapp(true);
                  setXeniaReply(`Ich habe dir ${cantonCounts["ZH"] || 900}+ Einträge im Raum Zürich auf direkte +41 Erreichbarkeit gefiltert – scrolle einfach hoch oder klicke auf 'Zum Grid'.`);
                  scrollToGrid();
                }
              ],
              [
                "Was ist der Unterschied zwischen Escort & Tantra?",
                () =>
                  setXeniaReply(
                    "Klassisches Escort / GFE umfasst persönliche Begleitung, Hotel- oder Hausbesuche nach Zeitrahmen (30/60 Min. oder Dinner). Tantra-Ateliers fokussieren auf sinnliche Ganzkörper-Rituale und Öl-Massagen im eigenen Studio."
                  )
              ],
              [
                "Welche Honorare sind in Zug & Zürich üblich?",
                () =>
                  setXeniaReply(
                    "In Zürich und Zug liegen geprüfte Direkt-Honorare bei CHF 150–250 (30 Min.) und CHF 300–450 (60 Min.). Im Honorar-Kompass unter /pricing findest du alle 26 Kantone live berechnet."
                  )
              ]
            ].map(([label, fn], idx) => (
              <button
                key={idx}
                type="button"
                onClick={fn as any}
                className="px-3.5 py-2 rounded-full bg-white/10 hover:bg-[#E11D48] border border-white/15 text-xs font-semibold text-white transition cursor-pointer"
              >
                {label as string}
              </button>
            ))}
          </div>
        </div>

        {/* Anbieterinnen 0% Provision Karte */}
        <div className="lg:col-span-5 rounded-3xl bg-[#160C14] border border-white/15 p-6 sm:p-8 flex flex-col justify-between gap-5 relative overflow-hidden">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-bold">0% Buchungsprovision</span>
              <h3 className="text-2xl font-serif font-bold text-white">Du bietest an? Dein Profil, deine Preise.</h3>
              <ul className="space-y-1.5 text-xs text-[#D8C5CD] pt-1">
                <li>✓ Bestehendes Profil in 30 Sek. gratis übernehmen (Claim)</li>
                <li>✓ 1-Tap „Jetzt für 4h FREI“-Schalter auf dem Smartphone</li>
                <li>✓ 80% Auszahlung bei eigenem Paid-Vault & KI-Opt-In</li>
                <li>✓ Jederzeit kostenloses 1-Klick Opt-Out ohne Account-Zwang</li>
              </ul>
            </div>
            <img
              src="/images/ai/cta-creator.webp"
              alt="Dein Profil"
              loading="lazy"
              className="hidden sm:block w-28 h-28 rounded-2xl object-cover border border-[#E2B887]/40 shrink-0"
            />
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/create-post"
              className="flex-1 py-3 px-4 rounded-full bg-[#E2B887] hover:opacity-95 text-[#140B12] font-extrabold text-xs text-center no-underline"
            >
              Profil gratis aufgeben / übernehmen →
            </Link>
            <Link
              href="/report"
              className="py-3 px-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-rose-300 no-underline"
            >
              1-Klick Opt-Out
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}