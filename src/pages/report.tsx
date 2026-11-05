import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { ShieldAlert, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ReportAndOptOutPage() {
  const router = useRouter();
  const [profileId, setProfileId] = useState("");
  const [reason, setReason] = useState("Opt-Out: Ich möchte meinen Eintrag dauerhaft ausblenden");
  const [contact, setContact] = useState("");
  const [details, setDetails] = useState("");
  const [caseId, setCaseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const qId = String(router.query.id || router.query.profileId || router.query.name || "").trim();
    if (qId) setProfileId(qId);
  }, [router.query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/vault/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit_takedown",
          profileId: profileId.trim(),
          reason,
          contact: contact.trim(),
          details: details.trim(),
        }),
      });
      const data = await res.json();
      setCaseId(data?.caseId || "CASE-" + Date.now().toString().slice(-6));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO
        title="Profil melden oder Eintrag sofort entfernen (Opt-Out ohne Login) | iWantSexNow.ch"
        description="Unkomplizierte Sofort-Ausblendung und Sperrliste (Do-Not-Import) nach Schweizer Datenschutzgesetz (revDSG)."
      />
      <LuxuryHeader />

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-white">
          <ArrowLeft size={14} /> Zurück zur Übersicht
        </Link>

        <div className="p-6 sm:p-8 rounded-2xl bg-[#121722] border border-white/10 space-y-6">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-rose-400 font-bold flex items-center gap-1.5">
              <ShieldAlert size={13} /> SOFORT-AUSBLENDUNG OHNE LOGIN-PFLICHT (CH-DSG)
            </span>
            <h1 className="text-2xl font-serif font-bold text-white mt-1">
              Eintrag entfernen (Opt-Out) oder Korrektur melden
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Sobald du dieses Formular absendest, wird die angegebene Profil-ID sofort im öffentlichen Verzeichnis ausgeblendet und auf die interne Do-Not-Import-Sperrliste gesetzt.
            </p>
          </div>

          {caseId ? (
            <div className="p-5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <CheckCircle2 size={18} />
                <span>Eintrag wurde sofort ausgeblendet (Fall-Nr.: {caseId})</span>
              </div>
              <p className="text-xs text-gray-300">
                Das Profil <strong>{profileId}</strong> ist ab sofort öffentlich unsichtbar und für künftige Index-Läufe gesperrt.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Betroffene Profil-ID, Name oder Telefonnummer *
                </label>
                <input
                  type="text"
                  required
                  value={profileId}
                  onChange={(e) => setProfileId(e.target.value)}
                  placeholder="z.B. ch-a720e283e85f oder +41 79 ..."
                  className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-4 py-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Grund der Meldung</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-4 py-2.5 text-sm text-white"
                >
                  <option value="Opt-Out: Ich möchte meinen Eintrag dauerhaft ausblenden">
                    Opt-Out: Ich möchte meinen Eintrag dauerhaft ausblenden
                  </option>
                  <option value="Urheberrecht / Bildberechtigung">Urheberrecht / Unautorisierte Bildnutzung</option>
                  <option value="Veraltete Preis- oder Ortsangabe">Veraltete Preis- oder Ortsangabe</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Rückfrage-Kontakt (Optional)</label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="E-Mail oder +41 Nummer für Bestätigung"
                  className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-4 py-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Zusätzliche Hinweise (Optional)</label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full rounded-xl bg-[#0D111A] border border-white/15 p-3.5 text-sm text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs uppercase tracking-wider cursor-pointer"
              >
                {loading ? "Blende Eintrag sofort aus..." : "Eintrag jetzt sofort ausblenden & sperren →"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}