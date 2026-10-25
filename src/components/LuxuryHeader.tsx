import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { StencilSerifX } from "@/components/BrandLogo";
import { ChevronDown, Menu, X, Sparkles, SlidersHorizontal, Building2, Scale, UserCheck } from "lucide-react";

const PROVIDER_MENU = [
  { href: "/advertise", title: "Für Anbieter: Übersicht & Vorteile", sub: "Kostenlose Profilkontrolle, Statistik & Konditionen" },
  { href: "/create-post", title: "Bestehendes Profil übernehmen", sub: "Eintrag bestätigen oder neues Profil anlegen" },
  { href: "/creator-dashboard", title: "Anbieter-Cockpit öffnen", sub: "Angaben pflegen, Verfügbarkeit bestätigen & pausieren" },
  { href: "/verify", title: "Identitätsprüfung beantragen", sub: "Dokumentiertes Prüfverfahren für Ihr Profil" },
  { href: "/report", title: "Profil melden oder entfernen", sub: "Kostenloser Widerspruch ohne Registrierungspflicht" },
];

export function LuxuryHeader() {
  const router = useRouter();
  const [providerOpen, setProviderOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => router.pathname === path || router.pathname.startsWith(path + "/");

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#12151C]/95 backdrop-blur-xl text-white">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand Wordmark with Subtitle "Schweizer Profilverzeichnis" */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 rounded-lg bg-[#1A1E29] border border-[#C6A574]/50 flex items-center justify-center">
                <StencilSerifX color="#C6A574" className="w-5 h-4" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-serif font-bold tracking-tight text-white flex items-baseline">
                  <span>iwantse</span>
                  <StencilSerifX color="#C6A574" className="w-[15px] h-[13px] mx-[0.5px] translate-y-[1px]" />
                  <span>now.ch</span>
                </div>
                <div className="text-[10px] tracking-[0.14em] uppercase text-gray-400 leading-none mt-0.5">
                  Schweizer Profilverzeichnis
                </div>
              </div>
            </Link>

            {/* Center/Left Primary Navigation: Profile · Clubs & Studios · Portalvergleich */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium" aria-label="Hauptnavigation">
              <Link
                href="/"
                className={`py-5 border-b-2 transition ${
                  router.pathname === "/" || router.pathname === "/search"
                    ? "border-[#C6A574] text-white font-semibold"
                    : "border-transparent text-gray-300 hover:text-white"
                }`}
              >
                Profile
              </Link>
              <Link
                href="/rankings"
                className={`py-5 border-b-2 transition ${
                  isActive("/rankings")
                    ? "border-[#C6A574] text-white font-semibold"
                    : "border-transparent text-gray-300 hover:text-white"
                }`}
              >
                Clubs & Studios
              </Link>
              <Link
                href="/reviews"
                className={`py-5 border-b-2 transition ${
                  isActive("/reviews")
                    ? "border-[#C6A574] text-white font-semibold"
                    : "border-transparent text-gray-300 hover:text-white"
                }`}
              >
                Portalvergleich
              </Link>
            </nav>
          </div>

          {/* Right: Für Anbieter · Login · DE */}
          <div className="flex items-center gap-2.5">
            <div
              className="relative hidden sm:block"
              onMouseEnter={() => setProviderOpen(true)}
              onMouseLeave={() => setProviderOpen(false)}
            >
              <button
                type="button"
                onClick={() => setProviderOpen(!providerOpen)}
                className="px-3.5 py-2 rounded-lg border border-[#C6A574]/50 bg-[#C6A574]/10 hover:bg-[#C6A574]/20 text-[#E5C99B] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>Für Anbieter</span>
                <ChevronDown size={13} className={`transition-transform ${providerOpen ? "rotate-180" : ""}`} />
              </button>

              {providerOpen && (
                <div className="absolute right-0 top-full pt-1.5 w-80 z-50">
                  <div className="rounded-xl border border-white/15 bg-[#171A22] p-2 shadow-2xl divide-y divide-white/5">
                    {PROVIDER_MENU.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setProviderOpen(false)}
                        className="block px-3.5 py-2.5 rounded-lg hover:bg-white/5 transition"
                      >
                        <div className="text-xs font-bold text-white hover:text-[#C6A574]">{item.title}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{item.sub}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/login"
              className="px-3.5 py-2 rounded-lg border border-white/15 hover:border-white/30 bg-white/5 text-xs font-semibold text-gray-200 transition"
            >
              Login
            </Link>

            <div className="hidden sm:flex items-center px-2.5 py-2 rounded-lg border border-white/15 bg-white/5 text-xs font-semibold text-gray-300">
              DE
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menü"
              className="md:hidden p-2 rounded-lg border border-white/15 bg-white/5 text-white"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#12151C] px-4 py-4 space-y-3 text-sm">
            <div className="flex flex-col space-y-2">
              <Link href="/" onClick={() => setMobileOpen(false)} className="py-2 font-semibold text-white border-b border-white/5">
                Profile entdecken
              </Link>
              <Link href="/rankings" onClick={() => setMobileOpen(false)} className="py-2 font-semibold text-gray-200 border-b border-white/5">
                Clubs & Studios
              </Link>
              <Link href="/reviews" onClick={() => setMobileOpen(false)} className="py-2 font-semibold text-gray-200 border-b border-white/5">
                Portalvergleich
              </Link>
              <Link href="/advertise" onClick={() => setMobileOpen(false)} className="py-2 font-semibold text-[#C6A574] border-b border-white/5">
                Für Anbieter (Profil kostenlos verwalten)
              </Link>
              <Link href="/create-post" onClick={() => setMobileOpen(false)} className="py-2 text-xs text-gray-300">
                → Bestehendes Profil übernehmen
              </Link>
              <Link href="/report" onClick={() => setMobileOpen(false)} className="py-2 text-xs text-gray-400">
                → Profil melden oder entfernen
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/15 bg-[#12151C]/95 backdrop-blur-xl px-1 pt-1.5 pb-[max(0.4rem,env(safe-area-inset-bottom))] grid grid-cols-4 gap-1 text-[10px] font-semibold text-gray-400">
        <Link href="/" className={`flex flex-col items-center py-1 ${router.pathname === "/" ? "text-[#C6A574] font-bold" : ""}`}>
          <Sparkles size={16} />
          <span className="mt-0.5">Profile</span>
        </Link>
        <Link href="/rankings" className={`flex flex-col items-center py-1 ${isActive("/rankings") ? "text-[#C6A574] font-bold" : ""}`}>
          <Building2 size={16} />
          <span className="mt-0.5">Clubs</span>
        </Link>
        <Link href="/reviews" className={`flex flex-col items-center py-1 ${isActive("/reviews") ? "text-[#C6A574] font-bold" : ""}`}>
          <Scale size={16} />
          <span className="mt-0.5">Vergleich</span>
        </Link>
        <Link href="/advertise" className={`flex flex-col items-center py-1 ${isActive("/advertise") ? "text-[#C6A574] font-bold" : ""}`}>
          <UserCheck size={16} />
          <span className="mt-0.5">Für Anbieter</span>
        </Link>
      </div>
    </>
  );
}