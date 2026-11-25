import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { BrandMark } from "@/components/visuals";
import { LANGS, usePrefs } from "@/lib/prefs";

export function LuxuryHeader() {
  const router = useRouter();
  const { lang, setLang, discreet, setDiscreet, t } = usePrefs();
  const [favCount, setFavCount] = useState<number>(0);

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

  const items = [
    { href: "/", label: t("discover"), active: router.pathname === "/" },
    { href: "/#staedte", label: t("cities"), active: false },
    { href: "/favorites", label: t("saved"), active: router.pathname === "/favorites", count: favCount },
  ];

  const linkClass = (active: boolean) =>
    "inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 text-[16px] font-semibold transition " +
    (active ? "bg-[#2b1420] text-[#fbf1ec]" : "text-[#fbf1ec] hover:bg-[#2b1420]");

  return (
    <header className="sticky top-0 z-40 border-b border-[#3d2231] bg-[#150810]/90 backdrop-blur-2xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-3"
          aria-label="iWantSexNow.ch Startseite"
        >
          <BrandMark size={38} className="shrink-0" />
          <span className="truncate font-serif text-[26px] leading-none text-[#fbf1ec] sm:text-[30px]">
            iWantSexNow<span className="text-[#e8c98a]">.ch</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Hauptmenü">
          {items.map((item) => (
            <Link key={item.label} href={item.href} className={linkClass(item.active)}>
              {item.label}
              {typeof item.count === "number" && item.count > 0 && (
                <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[#e8c98a] px-1.5 text-sm font-bold text-[#2a1408]">
                  {item.count}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <details className="group relative">
            <summary
              className="flex min-h-[44px] cursor-pointer list-none items-center gap-2 rounded-full border border-[#947683] px-4 text-[15px] font-semibold text-[#fbf1ec] transition hover:border-[#e8c98a] hover:text-[#e8c98a]"
              aria-label={t("menu")}
            >
              {lang.toUpperCase()}
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">{t("menu")}</span>
            </summary>
            <div className="absolute right-0 top-14 z-50 grid w-80 gap-5 rounded-[28px] border border-[#3d2231] bg-[#22101a] p-6 shadow-[0_28px_60px_rgba(0,0,0,0.5)]">
              <div>
                <div className="mb-3 text-[15px] font-semibold text-[#cdb5be]">{t("language")}</div>
                <div className="flex gap-2">
                  {LANGS.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setLang(l.code)}
                      aria-pressed={lang === l.code}
                      className={
                        "min-h-[44px] flex-1 cursor-pointer rounded-full border text-[15px] font-semibold transition " +
                        (lang === l.code
                          ? "border-[#e8c98a] bg-[#e8c98a] text-[#2a1408]"
                          : "border-[#947683] text-[#fbf1ec] hover:border-[#e8c98a]")
                      }
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setDiscreet(!discreet)}
                  aria-pressed={discreet}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 text-left"
                >
                  <span>
                    <span className="block text-[16px] font-semibold text-[#fbf1ec]">{t("discreet")}</span>
                    <span className="mt-1 block text-[14px] leading-snug text-[#cdb5be]">
                      {t("discreetHint")}
                    </span>
                  </span>
                  <span
                    className={
                      "relative h-8 w-14 shrink-0 rounded-full transition " +
                      (discreet ? "bg-[#5fd3a5]" : "bg-[#947683]")
                    }
                  >
                    <span
                      className={
                        "absolute top-1 h-6 w-6 rounded-full bg-white transition-all " +
                        (discreet ? "left-7" : "left-1")
                      }
                    />
                  </span>
                </button>
              </div>

              <div className="grid gap-1 border-t border-[#3d2231] pt-4 text-[15px]">
                <Link href="/clubs" className="footer-link py-1">Clubs und Studios</Link>
                <Link href="/how-it-works" className="footer-link py-1">So funktioniert&apos;s</Link>
                <Link href="/safety" className="footer-link py-1">Sicherheit</Link>
                <Link href="/contact" className="footer-link py-1">Kontakt</Link>
              </div>
            </div>
          </details>

          <Link
            href="/advertise"
            className="ghost-button inline-flex min-h-[44px] items-center rounded-full px-5 text-[15px] font-semibold"
          >
            {t("advertise")}
          </Link>
        </div>
      </div>
    </header>
  );
}
