import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
import { ListingGrid } from "@/components/listing/ListingCard";
import { countLabel, toListing, type ListingProfile } from "@/lib/listing";
import offersData from "@/data/harvested-offers.json";

const RUBRICS = [
  { id: "ALL", label: "Alle Arten" },
  { id: "female", label: "Escort & Begleitung" },
  { id: "massage", label: "Tantra & Massage" },
  { id: "bdsm", label: "Domina & BDSM" },
  { id: "trans", label: "Trans" },
];

export default function DeepSearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [canton, setCanton] = useState("ALL");
  const [rubric, setRubric] = useState("ALL");
  const [maxPrice, setMaxPrice] = useState(1200);
  const [onlyFree, setOnlyFree] = useState(false);
  const [sortBy, setSortBy] = useState<"photo" | "price_asc" | "price_desc" | "available">("photo");
  const [limit, setLimit] = useState(24);
  const [hydrated, setHydrated] = useState(false);
  const [serverStates, setServerStates] = useState<Record<string, any>>({});
  const [blockedIds, setBlockedIds] = useState<string[]>([]);
  const [metricsReady, setMetricsReady] = useState(false);

  useEffect(() => {
    fetch("/api/vault/metrics")
      .then((r) => r.json())
      .then((d) => {
        if (d?.states) setServerStates(d.states);
        if (Array.isArray(d?.blockedIds)) setBlockedIds(d.blockedIds);
      })
      .catch(() => {})
      .finally(() => setMetricsReady(true));
  }, []);

  useEffect(() => {
    if (!router.isReady || hydrated) return;
    const q = router.query;
    setQuery(typeof q.q === "string" ? q.q : "");
    setCanton(typeof q.canton === "string" && q.canton ? q.canton.toUpperCase() : "ALL");
    setRubric(typeof q.rubric === "string" && q.rubric ? q.rubric : "ALL");
    const max = Number(q.max);
    setMaxPrice(Number.isFinite(max) && max > 0 ? max : 1200);
    setOnlyFree(q.free === "1");
    const sort = String(q.sort || "");
    if (sort === "price_asc" || sort === "price_desc" || sort === "available" || sort === "photo") setSortBy(sort);
    setHydrated(true);
  }, [router.isReady, router.query, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const next: Record<string, string> = {};
    if (query.trim()) next.q = query.trim();
    if (canton !== "ALL") next.canton = canton;
    if (rubric !== "ALL") next.rubric = rubric;
    if (maxPrice < 1200) next.max = String(maxPrice);
    if (onlyFree) next.free = "1";
    if (sortBy !== "photo") next.sort = sortBy;
    router.replace({ pathname: "/search", query: next }, undefined, { shallow: true });
    setLimit(24);
    // router.replace identity changes; hydrated gate avoids a loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, canton, rubric, maxPrice, onlyFree, sortBy, hydrated]);

  const cantons = useMemo(() => {
    const set = new Set<string>();
    for (const o of (offersData as any[]) || []) {
      const code = String(o?.canton || "").toUpperCase();
      if (code) set.add(code);
    }
    return Array.from(set).sort();
  }, []);

  const results: ListingProfile[] = useMemo(() => {
    if (!metricsReady) return [];
    const blocked = new Set(blockedIds);
    const list: { item: ListingProfile; score: number }[] = [];
    for (const o of (offersData as any[]) || []) {
      const id = String(o.id || o.dedupClusterId || "");
      if (!id || blocked.has(id)) continue;
      const st = serverStates[id] || {};
      if (st.paused || st.hidden || st.removedByReport) continue;
      if (canton !== "ALL" && String(o.canton || "").toUpperCase() !== canton) continue;
      if (rubric !== "ALL" && (o.rubric || "female") !== rubric) continue;
      const item = toListing(o, st);
      if (!item) continue;
      if (onlyFree && !item.available) continue;
      if (item.rate60 > maxPrice) continue;
      if (query.trim()) {
        const hay = [o.rawName, o.city, o.canton, o.hairColor, o.cupSize, ...(o.includedTags || [])]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(query.trim().toLowerCase())) continue;
      }
      list.push({ item, score: Number(o.curationScore) || 0 });
    }
    list.sort((a, b) => {
      if (sortBy === "price_asc") return a.item.rate60 - b.item.rate60;
      if (sortBy === "price_desc") return b.item.rate60 - a.item.rate60;
      if (sortBy === "available") return Number(b.item.available) - Number(a.item.available) || b.score - a.score;
      const aPhoto = a.item.photo ? 1 : 0;
      const bPhoto = b.item.photo ? 1 : 0;
      if (aPhoto !== bPhoto) return bPhoto - aPhoto;
      return b.score - a.score;
    });
    return list.map((row) => row.item);
  }, [query, canton, rubric, maxPrice, onlyFree, sortBy, metricsReady, serverStates, blockedIds]);

  return (
    <div className="min-h-screen pb-24">
      <SEO
        title="Suche · Schweizer Profile nach Ort, Art und CHF-Preis | iwantsexnow.ch"
        description="Profile in der Schweiz filtern nach Kanton, Art, 30- und 60-Minuten-Preis und bestätigter Verfügbarkeit. Direkter +41 Kontakt."
        url="https://iwantsexnow.ch/search"
      />
      <LuxuryHeader />
      <PageIntro
        tone="himmel"
        note="Verzeichnis"
        art="search"
        title={<>{countLabel(results.length)} Einträge</>}
        lead="Name, Stadt, Kanton, Art und Preisgrenze. Die Preise sind die 30- und 60-Minuten-Angaben aus dem Eintrag."
      />

      <main className="sheet">
        <form
          className="filter-bar"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label>
            Name oder Stadt
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="z. B. Zürich, Tantra, Vorname"
              aria-label="Name, Stadt oder Stichwort"
            />
          </label>
          <label>
            Kanton
            <select value={canton} onChange={(e) => setCanton(e.target.value)} aria-label="Kanton">
              <option value="ALL">Ganze Schweiz</option>
              {cantons.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </label>
          <label>
            Art
            <select value={rubric} onChange={(e) => setRubric(e.target.value)} aria-label="Art">
              {RUBRICS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Bis, 60 Min.
            <select value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} aria-label="Maximaler 60-Minuten-Preis">
              <option value={1200}>Alle Preise</option>
              <option value={250}>CHF 250</option>
              <option value={350}>CHF 350</option>
              <option value={500}>CHF 500</option>
            </select>
          </label>
          <label>
            Sortierung
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} aria-label="Sortierung">
              <option value="photo">Mit Foto zuerst</option>
              <option value="available">Zuerst als frei markiert</option>
              <option value="price_asc">Preis aufsteigend</option>
              <option value="price_desc">Preis absteigend</option>
            </select>
          </label>
          <label className="check-line">
            <input type="checkbox" checked={onlyFree} onChange={(e) => setOnlyFree(e.target.checked)} />
            Nur in den letzten 4 Stunden bestätigt
          </label>
          <button
            type="button"
            className="text-link"
            onClick={() => {
              setQuery("");
              setCanton("ALL");
              setRubric("ALL");
              setMaxPrice(1200);
              setOnlyFree(false);
              setSortBy("photo");
            }}
          >
            Zurücksetzen
          </button>
        </form>

        {!metricsReady ? <p className="listing-empty">Verfügbarkeit wird geprüft…</p> : <ListingGrid profiles={results.slice(0, limit)} />}

        {limit < results.length && (
          <p className="band-more">
            <button type="button" className="brass-button" onClick={() => setLimit((n) => n + 24)}>
              Weitere {Math.min(24, results.length - limit)} zeigen
            </button>
          </p>
        )}
      </main>
    </div>
  );
}
