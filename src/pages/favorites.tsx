import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
import { ListingGrid } from "@/components/listing/ListingCard";
import { toListing, type ListingProfile } from "@/lib/listing";
import offersData from "@/data/harvested-offers.json";

export default function FavoritesPage() {
  const [favIds, setFavIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [cantonFilter, setCantonFilter] = useState("ALL");

  useEffect(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem("ch_favorite_profiles") || "[]");
      setFavIds(Array.isArray(parsed) ? parsed.map(String) : []);
    } catch {
      setFavIds([]);
    }
    setReady(true);
  }, []);

  const updateFavs = (next: string[]) => {
    setFavIds(next);
    try {
      localStorage.setItem("ch_favorite_profiles", JSON.stringify(next));
      window.dispatchEvent(new Event("ch-favorites-updated"));
    } catch {}
  };

  const all = useMemo(() => {
    return ((offersData as any[]) || [])
      .map((o) => toListing(o))
      .filter((p): p is ListingProfile => Boolean(p));
  }, []);

  const saved = all.filter((p) => favIds.includes(p.id));
  const suggestions = all
    .filter((p) => !favIds.includes(p.id) && (cantonFilter === "ALL" || p.canton === cantonFilter))
    .slice(0, 8);
  const cantons = Array.from(new Set(all.map((p) => p.canton))).sort();

  return (
    <div className="min-h-screen pb-24">
      <SEO
        title="Meine Schweizer Favoriten & Merkliste (Zero-Trace lokal gespeichert) | iwantsexnow.ch"
        description="Verwalte deine gespeicherten Schweizer Escort- & Massage-Favoriten anonym auf deinem Gerät und vergleiche Honorare & Attribute mit 1 Klick."
        url="https://iwantsexnow.ch/favorites"
      />
      <LuxuryHeader />
      <PageIntro
        note="Nur auf diesem Gerät"
        art="compare"
        title={<>Merkliste</>}
        lead="Gespeichert bleibt die Liste im Browser. Es wird kein Konto angelegt."
      >
        <Link href="/compare-escorts" className="brass-button">
          Vergleich öffnen
        </Link>
        {saved.length > 0 && (
          <button type="button" className="text-link" onClick={() => updateFavs([])}>
            Liste leeren
          </button>
        )}
      </PageIntro>

      <main className="sheet">
        {!ready ? <p className="listing-empty">Merkliste wird gelesen…</p> : null}
        {ready && saved.length === 0 ? (
          <div className="empty-panel">
            <img src="/editorial/editorial-alps.jpg" alt="" />
            <div>
              <h2>Noch nichts gemerkt.</h2>
              <p className="dek">Auf einem Profil «Merken» wählen, oder unten einen Eintrag dazunehmen.</p>
              <Link href="/search" className="text-link">
                Zur Suche
              </Link>
            </div>
          </div>
        ) : (
          <ListingGrid profiles={saved} />
        )}

        <div className="band-head">
          <h2>Dazu nehmen</h2>
          <div className="filter-bar" style={{ margin: 0, border: 0, padding: 0 }}>
            <label>
              Kanton
              <select value={cantonFilter} onChange={(e) => setCantonFilter(e.target.value)} aria-label="Kanton für Vorschläge">
                <option value="ALL">Alle</option>
                {cantons.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <ul className="place-list">
          {suggestions.map((p) => (
            <li key={p.id}>
              <div>
                <p className="listing-place">
                  {p.city} <span>{p.canton}</span>
                </p>
                <h2>
                  <Link href={"/profile/" + encodeURIComponent(p.id)}>{p.name}</Link>
                </h2>
              </div>
              <button type="button" className="text-link" onClick={() => updateFavs([p.id, ...favIds])}>
                Merken
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
