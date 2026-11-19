import React from "react";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
import offersData from "@/data/harvested-offers.json";
import { ListingGrid } from "@/components/listing/ListingCard";
import { toListing } from "@/lib/listing";

const SLUG_TO_CANTON: Record<string, { title: string; canton: string }> = {
  zug: { title: "Zug, Baar & Cham", canton: "ZG" },
  zuerich: { title: "Zürich City & Seefeld", canton: "ZH" },
  zurich: { title: "Zürich City & Seefeld", canton: "ZH" },
  luzern: { title: "Luzern & Zentralschweiz", canton: "LU" },
  baden: { title: "Baden, Spreitenbach & Aargau", canton: "AG" },
  aargau: { title: "Aargau & Mittelland", canton: "AG" },
  basel: { title: "Basel-Stadt", canton: "BS" },
  bern: { title: "Bern & Espace Mittelland", canton: "BE" },
  "st-gallen": { title: "St. Gallen & Ostschweiz", canton: "SG" },
  geneve: { title: "Genève & Lac Léman", canton: "GE" },
  lausanne: { title: "Lausanne, Montreux & Vaud", canton: "VD" },
  lugano: { title: "Lugano, Locarno & Ticino", canton: "TI" },
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = String(ctx.params?.slug || "zuerich").toLowerCase().trim();
  const cfg = SLUG_TO_CANTON[slug] || { title: slug.toUpperCase(), canton: "ZH" };
  const all = (offersData as any[]) || [];

  const matched = all
    .filter(
      (o) =>
        String(o.canton || "").toUpperCase() === cfg.canton ||
        String(o.city || "").toLowerCase().includes(slug)
    )
    .slice(0, 36)
    .map((o) => {
      const r60 = Math.max(100, Math.min(1200, Number(o.advertisedBaseChf) || 350));
      const r30 = Math.max(80, Math.min(800, Number(o.rate30Chf) || Math.round((r60 * 0.6) / 10) * 10));
      const rawThumb = String(o.thumbnail || "").trim().replace(/[?&]iwsn_clean=1.*$/i, "");
      const cleanTitle = String(o.rawName || "VALENTINA")
        .replace(/^[\W_]+/, "")
        .split(/[·|-]/)[0]
        .trim()
        .slice(0, 22);
      return {
        id: o.id || o.dedupClusterId,
        cleanTitle: cleanTitle || "VALENTINA",
        city: o.city || cfg.title,
        canton: o.canton || cfg.canton,
        rate60Chf: r60,
        rate30Chf: r30,
        rawPhone: o.rawPhone || "",
        cleanThumb: rawThumb,
        isAvail: Boolean(o.availabilityConfirmed),
      };
    });

  return {
    props: {
      slug,
      hubTitle: cfg.title,
      cantonCode: cfg.canton,
      profiles: matched,
    },
  };
};

export default function RegionalHubPage({ hubTitle, cantonCode, profiles }: any) {
  return (
    <div className="min-h-screen bg-papier text-tinte pb-24">
      <SEO
        title={"Escort & Tantra Suiten in " + hubTitle + " (" + cantonCode + ") | iwantsexnow.ch"}
        description={
          profiles.length +
          " geprüfte Escort-, GFE- und Tantra-Suiten in " +
          hubTitle +
          " (" +
          cantonCode +
          ") mit 30m/60m CHF-Richtpreisen und direktem +41 WhatsApp."
        }
      />
      <LuxuryHeader />

      <PageIntro tone="minze" note={cantonCode} art="none" title={<>Profile in {hubTitle}</>} lead={<>{profiles.length} Einträge mit 30- und 60-Minuten-Preis. Kontakt über die Nummer im Profil.</>}>
        <Link href="/clubs" className="text-link">
          Clubs und Studios
        </Link>
      </PageIntro>

      <main className="sheet">
        <ListingGrid profiles={profiles.map((p: any) => toListing({ ...p, rawName: p.cleanTitle, thumbnail: p.cleanThumb, availabilityConfirmed: p.isAvail })).filter((p): p is NonNullable<ReturnType<typeof toListing>> => Boolean(p))} />
      </main>
    </div>
  );
}
