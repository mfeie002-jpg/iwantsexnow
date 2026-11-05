import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import SEO from "@/components/SEO";
import {
  CheckCircle2,
  EyeOff,
  Eye,
  ShieldCheck,
  Save,
  ExternalLink,
  Trash2,
  Phone,
  Image as ImageIcon,
  Video,
  Lock,
  TrendingUp,
  Plus,
  Sparkles,
  BarChart3,
  Radio,
  Star,
} from "lucide-react";
import offersData from "@/data/harvested-offers.json";
import pilotData from "@/data/pilot-20-cohort.json";

interface PaidVaultItem {
  id: string;
  title: string;
  type: "video" | "photoset" | "bundle";
  priceChf: number;
  mediaCount: string;
  previewUrl: string;
  active: boolean;
}

export default function CreatorDashboardPage() {
  const router = useRouter();
  const [sessionAuth, setSessionAuth] = useState<{ profileId: string; token: string }>({ profileId: "", token: "" });
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = JSON.parse(localStorage.getItem("iwsn_creator_session") || "{}");
        if (saved.profileId) setSessionAuth({ profileId: saved.profileId, token: saved.token || "" });
      } catch {}
    }
  }, []);
  const profileId = String(router.query.id || router.query.profileId || sessionAuth.profileId || "ch-a720e283e85f").trim();
  const token = String(router.query.token || sessionAuth.token || "").trim();
  useEffect(() => {
    if (typeof window !== "undefined" && router.query.id && router.query.token) {
      localStorage.setItem("iwsn_creator_session", JSON.stringify({ profileId: String(router.query.id), token: String(router.query.token) }));
    }
  }, [router.query.id, router.query.token]);

  const [activeTab, setActiveTab] = useState<"profile" | "media" | "paid" | "boost">("profile");

  const baseOffer = useMemo(() => {
    if (!profileId) return null;
    const allOffers = (offersData as any[]) || [];
    const found = allOffers.find(
      (o) =>
        o.id === profileId ||
        o.dedupClusterId === profileId ||
        String(o.rawName || "").toLowerCase() === profileId.toLowerCase()
    );
    if (found) return found;
    const pilots = (pilotData as any[]) || [];
    return pilots.find((p) => p.profileId === profileId || p.id === profileId) || null;
  }, [profileId]);

  // Basis-Angaben
  const [displayName, setDisplayName] = useState("");
  const [city, setCity] = useState("Zug");
  const [canton, setCanton] = useState("ZG");
  const [phoneDisplay, setPhoneDisplay] = useState("");
  const [rate30Chf, setRate30Chf] = useState<number>(200);
  const [rate60Chf, setRate60Chf] = useState<number>(350);
  const [bio, setBio] = useState("");
  const [tags, setTags] = useState<string[]>(["Incall", "Outcall", "GFE"]);
  const [sourcePortal, setSourcePortal] = useState("");

  // Bilder & Video
  const [thumbnail, setThumbnail] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  // Paid Content (80/20 VIP Vault)
  const [paidItems, setPaidItems] = useState<PaidVaultItem[]>([
    {
      id: "ppv-1",
      title: "Private 4K Backstage & Lingerie Video (Uncensored)",
      type: "video",
      priceChf: 29,
      mediaCount: "1x 4K Video (6:40 Min.)",
      previewUrl: "",
      active: true,
    },
    {
      id: "ppv-2",
      title: "Exklusives VIP Foto-Set (12 High-Res Aufnahmen)",
      type: "photoset",
      priceChf: 19,
      mediaCount: "12 Fotos",
      previewUrl: "",
      active: true,
    },
  ]);
  const [newVaultTitle, setNewVaultTitle] = useState("");
  const [newVaultType, setNewVaultType] = useState<"video" | "photoset" | "bundle">("video");
  const [newVaultPrice, setNewVaultPrice] = useState<number>(29);
  const [newVaultMediaCount, setNewVaultMediaCount] = useState("1x 4K Video");

  // Live-Cam, Top-Spot Bidding & Statistiken
  const [liveCamActive, setLiveCamActive] = useState(false);
  const [liveCamChfPerMin, setLiveCamChfPerMin] = useState<number>(6);
  const [topSpotBidChf, setTopSpotBidChf] = useState<number>(0);
  const [availableUntil, setAvailableUntil] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [identityRequested, setIdentityRequested] = useState(false);
  const [metrics, setMetrics] = useState({ views: 0, detailOpens: 0, sourceClicks: 0, contactClicks: 0 });

  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // 1. Aus harvested-offers.json vorbefÃ¼llen
  useEffect(() => {
    if (!baseOffer) return;
    const cleanTitle = String(baseOffer.rawName || baseOffer.name || baseOffer.displayName || "")
      .replace(/\s+/g, " ")
      .trim();
    setDisplayName(cleanTitle);
    setCity(baseOffer.city || "Zug");
    setCanton(baseOffer.canton || "ZG");
    setPhoneDisplay(baseOffer.rawPhone || baseOffer.phoneDisplay || "");
    setRate30Chf(Number(baseOffer.rate30Chf) || 200);
    setRate60Chf(Number(baseOffer.advertisedBaseChf || baseOffer.rate60Chf) || 350);
    setBio(
      baseOffer.bio ||
        `${cleanTitle} in ${baseOffer.city || "Zug"} (${baseOffer.canton || "ZG"}) â€“ Direktkontakt ohne Agentur-Aufschlag.`
    );
    if (Array.isArray(baseOffer.includedTags) && baseOffer.includedTags.length > 0) {
      setTags(baseOffer.includedTags);
    }
    const gal = Array.isArray(baseOffer.gallery) ? baseOffer.gallery.filter((u: any) => String(u).startsWith("http")) : [];
    const mainImg =
      baseOffer.thumbnail && String(baseOffer.thumbnail).startsWith("http")
        ? baseOffer.thumbnail
        : gal[0] || "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=85";
    setThumbnail(mainImg);
    setGallery(gal.length > 0 ? gal : [mainImg]);
    setSourcePortal(baseOffer.sourcePortal || "xdate.ch");
  }, [baseOffer]);

  // 2. Server-State & echte Klick-Metriken laden
  useEffect(() => {
    if (!profileId) return;
    fetch("/api/vault/metrics")
      .then((r) => r.json())
      .then((data) => {
        if (data?.metrics?.[profileId]) {
          setMetrics({
            views: data.metrics[profileId].views || 0,
            detailOpens: data.metrics[profileId].detailOpens || 0,
            sourceClicks: data.metrics[profileId].sourceClicks || 0,
            contactClicks: data.metrics[profileId].contactClicks || 0,
          });
        }
        const st = data?.states?.[profileId];
        if (!st) return;
        if (st.displayName) setDisplayName(st.displayName);
        if (st.city) setCity(st.city);
        if (st.canton) setCanton(st.canton);
        if (st.phoneDisplay) setPhoneDisplay(st.phoneDisplay);
        if (st.rate30Chf) setRate30Chf(Number(st.rate30Chf));
        if (st.rate60Chf) setRate60Chf(Number(st.rate60Chf));
        if (st.bio) setBio(st.bio);
        if (Array.isArray(st.tags) && st.tags.length > 0) setTags(st.tags);
        if (st.thumbnail && String(st.thumbnail).startsWith("http")) setThumbnail(st.thumbnail);
        if (Array.isArray(st.gallery) && st.gallery.length > 0) setGallery(st.gallery);
        if (st.videoUrl) setVideoUrl(st.videoUrl);
        if (Array.isArray(st.paidItems) && st.paidItems.length > 0) setPaidItems(st.paidItems);
        if (typeof st.liveCamActive === "boolean") setLiveCamActive(st.liveCamActive);
        if (st.liveCamChfPerMin) setLiveCamChfPerMin(Number(st.liveCamChfPerMin));
        if (st.topSpotBidChf !== undefined) setTopSpotBidChf(Number(st.topSpotBidChf));
        if (st.availableUntil) setAvailableUntil(st.availableUntil);
        if (typeof st.paused === "boolean") setPaused(st.paused);
        if (st.identityRequested) setIdentityRequested(true);
      })
      .catch(() => {});
  }, [profileId]);

  const updateServerState = async (updates: Record<string, any>, successNote: string) => {
    if (!profileId) return;
    setSaving(true);
    setStatusMsg(null);
    try {
      await fetch("/api/vault/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_profile_fields",
          profileId,
          token,
          ownerToken: token,
          displayName,
          city,
          canton,
          phoneDisplay,
          rate30Chf: Number(rate30Chf),
          rate60Chf: Number(rate60Chf),
          bio,
          tags,
          thumbnail,
          gallery,
          videoUrl,
          paidItems,
          liveCamActive,
          liveCamChfPerMin: Number(liveCamChfPerMin),
          topSpotBidChf: Number(topSpotBidChf),
          paused,
          ...updates,
        }),
      });
      setStatusMsg(successNote);
    } catch {
      setStatusMsg("Ã„nderung lokal gespeichert.");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirm4hAvailability = async () => {
    const until = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();
    setAvailableUntil(until);
    setPaused(false);
    setSaving(true);
    try {
      await fetch("/api/vault/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "confirm_availability_4h",
          profileId,
          token,
          availabilityConfirmed: true,
        }),
      });
      setStatusMsg("âœ“ Status â€žJetzt verfÃ¼gbarâ€œ fÃ¼r die nÃ¤chsten 4 Stunden live geschaltet!");
    } catch {
      setStatusMsg("âœ“ 4h-VerfÃ¼gbarkeit aktiviert!");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePause = () => {
    const nextPaused = !paused;
    setPaused(nextPaused);
    updateServerState(
      { paused: nextPaused, hidden: nextPaused },
      nextPaused
        ? "â¸ Dein Profil ist jetzt vorÃ¼bergehend im Ã¶ffentlichen Verzeichnis ausgeblendet."
        : "â–¶ Dein Profil ist wieder Ã¶ffentlich sichtbar!"
    );
  };

  const handleAddPhoto = () => {
    const url = newPhotoUrl.trim();
    if (!url.startsWith("http")) return;
    const nextGal = [url, ...gallery.filter((u) => u !== url)];
    setGallery(nextGal);
    if (!thumbnail) setThumbnail(url);
    setNewPhotoUrl("");
    updateServerState({ gallery: nextGal, thumbnail: thumbnail || url }, "âœ“ Neues Foto zur Galerie hinzugefÃ¼gt!");
  };

  const handleSetMainPhoto = (url: string) => {
    setThumbnail(url);
    updateServerState({ thumbnail: url }, "âœ“ Haupt-Profilbild aktualisiert!");
  };

  const handleRemovePhoto = (url: string) => {
    const nextGal = gallery.filter((u) => u !== url);
    setGallery(nextGal);
    const nextMain = thumbnail === url ? nextGal[0] || "" : thumbnail;
    setThumbnail(nextMain);
    updateServerState({ gallery: nextGal, thumbnail: nextMain }, "âœ“ Bild aus Galerie entfernt.");
  };

  const handleAddPaidItem = () => {
    if (!newVaultTitle.trim()) return;
    const item: PaidVaultItem = {
      id: `ppv-${Date.now()}`,
      title: newVaultTitle.trim(),
      type: newVaultType,
      priceChf: Math.max(5, Number(newVaultPrice) || 29),
      mediaCount: newVaultMediaCount.trim() || "Exklusives Paket",
      previewUrl: thumbnail,
      active: true,
    };
    const next = [item, ...paidItems];
    setPaidItems(next);
    setNewVaultTitle("");
    updateServerState({ paidItems: next }, `âœ“ Paid-Content-Paket â€ž${item.title}â€œ (CHF ${item.priceChf}) verÃ¶ffentlicht!`);
  };

  const handleTogglePaidItem = (id: string) => {
    const next = paidItems.map((it) => (it.id === id ? { ...it, active: !it.active } : it));
    setPaidItems(next);
    updateServerState({ paidItems: next }, "âœ“ Paid-Content-Status aktualisiert.");
  };

  const handleDeletePaidItem = (id: string) => {
    const next = paidItems.filter((it) => it.id !== id);
    setPaidItems(next);
    updateServerState({ paidItems: next }, "âœ“ Paid-Content-Paket gelÃ¶scht.");
  };

  const isCurrentlyAvailable = useMemo(() => {
    if (!availableUntil || paused) return false;
    return new Date(availableUntil).getTime() > Date.now();
  }, [availableUntil, paused]);

  const ALL_SERVICE_TAGS = [
    "Incall (Privatempfang)",
    "Outcall (Hotel/Hausbesuch)",
    "Girlfriend Experience (GFE)",
    "Erotische Massage / Body2Body",
    "Tantra",
    "FranzÃ¶sisch / Deepthroat",
    "Anal",
    "Domina / BDSM",
    "Fetisch / Fussfetisch",
    "Paare willkommen",
    "Duo mit Freundin",
    "Twint / Revolut akzeptiert",
  ];

  const toggleServiceTag = (tag: string) => {
    const next = tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag];
    setTags(next);
  };

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] py-8 px-4 pb-24">
      <SEO
        title={`Anbieter-Cockpit: ${displayName || profileId || "Profil verwalten"} | iWantSexNow.ch`}
        description="Selbstverwaltetes Schweizer Anbieter-Cockpit fÃ¼r Fotos, 4K-Videos, 80/20 Paid Content, Echtzeit-VerfÃ¼gbarkeit und Top-Spot Bidding."
      />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header mit echtem Vorschaubild */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <img
              src={thumbnail || "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80"}
              alt={displayName || "Profilbild"}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80";
              }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#C8A97E]"
            />
            <div>
              <div className="text-[11px] uppercase tracking-widest text-[#C8A97E] font-semibold">
                SELBSTVERWALTETES PROFIL Â· ANBIETER-COCKPIT {sourcePortal ? `Â· QUELLE: ${sourcePortal.toUpperCase()}` : ""}
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-0.5">
                {displayName ? `${displayName} (${city}, ${canton})` : `Dein Anbieter-Cockpit (${profileId || "Neu"})`}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-1">
                <span>ID: <code className="text-gray-300">{profileId || "direct"}</code></span>
                {phoneDisplay && (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Phone size={12} /> Verifizierte Nummer: {phoneDisplay}
                  </span>
                )}
                <span className="text-[#C8A97E] font-semibold">
                  CHF {rate30Chf} (30m) Â· CHF {rate60Chf} (60m)
                </span>
                <span className="text-sky-300 font-semibold">
                  ðŸ“¸ {gallery.length} Fotos Â· ðŸ”’ {paidItems.filter((i) => i.active).length} Paid-Pakete
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/profile/${encodeURIComponent(profileId || "ch-1")}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C8A97E] hover:bg-[#b89566] text-[#0D111A] text-xs font-extrabold transition"
            >
              VollstÃ¤ndiges Direktprofil ansehen <ExternalLink size={13} />
            </Link>
            <Link
              href={`/?q=${encodeURIComponent(displayName || city)}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-white transition"
            >
              Ã–ffentliche Karte â†—
            </Link>
          </div>
        </div>

        {statusMsg && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Top 2 Sofort-Schalter (Immer sichtbar): 1. 4h VerfÃ¼gbarkeit & 2. Pause */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#121722] border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  1. ECHTZEIT-VERFÃœGBARKEIT (4H-FENSTER)
                </span>
                {isCurrentlyAvailable && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold">
                    â— Aktiv bis {new Date(availableUntil!).toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" })} Uhr
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-white">Status â€žJetzt verfÃ¼gbarâ€œ bestÃ¤tigen</h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                Sobald aktiviert, zeigt deine Karte fÃ¼r <strong>{displayName || "dein Profil"}</strong> in <strong>{city} ({canton})</strong> das grÃ¼ne Label â€žJetzt verfÃ¼gbarâ€œ samt exaktem Zeitstempel. Nach 4 Stunden lÃ¤uft der Status automatisch ab.
              </p>
            </div>

            <button
              type="button"
              onClick={handleConfirm4hAvailability}
              disabled={saving}
              className="w-full py-3.5 px-4 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-[#07120B] font-extrabold text-xs uppercase tracking-wider transition shadow-lg cursor-pointer"
            >
              â— {isCurrentlyAvailable ? "4-STUNDEN-FENSTER JETZT ERNEUERN" : "JETZT FÃœR 4 STUNDEN ALS VERFÃœGBAR BESTÃ„TIGEN"}
            </button>
          </div>

          <div className="bg-[#121722] border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C8A97E]">
                  2. SICHTBARKEIT & PAUSE
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                    paused
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : "bg-white/10 text-gray-200 border border-white/15"
                  }`}
                >
                  {paused ? "Pausiert (Ausgeblendet)" : "Ã–ffentlich sichtbar"}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">Profil vorÃ¼bergehend pausieren</h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                Du kannst deinen Eintrag jederzeit mit einem Klick aus dem Ã¶ffentlichen Verzeichnis ausblenden (z.B. bei Urlaub oder Abwesenheit) und spÃ¤ter wieder aktivieren.
              </p>
            </div>

            <button
              type="button"
              onClick={handleTogglePause}
              disabled={saving}
              className="w-full py-3.5 px-4 rounded-xl bg-[#0D111A] hover:bg-white/5 border border-white/15 text-xs font-bold text-white flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {paused ? <Eye size={14} /> : <EyeOff size={14} />}
              {paused ? "Profil jetzt wieder Ã¶ffentlich schalten" : "Profil jetzt pausieren / ausblenden"}
            </button>
          </div>
        </div>

        {/* 4-Tab-Navigation fÃ¼r alle Funktionen */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#121722] p-2 rounded-2xl border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`py-3 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === "profile" ? "bg-[#C8A97E] text-[#0D111A]" : "text-gray-300 hover:bg-white/5"
            }`}
          >
            <Save size={14} /> 1. Angaben & Preise
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("media")}
            className={`py-3 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === "media" ? "bg-[#C8A97E] text-[#0D111A]" : "text-gray-300 hover:bg-white/5"
            }`}
          >
            <ImageIcon size={14} /> 2. Fotos & 4K-Video ({gallery.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("paid")}
            className={`py-3 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === "paid" ? "bg-[#C8A97E] text-[#0D111A]" : "text-gray-300 hover:bg-white/5"
            }`}
          >
            <Lock size={14} /> 3. Paid Content / VIP Vault (80%)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("boost")}
            className={`py-3 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === "boost" ? "bg-[#C8A97E] text-[#0D111A]" : "text-gray-300 hover:bg-white/5"
            }`}
          >
            <TrendingUp size={14} /> 4. Live-Cam, Bidding & Statistik
          </button>
        </div>

        {/* TAB 1: ANGABEN, PREISE & SERVICES */}
        {activeTab === "profile" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateServerState({}, "âœ“ Deine verÃ¶ffentlichten Angaben, Services und CHF-Richtpreise wurden gespeichert!");
            }}
            className="bg-[#121722] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg sm:text-xl font-serif font-bold text-white">
                VerÃ¶ffentlichte Angaben, Services & Richtpreis bearbeiten
              </h2>
              <span className="text-[11px] text-emerald-400 font-medium">
                âœ“ Automatisch vorbefÃ¼llt aus deinem verifizierten Schweizer Profil
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-xs text-gray-300 font-semibold mb-1.5">Anzeigename</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:border-[#C8A97E] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-300 font-semibold mb-1.5">Stadt / Ort</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:border-[#C8A97E] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-300 font-semibold mb-1.5">Kanton</label>
                <select
                  value={canton}
                  onChange={(e) => setCanton(e.target.value)}
                  className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:border-[#C8A97E] outline-none"
                >
                  {["ZG","ZH","GE","VD","BS","BL","BE","LU","AG","SG","SO","TI","VS","FR","NE","TG","SZ","GR","SH","AR","GL","UR","JU","NW"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-300 font-semibold mb-1.5">Direkt-Telefon / WhatsApp (+41)</label>
                <input
                  type="text"
                  value={phoneDisplay}
                  onChange={(e) => setPhoneDisplay(e.target.value)}
                  className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-3.5 py-2.5 text-sm text-emerald-400 font-semibold focus:border-[#C8A97E] outline-none"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-300 font-semibold mb-1.5">Richtpreis 30 Min. (CHF)</label>
                <input
                  type="number"
                  value={rate30Chf}
                  onChange={(e) => setRate30Chf(Number(e.target.value))}
                  className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:border-[#C8A97E] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-300 font-semibold mb-1.5">Richtpreis 60 Min. (CHF)</label>
                <input
                  type="number"
                  value={rate60Chf}
                  onChange={(e) => setRate60Chf(Number(e.target.value))}
                  className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:border-[#C8A97E] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-300 font-semibold mb-2">
                Angebotene Services & Rahmenbedingungen (1-Klick Auswahl)
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_SERVICE_TAGS.map((tag) => {
                  const active = tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleServiceTag(tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        active
                          ? "bg-[#C8A97E]/25 border-[#C8A97E] text-[#F5F2EB]"
                          : "bg-[#0D111A] border-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      {active ? "âœ“ " : "+ "}{tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-300 font-semibold mb-1.5">
                Kurzbeschreibung & Konditionen (z.B. Privatempfang / Hotelbesuch)
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-xl bg-[#0D111A] border border-white/15 p-3.5 text-sm text-white focus:border-[#C8A97E] outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10">
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIdentityRequested(true);
                    updateServerState({ identityRequested: true }, "âœ“ Dokumentierte IdentitÃ¤tsprÃ¼fung (âœ“) wurde fÃ¼r dein Profil vorgemerkt.");
                  }}
                  className="text-[#C8A97E] hover:underline font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck size={14} />
                  {identityRequested ? "IdentitÃ¤tsprÃ¼fung (âœ“) angefragt" : "Dokumentierte IdentitÃ¤tsprÃ¼fung (âœ“) beantragen â†’"}
                </button>
                <Link href={`/report?profileId=${encodeURIComponent(profileId)}`} className="text-gray-400 hover:text-rose-400 inline-flex items-center gap-1">
                  <Trash2 size={13} /> Eintrag komplett entfernen (Opt-out)
                </Link>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-[#C8A97E] hover:bg-[#b89566] text-[#0D111A] font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition shadow-lg cursor-pointer"
              >
                <Save size={14} /> ANGABEN SPEICHERN
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: FOTOS & 4K-VIDEO-GALERIE */}
        {activeTab === "media" && (
          <div className="bg-[#121722] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-white">
                  Ã–ffentliche Profilbilder & 4K-Vorstellungsvideo verwalten
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  WÃ¤hle dein Hauptbild fÃ¼r die Startseite, fÃ¼ge neue Fotos hinzu oder hinterlege ein kurzes Vorstellungsvideo.
                </p>
              </div>
              <span className="text-xs font-bold text-[#C8A97E]">{gallery.length} aktive Fotos</span>
            </div>

            {/* Neues Foto hinzufÃ¼gen */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="Neue Foto-URL einfÃ¼gen (https://... .jpg / .webp)"
                className="flex-1 rounded-xl bg-[#0D111A] border border-white/15 px-4 py-3 text-sm text-white focus:border-[#C8A97E] outline-none"
              />
              <button
                type="button"
                onClick={handleAddPhoto}
                className="px-5 py-3 rounded-xl bg-[#C8A97E] hover:bg-[#b89566] text-[#0D111A] font-extrabold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus size={15} /> Foto zur Galerie hinzufÃ¼gen
              </button>
            </div>

            {/* Foto-Raster */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {gallery.map((imgUrl, idx) => {
                const isMain = imgUrl === thumbnail;
                return (
                  <div
                    key={`${imgUrl}-${idx}`}
                    className={`relative rounded-2xl overflow-hidden bg-[#0D111A] border-2 ${
                      isMain ? "border-[#C8A97E]" : "border-white/10"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Galerie ${idx + 1}`}
                      className="w-full aspect-[3/4] object-cover"
                    />
                    {isMain && (
                      <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-[#C8A97E] text-[#0D111A] text-[10px] font-extrabold uppercase">
                        â˜… Hauptbild
                      </span>
                    )}
                    <div className="p-2.5 bg-[#0D111A]/95 flex items-center justify-between gap-2 text-[11px]">
                      {!isMain ? (
                        <button
                          type="button"
                          onClick={() => handleSetMainPhoto(imgUrl)}
                          className="text-[#C8A97E] hover:underline font-bold cursor-pointer"
                        >
                          Als Hauptbild setzen
                        </button>
                      ) : (
                        <span className="text-emerald-400 font-semibold">Aktiv auf Karte</span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(imgUrl)}
                        className="text-gray-400 hover:text-rose-400 cursor-pointer"
                      >
                        LÃ¶schen
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 4K Teaser-Video */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <label className="block text-xs text-gray-300 font-semibold flex items-center gap-2">
                <Video size={15} className="text-[#C8A97E]" />
                <span>Ã–ffentliches 4K-Teaser-Video / Vorstellungsvideo (MP4- oder Stream-URL)</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://... (Optionales kurzes BegrÃ¼ssungsvideo auf deiner Karte)"
                  className="flex-1 rounded-xl bg-[#0D111A] border border-white/15 px-4 py-3 text-sm text-white focus:border-[#C8A97E] outline-none"
                />
                <button
                  type="button"
                  onClick={() => updateServerState({ videoUrl }, "âœ“ 4K-Vorstellungsvideo auf deinem Profil gespeichert!")}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs cursor-pointer"
                >
                  Video speichern
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PAID CONTENT / VIP-VAULT (80% PROVIDER / 20% PLATTFORM) */}
        {activeTab === "paid" && (
          <div className="bg-[#121722] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C8A97E]">
                  ZUSATZ-EINNAHMEN OHNE TREFFEN Â· 80 % DIREKT-ANTEIL FÃœR DICH
                </span>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-white mt-0.5">
                  Paid Content & Exklusive VIP-Medien verkaufen (Pay-per-View)
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Verkaufe unzensierte Foto-Sets oder 4K-Videos direkt auf deiner Profilseite. Du behÃ¤ltst 80 % jedes Kaufs (Auszahlung per Twint, IBAN oder USDT).
                </p>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-right">
                <div className="text-[10px] uppercase text-emerald-300 font-bold">Dein Umsatz-Anteil</div>
                <div className="text-lg font-extrabold text-emerald-400">80 % Netto</div>
              </div>
            </div>

            {/* Neues Paid-Content-Paket erstellen */}
            <div className="p-5 rounded-2xl bg-[#0D111A] border border-[#C8A97E]/40 space-y-4">
              <div className="text-xs font-bold text-[#C8A97E] uppercase tracking-wider">
                + Neues gesperrtes Paid-Content-Paket anlegen
              </div>
              <div className="grid sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-gray-400 mb-1">Titel des Pakets</label>
                  <input
                    type="text"
                    value={newVaultTitle}
                    onChange={(e) => setNewVaultTitle(e.target.value)}
                    placeholder="z.B. Uncensored Dusch-Video 4K (8 Min.)"
                    className="w-full rounded-xl bg-[#121722] border border-white/15 px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Medien-Typ</label>
                  <select
                    value={newVaultType}
                    onChange={(e) => setNewVaultType(e.target.value as any)}
                    className="w-full rounded-xl bg-[#121722] border border-white/15 px-3.5 py-2.5 text-xs text-white"
                  >
                    <option value="video">4K Video (PPV)</option>
                    <option value="photoset">Uncensored Foto-Set</option>
                    <option value="bundle">VIP Komplett-Bundle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Preis in CHF</label>
                  <input
                    type="number"
                    value={newVaultPrice}
                    onChange={(e) => setNewVaultPrice(Number(e.target.value))}
                    className="w-full rounded-xl bg-[#121722] border border-white/15 px-3.5 py-2.5 text-xs text-[#C8A97E] font-bold"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <input
                  type="text"
                  value={newVaultMediaCount}
                  onChange={(e) => setNewVaultMediaCount(e.target.value)}
                  placeholder="Umfang (z.B. 1x 4K Video + 15 Fotos)"
                  className="rounded-xl bg-[#121722] border border-white/15 px-3.5 py-2 text-xs text-white w-full sm:w-72"
                />
                <button
                  type="button"
                  onClick={handleAddPaidItem}
                  className="px-5 py-2.5 rounded-xl bg-[#C8A97E] hover:bg-[#b89566] text-[#0D111A] font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
                >
                  <Lock size={13} /> Paid-Paket auf Profil verÃ¶ffentlichen
                </button>
              </div>
            </div>

            {/* Liste der aktiven Paid-Pakete */}
            <div className="space-y-3">
              {paidItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[#0D111A] border border-white/10 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#C8A97E]/15 border border-[#C8A97E]/40 flex items-center justify-center text-[#C8A97E]">
                      <Lock size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{item.title}</div>
                      <div className="text-xs text-gray-400">
                        {item.mediaCount} Â· Kundenpreis: <strong className="text-[#C8A97E]">CHF {item.priceChf}</strong> Â· Dein Anteil:{" "}
                        <strong className="text-emerald-400">CHF {(item.priceChf * 0.8).toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleTogglePaidItem(item.id)}
                      className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                        item.active ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-gray-400"
                      }`}
                    >
                      {item.active ? "â— Aktiv im Profil" : "Pausiert"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePaidItem(item.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 cursor-pointer"
                    >
                      LÃ¶schen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: 1:1 LIVE-CAM, TOP-SPOT BIDDING & ECHTZEIT-STATISTIKEN */}
        {activeTab === "boost" && (
          <div className="space-y-6">
            {/* Echtzeit-Statistiken */}
            <div className="bg-[#121722] border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                  <BarChart3 size={18} className="text-[#C8A97E]" />
                  <span>Echte Profil-Statistiken (Keine geschÃ¤tzten Fake-ZÃ¤hler)</span>
                </h2>
                <span className="text-[11px] text-emerald-400 font-semibold">â— Live-Messung aktiv</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10">
                  <div className="text-[11px] text-gray-400">Karten-Einblendungen</div>
                  <div className="text-2xl font-extrabold text-white mt-1">{metrics.views}</div>
                </div>
                <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10">
                  <div className="text-[11px] text-gray-400">Profil-Aufrufe (Klicks)</div>
                  <div className="text-2xl font-extrabold text-[#C8A97E] mt-1">{metrics.detailOpens}</div>
                </div>
                <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10">
                  <div className="text-[11px] text-gray-400">Direktkontakt-Klicks (+41)</div>
                  <div className="text-2xl font-extrabold text-emerald-400 mt-1">{metrics.contactClicks}</div>
                </div>
                <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10">
                  <div className="text-[11px] text-gray-400">Quellen-Vergleichsklicks</div>
                  <div className="text-2xl font-extrabold text-sky-300 mt-1">{metrics.sourceClicks}</div>
                </div>
              </div>
            </div>

            {/* 1:1 Live-Cam & Top-Spot Bidding */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#121722] border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <Radio size={14} /> 1:1 LIVE-CAM & VIDEO-CALL
                  </span>
                  <span className="text-xs font-bold text-emerald-400">80 % Auszahlung</span>
                </div>
                <h3 className="text-lg font-bold text-white">Spontane 1:1 Video-Calls anbieten</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Schalte dich fÃ¼r diskrete 1:1 Live-Cam-Sessions frei. Besucher sehen auf deiner Karte das rote â€žLive-Cam verfÃ¼gbarâ€œ-Signal.
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-[11px] text-gray-400 mb-1">Dein Tarif (CHF pro Minute)</label>
                    <input
                      type="number"
                      value={liveCamChfPerMin}
                      onChange={(e) => setLiveCamChfPerMin(Number(e.target.value))}
                      className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-3.5 py-2 text-sm text-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !liveCamActive;
                      setLiveCamActive(next);
                      updateServerState(
                        { liveCamActive: next, liveCamChfPerMin },
                        next ? `âœ“ 1:1 Live-Cam (CHF ${liveCamChfPerMin}/Min.) aktiviert!` : "â¸ 1:1 Live-Cam deaktiviert."
                      );
                    }}
                    className={`mt-5 px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase cursor-pointer ${
                      liveCamActive ? "bg-rose-500 text-white" : "bg-[#C8A97E] text-[#0D111A]"
                    }`}
                  >
                    {liveCamActive ? "ðŸ”´ Live-Cam ist AN (Ausschalten)" : "1:1 Live-Cam einschalten"}
                  </button>
                </div>
              </div>

              <div className="bg-[#121722] border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#C8A97E] flex items-center gap-1.5">
                    <Star size={14} /> TOP-SPOT PLATZIERUNG ({city.toUpperCase()} / {canton})
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C8A97E]/20 text-[#C8A97E] text-[11px] font-bold">
                    ðŸŽ 1. Monat Pilot-Bonus: CHF 0
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">Gesponserte Top-Platzierung in {city}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  WÃ¤hrend der 30-tÃ¤gigen Pilotphase kannst du dein Profil kostenlos fÃ¼r die oberen PlÃ¤tze in {city} ({canton}) vormerken.
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-[11px] text-gray-400 mb-1">Tages-Gebot nach Gratismonat (CHF/Tag)</label>
                    <input
                      type="number"
                      value={topSpotBidChf}
                      onChange={(e) => setTopSpotBidChf(Number(e.target.value))}
                      className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-3.5 py-2 text-sm text-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateServerState(
                        { sponsored: true, topSpotBidChf },
                        `âœ“ Gratis-Pilot-Boost fÃ¼r ${city} (${canton}) aktiviert!`
                      )
                    }
                    className="mt-5 px-5 py-2.5 rounded-xl bg-[#C8A97E] hover:bg-[#b89566] text-[#0D111A] font-extrabold text-xs uppercase cursor-pointer"
                  >
                    Gratis-Pilot-Boost aktivieren
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}