import React, { useEffect, useState } from "react";
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
  ArrowRight,
} from "lucide-react";

const SCENES = [
  { id: "dinner", label: "Romantisches Dinner & Champagner" },
  { id: "hotel", label: "5-Sterne-Hotelzimmer bei Nacht" },
  { id: "massage", label: "Sinnliche Tantra- & Warmöl-Session" },
  { id: "gfe", label: "Girlfriend Experience (GFE) im Chalet" },
  { id: "domina", label: "Dominante Studio-Audienz (Noir)" },
  { id: "business", label: "Verführung nach dem Business-Date" },
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
  const topProfiles = (
    Array.isArray(HARVESTED_SWISS_OFFERS)
      ? HARVESTED_SWISS_OFFERS
      : []
  ).slice(0, 12);

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
  const [archetype, setArchetype] =
    useState<string>("seductress");
  const [chatHistory, setChatHistory] = useState<
    Array<{ sender: "avatar" | "user"; text: string }>
  >([
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
  const [unlockedChat, setUnlockedChat] =
    useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const [selectedScene, setSelectedScene] =
    useState<string>("hotel");
  const [freePreviewsUsed, setFreePreviewsUsed] =
    useState<number>(0);
  const [previewResult, setPreviewResult] = useState<any>(null);
  const [optOutNotice, setOptOutNotice] = useState<string>("");
  const [chatBusy, setChatBusy] = useState<boolean>(false);
  const [previewBusy, setPreviewBusy] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string>("");

  useEffect(() => {
    const qId = String(router.query.id || "").trim();

    if (qId && Array.isArray(HARVESTED_SWISS_OFFERS)) {
      const found = HARVESTED_SWISS_OFFERS.find(
        (x: any) => (x.id || x.dedupClusterId) === qId
      );
      if (found) setSelectedProfile(found);
    }
  }, [router.query.id]);

  const sendQuickChip = async (chipText: string) => {
    if (chatBusy) return;

    const nextHistory = [
      ...chatHistory,
      { sender: "user" as const, text: chipText },
    ];
    setChatHistory(nextHistory);
    setChatBusy(true);
    setActionError("");

    try {
      const res = await fetch(
        "/api/avatar-chat/" +
          encodeURIComponent(selectedProfile.id || "default"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "chat",
            message: chipText,
            messageIndex: nextHistory.filter(
              (m) => m.sender === "user"
            ).length,
            unlocked: unlockedChat,
            archetype,
            providerName: selectedProfile.rawName,
            city: selectedProfile.city,
            wantVoice: true,
          }),
        }
      );

      const data = await res.json();

      if (data?.locked) {
        setLockedState(data);
      } else if (data?.text) {
        setChatHistory([
          ...nextHistory,
          { sender: "avatar", text: data.text },
        ]);
        if (Array.isArray(data.quickReplies)) {
          setQuickReplies(data.quickReplies);
        }
        if (data.audioDataUrl) {
          setAudioUrl(data.audioDataUrl);
        }
      }
    } catch {
      setActionError(
        "Die Sprechanlage knistert. Bitte erneut klopfen und den Chip noch einmal wählen."
      );
    } finally {
      setChatBusy(false);
    }
  };

  const triggerPreviewRender = async (paid = false) => {
    if (previewBusy) return;

    setPreviewBusy(true);
    setActionError("");

    try {
      const res = await fetch(
        "/api/fantasy-preview/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            providerId: selectedProfile.id,
            providerName: selectedProfile.rawName,
            sceneKey: selectedScene,
            freePreviewsUsed,
            hasPaidCredit: paid,
          }),
        }
      );

      const data = await res.json();
      setPreviewResult(data);

      if (!data?.paywallRequired) {
        setFreePreviewsUsed((prev) => prev + 1);
      }
    } catch {
      setActionError(
        "Die Projektion startet gerade nicht. Bitte Szene erneut an die Projektionsbühne schicken."
      );
    } finally {
      setPreviewBusy(false);
    }
  };

  const handleProviderOptOut = async (optOut: boolean) => {
    setActionError("");

    try {
      const res = await fetch(
        "/api/avatar-chat/" +
          encodeURIComponent(selectedProfile.id || "default"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "toggle_opt_out",
            optOut,
            name: selectedProfile.rawName,
            archetype,
          }),
        }
      );

      const data = await res.json();
      if (data?.message) setOptOutNotice(data.message);
    } catch {
      setActionError(
        "Die Lizenzsteuerung antwortet nicht. Nutze alternativ den globalen Opt-Out unter /report."
      );
    }
  };

  return (
    <div className="penthouse-page min-h-screen pb-24 text-[#dcebe8]">
      <SEO
        title="Provider-Avatar (Voice) & Fantasy Preview | iwantsexnow.ch"
        description="Interaktive Schweizer Provider-Avatare mit ElevenLabs Voice, 1-Klick-Chips und KI-Vorgeschmack (80/20 Creator-Split & 1-Klick Opt-Out)."
      />

      <LuxuryHeader />

      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6">
        <section className="dossier-panel flex flex-col gap-5 rounded-[16px] p-5 sm:p-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="luxury-badge">
              <Sparkles size={11} />
              Schweizer Neuheit · 80% an Anbieterin
            </div>
            <h1 className="mt-4 font-serif text-[28px] font-normal leading-tight text-[#ff6b5e] sm:text-[38px]">
              Voice-Avatar &{" "}
              <span className="brass-text italic">
                Fantasy Preview.
              </span>
            </h1>
            <p className="mt-3 max-w-2xl text-[11px] font-light leading-6 text-[#6f8c93] sm:text-xs">
              Chatten Sie per 1-Tap-Chips mit dem lizenzierten KI-Avatar
              inklusive ElevenLabs-Stimme oder wählen Sie eine klar
              gekennzeichnete 5-Sekunden-KI-Szene.
            </p>
          </div>

          <div className="flex shrink-0 items-start gap-3 border-l border-[#ff6b5e]/30 pl-4">
            <ShieldCheck
              size={18}
              strokeWidth={1.4}
              className="mt-0.5 text-[#ff6b5e]"
            />
            <div>
              <div className="text-[10px] text-[#ff6b5e]">
                KI-Interpretation klar gekennzeichnet
              </div>
              <div className="mt-1 font-mono text-[8px] text-[#6f8c93]">
                80/20 CREATOR-SPLIT · OPT-OUT JEDERZEIT
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <label className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#ff6b5e]">
              01 · Anbieterin auswählen
            </label>
            <span className="font-mono text-[8px] tabular-nums text-[#5d7a82]">
              {topProfiles.length} kuratierte Dossiers
            </span>
          </div>

          <div className="no-scrollbar flex gap-2.5 overflow-x-auto pb-2">
            {topProfiles.map((p: any, index: number) => {
              const active = p.id === selectedProfile?.id;
              const selectorClass = active
                ? "flex w-[210px] shrink-0 cursor-pointer items-center gap-3 rounded-[10px] border border-[#ff6b5e]/55 bg-[#ff6b5e]/[0.075] p-2 text-left shadow-[inset_0_1px_0_rgba(255,245,220,0.07)]"
                : "flex w-[210px] shrink-0 cursor-pointer items-center gap-3 rounded-[10px] border border-white/[0.075] bg-[#07141a] p-2 text-left transition hover:border-[#ff6b5e]/35";

              return (
                <button
                  key={p.id || index}
                  type="button"
                  onClick={() => {
                    setSelectedProfile(p);
                    setLockedState(null);
                    setPreviewResult(null);
                    setAudioUrl(null);
                  }}
                  className={selectorClass}
                >
                  <span className="noir-stage block h-[58px] w-[46px] shrink-0 rounded-xl">
                    {p.thumbnail ? (
                      <img
                        referrerPolicy="no-referrer"
                        src={p.thumbnail}
                        alt=""
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                        className="noir-media scale-[1.06] object-cover object-top"
                      />
                    ) : (
                      <span className="photo-fallback p-0 font-serif text-[10px] text-[#ff6b5e]">
                        CH
                      </span>
                    )}
                    <span className="noir-vignette" />
                  </span>

                  <span className="min-w-0">
                    <span className="block truncate font-serif text-[12px] text-[#ff6b5e]">
                      {p.rawName}
                    </span>
                    <span className="mt-1.5 block font-mono text-[8px] tabular-nums text-[#ff6b5e]">
                      {p.canton} · {p.city}
                    </span>
                    <span className="mt-1 block font-mono text-[8px] tabular-nums text-[#ff6b5e]">
                      CHF {p.advertisedBaseChf || 350}.–
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {actionError && (
          <div className="bordeaux-button mt-5 rounded-xl px-4 py-3 text-[10px] leading-5">
            {actionError}
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <section className="dossier-panel flex flex-col justify-between rounded-[16px] p-4 sm:p-6">
            <div>
              <div className="border-b border-white/[0.065] pb-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <SwissDoorplate
                    state="FREI"
                    roomNumber={String(
                      selectedProfile.canton || "CH"
                    )}
                    customLabel="AVATAR SPRECHSTUNDE"
                    size="sm"
                  />
                  <span className="luxury-badge">ElevenLabs Voice</span>
                </div>

                <h2 className="mt-4 flex items-center gap-2 font-serif text-xl font-normal text-[#ff6b5e]">
                  <MessageCircle
                    size={18}
                    className="text-[#ff6b5e]"
                  />
                  {selectedProfile.rawName}
                </h2>

                <div className="no-scrollbar mt-4 flex gap-1.5 overflow-x-auto">
                  {ARCHETYPES.map((item) => {
                    const active = archetype === item.id;
                    const archetypeClass = active
                      ? "shrink-0 cursor-pointer rounded-full border border-[#ff6b5e]/45 bg-[#ff6b5e]/10 px-3 py-1.5 text-[8px] text-[#ff6b5e]"
                      : "ghost-button shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-[8px]";

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setArchetype(item.id)}
                        className={archetypeClass}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="chat-scroll mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
                {chatHistory.map((message, index) => {
                  const avatarMessage =
                    message.sender === "avatar";
                  const messageClass = avatarMessage
                    ? "rounded-[10px] rounded-tl-[2px] border border-[#ff6b5e]/20 bg-black/30 p-3.5 text-[11px] font-light leading-6 text-[#ff6b5e]"
                    : "ml-8 rounded-[10px] rounded-tr-[2px] border border-[#ff6b5e]/30 bg-[#ff6b5e]/[0.08] p-3.5 text-[11px] font-light leading-6 text-[#ff6b5e]";

                  return (
                    <div key={index} className={messageClass}>
                      <div className="mb-1.5 font-mono text-[7px] uppercase tracking-[0.12em] text-[#ff6b5e]">
                        {avatarMessage
                          ? selectedProfile.rawName +
                            " · KI-Interpretation"
                          : "Deine Auswahl"}
                      </div>
                      {message.text}
                    </div>
                  );
                })}

                {chatBusy && (
                  <div className="lux-skeleton h-20 rounded-[10px] border border-[#ff6b5e]/10" />
                )}
              </div>

              {audioUrl && (
                <div className="mt-4 flex flex-col gap-3 rounded-xl border border-[#4fd1b0]/20 bg-[#0d1f27]/35 p-3 text-[10px] sm:flex-row sm:items-center sm:justify-between">
                  <span className="inline-flex items-center gap-2 text-[#A8C8B7]">
                    <Volume2 size={15} />
                    Sprachnachricht bereit
                  </span>
                  <audio
                    controls
                    src={audioUrl}
                    className="h-8 max-w-full"
                  />
                </div>
              )}

              {lockedState && !unlockedChat && (
                <div className="mt-4 rounded-[10px] border border-[#ff6b5e]/45 bg-[#07141a] p-4">
                  <div className="flex items-center gap-2 text-[10px] font-medium text-[#ff6b5e]">
                    <Lock size={14} />
                    Gratis-Vorschau beendet · Demo-Freischaltung (ohne Zahlung)
                  </div>
                  <p className="mt-2 text-[10px] font-light leading-5 text-[#6f8c93]">
                    {lockedState.text}
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => {
                        setUnlockedChat(true);
                        setLockedState(null);
                      }}
                      className="brass-button min-h-[41px] cursor-pointer rounded-full px-3 font-mono text-[9px] tabular-nums"
                    >
                      <span className="relative z-[1]">
                        Demo: 10 Nachrichten · CHF 2.50
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUnlockedChat(true);
                        setLockedState(null);
                      }}
                      className="ghost-button min-h-[41px] cursor-pointer rounded-full px-3 font-mono text-[9px] tabular-nums"
                    >
                      Demo: Flatrate · CHF 9.90
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 border-t border-white/[0.065] pt-4">
              <div className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#6f8c93]">
                Zero-Typing · 1-Tap Antworten
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    type="button"
                    disabled={chatBusy}
                    onClick={() => sendQuickChip(reply)}
                    className="ghost-button min-h-[36px] cursor-pointer rounded-full px-3 py-2 text-left text-[9px] leading-4"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="dossier-panel flex flex-col justify-between rounded-[16px] p-4 sm:p-6">
            <div>
              <div className="border-b border-white/[0.065] pb-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <SwissDoorplate
                    state="RESERVIERT"
                    roomNumber="WAN 2.7"
                    customLabel="PROJEKTION · 5S"
                    size="sm"
                  />
                  <span className="luxury-badge">
                    Venice.ai · gekennzeichnet
                  </span>
                </div>

                <h2 className="mt-4 flex items-center gap-2 font-serif text-xl font-normal text-[#ff6b5e]">
                  <Video size={18} className="text-[#ff6b5e]" />
                  Fantasy Preview
                </h2>
                <p className="mt-1 text-[10px] font-light text-[#6f8c93]">
                  Szene mit {selectedProfile.rawName}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {SCENES.map((scene, index) => {
                  const active = selectedScene === scene.id;
                  const sceneClass = active
                    ? "min-h-[68px] cursor-pointer rounded-xl border border-[#ff6b5e]/50 bg-[#ff6b5e]/[0.075] p-3 text-left"
                    : "min-h-[68px] cursor-pointer rounded-xl border border-white/[0.07] bg-black/20 p-3 text-left transition hover:border-[#ff6b5e]/30";

                  return (
                    <button
                      key={scene.id}
                      type="button"
                      onClick={() => setSelectedScene(scene.id)}
                      className={sceneClass}
                    >
                      <span className="font-mono text-[8px] tabular-nums text-[#ff6b5e]">
                        SZENE {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="mt-1.5 block text-[10px] font-light leading-5 text-[#ff6b5e]">
                        {scene.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 space-y-2 rounded-xl border border-white/[0.065] bg-black/20 p-3.5 text-[9px] leading-5 text-[#6f8c93]">
                <div>
                  Gratis-Kontingent:{" "}
                  <strong className="font-mono tabular-nums text-[#9fb8b5]">
                    {Math.max(0, 2 - freePreviewsUsed)} von 2 frei
                  </strong>
                </div>
                <div>
                  Danach:{" "}
                  <strong className="font-mono tabular-nums text-[#9fb8b5]">
                    CHF 5.00 pro Clip
                  </strong>{" "}
                  · CHF 4.00 / 80% an {selectedProfile.rawName}
                </div>
                <div>
                  Ausweis:{" "}
                  <strong className="text-[#9fb8b5]">
                    KI-Interpretation, kein Originalvideo
                  </strong>
                </div>
              </div>

              {previewBusy && (
                <div className="mt-4">
                  <div className="lux-skeleton aspect-video rounded-[10px] border border-[#ff6b5e]/15" />
                  <div className="mt-2 text-center font-mono text-[8px] uppercase tracking-[0.1em] text-[#ff6b5e]">
                    Projektionsbühne wird vorbereitet
                  </div>
                </div>
              )}

              {previewResult && !previewBusy && (
                <div className="mt-4 rounded-[10px] border border-[#ff6b5e]/35 bg-[#07141a] p-4 text-[10px]">
                  {previewResult.paywallRequired ? (
                    <div>
                      <div className="font-medium text-[#ff6b5e]">
                        {previewResult.message}
                      </div>
                      <div className="mt-3 grid gap-2">
                        {previewResult.pricingOptions?.map(
                          (option: any) => (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() =>
                                triggerPreviewRender(true)
                              }
                              className="brass-button min-h-[39px] cursor-pointer rounded-full px-3 text-[9px]"
                            >
                              <span className="relative z-[1]">
                                Demo-Freischaltung: {option.label}
                              </span>
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[#A8C7B5]">
                        <span className="inline-flex items-center gap-1.5">
                          <CheckCircle2 size={14} />
                          Szene bereit: {previewResult.sceneTitle}
                        </span>
                        <span className="luxury-badge">
                          {previewResult.aiDisclosureLabel}
                        </span>
                      </div>
                      <p className="mt-3 text-[9px] font-light leading-5 text-[#6f8c93]">
                        {previewResult.synthesizedPrompt}
                      </p>
                      <Link
                        href={
                          "/profile/" +
                          encodeURIComponent(selectedProfile.id)
                        }
                        className="brass-button mt-4 inline-flex min-h-[40px] items-center gap-2 rounded-full px-4 text-[9px]"
                      >
                        <span className="relative z-[1]">
                          Echtes Dossier öffnen
                        </span>
                        <ArrowRight
                          size={12}
                          className="relative z-[1]"
                        />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              disabled={previewBusy}
              onClick={() => triggerPreviewRender(false)}
              className="brass-button mt-5 inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-full px-4 text-[10px] uppercase tracking-[0.07em]"
            >
              <Sparkles size={14} className="relative z-[1]" />
              <span className="relative z-[1]">
                {previewBusy
                  ? "5s Preview wird vorbereitet"
                  : "5-Sekunden Preview generieren · " +
                    Math.max(0, 2 - freePreviewsUsed) +
                    " gratis"}
              </span>
            </button>
          </section>
        </div>

        <section className="dossier-panel mt-6 flex flex-col gap-5 rounded-[12px] p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#ff6b5e]">
              Schweizer DSG · Lizenz · Bildrechte · 1-Klick Opt-Out
            </div>
            <p className="mt-2 text-[10px] font-light leading-5 text-[#6f8c93]">
              Bist du {selectedProfile.rawName}? Du erhältst 80% aller
              Avatar- und Preview-Erlöse oder kannst die KI-Funktionen
              hier sofort deaktivieren.
            </p>
            {optOutNotice && (
              <p className="mt-2 text-[10px] text-[#ff6b5e]">
                {optOutNotice}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => handleProviderOptOut(false)}
              className="emerald-button min-h-[40px] cursor-pointer rounded-full px-4 text-[9px]"
            >
              ✓ 80/20 Avatar-Lizenz aktivieren
            </button>
            <button
              type="button"
              onClick={() => handleProviderOptOut(true)}
              className="bordeaux-button min-h-[40px] cursor-pointer rounded-full px-4 text-[9px]"
            >
              ✕ Sofortiges 1-Klick Opt-Out
            </button>
            <Link
              href="/report"
              className="ghost-button inline-flex min-h-[40px] items-center justify-center rounded-full px-4 text-[9px]"
            >
              Zentrale Meldung
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}