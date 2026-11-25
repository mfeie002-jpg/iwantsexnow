import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
import { chf, toListing, whatsAppHref } from "@/lib/listing";
import offersData from "@/data/harvested-offers.json";

export default function CompareEscortsPage() {
  const [selected, setSelected] = useState<any[]>([]);

  useEffect(() => {
    const all = (offersData as any[]) || [];
    try {
      const favIds = JSON.parse(localStorage.getItem("ch_favorite_profiles") || "[]");
      const fromFavs = all.filter((o) => favIds.includes(o.id || o.dedupClusterId));
      const pool = fromFavs.length >= 2 ? fromFavs.slice(0, 4) : all.slice(0, 4);
      setSelected(pool);
    } catch {
      setSelected(all.slice(0, 4));
    }
  }, []);

  const rows = selected
    .map((p) => toListing(p))
    .filter((p): p is NonNullable<ReturnType<typeof toListing>> => Boolean(p));

  return (
    <div className="min-h-screen pb-24">
      <SEO
        title="4-Suiten Direktvergleich · 30m/60m CHF & +41 Kontakt | iwantsexnow.ch"
        description="Vergleichen Sie bis zu 4 Schweizer Escort- und Tantra-Suiten nebeneinander nach 30-Minuten- und 60-Minuten-Honorar, Kanton und Verfügbarkeit."
        url="https://iwantsexnow.ch/compare-escorts"
      />
      <LuxuryHeader />
      <PageIntro
        tone="flieder"
        note="Nebeneinander"
        art="compare"
        title={<>Bis zu vier Profile</>}
        lead="Zuerst die Merkliste, sonst die ersten Einträge im Verzeichnis. Preise sind die Angaben aus dem Datensatz."
      >
        <Link href="/favorites" className="text-link">Merkliste</Link>
        <Link href="/search" className="text-link">Suche</Link>
      </PageIntro>

      <main className="sheet">
        {rows.length === 0 ? (
          <p className="listing-empty">Noch nichts zum Vergleichen.</p>
        ) : (
          <div className="compare-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th scope="col"> </th>
                  {rows.map((p) => (
                    <th key={p.id} scope="col">
                      <Link href={"/profile/" + encodeURIComponent(p.id)}>{p.name}</Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Ort</th>
                  {rows.map((p) => (
                    <td key={p.id}>{p.city} ({p.canton})</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">30 Min.</th>
                  {rows.map((p) => (
                    <td key={p.id}>{chf(p.rate30)}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">60 Min.</th>
                  {rows.map((p) => (
                    <td key={p.id}>{chf(p.rate60)}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Frei, 4 Std.</th>
                  {rows.map((p) => (
                    <td key={p.id}>{p.available ? "bestätigt" : "nicht bestätigt"}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Kontakt</th>
                  {rows.map((p) => {
                    const wa = whatsAppHref(p.phone, p.name, p.city);
                    return (
                      <td key={p.id}>
                        {wa ? (
                          <a href={wa} target="_blank" rel="noopener noreferrer">Schreiben</a>
                        ) : (
                          <Link href={"/profile/" + encodeURIComponent(p.id)}>Im Profil</Link>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
