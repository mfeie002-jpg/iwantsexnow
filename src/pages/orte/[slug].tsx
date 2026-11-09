import React from "react";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
import { SwissDoorplate } from "@/components/SwissDoorplate";
import offersData from "@/data/harvested-offers.json";
import { Crown, MessageCircle, User, Sparkles } from "lucide-react";

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

      <PageIntro tone="minze" note="Gruss aus der Region" art="none" title={<>Private Penthouse Suiten in {hubTitle} ({cantonCode})</>}>
        <Link
            href="/clubs"
            className="brass-3d px-5 py-2.5 rounded-full text-[13px] font-mono font-extrabold "
          >
            305 Clubs & Studios Ansehen →
          </Link>
      </PageIntro>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {profiles.map((p: any, idx: number) => {
            const cleanDigits = p.rawPhone ? String(p.rawPhone).replace(/\D/g, "") : "";
            return (
              <div
                key={p.id || idx}
                className="valentina-outer-card rounded-[26px] overflow-hidden flex flex-col justify-between group p-2.5"
              >
                <div className="relative rounded-[20px] overflow-hidden border border-kirsche/35 bg-papier flex-1 flex flex-col justify-between">
                  <Link href={"/profile/" + encodeURIComponent(p.id)} className="darkroom-stage block aspect-[3/4.1] w-full">
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
                    <div className="darkroom-vignette" />
                    <div className="darkroom-floor" />

                    <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-white border border-kirsche/55 flex items-center justify-center text-kirsche">
                        <Crown size={13} />
                      </div>
                      <SwissDoorplate state={p.isAvail ? "FREI" : "RESERVIERT"} roomNumber={p.canton} customLabel="FREI" size="sm" />
                    </div>

                    <div className="absolute inset-x-0 bottom-2 z-10 px-4 text-center flex flex-col items-center">
                      <h3 className="font-serif text-xl text-butter truncate max-w-full">
                        {p.cleanTitle}
                      </h3>
                      <div className="text-[13px] font-sans font-semibold text-butter mt-1">
                        • {p.city} ({p.canton}) •
                      </div>
                      <div className="font-serif font-mono text-2xl text-butter mt-1">
                        CHF {p.rate60Chf}
                      </div>
                      <div className="text-[8px] font-mono text-white/80">
                        PER HOUR · (30M: CHF {p.rate30Chf})
                      </div>
                    </div>
                  </Link>

                  <div className="px-3.5 pb-3.5 pt-2 bg-papier grid grid-cols-2 gap-2.5">
                    {cleanDigits ? (
                      <a
                        href={"https://wa.me/" + cleanDigits}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="brass-3d py-2.5 px-3 rounded-full border border-kirsche/65 font-sans font-extrabold text-[13px] flex items-center justify-center gap-1.5"
                      >
                        <MessageCircle size={12} />
                        <span>WHATSAPP</span>
                      </a>
                    ) : (
                      <Link
                        href={"/fantasy-preview?id=" + encodeURIComponent(p.id)}
                        className="brass-3d py-2.5 px-3 rounded-full border border-kirsche/65 font-sans font-extrabold text-[13px] flex items-center justify-center gap-1.5"
                      >
                        <Sparkles size={12} />
                        <span>PREVIEW</span>
                      </Link>
                    )}
                    <Link
                      href={"/profile/" + encodeURIComponent(p.id)}
                      className="emerald-3d py-2.5 px-3 rounded-full border border-kirsche/45 font-sans font-bold text-[13px] flex items-center justify-center gap-1.5"
                    >
                      <User size={12} className="text-kirsche" />
                      <span>View Profile</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}