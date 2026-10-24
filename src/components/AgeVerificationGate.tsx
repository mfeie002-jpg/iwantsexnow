import { useState, useEffect } from "react";
import { ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AgeVerificationGate() {
  const [showGate, setShowGate] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem("swissShieldAgeVerified");
    if (!verified) {
      setShowGate(true);
    }
  }, []);

  const handleConfirmAge = () => {
    localStorage.setItem("swissShieldAgeVerified", "true");
    setShowGate(false);
  };

  if (!showGate) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-2xl bg-[#09131E] border-2 border-[#C69C6D]/70 p-6 sm:p-8 text-white shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#16293D] to-[#07101A] border border-[#C69C6D] mx-auto flex items-center justify-center shadow-lg">
          <span className="font-serif font-black text-2xl text-[#D5A021]">iW</span>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#C69C6D]/15 border border-[#C69C6D]/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#D5A021]">
          <ShieldCheck size={13} className="text-emerald-400" />
          Schweizer Alters- & Diskretions-Check (18+)
        </div>

        <h2 className="text-2xl font-serif font-black leading-snug">
          Willkommen auf iWantSexNow.ch
        </h2>

        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
          Diese Schweizer Vergleichs- und Direktbuchungsplattform richtet sich ausschliesslich an volljährige Personen (mindestens 18 Jahre alt). Alle Anfragen unterliegen dem Schweizer Datenschutzgesetz (revDSG).
        </p>

        <div className="bg-black/40 border border-white/10 rounded-xl p-3 text-left text-xs text-gray-300 space-y-1.5">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
            <span>Ich bestätige, dass ich mindestens <strong>18 Jahre alt</strong> bin.</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock size={14} className="text-[#D5A021] shrink-0" />
            <span>Diskreter Sitzungs-Modus ohne externes Werbe-Tracking.</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={handleConfirmAge}
            className="w-full bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] font-black py-6 text-sm shadow-xl"
          >
            Ich bin 18+ · Marktplatz betreten
          </Button>
        </div>

        <div className="text-[11px] text-gray-500 flex justify-center gap-4 pt-1">
          <Link href="/privacy" onClick={handleConfirmAge} className="hover:text-gray-300 underline">
            Datenschutz (CH-DSG)
          </Link>
          <Link href="/terms" onClick={handleConfirmAge} className="hover:text-gray-300 underline">
            Nutzungsbedingungen
          </Link>
        </div>
      </div>
    </div>
  );
}