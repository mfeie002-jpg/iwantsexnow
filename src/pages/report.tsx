import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { CorporateFooter } from "@/components/CorporateFooter";
import { Flag, Check, ArrowLeft, ShieldCheck } from "lucide-react";

export default function ReportOrRemoveProfilePage() {
  const router = useRouter();
  const [profileName, setProfileName] = useState("");
  const [profileId, setProfileId] = useState("");
  const [reason, setReason] = useState("remove_own_entry");
  const [details, setDetails] = useState("");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.name) setProfileName(String(router.query.name));
    if (router.query.id) setProfileId(String(router.query.id));
  }, [router.isReady, router.query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profileId) {
      await fetch("/api/vault/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "report_or_optout",
          profileId,
          reason,
          details,
          contact,
        }),
      }).catch(() => {});
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F6F5F1] text-[#141821] pb-20">
      <SEO
        title="Profil melden, korrigieren oder entfernen lassen | iwantsexnow.ch"
        description="Kostenloser Widerspruch, Korrekturhinweis oder vollständige Entfernung eines Eintrags ohne Registrierungspflicht."
      />
      <LuxuryHeader />

      <main className="max-w-2xl mx-auto px-6 sm:px-10 py-10 space-y-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#141821] hover:underline">
          <ArrowLeft size={14} />
          <span>Zurück zur Übersicht</span>
        </Link>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#E8DEC8] text-[#5C4722] text-[11px] font-bold uppercase tracking-wider">
            <Flag size={12} />
            <span>DATENSCHUTZ & SOFORTIGE ENTFERNUNG OHNE KONTOPFLICHT</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#141821]">
            Eintrag melden, korrigieren oder entfernen
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Wenn Sie als Anbieterin nicht in unserem Verzeichnis aufgeführt werden möchten oder eine fehlerhafte Angabe melden wollen, können Sie dies hier kostenlos und ohne Erstellung eines Kontos veranlassen.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-white border border-emerald-300 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#DDF3E4] text-[#146C32] flex items-center justify-center">
              <Check size={20} />
            </div>
            <h2 className="text-lg font-bold text-[#141821]">
              Ihre Meldung wurde erfasst und der Eintrag zur Ausblendung markiert
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Vielen Dank. Bei einem Lösch- oder Sperrwunsch wird der betreffende Eintrag umgehend aus der öffentlichen Ansicht ausgeblendet und für künftige automatische Aktualisierungen gesperrt.
            </p>
            <Link href="/" className="inline-block px-5 py-2.5 rounded-xl bg-[#181614] text-white text-xs font-bold">
              Zurück zur Startseite →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-[#141821] mb-1">Betreffendes Profil / Name *</label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Name des Profils oder Telefonnummer..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5F1] border border-stone-300 text-[#141821]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#141821] mb-1">Anliegen auswählen *</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5F1] border border-stone-300 text-[#141821] font-semibold"
              >
                <option value="remove_own_entry">Ich bin die abgebildete Person und möchte den Eintrag komplett entfernen & sperren</option>
                <option value="incorrect_info">Angaben (Ort, Preis oder Status) sind veraltet oder fehlerhaft</option>
                <option value="unauthorized_photos">Unbefugte Bildverwendung / Urheberrecht</option>
                <option value="other_violation">Sonstiger Verstoss gegen Richtlinien</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#141821] mb-1">Kurze Angabe zur Zuordnung (optional)</label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="z.B. betroffene Telefonnummer, Link zum Ursprungsinserat oder Korrekturwunsch..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5F1] border border-stone-300 text-[#141821]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#141821] mb-1">Kontakt für Rückbestätigung (optional)</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="E-Mail oder +41 Nummer (wird ausschliesslich für die Löschbestätigung genutzt)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5F1] border border-stone-300 text-[#141821]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#181614] hover:bg-[#1e374d] text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow"
            >
              Meldung / Löschwunsch absenden →
            </button>
          </form>
        )}
      </main>
      <CorporateFooter light />
    </div>
  );
}
