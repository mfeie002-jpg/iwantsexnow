import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { SwissDoorplate } from "@/components/SwissDoorplate";
import offersData from "@/data/harvested-offers.json";
import { Search, Crown, MessageCircle, User, Sparkles, RotateCcw } from "lucide-react";

const CANTONS = ["ALL", "ZG", "ZH", "LU", "BS", "BE", "AG", "SG", "GE", "VD", "TI", "VS", "FR", "NE", "SO", "GR", "TG", "SZ"];

export default function DeepSearchPage() {
  const [query, setQuery] = useState("");
  const [canton, setCanton] = useState("ALL");
  const [rubric, setRubric] = useState("ALL");
  const [maxPrice, setMaxPrice] = useState(1200);
  const [onlyFree, setOnlyFree] = useState(false);
  const [limit, setLimit] = useState(24);

  const results = useMemo(() => {
    const raw = (offersData as any[]) || [];
    const list: any[] = [];

    for (const o of raw) {
      const pid = o.id || o.dedupClusterId;
      if (!pid) continue;
      const r60 = Math.max(100, Math.min(1200, Number(o.advertisedBaseChf) || 350));
      const r30 = Math.max(80, Math.min(800, Number(o.rate30Chf) || Math.round((r60 * 0.6) / 10) * 10));
      const isAvail = Boolean(o.availabilityConfirmed);
      const rawThumb = String(o.thumbnail || "").trim();
      const hasRealPhoto =
        rawThumb.startsWith("http") &&
        !rawThumb.includes("unsplash.com") &&
        !rawThumb.includes("placeholder") &&
        !rawThumb.includes("escort-portrait") &&
        !rawThumb.endsWith(".svg");

      if (canton !== "ALL" && String(o.canton || "").toUpperCase() !== canton) continue;
      if (rubric !== "ALL" && (o.rubric || "female") !== rubric) continue;
      if (onlyFree && !isAvail) continue;
      if (r60 > maxPrice) continue;

      if (query.trim()) {
        const q = query.toLowerCase();
        const hay = [o.rawName, o.city, o.canton, o.hairColor, o.cupSize, ...(o.includedTags || [])]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) continue;
      }

      const cleanTitle = String(o.rawName || "VALENTINA")
        .replace(/^[\W_]+/, "")
        .split(/[·|-]/)[0]
        .trim()
        .slice(0, 22);

      list.push({
        ...o,
        id: pid,
        cleanTitle: cleanTitle || "VALENTINA",
        rate60Chf: r60,
        rate30Chf: r30,
        isAvail,
        hasRealPhoto,
        cleanThumb: rawThumb.replace(/[?&]iwsn_clean=1.*$/i, ""),
      });
    }

    list.sort((a, b) => {
      if (a.hasRealPhoto !== b.hasRealPhoto) return a.hasRealPhoto ? -1 : 1;
      return Number(b.curationScore || 80) - Number(a.curationScore || 80);
    });

    return list;
  }, [query, canton, rubric, maxPrice, onlyFree]);

  return (
    <div className="min-h-screen bg-[#070606] text-[#F5EFE6] pb-24">
      <SEO
        title="Deep-Filter Suche · 2'529 Schweizer Suiten & Dossiers | iwantsexnow.ch"
        description="Durchsuchen Sie 2'529+ verifizierte Schweizer Escort-, Tantra- und Studio-Dossiers nach Kanton, 30m/60m CHF-Honorar und Live-Status."
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <section className="penthouse-panel p-5 sm:p-6 rounded-[24px] border border-[#C8A97E]/40 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#C8A97E]/20 pb-3.5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#DEC393] font-bold">
                SWISS DEEP-FILTER ENGINE
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif text-[#EAD2AA] mt-0.5">
                Präzisions-Suche über {results.length} Schweizer Suiten
              </h1>
            </div>
            <SwissDoorplate state="FREI" roomNumber="CH" customLabel={results.length + " TREFFER"} size="sm" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="lg:col-span-2 relative">
              <Search size={14} className="absolute left-3.5 top-3 text-[#DEC393]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name, Stadt, PLZ (6300, 8001), Service (GFE, Tantra)..."
                className="w-full pl-9 pr-3 py-2.5 rounded-full bg-black/75 border border-[#C8A97E]/35 text-xs text-white placeholder-[#8E8271] focus:border-[#EAD2AA] outline-none"
              />
            </div>

            <select
              value={canton}
              onChange={(e) => setCanton(e.target.value)}
              className="rounded-full bg-black/75 border border-[#C8A97E]/35 px-4 py-2.5 text-xs font-mono font-bold text-[#EAD2AA] outline-none cursor-pointer"
            >
              {CANTONS.map((c) => (
                <option key={c} value={c} className="bg-[#100D0B]">
                  {c === "ALL" ? "KANTON: GANZE SCHWEIZ" : "KANTON: " + c}
                </option>
              ))}
            </select>

            <select
              value={rubric}
              onChange={(e) => setRubric(e.target.value)}
              className="rounded-full bg-black/75 border border-[#C8A97E]/35 px-4 py-2.5 text-xs font-mono font-bold text-[#EAD2AA] outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#100D0B]">RUBRIK: ALLE</option>
              <option value="female" className="bg-[#100D0B]">ELITE ESCORT & GFE</option>
              <option value="massage" className="bg-[#100D0B]">TANTRA & MASSAGE</option>
              <option value="bdsm" className="bg-[#100D0B]">DOMINA & BDSM</option>
              <option value="trans" className="bg-[#100D0B]">TRANS VIP</option>
            </select>

            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="rounded-full bg-black/75 border border-[#C8A97E]/35 px-4 py-2.5 text-xs font-mono font-bold text-[#EAD2AA] outline-none cursor-pointer"
            >
              <option value={1200} className="bg-[#100D0B]">HONORAR: ALLE CHF</option>
              <option value={250} className="bg-[#100D0B]">MAX. CHF 250 / 60M</option>
              <option value={350} className="bg-[#100D0B]">MAX. CHF 350 / 60M</option>
              <option value={500} className="bg-[#100D0B]">MAX. CHF 500 / 60M</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={() => setOnlyFree(!onlyFree)}
              className="cursor-pointer"
            >
              <SwissDoorplate
                state={onlyFree ? "FREI" : "RESERVIERT"}
                roomNumber="LIVE"
                customLabel={onlyFree ? "NUR FREI (4H) AKTIV" : "NUR FREI (4H) FILTERN"}
                size="sm"
              />
            </button>

            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCanton("ALL");
                setRubric("ALL");
                setMaxPrice(1200);
                setOnlyFree(false);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#C8B9A6] hover:text-[#EAD2AA] cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>FILTER ZURÜCKSETZEN</span>
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {results.slice(0, limit).map((p: any, idx: number) => {
            const cleanDigits = p.rawPhone ? String(p.rawPhone).replace(/\D/g, "") : "";
            return (
              <div
                key={p.id}
                className="valentina-outer-card rounded-[26px] overflow-hidden flex flex-col justify-between group p-2.5"
              >
                <div className="relative rounded-[20px] overflow-hidden border border-[#C8A97E]/35 bg-[#070505] flex-1 flex flex-col justify-between">
                  <Link href={"/profile/" + encodeURIComponent(p.id)} className="darkroom-stage block aspect-[3/4.1] w-full">
                    {p.hasRealPhoto ? (
                      <img
                        referrerPolicy="no-referrer"
                        src={p.cleanThumb}
                        alt={p.cleanTitle}
                        loading={idx < 8 ? "eager" : "lazy"}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                        className="darkroom-img"
                      />
                    ) : null}
                    <div className="darkroom-vignette" />
                    <div className="darkroom-floor" />

                    <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-black/75 border border-[#C8A97E]/55 flex items-center justify-center text-[#DEC393]">
                        <Crown size={13} />
                      </div>
                      <SwissDoorplate
                        state={p.isAvail ? "FREI" : "RESERVIERT"}
                        roomNumber={p.canton || "CH"}
                        customLabel={p.isAvail ? "FREI" : "SUITE"}
                        size="sm"
                      />
                    </div>

                    <div className="absolute inset-x-0 bottom-2 z-10 px-4 text-center flex flex-col items-center">
                      <h3 className="font-serif text-xl tracking-[0.14em] uppercase text-[#EAD2AA] truncate max-w-full">
                        {p.cleanTitle}
                      </h3>
                      <div className="text-[9px] font-sans font-semibold tracking-[0.26em] uppercase text-[#C8B69E] mt-1 truncate max-w-full">
                        • {p.city} ({p.canton}) •
                      </div>
                      <div className="font-serif font-mono text-2xl text-[#EAD2AA] mt-1">
                        CHF {p.rate60Chf}
                      </div>
                      <div className="text-[8px] font-mono tracking-[0.2em] uppercase text-[#9E8C74]">
                        60 MIN · (30M: CHF {p.rate30Chf})
                      </div>
                    </div>
                  </Link>

                  <div className="px-3.5 pb-3.5 pt-2 bg-[#070505] grid grid-cols-2 gap-2.5">
                    {cleanDigits ? (
                      <a
                        href={"https://wa.me/" + cleanDigits}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="brass-3d py-2.5 px-3 rounded-full border border-[#F5E3B8]/65 font-sans font-extrabold text-[10px] tracking-[0.15em] uppercase flex items-center justify-center gap-1.5"
                      >
                        <MessageCircle size={12} />
                        <span>WHATSAPP</span>
                      </a>
                    ) : (
                      <Link
                        href={"/fantasy-preview?id=" + encodeURIComponent(p.id)}
                        className="brass-3d py-2.5 px-3 rounded-full border border-[#F5E3B8]/65 font-sans font-extrabold text-[10px] tracking-[0.15em] uppercase flex items-center justify-center gap-1.5"
                      >
                        <Sparkles size={12} />
                        <span>PREVIEW</span>
                      </Link>
                    )}
                    <Link
                      href={"/profile/" + encodeURIComponent(p.id)}
                      className="emerald-3d py-2.5 px-3 rounded-full border border-[#C8A97E]/45 font-sans font-bold text-[10px] tracking-[0.14em] uppercase flex items-center justify-center gap-1.5"
                    >
                      <User size={12} className="text-[#DEC393]" />
                      <span>DOSSIER</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {limit < results.length && (
          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => setLimit((prev) => prev + 24)}
              className="brass-3d px-8 py-3 rounded-full border border-[#F5E3B8]/65 text-xs font-mono font-extrabold tracking-[0.2em] uppercase cursor-pointer"
            >
              + 24 WEITERE SUITEN ANZEIGEN
            </button>
          </div>
        )}
      </main>
    </div>
  );
}