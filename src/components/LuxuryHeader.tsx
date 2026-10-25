import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { BrandLogo } from "@/components/BrandLogo";
import {
  ChevronDown,
  Search,
  MapPin,
  Sparkles,
  ShieldCheck,
  Video,
  Building2,
  Star,
  PlusCircle,
  Menu,
  X,
  UserCheck,
  SlidersHorizontal,
} from "lucide-react";

const MENU_GROUPS = [
  {
    label: "Escorts & Kategorien",
    badge: "7.021+",
    items: [
      { href: "/search", title: "Alle Escorts & Models", sub: "Kompletter Schweizer Katalog mit Schnellfilter" },
      { href: "/search?q=GFE", title: "Girlfriend Experience (GFE)", sub: "Zärtliche Begleitung, Küssen & Dinner Dates" },
      { href: "/orte/tantra-massage-schweiz", title: "Erotik- & Tantra-Massage", sub: "Body-to-Body, Nuru & Lingam Massagen" },
      { href: "/orte/domina-bdsm-schweiz", title: "Domina & BDSM Studios", sub: "Klassische Dominanz, Fetisch & Rollenspiele" },
      { href: "/compare-escorts", title: "Endpreis-Rechner & Vergleich", sub: "Stundentarife & Inklusivleistungen vergleichen" },
    ],
  },
  {
    label: "Städte & Kantone",
    items: [
      { href: "/escort-zurich", title: "Zürich & Zug (Pilot-Hub)", sub: "City, Paradeplatz, Oerlikon, Zug & Cham" },
      { href: "/orte/cham", title: "Zug, Cham & Baar", sub: "Diskrete Privat-Apartments & Hotel-Outcall" },
      { href: "/escort-basel", title: "Basel & Mittelland", sub: "Basel-Stadt, Liestal, Aarau & Baden" },
      { href: "/escort-bern", title: "Bern & Zentralschweiz", sub: "Bern City, Luzern, Thun & Interlaken" },
      { href: "/escort-geneva", title: "Genève & Lausanne", sub: "Romandie High-Class Models & Studios" },
    ],
  },
  {
    label: "Clubs, Hotels & Test",
    items: [
      { href: "/rankings", title: "Schweizer Clubs & Laufhäuser", sub: "216 geprüfte Etablissements, FKK & Kontaktbars" },
      { href: "/hotels", title: "Diskrete Day-Use Hotels", sub: "Stundenhotels & Suiten mit privatem Check-in" },
      { href: "/reviews", title: "Top 10 Portal-Reviews 2026", sub: "Unabhängiger Test: Xdate, Fgirl, And6 & Co." },
      { href: "/reviews/xdate-review", title: "Xdate.ch Testbericht", sub: "Preise, Reichweite & Dubletten-Analyse" },
      { href: "/for-clients", title: "Sicherheits-Standard für Kunden", sub: "Verifizierungs-Haken & Fixpreis-Garantie" },
    ],
  },
  {
    label: "Für Models",
    highlight: true,
    items: [
      { href: "/advertise", title: "Warum bei uns inserieren?", sub: "1. Monat 100% kostenlos + 3x mehr Einnahmen" },
      { href: "/create-post", title: "Profil übernehmen / Neu starten", sub: "In 60 Sek. live inkl. CHF 50 Startguthaben" },
      { href: "/creator-dashboard", title: "Model & Studio Cockpit", sub: "Online-Status, Top-Spot Bidding & Locked Videos" },
      { href: "/verify", title: "Offizieller ✓ Haken (Verifizierung)", sub: "Echtheits-Siegel für 3x mehr Buchungsanfragen" },
      { href: "/report", title: "Opt-Out & DMCA Schutz", sub: "Index-Eintrag selbst verwalten oder ausblenden" },
    ],
  },
];

export function LuxuryHeader() {
  const router = useRouter();
  const [openDesktopGroup, setOpenDesktopGroup] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>("Escorts & Kategorien");

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090A0F]/95 backdrop-blur-xl">
        {/* Subtle Top Swiss Trust Strip */}
        <div className="hidden md:block border-b border-white/5 bg-[#050608] text-[11px] text-gray-400">
          <div className="max-w-7xl mx-auto px-4 h-7 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Schweizer Direkt-Index · 7.021+ Profile & 216 Clubs
              </span>
              <span className="text-white/15">|</span>
              <span>Geprüfte Originalbilder & transparente Stundentarife in CHF</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/for-clients" className="hover:text-[#C8A97E] transition">
                Käuferschutz
              </Link>
              <Link href="/advertise" className="text-[#C8A97E] hover:underline font-medium">
                Models: 1. Monat Gratis
              </Link>
              <a
                href="https://www.sbb.ch"
                className="text-gray-500 hover:text-white transition"
                title="Schnell-Verlassen zu SBB.ch"
              >
                Quick-Exit (ESC)
              </a>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-[72px] flex items-center justify-between gap-4">
          <Link href="/" className="shrink-0">
            <BrandLogo compact />
          </Link>

          {/* Desktop Interactive Submenu Buttons */}
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Hauptnavigation">
            {MENU_GROUPS.map((group) => {
              const isOpen = openDesktopGroup === group.label;
              return (
                <div
                  key={group.label}
                  className="relative"
                  onMouseEnter={() => setOpenDesktopGroup(group.label)}
                  onMouseLeave={() => setOpenDesktopGroup(null)}
                >
                  <button
                    type="button"
                    onClick={() => setOpenDesktopGroup(isOpen ? null : group.label)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide flex items-center gap-1.5 border transition-all cursor-pointer ${
                      group.highlight
                        ? "border-[#C8A97E]/40 bg-[#C8A97E]/10 text-[#E5C99B] hover:bg-[#C8A97E]/20"
                        : isOpen
                        ? "border-white/20 bg-white/10 text-white"
                        : "border-transparent text-gray-200 hover:border-white/15 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>{group.label}</span>
                    {group.badge && (
                      <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-[#C8A97E] font-bold">
                        {group.badge}
                      </span>
                    )}
                    <ChevronDown
                      size={14}
                      className={`text-[#C8A97E] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown Submenu Panel */}
                  {isOpen && (
                    <div className="absolute left-0 top-full pt-2 w-80 z-50">
                      <div className="rounded-xl border border-[#C8A97E]/35 bg-[#0D0F17] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.85)] divide-y divide-white/5">
                        {group.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpenDesktopGroup(null)}
                            className="block px-3.5 py-2.5 rounded-lg hover:bg-white/5 transition group/item"
                          >
                            <div className="text-xs font-bold text-white group-hover/item:text-[#C8A97E] flex items-center justify-between">
                              <span>{item.title}</span>
                              <span className="text-[#C8A97E] opacity-0 group-hover/item:opacity-100 transition">→</span>
                            </div>
                            <div className="text-[11px] text-gray-400 mt-0.5 leading-snug">{item.sub}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <Link
              href="/live-cam"
              className="ml-1 px-3.5 py-2 rounded-lg text-xs font-semibold border border-rose-500/35 bg-rose-500/10 hover:bg-rose-500/20 text-rose-200 flex items-center gap-1.5 transition"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>Live-Cam</span>
            </Link>
          </nav>

          {/* Right CTA Buttons (Desktop + Mobile Burger) */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden sm:inline-flex px-3.5 py-2 rounded-lg border border-white/15 hover:border-white/30 bg-white/5 text-xs font-semibold text-gray-200 transition"
            >
              Login
            </Link>
            <Link
              href="/create-post"
              className="px-3.5 sm:px-4 py-2 rounded-lg bg-[#C8A97E] hover:bg-[#d8b98e] text-[#090A0F] text-xs font-bold tracking-wide transition shadow-md"
            >
              + Inserat / Claim
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menü öffnen"
              className="lg:hidden p-2 rounded-lg border border-white/15 bg-white/5 text-white hover:bg-white/10"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Full Accordion Submenu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#090A0F] px-4 py-4 space-y-3 max-h-[82vh] overflow-y-auto">
            {MENU_GROUPS.map((group) => {
              const expanded = mobileAccordion === group.label;
              return (
                <div key={group.label} className="rounded-xl border border-white/10 bg-[#11131C] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setMobileAccordion(expanded ? null : group.label)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-[#C8A97E]"
                  >
                    <span>{group.label}</span>
                    <ChevronDown size={16} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
                  </button>
                  {expanded && (
                    <div className="px-2 pb-2 space-y-1 border-t border-white/5 pt-2">
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-3 py-2 rounded-lg hover:bg-white/5"
                        >
                          <div className="text-xs font-semibold text-white">{item.title}</div>
                          <div className="text-[11px] text-gray-400">{item.sub}</div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 rounded-lg border border-white/15 text-center text-xs font-bold text-white"
              >
                Model / Kunden Login
              </Link>
              <Link
                href="/create-post"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 rounded-lg bg-[#C8A97E] text-[#090A0F] text-center text-xs font-bold"
              >
                + Gratis Inserieren
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Sticky Bottom Bar (Thumb-Friendly UX on Smartphones) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/15 bg-[#090A0F]/95 backdrop-blur-xl px-2 py-1.5 grid grid-cols-5 gap-1 text-[10px] font-semibold text-gray-300">
        <Link href="/" className={`flex flex-col items-center py-1 rounded-lg ${router.pathname === "/" ? "text-[#C8A97E]" : ""}`}>
          <Sparkles size={16} />
          <span className="mt-0.5">Models</span>
        </Link>
        <Link href="/search" className={`flex flex-col items-center py-1 rounded-lg ${router.pathname === "/search" ? "text-[#C8A97E]" : ""}`}>
          <SlidersHorizontal size={16} />
          <span className="mt-0.5">Filter</span>
        </Link>
        <Link href="/escort-zurich" className="flex flex-col items-center py-1 rounded-lg">
          <MapPin size={16} />
          <span className="mt-0.5">Städte</span>
        </Link>
        <Link href="/live-cam" className="flex flex-col items-center py-1 rounded-lg text-rose-300">
          <Video size={16} />
          <span className="mt-0.5">Live-Cam</span>
        </Link>
        <Link href="/create-post" className="flex flex-col items-center py-1 rounded-lg text-[#C8A97E]">
          <PlusCircle size={16} />
          <span className="mt-0.5">Gratis Start</span>
        </Link>
      </div>
    </>
  );
}