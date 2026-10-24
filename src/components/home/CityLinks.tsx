import { Card } from "@/components/ui/card";
import { CheckCircle, TrendingDown, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function CityLinks() {
  const regionalStats = [
    {
      name: "Kanton Zürich (Pilot)",
      href: "/escort-zurich",
      avgDirectChf: "CHF 420",
      avgPortalChf: "CHF 490",
      duplicatesRemoved: "64% Dubletten gefiltert",
      activeProviders: "18 Direktprofile heute aktiv",
    },
    {
      name: "Kanton Zug & Cham (Pilot)",
      href: "/escort-zurich",
      avgDirectChf: "CHF 400",
      avgPortalChf: "CHF 470",
      duplicatesRemoved: "58% Dubletten gefiltert",
      activeProviders: "9 Direktprofile heute aktiv",
    },
    {
      name: "Basel & Nordwestschweiz",
      href: "/escort-basel",
      avgDirectChf: "CHF 350",
      avgPortalChf: "CHF 410",
      duplicatesRemoved: "52% Dubletten gefiltert",
      activeProviders: "8 Direktprofile heute aktiv",
    },
    {
      name: "Bern & Mittelland",
      href: "/escort-bern",
      avgDirectChf: "CHF 380",
      avgPortalChf: "CHF 440",
      duplicatesRemoved: "49% Dubletten gefiltert",
      activeProviders: "7 Direktprofile heute aktiv",
    },
    {
      name: "Genève & Arc Lémanique",
      href: "/escort-geneva",
      avgDirectChf: "CHF 480",
      avgPortalChf: "CHF 560",
      duplicatesRemoved: "61% Dubletten gefiltert",
      activeProviders: "12 Direktprofile heute aktiv",
    },
    {
      name: "Lausanne & Vaud",
      href: "/escort-lausanne",
      avgDirectChf: "CHF 430",
      avgPortalChf: "CHF 500",
      duplicatesRemoved: "55% Dubletten gefiltert",
      activeProviders: "6 Direktprofile heute aktiv",
    },
  ];

  return (
    <section id="cities" className="py-20 bg-[#0D1B2A] border-y border-white/10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Live-Marktindex Schweiz (47 Portale vs. Direktbuchung)
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-2 mb-4">
              Regionaler Preis- & Dubletten-Spiegel
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Auf klassischen Portalen inseriert dieselbe Anbieterin oft 4- bis 6-mal unter verschiedenen Preisen. Unsere Geo-Engine bereinigt Dubletten und zeigt dir den günstigsten verifizierten Direkt-Tarif pro Kanton.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regionalStats.map((region, idx) => (
              <Link key={idx} href={region.href}>
                <Card className="p-6 bg-white/5 border-white/15 hover:border-[#C69C6D] transition-all duration-300 hover:-translate-y-1 cursor-pointer group text-white">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-black group-hover:text-[#D5A021] transition-colors">
                      {region.name}
                    </h3>
                    <ShieldCheck size={18} className="text-emerald-400" />
                  </div>
                  <div className="flex items-baseline gap-3 my-3">
                    <div>
                      <div className="text-[11px] text-gray-400">Direkt-Endpreis Ø</div>
                      <div className="text-2xl font-black text-[#D5A021]">{region.avgDirectChf}</div>
                    </div>
                    <div className="border-l border-white/10 pl-3">
                      <div className="text-[11px] text-gray-400">Drittportale Ø</div>
                      <div className="text-sm font-semibold text-gray-400 line-through">{region.avgPortalChf}</div>
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-3 border-t border-white/10 text-xs">
                    <div className="flex items-center gap-2 text-emerald-300">
                      <CheckCircle size={13} />
                      <span>{region.activeProviders}</span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-300">
                      <TrendingDown size={13} />
                      <span>{region.duplicatesRemoved}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
