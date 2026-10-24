import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AgeVerificationGate() {
  const [verified, setVerified] = useState<boolean>(true);

  useEffect(() => {
    const isOk = localStorage.getItem("swissAgeVerified18");
    if (!isOk) {
      setVerified(false);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem("swissAgeVerified18", "true");
    setVerified(true);
  };

  if (verified) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/92 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-3xl bg-[#09131E] border-2 border-[#C69C6D]/70 p-7 text-white shadow-[0_20px_70px_rgba(0,0,0,0.9)] text-center space-y-5">
        {/* Official Concept A: The Swiss Shield Crest */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-20 h-20 mx-auto drop-shadow-[0_6px_18px_rgba(213,160,33,0.45)]">
            <svg viewBox="0 0 64 64" className="w-full h-full">
              <defs>
                <linearGradient id="ageShieldGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F6E27A" />
                  <stop offset="50%" stopColor="#C69C6D" />
                  <stop offset="100%" stopColor="#9A6F32" />
                </linearGradient>
                <linearGradient id="ageShieldBg" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#16283E" />
                  <stop offset="100%" stopColor="#07101A" />
                </linearGradient>
              </defs>
              <path
                d="M32 4 L56 12 V30 C56 46 45 55 32 60 C19 55 8 46 8 30 V12 L32 4 Z"
                fill="url(#ageShieldBg)"
                stroke="url(#ageShieldGold)"
                strokeWidth="3"
              />
              <path
                d="M32 8 L52 15 V29 C52 43 42 51 32 55 C22 51 12 43 12 29 V15 L32 8 Z"
                fill="none"
                stroke="url(#ageShieldGold)"
                strokeWidth="0.9"
                strokeOpacity="0.6"
              />
              <path
                d="M30.5 11 H33.5 V14 H36.5 V17 H33.5 V20 H30.5 V17 H27.5 V14 H30.5 Z"
                fill="#F6E27A"
              />
              <text
                x="32"
                y="44"
                textAnchor="middle"
                fill="url(#ageShieldGold)"
                fontFamily="Georgia, serif"
                fontWeight="900"
                fontSize="24"
                letterSpacing="-1"
              >
                iW
              </text>
            </svg>
          </div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#D5A021] font-bold">
            The Swiss Shield · Verified Index
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C69C6D]/15 border border-[#C69C6D]/40 text-xs font-bold text-[#D5A021]">
          <ShieldCheck size={14} className="text-emerald-400" />
          SCHWEIZER ALTERS- & DISKRETIONS-CHECK (18+)
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif font-black leading-tight">
          Willkommen auf iWantSexNow.ch
        </h2>

        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
          Diese Schweizer Vergleichs- und Direktbuchungsplattform richtet sich ausschliesslich an volljährige Personen (mindestens 18 Jahre alt). Alle Anfragen unterliegen dem Schweizer Datenschutzgesetz (revDSG).
        </p>

        <div className="bg-black/45 border border-white/10 rounded-xl p-3.5 text-left text-xs text-gray-300 space-y-1.5">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
            <span>Ich bestätige, dass ich mindestens <strong>18 Jahre alt</strong> bin.</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock size={14} className="text-[#D5A021] shrink-0" />
            <span>Diskreter Sitzungs-Modus ohne externes Werbe-Tracking.</span>
          </div>
        </div>

        <Button
          onClick={handleConfirm}
          className="w-full py-6 text-base font-black bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] shadow-xl rounded-xl"
        >
          Ich bin 18+ · Marktplatz betreten
        </Button>

        <div className="flex items-center justify-center gap-4 text-[11px] text-gray-400 pt-1">
          <Link href="/privacy" className="hover:text-white underline">Datenschutz (CH-DSG)</Link>
          <Link href="/terms" className="hover:text-white underline">Nutzungsbedingungen</Link>
          <Link href="/how-it-works" className="hover:text-[#D5A021] underline">So funktioniert's</Link>
        </div>
      </div>
    </div>
  );
}