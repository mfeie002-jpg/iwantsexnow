import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { BrandLogo } from "@/components/BrandLogo";
import {
  ChevronDown,
  MapPin,
  Sparkles,
  Video,
  PlusCircle,
  Menu,
  X,
  SlidersHorizontal,
  Scale,
} from "lucide-react";

const MENU_GROUPS = [
  {
    label: "Escorts & Kategorien",
    badge: "Index",
    items: [
      { href: "/search", title: "Alle Escorts & Models", sub: "Kompletter Schweizer Katalog mit Filter" },
      { href: "/search?q=GFE", title: "Girlfriend Experience (GFE)", sub: "Zärtliche Begleitung & Dinner Dates" },
      { href: "/orte/tantra-massage-schweiz", title: "Erotik- & Tantra-Massage", sub: "Body-to-Body, Nuru & Lingam" },
      { href: "/orte/domina-bdsm-schweiz", title: "Domina & BDSM Studios", sub: "Dominanz, Fetisch & Rollenspiele" },
      { href: "/compare-escorts", title: "Konditionen-Vergleich", sub: "Richtwerte & Leistungen vergleichen" },
    ],
  },
  {
    label: "Städte & Kantone",
    items: [
      { href: "/escort-zurich", title: "Zürich & Zug (Schwerpunkt)", sub: "City, Paradeplatz, Oerlikon, Zug & Cham" },
      { href: "/orte/cham", title: "Zug, Cham & Baar", sub: "Diskrete Privat-Apartments & Hotelbesuch" },
      { href: "/escort-basel", title: "Basel & Mittelland", sub: "Basel-Stadt, Liestal, Aarau & Baden" },
      { href: "/escort-bern", title: "Bern & Zentralschweiz", sub: "Bern City, Luzern, Thun & Interlaken" },
      { href: "/escort-geneva", title: "Genève & Lausanne", sub: "Romandie Models & Studios" },
    ],
  },
  {
    label: "Clubs & Portal-Test",
    items: [
      { href: "/rankings", title: "Schweizer Clubs & Laufhäuser", sub: "Stationäre Etablissements, FKK & Studios" },
      { href: "/reviews", title: "Schweizer Portale im Test", sub: "Sachlicher Vergleich: Xdate, Fgirl & Co." },
      { href: "/reviews/xdate-review", title: "Xdate.ch Einzelbericht", sub: "Funktionen, Kosten & Einordnung" },
      { href: "/hotels", title: "Diskrete Day-Use Hotels", sub: "Tageszimmer & Suiten mit privatem Check-in" },
      { href: "/for-clients", title: "Orientierung für Besucher", sub: "Quellenangaben & Prüfstatus verstehen" },
    ],
  },
  {
    label: "Für Anbieter",
    highlight: true,
    items: [
      { href: "/advertise", title: "Kostenlose Profilverwaltung", sub: "Was Sie selbst steuern & korrigieren können" },
      { href: "/create-post", title: "Eintrag übernehmen / Neu starten", sub: "In wenigen Schritten kostenlos einrichten" },
      { href: "/creator-dashboard", title: "Anbieter-Cockpit öffnen", sub: "Angaben, 4h-Verfügbarkeit, Pause & Statistik" },
      { href: "/verify", title: "Identitätsprüfung (✓)", sub: "Dokumentiertes Prüfverfahren beantragen" },
      { href: "/report", title: "Profil melden / Entfernen", sub: "Kostenloser Widerspruch ohne Kontopflicht" },
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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
          <Link href="/" className="shrink-0">
            <BrandLogo compact />
          </Link>

          {/* Desktop Interactive Submenu Buttons */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Hauptnavigation">
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
                    className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide flex items-center gap-1.5 border transition-all cursor-pointer ${
                      group.highlight
                        ? "border-[#C8A97E]/40 bg-[#C8A97E]/10 text-[#E5C99B] hover:bg-[#C8A97E]/20"
                        : isOpen
                        ? "border-white/20 bg-white/10 text-white"
                        : "border-transparent text-gray-200 hover:border-white/15 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>{group.label}</span>
                    <ChevronDown
                      size={13}
                      className={`text-[#C8A97E] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="absolute left-0 top-full pt-1.5 w-80 z-50">
                      <div className="rounded-xl border border-[#C8A97E]/35 bg-[#0D0F17] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.9)] divide-y divide-white/5">
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
          </nav>

          {/* Right CTA Buttons (Optimized for Mobile Width) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/login"
              className="hidden sm:inline-flex px-3 py-1.5 rounded-lg border border-white/15 hover:border-white/30 bg-white/5 text-xs font-semibold text-gray-200 transition"
            >
              Login
            </Link>
            <Link
              href="/create-post"
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg bg-[#C8A97E] hover:bg-[#d8b98e] text-[#090A0F] text-[11px] sm:text-xs font-extrabold tracking-wide transition shadow-md whitespace-nowrap"
            >
              + Profil / Claim
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menü öffnen"
              className="lg:hidden p-2 rounded-lg border border-white/15 bg-white/5 text-white active:bg-white/15"
            >
              {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {/* Mobile Full-Screen Accordion Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#090A0F] px-3 py-3 space-y-2.5 max-h-[80vh] overflow-y-auto shadow-2xl">
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
                    <div className="px-2 pb-2 space-y-1 border-t border-white/5 pt-1.5">
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-3 py-2.5 rounded-lg active:bg-white/10"
                        >
                          <div className="text-xs font-bold text-white">{item.title}</div>
                          <div className="text-[11px] text-gray-400">{item.sub}</div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 rounded-xl border border-white/15 text-center text-xs font-bold text-white"
              >
                Anbieter-Login
              </Link>
              <Link
                href="/report"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-center text-xs font-semibold"
              >
                Melden / Entfernen
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Sticky Bottom App Bar (48px Touch Targets + Safe Area Padding) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/15 bg-[#090A0F]/95 backdrop-blur-xl px-1 pt-1.5 pb-[max(0.4rem,env(safe-area-inset-bottom))] grid grid-cols-5 gap-0.5 text-[10px] font-semibold text-gray-400 shadow-[0_-8px_25px_rgba(0,0,0,0.8)]">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 rounded-lg ${
            router.pathname === "/" ? "text-[#C8A97E] font-bold" : "active:text-white"
          }`}
        >
          <Sparkles size={17} />
          <span className="mt-0.5">Entdecken</span>
        </Link>
        <Link
          href="/search"
          className={`flex flex-col items-center justify-center py-1 rounded-lg ${
            router.pathname === "/search" ? "text-[#C8A97E] font-bold" : "active:text-white"
          }`}
        >
          <SlidersHorizontal size={17} />
          <span className="mt-0.5">Filter</span>
        </Link>
        <Link
          href="/rankings"
          className={`flex flex-col items-center justify-center py-1 rounded-lg ${
            router.pathname === "/rankings" ? "text-[#C8A97E] font-bold" : "active:text-white"
          }`}
        >
          <MapPin size={17} />
          <span className="mt-0.5">Clubs</span>
        </Link>
        <Link
          href="/reviews"
          className={`flex flex-col items-center justify-center py-1 rounded-lg ${
            router.pathname.startsWith("/reviews") ? "text-[#C8A97E] font-bold" : "active:text-white"
          }`}
        >
          <Scale size={17} />
          <span className="mt-0.5">Vergleich</span>
        </Link>
        <Link
          href="/create-post"
          className="flex flex-col items-center justify-center py-1 rounded-lg text-[#C8A97E] font-bold"
        >
          <PlusCircle size={17} />
          <span className="mt-0.5">Mein Profil</span>
        </Link>
      </div>
    </>
  );
}