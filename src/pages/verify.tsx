import React, { useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { CorporateFooter } from "@/components/CorporateFooter";
import { ShieldCheck, Check, Lock, FileCheck, ArrowLeft } from "lucide-react";

export default function IdentityVerificationPage() {
  const [profileName, setProfileName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#13161C] text-white pb-24">
      <SEO
        title="Identitäts- & Bildprüfung beantragen (✓) | iwantsexnow.ch"
        description="Dokumentiertes Prüfverfahren für Volljährigkeit (18+) und Bildberechtigung auf iwantsexnow.ch."
      />
      <LuxuryHeader />

      <main className="max-w-3xl mx-auto px-6 sm:px-10 py-10 space-y-8">
        <Link href="/creator-dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-white">
          <ArrowLeft size={14} />
          <span>Zurück zum Anbieter-Cockpit</span>
        </Link>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#C6A574]/15 border border-[#C6A574]/40 text-[#E5C99B] text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck size={13} />
            <span>NICHT KÄUFLICHES PRÜFMERKMAL · IDENTITÄT GEPRÜFT (✓)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">
            Was die Kennzeichnung „Identität geprüft“ bedeutet
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Eine blosse Konto-Registrierung löst bei uns noch kein Prüfsiegel aus. Das Merkmal „Identität geprüft (✓)“ wird ausschliesslich vergeben, wenn Volljährigkeit (18+) und die Übereinstimmung mit den eingereichten Profilbildern geprüft wurden.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#1C2029] border border-white/10 space-y-1.5">
            <div className="font-bold text-[#C6A574]">1. Volljährigkeit (18+)</div>
            <p className="text-gray-300 leading-relaxed">
              Abgleich des Geburtsdatums über ein gültiges Ausweisdokument (nicht relevante Seriennummern dürfen geschwärzt werden).
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#1C2029] border border-white/10 space-y-1.5">
            <div className="font-bold text-[#C6A574]">2. Bildberechtigung</div>
            <p className="text-gray-300 leading-relaxed">
              Kurzes Tagescode-Selfie zum Nachweis, dass die veröffentlichten Fotos tatsächlich die anmeldende Person zeigen.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#1C2029] border border-white/10 space-y-1.5">
            <div className="font-bold text-[#C6A574]">3. Datensparsamkeit</div>
            <p className="text-gray-300 leading-relaxed">
              Prüfaufnahmen dienen ausschliesslich der Freigabe und werden niemals öffentlich angezeigt oder an Dritte weitergegeben.
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-[#1C2029] border border-emerald-500/40 space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <Check size={20} />
            </div>
            <h2 className="text-lg font-bold text-white">Prüfanfrage wurde vorgemerkt</h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              Du erhältst deinen persönlichen Tagescode zur kostenlosen Echtheitsbestätigung an den angegebenen Kontaktweg.
            </p>
            <Link href="/creator-dashboard" className="inline-block px-5 py-2.5 rounded-xl bg-[#C6A574] text-[#13161C] font-bold text-xs">
              Zurück zum Cockpit →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-[#1C2029] border border-white/15 space-y-4 text-xs sm:text-sm">
            <h2 className="text-lg font-serif font-bold text-white">Prüfcode für dein Profil anfordern</h2>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Profilname oder Profil-ID *</label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="z.B. Elena (ch-1)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#13161C] border border-white/15 text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Kontakt für die Zusendung des Tagescodes *</label>
              <input
                type="text"
                required
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="+41 Nummer oder E-Mail-Adresse..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#13161C] border border-white/15 text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Optionaler Hinweis</label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#13161C] border border-white/15 text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#C6A574] hover:bg-[#d5b687] text-[#13161C] font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Kostenlosen Prüfcode anfordern →
            </button>
          </form>
        )}
      </main>
      <CorporateFooter />
    </div>
  );
}
