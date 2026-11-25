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
    <div className="penthouse-page min-h-screen pb-24 text-[#fbf1ec]">
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
            <h1 className="mt-4 font-serif text-[28px] font-normal leading-tight text-[#e8c98a] sm:text-[38px]">
              Voice-Avatar &{" "}
              <span className="brass-text italic">
                Fantasy Preview.
              </span>
            </h1>
            <p className="mt-3 max-w-2xl text-xs font-light leading-6 text-[#cdb5be] sm:text-xs">
              Chatten Sie per 1-Tap-Chips mit dem lizenzierten KI-Avatar
              inklusive ElevenLabs-Stimme oder wählen Sie eine klar
              gekennzeichnete 5-Sekunden-KI-Szene.
            </p>
          </div>

          <div className="flex shrink-0 items-start gap-3 border-l border-[#e8c98a]/30 pl-4">
            <ShieldCheck
              size={18}
              strokeWidth={1.4}
              className="mt-0.5 text-[#e8c98a]"
            />
            <div>
              <div className="text-xs text-[#e8c98a]">
                KI-Interpretation klar gekennzeichnet
              </div>
              <div className="mt-1 font-mono text-xs text-[#cdb5be]">
                80/20 CREATOR-SPLIT · OPT-OUT JEDERZEIT
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <label className="font-mono text-xs uppercase tracking-[0.18em] text-[#e8c98a]">
              01 · Anbieterin auswählen
            </label>
            <span className="font-mono text-xs tabular-nums text-[#cdb5be]">
              {topProfiles.length} kuratierte Dossiers
            </span>
          </div>

          <div className="no-scrollbar flex gap-2.5 overflow-x-auto pb-2">
            {topProfiles.map((p: any, index: number) => {
              const active = p.id === selectedProfile?.id;
              const selectorClass = active
                ? "flex w-[210px] shrink-0 cursor-pointer items-center gap-3 rounded-[10px] border border-[#e8c98a]/55 bg-[#d6165f]/[0.075] p-2 text-left shadow-[inset_0_1px_0_rgba(251,241,236,0.07)]"
                : "flex w-[210px] shrink-0 cursor-pointer items-center gap-3 rounded-[10px] border border-white/[0.075] bg-[#22101a] p-2 text-left transition hover:border-[#e8c98a]/35";

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
                  <span className="noir-stage block h-[58px] w-[46px] shrink-0 rounded-[5px]">
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
                      <span className="photo-fallback p-0 font-serif text-xs text-[#e8c98a]">
                        CH
                      </span>
                    )}
                    <span className="noir-vignette" />
                  </span>

                  <span className="min-w-0">
                    <span className="block truncate font-serif text-[12px] text-[#e8c98a]">
                      {p.rawName}
                    </span>
                    <span className="mt-1.5 block font-mono text-xs tabular-nums text-[#cdb5be]">
                      {p.canton} · {p.city}
                    </span>
                    <span className="mt-1 block font-mono text-xs tabular-nums text-[#e8c98a]">
                      CHF {p.advertisedBaseChf || 350}.–
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {actionError && (
          <div className="bordeaux-button mt-5 rounded-[8px] px-4 py-3 text-xs leading-5">
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

                <h2 className="mt-4 flex items-center gap-2 font-serif text-xl font-normal text-[#e8c98a]">
                  <MessageCircle
                    size={18}
                    className="text-[#e8c98a]"
                  />
                  {selectedProfile.rawName}
                </h2>

                <div className="no-scrollbar mt-4 flex gap-1.5 overflow-x-auto">
                  {ARCHETYPES.map((item) => {
                    const active = archetype === item.id;
                    const archetypeClass = active
                      ? "shrink-0 cursor-pointer rounded-full border border-[#e8c98a]/45 bg-[#d6165f]/10 px-3 py-1.5 text-xs text-[#e8c98a]"
                      : "ghost-button shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-xs";

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
                    ? "rounded-[10px] rounded-tl-[2px] border border-[#e8c98a]/20 bg-black/30 p-3.5 text-xs font-light leading-6 text-[#cdb5be]"
                    : "ml-8 rounded-[10px] rounded-tr-[2px] border border-[#e8c98a]/30 bg-[#d6165f]/[0.08] p-3.5 text-xs font-light leading-6 text-[#e8c98a]";

                  return (
                    <div key={index} className={messageClass}>
                      <div className="mb-1.5 font-mono text-xs uppercase tracking-[0.12em] text-[#e8c98a]">
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
                  <div className="lux-skeleton h-20 rounded-[10px] border border-[#e8c98a]/10" />
                )}
              </div>

              {audioUrl && (
                <div className="mt-4 flex flex-col gap-3 rounded-[8px] border border-[#4fd6a0]/20 bg-[#22101a]/35 p-3 text-xs sm:flex-row sm:items-center sm:justify-between">
                  <span className="inline-flex items-center gap-2 text-[#cdb5be]">
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
                <div className="mt-4 rounded-[10px] border border-[#e8c98a]/45 bg-[#150810] p-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#e8c98a]">
                    <Lock size={14} />
                    Gratis-Vorschau beendet · Demo-Freischaltung (ohne Zahlung)
                  </div>
                  <p className="mt-2 text-xs font-light leading-5 text-[#cdb5be]">
                    {lockedState.text}
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => {
                        setUnlockedChat(true);
                        setLockedState(null);
                      }}
                      className="brass-button min-h-[41px] cursor-pointer rounded-full px-3 font-mono text-xs tabular-nums"
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
                      className="ghost-button min-h-[41px] cursor-pointer rounded-full px-3 font-mono text-xs tabular-nums"
                    >
                      Demo: Flatrate · CHF 9.90
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 border-t border-white/[0.065] pt-4">
              <div className="font-mono text-xs uppercase tracking-[0.12em] text-[#cdb5be]">
                Zero-Typing · 1-Tap Antworten
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    type="button"
                    disabled={chatBusy}
                    onClick={() => sendQuickChip(reply)}
                    className="ghost-button min-h-[36px] cursor-pointer rounded-full px-3 py-2 text-left text-xs leading-4"
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

                <h2 className="mt-4 flex items-center gap-2 font-serif text-xl font-normal text-[#e8c98a]">
                  <Video size={18} className="text-[#e8c98a]" />
                  Fantasy Preview
                </h2>
                <p className="mt-1 text-xs font-light text-[#cdb5be]">
                  Szene mit {selectedProfile.rawName}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {SCENES.map((scene, index) => {
                  const active = selectedScene === scene.id;
                  const sceneClass = active
                    ? "min-h-[68px] cursor-pointer rounded-[8px] border border-[#e8c98a]/50 bg-[#d6165f]/[0.075] p-3 text-left"
                    : "min-h-[68px] cursor-pointer rounded-[8px] border border-white/[0.07] bg-black/20 p-3 text-left transition hover:border-[#e8c98a]/30";

                  return (
                    <button
                      key={scene.id}
                      type="button"
                      onClick={() => setSelectedScene(scene.id)}
                      className={sceneClass}
                    >
                      <span className="font-mono text-xs tabular-nums text-[#e8c98a]">
                        SZENE {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="mt-1.5 block text-xs font-light leading-5 text-[#cdb5be]">
                        {scene.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 space-y-2 rounded-[8px] border border-white/[0.065] bg-black/20 p-3.5 text-xs leading-5 text-[#cdb5be]">
                <div>
                  Gratis-Kontingent:{" "}
                  <strong className="font-mono tabular-nums text-[#e8c98a]">
                    {Math.max(0, 2 - freePreviewsUsed)} von 2 frei
                  </strong>
                </div>
                <div>
                  Danach:{" "}
                  <strong className="font-mono tabular-nums text-[#e8c98a]">
                    CHF 5.00 pro Clip
                  </strong>{" "}
                  · CHF 4.00 / 80% an {selectedProfile.rawName}
                </div>
                <div>
                  Ausweis:{" "}
                  <strong className="text-[#e8c98a]">
                    KI-Interpretation, kein Originalvideo
                  </strong>
                </div>
              </div>

              {previewBusy && (
                <div className="mt-4">
                  <div className="lux-skeleton aspect-video rounded-[10px] border border-[#e8c98a]/15" />
                  <div className="mt-2 text-center font-mono text-xs uppercase tracking-[0.1em] text-[#cdb5be]">
                    Projektionsbühne wird vorbereitet
                  </div>
                </div>
              )}

              {previewResult && !previewBusy && (
                <div className="mt-4 rounded-[10px] border border-[#e8c98a]/35 bg-[#150810] p-4 text-xs">
                  {previewResult.paywallRequired ? (
                    <div>
                      <div className="font-medium text-[#e8c98a]">
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
                              className="brass-button min-h-[39px] cursor-pointer rounded-full px-3 text-xs"
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
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[#cdb5be]">
                        <span className="inline-flex items-center gap-1.5">
                          <CheckCircle2 size={14} />
                          Szene bereit: {previewResult.sceneTitle}
                        </span>
                        <span className="luxury-badge">
                          {previewResult.aiDisclosureLabel}
                        </span>
                      </div>
                      <p className="mt-3 text-xs font-light leading-5 text-[#cdb5be]">
                        {previewResult.synthesizedPrompt}
                      </p>
                      <Link
                        href={
                          "/profile/" +
                          encodeURIComponent(selectedProfile.id)
                        }
                        className="brass-button mt-4 inline-flex min-h-[40px] items-center gap-2 rounded-full px-4 text-xs"
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
              className="brass-button mt-5 inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-full px-4 text-xs uppercase tracking-[0.07em]"
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
            <div className="font-mono text-xs uppercase tracking-[0.15em] text-[#e8c98a]">
              Schweizer DSG · Lizenz · Bildrechte · 1-Klick Opt-Out
            </div>
            <p className="mt-2 text-xs font-light leading-5 text-[#cdb5be]">
              Bist du {selectedProfile.rawName}? Du erhältst 80% aller
              Avatar- und Preview-Erlöse oder kannst die KI-Funktionen
              hier sofort deaktivieren.
            </p>
            {optOutNotice && (
              <p className="mt-2 text-xs text-[#e8c98a]">
                {optOutNotice}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => handleProviderOptOut(false)}
              className="emerald-button min-h-[40px] cursor-pointer rounded-full px-4 text-xs"
            >
              ✓ 80/20 Avatar-Lizenz aktivieren
            </button>
            <button
              type="button"
              onClick={() => handleProviderOptOut(true)}
              className="bordeaux-button min-h-[40px] cursor-pointer rounded-full px-4 text-xs"
            >
              ✕ Sofortiges 1-Klick Opt-Out
            </button>
            <Link
              href="/report"
              className="ghost-button inline-flex min-h-[40px] items-center justify-center rounded-full px-4 text-xs"
            >
              Zentrale Meldung
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}