import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { BrandLogo, StencilSerifX } from "@/components/BrandLogo";
import { ShieldCheck, Lock } from "lucide-react";

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
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-2xl bg-[#090A0F] border border-[#C8A97E]/45 p-7 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.95)] text-center space-y-6">
        {/* Top Architectural Stencil-X Emblem */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-xl bg-[#0F1C2E] border border-[#C8A97E]/50 flex items-center justify-center shadow-lg mb-3">
            <StencilSerifX color="#C8A97E" className="w-10 h-8" />
          </div>
          <div className="text-[10px] uppercase tracking-[0.24em] text-[#C8A97E] font-semibold">
            SWISS ESCORT INDEX & DIRECT BOOKING
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#11131C] border border-[#C8A97E]/30 text-[11px] font-semibold text-[#C8A97E]">
          <ShieldCheck size={14} className="text-[#C8A97E]" />
          <span>SCHWEIZER ALTERS- & DISKRETIONS-CHECK (18+)</span>
        </div>

        {/* Title with exact lowercase serif brand wordmark */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F8F6F0] tracking-tight">
            Willkommen auf{" "}
            <span className="inline-flex items-baseline">
              <span>iwantse</span>
              <StencilSerifX
                color="#C8A97E"
                className="w-[21px] h-[17px] mx-[0.5px] translate-y-[1.5px]"
              />
              <span>now.ch</span>
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            Diese Schweizer Vergleichs- und Direktbuchungsplattform richtet sich ausschliesslich an volljährige Personen (mindestens 18 Jahre alt). Alle Angaben unterliegen dem Schweizer Datenschutzgesetz (revDSG).
          </p>
        </div>

        {/* Checklist */}
        <div className="p-4 rounded-xl bg-[#11131C] border border-white/10 text-left space-y-2.5 text-xs text-gray-300">
          <div className="flex items-center gap-2.5">
            <span className="w-4 h-4 rounded-full bg-[#C8A97E]/20 border border-[#C8A97E] text-[#C8A97E] flex items-center justify-center text-[10px] font-bold shrink-0">
              ✓
            </span>
            <span>Ich bestätige, dass ich mindestens <strong>18 Jahre alt</strong> bin.</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Lock size={14} className="text-[#C8A97E] shrink-0" />
            <span>Diskreter Sitzungs-Modus ohne externes Werbe-Tracking.</span>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-3.5 rounded-xl bg-[#C8A97E] hover:bg-[#d8b98e] text-[#090A0F] font-bold text-sm tracking-wide transition cursor-pointer shadow-lg"
          >
            Ich bin 18+ · Plattform betreten
          </button>
          <a
            href="https://www.sbb.ch"
            className="block text-xs text-gray-500 hover:text-gray-300 transition"
          >
            Unter 18 Jahre · Seite verlassen
          </a>
        </div>

        {/* Footer Legal Links */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-4 text-[11px] text-gray-400">
          <Link href="/privacy" className="hover:text-[#C8A97E] underline">
            Datenschutz (CH-DSG)
          </Link>
          <Link href="/terms" className="hover:text-[#C8A97E] underline">
            Nutzungsbedingungen
          </Link>
          <Link href="/for-clients" className="hover:text-[#C8A97E] underline">
            So funktioniert&apos;s
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AgeVerificationGate;