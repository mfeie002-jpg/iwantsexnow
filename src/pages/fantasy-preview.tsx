import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { SwissDoorplate } from "@/components/SwissDoorplate";
import { HARVESTED_SWISS_OFFERS } from "@/data/harvestedOffers";
import {
  Sparkles,
  Volume2,
  Lock,
  ShieldCheck,
  Video,
  MessageCircle,
  CheckCircle2,
  Crown,
} from "lucide-react";

const SCENES = [
  { id: "dinner", label: "1. Candlelight Dinner & Champagne (Zürich/Zug)" },
  { id: "hotel", label: "2. 5-Sterne-Penthouse Suite bei Nacht" },
  { id: "massage", label: "3. Sinnliches Tantra- & Warmöl-Ritual" },
  { id: "gfe", label: "4. Girlfriend Experience (GFE) im Chalet" },
  { id: "domina", label: "5. Dominante Studio-Audienz (Leder & Türschild)" },
  { id: "business", label: "6. Verführung nach dem Business-Meeting" },
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
  const topProfiles = (Array.isArray(HARVESTED_SWISS_OFFERS) ? HARVESTED_SWISS_OFFERS : []).slice(0, 14);
  const [selectedProfile, setSelectedProfile] = useState<any>(
    topProfiles[0] || {
      id: "ch-paradeplatz-vip",
      rawName: "Victoria · Zürich Paradeplatz",
      city: "Zürich",
      canton: "ZH",
      advertisedBaseChf: 450,
      rate30Chf: 250,
    }
  );
  const [archetype, setArchetype] = useState<string>("seductress");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "avatar" | "user"; text: string }>>([
    {
      sender: "avatar",
      text: "Du stehst vor meiner Suitentür (FREI). Klick einfach unten auf einen der goldenen Chips – tippen musst du bei mir keinen Buchstaben.",
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

    const res = await fetch("/api/avatar-chat/" + encodeURIComponent(selectedProfile.id || "default"), {
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
    const res = await fetch("/api/avatar-chat/" + encodeURIComponent(selectedProfile.id || "default"), {
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
    <div className="min-h-screen bg-[#070606] text-[#F5EFE6] pb-28">
      <SEO
        title="Provider-Avatar (ElevenLabs Voice) & Venice Wan 2.7 Fantasy Preview | iwantsexnow.ch"
        description="Interaktive Schweizer Provider-Avatare mit ElevenLabs Voice, 1-Klick-Chips und 5s Video-Vorgeschmack (80/20 Creator-Split & 1-Klick Opt-Out)."
      />
      <LuxuryHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-7 space-y-7">
        {/* Penthouse Hero Header */}
        <div className="penthouse-panel p-6 sm:p-7 rounded-[24px] border border-[#C8A97E]/45 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <SwissDoorplate state="FREI" roomNumber="VIP SUITE" customLabel="VOICE & WAN 2.7 PREVIEW" size="sm" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#DEC393] font-bold">
                80 % ERLÖSANTEIL DIREKT AN DIE ANBIETERIN
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif text-[#EAD2AA] tracking-wide">
              Provider-Avatar & Fantasy Preview („Try Before You Buy“)
            </h1>
            <p className="text-xs sm:text-sm text-[#C8B9A6] max-w-2xl leading-relaxed">
              Null-Tippen-Konversation per 1-Klick-Chips (inkl. mehrsprachiger ElevenLabs-Sprachausgabe) oder 5-Sekunden-Vorschauvideo Ihrer Wunsch-Szene via Venice.ai Wan 2.7.
            </p>
          </div>

          <div className="text-right text-xs font-mono text-[#B6A48E] space-y-1">
            <div className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck size={14} />
              <span>KI-INTERPRETATION KLAR GEKENNZEICHNET</span>
            </div>
            <div>1-Klick Opt-Out nach Schweizer DSG jederzeit aktiv</div>
          </div>
        </div>

        {/* Suite / Companion Selector */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#DEC393]">
            1. Schweizer Suite / Anbieterin wählen:
          </label>
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2">
            {topProfiles.map((p: any, i: number) => {
              const active = p.id === selectedProfile?.id;
              const pillCls = active
                ? "brass-3d px-4 py-2.5 rounded-2xl border border-[#F5E3B8]/70 text-left shrink-0 cursor-pointer"
                : "px-4 py-2.5 rounded-2xl bg-[#110D0B] text-[#EAD2AA] border border-[#C8A97E]/25 hover:border-[#EAD2AA]/60 text-left shrink-0 cursor-pointer transition";
              const subCls = active ? "text-[10px] font-mono text-[#2B1D0A]" : "text-[10px] font-mono text-[#A89882]";
              return (
                <button
                  key={p.id || i}
                  type="button"
                  onClick={() => {
                    setSelectedProfile(p);
                    setLockedState(null);
                    setPreviewResult(null);
                  }}
                  className={pillCls}
                >
                  <div className="text-xs font-serif font-bold truncate max-w-[170px]">{p.rawName}</div>
                  <div className={subCls}>
                    {p.city} ({p.canton}) · CHF {p.advertisedBaseChf || 350}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Penthouse Split: Left Voice Avatar, Right Venice Wan 2.7 Video Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT PANEL: ElevenLabs Voice Avatar */}
          <section className="penthouse-panel p-6 rounded-[24px] border border-[#C8A97E]/35 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#C8A97E]/20 pb-3.5">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#DEC393] font-bold">
                    ELEVENLABS VOICE · SPRECHSTUNDE
                  </span>
                  <h2 className="text-xl font-serif text-[#EAD2AA] flex items-center gap-2 mt-0.5">
                    <MessageCircle size={18} className="text-[#DEC393]" />
                    <span>{selectedProfile.rawName}</span>
                  </h2>
                </div>
                <div className="flex flex-wrap gap-1">
                  {ARCHETYPES.map((a) => {
                    const isAct = archetype === a.id;
                    const archCls = isAct
                      ? "brass-3d px-2.5 py-1 rounded-full text-[10px] font-mono font-extrabold cursor-pointer"
                      : "px-2.5 py-1 rounded-full bg-black/60 border border-[#C8A97E]/25 text-[#C8B9A6] text-[10px] font-mono cursor-pointer";
                    return (
                      <button key={a.id} type="button" onClick={() => setArchetype(a.id)} className={archCls}>
                        {a.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {chatHistory.map((m, idx) => {
                  const bubbleCls =
                    m.sender === "avatar"
                      ? "p-4 rounded-2xl bg-black/65 border border-[#C8A97E]/35 text-xs leading-relaxed text-[#F5EFE6]"
                      : "p-4 rounded-2xl bg-[#0D291E]/80 border border-[#C8A97E]/45 text-xs leading-relaxed text-[#EAD2AA] ml-8";
                  return (
                    <div key={idx} className={bubbleCls}>
                      <div className="text-[9px] font-mono uppercase tracking-widest text-[#DEC393] font-bold mb-1">
                        {m.sender === "avatar"
                          ? selectedProfile.rawName + " · KI-INTERPRETATION"
                          : "DEINE 1-KLICK AUSWAHL"}
                      </div>
                      {m.text}
                    </div>
                  );
                })}
              </div>

              {audioUrl && (
                <div className="p-3.5 rounded-2xl bg-black/70 border border-emerald-500/40 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 font-mono text-emerald-300 font-bold">
                    <Volume2 size={15} />
                    <span>ELEVENLABS SPRACHNACHRICHT:</span>
                  </span>
                  <audio controls src={audioUrl} className="h-8" />
                </div>
              )}

              {lockedState && !unlockedChat && (
                <div className="p-4 rounded-2xl bg-black/85 border border-[#DEC393] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#DEC393]">
                    <Lock size={14} />
                    <span>GRATIS-KONTINGENT ERREICHT · 80% AN {selectedProfile.rawName}</span>
                  </div>
                  <p className="text-xs text-[#D5C7B2]">{lockedState.text}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setUnlockedChat(true);
                        setLockedState(null);
                      }}
                      className="brass-3d py-2.5 px-3 rounded-full font-mono font-extrabold text-xs uppercase cursor-pointer"
                    >
                      10 NACHRICHTEN · CHF 2.50
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUnlockedChat(true);
                        setLockedState(null);
                      }}
                      className="emerald-3d py-2.5 px-3 rounded-full border border-[#C8A97E]/50 font-mono font-bold text-xs uppercase cursor-pointer"
                    >
                      FLATRATE · CHF 9.90 / MONAT
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-3 border-t border-[#C8A97E]/20">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#A89882]">
                1-Tap Antwort-Chips (Kein Tippen erforderlich):
              </div>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((qr, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => sendQuickChip(qr)}
                    className="px-3.5 py-2 rounded-full bg-black/65 hover:bg-[#DEC393] text-[#EAD2AA] hover:text-[#191105] text-xs border border-[#C8A97E]/35 transition cursor-pointer font-medium"
                  >
                    {qr}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* RIGHT PANEL: Venice.ai Wan 2.7 Video Preview */}
          <section className="penthouse-panel p-6 rounded-[24px] border border-[#C8A97E]/35 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="border-b border-[#C8A97E]/20 pb-3.5">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#DEC393] font-bold">
                  VENICE.AI WAN 2.7 · 5-SEKUNDEN VIDEO-SZENE
                </span>
                <h2 className="text-xl font-serif text-[#EAD2AA] flex items-center gap-2 mt-0.5">
                  <Video size={18} className="text-[#DEC393]" />
                  <span>Fantasy Preview mit {selectedProfile.rawName}</span>
                </h2>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#C8B9A6]">
                  Szene für euer Preview-Rendering auswählen:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SCENES.map((sc) => {
                    const isAct = selectedScene === sc.id;
                    const scCls = isAct
                      ? "p-3 rounded-2xl border border-[#DEC393] bg-[#DEC393]/15 text-left text-xs text-[#EAD2AA] font-bold cursor-pointer"
                      : "p-3 rounded-2xl border border-white/10 bg-black/55 hover:border-[#C8A97E]/45 text-left text-xs text-[#C8B9A6] cursor-pointer transition";
                    return (
                      <button key={sc.id} type="button" onClick={() => setSelectedScene(sc.id)} className={scCls}>
                        {sc.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-[#C8A97E]/25 text-xs font-mono text-[#C8B9A6] space-y-1.5">
                <div>
                  • GRATIS-TEASER: <strong className="text-[#EAD2AA]">{Math.max(0, 2 - freePreviewsUsed)} VON 2 FREI</strong>
                </div>
                <div>
                  • DANACH: <strong className="text-[#DEC393]">CHF 5.00 PRO CLIP</strong> (CHF 4.00 / 80% AN ANBIETERIN)
                </div>
                <div>
                  • TRANSPARENZ: <strong className="text-emerald-400">KI-INTERPRETATION (KEIN ECHTFOTO)</strong>
                </div>
              </div>

              {previewResult && (
                <div className="p-4 rounded-2xl bg-black/80 border border-[#DEC393]/60 space-y-2.5 text-xs">
                  {previewResult.paywallRequired ? (
                    <>
                      <div className="font-mono font-bold text-[#DEC393]">{previewResult.message}</div>
                      <div className="grid grid-cols-1 gap-2 pt-1">
                        {previewResult.pricingOptions?.map((opt: any) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => triggerPreviewRender(true)}
                            className="brass-3d py-2.5 px-4 rounded-full font-mono font-extrabold text-xs uppercase cursor-pointer"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-emerald-400 font-mono font-bold">
                        <span className="inline-flex items-center gap-1.5">
                          <CheckCircle2 size={14} />
                          <span>SZENE BEREIT: {previewResult.sceneTitle}</span>
                        </span>
                        <span className="text-[10px] text-[#DEC393]">{previewResult.aiDisclosureLabel}</span>
                      </div>
                      <p className="text-[#A89882] text-[11px] font-mono">{previewResult.synthesizedPrompt}</p>
                      <div className="pt-2 flex flex-wrap gap-2">
                        <Link
                          href={"/profile/" + encodeURIComponent(selectedProfile.id)}
                          className="brass-3d px-5 py-2.5 rounded-full font-mono font-extrabold text-xs uppercase"
                        >
                          ECHTE SUITE VON {selectedProfile.rawName} ÖFFNEN →
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
              className="brass-3d w-full py-3.5 rounded-full border border-[#F5E3B8]/65 font-mono font-extrabold text-xs uppercase tracking-[0.18em] cursor-pointer transition"
            >
              🔮 5-SEKUNDEN FANTASY PREVIEW STARTEN ({Math.max(0, 2 - freePreviewsUsed)} GRATIS)
            </button>
          </section>
        </div>

        {/* Mandatory Swiss License, Opt-In & 1-Click Opt-Out Bar */}
        <section className="penthouse-panel p-5 rounded-[22px] border border-[#C8A97E]/30 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <div className="font-mono font-bold uppercase tracking-wider text-[#EAD2AA] flex items-center gap-2">
              <Crown size={14} className="text-[#DEC393]" />
              <span>SCHWEIZER LIZENZ-, BILDRECHTE- & 1-KLICK-OPT-OUT-STEUERUNG (CH-DSG)</span>
            </div>
            <p className="text-[#B6A48E]">
              Bist du {selectedProfile.rawName}? Du erhältst 80 % aller Avatar- und Preview-Erlöse oder kannst die KI-Funktionen hier mit 1 Klick sofort deaktivieren.
            </p>
            {optOutNotice && <p className="text-[#DEC393] font-mono font-bold pt-1">{optOutNotice}</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleProviderOptOut(false)}
              className="emerald-3d px-4 py-2 rounded-full border border-emerald-500/45 font-mono font-bold text-[11px] uppercase cursor-pointer"
            >
              ✓ 80/20 LIZENZ AKTIVIEREN (OPT-IN)
            </button>
            <button
              type="button"
              onClick={() => handleProviderOptOut(true)}
              className="px-4 py-2 rounded-full bg-rose-950/60 border border-rose-500/50 text-rose-300 font-mono font-bold text-[11px] uppercase cursor-pointer hover:bg-rose-900/60"
            >
              ✕ SOFORTIGES 1-KLICK OPT-OUT
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}