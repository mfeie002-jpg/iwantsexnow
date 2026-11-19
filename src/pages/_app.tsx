import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Wordmark } from "@/components/visuals";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { AgeVerificationGate } from "@/components/AgeVerificationGate";
import { applyDiscreet, readDiscreet } from "@/lib/discreet";
import clubsData from "@/data/swiss-establishments-vault.json";

const TOTAL_CLUBS = Array.isArray(clubsData) && clubsData.length > 0 ? clubsData.length : 108;

const FOOTER_COLUMNS: { title: string; links: [string, string][] }[] = [
  {
    title: "Entdecken",
    links: [
      ["/search", "Wer jetzt frei ist"],
      ["/#staedte", "Städte"],
      ["/clubs", `${TOTAL_CLUBS} Clubs und Studios`],
      ["/favorites", "Merkliste"],
      ["/pricing", "Preise in Franken"],
    ],
  },
  {
    title: "Mehr",
    links: [
      ["/compare-escorts", "Profile vergleichen"],
      ["/rankings", "Beliebt diese Woche"],
      ["/hotels", "Hotels für Besuche"],
      ["/stories", "Neuigkeiten"],
      ["/how-it-works", "So funktioniert es"],
    ],
  },
  {
    title: "Sicherheit",
    links: [
      ["/safety", "Richtlinien und 18+"],
      ["/report", "Profil melden"],
      ["/report", "Mein Profil entfernen"],
      ["/register", "Inserieren ohne Provision"],
    ],
  },
  {
    title: "Rechtliches",
    links: [
      ["/imprint", "Impressum"],
      ["/privacy", "Datenschutz"],
      ["/terms", "AGB"],
      ["/contact", "Kontakt"],
    ],
  },
];

function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-line text-[15px]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-x-16 gap-y-10 px-4 pb-10 pt-14 sm:px-6">
        <div className="flex max-w-[22rem] flex-[1_1_260px] flex-col gap-3">
          <Wordmark className="text-[28px] text-ink" />
          <p className="text-ink-soft">Ein unabhängiges Verzeichnis für Erwachsene in der Schweiz. Nur ab 18 Jahren.</p>
        </div>
        {FOOTER_COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title} className="flex flex-col gap-2.5">
            <span className="font-bold text-ink">{col.title}</span>
            {col.links.map(([href, label]) => (
              <Link key={label} href={href} className="footer-link">
                {label}
              </Link>
            ))}
          </nav>
        ))}
      </div>
      <p className="mx-auto max-w-[1200px] border-t border-line px-4 pb-28 pt-5 text-ink-soft sm:px-6 lg:pb-10">
        © {new Date().getFullYear()} iWantSexNow.ch · Schweiz · Nur für Erwachsene
      </p>
    </footer>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const sync = () => applyDiscreet(readDiscreet());
    sync();
    const onRoute = () => window.setTimeout(sync, 0);
    router.events.on("routeChangeComplete", onRoute);
    return () => router.events.off("routeChangeComplete", onRoute);
  }, [router.events]);

  return (
    <div className="flex min-h-screen flex-col text-ink">
      <div className="flex-1">
        <Component {...pageProps} />
      </div>
      <SiteFooter />
      <MobileBottomNav />
      <AgeVerificationGate />
    </div>
  );
}
