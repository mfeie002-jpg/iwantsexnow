import React, { useEffect, useMemo, useState } from "react";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { SwissDoorplate } from "@/components/SwissDoorplate";
import offersData from "@/data/harvested-offers.json";
import {
  MapPin,
  Lock,
  Heart,
  Scale,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Phone,
  MessageCircle,
  ExternalLink,
  Video,
} from "lucide-react";

const FALLBACK_IMAGE = "/images/escort-portrait-1.jpg";

function normalizeSwissPhone(raw: any): string | null {
  const digits = String(raw || "").replace(/\D/g, "");
  if (!digits) return null;

  let local = "";
  if (digits.startsWith("41") && digits.length === 11) {
    local = "0" + digits.slice(2);
  } else if (digits.startsWith("0041") && digits.length === 13) {
    local = "0" + digits.slice(4);
  } else if (digits.startsWith("0") && digits.length === 10) {
    local = digits;
  } else {
    return null;
  }

  if (/(\d)\1{5,}|123456/.test(local)) return null;

  return (
    "+41 " +
    local.slice(1, 3) +
    " " +
    local.slice(3, 6) +
    " " +
    local.slice(6, 8) +
    " " +
    local.slice(8, 10)
  );
}

function suiteNumber(value: string) {
  let score = 0;
  for (let index = 0; index < value.length; index += 1) {
    score = (score + value.charCodeAt(index) * (index + 3)) % 799;
  }
  return String(score + 101);
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const rawId = String(ctx.params?.id || "").trim();
  const allOffers = (offersData as any[]) || [];

  const found =
    allOffers.find(
      (o) => String(o.id || o.dedupClusterId) === rawId
    ) ||
    allOffers.find(
      (o) =>
        String(o.id || o.dedupClusterId || "").toLowerCase() === rawId.toLowerCase()
    );

  if (!found) {
    return { notFound: true };
  }

  const pid = String(
    found.id || found.dedupClusterId || rawId
  );
  const r60 = Math.max(
    100,
    Math.min(
      1200,
      Number(found.advertisedBaseChf) || 350
    )
  );
  const r30 = Math.max(
    80,
    Math.min(
      800,
      Number(found.rate30Chf) ||
        Math.round((r60 * 0.6) / 10) * 10
    )
  );
  const cleanPhone = normalizeSwissPhone(
    found.rawPhone || found.phone
  );

  const related = allOffers
    .filter(
      (o) =>
        (o.id || o.dedupClusterId) !== pid &&
        o.canton === found.canton
    )
    .slice(0, 4)
    .map((o) => ({
      id: o.id || o.dedupClusterId,
      rawName: o.rawName || "Verifiziertes Profil",
      city: o.city || "Zürich",
      canton: o.canton || "ZH",
      rate60Chf: Math.max(
        100,
        Math.min(
          1200,
          Number(o.advertisedBaseChf) || 350
        )
      ),
      thumbnail: o.thumbnail || FALLBACK_IMAGE,
      age: Number(o.age) || 25,
    }));

  return {
    props: {
      profile: {
        ...found,
        id: pid,
        rawName:
          found.rawName || "Verifiziertes Schweizer Profil",
        city: found.city || "Zug",
        canton: found.canton || "ZG",
        rate60Chf: r60,
        rate30Chf: r30,
        cleanPhone,
        thumbnail: found.thumbnail || FALLBACK_IMAGE,
        age: Number(found.age) || 25,
        heightCm: Number(found.heightCm) || 168,
        cupSize: found.cupSize || "C",
        hairColor: found.hairColor || "Brünett",
        includedTags: Array.isArray(found.includedTags)
          ? found.includedTags
          : [
              "Direktkontakt",
              "Diskreter Empfang",
              "Girlfriend Experience",
            ],
      },
      relatedProfiles: related,
    },
  };
};

export default function ProfileDetailPage({
  profile,
  relatedProfiles,
}: any) {
  const [liveState, setLiveState] = useState<any>({});
  const [isFav, setIsFav] = useState(false);
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  useEffect(() => {
    fetch("/api/vault/metrics")
      .then((r) => r.json())
      .then((d) => {
        if (d?.states && d.states[profile.id]) {
          setLiveState(d.states[profile.id]);
        }
      })
      .catch(() => {});

    try {
      const favs = JSON.parse(
        localStorage.getItem("ch_favorite_profiles") || "[]"
      );
      setIsFav(
        Array.isArray(favs) && favs.includes(profile.id)
      );

      const unlocked = JSON.parse(
        localStorage.getItem("ch_unlocked_vaults") || "[]"
      );
      setVaultUnlocked(
        Array.isArray(unlocked) && unlocked.includes(profile.id)
      );
    } catch {}

    setSelectedPhoto(0);
  }, [profile.id]);

  const toggleFav = () => {
    try {
      const favs = JSON.parse(
        localStorage.getItem("ch_favorite_profiles") || "[]"
      );
      const list = Array.isArray(favs) ? favs : [];
      const next = list.includes(profile.id)
        ? list.filter((x: string) => x !== profile.id)
        : [profile.id, ...list];

      localStorage.setItem(
        "ch_favorite_profiles",
        JSON.stringify(next)
      );
      setIsFav(next.includes(profile.id));
      window.dispatchEvent(new Event("ch-favorites-updated"));
    } catch {}
  };

  const rate60 = Math.max(
    100,
    Math.min(
      1200,
      Number(liveState.rate60Chf || profile.rate60Chf) || 350
    )
  );
  const rate30 = Math.max(
    80,
    Math.min(
      800,
      Number(liveState.rate30Chf || profile.rate30Chf) ||
        Math.round((rate60 * 0.6) / 10) * 10
    )
  );
  const rate120 = Math.round((rate60 * 1.85) / 10) * 10;
  const cleanPhone = normalizeSwissPhone(
    liveState.phoneDisplay ||
      profile.cleanPhone ||
      profile.rawPhone
  );
  const isAvailable4h = Boolean(
    liveState.availabilityConfirmed ||
      profile.availabilityConfirmed
  );
  const isVerified = Boolean(
    liveState.identityVerified || profile.identityVerified
  );
  const vaultPriceChf = Number(
    liveState.vaultPriceChf || 29
  );

  const galleryPhotos: string[] = useMemo(() => {
    const custom: string[] = Array.isArray(
      liveState.customPhotos
    )
      ? liveState.customPhotos.filter(
          (photo: any) => typeof photo === "string"
        )
      : [];

    const base: string[] = [
      profile.thumbnail || FALLBACK_IMAGE,
      ...custom,
      "/images/escort-portrait-2.jpg",
      "/images/escort-portrait-3.jpg",
    ];

    return Array.from(new Set(base.filter(Boolean))).slice(0, 6);
  }, [profile.thumbnail, liveState.customPhotos]);

  const safePhotoIndex = Math.min(
    selectedPhoto,
    Math.max(0, galleryPhotos.length - 1)
  );
  const mainPhoto =
    galleryPhotos[safePhotoIndex] || FALLBACK_IMAGE;

  const sourceRows = useMemo(() => {
    const collections = [
      profile.sourceComparisons,
      profile.portalSources,
      profile.sources,
    ];
    const collection = collections.find((entry) =>
      Array.isArray(entry)
    );

    const rows = Array.isArray(collection)
      ? collection.map((source: any, index: number) => {
          if (typeof source === "string") {
            return {
              id: "source-" + index,
              name: source,
              rate: null,
              url: "",
              status: "Indexquelle",
            };
          }

          const numericRate = Number(
            source?.rate60Chf ||
              source?.advertisedBaseChf ||
              source?.price60 ||
              source?.price
          );

          return {
            id: String(source?.id || source?.url || index),
            name: String(
              source?.sourcePortal ||
                source?.portal ||
                source?.name ||
                "Portal " + (index + 1)
            ),
            rate:
              Number.isFinite(numericRate) && numericRate > 0
                ? numericRate
                : null,
            url: String(
              source?.sourceUrl ||
                source?.originalUrl ||
                source?.url ||
                ""
            ),
            status: String(
              source?.status || "Übermittelter Quelleintrag"
            ),
          };
        })
      : [];

    if (rows.length === 0) {
      rows.push({
        id: "current-index",
        name: String(
          profile.sourcePortal || "CH-Direktindex"
        ),
        rate: rate60,
        url: String(
          profile.sourceUrl || profile.originalUrl || ""
        ),
        status: "Aktuell harmonisierter Indexeintrag",
      });
    }

    return rows.slice(0, 6);
  }, [profile, rate60]);

  const checkoutHref =
    "/checkout?profileId=" +
    encodeURIComponent(profile.id) +
    "&amount=" +
    vaultPriceChf;
  const previewHref =
    "/fantasy-preview?id=" + encodeURIComponent(profile.id);
  const cityHref =
    "/orte/" +
    String(profile.city || "zug").toLowerCase();
  const phoneHref = cleanPhone
    ? "tel:" + cleanPhone.replace(/\s+/g, "")
    : "";
  const whatsAppHref = cleanPhone
    ? "https://wa.me/" + cleanPhone.replace(/\D/g, "")
    : "";
  const relatedList = Array.isArray(relatedProfiles)
    ? relatedProfiles
    : [];
  const tags = Array.isArray(profile.includedTags)
    ? profile.includedTags
    : [];
  const suite = suiteNumber(String(profile.id));

  return (
    <div className="penthouse-page min-h-screen pb-52 text-[#F2EADF] lg:pb-16">
      <SEO
        title={
          profile.rawName +
          " in " +
          profile.city +
          " (" +
          profile.canton +
          ") · CHF " +
          rate60 +
          ".– / 60m | iwantsexnow.ch"
        }
        description={
          profile.rawName +
          " (" +
          profile.age +
          " J., " +
          profile.heightCm +
          " cm, Cup " +
          profile.cupSize +
          ") in " +
          profile.city +
          " (" +
          profile.canton +
          "). Honorar: CHF " +
          rate60 +
          ".– / 60 Min."
        }
        url={
          "https://iwantsexnow.ch/profile/" +
          encodeURIComponent(profile.id)
        }
        image={profile.thumbnail}
      />

      <LuxuryHeader />

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#7D7265]">
            <Link
              href="/search"
              className="group inline-flex min-h-[34px] items-center gap-1.5 transition hover:text-[#DEC393]"
            >
              <ArrowLeft
                size={13}
                className="transition-transform group-hover:-translate-x-1"
              />
              Zurück zur Suche
            </Link>
            <span className="text-[#4E453C]">/</span>
            <Link
              href={cityHref}
              className="font-mono uppercase tracking-[0.08em] text-[#C8A97E]"
            >
              {profile.canton} · {profile.city}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleFav}
              className={
                isFav
                  ? "inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-full border border-[#DEC393]/45 bg-[#C8A97E]/10 px-3.5 text-[10px] text-[#DEC393]"
                  : "ghost-button inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-[10px]"
              }
            >
              <Heart
                size={13}
                className={isFav ? "fill-[#DEC393]" : ""}
              />
              {isFav ? "Gespeichert" : "Merken"}
            </button>

            <Link
              href="/compare-escorts"
              className="ghost-button inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-3.5 text-[10px]"
            >
              <Scale size={13} className="text-[#C8A97E]" />
              Vergleichen
            </Link>
          </div>
        </div>

        <section className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="min-w-0 lg:col-span-7">
            <div className="noir-stage group aspect-[3/4] rounded-[20px] border border-[#C8A97E]/35 shadow-[0_30px_90px_rgba(0,0,0,0.48)] sm:aspect-[4/5]">
              <img
                referrerPolicy="no-referrer"
                src={mainPhoto}
                alt={String(profile.rawName)}
                onError={(e) => {
                  const image =
                    e.currentTarget as HTMLImageElement;
                  if (!image.src.endsWith(FALLBACK_IMAGE)) {
                    image.src = FALLBACK_IMAGE;
                  }
                }}
                className="noir-media scale-[1.06] object-cover object-top"
              />
              <div className="noir-vignette" />
              <div className="noir-floor opacity-60" />

              <div className="absolute left-4 top-4 z-10 max-w-[80%]">
                <SwissDoorplate
                  state={isAvailable4h ? "FREI" : "EXTERN"}
                  roomNumber={"SUITE " + suite}
                  customLabel={
                    isAvailable4h ? "FREI · 4H LIVE" : "INDEX / EXTERN"
                  }
                  size="lg"
                />
              </div>

              <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
                <span className="price-pill text-[9px]">
                  {String(safePhotoIndex + 1).padStart(2, "0")} /{" "}
                  {String(galleryPhotos.length).padStart(2, "0")}
                </span>
                {isVerified && (
                  <span className="luxury-badge">
                    <ShieldCheck size={10} />
                    Geprüft
                  </span>
                )}
              </div>

              <div className="price-pill absolute bottom-4 right-4 z-10 text-xs">
                CHF {rate60}.– <span className="text-[8px]">/ 60M</span>
              </div>
            </div>

            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
              {galleryPhotos.map((photo, index) => {
                const active = safePhotoIndex === index;
                const thumbClass = active
                  ? "noir-stage relative h-24 w-[74px] shrink-0 cursor-pointer overflow-hidden rounded-[7px] border border-[#DEC393]"
                  : "noir-stage relative h-24 w-[74px] shrink-0 cursor-pointer overflow-hidden rounded-[7px] border border-white/10 opacity-55 transition hover:opacity-90";

                return (
                  <button
                    key={photo + "-" + index}
                    type="button"
                    onClick={() => setSelectedPhoto(index)}
                    className={thumbClass}
                    aria-label={"Bild " + (index + 1) + " anzeigen"}
                  >
                    <img
                      referrerPolicy="no-referrer"
                      src={photo}
                      alt=""
                      loading="lazy"
                      onError={(e) => {
                        const image =
                          e.currentTarget as HTMLImageElement;
                        if (!image.src.endsWith(FALLBACK_IMAGE)) {
                          image.src = FALLBACK_IMAGE;
                        }
                      }}
                      className="noir-media scale-[1.06] object-cover object-top"
                    />
                    <div className="noir-vignette opacity-60" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="min-w-0 space-y-5 lg:col-span-5">
            <section className="dossier-panel rounded-[16px] p-5 sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <div className="font-mono text-[8px] uppercase tracking-[0.23em] text-[#C8A97E]">
                  Dossier privé · {suite}
                </div>
                <span className="font-mono text-[8px] tabular-nums text-[#665C50]">
                  ID {String(profile.id).slice(0, 18)}
                </span>
              </div>

              <div className="mt-5 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[#B9A585]">
                <MapPin size={13} className="text-[#C8A97E]" />
                Kanton {profile.canton} · {profile.city}
              </div>

              <h1 className="mt-3 break-words font-serif text-[29px] font-normal leading-[1.14] tracking-[0.012em] text-[#F3EADC] sm:text-[38px]">
                {profile.rawName}
              </h1>

              <div className="mt-3 flex items-center gap-3 text-[#B38E52]">
                <span className="h-px w-10 bg-[#B38E52]/55" />
                <span className="text-[8px]">✦</span>
                <span className="h-px w-10 bg-[#B38E52]/55" />
              </div>

              <p className="mt-4 text-[10px] font-light leading-6 text-[#95897A]">
                {profile.age} Jahre · {profile.heightCm} cm · Cup{" "}
                {profile.cupSize} · {profile.hairColor}
              </p>

              <div className="mt-6 overflow-hidden rounded-[8px] border border-[#C8A97E]/20 bg-black/20">
                <table className="honorar-table">
                  <thead>
                    <tr>
                      <th>Schweizer Honorar-Tafel</th>
                      <th className="text-right">Tarif</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="text-[#C7BAA9]">
                          30 Min. Express
                        </div>
                        <div className="mt-1 text-[8px] text-[#6F6559]">
                          Richtwert / Kennenlernen
                        </div>
                      </td>
                      <td className="text-right font-mono text-base tabular-nums text-[#CDBFA9]">
                        CHF {rate30}.–
                      </td>
                    </tr>
                    <tr className="featured-rate">
                      <td>
                        <div className="text-[#DEC393]">
                          60 Min. Standard
                        </div>
                        <div className="mt-1 text-[8px] text-[#8E7957]">
                          Empfohlener Direkttarif
                        </div>
                      </td>
                      <td className="text-right font-mono text-xl tabular-nums text-[#DEC393]">
                        CHF {rate60}.–
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="text-[#C7BAA9]">
                          2 Std. Dinner / Outcall
                        </div>
                        <div className="mt-1 text-[8px] text-[#6F6559]">
                          Geschätzter Richtwert nach Vereinbarung
                        </div>
                      </td>
                      <td className="text-right font-mono text-base tabular-nums text-[#CDBFA9]">
                        CHF {rate120}.–
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-5 rounded-[9px] border border-[#10B981]/20 bg-[#0D291E]/45 p-4">
                <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#91B7A3]">
                  Direkter Schweizer +41 Kontakt · 0% Provision
                </div>
                <div className="mt-2 break-words font-mono text-[13px] tabular-nums text-[#E0D7C9]">
                  {cleanPhone ||
                    "Diskrete Termin-Anfrage über Direkt-Messenger"}
                </div>

                <div className="mt-4 hidden grid-cols-2 gap-2 sm:grid">
                  {cleanPhone ? (
                    <>
                      <a
                        href={phoneHref}
                        className="ghost-button inline-flex min-h-[45px] items-center justify-center gap-2 rounded-full px-3 text-[10px]"
                      >
                        <Phone size={13} />
                        Direkt anrufen
                      </a>
                      <a
                        href={whatsAppHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="emerald-button inline-flex min-h-[45px] items-center justify-center gap-2 rounded-full px-3 text-[10px]"
                      >
                        <MessageCircle size={13} />
                        WhatsApp
                      </a>
                    </>
                  ) : (
                    <Link
                      href={
                        "/messages?profileId=" +
                        encodeURIComponent(profile.id)
                      }
                      className="emerald-button col-span-2 inline-flex min-h-[45px] items-center justify-center gap-2 rounded-full px-3 text-[10px]"
                    >
                      <MessageCircle size={13} />
                      Diskrete Termin-Anfrage
                    </Link>
                  )}
                </div>
              </div>

              <p className="mt-5 whitespace-pre-line font-serif text-[15px] font-normal leading-7 text-[#BDB1A1]">
                {profile.bio ||
                  "Unabhängiges Schweizer Profil in " +
                    profile.city +
                    " (" +
                    profile.canton +
                    "). Diskreter Empfang nach Vereinbarung oder Hotelbesuch (Outcall). Bitte Verfügbarkeit, Ort und Honorar vor dem Treffen persönlich bestätigen."}
              </p>

              {tags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2 border-t border-white/[0.06] pt-5">
                  {tags.slice(0, 10).map((tag: any, index: number) => (
                    <span
                      key={String(tag) + "-" + index}
                      className="luxury-badge normal-case tracking-normal"
                    >
                      {String(tag)}
                    </span>
                  ))}
                </div>
              )}
            </section>

            <Link
              href={previewHref}
              className="group dossier-panel flex items-center justify-between gap-4 rounded-[12px] p-5 transition hover:border-[#DEC393]/55"
            >
              <div className="flex items-center gap-3">
                <span className="brass-button flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                  <Sparkles size={16} className="relative z-[1]" />
                </span>
                <div>
                  <div className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#C8A97E]">
                    Lizenzierte KI-Interpretation
                  </div>
                  <div className="mt-1 font-serif text-base text-[#E4D8C7]">
                    Voice-Avatar & 5s Preview
                  </div>
                </div>
              </div>
              <ArrowRight
                size={15}
                className="shrink-0 text-[#C8A97E] transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </section>

        <section className="mt-7 grid gap-5 lg:grid-cols-2">
          <div className="dossier-panel overflow-hidden rounded-[14px]">
            <div className="border-b border-[#C8A97E]/15 p-5">
              <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#C8A97E]">
                Multi-Portal-Quellenvergleich
              </div>
              <h2 className="mt-2 font-serif text-xl font-normal text-[#E7DCCB]">
                Herkunft statt Hörensagen.
              </h2>
              <p className="mt-2 text-[10px] font-light leading-5 text-[#817567]">
                Angezeigt werden ausschliesslich übermittelte Quellen- und
                Tarifdaten. Keine erfundenen Live-Preise.
              </p>
            </div>

            <div className="overflow-x-auto px-3">
              <table className="source-table min-w-[480px]">
                <thead>
                  <tr>
                    <th>Quelle</th>
                    <th>Status</th>
                    <th className="text-right">60 Min.</th>
                    <th className="text-right">Link</th>
                  </tr>
                </thead>
                <tbody>
                  {sourceRows.map((source: any) => (
                    <tr key={source.id}>
                      <td className="font-medium text-[#D4C6B2]">
                        {source.name}
                      </td>
                      <td className="text-[#817567]">
                        {source.status}
                      </td>
                      <td className="text-right font-mono tabular-nums text-[#DEC393]">
                        {source.rate
                          ? "CHF " + source.rate + ".–"
                          : "—"}
                      </td>
                      <td className="text-right">
                        {source.url.startsWith("http") ? (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            referrerPolicy="no-referrer"
                            className="inline-flex items-center gap-1 text-[#C8A97E] hover:text-[#DEC393]"
                          >
                            Quelle
                            <ExternalLink size={10} />
                          </a>
                        ) : (
                          <span className="text-[#5F564C]">Index</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {sourceRows.length < 2 && (
              <div className="border-t border-white/[0.05] px-5 py-3 text-[9px] text-[#6D6357]">
                Aktuell liegt nur eine verwertbare Quelle vor. Weitere
                Portale erscheinen erst nach Datenabgleich.
              </div>
            )}
          </div>

          <div className="dossier-panel flex flex-col justify-between rounded-[14px] p-5 sm:p-6">
            <div>
              <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.15em] text-[#C8A97E]">
                <Lock size={13} />
                Paid Vault · 80/20 Creator-Lizenz
              </div>
              <h2 className="mt-3 font-serif text-2xl font-normal text-[#E9DDCB]">
                {vaultUnlocked
                  ? "Ihr privater Tresor ist geöffnet."
                  : "Private Galerie. Transparente Aufteilung."}
              </h2>
              <p className="mt-3 max-w-lg text-[11px] font-light leading-6 text-[#8B7F70]">
                {vaultUnlocked
                  ? "Der Tresor ist auf diesem Gerät freigeschaltet."
                  : "CHF " +
                    (vaultPriceChf * 0.8).toFixed(2) +
                    " von CHF " +
                    vaultPriceChf +
                    ".– gehen direkt an " +
                    profile.rawName +
                    ". Die verbleibenden 20% decken Plattform und Betrieb."}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#C8A97E]/15 pt-5">
              <div>
                <div className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#786B5B]">
                  Einmaliger Zugang
                </div>
                <div className="mt-1 font-mono text-2xl tabular-nums text-[#DEC393]">
                  CHF {vaultPriceChf}.–
                </div>
              </div>
              <Link
                href={checkoutHref}
                className="brass-button inline-flex min-h-[45px] items-center gap-2 rounded-full px-5 text-[10px] uppercase tracking-[0.06em]"
              >
                <Lock size={13} className="relative z-[1]" />
                <span className="relative z-[1]">
                  {vaultUnlocked ? "Tresor ansehen" : "Vault öffnen"}
                </span>
                <ArrowRight size={13} className="relative z-[1]" />
              </Link>
            </div>
          </div>
        </section>

        {relatedList.length > 0 && (
          <section className="mt-10">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#C8A97E]">
                  Kanton {profile.canton}
                </div>
                <h2 className="mt-1 font-serif text-2xl font-normal text-[#E8DCCB]">
                  Weitere Suiten in der Nähe
                </h2>
              </div>
              <Link
                href="/search"
                className="text-[10px] text-[#C8A97E] hover:text-[#DEC393]"
              >
                Alle ansehen →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
              {relatedList.map((related: any) => (
                <Link
                  key={related.id}
                  href={
                    "/profile/" + encodeURIComponent(related.id)
                  }
                  className="valentina-card group block overflow-hidden"
                >
                  <div className="noir-stage aspect-[3/4]">
                    <img
                      referrerPolicy="no-referrer"
                      src={related.thumbnail || FALLBACK_IMAGE}
                      alt={String(related.rawName)}
                      loading="lazy"
                      onError={(e) => {
                        const image =
                          e.currentTarget as HTMLImageElement;
                        if (!image.src.endsWith(FALLBACK_IMAGE)) {
                          image.src = FALLBACK_IMAGE;
                        }
                      }}
                      className="noir-media scale-[1.06] object-cover object-top"
                    />
                    <div className="noir-vignette" />
                    <div className="noir-floor" />
                    <div className="absolute inset-x-0 bottom-0 z-[4] p-3 text-center">
                      <div className="font-mono text-[7px] uppercase tracking-[0.1em] text-[#B5A184]">
                        {related.city} · {related.canton}
                      </div>
                      <div className="dossier-name mt-1 font-serif text-base text-[#F0E5D4]">
                        {related.rawName}
                      </div>
                      <div className="mt-2 font-mono text-sm tabular-nums text-[#DEC393]">
                        CHF {related.rate60Chf}.–
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <div className="profile-mobile-cta fixed inset-x-0 z-40 border-t border-[#C8A97E]/25 px-3 py-2.5 lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-2">
          <div className="hidden min-w-0 flex-1 sm:block">
            <div className="truncate font-serif text-xs text-[#E9DDCB]">
              {profile.rawName}
            </div>
            <div className="mt-1 font-mono text-[8px] tabular-nums text-[#C8A97E]">
              CHF {rate60}.– / 60M · CHF {rate30}.– / 30M
            </div>
          </div>

          {cleanPhone ? (
            <>
              <a
                href={phoneHref}
                className="ghost-button flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full"
                aria-label="Direkt anrufen"
              >
                <Phone size={15} />
              </a>
              <a
                href={whatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                className="emerald-button inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full px-3 text-[10px]"
              >
                <MessageCircle size={14} />
                WhatsApp
              </a>
            </>
          ) : (
            <Link
              href={
                "/messages?profileId=" +
                encodeURIComponent(profile.id)
              }
              className="emerald-button inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full px-3 text-[10px]"
            >
              <MessageCircle size={14} />
              Anfrage
            </Link>
          )}

          <Link
            href={previewHref}
            className="ghost-button flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full text-[#C8A97E]"
            aria-label="Voice-Avatar und Video-Preview"
          >
            <Video size={15} />
          </Link>

          <Link
            href={checkoutHref}
            className="brass-button inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[9px] uppercase"
          >
            <Lock size={12} className="relative z-[1]" />
            <span className="relative z-[1]">Vault 80%</span>
          </Link>
        </div>
      </div>
    </div>
  );
}