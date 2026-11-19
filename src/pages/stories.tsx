import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
import { ListingGrid } from "@/components/listing/ListingCard";
import { toListing, type ListingProfile } from "@/lib/listing";
import offersData from "@/data/harvested-offers.json";

export default function StoriesFeedPage() {
  const [serverStates, setServerStates] = useState<Record<string, any>>({});
  const [blockedIds, setBlockedIds] = useState<string[]>([]);
  const [cantonFilter, setCantonFilter] = useState("ALL");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/vault/metrics")
      .then((r) => r.json())
      .then((d) => {
        if (d?.states) setServerStates(d.states);
        if (Array.isArray(d?.blockedIds)) setBlockedIds(d.blockedIds);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const stories = useMemo(() => {
    if (!loaded) return [];
    const blocked = new Set(blockedIds);
    const rows: ListingProfile[] = [];
    for (const o of (offersData as any[]) || []) {
      const id = String(o.id || o.dedupClusterId || "");
      if (!id || blocked.has(id)) continue;
      const st = serverStates[id] || {};
      if (st.paused || st.hidden || st.removedByReport) continue;
      if (!st.availabilityConfirmed) continue;
      if (cantonFilter !== "ALL" && String(o.canton || "").toUpperCase() !== cantonFilter) continue;
      const item = toListing(o, st);
      if (!item) continue;
      rows.push(item);
      if (rows.length >= 24) break;
    }
    return rows;
  }, [serverStates, blockedIds, cantonFilter, loaded]);

  const cantons = ["ALL", "ZG", "ZH", "LU", "BS", "BE", "GE", "VD", "TI"];

  return (
    <div className="min-h-screen pb-24">
      <SEO
        title="24h Live-Stories & Echtzeit-Updates Schweizer Escorts (Zug, Zürich, Luzern) | iwantsexnow.ch"
        description="Aktuelle 24h-Stories, 4-Stunden-Verfügbarkeits-Impulse und neue Paid-Vault-Uploads verifizierter Schweizer Profile in Echtzeit."
        url="https://iwantsexnow.ch/stories"
      />
      <LuxuryHeader />
      <PageIntro
        note="Nur bestätigte Angaben"
        art="search"
        title={<>Was gerade im Verzeichnis steht</>}
        lead="Nur Profile, deren 4-Stunden-Fenster im Cockpit noch läuft. Abgelaufene Angaben aus dem Index zählen nicht."
      >
        <Link href="/register" className="brass-button">
          Eigenes Profil
        </Link>
      </PageIntro>
      <main className="sheet">
        <div className="filter-bar">
          <label>
            Kanton
            <select value={cantonFilter} onChange={(e) => setCantonFilter(e.target.value)} aria-label="Kanton">
              {cantons.map((code) => (
                <option key={code} value={code}>
                  {code === "ALL" ? "Ganze Schweiz" : code}
                </option>
              ))}
            </select>
          </label>
        </div>
        {!loaded ? (
          <p className="listing-empty">Status wird geladen…</p>
        ) : stories.length === 0 ? (
          <div className="empty-panel">
            <img src="/editorial/editorial-zurich.jpg" alt="" />
            <div>
              <h2>Im Moment keine bestätigte Verfügbarkeit.</h2>
              <p className="dek">Das Verzeichnis selbst ist in der Suche.</p>
              <Link href="/search" className="text-link">
                Alle Einträge
              </Link>
            </div>
          </div>
        ) : (
          <ListingGrid profiles={stories} />
        )}
      </main>
    </div>
  );
}
