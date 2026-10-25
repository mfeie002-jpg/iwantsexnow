import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { StencilSerifX } from "@/components/BrandLogo";
import { ChevronDown, Menu, X, Sparkles, Building2, Scale, UserCheck, Globe } from "lucide-react";

const PROVIDER_MENU = [
  { href: "/advertise", title: "Für Anbieter: Übersicht & Vorteile", sub: "Kostenlose Profilkontrolle, Statistik & Konditionen" },
  { href: "/create-post", title: "Bestehendes Profil übernehmen", sub: "Eintrag bestätigen oder neues Profil anlegen" },
  { href: "/creator-dashboard", title: "Anbieter-Cockpit öffnen", sub: "Angaben pflegen, Verfügbarkeit bestätigen & pausieren" },
  { href: "/verify", title: "Identitätsprüfung beantragen", sub: "Dokumentiertes Prüfverfahren für Ihr Profil" },
  { href: "/report", title: "Profil melden oder entfernen", sub: "Kostenloser Widerspruch ohne Registrierungspflicht" },
];

const LANGUAGE_HUBS = [
  { code: "DE", label: "Deutsch (Schweiz)", href: "/" },
  { code: "FR", label: "Français (Genève & Vaud)", href: "/escort-geneva" },
  { code: "IT", label: "Italiano (Lugano & Ticino)", href: "/escort-lugano" },
];

export function LuxuryHeader() {
  const router = useRouter();
  const [providerOpen, setProviderOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => router.pathname === path || router.pathname.startsWith(path + "/");
  const currentLang =
    router.pathname.includes("geneva") || router.pathname.includes("lausanne") || router.asPath.includes("geneve")
      ? "FR"
      : router.pathname.includes("lugano") || router.asPath.includes("lugano")
      ? "IT"
      : "DE";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#12151C]/95 backdrop-blur-xl text-white">
        <div className="max-w-[1380px] mx-auto px-6 sm:px-10 h-14 sm:h-16 flex items-center justify-between gap-4">
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

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium" aria-label="Hauptnavigation">
              <Link
                href="/"
                className={
                  router.pathname === "/" || router.pathname === "/search"
                    ? "py-5 border-b-2 transition border-[#C6A574] text-white font-semibold"
                    : "py-5 border-b-2 transition border-transparent text-gray-300 hover:text-white"
                }
              >
                Profile
              </Link>
              <Link
                href="/rankings"
                className={
                  isActive("/rankings")
                    ? "py-5 border-b-2 transition border-[#C6A574] text-white font-semibold"
                    : "py-5 border-b-2 transition border-transparent text-gray-300 hover:text-white"
                }
              >
                Clubs & Studios
              </Link>
              <Link
                href="/reviews"
                className={
                  isActive("/reviews")
                    ? "py-5 border-b-2 transition border-[#C6A574] text-white font-semibold"
                    : "py-5 border-b-2 transition border-transparent text-gray-300 hover:text-white"
                }
              >
                Portalvergleich
              </Link>
            </nav>
          </div>

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
                <ChevronDown size={13} className={providerOpen ? "transition-transform rotate-180" : "transition-transform"} />
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

            <div
              className="relative hidden sm:block"
              onMouseEnter={() => setLangOpen(true)}
              onMouseLeave={() => setLangOpen(false)}
            >
              <button
                type="button"
                onClick={() => setLangOpen(!langOpen)}
                className="px-2.5 py-2 rounded-lg border border-white/15 hover:border-white/30 bg-white/5 text-xs font-semibold text-gray-200 flex items-center gap-1 cursor-pointer"
              >
                <Globe size={13} className="text-[#C6A574]" />
                <span>{currentLang}</span>
                <ChevronDown size={12} />
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full pt-1.5 w-56 z-50">
                  <div className="rounded-xl border border-white/15 bg-[#171A22] p-1.5 shadow-2xl space-y-0.5">
                    {LANGUAGE_HUBS.map((l) => (
                      <Link
                        key={l.code}
                        href={l.href}
                        onClick={() => setLangOpen(false)}
                        className={
                          currentLang === l.code
                            ? "block px-3 py-2 rounded-lg text-xs transition bg-[#C6A574] text-[#12151C] font-bold"
                            : "block px-3 py-2 rounded-lg text-xs font-semibold transition text-gray-200 hover:bg-white/5"
                        }
                      >
                        {l.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
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

        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#12151C] px-4 py-4 space-y-3 text-sm">
            <div className="flex flex-col space-y-2">
              <Link href="/" onClick={() => setMobileOpen(false)} className="py-2 font-semibold text-white border-b border-white/5">
                Profile entdecken (DE)
              </Link>
              <Link href="/escort-geneva" onClick={() => setMobileOpen(false)} className="py-2 font-semibold text-gray-200 border-b border-white/5">
                Français · Genève & Vaud (FR)
              </Link>
              <Link href="/escort-lugano" onClick={() => setMobileOpen(false)} className="py-2 font-semibold text-gray-200 border-b border-white/5">
                Italiano · Lugano & Ticino (IT)
              </Link>
              <Link href="/rankings" onClick={() => setMobileOpen(false)} className="py-2 font-semibold text-gray-200 border-b border-white/5">
                Clubs & Studios
              </Link>
              <Link href="/reviews" onClick={() => setMobileOpen(false)} className="py-2 font-semibold text-gray-200 border-b border-white/5">
                Portalvergleich
              </Link>
              <Link href="/advertise" onClick={() => setMobileOpen(false)} className="py-2 font-semibold text-[#C6A574]">
                Für Anbieter (Profil kostenlos verwalten)
              </Link>
            </div>
          </div>
        )}
      </header>

      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/15 bg-[#12151C]/95 backdrop-blur-xl px-1 pt-1.5 pb-[max(0.4rem,env(safe-area-inset-bottom))] grid grid-cols-4 gap-1 text-[10px] font-semibold text-gray-400">
        <Link href="/" className={router.pathname === "/" ? "flex flex-col items-center py-1 text-[#C6A574] font-bold" : "flex flex-col items-center py-1"}>
          <Sparkles size={16} />
          <span className="mt-0.5">Profile</span>
        </Link>
        <Link href="/rankings" className={isActive("/rankings") ? "flex flex-col items-center py-1 text-[#C6A574] font-bold" : "flex flex-col items-center py-1"}>
          <Building2 size={16} />
          <span className="mt-0.5">Clubs</span>
        </Link>
        <Link href="/reviews" className={isActive("/reviews") ? "flex flex-col items-center py-1 text-[#C6A574] font-bold" : "flex flex-col items-center py-1"}>
          <Scale size={16} />
          <span className="mt-0.5">Vergleich</span>
        </Link>
        <Link href="/advertise" className={isActive("/advertise") ? "flex flex-col items-center py-1 text-[#C6A574] font-bold" : "flex flex-col items-center py-1"}>
          <UserCheck size={16} />
          <span className="mt-0.5">Für Anbieter</span>
        </Link>
      </div>
    </>
  );
}