import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import { Doodle, VerifiedStamp, Wave, Wordmark } from "@/components/visuals";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import clubsData from "@/data/swiss-establishments-vault.json";

const TOTAL_CLUBS = Array.isArray(clubsData) && clubsData.length > 0 ? clubsData.length : 108;

const CANTON_LINKS: { href: string; label: string; code: string }[] = [
  { href: "/orte/zug", label: "Zug & Baar", code: "ZG" },
  { href: "/escort-zurich", label: "Zürich", code: "ZH" },
  { href: "/orte/luzern", label: "Luzern", code: "LU" },
  { href: "/orte/baden", label: "Baden", code: "AG" },
  { href: "/escort-basel", label: "Basel", code: "BS" },
  { href: "/escort-bern", label: "Bern", code: "BE" },
  { href: "/orte/st-gallen", label: "St. Gallen", code: "SG" },
  { href: "/escort-geneva", label: "Genève", code: "GE" },
  { href: "/orte/lausanne", label: "Lausanne", code: "VD" },
  { href: "/escort-lugano", label: "Lugano", code: "TI" },
];

const CHIP_TONES = ["bg-blush", "bg-butter", "bg-minze", "bg-himmel", "bg-flieder"];

function PenthouseFooter() {
  return (
    <footer className="field-ink on-ink relative mt-10 text-sm">
      <Wave color="#fbfaf8" flip className="absolute inset-x-0 -top-px" />

      <div className="mx-auto max-w-7xl px-4 pb-32 pt-24 sm:px-6 lg:pb-12 lg:pt-28">
        <div className="relative">
          <p className="hand -rotate-2 text-[2.6rem] leading-none text-butter sm:text-[3.6rem]">Gruss aus der Schweiz</p>
          <Doodle kind="heart" color="#ffd3dc" className="absolute -top-3 left-[min(21rem,62vw)] hidden h-9 w-9 rotate-12 sm:block" />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_1fr] lg:gap-12">
          <div>
            <Wordmark className="text-3xl text-papier" />
            <p className="mt-4 max-w-sm text-[15px] leading-7 text-papier/80">
              Das unabhängige Schweizer Verzeichnis für Escorts, Girlfriend Experience, Tantra-Studios und {TOTAL_CLUBS} Clubs. Du buchst direkt, ohne Buchungsprovision, und im Paid-Vault bekommen die Creator 80%.
            </p>

            <div className="mt-6 flex rotate-[-1.5deg] items-center gap-4 rounded-md bg-white p-4 text-tinte shadow-[0_6px_0_rgba(0,0,0,0.18)]">
              <VerifiedStamp className="h-16 w-16 shrink-0" />
              <div>
                <div className="font-display text-base font-bold">CHF-Transparenz</div>
                <div className="mt-0.5 text-[13px] leading-5 text-tinte/75">30 und 60 Minuten, direkter +41 Kontakt, 0% Agentur.</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold text-papier">Kantone</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {CANTON_LINKS.map((c, i) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className={"inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold text-tinte transition-transform hover:-translate-y-0.5 " + CHIP_TONES[i % CHIP_TONES.length]}
                >
                  <span>{c.label}</span>
                  <span className="text-[11px] font-extrabold opacity-60">{c.code}</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold text-papier">Werkzeuge</h3>
            <ul className="mt-4 grid gap-2.5">
              {[
                ["/search", "Suche mit Filtern"],
                ["/matches", "10-Sekunden-Matcher"],
                ["/compare-escorts", "Vergleich bis 4 Profile"],
                ["/rankings", "Top-50 Ranking"],
                ["/clubs", `${TOTAL_CLUBS} Schweizer Clubs`],
                ["/pricing", "CHF-Honorar-Kompass"],
                ["/hotels", "Outcall-Hotel-Guide"],
                ["/reviews", "Portal-Prüfberichte"],
                ["/stories", "4h Live-Stories"],
                ["/fantasy-preview", "Avatar & Preview"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link className="footer-link" href={href}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold text-papier">Für Anbieterinnen</h3>
            <div className="mt-4 flex flex-col items-start gap-3">
              <Link className="brass-button inline-flex min-h-[46px] items-center px-5 text-sm" href="/register">
                Profil eintragen, 0%
              </Link>
              <Link className="footer-link" href="/boost">
                24h Top-Spot pro Kanton
              </Link>
              <Link className="footer-link" href="/safety">
                Sicherheit und 18+ Richtlinien
              </Link>
              <Link className="btn-outline mt-1 inline-flex min-h-[46px] items-center px-5 text-sm" href="/report">
                Opt-Out oder Profil melden
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t-2 border-dotted border-papier/25 pt-6 text-papier/70 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} iwantsexnow.ch, Schweiz, ab 18</div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link className="footer-link" href="/imprint">
              Impressum
            </Link>
            <Link className="footer-link" href="/privacy">
              Datenschutz
            </Link>
            <Link className="footer-link" href="/terms">
              AGB
            </Link>
            <Link className="footer-link" href="/report">
              Opt-Out
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex min-h-screen flex-col text-tinte">
      <div className="flex-1">
        <Component {...pageProps} />
      </div>
      <PenthouseFooter />
      <MobileBottomNav />
    </div>
  );
}
