import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const NAV = [
  { href: "/search", label: "Suche" },
  { href: "/clubs", label: "Clubs" },
  { href: "/compare-escorts", label: "Vergleich" },
  { href: "/pricing", label: "Preise" },
  { href: "/how-it-works", label: "Ablauf" },
];

export function LuxuryHeader() {
  const router = useRouter();
  const [favCount, setFavCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const syncFavs = () => {
      try {
        const raw = localStorage.getItem("ch_favorite_profiles");
        const arr = raw ? JSON.parse(raw) : [];
        setFavCount(Array.isArray(arr) ? arr.length : 0);
      } catch {
        setFavCount(0);
      }
    };
    syncFavs();
    window.addEventListener("storage", syncFavs);
    window.addEventListener("ch-favorites-updated", syncFavs);
    return () => {
      window.removeEventListener("storage", syncFavs);
      window.removeEventListener("ch-favorites-updated", syncFavs);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [router.asPath]);

  const active = (href: string) => router.pathname === href || router.pathname.startsWith(href + "/");

  return (
    <header className="site-header">
      <div className="site-header-bar">
        <Link href="/" className="wordmark" aria-label="iwantsexnow.ch Startseite">
          iwantsexnow<span>.ch</span>
        </Link>

        <nav className="site-nav" aria-label="Hauptnavigation">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} aria-current={active(item.href) ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-header-tools">
          <Link href="/favorites" className="text-link" aria-label={"Merkliste, " + favCount + " Einträge"}>
            Merkliste{favCount > 0 ? " (" + favCount + ")" : ""}
          </Link>
          <Link href="/register" className="brass-button">
            Inserat
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Schliessen" : "Menü"}
          </button>
        </div>
      </div>

      {open && (
        <div id="site-menu" className="site-menu">
          <nav aria-label="Mobilnavigation">
            <Link href="/search">Suche</Link>
            <Link href="/clubs">Clubs & Studios</Link>
            <Link href="/compare-escorts">Vergleich</Link>
            <Link href="/pricing">Preise</Link>
            <Link href="/how-it-works">So läuft es</Link>
            <Link href="/favorites">Merkliste{favCount > 0 ? " (" + favCount + ")" : ""}</Link>
            <Link href="/login">Anmelden</Link>
            <Link href="/register">Inserat aufgeben</Link>
            <Link href="/contact">Kontakt</Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export default LuxuryHeader;
