import Link from "next/link";
import { ShieldCheck, Sparkles, Clock, ArrowRight } from "lucide-react";

const marketplaceCategories = [
  {
    id: "escort",
    badge: "Direkt & Verifiziert",
    title: "High-Class Escort & GFE",
    priceRange: "Ø CHF 400 – 550 / Std.",
    included: "Inkl. Girlfriend Experience, Diskretion & geprüfter Originalfotos",
    stats: "47 Portale abgeglichen · 0% Agentur-Aufschlag",
  },
  {
    id: "companionship",
    badge: "Business & Events",
    title: "Dinner Dates & Overnight",
    priceRange: "Ø CHF 380 / Std. · Overnight ab CHF 850",
    included: "Stilvolle Begleitung für Hotels, Geschäftsessen & Reisen in Zürich/Zug",
    stats: "100% bestätigte Verfügbarkeit vorab",
  },
  {
    id: "massage",
    badge: "Studios & Outcall",
    title: "Tantra & Erotische Massage",
    priceRange: "Ø CHF 250 – 350 / Std.",
    included: "Zertifizierte Privat-Studios & Hotelbesuche ohne versteckte Nachverkäufe",
    stats: "Klarer Endpreis vor der Anfrage",
  },
];

export function ServiceCategories() {
  return (
    <section id="services" className="bg-[#09131E] py-20 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D5A021]">
            Transparente Kategorien & Richtpreise
          </span>
          <h2 className="mt-2 text-3xl font-black text-white md:text-5xl">
            Klare Konditionen statt Lockvogel-Inserate
          </h2>
          <p className="mt-4 text-gray-300">
            Jede Kategorie zeigt dir den echten Schweizer Durchschnittspreis, welche Leistungen bereits im Grundtarif enthalten sind und eliminiert mehrfach kopierte Agentur-Inserate.
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {marketplaceCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/search?category=${cat.id}`}
              className="group flex flex-col justify-between rounded-2xl border border-white/15 bg-white/5 p-7 text-white transition-all hover:-translate-y-1 hover:border-[#C69C6D] hover:bg-white/10"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#C69C6D]/20 border border-[#C69C6D]/40 px-3 py-1 text-xs font-bold text-[#D5A021]">
                    {cat.badge}
                  </span>
                  <ShieldCheck size={18} className="text-emerald-400" />
                </div>
                <h3 className="mt-5 text-2xl font-black group-hover:text-[#D5A021] transition-colors">
                  {cat.title}
                </h3>
                <div className="mt-2 text-lg font-bold text-emerald-400">
                  {cat.priceRange}
                </div>
                <p className="mt-3 text-sm text-gray-300 leading-relaxed">
                  {cat.included}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                <span>{cat.stats}</span>
                <span className="font-bold text-white group-hover:text-[#D5A021] flex items-center gap-1">
                  Vergleichen <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
