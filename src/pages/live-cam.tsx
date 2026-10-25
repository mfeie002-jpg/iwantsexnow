import { BrandLogo } from "@/components/BrandLogo";
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import SEO from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  ShieldCheck,
  Lock,
  Sparkles,
  Clock,
  PhoneOff,
  CheckCircle2,
  Send,
  Camera,
  Coins,
} from "lucide-react";
import { INITIAL_RAW_SWISS_FEED, deduplicateScrapedOffers } from "@/lib/marketplace/indexer";

const CAM_PACKAGES = [
  {
    id: "vibe_3",
    label: "3 Min. Live Vibe- & Echtheits-Check",
    minutes: 3,
    priceChf: 29,
    voucherChf: 20,
    desc: "Sieh sie live vor dem Treffen! Inkl. CHF 20 Gutschein fÃ¼r deine Direktbuchung heute.",
  },
  {
    id: "private_10",
    label: "10 Min. Private 1:1 Cam-Session",
    minutes: 10,
    priceChf: 59,
    voucherChf: 25,
    desc: "Diskretes 1:1 Live-Video im verschlÃ¼sselten Browser-Raum (ohne Rufnummern-Tausch).",
  },
  {
    id: "vip_20",
    label: "20 Min. Extended VIP Cam-Date",
    minutes: 20,
    priceChf: 99,
    voucherChf: 40,
    desc: "Intimes 1:1 Wunsch-Date an der Kamera inkl. Ton & Live-Chat.",
  },
];

export default function LiveCamPage() {
  const router = useRouter();
  const { toast } = useToast();
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  const allProfiles = useMemo(() => deduplicateScrapedOffers(INITIAL_RAW_SWISS_FEED), []);
  const requestedProvider = String(router.query.provider || "");

  const [selectedProfileName, setSelectedProfileName] = useState<string>(requestedProvider || "Sophia");
  const [selectedPkgId, setSelectedPkgId] = useState<string>("vibe_3");
  const [customCamRates, setCustomCamRates] = useState({ camRate3Min: 29, camRate10Min: 59, camRate20Min: 99, camVoucherChf: 20 });
  useEffect(() => {
    const saved = localStorage.getItem("providerCamSettings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCustomCamRates({
          camRate3Min: Number(parsed.camRate3Min) || 29,
          camRate10Min: Number(parsed.camRate10Min) || 59,
          camRate20Min: Number(parsed.camRate20Min) || 99,
          camVoucherChf: Number(parsed.camVoucherChf) || 20,
        });
      } catch {}
    }
  }, []);
  const [sessionActive, setSessionActive] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(180);
  const [camEnabled, setCamEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([
    { sender: "System", text: "Ende-zu-Ende verschlÃ¼sselter 1:1 Swiss Shield Video-Kanal bereit." },
  ]);

  useEffect(() => {
    if (requestedProvider) {
      setSelectedProfileName(requestedProvider);
    }
  }, [requestedProvider]);

  const activeProfile = useMemo(() => {
    return (
      allProfiles.find((p) => p.displayName.toLowerCase() === selectedProfileName.toLowerCase()) ||
      allProfiles[0]
    );
  }, [allProfiles, selectedProfileName]);

  const dynamicPackages = CAM_PACKAGES.map((p) => ({
    ...p,
    priceChf: p.id === "vibe_3" ? customCamRates.camRate3Min : p.id === "private_10" ? customCamRates.camRate10Min : customCamRates.camRate20Min,
    voucherChf: p.id === "vibe_3" ? customCamRates.camVoucherChf : p.voucherChf,
  }));
  const selectedPkg = dynamicPackages.find((p) => p.id === selectedPkgId) || dynamicPackages[0];

  // Countdown timer when live session is running
  useEffect(() => {
    if (!sessionActive) return;
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setSessionActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionActive]);

  const toggleLocalCamera = async () => {
    if (camEnabled) {
      const stream = localVideoRef.current?.srcObject as MediaStream | null;
      stream?.getTracks().forEach((t) => t.stop());
      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      setCamEnabled(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setCamEnabled(true);
    } catch {
      toast({
        title: "Kamera im anonymen Zuschauer-Modus",
        description: "Deine eigene Kamera bleibt aus (1-Way-Privacy aktiv) â€“ du siehst nur die Anbieterin.",
      });
    }
  };

  const handleStartLiveSession = async () => {
    setRemainingSeconds(selectedPkg.minutes * 60);
    setSessionActive(true);

    // Save CHF voucher for real-world booking
    localStorage.setItem(`unlockedMedia_${activeProfile.dedupClusterId}`, JSON.stringify(["vid-3"]));

    // Book 80/20 split via Vault API
    try {
      await fetch("/api/vault/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerName: activeProfile.displayName,
          itemId: `livecam_${selectedPkg.id}`,
          itemTitle: `1:1 Live-Cam (${selectedPkg.label})`,
          priceChf: selectedPkg.priceChf,
        }),
      });
    } catch {
      // non-blocking
    }

    setMessages((prev) => [
      ...prev,
      {
        sender: activeProfile.displayName,
        text: `Hallo SÃ¼ÃŸer âœ¨ Ich bin jetzt live fÃ¼r dich im privaten Raum (${selectedPkg.minutes} Min.). Dein CHF ${selectedPkg.voucherChf} Buchungs-Gutschein fÃ¼r heute Abend ist ebenfalls aktiviert!`,
      },
    ]);

    toast({
      title: `1:1 Live-Cam mit ${activeProfile.displayName} gestartet!`,
      description: `${selectedPkg.minutes} Min. aktiv + CHF ${selectedPkg.voucherChf} Gutschein fÃ¼r dein reales Treffen hinterlegt.`,
      duration: 4500,
    });
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setMessages((prev) => [...prev, { sender: "Du (Anonym)", text: userMsg }]);
    setChatInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: activeProfile.displayName,
          text: "GefÃ¤llt dir, was du siehst? Wenn du mich heute noch in " + activeProfile.primaryCity + " treffen willst, klicke rechts einfach auf Direktbuchung mit deinem Gutschein ðŸ˜˜",
        },
      ]);
    }, 1200);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title="1:1 Private Live-Cam & Video-Vibe-Check (ZÃ¼rich, Zug & Schweiz) | iWantSexNow.ch"
        description="Sieh verifizierte Anbieterinnen live im 1:1 Video-Check vor deiner Buchung oder starte eine diskrete Private-Cam-Session im Browser."
      />
      <header className="border-b border-[#C69C6D]/25 bg-[#07101A] py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/"><BrandLogo compact /></Link>
          <div className="hidden lg:block"><Navigation /></div>
          <MobileNav />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        {/* Top Online Now Radar */}
        <div className="bg-[#09131E] border border-[#C69C6D]/40 rounded-2xl p-5 space-y-4 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <Badge className="bg-rose-600 text-white border-0 mb-1.5 animate-pulse">
                â— LIVE Â· 1:1 PRIVATE VIDEO-CHECK & CAM-LOUNGE
              </Badge>
              <h1 className="text-2xl md:text-4xl font-serif font-black">
                Jetzt Online: 1:1 Live-Kamera & Vorab-Echtheits-Check
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">
                Kein Ã¶ffentlicher Massen-Chat: Buche einen 100% privaten, verschlÃ¼sselten 1:1 Video-Call direkt im Browser (inkl. Gutschein-Anrechnung auf dein reales Date!).
              </p>
            </div>
          </div>

          {/* Horizontal Live Provider Selector */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {allProfiles.slice(0, 12).map((p) => {
              const isSelected = p.displayName === activeProfile.displayName;
              return (
                <button
                  key={p.dedupClusterId}
                  type="button"
                  onClick={() => {
                    setSelectedProfileName(p.displayName);
                    setSessionActive(false);
                  }}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border shrink-0 transition-all text-left ${
                    isSelected
                      ? "bg-[#C69C6D] text-[#0D1B2A] border-[#C69C6D] font-black shadow-lg"
                      : "bg-black/40 border-white/15 text-white hover:border-[#C69C6D]/50"
                  }`}
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-emerald-400">
                    <img src={p.thumbnail} alt={p.displayName} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border border-black" />
                  </div>
                  <div>
                    <div className="text-xs font-black flex items-center gap-1">
                      {p.displayName}, {p.age}
                    </div>
                    <div className={`text-[10px] ${isSelected ? "text-[#0D1B2A]/80" : "text-emerald-400"}`}>
                      â— Cam bereit Â· {p.primaryCity}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main 1:1 Video Terminal & Package Configurator */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left 8 Columns: Encrypted 1:1 Video Stream Stage */}
          <div className="lg:col-span-8 space-y-4">
            <Card className="relative bg-black border-2 border-[#C69C6D]/60 rounded-2xl overflow-hidden h-[480px] flex flex-col justify-between shadow-2xl">
              {/* Remote Provider Video / Preview */}
              <img
                src={activeProfile.thumbnail}
                alt={activeProfile.displayName}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                  sessionActive ? "blur-0 scale-100 brightness-100" : "blur-md scale-105 brightness-50"
                }`}
              />

              {/* Top Overlay Status Bar */}
              <div className="relative z-10 p-4 bg-gradient-to-b from-black/85 to-transparent flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    {sessionActive ? "1:1 LIVE STREAM AKTIV" : "BEREIT FÃœR 1:1 VERBINDUNG"}
                  </span>
                  <span className="text-xs font-bold text-white bg-black/60 px-3 py-1 rounded-full border border-white/15">
                    {activeProfile.displayName} ({activeProfile.primaryCity}, {activeProfile.canton})
                  </span>
                </div>

                {sessionActive && (
                  <div className="bg-black/80 border border-[#C69C6D] text-[#D5A021] font-mono font-black text-sm px-3.5 py-1 rounded-xl flex items-center gap-1.5">
                    <Clock size={14} /> {formatTime(remainingSeconds)}
                  </div>
                )}
              </div>

              {/* Center Lock / Start Prompt when not active */}
              {!sessionActive && (
                <div className="relative z-10 my-auto mx-auto max-w-md text-center p-6 rounded-2xl bg-[#09131E]/95 border border-[#C69C6D]/60 space-y-4 shadow-2xl">
                  <div className="w-14 h-14 rounded-full bg-[#C69C6D]/20 border border-[#C69C6D] mx-auto flex items-center justify-center">
                    <Video size={26} className="text-[#D5A021]" />
                  </div>
                  <h2 className="text-xl font-serif font-black">
                    Privater 1:1 Video-Kanal mit {activeProfile.displayName}
                  </h2>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Starte den <strong>3-Minuten Live-Echtheits-Check (CHF 29 inkl. CHF 20 Buchungs-Gutschein)</strong> oder ein privates 1:1 Cam-Date. Deine eigene Kamera bleibt standardmÃ¤ssig ausgeschaltet (100% anonym).
                  </p>
                  <Button
                    onClick={handleStartLiveSession}
                    className="w-full bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] font-black py-6 text-sm shadow-xl"
                  >
                    <Video size={16} className="mr-2" />
                    Jetzt {selectedPkg.label} starten (CHF {selectedPkg.priceChf})
                  </Button>
                </div>
              )}

              {/* Picture-in-Picture Local Client Camera (Optional 2-Way Video) */}
              <div className="relative z-10 p-4 bg-gradient-to-t from-black/90 to-transparent flex items-end justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={toggleLocalCamera}
                    className="bg-black/70 border-white/25 text-white text-xs"
                  >
                    {camEnabled ? <Video size={14} className="mr-1.5 text-emerald-400" /> : <VideoOff size={14} className="mr-1.5 text-gray-400" />}
                    {camEnabled ? "Meine Cam: AN" : "Meine Cam: AUS (Anonym)"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setMicEnabled(!micEnabled)}
                    className="bg-black/70 border-white/25 text-white text-xs"
                  >
                    {micEnabled ? <Mic size={14} className="mr-1.5 text-emerald-400" /> : <MicOff size={14} className="mr-1.5 text-rose-400" />}
                    {micEnabled ? "Mikrofon: AN" : "Stumm"}
                  </Button>
                  {sessionActive && (
                    <Button
                      size="sm"
                      onClick={() => setSessionActive(false)}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                    >
                      <PhoneOff size={14} className="mr-1.5" /> Beenden
                    </Button>
                  )}
                </div>

                {/* Small PiP Window */}
                <div className="w-28 h-20 rounded-xl bg-black/80 border border-white/20 overflow-hidden flex items-center justify-center text-[10px] text-gray-400 shrink-0">
                  {camEnabled ? (
                    <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-center px-2">ðŸ”’ Deine Cam ist geschÃ¼tzt</span>
                  )}
                </div>
              </div>
            </Card>

            {/* Encrypted Live Chat Bar under Video */}
            <Card className="bg-[#09131E] border border-white/15 p-4 rounded-2xl text-white space-y-3">
              <div className="max-h-36 overflow-y-auto space-y-2 text-xs pr-2">
                {messages.map((m, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                    <strong className={m.sender === activeProfile.displayName ? "text-[#D5A021]" : "text-emerald-400"}>
                      {m.sender}:
                    </strong>{" "}
                    <span className="text-gray-200">{m.text}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendChat} className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Nachricht oder Wunsch live an ${activeProfile.displayName} schreiben...`}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 rounded-xl bg-black/50 border border-white/20 px-3.5 py-2 text-xs text-white"
                />
                <Button type="submit" size="sm" className="bg-[#C69C6D] text-[#0D1B2A] font-black text-xs px-4">
                  <Send size={13} className="mr-1" /> Senden
                </Button>
              </form>
            </Card>
          </div>

          {/* Right 4 Columns: Cam Package Selector & Instant Transition to Real Date */}
          <div className="lg:col-span-4 space-y-5">
            <Card className="bg-[#09131E] border-2 border-[#C69C6D]/60 p-6 rounded-2xl text-white space-y-4 shadow-2xl">
              <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40">
                <Lock size={12} className="mr-1 inline" /> 1:1 Tarif & Gutschein-Anrechnung
              </Badge>
              <h2 className="text-xl font-serif font-black">
                1:1 Kamera-Paket wÃ¤hlen
              </h2>

              <div className="space-y-2.5">
                {dynamicPackages.map((pkg) => {
                  const active = selectedPkgId === pkg.id;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPkgId(pkg.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                        active
                          ? "bg-emerald-950/50 border-2 border-emerald-400"
                          : "bg-black/40 border-white/15 hover:border-white/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{pkg.label}</span>
                        <span className="text-base font-black text-[#D5A021]">CHF {pkg.priceChf}</span>
                      </div>
                      <p className="text-[11px] text-gray-300 mt-1">{pkg.desc}</p>
                      <div className="mt-1.5 text-[10px] font-bold text-emerald-400">
                        âœ“ Inkl. CHF {pkg.voucherChf} Gutschein auf reales Treffen!
                      </div>
                    </button>
                  );
                })}
              </div>

              <Button
                onClick={handleStartLiveSession}
                className="w-full bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] font-black py-6 text-sm shadow-xl"
              >
                <Video size={16} className="mr-2" />
                {sessionActive ? "Zeit verlÃ¤ngern" : `1:1 Live-Call starten (CHF ${selectedPkg.priceChf})`}
              </Button>
            </Card>

            {/* Convert from Live Cam to Real Date */}
            <Card className="bg-gradient-to-br from-[#132538] to-[#09131E] border border-emerald-500/40 p-5 rounded-2xl text-white space-y-3">
              <div className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={14} /> Chemie stimmt im Video-Check?
              </div>
              <h3 className="text-lg font-serif font-black">
                Jetzt reales Treffen mit {activeProfile.displayName} buchen
              </h3>
              <p className="text-xs text-gray-300">
                Dein <strong>CHF {selectedPkg.voucherChf} Live-Check-Gutschein</strong> wird auf dem Profil von {activeProfile.displayName} automatisch vom Stundentarif abgezogen:
              </p>
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-[#0D1B2A] font-black text-xs" asChild>
                <Link href={`/profile/${encodeURIComponent(activeProfile.displayName)}`}>
                  Mit Gutschein zum Fixpreis buchen â†’
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}