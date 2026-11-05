import React, { useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { Lock, ShieldAlert } from "lucide-react";

export default function AdminDashboardPage() {
  const [pinInput, setPinInput] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [serverData, setServerData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const res = await fetch("/api/vault/metrics", {
        headers: { "x-admin-pin": pinInput.trim() },
      });
      const data = await res.json();
      if (data?.isAdmin) {
        setAuthorized(true);
        setServerData(data);
      } else {
        setErrorMsg("Zugriff verweigert: Ungültiger Server-Admin-Schlüssel.");
      }
    } catch {
      setErrorMsg("Serverfehler bei der Authentifizierung.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO title="Geschützte Administration | iWantSexNow.ch" noindex={true} />
      <LuxuryHeader />
      <main className="max-w-xl mx-auto px-6 py-16">
        {!authorized ? (
          <form onSubmit={handleUnlock} className="p-8 rounded-2xl bg-[#121722] border border-white/10 space-y-5">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Lock size={15} /> Server-Authentifizierung erforderlich
            </div>
            <h1 className="text-2xl font-serif font-bold text-white">Administrationsbereich gesperrt</h1>
            <p className="text-xs text-gray-400">
              Dieser Bereich gibt ohne serverseitig verifizierten Admin-Schlüssel (process.env.ADMIN_PIN) keinerlei Profildaten, Tokens oder Fallakten frei.
            </p>
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 font-semibold">
                {errorMsg}
              </div>
            )}
            <input
              type="password"
              required
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Server-Admin-Schlüssel eingeben..."
              className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-4 py-3 text-sm text-white"
            />
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#C8A97E] text-[#0D111A] font-extrabold text-xs uppercase tracking-wider cursor-pointer"
            >
              Authentifizieren →
            </button>
          </form>
        ) : (
          <div className="p-8 rounded-2xl bg-[#121722] border border-emerald-500/40 space-y-4">
            <h1 className="text-xl font-serif font-bold text-white">Admin-Sitzung aktiv</h1>
            <p className="text-xs text-gray-300">
              Gesperrte Opt-Out-Profile: {(serverData?.blockedIds || []).length} · Offene Meldungen: {(serverData?.takedowns || []).length}
            </p>
            <Link href="/" className="inline-block text-xs font-bold text-[#C8A97E] hover:underline">
              Zurück zur Startseite →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}