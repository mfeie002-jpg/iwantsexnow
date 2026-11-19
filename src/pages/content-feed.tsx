import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
import { ListingGrid } from "@/components/listing/ListingCard";
import { toListing, type ListingProfile } from "@/lib/listing";
import offersData from "@/data/harvested-offers.json";

export default function ContentFeed() {
  const [canton, setCanton] = useState("ALL");
  const [serverStates, setServerStates] = useState<Record<string, any>>({});
  const [blockedIds, setBlockedIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/vault/metrics")
      .then((r) => r.json())
      .then((d) => {
        if (d?.states) setServerStates(d.states);
        if (Array.isArray(d?.blockedIds)) setBlockedIds(d.blockedIds);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const rows = useMemo(() => {
    if (!ready) return [];
    const blocked = new Set(blockedIds);
    const list: ListingProfile[] = [];
    for (const o of (offersData as any[]) || []) {
      const id = String(o.id || o.dedupClusterId || "");
      if (!id || blocked.has(id)) continue;
      const st = serverStates[id] || {};
      if (st.paused || st.hidden || st.removedByReport) continue;
      if (canton !== "ALL" && String(o.canton || "").toUpperCase() !== canton) continue;
      const item = toListing(o, st);
      if (!item || !item.photo) continue;
      list.push(item);
      if (list.length >= 12) break;
    }
    return list;
  }, [canton, ready, serverStates, blockedIds]);

  return (
    <div className="min-h-screen pb-24">
      <SEO title="Verzeichnis-Feed | iwantsexnow.ch" description="Einträge mit Foto aus dem Schweizer Verzeichnis." url="https://iwantsexnow.ch/content-feed" />
      <LuxuryHeader />
      <PageIntro
        note="Aus dem Index"
        art="search"
        title={<>Einträge mit Foto</>}
        lead="Zwölf Profile aus dem Verzeichnis, gefiltert nach Kanton. Keine erfundenen Abos oder Zähler."
      >
        <Link href="/search" className="text-link">
          Ganze Suche
        </Link>
      </PageIntro>
      <main className="sheet">
        <form className="filter-bar" onSubmit={(e) => e.preventDefault()}>
          <label>
            Kanton
            <select value={canton} onChange={(e) => setCanton(e.target.value)} aria-label="Kanton">
              {["ALL", "ZH", "ZG", "LU", "BE", "BS", "GE", "VD", "TI"].map((code) => (
                <option key={code} value={code}>
                  {code === "ALL" ? "Ganze Schweiz" : code}
                </option>
              ))}
            </select>
          </label>
        </form>
        {!ready ? (
          <p className="listing-empty">Verfügbarkeit wird geprüft…</p>
        ) : rows.length === 0 ? (
          <div className="empty-panel">
            <img src="/editorial/editorial-alps.jpg" alt="" />
            <div>
              <h2>In diesem Kanton kein Foto in der ersten Auswahl.</h2>
              <Link href="/search" className="text-link">
                Suche öffnen
              </Link>
            </div>
          </div>
        ) : (
          <ListingGrid profiles={rows} />
        )}
      </main>
    </div>
  );
}
