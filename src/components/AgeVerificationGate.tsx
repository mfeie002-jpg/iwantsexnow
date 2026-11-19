import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Wordmark } from "@/components/visuals";
import { readDiscreet, setDiscreet } from "@/lib/discreet";

const STORAGE_KEY = "iwsn_age_verified_v2";
const OPEN_PATHS = ["/privacy", "/terms", "/imprint", "/report", "/safety"];

export function AgeVerificationGate() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [verified, setVerified] = useState(true);
  const [discreet, setDiscreetChoice] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      setVerified(localStorage.getItem(STORAGE_KEY) === "true");
    } catch {
      setVerified(false);
    }
    setDiscreetChoice(readDiscreet());
  }, []);

  useEffect(() => {
    if (!mounted || verified) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted, verified]);

  const confirm = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {}
    setDiscreet(discreet);
    setVerified(true);
  };

  if (!mounted || verified) return null;
  if (OPEN_PATHS.includes(router.pathname)) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-[rgba(10,3,8,0.86)] p-4 backdrop-blur-md">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
        className="flex w-full max-w-[460px] flex-col gap-7 rounded-[28px] border border-line bg-[radial-gradient(ellipse_120%_60%_at_50%_-10%,#3a1325_0%,#150810_70%)] p-7 text-ink shadow-[0_4px_12px_rgba(0,0,0,0.3),0_28px_60px_rgba(0,0,0,0.4)] sm:p-9"
      >
        <Wordmark className="text-[26px] text-ink" />

        <div
          aria-hidden="true"
          className="mx-auto flex aspect-[4/5] w-[150px] items-center justify-center rounded-[999px_999px_22px_22px] border border-gold bg-[radial-gradient(circle_at_62%_30%,rgba(232,201,138,0.6)_0%,rgba(232,201,138,0)_26%),linear-gradient(165deg,#3a1325_0%,#d6165f_135%)]"
        >
          <span className="font-display text-[56px] leading-none text-ink">18+</span>
        </div>

        <div className="space-y-3 text-center">
          <h2 id="age-gate-title" className="text-[42px] leading-[1.05] text-ink">
            Nur für Erwachsene
          </h2>
          <p className="text-[17px] leading-7 text-ink-soft">
            Hier findest du Angebote für Erwachsene. Bitte bestätige, dass du mindestens 18 Jahre alt bist.
          </p>
        </div>

        <label className="flex cursor-pointer items-center gap-3.5 rounded-[22px] border border-line bg-surface px-4 py-3.5">
          <input
            type="checkbox"
            checked={discreet}
            onChange={(e) => setDiscreetChoice(e.target.checked)}
            className="h-6 w-6 shrink-0 accent-[#e8c98a]"
          />
          <span className="flex flex-col leading-snug">
            <span className="font-semibold">Diskret starten</span>
            <span className="text-[15px] text-ink-soft">Neutraler Tab-Titel, Fotos erst beim Antippen</span>
          </span>
        </label>

        <div className="flex flex-col gap-3">
          <button type="button" onClick={confirm} className="brass-button min-h-[56px] w-full px-6 text-[17px]">
            Ich bin 18 oder älter
          </button>
          <a
            href="https://www.google.ch"
            className="flex min-h-[52px] items-center justify-center rounded-full border border-line-strong text-[16px] font-semibold text-ink hover:border-gold hover:text-gold"
          >
            Verlassen
          </a>
          <p className="pt-1 text-center text-[15px] text-ink-soft">
            Mit dem Eintritt akzeptierst du unsere{" "}
            <Link href="/terms" className="text-gold">
              AGB
            </Link>{" "}
            und den{" "}
            <Link href="/privacy" className="text-gold">
              Datenschutz
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default AgeVerificationGate;
