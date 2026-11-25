import { useEffect, useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
import { ListingGrid } from "@/components/listing/ListingCard";
import { toListing, type ListingProfile } from "@/lib/listing";
import offersData from "@/data/harvested-offers.json";

export default function AccountSettings() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem("ch_favorite_profiles") || "[]");
      setIds(Array.isArray(parsed) ? parsed.map(String) : []);
    } catch {
      setIds([]);
    }
  }, []);

  const saved = ((offersData as any[]) || [])
    .map((o) => toListing(o))
    .filter((p): p is ListingProfile => Boolean(p) && ids.includes(p.id));

  return (
    <div className="min-h-screen pb-24">
      <SEO title="Einstellungen | iwantsexnow.ch" description="Lokale Merkliste und Weg zum Anbieter-Login. Kein Besucher-Konto." />
      <LuxuryHeader />
      <PageIntro
        note="Dieses Gerät"
        art="hanger"
        title={<>Einstellungen</>}
        lead="Es gibt kein Besucher-Konto und keine hinterlegte Adresse. Was hier steht, liegt nur in diesem Browser."
      >
        <Link href="/login" className="brass-button">
          Anbieter-Login
        </Link>
        <Link href="/report" className="text-link">
          Opt-Out
        </Link>
      </PageIntro>
      <main className="sheet">
        <h2>Merkliste</h2>
        {saved.length === 0 ? (
          <div className="empty-panel">
            <img src="/editorial/editorial-salon.jpg" alt="" />
            <div>
              <p className="dek">Noch keine Profile gemerkt.</p>
              <Link href="/favorites" className="text-link">
                Zur Merkliste
              </Link>
            </div>
          </div>
        ) : (
          <ListingGrid profiles={saved} />
        )}
      </main>
    </div>
  );
}
