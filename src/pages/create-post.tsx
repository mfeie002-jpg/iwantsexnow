import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { ArrowRight } from "lucide-react";

export default function CreatePostPage() {
  const router = useRouter();
  const claimQuery = String(router.query.claim || "").trim();

  const [displayName, setDisplayName] = useState("");
  const [city, setCity] = useState("Zürich");
  const [canton, setCanton] = useState("ZH");
  const [phone, setPhone] = useState("+41 79 ");
  const [rate30Chf, setRate30Chf] = useState(200);
  const [rate60Chf, setRate60Chf] = useState(350);
  const [thumbnail, setThumbnail] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (claimQuery) setDisplayName(claimQuery);
  }, [claimQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/vault/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: claimQuery ? "login_or_claim" : "register_new_profile",
          query: claimQuery || displayName,
          displayName: displayName.trim(),
          city: city.trim(),
          canton,
          phoneDisplay: phone.trim(),
          rate30Chf: Number(rate30Chf) || 200,
          rate60Chf: Number(rate60Chf) || 350,
          thumbnail: thumbnail.trim(),
          bio: bio.trim(),
        }),
      });
      const data = await res.json();
      if (data?.ok && data.profileId && data.ownerToken) {
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "iwsn_creator_session",
            JSON.stringify({ profileId: data.profileId, token: data.ownerToken, name: displayName })
          );
        }
        router.push(data.cockpitUrl);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO title="Neues Profil erstellen oder Eintrag übernehmen | iWantSexNow.ch" description="Kostenloses Schweizer Direktprofil erstellen oder bestehenden Index-Eintrag übernehmen." />
      <LuxuryHeader />
      <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        <div className="p-6 sm:p-8 rounded-2xl bg-[#121722] border border-[#C8A97E]/40 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-bold">● 100 % KOSTENLOSES BASIS-PROFIL · 30 TAGE PRO-PILOT INKLUSIVE</span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                {claimQuery ? `Profil „${claimQuery}“ übernehmen` : "Neues Schweizer Direktprofil anlegen"}
              </h1>
            </div>
            <Link href="/login" className="text-xs font-bold text-[#C8A97E] hover:underline">Bereits registriert? Zum Login →</Link>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Anzeigename / Künstlername *</label>
                <input type="text" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="z.B. Isabella VIP" className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-4 py-3 text-sm text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Schweizer Direkt-Telefon / WhatsApp (+41) *</label>
                <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+41 79 123 45 67" className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-4 py-3 text-sm text-emerald-400 font-bold" />
              </div>
            </div>
            <div className="grid sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Stadt / Ort *</label>
                <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-3.5 py-2.5 text-sm text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Kanton *</label>
                <select value={canton} onChange={(e) => setCanton(e.target.value)} className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-3.5 py-2.5 text-sm text-white">
                  {["ZG","ZH","GE","VD","BS","BL","BE","LU","AG","SG","SO","TI","VS","FR","NE","TG","SZ","GR","SH"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">30 Min. (CHF)</label>
                <input type="number" value={rate30Chf} onChange={(e) => setRate30Chf(Number(e.target.value))} className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-3.5 py-2.5 text-sm text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">60 Min. (CHF)</label>
                <input type="number" value={rate60Chf} onChange={(e) => setRate60Chf(Number(e.target.value))} className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-3.5 py-2.5 text-sm text-[#C8A97E] font-bold" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Haupt-Profilbild URL (Optional)</label>
              <input type="url" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} placeholder="https://..." className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-4 py-2.5 text-sm text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Kurzbeschreibung & Rahmenbedingungen</label>
              <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} className="w-full rounded-xl bg-[#0D111A] border border-white/15 p-3.5 text-sm text-white" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-[#C8A97E] hover:bg-[#b89566] text-[#0D111A] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg">
              <span>{loading ? "Richte dein Anbieter-Cockpit ein..." : "Profil aktivieren & direkt ins Anbieter-Cockpit →"}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}