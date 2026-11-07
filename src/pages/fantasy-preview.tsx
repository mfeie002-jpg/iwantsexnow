import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { HARVESTED_SWISS_OFFERS } from "@/data/harvestedOffers";
import { Sparkles, Volume2, Lock, ShieldCheck, Video, MessageCircle, CheckCircle2 } from "lucide-react";

const SCENES = [
  { id: "dinner", label: "1. Romantisches Dinner & Champagner" },
  { id: "hotel", label: "2. 5-Sterne-Hotelzimmer bei Nacht" },
  { id: "massage", label: "3. Sinnliche Tantra- & Warmöl-Session" },
  { id: "gfe", label: "4. Girlfriend Experience (GFE) im Chalet" },
  { id: "domina", label: "5. Dominante Studio-Audienz (Noir)" },
  { id: "business", label: "6. Verführung nach dem Business-Date" },
];

const ARCHETYPES = [
  { id: "seductress", label: "Verführerin" },
  { id: "girlfriend", label: "Girlfriend (GFE)" },
  { id: "listener", label: "Zuhörerin" },
  { id: "dominant", label: "Dominante" },
  { id: "mystery", label: "Mystery" },
];

export default function FantasyPreviewAndAvatarPage() {
  const router = useRouter();
  const topProfiles = (Array.isArray(HARVESTED_SWISS_OFFERS) ? HARVESTED_SWISS_OFFERS : []).slice(0, 12);
  const [selectedProfile, setSelectedProfile] = useState<any>(
    topProfiles[0] || { id: "ch-paradeplatz-vip", rawName: "Victoria · Zürich Paradeplatz", city: "Zürich", canton: "ZH", advertisedBaseChf: 450, rate30Chf: 250 }
  );
  const [archetype, setArchetype] = useState<string>("seductress");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "avatar" | "user"; text: string }>>([
    {
      sender: "avatar",
      text: "Du hast dir meine Fotos ziemlich genau angesehen… Klick einfach auf eine Antwort unten – tippen musst du bei mir nicht.",
    },
  ]);
  const [quickReplies, setQuickReplies] = useState<string[]>([
    "Bist du heute Abend frei?",
    "Was ist dein 30/60-Min.-Honorar?",
    "Kommst du auch ins Hotel?",
    "Zeig mir unser Fantasy-Preview 🔮",
  ]);
  const [lockedState, setLockedState] = useState<any>(null);
  const [unlockedChat, setUnlockedChat] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const [selectedScene, setSelectedScene] = useState<string>("hotel");
  const [freePreviewsUsed, setFreePreviewsUsed] = useState<number>(0);
  const [previewResult, setPreviewResult] = useState<any>(null);
  const [optOutNotice, setOptOutNotice] = useState<string>("");
  useEffect(() => {
    const qId = String(router.query.id || "").trim();
    if (qId && Array.isArray(HARVESTED_SWISS_OFFERS)) {
      const found = HARVESTED_SWISS_OFFERS.find((x: any) => (x.id || x.dedupClusterId) === qId);
      if (found) setSelectedProfile(found);
    }
  }, [router.query.id]);

  const sendQuickChip = async (chipText: string) => {
    const nextHistory = [...chatHistory, { sender: "user" as const, text: chipText }];
    setChatHistory(nextHistory);

    const res = await fetch(`/api/avatar-chat/${encodeURIComponent(selectedProfile.id || "default")}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "chat",
        message: chipText,
        messageIndex: nextHistory.filter((m) => m.sender === "user").length,
        unlocked: unlockedChat,
        archetype,
        providerName: selectedProfile.rawName,
        city: selectedProfile.city,
        wantVoice: true,
      }),
    });
    const data = await res.json();
    if (data?.locked) {
      setLockedState(data);
    } else if (data?.text) {
      setChatHistory([...nextHistory, { sender: "avatar", text: data.text }]);
      if (Array.isArray(data.quickReplies)) setQuickReplies(data.quickReplies);
      if (data.audioDataUrl) setAudioUrl(data.audioDataUrl);
    }
  };

  const triggerPreviewRender = async (paid = false) => {
    const res = await fetch("/api/fantasy-preview/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        providerId: selectedProfile.id,
        providerName: selectedProfile.rawName,
        sceneKey: selectedScene,
        freePreviewsUsed,
        hasPaidCredit: paid,
      }),
    });
    const data = await res.json();
    setPreviewResult(data);
    if (!data?.paywallRequired) {
      setFreePreviewsUsed((prev) => prev + 1);
    }
  };

  const handleProviderOptOut = async (optOut: boolean) => {
    const res = await fetch(`/api/avatar-chat/${encodeURIComponent(selectedProfile.id || "default")}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "toggle_opt_out",
        optOut,
        name: selectedProfile.rawName,
        archetype,
      }),
    });
    const data = await res.json();
    if (data?.message) setOptOutNotice(data.message);
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-white pb-24">
      <SEO
        title="Provider-Avatar (Voice) & Fantasy Preview | iwantsexnow.ch"
        description="Interaktive Schweizer Provider-Avatare mit ElevenLabs Voice, 1-Klick-Chips und KI-Vorgeschmack (80/20 Creator-Split & 1-Klick Opt-Out)."
      />
      <LuxuryHeader />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header Banner */}
        <div className="p-6 rounded-2xl bg-[#11131C] border border-[#C8A97E]/40 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8A97E]/15 border border-[#C8A97E]/40 text-[#C8A97E] text-[11px] font-bold uppercase tracking-wider">
              <Sparkles size={13} />
              <span>SCHWEIZER NEUHEIT · AVATAR VOICE & VORGESCHMACK (80% AN ANBIETERIN)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Provider-Avatar & Fantasy Preview („Try Before You Buy“)
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl">
              Kein Tippen nötig: Chatten Sie per 1-Klick-Chips mit dem lizenzierten KI-Avatar der Anbieterin (inkl. mehrsprachiger ElevenLabs-Stimme) oder generieren Sie ein 5-Sekunden-Vorschauvideo Ihrer Wunsch-Szene.
            </p>
          </div>
          <div className="text-right text-xs text-gray-400 space-y-1">
            <div className="inline-flex items-center gap-1.5 text-emerald-300 font-semibold">
              <ShieldCheck size={14} />
              <span>KI-Interpretation klar gekennzeichnet</span>
            </div>
            <div>80% aller Erlöse gehen direkt an die Anbieterin</div>
          </div>
        </div>

        {/* Profile Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#C8A97E]">
            1. Schweizer Anbieterin auswählen:
          </label>
          <div className="flex gap-2.5 overflow-x-auto pb-2">
            {topProfiles.map((p: any, i: number) => {
              const active = p.id === selectedProfile?.id;
              return (
                <button
                  key={p.id || i}
                  type="button"
                  onClick={() => {
                    setSelectedProfile(p);
                    setLockedState(null);
                    setPreviewResult(null);
                  }}
                  className={`px-3.5 py-2 rounded-xl border text-left shrink-0 transition cursor-pointer ${
                    active
                      ? "bg-[#C8A97E] text-[#090A0F] border-[#C8A97E] font-bold"
                      : "bg-[#11131C] text-gray-200 border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="text-xs truncate max-w-[160px]">{p.rawName}</div>
                  <div className={`text-[10px] ${active ? "text-[#090A0F]/80" : "text-gray-400"}`}>
                    {p.city} ({p.canton}) · CHF {p.advertisedBaseChf || 350}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Provider Avatar Chat + ElevenLabs Voice */}
          <section className="p-6 rounded-2xl bg-[#11131C] border border-white/10 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#C8A97E] font-bold">
                    TÜRSCHILD: FREI · KI-AVATAR SPRECHSTUNDE
                  </span>
                  <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                    <MessageCircle size={18} className="text-[#C8A97E]" />
                    <span>{selectedProfile.rawName}</span>
                  </h2>
                </div>
                <div className="flex gap-1">
                  {ARCHETYPES.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setArchetype(a.id)}
                      className={`px-2 py-1 rounded text-[10px] font-semibold cursor-pointer ${
                        archetype === a.id ? "bg-[#C8A97E] text-[#090A0F]" : "bg-white/5 text-gray-400"
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conversation History */}
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {chatHistory.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                      m.sender === "avatar"
                        ? "bg-black/50 border border-[#C8A97E]/30 text-gray-100"
                        : "bg-[#C8A97E]/20 border border-[#C8A97E]/40 text-white ml-8"
                    }`}
                  >
                    <div className="text-[10px] font-bold text-[#C8A97E] mb-1">
                      {m.sender === "avatar" ? `${selectedProfile.rawName} (KI-Interpretation)` : "Deine Auswahl"}
                    </div>
                    {m.text}
                  </div>
                ))}
              </div>

              {audioUrl && (
                <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 text-emerald-300 font-semibold">
                    <Volume2 size={15} />
                    <span>ElevenLabs Sprachnachricht bereit:</span>
                  </span>
                  <audio controls src={audioUrl} className="h-8" />
                </div>
              )}

              {/* Paywall Lock Box after 4 messages */}
              {lockedState && !unlockedChat && (
                <div className="p-4 rounded-xl bg-[#090A0F] border border-[#C8A97E] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#C8A97E]">
                    <Lock size={14} />
                    <span>Gratis-Vorschau beendet · 80% direkt an {selectedProfile.rawName}</span>
                  </div>
                  <p className="text-xs text-gray-300">{lockedState.text}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setUnlockedChat(true);
                        setLockedState(null);
                      }}
                      className="py-2.5 px-3 rounded-lg bg-[#C8A97E] text-[#090A0F] font-bold text-xs cursor-pointer"
                    >
                      10 Nachrichten · CHF 2.50
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUnlockedChat(true);
                        setLockedState(null);
                      }}
                      className="py-2.5 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/15 cursor-pointer"
                    >
                      Monats-Flatrate · CHF 9.90
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Zero-Typing Quick-Reply Chips */}
            <div className="space-y-2 pt-3 border-t border-white/10">
              <div className="text-[11px] text-gray-400">
                Nur klicken, nicht tippen (1-Tap Antworten):
              </div>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((qr, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => sendQuickChip(qr)}
                    className="px-3 py-2 rounded-lg bg-white/5 hover:bg-[#C8A97E] hover:text-[#090A0F] text-xs text-gray-200 border border-white/10 transition cursor-pointer font-medium"
                  >
                    {qr}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* RIGHT: Venice.ai Wan 2.7 Fantasy Preview ("Try Before You Buy") */}
          <section className="p-6 rounded-2xl bg-[#11131C] border border-white/10 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="border-b border-white/10 pb-3">
                <span className="text-[10px] uppercase tracking-wider text-[#C8A97E] font-bold">
                  VENICE.AI WAN 2.7 · VIDEO-VORGESCHMACK (5 SEKUNDEN)
                </span>
                <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                  <Video size={18} className="text-[#C8A97E]" />
                  <span>Fantasy Preview mit {selectedProfile.rawName}</span>
                </h2>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300">
                  Wunsch-Szene für euer Preview wählen:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SCENES.map((sc) => (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => setSelectedScene(sc.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                        selectedScene === sc.id
                          ? "bg-[#C8A97E]/20 border-[#C8A97E] text-white font-bold"
                          : "bg-black/40 border-white/10 text-gray-300 hover:border-white/25"
                      }`}
                    >
                      {sc.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs text-gray-300 space-y-1">
                <div>• Gratis-Kontingent zum Testen: <strong>{Math.max(0, 2 - freePreviewsUsed)} von 2 frei</strong></div>
                <div>• Danach: <strong>CHF 5.00 pro Clip</strong> (CHF 4.00 / 80% gehen direkt an {selectedProfile.rawName})</div>
                <div>• Kennzeichnung: <strong>KI-Interpretation</strong> (gemäss Schweizer Recht ausgewiesen)</div>
              </div>

              {previewResult && (
                <div className="p-4 rounded-xl bg-[#090A0F] border border-[#C8A97E]/60 space-y-2.5 text-xs">
                  {previewResult.paywallRequired ? (
                    <>
                      <div className="font-bold text-[#C8A97E]">{previewResult.message}</div>
                      <div className="grid grid-cols-1 gap-2 pt-1">
                        {previewResult.pricingOptions?.map((opt: any) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => triggerPreviewRender(true)}
                            className="py-2 px-3 rounded-lg bg-[#C8A97E] text-[#090A0F] font-bold text-xs cursor-pointer"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-emerald-300 font-bold">
                        <span className="inline-flex items-center gap-1.5">
                          <CheckCircle2 size={14} />
                          <span>Szene bereit: {previewResult.sceneTitle}</span>
                        </span>
                        <span className="text-[10px] text-[#C8A97E]">{previewResult.aiDisclosureLabel}</span>
                      </div>
                      <p className="text-gray-400 text-[11px]">{previewResult.synthesizedPrompt}</p>
                      <div className="pt-2 flex flex-wrap gap-2">
                        <Link
                          href={`/profile/${encodeURIComponent(selectedProfile.id)}`}
                          className="px-4 py-2 rounded-lg bg-[#C8A97E] text-[#090A0F] font-bold text-xs"
                        >
                          Jetzt echtes Date mit {selectedProfile.rawName} buchen →
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => triggerPreviewRender(false)}
              className="w-full py-3 rounded-xl bg-[#C8A97E] hover:bg-[#d8b98e] text-[#090A0F] font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg"
            >
              🔮 5-Sekunden Fantasy Preview generieren ({Math.max(0, 2 - freePreviewsUsed)} Gratis übrig)
            </button>
          </section>
        </div>

        {/* Update 9: Mandatory Swiss License, Opt-In & 1-Click Opt-Out Bar for Providers */}
        <section className="p-5 rounded-2xl bg-[#11131C] border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <div className="font-bold text-white">
              Lizenz-, Bildrechte- & 1-Klick-Opt-Out-Steuerung für Anbieterinnen (Schweizer DSG & KI-Transparenz)
            </div>
            <p className="text-gray-400">
              Bist du {selectedProfile.rawName}? Du erhältst 80% aller Avatar- und Preview-Erlöse oder kannst die KI-Funktionen hier mit 1 Klick sofort deaktivieren.
            </p>
            {optOutNotice && <p className="text-[#C8A97E] font-semibold pt-1">{optOutNotice}</p>}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleProviderOptOut(false)}
              className="px-3.5 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-semibold cursor-pointer"
            >
              ✓ 80/20 Avatar-Lizenz aktivieren (Opt-In)
            </button>
            <button
              type="button"
              onClick={() => handleProviderOptOut(true)}
              className="px-3.5 py-2 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 font-semibold cursor-pointer"
            >
              ✕ Sofortiges 1-Klick Opt-Out
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}