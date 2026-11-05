import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { KeyRound, ArrowRight, Sparkles, Lock } from "lucide-react";

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
        setErrorMsg("Profil konnte nicht geladen werden. Bitte prüfe deine +41 Nummer oder Profil-ID.");
      }
    } catch {
      setErrorMsg("Verbindungsfehler zum Server.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin.trim() === "SWISS-BOSS-2026") {
      if (typeof window !== "undefined") {
        localStorage.setItem("iwsn_admin_pin", "SWISS-BOSS-2026");
      }
      router.push("/admin-dashboard");
    } else {
      setErrorMsg("Ungültiger Admin-PIN.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO title="Anbieter- & Admin-Login | iWantSexNow.ch" description="Direkter Zugang zu deinem Schweizer Anbieter-Cockpit oder zur Plattform-Administration." />
      <LuxuryHeader />
      <main className="max-w-md mx-auto px-6 py-12 space-y-6">
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[#121722] border border-white/10">
          <button type="button" onClick={() => { setMode("provider"); setErrorMsg(null); }} className={`py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${mode === "provider" ? "bg-[#C8A97E] text-[#0D111A]" : "text-gray-400 hover:text-white"}`}>
            Anbieterinnen-Cockpit
          </button>
          <button type="button" onClick={() => { setMode("admin"); setErrorMsg(null); }} className={`py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${mode === "admin" ? "bg-[#C8A97E] text-[#0D111A]" : "text-gray-400 hover:text-white"}`}>
            Betreiber / Admin
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs font-semibold">{errorMsg}</div>
        )}

        {mode === "provider" ? (
          <form onSubmit={handleProviderLogin} className="p-6 sm:p-8 rounded-2xl bg-[#121722] border border-white/10 space-y-5">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#C8A97E] font-bold">SOFORT-ZUGANG OHNE PASSWORT-HÜRDE</span>
              <h1 className="text-2xl font-serif font-bold text-white mt-1">In dein Anbieter-Cockpit einloggen</h1>
              <p className="text-xs text-gray-400 mt-1">Gib deine Schweizer Mobilnummer (+41 79 / 078 / 076...), deinen Anzeigenamen oder deine Profil-ID (z.B. ch-a720e283e85f) ein.</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Deine +41 Telefonnummer, Name oder Profil-ID</label>
              <input type="text" required value={query} onChange={(e) => setQuery(e.target.value)} placeholder="z.B. +41 78 807 34 79 oder ch-a720e283e85f" className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-4 py-3 text-sm text-white focus:border-[#C8A97E] outline-none" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-[#C8A97E] hover:bg-[#b89566] text-[#0D111A] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg">
              <span>{loading ? "Öffne Cockpit..." : "Mein Anbieter-Cockpit öffnen"}</span>
              <ArrowRight size={15} />
            </button>
            <div className="pt-4 border-t border-white/10 text-center space-y-2">
              <div className="text-xs text-gray-400">Noch gar nicht im Schweizer Verzeichnis gelistet?</div>
              <Link href="/create-post" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C8A97E] hover:underline">
                <Sparkles size={13} /> Jetzt kostenlos neues Direktprofil erstellen →
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleAdminLogin} className="p-6 sm:p-8 rounded-2xl bg-[#121722] border border-[#C8A97E]/40 space-y-5">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5"><Lock size={12} /> GESCHÜTZTE PLATTFORM-STEUERUNG</span>
              <h1 className="text-2xl font-serif font-bold text-white mt-1">Master-Steuerpult (Admin)</h1>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Admin-PIN</label>
              <input type="password" required value={adminPin} onChange={(e) => setAdminPin(e.target.value)} placeholder="SWISS-BOSS-2026" className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-4 py-3 text-sm text-white focus:border-[#C8A97E] outline-none" />
            </div>
            <button type="submit" className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#07120B] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer">
              <KeyRound size={15} /> Master-Steuerpult entsperren →
            </button>
          </form>
        )}
      </main>
    </div>
  );
}