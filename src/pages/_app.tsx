import "@/styles/globals.css";
import "@/styles/atelier.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { AgeVerificationGate } from "@/components/AgeVerificationGate";
import clubsData from "@/data/swiss-establishments-vault.json";
import { countLabel } from "@/lib/listing";

const TOTAL_CLUBS = Array.isArray(clubsData) ? clubsData.length : 0;

const CANTON_LINKS: { href: string; label: string }[] = [
  { href: "/orte/zug", label: "Zug" },
  { href: "/escort-zurich", label: "Zürich" },
  { href: "/orte/luzern", label: "Luzern" },
  { href: "/escort-basel", label: "Basel" },
  { href: "/escort-bern", label: "Bern" },
  { href: "/orte/st-gallen", label: "St. Gallen" },
  { href: "/escort-geneva", label: "Genève" },
  { href: "/escort-lausanne", label: "Lausanne" },
  { href: "/escort-lugano", label: "Lugano" },
  { href: "/orte/baden", label: "Aargau" },
];

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-grid">
        <div>
          <p className="wordmark">
            iwantsexnow<span>.ch</span>
          </p>
          <p>
            Unabhängiges Schweizer Verzeichnis für Escort, Tantra, Studios und {countLabel(TOTAL_CLUBS)} Clubs. Direktkontakt über die Nummer im Eintrag, 0% Provision auf diese Kontakte.
          </p>
        </div>
        <div>
          <h2>Orte</h2>
          <ul>
            {CANTON_LINKS.map((c) => (
              <li key={c.href}>
                <Link href={c.href}>{c.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Nachschlagen</h2>
          <ul>
            <li><Link href="/search">Suche</Link></li>
            <li><Link href="/compare-escorts">Vergleich</Link></li>
            <li><Link href="/clubs">Clubs</Link></li>
            <li><Link href="/pricing">Preise</Link></li>
            <li><Link href="/hotels">Hotel & Outcall</Link></li>
            <li><Link href="/how-it-works">Ablauf</Link></li>
            <li><Link href="/faq">Fragen</Link></li>
            <li><Link href="/safety">Sicherheit, 18+</Link></li>
          </ul>
        </div>
        <div>
          <h2>Anbieterinnen</h2>
          <ul>
            <li><Link href="/register">Profil eintragen</Link></li>
            <li><Link href="/create-post">Profil übernehmen</Link></li>
            <li><Link href="/login">Anmelden</Link></li>
            <li><Link href="/advertise">Für Anbieterinnen</Link></li>
            <li><Link href="/report">Opt-Out oder melden</Link></li>
            <li><Link href="/contact">Redaktion</Link></li>
          </ul>
        </div>
      </div>
      <div className="site-footer-base">
        <span>© {new Date().getFullYear()} iwantsexnow.ch, Schweiz, ab 18</span>
        <span>
          <Link href="/imprint">Impressum</Link>
          <Link href="/privacy">Datenschutz</Link>
          <Link href="/terms">AGB</Link>
          <Link href="/report">Opt-Out</Link>
        </span>
      </div>
    </footer>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex min-h-screen flex-col text-tinte">
      <AgeVerificationGate />
      <div className="flex-1">
        <Component {...pageProps} />
      </div>
      <SiteFooter />
      <MobileBottomNav />
    </div>
  );
}
