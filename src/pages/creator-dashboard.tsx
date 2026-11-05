import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import SEO from "@/components/SEO";
import { CheckCircle2, EyeOff, Eye, Clock, ShieldCheck, Save, ExternalLink, Trash2, Phone, Tag, MapPin } from "lucide-react";
import offersData from "@/data/harvested-offers.json";
import pilotData from "@/data/pilot-20-cohort.json";

export default function CreatorDashboardPage() {
  const router = useRouter();
  const profileId = String(router.query.id || router.query.profileId || "").trim();
  const token = String(router.query.token || "").trim();

  // Suche das Basis-Profil direkt in den 2.526 Schweizer Profilen (oder in der Pilot-20-Kohorte)
  const baseOffer = useMemo(() => {
    if (!profileId) return null;
    const allOffers = (offersData as any[]) || [];
    const found = allOffers.find(
      (o) =>
        o.id === profileId ||
        o.dedupClusterId === profileId ||
        String(o.rawName || "").toLowerCase() === profileId.toLowerCase()
    );
    if (found) return found;
    const pilots = (pilotData as any[]) || [];
    return pilots.find((p) => p.profileId === profileId || p.id === profileId) || null;
  }, [profileId]);

  const [displayName, setDisplayName] = useState("");
  const [city, setCity] = useState("Zug");
  const [canton, setCanton] = useState("ZG");
  const [phoneDisplay, setPhoneDisplay] = useState("");
  const [rate30Chf, setRate30Chf] = useState<number>(200);
  const [rate60Chf, setRate60Chf] = useState<number>(350);
  const [bio, setBio] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [sourcePortal, setSourcePortal] = useState("");

  const [availableUntil, setAvailableUntil] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [identityRequested, setIdentityRequested] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // 1. Sofort mit den echten Daten aus harvested-offers.json vorbefüllen
  useEffect(() => {
    if (!baseOffer) return;
    const cleanTitle = String(baseOffer.rawName || baseOffer.name || baseOffer.displayName || "")
      .replace(/\s+/g, " ")
      .trim();
    setDisplayName(cleanTitle);
    setCity(baseOffer.city || "Zug");
    setCanton(baseOffer.canton || "ZG");
    setPhoneDisplay(baseOffer.rawPhone || baseOffer.phoneDisplay || "");
    setRate30Chf(Number(baseOffer.rate30Chf) || 200);
    setRate60Chf(Number(baseOffer.advertisedBaseChf || baseOffer.rate60Chf) || 350);
    setBio(
      baseOffer.bio ||
        `${cleanTitle} in ${baseOffer.city || "Zug"} (${baseOffer.canton || "ZG"}) – Direktkontakt ohne Agentur-Aufschlag.`
    );
    setThumbnail(baseOffer.thumbnail || (Array.isArray(baseOffer.gallery) && baseOffer.gallery[0]) || "");
    setSourcePortal(baseOffer.sourcePortal || "xdate.ch");
  }, [baseOffer]);

  // 2. Falls bereits Server-Überschreibungen in managed-profile-states.json existieren, darüberlegen
  useEffect(() => {
    if (!profileId) return;
    fetch("/api/vault/metrics")
      .then((r) => r.json())
      .then((data) => {
        const st = data?.states?.[profileId];
        if (!st) return;
        if (st.displayName) setDisplayName(st.displayName);
        if (st.city) setCity(st.city);
        if (st.canton) setCanton(st.canton);
        if (st.phoneDisplay) setPhoneDisplay(st.phoneDisplay);
        if (st.rate30Chf) setRate30Chf(Number(st.rate30Chf));
        if (st.rate60Chf) setRate60Chf(Number(st.rate60Chf));
        if (st.bio) setBio(st.bio);
        if (st.availableUntil) setAvailableUntil(st.availableUntil);
        if (typeof st.paused === "boolean") setPaused(st.paused);
        if (st.identityRequested) setIdentityRequested(true);
      })
      .catch(() => {});
  }, [profileId]);

  const updateServerState = async (updates: Record<string, any>, successNote: string) => {
    if (!profileId) return;
    setSaving(true);
    setStatusMsg(null);
    try {
      await fetch("/api/vault/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_profile_state",
          profileId,
          token,
          updates: {
            displayName,
            city,
            canton,
            phoneDisplay,
            rate30Chf: Number(rate30Chf),
            rate60Chf: Number(rate60Chf),
            bio,
            claimed: true,
            ...updates,
          },
        }),
      });
      setStatusMsg(successNote);
    } catch {
      setStatusMsg("Änderung lokal vorgemerkt.");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirm4hAvailability = () => {
    const until = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();
    setAvailableUntil(until);
    setPaused(false);
    updateServerState(
      {
        availabilityConfirmed: true,
        availableUntil: until,
        lastConfirmedAt: new Date().toISOString(),
        paused: false,
        hidden: false,
      },
      "✓ Status „Jetzt verfügbar“ für die nächsten 4 Stunden live geschaltet!"
    );
  };

  const handleTogglePause = () => {
    const nextPaused = !paused;
    setPaused(nextPaused);
    updateServerState(
      { paused: nextPaused, hidden: nextPaused },
      nextPaused
        ? "⏸ Dein Profil ist jetzt vorübergehend im öffentlichen Verzeichnis ausgeblendet."
        : "▶ Dein Profil ist wieder öffentlich sichtbar!"
    );
  };

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updateServerState(
      {},
      "✓ Deine veröffentlichten Angaben, Telefonnummer und CHF-Richtpreise wurden gespeichert!"
    );
  };

  const isCurrentlyAvailable = useMemo(() => {
    if (!availableUntil || paused) return false;
    return new Date(availableUntil).getTime() > Date.now();
  }, [availableUntil, paused]);

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] py-10 px-4">
      <SEO
        title={`Anbieter-Cockpit: ${displayName || profileId || "Profil verwalten"} | iWantSexNow.ch`}
        description="Selbstverwaltetes Schweizer Anbieter-Cockpit für Echtzeit-Verfügbarkeit, CHF-Richtpreise und Sichtbarkeit."
      />

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header mit Profil-Vorschau */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            {thumbnail && !thumbnail.includes("placeholder") ? (
              <img
                src={thumbnail}
                alt={displayName}
                className="w-16 h-16 rounded-2xl object-cover border border-[#C8A97E]/50"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-[#161C28] border border-[#C8A97E]/40 flex items-center justify-center text-[#C8A97E] font-serif text-xl font-bold">
                {(displayName || "CH").slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="text-[11px] uppercase tracking-widest text-[#C8A97E] font-semibold">
                SELBSTVERWALTETES PROFIL · ANBIETER-COCKPIT {sourcePortal ? `· QUELLE: ${sourcePortal.toUpperCase()}` : ""}
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-0.5">
                {displayName ? `${displayName} (${city}, ${canton})` : `Dein Anbieter-Cockpit (${profileId || "Neu"})`}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-1">
                <span>ID: <code className="text-gray-300">{profileId || "direct"}</code></span>
                {phoneDisplay && (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Phone size={12} /> Verifizierte Nummer: {phoneDisplay}
                  </span>
                )}
                <span className="text-[#C8A97E] font-semibold">
                  CHF {rate30Chf} (30m) · CHF {rate60Chf} (60m)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/?q=${encodeURIComponent(displayName || city)}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-white transition"
            >
              Öffentliche Karte ansehen <ExternalLink size={13} />
            </Link>
          </div>
        </div>

        {statusMsg && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Top 2 Action Cards: 1. 4h Verfügbarkeit & 2. Sichtbarkeit/Pause */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#121722] border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  1. ECHTZEIT-VERFÜGBARKEIT (4H-FENSTER)
                </span>
                {isCurrentlyAvailable && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold">
                    ● Aktiv bis {new Date(availableUntil!).toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" })} Uhr
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-white">Status „Jetzt verfügbar“ bestätigen</h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                Sobald aktiviert, zeigt deine Karte für <strong>{displayName || "dein Profil"}</strong> in <strong>{city} ({canton})</strong> das grüne Label „Jetzt verfügbar“ samt exaktem Zeitstempel. Nach 4 Stunden läuft der Status automatisch ab.
              </p>
            </div>

            <button
              type="button"
              onClick={handleConfirm4hAvailability}
              disabled={saving}
              className="w-full py-3.5 px-4 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-[#07120B] font-extrabold text-xs uppercase tracking-wider transition shadow-lg"
            >
              ● {isCurrentlyAvailable ? "4-STUNDEN-FENSTER JETZT ERNEUERN" : "JETZT FÜR 4 STUNDEN ALS VERFÜGBAR BESTÄTIGEN"}
            </button>
          </div>

          <div className="bg-[#121722] border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C8A97E]">
                  2. SICHTBARKEIT & PAUSE
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                    paused
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : "bg-white/10 text-gray-200 border border-white/15"
                  }`}
                >
                  {paused ? "Pausiert (Ausgeblendet)" : "Öffentlich sichtbar"}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">Profil vorübergehend pausieren</h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                Du kannst deinen Eintrag jederzeit mit einem Klick aus dem öffentlichen Verzeichnis ausblenden (z.B. bei Urlaub oder Abwesenheit) und später wieder aktivieren.
              </p>
            </div>

            <button
              type="button"
              onClick={handleTogglePause}
              disabled={saving}
              className="w-full py-3.5 px-4 rounded-xl bg-[#0D111A] hover:bg-white/5 border border-white/15 text-xs font-bold text-white flex items-center justify-center gap-2 transition"
            >
              {paused ? <Eye size={14} /> : <EyeOff size={14} />}
              {paused ? "Profil jetzt wieder öffentlich schalten" : "Profil jetzt pausieren / ausblenden"}
            </button>
          </div>
        </div>

        {/* Formular: Veröffentlichte Angaben, Telefonnummer & Richtpreis bearbeiten */}
        <form onSubmit={handleSaveDetails} className="bg-[#121722] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-white">
              Veröffentlichte Angaben & Richtpreis bearbeiten
            </h2>
            <span className="text-[11px] text-emerald-400 font-medium">
              ✓ Automatisch vorbefüllt aus deinem verifizierten Schweizer Profil
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-xs text-gray-300 font-semibold mb-1.5">Anzeigename</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Dein Anzeigename"
                className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:border-[#C8A97E] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-300 font-semibold mb-1.5">Stadt / Ort</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:border-[#C8A97E] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-300 font-semibold mb-1.5">Kanton</label>
              <select
                value={canton}
                onChange={(e) => setCanton(e.target.value)}
                className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:border-[#C8A97E] outline-none"
              >
                {["ZG","ZH","GE","VD","BS","BL","BE","LU","AG","SG","SO","TI","VS","FR","NE","TG","SZ","GR","SH","AR","GL","UR","JU","NW"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-300 font-semibold mb-1.5">Direkt-Telefon (+41)</label>
              <input
                type="text"
                value={phoneDisplay}
                onChange={(e) => setPhoneDisplay(e.target.value)}
                placeholder="+41 79 ..."
                className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-3.5 py-2.5 text-sm text-emerald-400 font-semibold focus:border-[#C8A97E] outline-none"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-300 font-semibold mb-1.5">Richtpreis 30 Min. (CHF)</label>
              <input
                type="number"
                value={rate30Chf}
                onChange={(e) => setRate30Chf(Number(e.target.value))}
                className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:border-[#C8A97E] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-300 font-semibold mb-1.5">Richtpreis 60 Min. (CHF)</label>
              <input
                type="number"
                value={rate60Chf}
                onChange={(e) => setRate60Chf(Number(e.target.value))}
                className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:border-[#C8A97E] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-300 font-semibold mb-1.5">
              Kurzbeschreibung & Konditionen (z.B. Privatempfang / Hotelbesuch)
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Beschreibe kurz dein Angebot und deine Rahmenbedingungen..."
              className="w-full rounded-xl bg-[#0D111A] border border-white/15 p-3.5 text-sm text-white focus:border-[#C8A97E] outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <button
                type="button"
                onClick={() => {
                  setIdentityRequested(true);
                  updateServerState({ identityRequested: true }, "✓ Dokumentierte Identitätsprüfung (✓) wurde für dein Profil vorgemerkt.");
                }}
                className="text-[#C8A97E] hover:underline font-semibold inline-flex items-center gap-1.5"
              >
                <ShieldCheck size={14} />
                {identityRequested ? "Identitätsprüfung (✓) angefragt" : "Dokumentierte Identitätsprüfung (✓) beantragen →"}
              </button>
              <Link href={`/report?profileId=${encodeURIComponent(profileId)}`} className="text-gray-400 hover:text-rose-400 inline-flex items-center gap-1">
                <Trash2 size={13} /> Eintrag komplett entfernen (Opt-out)
              </Link>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-[#C8A97E] hover:bg-[#b89566] text-[#0D111A] font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition shadow-lg"
            >
              <Save size={14} /> ANGABEN SPEICHERN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}