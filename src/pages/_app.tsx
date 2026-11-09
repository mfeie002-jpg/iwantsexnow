import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import { VerifiedStamp, Wordmark } from "@/components/visuals";
import { ridgePath } from "@/components/visuals/art";
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

const FOOT_RIDGE_BACK = ridgePath(11, 1440, 120, 96, 78, 48);
const FOOT_RIDGE_FRONT = ridgePath(29, 1440, 120, 112, 58, 48);

function PenthouseFooter() {
  return (
    <footer className="relative bg-[#0a1a21] text-sm">
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block h-16 w-full sm:h-24"
        aria-hidden="true"
        focusable="false"
      >
        <path d={FOOT_RIDGE_BACK} fill="#0d1f27" />
        <path d={FOOT_RIDGE_FRONT} fill="#0a1a21" />
      </svg>

      <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:pb-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_1fr] lg:gap-12">
          <div>
            <Wordmark className="text-2xl text-[#f2f7f6]" />
            <p className="mt-4 max-w-sm leading-7 text-[#9fb8b5]">
              Das unabhängige Schweizer Direktverzeichnis für Escorts, Girlfriend Experience, Tantra-Studios und{" "}
              {TOTAL_CLUBS} stationäre Clubs. 0% Buchungsprovision und 80% Creator-Anteil im Paid-Vault.
            </p>

            <div className="mt-6 flex items-center gap-4 rounded-2xl border border-[#1d4350] bg-[#0d1f27] p-4">
              <VerifiedStamp className="h-16 w-16 shrink-0" />
              <div>
                <div className="font-semibold text-[#f2f7f6]">CHF-Transparenzsiegel</div>
                <div className="mt-1 text-[#9fb8b5]">30 / 60 Min. Honorare, direkter +41 Kontakt, 0% Agentur.</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base text-[#f2f7f6]">Kantone</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {CANTON_LINKS.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="inline-flex items-center gap-2 rounded-full border border-[#1d4350] px-3 py-1.5 text-[#cfe0de] transition-colors hover:border-[#ff6b5e] hover:text-white"
                >
                  <span>{c.label}</span>
                  <span className="text-xs font-bold text-[#ffb067]">{c.code}</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base text-[#f2f7f6]">Werkzeuge</h3>
            <ul className="mt-4 grid gap-2.5">
              {[
                ["/search", "Suche mit Filtern"],
                ["/fantasy-preview", "Avatar & Preview"],
                ["/matches", "10-Sekunden-Matcher"],
                ["/compare-escorts", "Vergleich bis 4 Profile"],
                ["/rankings", "Top-50 Ranking"],
                ["/clubs", `${TOTAL_CLUBS} Schweizer Clubs`],
                ["/pricing", "CHF-Honorar-Kompass"],
                ["/hotels", "Outcall-Hotel-Guide"],
                ["/reviews", "Portal-Prüfberichte"],
                ["/stories", "4h Live-Stories"],
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
            <h3 className="text-base text-[#f2f7f6]">Für Anbieterinnen</h3>
            <div className="mt-4 flex flex-col items-start gap-3">
              <Link className="brass-button inline-flex min-h-[44px] items-center px-5 text-sm" href="/register">
                Profil eintragen, 0%
              </Link>
              <Link className="footer-link" href="/boost">
                24h Top-Spot Boost pro Kanton
              </Link>
              <Link className="footer-link" href="/safety">
                Sicherheit, Schutz und 18+ Richtlinien
              </Link>
              <Link className="btn-outline mt-1 inline-flex min-h-[44px] items-center px-5 text-sm font-semibold" href="/report">
                Opt-Out oder Profil melden
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[#1d4350] pt-6 text-[#7f9ea3] sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} iwantsexnow.ch, Schweiz, 18+</div>
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
    <div className="flex min-h-screen flex-col bg-[#07141a] text-[#e6efee]">
      <div className="flex-1">
        <Component {...pageProps} />
      </div>
      <PenthouseFooter />
      <MobileBottomNav />
    </div>
  );
}