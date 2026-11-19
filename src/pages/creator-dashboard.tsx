import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import SEO from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
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
  const profileId = String(router.query.id || router.query.profileId || sessionAuth.profileId || "").trim();
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
  }, [profileId, token]);

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
  const [myEnquiries, setMyEnquiries] = useState<any[]>([]);

  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // 1. Aus harvested-offers.json vorbefüllen
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
        `${cleanTitle} in ${baseOffer.city || "Zug"} (${baseOffer.canton || "ZG"}) – Direktkontakt ohne Agentur-Aufschlag.`
    );
    if (Array.isArray(baseOffer.includedTags) && baseOffer.includedTags.length > 0) {
      setTags(baseOffer.includedTags);
    }
    const gal = Array.isArray(baseOffer.gallery) ? baseOffer.gallery.filter((u: any) => String(u).startsWith("http")) : [];
    const mainImg =
      baseOffer.thumbnail && String(baseOffer.thumbnail).startsWith("http")
        ? baseOffer.thumbnail
        : gal[0] || "/editorial/editorial-salon.jpg";
    setThumbnail(mainImg);
    setGallery(gal.length > 0 ? gal : [mainImg]);
    setSourcePortal(baseOffer.sourcePortal || "xdate.ch");
  }, [baseOffer]);

  // 2. Server-State & echte Klick-Metriken laden
  useEffect(() => {
    if (!profileId) return;
    fetch(`/api/vault/metrics?profileId=${encodeURIComponent(profileId)}&token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data?.enquiries)) setMyEnquiries(data.enquiries);
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
  }, [profileId, token]);

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
      setStatusMsg("Änderung lokal gespeichert.");
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
      setStatusMsg("✓ Status „Jetzt verfügbar“ für die nächsten 4 Stunden live geschaltet!");
    } catch {
      setStatusMsg("✓ 4h-Verfügbarkeit aktiviert!");
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
        ? "⏸ Dein Profil ist jetzt vorübergehend im öffentlichen Verzeichnis ausgeblendet."
        : "▶ Dein Profil ist wieder öffentlich sichtbar!"
    );
  };

  const handleAddPhoto = () => {
    const url = newPhotoUrl.trim();
    if (!url.startsWith("http")) return;
    const nextGal = [url, ...gallery.filter((u) => u !== url)];
    setGallery(nextGal);
    if (!thumbnail) setThumbnail(url);
    setNewPhotoUrl("");
    updateServerState({ gallery: nextGal, thumbnail: thumbnail || url }, "✓ Neues Foto zur Galerie hinzugefügt!");
  };

  const handleSetMainPhoto = (url: string) => {
    setThumbnail(url);
    updateServerState({ thumbnail: url }, "✓ Haupt-Profilbild aktualisiert!");
  };

  const handleRemovePhoto = (url: string) => {
    const nextGal = gallery.filter((u) => u !== url);
    setGallery(nextGal);
    const nextMain = thumbnail === url ? nextGal[0] || "" : thumbnail;
    setThumbnail(nextMain);
    updateServerState({ gallery: nextGal, thumbnail: nextMain }, "✓ Bild aus Galerie entfernt.");
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
    updateServerState({ paidItems: next }, `✓ Paid-Content-Paket „${item.title}“ (CHF ${item.priceChf}) veröffentlicht!`);
  };

  const handleTogglePaidItem = (id: string) => {
    const next = paidItems.map((it) => (it.id === id ? { ...it, active: !it.active } : it));
    setPaidItems(next);
    updateServerState({ paidItems: next }, "✓ Paid-Content-Status aktualisiert.");
  };

  const handleDeletePaidItem = (id: string) => {
    const next = paidItems.filter((it) => it.id !== id);
    setPaidItems(next);
    updateServerState({ paidItems: next }, "✓ Paid-Content-Paket gelöscht.");
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
    "Französisch / Deepthroat",
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
    <div className="min-h-screen bg-papier text-tinte pb-24">
      <LuxuryHeader />
      <SEO
        title={`Anbieter-Cockpit: ${displayName || profileId || "Profil verwalten"} | iWantSexNow.ch`}
        description="Selbstverwaltetes Schweizer Anbieter-Cockpit für Fotos, 4K-Videos, 80/20 Paid Content, Echtzeit-Verfügbarkeit und Top-Spot Bidding."
      />

      <div className="cockpit space-y-6">
        {/* Header mit echtem Vorschaubild */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-tinte/20 pb-6">
          <div className="flex items-center gap-4">
            <img
              src={thumbnail || "/editorial/editorial-salon.jpg"}
              alt={displayName || "Profilbild"}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/editorial/editorial-salon.jpg";
              }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-kirsche"
            />
            <div>
              <div className="text-[13px] text-kirsche font-semibold">
                SELBSTVERWALTETES PROFIL · ANBIETER-COCKPIT {sourcePortal ? `· QUELLE: ${sourcePortal.toUpperCase()}` : ""}
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-tinte mt-0.5">
                {displayName ? `${displayName} (${city}, ${canton})` : `Dein Anbieter-Cockpit (${profileId || "Neu"})`}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-[13px] text-gray-600 mt-1">
                <span>ID: <code className="text-gray-700">{profileId || "direct"}</code></span>
                {phoneDisplay && (
                  <span className="text-mint-700 font-semibold flex items-center gap-1">
                    <Phone size={12} /> Verifizierte Nummer: {phoneDisplay}
                  </span>
                )}
                <span className="text-kirsche font-semibold">
                  CHF {rate30Chf} (30m) · CHF {rate60Chf} (60m)
                </span>
                <span className="text-lake-700 font-semibold">
                  📸 {gallery.length} Fotos · 🔒 {paidItems.filter((i) => i.active).length} Paid-Pakete
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/profile/${encodeURIComponent(profileId || "ch-1")}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-kirsche hover:bg-kirsche-tief text-white text-[13px] font-extrabold transition"
            >
              Vollständiges Direktprofil ansehen <ExternalLink size={13} />
            </Link>
            <Link
              href={`/?q=${encodeURIComponent(displayName || city)}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-tinte/[0.04] hover:bg-tinte/[0.06] border border-tinte/25 text-[13px] font-semibold text-tinte transition"
            >
              Öffentliche Karte ↗
            </Link>
          </div>
        </div>

        {statusMsg && (
          <div className="p-4 rounded-xl bg-mint-100/60 border border-mint-500/40 text-mint-800 text-[13px] font-medium flex items-center gap-2">
            <CheckCircle2 size={16} className="text-mint-700 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Top 2 Sofort-Schalter (Immer sichtbar): 1. 4h Verfügbarkeit & 2. Pause */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-tinte/20 rounded-2xl p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-mint-700">
                  1. ECHTZEIT-VERFÜGBARKEIT (4H-FENSTER)
                </span>
                {isCurrentlyAvailable && (
                  <span className="px-2.5 py-0.5 rounded-full bg-mint-500/20 border border-mint-500/40 text-mint-700 text-[13px] font-bold">
                    ● Aktiv bis {new Date(availableUntil!).toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" })} Uhr
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-tinte">Status „Jetzt verfügbar“ bestätigen</h2>
              <p className="text-[13px] text-gray-600 leading-relaxed">
                Sobald aktiviert, zeigt deine Karte für <strong>{displayName || "dein Profil"}</strong> in <strong>{city} ({canton})</strong> das grüne Label „Jetzt verfügbar“ samt exaktem Zeitstempel. Nach 4 Stunden läuft der Status automatisch ab.
              </p>
            </div>

            <button
              type="button"
              onClick={handleConfirm4hAvailability}
              disabled={saving}
              className="w-full py-3.5 px-4 rounded-xl bg-[#4fd1b0] hover:bg-[#16A34A] text-tinte font-extrabold text-[13px] transition shadow-lg cursor-pointer"
            >
              ● {isCurrentlyAvailable ? "4-STUNDEN-FENSTER Jetzt Erneuern" : "JETZT FÜR 4 Stunden als VerfÜGbar BestÄTIGEN"}
            </button>
          </div>

          <div className="bg-white border border-tinte/20 rounded-2xl p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-kirsche">
                  2. Sichtbarkeit & Pause
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[13px] font-semibold ${
                    paused
                      ? "bg-sun-500/20 text-sun-700 border border-sun-500/40"
                      : "bg-tinte/[0.06] text-gray-800 border border-tinte/25"
                  }`}
                >
                  {paused ? "Pausiert (Ausgeblendet)" : "Öffentlich sichtbar"}
                </span>
              </div>
              <h2 className="text-lg font-bold text-tinte">Profil vorübergehend pausieren</h2>
              <p className="text-[13px] text-gray-600 leading-relaxed">
                Du kannst deinen Eintrag jederzeit mit einem Klick aus dem öffentlichen Verzeichnis ausblenden (z.B. bei Urlaub oder Abwesenheit) und später wieder aktivieren.
              </p>
            </div>

            <button
              type="button"
              onClick={handleTogglePause}
              disabled={saving}
              className="w-full py-3.5 px-4 rounded-xl bg-papier hover:bg-tinte/[0.04] border border-tinte/25 text-[13px] font-bold text-tinte flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {paused ? <Eye size={14} /> : <EyeOff size={14} />}
              {paused ? "Profil jetzt wieder öffentlich schalten" : "Profil jetzt pausieren / ausblenden"}
            </button>
          </div>
        </div>

        {/* 4-Tab-Navigation für alle Funktionen */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-2 rounded-2xl border border-tinte/20">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`py-3 px-3 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === "profile" ? "bg-kirsche text-white" : "text-tinte hover:bg-tinte/[0.04]"
            }`}
          >
            <Save size={14} /> 1. Angaben & Preise
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("media")}
            className={`py-3 px-3 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === "media" ? "bg-kirsche text-white" : "text-tinte hover:bg-tinte/[0.04]"
            }`}
          >
            <ImageIcon size={14} /> 2. Fotos & 4K-Video ({gallery.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("paid")}
            className={`py-3 px-3 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === "paid" ? "bg-kirsche text-white" : "text-tinte hover:bg-tinte/[0.04]"
            }`}
          >
            <Lock size={14} /> 3. Paid Content / VIP Vault (80%)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("boost")}
            className={`py-3 px-3 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === "boost" ? "bg-kirsche text-white" : "text-tinte hover:bg-tinte/[0.04]"
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
              updateServerState({}, "✓ Deine veröffentlichten Angaben, Services und CHF-Richtpreise wurden gespeichert!");
            }}
            className="bg-white border border-tinte/20 rounded-2xl p-6 sm:p-8 space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg sm:text-xl font-serif font-bold text-tinte">
                Veröffentlichte Angaben, Services & Richtpreis bearbeiten
              </h2>
              <span className="text-[13px] text-mint-700 font-medium">
                ✓ Automatisch vorbefüllt aus deinem verifizierten Schweizer Profil
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-[13px] text-gray-700 font-semibold mb-1.5">Anzeigename</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-xl bg-papier border border-tinte/25 px-3.5 py-2.5 text-sm text-tinte focus:border-kirsche outline-none"
                />
              </div>
              <div>
                <label className="block text-[13px] text-gray-700 font-semibold mb-1.5">Stadt / Ort</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl bg-papier border border-tinte/25 px-3.5 py-2.5 text-sm text-tinte focus:border-kirsche outline-none"
                />
              </div>
              <div>
                <label className="block text-[13px] text-gray-700 font-semibold mb-1.5">Kanton</label>
                <select
                  value={canton}
                  onChange={(e) => setCanton(e.target.value)}
                  className="w-full rounded-xl bg-papier border border-tinte/25 px-3.5 py-2.5 text-sm text-tinte focus:border-kirsche outline-none"
                >
                  {["ZG","ZH","GE","VD","BS","BL","BE","LU","AG","SG","SO","TI","VS","FR","NE","TG","SZ","GR","SH","AR","GL","UR","JU","NW"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[13px] text-gray-700 font-semibold mb-1.5">Direkt-Telefon / WhatsApp (+41)</label>
                <input
                  type="text"
                  value={phoneDisplay}
                  onChange={(e) => setPhoneDisplay(e.target.value)}
                  className="w-full rounded-xl bg-papier border border-tinte/25 px-3.5 py-2.5 text-sm text-mint-700 font-semibold focus:border-kirsche outline-none"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] text-gray-700 font-semibold mb-1.5">Richtpreis 30 Min. (CHF)</label>
                <input
                  type="number"
                  value={rate30Chf}
                  onChange={(e) => setRate30Chf(Number(e.target.value))}
                  className="w-full rounded-xl bg-papier border border-tinte/25 px-3.5 py-2.5 text-sm text-tinte focus:border-kirsche outline-none"
                />
              </div>
              <div>
                <label className="block text-[13px] text-gray-700 font-semibold mb-1.5">Richtpreis 60 Min. (CHF)</label>
                <input
                  type="number"
                  value={rate60Chf}
                  onChange={(e) => setRate60Chf(Number(e.target.value))}
                  className="w-full rounded-xl bg-papier border border-tinte/25 px-3.5 py-2.5 text-sm text-tinte focus:border-kirsche outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] text-gray-700 font-semibold mb-2">
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
                      className={`px-3 py-1.5 rounded-xl text-[13px] font-semibold border transition cursor-pointer ${
                        active
                          ? "bg-kirsche/25 border-kirsche text-tinte"
                          : "bg-papier border-tinte/20 text-gray-600 hover:text-tinte"
                      }`}
                    >
                      {active ? "✓ " : "+ "}{tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-[13px] text-gray-700 font-semibold mb-1.5">
                Kurzbeschreibung & Konditionen (z.B. Privatempfang / Hotelbesuch)
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-xl bg-papier border border-tinte/25 p-3.5 text-sm text-tinte focus:border-kirsche outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-tinte/20">
              <div className="flex flex-wrap items-center gap-4 text-[13px]">
                <button
                  type="button"
                  onClick={() => {
                    setIdentityRequested(true);
                    updateServerState({ identityRequested: true }, "✓ Dokumentierte Identitätsprüfung (✓) wurde für dein Profil vorgemerkt.");
                  }}
                  className="text-kirsche hover:underline font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck size={14} />
                  {identityRequested ? "Identitätsprüfung (✓) angefragt" : "Dokumentierte Identitätsprüfung (✓) beantragen →"}
                </button>
                <Link href={`/report?profileId=${encodeURIComponent(profileId)}`} className="text-gray-600 hover:text-glow-700 inline-flex items-center gap-1">
                  <Trash2 size={13} /> Eintrag komplett entfernen (Opt-out)
                </Link>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-kirsche hover:bg-kirsche-tief text-white font-extrabold text-[13px] inline-flex items-center gap-2 transition shadow-lg cursor-pointer"
              >
                <Save size={14} /> Angaben Speichern
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: FOTOS & 4K-VIDEO-GALERIE */}
        {activeTab === "media" && (
          <div className="bg-white border border-tinte/20 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-tinte">
                  Öffentliche Profilbilder & 4K-Vorstellungsvideo verwalten
                </h2>
                <p className="text-[13px] text-gray-600 mt-0.5">
                  Wähle dein Hauptbild für die Startseite, füge neue Fotos hinzu oder hinterlege ein kurzes Vorstellungsvideo.
                </p>
              </div>
              <span className="text-[13px] font-bold text-kirsche">{gallery.length} aktive Fotos</span>
            </div>

            {/* Neues Foto hinzufügen */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="Neue Foto-URL einfügen (https://... .jpg / .webp)"
                className="flex-1 rounded-xl bg-papier border border-tinte/25 px-4 py-3 text-sm text-tinte focus:border-kirsche outline-none"
              />
              <button
                type="button"
                onClick={handleAddPhoto}
                className="px-5 py-3 rounded-xl bg-kirsche hover:bg-kirsche-tief text-white font-extrabold text-[13px] inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus size={15} /> Foto zur Galerie hinzufügen
              </button>
            </div>

            {/* Foto-Raster */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {gallery.map((imgUrl, idx) => {
                const isMain = imgUrl === thumbnail;
                return (
                  <div
                    key={`${imgUrl}-${idx}`}
                    className={`relative rounded-2xl overflow-hidden bg-papier border-2 ${
                      isMain ? "border-kirsche" : "border-tinte/20"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Galerie ${idx + 1}`}
                      className="w-full aspect-[3/4] object-cover"
                    />
                    {isMain && (
                      <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-kirsche text-white text-[13px] font-extrabold ">
                        ★ Hauptbild
                      </span>
                    )}
                    <div className="p-2.5 bg-papier/95 flex items-center justify-between gap-2 text-[13px]">
                      {!isMain ? (
                        <button
                          type="button"
                          onClick={() => handleSetMainPhoto(imgUrl)}
                          className="text-kirsche hover:underline font-bold cursor-pointer"
                        >
                          Als Hauptbild setzen
                        </button>
                      ) : (
                        <span className="text-mint-700 font-semibold">Aktiv auf Karte</span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(imgUrl)}
                        className="text-gray-600 hover:text-glow-700 cursor-pointer"
                      >
                        Löschen
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 4K Teaser-Video */}
            <div className="pt-4 border-t border-tinte/20 space-y-3">
              <label className="block text-[13px] text-gray-700 font-semibold flex items-center gap-2">
                <Video size={15} className="text-kirsche" />
                <span>Öffentliches 4K-Teaser-Video / Vorstellungsvideo (MP4- oder Stream-URL)</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://... (Optionales kurzes Begrüssungsvideo auf deiner Karte)"
                  className="flex-1 rounded-xl bg-papier border border-tinte/25 px-4 py-3 text-sm text-tinte focus:border-kirsche outline-none"
                />
                <button
                  type="button"
                  onClick={() => updateServerState({ videoUrl }, "✓ 4K-Vorstellungsvideo auf deinem Profil gespeichert!")}
                  className="px-5 py-3 rounded-xl bg-tinte/[0.06] hover:bg-tinte/[0.08] text-tinte font-bold text-[13px] cursor-pointer"
                >
                  Video speichern
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PAID CONTENT / VIP-VAULT (80% PROVIDER / 20% PLATTFORM) */}
        {activeTab === "paid" && (
          <div className="bg-white border border-tinte/20 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[13px] font-bold text-kirsche">
                  Zusatz-Einnahmen ohne Treffen · 80 % Direkt-Anteil FÜR DICH
                </span>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-tinte mt-0.5">
                  Paid Content & Exklusive VIP-Medien verkaufen (Pay-per-View)
                </h2>
                <p className="text-[13px] text-gray-600 mt-0.5">
                  Verkaufe unzensierte Foto-Sets oder 4K-Videos direkt auf deiner Profilseite. Du behältst 80 % jedes Kaufs (Auszahlung per Twint, IBAN oder USDT).
                </p>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-mint-500/15 border border-mint-500/30 text-right">
                <div className="text-[13px] text-mint-700 font-bold">Dein Umsatz-Anteil</div>
                <div className="text-lg font-extrabold text-mint-700">80 % Netto</div>
              </div>
            </div>

            {/* Neues Paid-Content-Paket erstellen */}
            <div className="p-5 rounded-2xl bg-papier border border-kirsche/40 space-y-4">
              <div className="text-[13px] font-bold text-kirsche ">
                + Neues gesperrtes Paid-Content-Paket anlegen
              </div>
              <div className="grid sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[13px] text-gray-600 mb-1">Titel des Pakets</label>
                  <input
                    type="text"
                    value={newVaultTitle}
                    onChange={(e) => setNewVaultTitle(e.target.value)}
                    placeholder="z.B. Uncensored Dusch-Video 4K (8 Min.)"
                    className="w-full rounded-xl bg-white border border-tinte/25 px-3.5 py-2.5 text-[13px] text-tinte"
                  />
                </div>
                <div>
                  <label className="block text-[13px] text-gray-600 mb-1">Medien-Typ</label>
                  <select
                    value={newVaultType}
                    onChange={(e) => setNewVaultType(e.target.value as any)}
                    className="w-full rounded-xl bg-white border border-tinte/25 px-3.5 py-2.5 text-[13px] text-tinte"
                  >
                    <option value="video">4K Video (PPV)</option>
                    <option value="photoset">Uncensored Foto-Set</option>
                    <option value="bundle">VIP Komplett-Bundle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] text-gray-600 mb-1">Preis in CHF</label>
                  <input
                    type="number"
                    value={newVaultPrice}
                    onChange={(e) => setNewVaultPrice(Number(e.target.value))}
                    className="w-full rounded-xl bg-white border border-tinte/25 px-3.5 py-2.5 text-[13px] text-kirsche font-bold"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <input
                  type="text"
                  value={newVaultMediaCount}
                  onChange={(e) => setNewVaultMediaCount(e.target.value)}
                  placeholder="Umfang (z.B. 1x 4K Video + 15 Fotos)"
                  className="rounded-xl bg-white border border-tinte/25 px-3.5 py-2 text-[13px] text-tinte w-full sm:w-72"
                />
                <button
                  type="button"
                  onClick={handleAddPaidItem}
                  className="px-5 py-2.5 rounded-xl bg-kirsche hover:bg-kirsche-tief text-white font-extrabold text-[13px] inline-flex items-center gap-2 cursor-pointer"
                >
                  <Lock size={13} /> Paid-Paket auf Profil veröffentlichen
                </button>
              </div>
            </div>

            {/* Liste der aktiven Paid-Pakete */}
            <div className="space-y-3">
              {paidItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-papier border border-tinte/20 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-kirsche/15 border border-kirsche/40 flex items-center justify-center text-kirsche">
                      <Lock size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-tinte">{item.title}</div>
                      <div className="text-[13px] text-gray-600">
                        {item.mediaCount} · Kundenpreis: <strong className="text-kirsche">CHF {item.priceChf}</strong> · Dein Anteil:{" "}
                        <strong className="text-mint-700">CHF {(item.priceChf * 0.8).toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[13px]">
                    <button
                      type="button"
                      onClick={() => handleTogglePaidItem(item.id)}
                      className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                        item.active ? "bg-mint-500/20 text-mint-700" : "bg-tinte/[0.06] text-gray-600"
                      }`}
                    >
                      {item.active ? "● Aktiv im Profil" : "Pausiert"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePaidItem(item.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-glow-500/15 text-glow-700 hover:bg-glow-500/25 cursor-pointer"
                    >
                      Löschen
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
            <div className="bg-white border border-tinte/20 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-serif font-bold text-tinte flex items-center gap-2">
                  <BarChart3 size={18} className="text-kirsche" />
                  <span>Echte Profil-Statistiken (Keine geschätzten Fake-Zähler)</span>
                </h2>
                <span className="text-[13px] text-mint-700 font-semibold">● Live-Messung aktiv</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-papier border border-tinte/20">
                  <div className="text-[13px] text-gray-600">Karten-Einblendungen</div>
                  <div className="text-2xl font-extrabold text-tinte mt-1">{metrics.views}</div>
                </div>
                <div className="p-4 rounded-xl bg-papier border border-tinte/20">
                  <div className="text-[13px] text-gray-600">Profil-Aufrufe (Klicks)</div>
                  <div className="text-2xl font-extrabold text-kirsche mt-1">{metrics.detailOpens}</div>
                </div>
                <div className="p-4 rounded-xl bg-papier border border-tinte/20">
                  <div className="text-[13px] text-gray-600">Direktkontakt-Klicks (+41)</div>
                  <div className="text-2xl font-extrabold text-mint-700 mt-1">{metrics.contactClicks}</div>
                </div>
                <div className="p-4 rounded-xl bg-papier border border-tinte/20">
                  <div className="text-[13px] text-gray-600">Quellen-Vergleichsklicks</div>
                  <div className="text-2xl font-extrabold text-lake-700 mt-1">{metrics.sourceClicks}</div>
                </div>
              </div>
            </div>

            {/* Eingegangene Private Kunden-Anfragen für dieses Profil */}
            <div className="bg-white border border-tinte/20 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-serif font-bold text-tinte">
                  📬 Eingegangene Private Termin-Anfragen ({myEnquiries.length})
                </h3>
                <span className="text-[13px] text-kirsche font-semibold">0 % Provision bei Direkt-Terminen</span>
              </div>
              {myEnquiries.length === 0 ? (
                <p className="text-[13px] text-gray-600">
                  Sobald ein Besucher auf deiner Profilseite eine private Rückruf-Anfrage absendet, erscheint sie sofort hier mit seiner +41 Nummer und Wunschzeit.
                </p>
              ) : (
                <div className="space-y-2">
                  {myEnquiries.map((lead: any) => (
                    <div key={lead.id} className="p-3.5 rounded-xl bg-papier border border-mint-500/30 flex flex-wrap items-center justify-between gap-3 text-[13px]">
                      <div>
                        <div className="font-bold text-mint-700">Kunden-Rückrufnummer: {lead.clientContact}</div>
                        <div className="text-gray-700 mt-0.5">Wunschzeit & Nachricht: {lead.desiredTime}</div>
                      </div>
                      <a
                        href={`https://wa.me/${String(lead.clientContact).replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-mint-500 text-tinte font-extrabold"
                      >
                        Auf WhatsApp antworten ↗
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 1:1 Live-Cam & Top-Spot Bidding */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-tinte/20 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-glow-700 flex items-center gap-1.5">
                    <Radio size={14} /> 1:1 LIVE-Cam & Video-Call
                  </span>
                  <span className="text-[13px] font-bold text-mint-700">80 % Auszahlung</span>
                </div>
                <h3 className="text-lg font-bold text-tinte">Spontane 1:1 Video-Calls anbieten</h3>
                <p className="text-[13px] text-gray-600 leading-relaxed">
                  Schalte dich für diskrete 1:1 Live-Cam-Sessions frei. Besucher sehen auf deiner Karte das rote „Live-Cam verfügbar“-Signal.
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-[13px] text-gray-600 mb-1">Dein Tarif (CHF pro Minute)</label>
                    <input
                      type="number"
                      value={liveCamChfPerMin}
                      onChange={(e) => setLiveCamChfPerMin(Number(e.target.value))}
                      className="w-full rounded-xl bg-papier border border-tinte/25 px-3.5 py-2 text-sm text-tinte"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !liveCamActive;
                      setLiveCamActive(next);
                      updateServerState(
                        { liveCamActive: next, liveCamChfPerMin },
                        next ? `✓ 1:1 Live-Cam (CHF ${liveCamChfPerMin}/Min.) aktiviert!` : "⏸ 1:1 Live-Cam deaktiviert."
                      );
                    }}
                    className={`mt-5 px-5 py-2.5 rounded-xl font-extrabold text-[13px] cursor-pointer ${
 liveCamActive ? "bg-glow-500 text-white" : "bg-kirsche text-white"
 }`}
                  >
                    {liveCamActive ? "🔴 Live-Cam ist AN (Ausschalten)" : "1:1 Live-Cam einschalten"}
                  </button>
                </div>
              </div>

              <div className="bg-white border border-tinte/20 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-kirsche flex items-center gap-1.5">
                    <Star size={14} /> TOP-SPOT PLATZIERUNG ({city.toUpperCase()} / {canton})
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-kirsche/20 text-kirsche text-[13px] font-bold">
                    🎁 1. Monat Pilot-Bonus: CHF 0
                  </span>
                </div>
                <h3 className="text-lg font-bold text-tinte">Gesponserte Top-Platzierung in {city}</h3>
                <p className="text-[13px] text-gray-600 leading-relaxed">
                  Während der 30-tägigen Pilotphase kannst du dein Profil kostenlos für die oberen Plätze in {city} ({canton}) vormerken.
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-[13px] text-gray-600 mb-1">Tages-Gebot nach Gratismonat (CHF/Tag)</label>
                    <input
                      type="number"
                      value={topSpotBidChf}
                      onChange={(e) => setTopSpotBidChf(Number(e.target.value))}
                      className="w-full rounded-xl bg-papier border border-tinte/25 px-3.5 py-2 text-sm text-tinte"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateServerState(
                        { sponsored: true, topSpotBidChf },
                        `✓ Gratis-Pilot-Boost für ${city} (${canton}) aktiviert!`
                      )
                    }
                    className="mt-5 px-5 py-2.5 rounded-xl bg-kirsche hover:bg-kirsche-tief text-white font-extrabold text-[13px] cursor-pointer"
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