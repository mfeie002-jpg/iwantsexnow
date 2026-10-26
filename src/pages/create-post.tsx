import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { CorporateFooter } from "@/components/CorporateFooter";
import { Check, ArrowRight, ShieldCheck, Flag } from "lucide-react";

const SWISS_CANTONS = ["ZH", "ZG", "BS", "BE", "LU", "AG", "SG", "TG", "SO", "SZ", "GR", "GE", "VD", "VS", "TI"];

export default function TakeOverOrCreateProfilePage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [profileId, setProfileId] = useState("");
  const [city, setCity] = useState("Zürich");
  const [canton, setCanton] = useState("ZH");
  const [rate60Chf, setRate60Chf] = useState("350");
  const [category, setCategory] = useState("Begleitung & Escort");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.claim) setDisplayName(String(router.query.claim));
    if (router.query.id) setProfileId(String(router.query.id));
    if (router.query.city) setCity(String(router.query.city));
    if (router.query.canton) setCanton(String(router.query.canton).toUpperCase());
  }, [router.isReady, router.query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    const cleanId =
      profileId.trim() ||
      "direct-" +
        displayName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-")
          .slice(0, 20) +
        "-" +
        canton.toLowerCase();

    try {
      const res = await fetch("/api/vault/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "claim_or_create_profile",
          profileId: cleanId,
          displayName: displayName.trim() || "Anbieterprofil",
          city: city.trim() || "Zürich",
          canton,
          rate60Chf: Number(rate60Chf) || 350,
          category,
        }),
      });
      const data = await res.json();
      if (data && data.ok && data.ownerToken) {
        if (typeof window !== "undefined") {
          localStorage.setItem("iwsn_owner_token_" + cleanId, data.ownerToken);
          localStorage.setItem("iwsn_last_profile_id", cleanId);
        }
        router.push(
          "/creator-dashboard?id=" +
            encodeURIComponent(cleanId) +
            "&token=" +
            encodeURIComponent(data.ownerToken)
        );
      } else {
        setErrorMsg(
          data?.error ||
            "Dieses Profil wird bereits von einem bestätigten Konto verwaltet. Bitte nutze deinen persönlichen Zugangslink."
        );
      }
    } catch {
      setErrorMsg("Verbindungsfehler beim Einrichten des Profils.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#13161C] text-white pb-24">
      <SEO
        title="Bestehendes Profil übernehmen oder neues Profil anlegen | iwantsexnow.ch"
        description="Übernehmen Sie kostenlos die Selbstverwaltung Ihres Eintrags oder erstellen Sie ein neues Schweizer Anbieterprofil."
      />
      <LuxuryHeader />

      <main className="max-w-3xl mx-auto px-6 sm:px-10 py-10 space-y-8">
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[#C6A574]">
            KOSTENLOSE SELBSTVERWALTUNG · OHNE ABO-PFLICHT
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">
            {router.query.claim
              ? "Profil „" + String(router.query.claim) + "“ kostenlos übernehmen"
              : "Bestehendes Profil übernehmen oder neu anlegen"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Nach der Bestätigung gelangst du direkt in dein geschütztes Anbieter-Cockpit. Dort kannst du deine Angaben pflegen, „Jetzt verfügbar“ für 4 Stunden aktivieren oder das Profil jederzeit pausieren.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-8 rounded-2xl bg-[#1C2029] border border-white/15 shadow-2xl space-y-5"
        >
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-200 font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Anzeigename / Künstlername *
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="z.B. Elena"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151C] border border-white/15 text-sm text-white focus:outline-none focus:border-[#C6A574]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Kategorie
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151C] border border-white/15 text-sm text-white focus:outline-none focus:border-[#C6A574]"
              >
                <option value="Begleitung & Escort">Begleitung & Escort</option>
                <option value="Erotische Massage & Tantra">Erotische Massage & Tantra</option>
                <option value="Domina & Fetisch">Domina & Fetisch</option>
                <option value="Trans / TS">Trans / TS</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Stadt / Ort *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="z.B. Zürich, Zug, Basel..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151C] border border-white/15 text-sm text-white focus:outline-none focus:border-[#C6A574]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Kanton *
              </label>
              <select
                value={canton}
                onChange={(e) => setCanton(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151C] border border-white/15 text-sm text-white focus:outline-none focus:border-[#C6A574]"
              >
                {SWISS_CANTONS.map((c) => (
                  <option key={c} value={c}>
                    Kanton {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Richtpreis für 60 Min. (CHF)
              </label>
              <input
                type="number"
                min={100}
                max={5000}
                value={rate60Chf}
                onChange={(e) => setRate60Chf(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151C] border border-white/15 text-sm text-white focus:outline-none focus:border-[#C6A574]"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#12151C] border border-white/10 text-xs text-gray-300 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-[#C6A574]" />
              <span>Was passiert nach diesem Schritt?</span>
            </div>
            <p className="leading-relaxed">
              Dein Profil wird als <strong>„Selbst verwaltet“</strong> eingerichtet und du erhältst deinen persönlichen Owner-Schlüssel für das Anbieter-Cockpit. Eine Kennzeichnung als „Identität geprüft (✓)“ erfolgt erst nach separater Dokumentenprüfung.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-[#C6A574] hover:bg-[#d5b687] text-[#13161C] font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <span>{submitting ? "Richte Profil-Cockpit ein..." : "Kostenlos übernehmen & Cockpit öffnen"}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="p-4 rounded-2xl bg-[#1A1E27] border border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
          <span>Du möchtest kein Profil verwalten, sondern einen Eintrag entfernen lassen?</span>
          <Link href="/report" className="text-[#C6A574] hover:underline font-semibold inline-flex items-center gap-1">
            <Flag size={12} />
            <span>Direkt zum Melde- & Löschformular (/report) →</span>
          </Link>
        </div>
      </main>
      <CorporateFooter />
    </div>
  );
}
