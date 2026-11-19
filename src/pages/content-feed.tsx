import { useMemo, useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
import { ListingGrid } from "@/components/listing/ListingCard";
import { toListing, type ListingProfile } from "@/lib/listing";
import offersData from "@/data/harvested-offers.json";

export default function ContentFeed() {
  const [canton, setCanton] = useState("ALL");
  const rows = useMemo(() => {
    const list: ListingProfile[] = [];
    for (const o of (offersData as any[]) || []) {
      if (canton !== "ALL" && String(o.canton || "").toUpperCase() !== canton) continue;
      const item = toListing(o);
      if (!item || !item.photo) continue;
      list.push(item);
      if (list.length >= 12) break;
    }
    return list;
  }, [canton]);

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
        {rows.length === 0 ? (
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
