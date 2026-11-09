import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { BrandLogo } from "@/components/BrandLogo";
import { DoorHanger, HeroScene } from "@/components/visuals";
import { Lock } from "lucide-react";

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#030b0e]/92 p-4 backdrop-blur-xl">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
        className="grid w-full max-w-3xl overflow-hidden rounded-3xl border border-[#1d4350] bg-[#0a1a21] shadow-[0_30px_90px_rgba(0,0,0,0.8)] md:grid-cols-[0.9fr_1.1fr]"
      >
        <div className="relative hidden min-h-[420px] bg-[#0d1f27] md:block">
          <HeroScene className="absolute inset-0 h-full w-full" align="xMidYMid" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07141a]/85 via-transparent to-transparent" />
          <DoorHanger tone="dark" className="absolute left-1/2 top-6 w-40 -translate-x-1/2 drop-shadow-2xl" />
        </div>

        <div className="space-y-6 p-7 text-left sm:p-9">
          <BrandLogo compact />

          <div className="space-y-3">
            <h2 id="age-gate-title" className="text-3xl text-[#f2f7f6]">
              Nur für Erwachsene
            </h2>
            <p className="leading-7 text-[#b4cac8]">
              Diese Schweizer Vergleichs- und Direktbuchungsplattform richtet sich ausschliesslich an Personen ab 18 Jahren.
              Alle Angaben unterliegen dem Schweizer Datenschutzgesetz (revDSG).
            </p>
          </div>

          <ul className="space-y-3 rounded-2xl border border-[#1d4350] bg-[#0d1f27] p-4 text-sm text-[#d6e4e2]">
            <li className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#4fd1b0]/15 text-xs font-bold text-[#4fd1b0]">
                ✓
              </span>
              <span>
                Ich bestätige, dass ich mindestens <strong>18 Jahre alt</strong> bin.
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Lock size={16} className="shrink-0 text-[#ffb067]" />
              <span>Diskreter Sitzungs-Modus ohne externes Werbe-Tracking.</span>
            </li>
          </ul>

          <div className="space-y-3">
            <button type="button" onClick={handleConfirm} className="brass-button min-h-[52px] w-full cursor-pointer px-6 text-base">
              Ich bin 18+, weiter zur Plattform
            </button>
            <a href="https://www.sbb.ch" className="block text-center text-sm text-[#9fb8b5] underline-offset-4 hover:text-white hover:underline">
              Unter 18, Seite verlassen
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#1d4350] pt-4 text-sm text-[#9fb8b5]">
            <Link href="/privacy" className="hover:text-white hover:underline">
              Datenschutz
            </Link>
            <Link href="/terms" className="hover:text-white hover:underline">
              Nutzungsbedingungen
            </Link>
            <Link href="/for-clients" className="hover:text-white hover:underline">
              So funktioniert&apos;s
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
