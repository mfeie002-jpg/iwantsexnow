import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
import { ShieldCheck, ArrowLeft, CheckCircle2, Camera } from "lucide-react";

export default function VerifyIdentityPage() {
  const router = useRouter();
  const [profileId, setProfileId] = useState("");
  const [token, setToken] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [dayCode] = useState(() => "CH-" + Math.floor(1000 + Math.random() * 9000));
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const qId = String(router.query.id || router.query.profileId || "").trim();
    const qTok = String(router.query.token || "").trim();
    if (qId) setProfileId(qId);
    if (qTok) setToken(qTok);

    if (typeof window !== "undefined") {
      try {
        const saved = JSON.parse(localStorage.getItem("iwsn_creator_session") || "{}");
        if (!qId && saved.profileId) setProfileId(saved.profileId);
        if (!qTok && saved.token) setToken(saved.token);
        if (saved.name) setDisplayName(saved.name);
      } catch {}
    }
  }, [router.query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const targetId = profileId.trim() || displayName.trim() || "ch-a720e283e85f";
      await fetch("/api/vault/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_profile_state",
          profileId: targetId,
          token,
          
          updates: {
            identityRequested: true,
            displayName: displayName.trim() || undefined,
            phoneDisplay: phone.trim() || undefined,
            verificationCode: dayCode,
            verificationMediaUrl: mediaUrl.trim(),
          },
        }),
      });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-tinte pb-24">
      <SEO
        title="Identitäts- & Bildprüfung beantragen (✓) | iwantsexnow.ch"
        description="Dokumentiertes Prüfverfahren für Volljährigkeit (18+) und Bildberechtigung auf iwantsexnow.ch."
      />
      <LuxuryHeader />

      <PageIntro tone="minze" note="Echt ist besser" art="verified" title={<>Dokumentierte Identitäts- & Bildprüfung beantragen</>}
        lead={<>Das Merkmal „Identität geprüft (✓)“ wird ausschliesslich vergeben, wenn Volljährigkeit (18+) und die Übereinstimmung mit den veröffentlichten Profilbildern per Tagescode bestätigt wurden.</>} />

      <main className="form-sheet">
        <Link href="/creator-dashboard" className="inline-flex items-center gap-1.5 text-[13px] font-bold text-gray-700 hover:text-tinte">
          <ArrowLeft size={14} />
          <span>Zurück zum Anbieter-Cockpit</span>
        </Link>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[13px]">
          <div className="p-4 rounded-xl bg-fels border border-tinte/20 space-y-1.5">
            <div className="font-bold text-kirsche">1. Volljährigkeit (18+)</div>
            <p className="text-gray-700 leading-relaxed">
              Abgleich des Geburtsdatums (nicht relevante Seriennummern dürfen geschwärzt werden).
            </p>
          </div>
          <div className="p-4 rounded-xl bg-fels border border-tinte/20 space-y-1.5">
            <div className="font-bold text-kirsche">2. Tagescode: {dayCode}</div>
            <p className="text-gray-700 leading-relaxed">
              Kurzes Selfie mit einem Zettel und dem heutigen Prüfcode <strong>{dayCode}</strong>.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-fels border border-tinte/20 space-y-1.5">
            <div className="font-bold text-kirsche">3. Datensparsamkeit</div>
            <p className="text-gray-700 leading-relaxed">
              Prüfaufnahmen dienen ausschliesslich der Freigabe im Backend und werden niemals veröffentlicht.
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-mint-100/60 border border-mint-500/40 space-y-3">
            <div className="flex items-center gap-2 text-mint-700 font-bold text-sm">
              <CheckCircle2 size={18} className="text-mint-700" />
              <span>Prüfantrag erfolgreich ans Backend übermittelt!</span>
            </div>
            <p className="text-[13px] text-gray-700">
              Dein Antrag (Prüfcode <strong>{dayCode}</strong>) liegt jetzt zur Freigabe vor. Sobald bestätigt, erscheint das goldene Siegel „✓ Identität geprüft“ auf deinem Profil.
            </p>
            <div className="flex gap-3 pt-2">
              <Link href="/creator-dashboard" className="px-4 py-2 rounded-xl bg-kirsche text-[#ffffff] font-extrabold text-[13px]">
                Zurück zum Anbieter-Cockpit →
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-fels border border-tinte/20 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Deine Profil-ID oder Anzeigename *</label>
                <input
                  type="text"
                  required
                  value={profileId || displayName}
                  onChange={(e) => {
                    setProfileId(e.target.value);
                    setDisplayName(e.target.value);
                  }}
                  placeholder="z.B. ch-a720e283e85f oder TS Peruvian Exotic"
                  className="w-full rounded-xl bg-white border border-tinte/25 px-4 py-2.5 text-sm text-tinte"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Deine +41 Rückruf-/WhatsApp-Nummer *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+41 79 ..."
                  className="w-full rounded-xl bg-white border border-tinte/25 px-4 py-2.5 text-sm text-mint-700 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5">
                Link zum Prüf-Selfie mit Code {dayCode} (Optional – oder per WhatsApp-Prüfung)
              </label>
              <input
                type="text"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://... oder leer lassen für kurzen WhatsApp-Check"
                className="w-full rounded-xl bg-white border border-tinte/25 px-4 py-2.5 text-sm text-tinte"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-kirsche hover:bg-kirsche text-[#ffffff] font-extrabold text-[13px] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Camera size={15} />
              <span>{loading ? "Übermittle Prüfantrag..." : `Prüfantrag (Code ${dayCode}) jetzt absenden →`}</span>
            </button>
          </form>
        )}
      </main>
    </div>
  );
}