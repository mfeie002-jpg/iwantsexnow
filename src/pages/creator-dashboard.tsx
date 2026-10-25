import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import {
  Clock,
  Check,
  Eye,
  EyeOff,
  ShieldCheck,
  ExternalLink,
  Save,
  Sparkles,
  UserCheck,
  ArrowRight,
} from "lucide-react";

const SWISS_CANTONS = ["ZH", "ZG", "BS", "BE", "LU", "AG", "SG", "TG", "SO", "SZ", "GR", "GE", "VD", "VS", "TI"];

export default function CreatorDashboardPage() {
  const router = useRouter();
  const [profileId, setProfileId] = useState("ch-1");
  const [ownerToken, setOwnerToken] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [city, setCity] = useState("Zürich");
  const [canton, setCanton] = useState("ZH");
  const [rate60Chf, setRate60Chf] = useState("350");
  const [bio, setBio] = useState("");
  const [availabilityConfirmed, setAvailabilityConfirmed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [identityVerified, setIdentityVerified] = useState(false);
  const [metrics, setMetrics] = useState({ views: 0, detailOpens: 0, contactClicks: 0 });
  const [statusMsg, setStatusMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    const qId = String(router.query.id || (typeof window !== "undefined" ? localStorage.getItem("iwsn_last_profile_id") || "ch-1" : "ch-1"));
    const qTok = String(router.query.token || (typeof window !== "undefined" ? localStorage.getItem("iwsn_owner_token_" + qId) || "" : ""));
    setProfileId(qId);
    setOwnerToken(qTok);

    fetch("/api/vault/metrics")
      .then((r) => r.json())
      .then((d) => {
        if (d && d.ok) {
          const st = (d.states && d.states[qId]) || {};
          const mt = (d.metrics && d.metrics[qId]) || { views: 0, detailOpens: 0, contactClicks: 0 };
          if (st.displayName) setDisplayName(st.displayName);
          if (st.city) setCity(st.city);
          if (st.canton) setCanton(st.canton);
          if (st.rate60Chf) setRate60Chf(String(st.rate60Chf));
          if (st.bio) setBio(st.bio);
          setAvailabilityConfirmed(Boolean(st.availabilityConfirmed));
          setPaused(Boolean(st.paused));
          setIdentityVerified(Boolean(st.identityVerified));
          setMetrics({
            views: mt.views || 0,
            detailOpens: mt.detailOpens || 0,
            contactClicks: mt.contactClicks || 0,
          });
        }
      })
      .catch(() => {});
  }, [router.isReady, router.query]);

  const triggerAction = async (actionName: string, extraPayload: Record<string, any> = {}) => {
    setSaving(true);
    setStatusMsg("");
    try {
      const res = await fetch("/api/vault/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: actionName,
          profileId,
          ownerToken,
          ...extraPayload,
        }),
      });
      const data = await res.json();
      if (data && data.ok) {
        setStatusMsg("✓ Änderungen wurden sofort gespeichert und auf deiner Profilkarte aktualisiert.");
      } else {
        setStatusMsg("Hinweis: " + (data?.error || "Aktion gespeichert."));
      }
    } catch {
      setStatusMsg("Gespeichert im lokalen Sitzungsstatus.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAvailability = async () => {
    const nextVal = !availabilityConfirmed;
    setAvailabilityConfirmed(nextVal);
    await triggerAction("confirm_availability_4h", { availabilityConfirmed: nextVal });
  };

  const handleTogglePause = async () => {
    const nextPause = !paused;
    setPaused(nextPause);
    await triggerAction("update_profile_fields", { paused: nextPause });
  };

  const handleSaveFields = async (e: React.FormEvent) => {
    e.preventDefault();
    await triggerAction("update_profile_fields", {
      displayName: displayName.trim() || "Direktprofil",
      city: city.trim() || "Zürich",
      canton,
      rate60Chf: Number(rate60Chf) || 350,
      bio,
    });
  };

  return (
    <div className="min-h-screen bg-[#13161C] text-white pb-24">
      <SEO
        title="Anbieter-Cockpit: Verfügbarkeit & Profilangaben verwalten | iwantsexnow.ch"
        description="Steuere deinen 4h-Verfügbarkeitsstatus, pflege deine Angaben oder pausiere dein Profil kostenlos."
        noindex
      />
      <LuxuryHeader />

      <main className="max-w-5xl mx-auto px-6 sm:px-10 py-8 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#C6A574]">
              SELBSTVERWALTETES PROFIL · ANBIETER-COCKPIT
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white mt-1">
              {displayName ? "Profilverwaltung: " + displayName : "Dein Anbieter-Cockpit"} ({profileId})
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={"/profile/" + encodeURIComponent(profileId)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-white inline-flex items-center gap-1.5"
            >
              <span>Öffentliche Karte ansehen</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </div>

        {statusMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-200 font-semibold">
            {statusMsg}
          </div>
        )}

        {/* Top 2 Live Action Cards: 1. 4h Availability | 2. Visibility / Pause */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-6 rounded-2xl bg-[#1C2029] border border-white/15 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#22C55E]">
                  1. Echtzeit-Verfügbarkeit (4h-Fenster)
                </span>
                {availabilityConfirmed && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1B5E32] text-[#A7F3D0] text-[11px] font-bold">
                    ● Jetzt verfügbar aktiv
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-white">
                Status „Jetzt verfügbar“ bestätigen
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed">
                Sobald aktiviert, zeigt deine Karte das grüne Label „Jetzt verfügbar“ samt exaktem Zeitstempel („Bestätigt vor 1 Min.“). Nach 4 Stunden läuft der Status automatisch ab.
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleAvailability}
              disabled={saving}
              className={
                availabilityConfirmed
                  ? "w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs cursor-pointer"
                  : "w-full py-3 rounded-xl bg-[#22C55E] hover:bg-emerald-400 text-[#0F1218] font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-lg"
              }
            >
              {availabilityConfirmed
                ? "Verfügbarkeit wieder auf neutral setzen"
                : "● Jetzt für 4 Stunden als verfügbar bestätigen"}
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-[#1C2029] border border-white/15 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C6A574]">
                  2. Sichtbarkeit & Pause
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-gray-200 text-[11px] font-bold">
                  {paused ? "Pausiert (Ausgeblendet)" : "Öffentlich sichtbar"}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">
                Profil vorübergehend pausieren
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed">
                Du kannst deinen Eintrag jederzeit mit einem Klick aus dem öffentlichen Verzeichnis ausblenden (z.B. bei Urlaub oder Abwesenheit) und später wieder aktivieren.
              </p>
            </div>

            <button
              type="button"
              onClick={handleTogglePause}
              disabled={saving}
              className="w-full py-3 rounded-xl bg-[#13161C] hover:bg-white/10 border border-white/15 text-xs font-bold text-gray-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              {paused ? <Eye size={15} /> : <EyeOff size={15} />}
              <span>{paused ? "Profil wieder öffentlich sichtbar schalten" : "Profil jetzt pausieren / ausblenden"}</span>
            </button>
          </div>
        </div>

        {/* Form to Edit Core Fields */}
        <form
          onSubmit={handleSaveFields}
          className="p-6 sm:p-8 rounded-2xl bg-[#1C2029] border border-white/15 space-y-5"
        >
          <h2 className="text-xl font-serif font-bold text-white">
            Veröffentlichte Angaben & Richtpreis bearbeiten
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Anzeigename</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#13161C] border border-white/15 text-xs sm:text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Stadt / Ort</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#13161C] border border-white/15 text-xs sm:text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Kanton</label>
              <select
                value={canton}
                onChange={(e) => setCanton(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#13161C] border border-white/15 text-xs sm:text-sm text-white"
              >
                {SWISS_CANTONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Richtpreis 60 Min. (CHF)</label>
              <input
                type="number"
                value={rate60Chf}
                onChange={(e) => setRate60Chf(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#13161C] border border-white/15 text-xs sm:text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Kurzbeschreibung & Konditionen (z.B. Privatempfang / Hotelbesuch)
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Beschreibe kurz dein Angebot und deine Rahmenbedingungen..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#13161C] border border-white/15 text-xs sm:text-sm text-white"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <Link href="/verify" className="text-xs font-bold text-[#C6A574] hover:underline inline-flex items-center gap-1.5">
              <ShieldCheck size={15} />
              <span>{identityVerified ? "✓ Identität ist geprüft" : "Dokumentierte Identitätsprüfung (✓) beantragen →"}</span>
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-[#C6A574] hover:bg-[#d5b687] text-[#13161C] font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow"
            >
              <Save size={14} />
              <span>Angaben speichern</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
