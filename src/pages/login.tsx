import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import LuxuryHeader from "../components/LuxuryHeader";
import MobileBottomNav from "../components/MobileBottomNav";

export default function AtelierLoginPage() {
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim()) setSent(true);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0B0809] text-[#F4EFEA]">
      <Head>
        <title>Atelier Login & Profil-Übernahme — iWantSexNow.ch</title>
      </Head>
      <LuxuryHeader />

      <main className="max-w-[1360px] w-full mx-auto px-4 sm:px-10 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Links: Grosses Editorial-Kunstporträt im Bogen-Schnitt */}
          <div className="lg:col-span-6 relative h-[520px] overflow-hidden shape-arch">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80"
              alt="Schweizer Model Atelier"
              className="w-full h-full object-cover brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0809] via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="text-xs uppercase tracking-[0.3em] text-[#D9B38C]">Édition Privée · Für Anbieterinnen</div>
              <div className="font-editorial italic text-3xl text-white mt-1">
                Dein Dossier, deine Fotos, deine volle Freiheit.
              </div>
            </div>
          </div>

          {/* Rechts: Rahmenloses Gästebuch-Formular ohne eine einzige Computer-Box */}
          <div className="lg:col-span-6 space-y-8 lg:pl-8">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-[#D9B38C]">Passwortloser Zugang</p>
              <h1 className="font-editorial italic text-5xl sm:text-6xl font-normal text-[#F4EFEA]">
                Willkommen im Atelier.
              </h1>
              <p className="text-base text-[#A69B95] max-w-lg leading-relaxed">
                Gib deine Schweizer Mobilnummer (+41) ein, um dein bestehendes Dossier zu übernehmen oder deinen Verfügbarkeits-Status für heute Abend zu aktivieren.
              </p>
            </div>

            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-8 max-w-md">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.25em] text-[#D9B38C] mb-2">
                    Deine Schweizer WhatsApp- oder Mobilnummer
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+41 79 ..."
                    className="w-full input-human text-2xl font-editorial italic"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-6">
                  <button
                    type="submit"
                    className="px-9 py-4 rounded-full bg-[#F4EFEA] text-[#0B0809] text-xs font-semibold uppercase tracking-[0.22em] hover:bg-[#D9B38C] transition cursor-pointer border-0"
                  >
                    Zugangslink anfordern
                  </button>
                  <Link href="/advertise" className="text-xs uppercase tracking-[0.2em] text-[#A69B95] hover:text-white">
                    Neues Dossier anlegen →
                  </Link>
                </div>
              </form>
            ) : (
              <div className="space-y-4 max-w-md">
                <div className="font-editorial italic text-3xl text-[#D9B38C]">
                  Dein persönlicher Schlüssel ist unterwegs.
                </div>
                <p className="text-sm text-[#A69B95]">
                  Wir haben die Anfrage für <span className="text-white">{phone}</span> registriert. Du kannst direkt ins Creator-Atelier wechseln:
                </p>
                <Link
                  href="/creator-dashboard"
                  className="inline-block px-8 py-4 rounded-full bg-[#D9B38C] text-[#0B0809] text-xs font-semibold uppercase tracking-[0.2em]"
                >
                  Direkt zum Atelier-Cockpit →
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}