import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
import { ShieldAlert, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ReportAndOptOutPage() {
  const router = useRouter();
  const [profileId, setProfileId] = useState("");
  const [reason, setReason] = useState("Opt-Out: Ich möchte meinen Eintrag dauerhaft ausblenden");
  const [contact, setContact] = useState("");
  const [details, setDetails] = useState("");
  const [caseId, setCaseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const qId = String(router.query.id || router.query.profileId || router.query.name || "").trim();
    if (qId) setProfileId(qId);
  }, [router.query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/vault/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit_takedown",
          profileId: profileId.trim(),
          reason,
          contact: contact.trim(),
          details: details.trim()
        })
      });
      const data = await res.json();
      if (!res.ok || !data?.ok || !data?.caseId) {
        throw new Error(String(data?.error || "Meldung konnte nicht sicher gespeichert werden."));
      }
      setCaseId(data.caseId);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Meldung nicht gespeichert.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-papier text-tinte pb-24">
      <SEO
        title="Profil melden oder Entfernung beantragen | iwantsexnow.ch"
        description="Vertraulicher Meldeweg für Korrekturen, Identitätsmissbrauch und Entfernungsanträge."
      />
      <LuxuryHeader />
      <PageIntro
        tone="himmel"
        note="Dein Recht, ohne Umwege"
        title="Eintrag entfernen oder Korrektur melden"
        lead="Vertraulich melden und den Bearbeitungsstatus nachvollziehen, ohne voreilige Erfolgsversprechen."
        art="verified"
      >
        <Link href="/" className="emerald-button"><ArrowLeft size={14} /> Zurück zur Übersicht</Link>
      </PageIntro>

      <main className="-mt-6 relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pb-10 space-y-6">
        <div className="p-6 sm:p-8 rounded-2xl bg-white border-2 border-tinte shadow-[0_5px_0_rgba(30,34,71,0.9)] space-y-6">
          <div>
            <span className="text-[13px] text-glow-700 font-bold flex items-center gap-1.5">
              <ShieldAlert size={13} /> Vertrauliche Meldung ohne Konto
            </span>
            <p className="text-[13px] text-gray-600 mt-1">
              Wir prüfen Meldungen zu eigenen Daten, unautorisierten Bildern und falschen Angaben. Eine Annahmebestätigung bedeutet nicht, dass die Entfernung bereits erfolgt ist.
            </p>
          </div>

          {submitError && <div role="alert" className="p-4 rounded-xl border border-red-300 bg-red-50 text-red-800 text-sm"><strong>Meldung nicht gespeichert:</strong> {submitError} <Link className="underline font-semibold" href="/contact">Kontakt öffnen</Link></div>}

          {caseId ? (
            <div className="p-5 rounded-xl bg-mint-100/60 border border-mint-500/40 space-y-2">
              <div className="flex items-center gap-2 text-mint-700 font-bold text-sm">
                <CheckCircle2 size={18} />
                <span>Meldung eingegangen (Fall-Nr.: {caseId})</span>
              </div>
              <p className="text-[13px] text-gray-700">
                Wir haben dein Anliegen zu <strong>{profileId}</strong> erfasst; der Status lautet eingegangen, nicht entfernt.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">
                  Betroffene Profil-ID, Name oder Telefonnummer *
                </label>
                <input
                  type="text"
                  required
                  value={profileId}
                  onChange={(e) => setProfileId(e.target.value)}
                  placeholder="z.B. ch-a720e283e85f oder +41 79 ..."
                  className="w-full rounded-xl bg-papier border border-tinte/25 px-4 py-2.5 text-sm text-tinte"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Grund der Meldung</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-xl bg-papier border border-tinte/25 px-4 py-2.5 text-sm text-tinte"
                >
                  <option value="Opt-Out: Ich möchte meinen Eintrag dauerhaft ausblenden">
                    Opt-Out: Ich möchte meinen Eintrag dauerhaft ausblenden
                  </option>
                  <option value="Urheberrecht / Bildberechtigung">Urheberrecht / Unautorisierte Bildnutzung</option>
                  <option value="Veraltete Preis- oder Ortsangabe">Veraltete Preis- oder Ortsangabe</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Rückfrage-Kontakt (Optional)</label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="E-Mail oder +41 Nummer für Bestätigung"
                  className="w-full rounded-xl bg-papier border border-tinte/25 px-4 py-2.5 text-sm text-tinte"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Zusätzliche Hinweise (Optional)</label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full rounded-xl bg-papier border border-tinte/25 p-3.5 text-sm text-tinte"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-glow-600 hover:bg-glow-500 text-white font-extrabold text-[13px] cursor-pointer"
              >
                {loading ? "Meldung wird gespeichert..." : "Vertrauliche Meldung einreichen →"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}