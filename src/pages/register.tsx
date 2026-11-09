import React, { useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
import { Sparkles, ShieldCheck, CheckCircle2, Phone, ArrowRight, Lock } from "lucide-react";

export default function RegisterProviderPage() {
  const [displayName, setDisplayName] = useState("");
  const [canton, setCanton] = useState("ZG");
  const [city, setCity] = useState("Zug");
  const [phone, setPhone] = useState("");
  const [rate30Chf, setRate30Chf] = useState("200");
  const [rate60Chf, setRate60Chf] = useState("350");
  const [age, setAge] = useState("24");
  const [heightCm, setHeightCm] = useState("168");
  const [cupSize, setCupSize] = useState("C");
  const [hairColor, setHairColor] = useState("Brünett");
  const [rubric, setRubric] = useState("female");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [createdResult, setCreatedResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const r = await fetch("/api/claims/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "self_register",
          displayName,
          canton,
          city,
          phone,
          rate30Chf: Number(rate30Chf),
          rate60Chf: Number(rate60Chf),
          age: Number(age),
          heightCm: Number(heightCm),
          cupSize,
          hairColor,
          rubric,
          bio,
        }),
      });
      const d = await r.json();
      if (d?.ok) {
        setCreatedResult(d);
      } else {
        setErrorMsg(d?.error || "Bitte überprüfe deine Angaben.");
      }
    } catch {
      setErrorMsg("Netzwerkfehler beim Anlegen des Profils.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-papier text-tinte pb-24">
      <SEO
        title="Kostenloses Schweizer Escort- & Studio-Profil erstellen (0% Buchungsprovision) | iwantsexnow.ch"
        description="Erstelle in 60 Sekunden dein unabhängiges Schweizer Profil mit +41 Direktkontakt, 4h-Echtzeit-Radar und 80% Paid-Vault-Ausschüttung."
        url="https://iwantsexnow.ch/register"
      />
      <LuxuryHeader />

      <PageIntro tone="blush" note="Gratis, in 60 Sekunden" art="hanger" title={<>Eigenes Schweizer Profil in 60 Sekunden live schalten</>}
        lead={<>100 % direkter Kundenkontakt über deine <strong>+41 Nummer</strong> · <strong>80 % Sofort-Anteil</strong> bei Paid-Vault-Freischaltungen · Jederzeit 1-Klick <strong>4h-Live-Verfügbarkeit</strong>.</>} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        

        {createdResult ? (
          <section className="p-8 rounded-2xl bg-white border border-mint-500/50 space-y-5 text-center">
            <div className="w-12 h-12 rounded-full bg-mint-500/20 text-mint-700 flex items-center justify-center mx-auto">
              <CheckCircle2 size={26} />
            </div>
            <div className="text-[13px] text-mint-700 font-bold">
              Profil LIVE & für 4 Stunden als Verfügbar Markiert
            </div>
            <h2 className="text-2xl font-serif font-bold text-tinte">
              Willkommen! Dein persönliches Schweizer Cockpit ist bereit.
            </h2>
            <p className="text-[13px] text-gray-700 max-w-lg mx-auto">
              Speichere dir deinen persönlichen Cockpit-Link als Lesezeichen. Darüber kannst du jederzeit deine Preise, Fotos, Paid-Vault-Inhalte und deine 4h-Verfügbarkeit ohne Passwort-Zwang steuern:
            </p>
            <div className="p-3.5 rounded-xl bg-papier border border-tinte/20 text-[13px] font-mono text-kirsche break-all">
              https://iwantsexnow.ch{createdResult.cockpitUrl}
            </div>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link
                href={createdResult.cockpitUrl}
                className="px-6 py-3 rounded-xl bg-mint-500 text-tinte font-extrabold text-[13px] "
              >
                🔐 Direkt in mein Anbieter-Cockpit →
              </Link>
              <Link
                href={createdResult.profileUrl}
                className="px-6 py-3 rounded-xl bg-kirsche text-white font-extrabold text-[13px] "
              >
                Öffentliches Profil ansehen ↗
              </Link>
            </div>
          </section>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-white border border-tinte/20 space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-glow-500/15 border border-glow-500/40 text-[13px] text-glow-800 font-bold">
                ⚠️ {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1">Anzeigename / Künstlername *</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="z.B. Elena VIP"
                  className="w-full rounded-xl bg-papier border border-tinte/25 px-3.5 py-2.5 text-[13px] text-tinte"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1">Kanton *</label>
                <select
                  value={canton}
                  onChange={(e) => setCanton(e.target.value)}
                  className="w-full rounded-xl bg-papier border border-tinte/25 px-3.5 py-2.5 text-[13px] text-tinte"
                >
                  {["ZG", "ZH", "LU", "AG", "BS", "BE", "SG", "SZ", "SO", "GE", "VD", "TI", "VS"].map((c) => (
                    <option key={c} value={c}>Kanton {c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1">Stadt / Ort *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="z.B. Zug, Baar, Zürich..."
                  className="w-full rounded-xl bg-papier border border-tinte/25 px-3.5 py-2.5 text-[13px] text-tinte"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1">Schweizer +41 Nummer (WhatsApp/Call) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+41 79 123 45 67"
                  className="w-full rounded-xl bg-papier border border-tinte/25 px-3.5 py-2.5 text-[13px] text-tinte"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1">Honorar 30 Min. (CHF)</label>
                <input
                  type="number"
                  min={80}
                  max={800}
                  value={rate30Chf}
                  onChange={(e) => setRate30Chf(e.target.value)}
                  className="w-full rounded-xl bg-papier border border-tinte/25 px-3.5 py-2.5 text-[13px] text-tinte"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1">Honorar 60 Min. (CHF 100–1200) *</label>
                <input
                  type="number"
                  required
                  min={100}
                  max={1200}
                  value={rate60Chf}
                  onChange={(e) => setRate60Chf(e.target.value)}
                  className="w-full rounded-xl bg-papier border border-tinte/25 px-3.5 py-2.5 text-[13px] text-tinte"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-[13px] font-bold text-gray-600 mb-1">Alter</label>
                <input type="number" min={18} max={55} value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-xl bg-papier border border-tinte/25 px-3 py-2 text-[13px] text-tinte" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-600 mb-1">Grösse (cm)</label>
                <input type="number" min={150} max={190} value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className="w-full rounded-xl bg-papier border border-tinte/25 px-3 py-2 text-[13px] text-tinte" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-600 mb-1">Körbchen</label>
                <select value={cupSize} onChange={(e) => setCupSize(e.target.value)} className="w-full rounded-xl bg-papier border border-tinte/25 px-3 py-2 text-[13px] text-tinte">
                  {["A", "B", "C", "D", "DD"].map((c) => <option key={c} value={c}>Cup {c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-600 mb-1">Haarfarbe</label>
                <select value={hairColor} onChange={(e) => setHairColor(e.target.value)} className="w-full rounded-xl bg-papier border border-tinte/25 px-3 py-2 text-[13px] text-tinte">
                  {["Brünett", "Blond", "Schwarz", "Dunkelblond", "Rot"].map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-600 mb-1">Rubrik</label>
                <select value={rubric} onChange={(e) => setRubric(e.target.value)} className="w-full rounded-xl bg-papier border border-tinte/25 px-3 py-2 text-[13px] text-tinte">
                  <option value="female">Escort & GFE</option>
                  <option value="massage">Tantra & Massage</option>
                  <option value="bdsm">Domina & BDSM</option>
                  <option value="trans">Trans & TS</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1">Über mich / Services & Empfang (Incall / Outcall)</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Beschreibe kurz deinen Service, Sprachen und ob du im privaten Apartment oder im Hotel (Outcall) empfängst..."
                className="w-full rounded-xl bg-papier border border-tinte/25 p-3.5 text-[13px] text-tinte"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-kirsche hover:bg-kirsche-tief text-white font-extrabold text-[13px] cursor-pointer shadow-lg"
            >
              {loading ? "Profil wird angelegt..." : "✓ Kostenloses Schweizer Profil & Cockpit sofort freischalten →"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}