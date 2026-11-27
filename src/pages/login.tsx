import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
import { ArrowRight, Sparkles, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"provider" | "admin">("provider");
  const [query, setQuery] = useState("");
  const [adminPin, setAdminPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleProviderLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/vault/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login_or_claim", query: query.trim() }),
      });
      const data = await res.json();
      if (data?.ok && data.profileId && data.ownerToken) {
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "iwsn_creator_session",
            JSON.stringify({ profileId: data.profileId, token: data.ownerToken, name: data.state?.displayName || query })
          );
        }
        router.push(data.cockpitUrl);
      } else {
        setErrorMsg(data?.error || "Ein verifizierter Anbieter-Zugang ist erforderlich.");
      }
    } catch {
      setErrorMsg("Verbindungsfehler zum Server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-papier text-tinte pb-24">
      <SEO title="Anbieter- & Admin-Login | iWantSexNow.ch" description="Direkter Zugang zu deinem Schweizer Anbieter-Cockpit oder zur Plattform-Administration." />
      <LuxuryHeader />
      <PageIntro tone="himmel" note="Schön, dass du wieder da bist" art="hanger" title={<>In dein Anbieter-Cockpit einloggen</>}
        lead={<>Gib deine Schweizer Mobilnummer (+41 79 / 078 / 076...), deinen Anzeigenamen oder deine Profil-ID (z.B. ch-a720e283e85f) ein.</>} />
      <main className="max-w-md mx-auto px-6 py-12 space-y-6">
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-white border border-tinte/20">
          <button type="button" onClick={() => { setMode("provider"); setErrorMsg(null); }} className={`py-2.5 rounded-xl text-[13px] font-extrabold transition cursor-pointer ${mode === "provider" ? "bg-kirsche text-white" : "text-tinte-soft hover:text-tinte"}`}>
            Anbieterinnen-Cockpit
          </button>
          <button type="button" onClick={() => { setMode("admin"); setErrorMsg(null); }} className={`py-2.5 rounded-xl text-[13px] font-extrabold transition cursor-pointer ${mode === "admin" ? "bg-kirsche text-white" : "text-tinte-soft hover:text-tinte"}`}>
            Betreiber / Admin
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-glow-100/60 border border-glow-500/40 text-glow-800 text-[13px] font-semibold">{errorMsg}</div>
        )}

        {mode === "provider" ? (
          <form onSubmit={handleProviderLogin} className="p-6 sm:p-8 rounded-2xl bg-white border border-tinte/20 space-y-5">
            
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Deine +41 Telefonnummer, Name oder Profil-ID</label>
              <input type="text" required value={query} onChange={(e) => setQuery(e.target.value)} placeholder="z.B. +41 78 807 34 79 oder ch-a720e283e85f" className="w-full rounded-xl bg-papier border border-tinte/25 px-4 py-3 text-sm text-tinte focus:border-kirsche outline-none" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-kirsche hover:bg-kirsche-tief text-white font-extrabold text-[13px] flex items-center justify-center gap-2 cursor-pointer shadow-lg">
              <span>{loading ? "Öffne Cockpit..." : "Verifizierten Zugang prüfen"}</span>
              <ArrowRight size={15} />
            </button>
            <div className="pt-4 border-t border-tinte/20 text-center space-y-2">
              <div className="text-[13px] text-gray-600">Noch gar nicht im Schweizer Verzeichnis gelistet?</div>
              <Link href="/create-post" className="inline-flex items-center gap-1.5 text-[13px] font-bold text-kirsche hover:underline">
                <Sparkles size={13} /> Jetzt kostenlos neues Direktprofil erstellen →
              </Link>
            </div>
          </form>
        ) : (
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-kirsche/40 space-y-5">
            <div>
              <span className="text-[13px] text-mint-700 font-bold flex items-center gap-1.5"><Lock size={12} /> Geschützte Plattform-Steuerung</span>
              <h2 className="text-2xl font-serif font-bold text-tinte mt-1">Administration</h2>
            </div>
            <p className="text-sm text-gray-700">Die Zugriffsprüfung erfolgt ausschliesslich auf dem Server, nicht über einen im Browser hinterlegten PIN.</p>
            <Link href="/admin-dashboard" className="w-full py-3.5 rounded-xl bg-mint-500 hover:bg-mint-400 text-tinte font-extrabold text-[13px] flex items-center justify-center gap-2 no-underline">
              Geschützten Admin-Zugang öffnen →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}