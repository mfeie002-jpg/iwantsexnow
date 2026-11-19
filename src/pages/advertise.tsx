import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import LuxuryHeader from "../components/LuxuryHeader";
import MobileBottomNav from "../components/MobileBottomNav";

export default function AdvertiseAtelierPage() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("Zürich");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Head>
        <title>Für Models & Ateliers — iWantSexNow.ch</title>
      </Head>
      <LuxuryHeader />

      <main className="max-w-[1400px] w-full mx-auto px-6 sm:px-14 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative h-[560px] overflow-hidden mask-tear shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80"
              alt="Model Atelier"
              className="w-full h-full object-cover brightness-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 space-y-2">
              <div className="text-xs uppercase tracking-[0.3em] text-[#E0B589]">100% Dein Honorar · 0% Provision</div>
              <h2 className="font-editorial italic text-4xl sm:text-5xl text-white font-normal">
                Präsentiere dich wie auf einem Vogue-Cover, nicht wie in einem Kleinanzeigen-Blatt.
              </h2>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-8 lg:pl-6">
            <div>
              <div className="text-xs uppercase tracking-[0.35em] text-[#E0B589]">Dossier eröffnen oder übernehmen</div>
              <h1 className="font-editorial italic text-5xl sm:text-6xl font-normal mt-2">
                Dein persönliches Atelier in 60 Sekunden.
              </h1>
            </div>

            {!submitted ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-7 max-w-lg"
              >
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.25em] text-[#E0B589] mb-1">
                    Dein Künstlername
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="z.B. Valentina..."
                    className="w-full human-line-input text-2xl font-editorial italic"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.25em] text-[#E0B589] mb-1">
                    Deine Stadt / Region
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full human-line-input text-2xl font-editorial italic"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.25em] text-[#E0B589] mb-1">
                    Deine Schweizer WhatsApp-Nummer für Direkt-Anfragen
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+41 79 ..."
                    className="w-full human-line-input text-2xl font-editorial italic"
                  />
                </div>

                <button
                  type="submit"
                  className="px-10 py-4 rounded-full bg-[#E0B589] text-black text-xs font-bold uppercase tracking-[0.22em] cursor-pointer border-0 shadow-xl"
                >
                  Dossier jetzt kostenfrei aktivieren
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="font-editorial italic text-4xl text-[#E0B589]">
                  Bienvenue, {name || "Belle"}!
                </div>
                <p className="text-sm opacity-80">
                  Dein Atelier für {city} ist vorbereitet. Du kannst deine Fotos und deinen Live-Status direkt verwalten:
                </p>
                <Link
                  href="/creator-dashboard"
                  className="inline-block px-8 py-4 rounded-full bg-[#E0B589] text-black text-xs font-bold uppercase tracking-[0.2em] no-underline"
                >
                  Ins Atelier-Cockpit eintreten →
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