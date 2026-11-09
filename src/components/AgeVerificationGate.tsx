import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { BrandLogo } from "@/components/BrandLogo";
import { DoorHanger, HeroScene } from "@/components/visuals";

const STORAGE_KEY = "iwsn_age_verified_v2";

export function AgeVerificationGate() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [verified, setVerified] = useState(true);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "true") {
        setVerified(true);
      } else {
        setVerified(false);
      }
    } catch {
      setVerified(false);
    }
  }, []);

  const handleConfirm = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {}
    setVerified(true);
  };

  if (!mounted || verified) return null;

  const openLegalpaths = ["/privacy", "/terms", "/imprint", "/report"];
  if (openLegalpaths.includes(router.pathname)) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-tinte/80 p-4 backdrop-blur-md">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
        className="grid w-full max-w-3xl overflow-hidden rounded-[2rem] border-2 border-tinte bg-papier shadow-[0_8px_0_rgba(251,250,248,0.35)] md:grid-cols-[0.8fr_1.2fr]"
      >
        <div className="field-blush relative hidden min-h-[440px] overflow-hidden md:block">
          <HeroScene className="absolute inset-x-0 bottom-0 h-40 w-full" align="xMidYMax" />
          <div className="absolute left-1/2 top-0 h-10 w-0.5 -translate-x-1/2 bg-tinte/60" aria-hidden="true" />
          <DoorHanger tone="light" className="absolute left-1/2 top-9 w-40 origin-top -translate-x-1/2 -rotate-3" />
        </div>

        <div className="space-y-6 p-7 text-left sm:p-9">
          <BrandLogo compact />

          <div className="space-y-3">
            <h2 id="age-gate-title" className="text-[2rem] text-tinte">
              Erst kurz: bist du 18?
            </h2>
            <p className="leading-7 text-tinte/80">
              Diese Plattform ist nur für Erwachsene. Deine Angaben behandeln wir nach dem Schweizer Datenschutzgesetz (revDSG), ohne Werbe-Tracking von Dritten.
            </p>
          </div>

          <div className="space-y-3">
            <button type="button" onClick={handleConfirm} className="brass-button min-h-[54px] w-full cursor-pointer px-6 text-base">
              Ja, ich bin 18 oder älter
            </button>
            <a href="https://www.sbb.ch" className="block text-center text-sm font-semibold text-tinte/70 underline decoration-2 underline-offset-4 hover:text-tinte">
              Nein, ich bin unter 18
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t-2 border-dotted border-tinte/20 pt-4 text-sm text-tinte/70">
            <Link href="/privacy" className="hover:text-tinte hover:underline">
              Datenschutz
            </Link>
            <Link href="/terms" className="hover:text-tinte hover:underline">
              Nutzungsbedingungen
            </Link>
            <Link href="/for-clients" className="hover:text-tinte hover:underline">
              So funktioniert&apos;s
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
