import { useState } from "react";
import Link from "next/link";
import SEO from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, CheckCircle2, XCircle, Calculator, ArrowLeft, ExternalLink, Sparkles } from "lucide-react";
import { demoListings, calculateTransparentTotalCost, ServiceOptionId, serviceOptions } from "@/lib/marketplace/catalogue";

const SWISS_PORTAL_BENCHMARK = [
  {
    name: "iWantSexNow.ch (Decision Engine)",
    model: "Direktprofile + 47-Portale-Preisabgleich",
    totalCostCalc: true,
    idVerification: "Pflicht (ID + Live-Foto + Timestamp)",
    duplicateFilter: "Automatische Cross-Portal-Deduplizierung",
    avgSurcharge: "0% (Direkttarif-Garantie)",
    enquiryFlow: "Verschlüsselte 1-Klick Private Enquiry",
    highlight: true,
  },
  {
    name: "Rosalon.ch",
    model: "Reiner Meta-Aggregator (~27–40 Portale)",
    totalCostCalc: true,
    idVerification: "Nur Übernahme aus Drittquellen",
    duplicateFilter: "Telefonnummern-Bündelung",
    avgSurcharge: "Abhängig vom Zielportal",
    enquiryFlow: "Weiterleitung auf Drittseiten / Telefon",
    highlight: false,
  },
  {
    name: "xdate.ch / fgirl.ch / and6.com",
    model: "Klassische Einzel-Inserateportale",
    totalCostCalc: false,
    idVerification: "Teilweise / Freiwillig",
    duplicateFilter: "Keine (oft 4–6 Mehrfach-Inserate)",
    avgSurcharge: "+CHF 50 bis +CHF 150 für nicht genannte Extras",
    enquiryFlow: "Offene Telefonnummer / Unstrukturierter Chat",
    highlight: false,
  },
];

export default function CompareEscortsPage() {
  const [duration, setDuration] = useState<30 | 60 | 120>(60);
  const [selectedServices, setSelectedServices] = useState<ServiceOptionId[]>(["gfe", "outcall"]);

  const toggleService = (id: ServiceOptionId) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#0D1B2A] text-white">
      <SEO
        title="47 Schweizer Portale & Direktprofile im Vergleich | iWantSexNow.ch"
        description="Vergleiche echte Endpreise, Inklusiv-Services, Dubletten-Status und Verifizierung in Zürich, Zug und der ganzen Schweiz."
      />
      <header className="border-b border-white/10 bg-[#09131E] py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            <span>iWant</span><span className="text-[#D5A021]">Sex</span><span>Now</span><span className="text-gray-400 text-base">.ch</span>
          </Link>
          <div className="hidden lg:block"><Navigation /></div>
          <MobileNav />
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-7xl space-y-14">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white mb-4">
            <ArrowLeft size={14} /> Zurück zur Übersicht
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40 mb-2">
                <Calculator size={13} className="mr-1.5 inline" />
                Live-Vergleichsmatrix
              </Badge>
              <h1 className="text-3xl md:text-5xl font-black">
                Direktprofile & 47 Portale im Endpreis-Vergleich
              </h1>
              <p className="text-gray-300 mt-2 max-w-3xl text-sm md:text-base">
                Wähle Dauer und gewünschte Services: Sieh sofort, welche Anbieterin den besten echten Komplettpreis bietet und wie viel du gegenüber Drittportalen sparst.
              </p>
            </div>
            <div className="flex bg-black/40 p-1.5 rounded-xl border border-white/10 self-start">
              {([30, 60, 120] as const).map((mins) => (
                <button
                  key={mins}
                  onClick={() => setDuration(mins)}
                  className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold ${
                    duration === mins ? "bg-[#C69C6D] text-[#0D1B2A]" : "text-gray-300"
                  }`}
                >
                  {mins === 120 ? "2 Stunden" : `${mins} Min.`}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {serviceOptions.map((opt) => {
              const active = selectedServices.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => toggleService(opt.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    active
                      ? "bg-emerald-500/20 border-emerald-400 text-white"
                      : "bg-white/5 border-white/10 text-gray-300"
                  }`}
                >
                  {active ? "✓ " : "+ "}{opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Provider Comparison Cards / Table */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoListings.slice(0, 6).map((item) => {
            const cost = calculateTransparentTotalCost(item, duration, selectedServices);
            return (
              <Card key={item.id} className="bg-white/5 border-white/15 p-6 text-white flex flex-col justify-between rounded-2xl">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <Badge className="bg-emerald-600 text-white border-0 text-[11px] mb-1.5">
                        <ShieldCheck size={11} className="mr-1 inline" /> ID & Foto verifiziert
                      </Badge>
                      <h2 className="text-2xl font-black">{item.title}, {item.age ?? 25}</h2>
                      <p className="text-xs text-[#D5A021] font-semibold uppercase mt-0.5">
                        📍 {(item.serviceAreas ?? [item.city]).join(" · ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-gray-400 line-through">Drittportale CHF {cost.thirdPartyAvgChf}</div>
                      <div className="text-2xl font-black text-[#D5A021]">CHF {cost.totalChf}</div>
                      <div className="text-[11px] text-emerald-400 font-bold">Sparvorteil CHF {cost.savingsChf}</div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 mb-4">{item.description}</p>

                  <div className="bg-black/30 rounded-xl p-3 text-xs space-y-1.5 border border-white/10">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Grundpreis ({duration} Min.):</span>
                      <span className="font-bold">CHF {cost.baseChf}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gewählte Extras Aufpreis:</span>
                      <span className="font-bold text-emerald-400">+CHF {cost.extrasChf}</span>
                    </div>
                    <div className="flex justify-between pt-1.5 border-t border-white/10 font-bold text-sm">
                      <span>Garantierter Endpreis:</span>
                      <span className="text-[#D5A021]">CHF {cost.totalChf}</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1 text-xs">
                    <div className="text-gray-400 font-semibold">Quellen-Abgleich:</div>
                    {(item.portalSources ?? []).map((src, i) => (
                      <div key={i} className="flex justify-between">
                        <span className={i === 0 ? "text-emerald-400 font-bold" : "text-gray-400"}>{src.portalName}</span>
                        <span className={i === 0 ? "text-emerald-400 font-bold" : "text-gray-500 line-through"}>CHF {src.listedPriceChf}/Std.</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex gap-2">
                  <Button className="w-full bg-[#C69C6D] hover:bg-[#b5895a] text-[#0D1B2A] font-bold" asChild>
                    <Link href={`/profile/${item.id}`}>Profil & Direkt-Anfrage</Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Platform Architecture Comparison (iWantSexNow vs Rosalon vs Legacy Portals) */}
        <section className="pt-8 border-t border-white/10">
          <h2 className="text-2xl md:text-3xl font-black mb-2">
            Systemvergleich: Warum unsere Decision-Engine überlegen ist
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Wie iWantSexNow.ch das Umzugscheck-Entscheidungsprinzip mit dem 47-Portale-Marktüberblick verbindet:
          </p>
          <div className="overflow-x-auto rounded-2xl border border-white/15">
            <table className="w-full text-left text-xs md:text-sm">
              <thead className="bg-black/50 text-gray-300 uppercase text-xs">
                <tr>
                  <th className="p-4">Plattform / System</th>
                  <th className="p-4">Daten- & Qualitätsmodell</th>
                  <th className="p-4">Echter Endpreis-Rechner</th>
                  <th className="p-4">ID- & Freshness-Prüfung</th>
                  <th className="p-4">Dubletten-Schutz</th>
                  <th className="p-4">Kontakt- & Buchungsflow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {SWISS_PORTAL_BENCHMARK.map((row, idx) => (
                  <tr key={idx} className={row.highlight ? "bg-[#C69C6D]/15 font-medium" : "bg-white/5"}>
                    <td className="p-4 font-bold text-white">{row.name}</td>
                    <td className="p-4 text-gray-200">{row.model}</td>
                    <td className="p-4">
                      {row.totalCostCalc ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 size={15} /> Ja (inkl. Extras)</span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1"><XCircle size={15} /> Nein (nur Lockpreis)</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-200">{row.idVerification}</td>
                    <td className="p-4 text-gray-200">{row.duplicateFilter}</td>
                    <td className="p-4 text-gray-200">{row.enquiryFlow}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
