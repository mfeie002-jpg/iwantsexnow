import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { CorporateFooter } from "@/components/CorporateFooter";
import { StencilSerifX } from "@/components/BrandLogo";
import { Lock, ArrowRight, UserCheck, ShieldCheck } from "lucide-react";

export default function CorporateLoginPage() {
  const router = useRouter();
  const [profileId, setProfileId] = useState("");
  const [ownerToken, setOwnerToken] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const targetId = profileId.trim() || "ch-1";
    if (typeof window !== "undefined" && ownerToken.trim()) {
      localStorage.setItem("iwsn_owner_token_" + targetId, ownerToken.trim());
      localStorage.setItem("iwsn_last_profile_id", targetId);
    }
    router.push("/creator-dashboard?id=" + encodeURIComponent(targetId));
  };

  return (
    <div className="min-h-screen bg-[#13161C] text-white flex flex-col justify-between overflow-x-hidden">
      <SEO
        title="Anbieter-Login & Profilzugang | iwantsexnow.ch"
        description="Direkter Zugang zu Ihrem selbst verwalteten Anbieter-Cockpit auf iwantsexnow.ch."
      />
      <LuxuryHeader />

      <main className="max-w-md w-full mx-auto px-6 py-12 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#1C2029] border border-[#C6A574]/50 flex items-center justify-center mx-auto">
            <StencilSerifX color="#C6A574" className="w-6 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Anbieter-Login
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Öffne dein Anbieter-Cockpit, um deine 4-Stunden-Verfügbarkeit zu bestätigen oder deine Angaben zu bearbeiten.
          </p>
        </div>

        <form onSubmit={handleLogin} className="p-6 sm:p-7 rounded-2xl bg-[#1C2029] border border-white/15 shadow-2xl space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Profil-ID oder Anzeigename *
            </label>
            <input
              type="text"
              required
              value={profileId}
              onChange={(e) => setProfileId(e.target.value)}
              placeholder="z.B. ch-1 oder dein Profilname..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151C] border border-white/15 text-sm text-white focus:outline-none focus:border-[#C6A574]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Persönlicher Zugangs-Schlüssel (optional bei gespeicherter Sitzung)
            </label>
            <input
              type="password"
              value={ownerToken}
              onChange={(e) => setOwnerToken(e.target.value)}
              placeholder="iwsn_..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151C] border border-white/15 text-sm text-white focus:outline-none focus:border-[#C6A574]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#C6A574] hover:bg-[#d5b687] text-[#13161C] font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <span>Cockpit öffnen</span>
            <ArrowRight size={15} />
          </button>
        </form>

        <div className="p-4 rounded-2xl bg-[#1A1E27] border border-white/10 text-center space-y-2 text-xs">
          <div className="text-gray-300 font-semibold">Noch keinen Zugangsschlüssel?</div>
          <Link href="/create-post" className="text-[#C6A574] hover:underline font-bold block">
            Bestehendes Profil kostenlos übernehmen oder neu anlegen →
          </Link>
        </div>
      </main>

      <CorporateFooter />
    </div>
  );
}
