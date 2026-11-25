import React, { useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import LuxuryHeader from "@/components/LuxuryHeader";
import MobileBottomNav from "@/components/MobileBottomNav";
import PostcardProfileCard, { cleanPostcardName, getPostcardImage } from "@/components/PostcardProfileCard";
import harvestedData from "@/data/harvested-offers.json";

export default function PostcardProfileDetailPage() {
  const router = useRouter();
  const rawId = typeof router.query.id === "string" ? decodeURIComponent(router.query.id) : "";

  const allOffers: any[] = useMemo(() => {
    const d: any = harvestedData as any;
    return Array.isArray(d) ? d : d?.offers || d?.listings || [];
  }, []);

  const { profile, profileIdx } = useMemo(() => {
    if (!allOffers.length) return { profile: null, profileIdx: 0 };
    const idx = allOffers.findIndex(
      (o, i) =>
        String(o?.id || "") === rawId ||
        String(o?.dedupClusterId || "") === rawId ||
        `ch-${i}` === rawId ||
        String(i) === rawId
    );
    return idx >= 0
      ? { profile: allOffers[idx], profileIdx: idx }
      : { profile: allOffers[0], profileIdx: 0 };
  }, [allOffers, rawId]);

  const similarOffers = useMemo(() => {
    if (!profile) return [];
    const sameCity = allOffers.filter(
      (o) => o !== profile && String(o?.canton || "") === String(profile?.canton || "")
    );
    return (sameCity.length >= 4 ? sameCity : allOffers.filter((o) => o !== profile)).slice(0, 4);
  }, [allOffers, profile]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#FFF8F6] text-[#1E2433]">
        <LuxuryHeader />
        <main className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-black">Profil wird geladen…</h1>
          <Link href="/" className="inline-block mt-6 px-6 py-3 rounded-full bg-[#E11D48] text-white font-bold border-2 border-[#1E2433] shadow-[0_4px_0_#1E2433] no-underline">
            ← Zurück zur Übersicht
          </Link>
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  const displayName = cleanPostcardName(profile.rawName || profile.name || profile.title, profileIdx);
  const city = profile.city || "Zürich";
  const canton = profile.canton || "ZH";
  const rate60 = Math.max(150, Math.min(1800, Number(profile.advertisedBaseChf || profile.rate60Chf || profile.priceChf) || 300));
  const rate30 = Math.max(100, Number(profile.rate30Chf) || Math.round((rate60 * 0.6) / 10) * 10);
  const { imgSrc, fallbackImg } = getPostcardImage(profile, profileIdx);

  const galleryList: string[] = [];
  if (Array.isArray(profile.galleryUrls)) {
    for (const u of profile.galleryUrls) {
      if (typeof u === "string" && u.startsWith("http") && !u.includes("placeholder")) {
        galleryList.push(u.trim().replace(/[?&]iwsn_clean=1.*$/i, ""));
      }
    }
  }

  const rawPhone = String(profile.rawPhone || profile.phone || profile.unlockedPhone || "").trim();
  const cleanWa = rawPhone.replace(/[^0-9+]/g, "").replace(/^00/, "+").replace(/^0([1-9])/, "+41$1");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFE4E9] via-[#F8FAFC] to-[#E0F2FE] text-[#1E2433]">
      <Head>
        <title>{displayName} in {city} ({canton}) — iwantsexnow.ch</title>
      </Head>

      <LuxuryHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-[#1E2433] text-xs font-extrabold text-[#1E2433] shadow-[0_3px_0_#1E2433] hover:-translate-y-0.5 transition no-underline mb-8"
        >
          ← Zurück zu allen Schweizer Profilen
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Linke Spalte: Grosse gestempelte Polaroid-Postkarte */}
          <div className="lg:col-span-5 space-y-5">
            <div className="relative bg-[#FFFDF9] rounded-[28px] border-2 border-[#1E2433] p-3.5 shadow-[0_10px_0_#1E2433]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#FDE68A] border border-[#1E2433]/30 rotate-[-2deg] rounded-sm z-10" />
              <div className="relative aspect-[3/4] overflow-hidden rounded-[20px] bg-[#F4EFE6] border border-[#1E2433]/20">
                <img
                  referrerPolicy="no-referrer"
                  src={imgSrc}
                  alt={displayName}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = fallbackImg;
                  }}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#CCFBF1] text-[#0F5132] border-2 border-[#1E2433] text-xs font-extrabold">
                  ● Heute frei in {city}
                </div>
              </div>
              <div className="pt-3 pb-1 px-2 flex items-center justify-between">
                <span className="font-serif italic text-lg text-[#1E2433]">Gruss aus {city} ♥</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E0F2FE] border border-[#1E2433] text-xs font-extrabold">
                  Kanton {canton}
                </span>
              </div>
            </div>

            {galleryList.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {galleryList.slice(1, 4).map((gUrl, i) => (
                  <div key={i} className="bg-white p-1.5 rounded-2xl border-2 border-[#1E2433] shadow-[0_4px_0_#1E2433]">
                    <div className="aspect-[3/4] overflow-hidden rounded-xl">
                      <img
                        referrerPolicy="no-referrer"
                        src={`/api/img?s=${i + 10}&u=${encodeURIComponent(gUrl)}`}
                        alt={`${displayName} ${i + 2}`}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = fallbackImg;
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rechte Spalte: Notizblock-Steckbrief & Direktkontakt im selben Look wie der Suchkasten oben */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative bg-white rounded-[28px] border-2 border-[#1E2433] p-6 sm:p-8 shadow-[0_10px_0_#1E2433] space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-[#FCE7F3] border border-[#1E2433] text-xs font-extrabold mb-2">
                    📍 {city} ({canton}) · {profile.rubric || profile.category || "Escort & Massage"}
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black text-[#1E2433] leading-tight">
                    {displayName}
                  </h1>
                </div>

                <div className="px-4 py-2.5 rounded-2xl bg-[#FEF08A] border-2 border-[#1E2433] shadow-[0_4px_0_#1E2433] text-right">
                  <div className="text-[11px] font-extrabold uppercase text-[#1E2433]/75">Richtpreis 60 Min.</div>
                  <div className="text-2xl font-black text-[#1E2433]">CHF {rate60}</div>
                </div>
              </div>

              {/* Freundliche Tarif-Kärtchen */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#F0FDF4] border-2 border-[#1E2433]">
                  <div className="text-xs font-bold text-[#1E2433]/70">Kurzes Treffen (30m)</div>
                  <div className="text-lg font-black text-[#1E2433]">ab CHF {rate30}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FEF9C3] border-2 border-[#1E2433]">
                  <div className="text-xs font-bold text-[#1E2433]/70">Volle Stunde (60m)</div>
                  <div className="text-lg font-black text-[#1E2433]">ab CHF {rate60}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#E0F2FE] border-2 border-[#1E2433] col-span-2 sm:col-span-1">
                  <div className="text-xs font-bold text-[#1E2433]/70">Vermittlung</div>
                  <div className="text-lg font-black text-[#0F766E]">0% Aufpreis</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#1E2433]/20 text-sm leading-relaxed text-[#334155]">
                {profile.description ||
                  `${displayName} empfängt oder besucht dich im Raum ${city} (${canton}). Direkter Kontakt ohne Zwischenhändler – sprich Zeitpunkt, Wünsche und Honorar einfach kurz direkt ab.`}
              </div>

              {/* Grosse rote & weisse Direkt-Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                {rawPhone ? (
                  <>
                    <a
                      href={`https://wa.me/${cleanWa.replace("+", "")}?text=${encodeURIComponent(`Hoi ${displayName}, ich habe dein Profil auf iwantsexnow.ch gesehen und wollte fragen, ob du heute in ${city} Zeit hast?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[210px] py-4 px-6 rounded-full bg-[#E11D48] hover:bg-[#BE123C] text-white border-2 border-[#1E2433] font-black text-sm text-center shadow-[0_5px_0_#1E2433] no-underline transition"
                    >
                      💬 Direkt per WhatsApp ({rawPhone})
                    </a>
                    <a
                      href={`tel:${cleanWa}`}
                      className="py-4 px-6 rounded-full bg-white hover:bg-[#FEF08A] text-[#1E2433] border-2 border-[#1E2433] font-black text-sm text-center shadow-[0_5px_0_#1E2433] no-underline transition"
                    >
                      📞 Anrufen
                    </a>
                  </>
                ) : profile.sourceUrl ? (
                  <a
                    href={profile.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-4 px-6 rounded-full bg-[#E11D48] hover:bg-[#BE123C] text-white border-2 border-[#1E2433] font-black text-sm text-center shadow-[0_5px_0_#1E2433] no-underline transition"
                  >
                    Original-Inserat & Nummer öffnen ↗
                  </a>
                ) : null}
              </div>

              <div className="pt-3 border-t border-[#1E2433]/15 flex flex-wrap items-center justify-between gap-2 text-xs text-[#64748B]">
                <span>Ist das dein eigenes Inserat?</span>
                <Link href="/advertise" className="font-extrabold text-[#E11D48] hover:underline">
                  Profil kostenlos selbst verwalten oder anpassen →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Weitere passende Postkarten aus demselben Kanton */}
        {similarOffers.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-black text-[#1E2433] mb-5">
              Weitere Profile in {city} & Umgebung
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {similarOffers.map((sim, idx) => (
                <PostcardProfileCard key={sim.id || idx} offer={sim} idx={idx + 4} />
              ))}
            </div>
          </section>
        )}
      </main>

      <MobileBottomNav />
    </div>
  );
}