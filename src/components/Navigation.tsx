import Link from "next/link";
import { ChevronDown, PlusCircle } from "lucide-react";

const mainNavigation = [
  {
    label: "Marktplatz & Vergleich",
    items: [
      { href: "/search", label: "Schweizweite Meta-Suche & Filter" },
      { href: "/compare-escorts", label: "Endpreis- & Portal-Matrix" },
      { href: "/matches", label: "Smart-Matching (Top Empfehlungen)" },
      { href: "/favorites", label: "Meine Merkliste" },
    ],
  },
  {
    label: "Städte & Kantone",
    items: [
      { href: "/escort-zurich", label: "Zürich & Zug (Pilot-Region)" },
      { href: "/escort-basel", label: "Basel" },
      { href: "/escort-bern", label: "Bern" },
      { href: "/escort-geneva", label: "Genève" },
      { href: "/escort-lausanne", label: "Lausanne" },
    ],
  },
  {
    label: "Für Anbieter (B2B)",
    items: [
      { href: "/create-post", label: "Profil übernehmen / Inserieren" },
      { href: "/verify", label: "ID- & Foto-Verifizierung" },
      { href: "/creator-dashboard", label: "Provider Self-Service Dashboard" },
      { href: "/pricing", label: "B2B Pakete & Konditionen" },
    ],
  },
];

export function Navigation() {
  return (
    <nav aria-label="Hauptnavigation" className="hidden items-center gap-6 md:flex text-white">
      {mainNavigation.map((group, index) => (
        <details key={group.label} className="relative group">
          <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold text-white/95 hover:bg-white/5 hover:text-[#D5A021] transition-colors">
            {group.label}
            <ChevronDown size={15} className="text-[#C69C6D]" aria-hidden="true" />
          </summary>
          <ul
            className={`absolute ${
              index === mainNavigation.length - 1 ? "right-0" : "left-0"
            } top-full z-50 mt-2 w-72 space-y-1 rounded-xl border border-white/15 bg-[#09131E] p-3 text-white shadow-2xl`}
          >
            {group.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-sm text-gray-200 hover:bg-white/10 hover:text-[#D5A021] transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </details>
      ))}
      <Link
        href="/create-post"
        className="ml-2 inline-flex items-center gap-1.5 rounded-xl bg-[#C69C6D] px-4 py-2.5 text-sm font-black text-[#0D1B2A] hover:bg-[#b5895a] shadow-lg transition-all"
      >
        <PlusCircle size={16} />
        Inserat aufgeben
      </Link>
    </nav>
  );
}
