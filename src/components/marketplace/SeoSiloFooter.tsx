import Link from "next/link";
import { MapPin, Sparkles, Building2, Trophy, HelpCircle } from "lucide-react";

const CITY_SILO_LINKS = [
  { label: "Escort Zürich City", href: "/escort-zurich" },
  { label: "Escort Paradeplatz & Enge", href: "/orte/zuerich-paradeplatz" },
  { label: "Escort Zürich Oerlikon & Airport", href: "/orte/zuerich-oerlikon" },
  { label: "Escort Zürich Seefeld", href: "/orte/zuerich-seefeld" },
  { label: "Escort Zug Zentrum", href: "/orte/zug" },
  { label: "Escort Cham (ZG)", href: "/orte/cham" },
  { label: "Escort Baar & Sihlbrugg", href: "/orte/baar" },
  { label: "Escort Rotkreuz & Risch", href: "/orte/rotkreuz" },
  { label: "Escort Winterthur", href: "/orte/winterthur" },
  { label: "Escort Luzern", href: "/orte/luzern" },
  { label: "Escort Basel", href: "/escort-basel" },
  { label: "Escort Bern", href: "/escort-bern" },
  { label: "Escort Aargau & Baden", href: "/orte/aargau" },
  { label: "Escort St. Gallen & Bodensee", href: "/orte/st-gallen" },
  { label: "Escort Genève", href: "/escort-geneva" },
  { label: "Escort Lausanne & Vaud", href: "/escort-lausanne" },
  { label: "Escort Lugano & Ticino", href: "/orte/lugano" },
  { label: "Escort Pfäffikon SZ & Wollerau", href: "/orte/pfaeffikon-sz" },
  { label: "Escort St. Moritz & Davos", href: "/orte/st-moritz-davos" },
  { label: "Escort Zermatt & Wallis", href: "/orte/zermatt-wallis" },
  { label: "Escort Interlaken & Gstaad", href: "/orte/interlaken-gstaad" },
  { label: "Escort Thurgau & Bodensee", href: "/orte/thurgau" },
  { label: "Escort Solothurn & Olten", href: "/orte/solothurn" },
];

const SERVICE_COMBINATION_LINKS = [
  { label: "Girlfriend Experience (GFE) Zürich", href: "/search?q=Zürich+GFE" },
  { label: "Hotel-Outcall Zug & Cham", href: "/search?q=Zug+Outcall" },
  { label: "Erotik- & Tantra-Massage Zürich", href: "/search?q=Zürich+Massage" },
  { label: "Tantra & Wellness Massage Zug", href: "/search?q=Zug+Massage" },
  { label: "VIP Dinner Date Begleitung Schweiz", href: "/search?q=Dinner+Dates" },
  { label: "Escort Flughafen Zürich (Kloten)", href: "/orte/zuerich-oerlikon" },
  { label: "1:1 Live-Cam & Video Vibe-Check", href: "/live-cam" },
  { label: "Verifizierte Direktbuchung (0% Aufpreis)", href: "/compare-escorts" },
];

const HOUSES_AND_BENCHMARK_LINKS = [
  { label: "Villa / Haus Aphrodite Preise & Alternativen", href: "/orte/haus-aphrodite" },
  { label: "Haus / Club Zeus Tarife & Direkt-Index", href: "/orte/haus-zeus" },
  { label: "Schweizer Escort-Portale im Test (xdate vs. fgirl vs. and6)", href: "/rankings" },
  { label: "Schweizer Rufnummern- & Fake-Inserate-Scanner", href: "/how-it-works" },
  { label: "30-Sekunden Smart-Matcher (Endpreis-Filter)", href: "/matches" },
];

export function SeoSiloFooter() {
  return (
    <section
      aria-label="Schweizer Regionen, Services und Preisvergleichs-Verzeichnis"
      className="bg-[#060C15] border-t border-[#C69C6D]/30 py-12 text-xs text-gray-300"
    >
      <div className="container mx-auto px-4 max-w-7xl space-y-8">
        <div className="max-w-3xl space-y-1.5">
          <div className="text-[11px] font-black uppercase tracking-widest text-[#D5A021]">
            Schweizer Erotik- & Escort-Index · Alle Kantone, Ortschaften & Services
          </div>
          <h2 className="text-lg sm:text-xl font-serif font-black text-white">
            Direkte Preisvergleiche, Dubletten-Check & Fixpreis-Garantie in deiner Region
          </h2>
          <p className="text-gray-400 leading-relaxed">
            iWantSexNow.ch indexiert stündlich alle grossen Schweizer Portale, bereinigt mehrfach geschaltete Rufnummern und zeigt dir für jede Schweizer Stadt den verifizierten Direktbuchungs-Endpreis inklusive gewünschter Extras.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Cities & Sub-Regions */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <MapPin size={14} className="text-[#D5A021]" />
              Städte, Bezirke & Business-Hotspots
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {CITY_SILO_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#C69C6D]/20 border border-white/10 hover:border-[#C69C6D]/50 text-gray-200 hover:text-white transition-all"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: High-Intent Service Combinations */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <Sparkles size={14} className="text-emerald-400" />
              Beliebte Service- & Vorlieben-Kombinationen
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {SERVICE_COMBINATION_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-400/50 text-gray-200 hover:text-white transition-all"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Houses, Portals & Guides */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <Building2 size={14} className="text-[#D5A021]" />
              Häuser, Portal-Benchmarks & Ratgeber
            </h3>
            <ul className="space-y-2">
              {HOUSES_AND_BENCHMARK_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-[#D5A021] underline decoration-white/20 hover:decoration-[#D5A021] transition-colors"
                  >
                    → {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}