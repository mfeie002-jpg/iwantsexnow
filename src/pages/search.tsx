import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import offersData from "@/data/harvested-offers.json";
import { Search, MapPin, RotateCcw, SlidersHorizontal, Sparkles } from "lucide-react";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85";

export default function DeepAttributeSearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [canton, setCanton] = useState("ALL");
  const [rubric, setRubric] = useState("ALL");
  const [ageGroup, setAgeGroup] = useState("ALL");
  const [hairColor, setHairColor] = useState("ALL");
  const [maxPrice60, setMaxPrice60] = useState<number>(1000);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.q) setQuery(String(router.query.q));
    if (router.query.canton) setCanton(String(router.query.canton).toUpperCase());
    if (router.query.rubric) setRubric(String(router.query.rubric));
  }, [router.isReady, router.query]);

  const filtered = useMemo(() => {
    const all = (offersData as any[]) || [];
    return all.filter((p) => {
      if (canton !== "ALL" && String(p.canton || "").toUpperCase() !== canton) return false;
      if (rubric !== "ALL" && (p.rubric || "female") !== rubric) return false;
      if (hairColor !== "ALL" && String(p.hairColor || "") !== hairColor) return false;
      if (Number(p.advertisedBaseChf || 350) > maxPrice60) return false;

      const age = Number(p.age) || 25;
      if (ageGroup === "18-24" && (age < 18 || age > 24)) return false;
      if (ageGroup === "25-30" && (age < 25 || age > 30)) return false;
      if (ageGroup === "31+" && age < 31) return false;

      if (query.trim()) {
        const q = query.toLowerCase().trim();
        const hay = `${p.rawName || ""} ${p.city || ""} ${p.canton || ""} ${(p.includedTags || []).join(" ")} ${p.bio || ""} ${p.rawPhone || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [query, canton, rubric, ageGroup, hairColor, maxPrice60]);

  const pageItems = useMemo(() => filtered.slice((page - 1) * 48, page * 48), [filtered, page]);

  const resetAll = () => {
    setQuery("");
    setCanton("ALL");
    setRubric("ALL");
    setAgeGroup("ALL");
    setHairColor("ALL");
    setMaxPrice60(1000);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO
        title="Schweizer Escort-Suche mit Deep-Filter (Kanton, Alter, Haare, Körbchen, CHF-Tarif) | iwantsexnow.ch"
        description="Durchsuche alle 2.526 Schweizer Escort-, Tantra-, Massage- und BDSM-Profile nach Kanton, Rubrik, Alter, Haarfarbe, Körbchengrösse und 30m/60m CHF-Richtpreis."
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="p-6 rounded-2xl bg-[#121722] border border-white/10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#C8A97E] font-bold">
                SCHWEIZER DEEP-FILTER & ATTRIBUT-SUCHE (24 KANTONE)
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-0.5">
                {filtered.length.toLocaleString("de-CH")} passende Schweizer Profile
              </h1>
            </div>
            <button
              type="button"
              onClick={resetAll}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={13} /> Alle Filter zurücksetzen
            </button>
          </div>

          {/* 6-Spalten Power-Filter (wie xdate/and6, aber moderner & schneller) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <div className="lg:col-span-2 flex items-center bg-[#0D111A] border border-white/15 rounded-xl px-3.5">
              <Search size={15} className="text-[#C8A97E] shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Name, Ort, Service (GFE, Tantra, Duo) oder +41..."
                className="w-full py-2.5 px-2.5 bg-transparent text-xs text-white focus:outline-none"
              />
            </div>

            <select
              value={rubric}
              onChange={(e) => { setRubric(e.target.value); setPage(1); }}
              className="px-3 py-2.5 rounded-xl bg-[#0D111A] border border-white/15 text-xs text-white font-semibold"
            >
              <option value="ALL">Alle Rubriken (2.526)</option>
              <option value="female">💃 Escort Girls & Privat</option>
              <option value="massage">💆‍♀️ Tantra & Erotik-Massage</option>
              <option value="bdsm">⛓️ Domina & BDSM</option>
              <option value="trans">🏳️‍⚧️ Trans / TS</option>
            </select>

            <select
              value={canton}
              onChange={(e) => { setCanton(e.target.value); setPage(1); }}
              className="px-3 py-2.5 rounded-xl bg-[#0D111A] border border-white/15 text-xs text-white font-semibold"
            >
              <option value="ALL">🇨🇭 Alle 24 Kantone</option>
              {["ZG","ZH","GE","VD","BS","BL","BE","LU","AG","SG","SO","TI","VS","FR","NE","TG","SZ","GR","SH"].map((c) => (
                <option key={c} value={c}>Kanton {c}</option>
              ))}
            </select>

            <select
              value={ageGroup}
              onChange={(e) => { setAgeGroup(e.target.value); setPage(1); }}
              className="px-3 py-2.5 rounded-xl bg-[#0D111A] border border-white/15 text-xs text-white font-semibold"
            >
              <option value="ALL">Jedes Alter (18+)</option>
              <option value="18-24">18 – 24 Jahre</option>
              <option value="25-30">25 – 30 Jahre</option>
              <option value="31+">31+ Jahre (MILF / Lady)</option>
            </select>

            <select
              value={hairColor}
              onChange={(e) => { setHairColor(e.target.value); setPage(1); }}
              className="px-3 py-2.5 rounded-xl bg-[#0D111A] border border-white/15 text-xs text-white font-semibold"
            >
              <option value="ALL">Alle Haarfarben</option>
              <option value="Blond">Blond</option>
              <option value="Brünett">Brünett</option>
              <option value="Schwarz">Schwarz</option>
              <option value="Braun">Braun</option>
              <option value="Rot">Rot</option>
            </select>
          </div>

          {/* 2D SEO Quick-Links (Stadt x Service) */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10 text-[11px]">
            <span className="text-[#C8A97E] font-bold">Beliebte Schweizer Direkt-Kombinationen:</span>
            {[
              { label: "GFE Escort Zug", href: "/kategorie/zug/girlfriend-experience" },
              { label: "GFE Escort Zürich", href: "/kategorie/zuerich/girlfriend-experience" },
              { label: "Erotische Massage Zürich", href: "/kategorie/zuerich/erotische-massage" },
              { label: "Tantra Massage Zug", href: "/kategorie/zug/tantra-massage" },
              { label: "Hotel Outcall Zürich", href: "/kategorie/zuerich/hotelbesuch-outcall" },
              { label: "Domina & BDSM Zürich", href: "/kategorie/zuerich/domina-bdsm" },
              { label: "Escort Genève (FR)", href: "/kategorie/geneve/girlfriend-experience" },
              { label: "Escort Lugano (IT)", href: "/kategorie/lugano/girlfriend-experience" },
            ].map((lnk) => (
              <Link
                key={lnk.href}
                href={lnk.href}
                className="px-2.5 py-1 rounded-lg bg-[#0D111A] border border-white/10 hover:border-[#C8A97E] text-gray-300 hover:text-white"
              >
                {lnk.label} →
              </Link>
            ))}
          </div>
        </div>

        {/* Ergebnis-Raster */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pageItems.map((p: any, idx: number) => {
            const cleanName = String(p.rawName || "Profil").replace(/[^\w\säöüÄÖÜéèà-]/g, "").trim().slice(0, 26) || "Profil";
            const img = p.thumbnail || FALLBACK_IMG;
            return (
              <article
                key={`${p.id}-${idx}`}
                className="rounded-2xl overflow-hidden bg-[#121722] border border-white/10 hover:border-[#C8A97E] transition flex flex-col justify-between"
              >
                <Link href={`/profile/${encodeURIComponent(p.id)}`} className="relative aspect-[3/4] block bg-black">
                  <img referrerPolicy="no-referrer" src={img}
                    alt={cleanName}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG; }}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/25" />
                  <div className="absolute top-2.5 left-2.5 flex gap-1">
                    <span className="px-2 py-0.5 rounded bg-black/80 border border-[#C8A97E]/40 text-[#C8A97E] text-[10px] font-bold">
                      {p.age || 24} J. · {p.cupSize || "75C"} · {p.hairColor || "Brünett"}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="text-sm sm:text-base font-serif font-bold text-white truncate">{cleanName}</h2>
                      <p className="text-[11px] text-gray-300 flex items-center gap-1 truncate">
                        <MapPin size={11} className="text-[#C8A97E]" /> {p.city} ({p.canton})
                      </p>
                    </div>
                    <div className="bg-black/85 px-2.5 py-1 rounded-lg border border-[#C8A97E]/40 text-xs font-extrabold text-[#C8A97E] shrink-0">
                      CHF {p.advertisedBaseChf || 350}
                    </div>
                  </div>
                </Link>
                <div className="p-3 flex items-center justify-between text-[11px] text-gray-400 border-t border-white/10">
                  <span className="truncate">{(p.includedTags || ["Incall", "Outcall"]).slice(0, 2).join(" · ")}</span>
                  <Link href={`/profile/${encodeURIComponent(p.id)}`} className="text-white font-bold hover:text-[#C8A97E] shrink-0">
                    Details →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {filtered.length > 48 && (
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 rounded-xl bg-[#121722] border border-white/15 text-xs disabled:opacity-40 cursor-pointer"
            >
              ← Vorherige 48
            </button>
            <span className="text-xs text-gray-400">Seite {page} von {Math.ceil(filtered.length / 48)}</span>
            <button
              disabled={page * 48 >= filtered.length}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-xl bg-[#C8A97E] text-[#0D111A] font-extrabold text-xs disabled:opacity-40 cursor-pointer"
            >
              Nächste 48 →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}