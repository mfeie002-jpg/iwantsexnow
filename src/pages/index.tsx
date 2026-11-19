import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import offersData from "@/data/harvested-offers.json";
import clubsData from "@/data/swiss-establishments-vault.json";

const TOTAL_CLUBS = Array.isArray(clubsData) && clubsData.length > 0 ? clubsData.length : 108;
const OFFERS: any[] = Array.isArray(offersData) ? (offersData as any[]) : [];
const TOTAL_PROFILES = OFFERS.length;
const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");

/* A number shared by several listings belongs to a portal or an agency, not to one person. */
const PHONE_COUNTS: Record<string, number> = (() => {
  const m: Record<string, number> = {};
  for (const o of OFFERS) {
    const d = String(o?.rawPhone || "").replace(/\D/g, "");
    if (d) m[d] = (m[d] || 0) + 1;
  }
  return m;
})();

const CANTON_COUNTS: Record<string, number> = (() => {
  const m: Record<string, number> = {};
  for (const o of OFFERS) {
    const c = String(o?.canton || "").toUpperCase();
    if (c) m[c] = (m[c] || 0) + 1;
  }
  return m;
})();

const PLACES = [
  { code: "ALL", label: "Ganze Schweiz" },
  { code: "ZH", label: "Zürich" },
  { code: "ZG", label: "Zug" },
  { code: "LU", label: "Luzern" },
  { code: "BS", label: "Basel" },
  { code: "BE", label: "Bern" },
  { code: "AG", label: "Aargau" },
  { code: "SG", label: "St. Gallen" },
  { code: "GE", label: "Genève" },
  { code: "VD", label: "Lausanne" },
  { code: "TI", label: "Lugano" },
];

const KINDS = [
  { id: "ALL", label: "Alle" },
  { id: "female", label: "Escort & GFE" },
  { id: "massage", label: "Tantra & Massage" },
  { id: "bdsm", label: "Domina & BDSM" },
  { id: "trans", label: "Trans" },
];

const WHEN = [
  { id: "now", label: "Jetzt" },
  { id: "any", label: "Egal wann" },
];

const CITY_PLATES = [
  { href: "/escort-zurich", code: "ZH", city: "Zürich" },
  { href: "/orte/zug", code: "ZG", city: "Zug und Baar" },
  { href: "/orte/luzern", code: "LU", city: "Luzern" },
  { href: "/escort-basel", code: "BS", city: "Basel" },
  { href: "/escort-bern", code: "BE", city: "Bern" },
  { href: "/orte/baden", code: "AG", city: "Baden und Aargau" },
  { href: "/orte/st-gallen", code: "SG", city: "St. Gallen" },
  { href: "/escort-geneva", code: "GE", city: "Genève" },
  { href: "/orte/lausanne", code: "VD", city: "Lausanne" },
  { href: "/escort-lugano", code: "TI", city: "Lugano" },
];

function kindLabel(rubric: string) {
  if (rubric === "massage") return "Tantra & Massage";
  if (rubric === "bdsm") return "Domina & BDSM";
  if (rubric === "trans") return "Trans";
  return "Escort & GFE";
}

const PLACEHOLDERS = [
  "radial-gradient(circle at 66% 30%, rgba(232,201,138,0.55) 0%, rgba(232,201,138,0) 24%), radial-gradient(ellipse 95% 38% at 50% 112%, #150810 0%, #150810 62%, rgba(21,8,16,0) 63%), linear-gradient(165deg, #3a1325 0%, #d6165f 135%)",
  "radial-gradient(circle at 34% 32%, rgba(232,201,138,0.6) 0%, rgba(232,201,138,0) 26%), radial-gradient(ellipse 95% 38% at 50% 112%, #150810 0%, #150810 62%, rgba(21,8,16,0) 63%), linear-gradient(200deg, #e8c98a -40%, #3a1325 70%)",
  "radial-gradient(circle at 56% 26%, rgba(232,201,138,0.5) 0%, rgba(232,201,138,0) 24%), radial-gradient(ellipse 95% 38% at 50% 112%, #150810 0%, #150810 62%, rgba(21,8,16,0) 63%), linear-gradient(150deg, #22101a 0%, #ee3c7c 140%)",
];

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={"chip min-h-[44px] cursor-pointer px-[18px] text-[16px] " + (active ? "is-active" : "")}>
      {children}
    </button>
  );
}

function Step({ n, q, children }: { n: string; q: string; children: React.ReactNode }) {
  return (
    <fieldset className="m-0 flex gap-[18px] border-0 p-0">
      <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold font-display text-[22px] leading-none text-gold">
        {n}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <legend className="p-0 font-display text-[28px] leading-[1.15] text-ink">{q}</legend>
        <div className="flex flex-wrap gap-2">{children}</div>
      </div>
    </fieldset>
  );
}

function Check() {
  return (
    <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-jade">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5fd3a5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12l5 5L20 7" />
      </svg>
    </span>
  );
}

export default function HomePage() {
  const [serverStates, setServerStates] = useState<Record<string, any>>({});
  const [blockedIds, setBlockedIds] = useState<string[]>([]);
  const [favIds, setFavIds] = useState<string[]>([]);
  const [place, setPlace] = useState("ALL");
  const [kind, setKind] = useState("ALL");
  const [when, setWhen] = useState("any");
  const [visibleLimit, setVisibleLimit] = useState(24);

  useEffect(() => {
    fetch("/api/vault/metrics")
      .then((r) => r.json())
      .then((d) => {
        if (d?.states) setServerStates(d.states);
        if (Array.isArray(d?.blockedIds)) setBlockedIds(d.blockedIds);
      })
      .catch(() => {});
    try {
      const saved = JSON.parse(localStorage.getItem("ch_favorite_profiles") || "[]");
      if (Array.isArray(saved)) setFavIds(saved);
    } catch {}
  }, []);

  const toggleFav = (id: string) => {
    const next = favIds.includes(id) ? favIds.filter((x) => x !== id) : [id, ...favIds];
    setFavIds(next);
    try {
      localStorage.setItem("ch_favorite_profiles", JSON.stringify(next));
      window.dispatchEvent(new Event("ch-favorites-updated"));
    } catch {}
  };

  const profiles = useMemo(() => {
    const blocked = new Set(blockedIds);
    const list: any[] = [];
    for (const o of OFFERS) {
      const pid = o.id || o.dedupClusterId;
      if (!pid || blocked.has(pid)) continue;
      const st = serverStates[pid] || {};
      if (st.paused || st.hidden || st.removedByReport) continue;
      if (place !== "ALL" && String(o.canton || "").toUpperCase() !== place) continue;
      if (kind !== "ALL" && (o.rubric || "female") !== kind) continue;

      /* Only states confirmed by the person themselves count; flags copied from other portals do not. */
      const isAvail = Boolean(st.availabilityConfirmed);
      const isVerif = Boolean(st.identityVerified);
      if (when === "now" && !isAvail) continue;

      const r60 = Math.max(100, Math.min(1200, Number(st.rate60Chf || o.advertisedBaseChf) || 0));
      const thumb = String(o.thumbnail || "").trim().replace(/[?&]iwsn_clean=1.*$/i, "");
      const hasPhoto =
        thumb.startsWith("http") &&
        !/unsplash\.com|placeholder|escort-portrait|bg_blur/i.test(thumb) &&
        !thumb.endsWith(".svg");
      const digits = String(o.rawPhone || "").replace(/\D/g, "");
      const ownNumber = Boolean(digits) && PHONE_COUNTS[digits] === 1;

      list.push({ ...o, id: pid, r60, isAvail, isVerif, hasPhoto, thumb, digits, ownNumber, featured: Boolean(st.featured) });
    }
    list.sort((a, b) => {
      if (a.isAvail !== b.isAvail) return a.isAvail ? -1 : 1;
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      if (a.hasPhoto !== b.hasPhoto) return a.hasPhoto ? -1 : 1;
      if (a.ownNumber !== b.ownNumber) return a.ownNumber ? -1 : 1;
      return Number(b.curationScore || 0) - Number(a.curationScore || 0);
    });
    return list;
  }, [serverStates, blockedIds, place, kind, when]);

  const availableCount = useMemo(() => profiles.filter((p) => p.isAvail).length, [profiles]);
  const placeLabel = PLACES.find((p) => p.code === place)?.label || "der Schweiz";
  const inPlace = place === "ALL" ? "in der ganzen Schweiz" : "in " + placeLabel;
  const summary = (kind === "ALL" ? "Alle Angebote" : KINDS.find((k) => k.id === kind)?.label) + " " + inPlace + (when === "now" ? ", jetzt" : "");

  const scrollToResults = () => {
    try {
      document.getElementById("entdecken")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {}
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SEO
        title="iWantSexNow.ch — Escort, Tantra & Studios in der Schweiz (0% Provision)"
        description={`${fmt(TOTAL_PROFILES)} Profile von Escorts, Tantra- und Massage-Studios sowie ${TOTAL_CLUBS} Clubs in der Schweiz. Preise für 30 und 60 Minuten in Franken, 0% Provision.`}
        url="https://iwantsexnow.ch"
      />
      <LuxuryHeader />

      <main id="top">
        <section className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-14 px-4 pb-14 pt-12 sm:px-6 lg:pt-[72px]">
          <div className="flex min-w-0 flex-[1_1_560px] flex-col gap-7">
            <p className="text-[15px] font-semibold text-gold">Für Erwachsene in der ganzen Schweiz</p>
            <h1 className="text-[clamp(3.2rem,7vw,5.25rem)] leading-none text-ink">Wen suchst du heute?</h1>
            <p className="max-w-[34em] text-[20px] leading-relaxed text-ink-soft">
              {fmt(TOTAL_PROFILES)} Profile und {TOTAL_CLUBS} Clubs von Genf bis St. Gallen. Preise in Franken, keine Agentur dazwischen, 0% Provision.
            </p>

            <form
              aria-label="Suche"
              onSubmit={(e) => {
                e.preventDefault();
                scrollToResults();
              }}
              className="flex flex-col gap-6 rounded-[28px] border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(0,0,0,0.25),0_16px_40px_rgba(0,0,0,0.28)] sm:p-7"
            >
              <Step n="1" q="Wo?">
                {PLACES.map((p) => (
                  <Chip key={p.code} active={place === p.code} onClick={() => { setPlace(p.code); setVisibleLimit(24); }}>
                    {p.label}
                  </Chip>
                ))}
              </Step>
              <Step n="2" q="Wann?">
                {WHEN.map((w) => (
                  <Chip key={w.id} active={when === w.id} onClick={() => { setWhen(w.id); setVisibleLimit(24); }}>
                    {w.label}
                  </Chip>
                ))}
              </Step>
              <Step n="3" q="Was?">
                {KINDS.map((k) => (
                  <Chip key={k.id} active={kind === k.id} onClick={() => { setKind(k.id); setVisibleLimit(24); }}>
                    {k.label}
                  </Chip>
                ))}
              </Step>
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
                <p className="text-[16px] text-ink-soft">
                  {summary} · <span className="text-gold">{fmt(profiles.length)} Profile</span>
                </p>
                <button type="submit" className="brass-button inline-flex min-h-[56px] items-center justify-center px-9 text-[17px]">
                  Profile zeigen
                </button>
              </div>
            </form>
          </div>

          <div aria-hidden="true" className="hidden min-w-0 flex-[1_1_400px] items-end gap-5 md:flex">
            <div className="aspect-[4/5] flex-[1.25_1_0] rounded-[999px_999px_22px_22px] border border-gold shadow-[0_16px_40px_rgba(0,0,0,0.28)]" style={{ background: PLACEHOLDERS[0] }} />
            <div className="flex flex-[1_1_0] flex-col gap-5 pb-9">
              <div className="aspect-[4/5] rounded-[999px_999px_22px_22px] border border-gold" style={{ background: PLACEHOLDERS[1] }} />
              <div className="rounded-full border border-gold px-5 py-3 text-center font-display text-[24px] italic leading-tight text-gold">diskret und direkt</div>
            </div>
          </div>
        </section>

        <section aria-label="Warum hier" className="border-y border-line bg-surface">
          <ul className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-x-12 gap-y-4 px-4 py-6 sm:px-6">
            <li className="flex items-center gap-3"><Check />Preise offen in Franken</li>
            <li className="flex items-center gap-3"><Check />0% Provision, keine Agentur</li>
            <li className="flex items-center gap-3"><Check />Diskret-Modus mit einem Klick</li>
            <li className="flex items-center gap-3"><Check />Melden und Entfernen in einem Klick</li>
          </ul>
        </section>

        <section id="entdecken" className="mx-auto flex max-w-[1200px] scroll-mt-24 flex-col gap-8 px-4 py-20 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-[40px] leading-[1.1] text-ink">{when === "now" ? "Jetzt frei " + inPlace : "Ausgewählt " + inPlace}</h2>
              <p className="text-ink-soft">
                {when === "now"
                  ? "Nur wer die Zeit selbst bestätigt hat."
                  : availableCount > 0
                  ? `${availableCount} davon haben gerade Zeit und stehen zuoberst.`
                  : "Wer seine Zeit selbst bestätigt, steht zuoberst."}
              </p>
            </div>
            <Link href="/search" className="font-semibold text-gold hover:text-ink">
              Alle {fmt(TOTAL_PROFILES)} durchsuchen
            </Link>
          </div>

          {profiles.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-[28px] border border-line bg-surface px-6 py-14 text-center">
              <h3 className="text-[28px] text-ink">{when === "now" ? "Gerade hat hier niemand Zeit bestätigt." : "Keine Profile für diese Auswahl."}</h3>
              <p className="max-w-xl text-ink-soft">Wähle einen anderen Ort oder schau dir alle Profile an.</p>
              <button type="button" onClick={() => { setWhen("any"); setPlace("ALL"); setKind("ALL"); }} className="btn-outline min-h-[48px] px-6">
                Alle Profile zeigen
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {profiles.slice(0, visibleLimit).map((p, idx) => {
                const isFav = favIds.includes(p.id);
                const href = "/profile/" + encodeURIComponent(p.id);
                const name = String(p.rawName || "Profil");
                const waHref = "https://wa.me/" + p.digits + "?text=" + encodeURIComponent("Hallo, ich habe dein Inserat auf iwantsexnow.ch gesehen.");
                return (
                  <article key={p.id} className="flex flex-col gap-3.5 rounded-[28px] border border-line bg-surface p-2.5 pb-4 shadow-[0_1px_2px_rgba(0,0,0,0.25),0_16px_40px_rgba(0,0,0,0.28)] transition-transform duration-300 hover:-translate-y-1 hover:border-gold sm:p-3.5 sm:pb-5">
                    <div className="relative">
                      <Link href={href} aria-label={"Profil von " + name + " öffnen"} className="iw-photo block aspect-[4/5] overflow-hidden rounded-[999px_999px_22px_22px] border border-gold" style={{ background: PLACEHOLDERS[idx % PLACEHOLDERS.length] }}>
                        {p.hasPhoto && (
                          <img
                            referrerPolicy="no-referrer"
                            src={p.thumb}
                            alt=""
                            loading={idx < 8 ? "eager" : "lazy"}
                            onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0")}
                            className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-[1.04]"
                          />
                        )}
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleFav(p.id)}
                        aria-pressed={isFav}
                        aria-label={isFav ? name + " von der Merkliste nehmen" : name + " merken"}
                        className="absolute bottom-2.5 right-2.5 flex h-11 w-11 items-center justify-center rounded-full border border-line-strong bg-[rgba(21,8,16,0.75)]"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill={isFav ? "#e8c98a" : "none"} stroke="#e8c98a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex flex-col gap-1 px-1.5">
                      {p.isAvail && (
                        <span className="flex items-center gap-2 text-[14px] font-bold text-verified">
                          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-verified" />
                          Jetzt frei
                        </span>
                      )}
                      <h3 className="line-clamp-2 text-[22px] leading-[1.15] text-ink sm:text-[26px]">
                        <Link href={href} className="hover:text-gold">{name}</Link>
                      </h3>
                      <p className="line-clamp-1 text-[14px] text-ink-soft sm:text-[15px]">
                        {String(p.city || "Schweiz").split("/")[0]} · {kindLabel(String(p.rubric || "female"))}
                      </p>
                      {p.r60 > 0 && <p className="mt-1 text-[15px] font-semibold text-gold sm:text-[16px]">ab CHF {p.r60} pro Stunde</p>}
                      {p.isVerif && <p className="text-[14px] font-semibold text-verified">Geprüft</p>}
                    </div>
                    {p.ownNumber ? (
                      <a href={waHref} target="_blank" rel="noopener noreferrer" className="mx-1.5 mt-auto flex min-h-[48px] items-center justify-center rounded-full border border-line-strong text-[15px] font-semibold text-ink hover:border-gold hover:text-gold sm:text-[16px]">
                        Schreiben
                      </a>
                    ) : (
                      <Link href={href} className="mx-1.5 mt-auto flex min-h-[48px] items-center justify-center rounded-full border border-line-strong text-[15px] font-semibold text-ink hover:border-gold hover:text-gold sm:text-[16px]">
                        Profil ansehen
                      </Link>
                    )}
                  </article>
                );
              })}
            </div>
          )}

          {visibleLimit < profiles.length && (
            <div className="text-center">
              <button type="button" onClick={() => setVisibleLimit((v) => v + 24)} className="btn-outline min-h-[52px] px-8 text-[16px]">
                Mehr zeigen <span className="ml-2 text-ink-soft">noch {fmt(profiles.length - visibleLimit)}</span>
              </button>
            </div>
          )}
        </section>

        <section id="staedte" className="mx-auto flex max-w-[1200px] scroll-mt-24 flex-col gap-8 px-4 pb-20 sm:px-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-[40px] leading-[1.1] text-ink">In deiner Stadt</h2>
            <p className="text-ink-soft">Zehn Städte, dazu Clubs und Studios in der ganzen Schweiz.</p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
            {CITY_PLATES.map((c) => (
              <Link key={c.href} href={c.href} className="flex items-center gap-[18px] rounded-[28px] border border-line bg-wine px-6 py-[22px] text-ink transition-transform duration-300 hover:-translate-y-1 hover:border-gold">
                <span aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold text-[14px] font-bold tracking-[0.04em] text-gold outline outline-1 outline-offset-4 outline-[rgba(232,201,138,0.35)]">
                  {c.code}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="font-display text-[28px] leading-[1.15]">{c.city}</span>
                  <span className="text-[15px] font-semibold text-gold">{CANTON_COUNTS[c.code] ? fmt(CANTON_COUNTS[c.code]) + " Profile" : "Profile ansehen"}</span>
                </span>
              </Link>
            ))}
            <Link href="/clubs" className="flex items-center gap-[18px] rounded-[28px] border border-line bg-wine px-6 py-[22px] text-ink transition-transform duration-300 hover:-translate-y-1 hover:border-gold">
              <span aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold text-[14px] font-bold text-gold outline outline-1 outline-offset-4 outline-[rgba(232,201,138,0.35)]">
                {TOTAL_CLUBS}
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="font-display text-[28px] leading-[1.15]">Clubs und Studios</span>
                <span className="text-[15px] font-semibold text-gold">In der ganzen Schweiz</span>
              </span>
            </Link>
          </div>
        </section>

        <section aria-labelledby="so-gehts" className="border-y border-line bg-surface">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 py-20 sm:px-6">
            <h2 id="so-gehts" className="text-[40px] leading-[1.1] text-ink">So einfach geht&apos;s</h2>
            <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-10 p-0">
              {[
                ["1", "Sag, wen du suchst", "Ort, Zeit und Art. Kein Konto, keine Anmeldung."],
                ["2", "Lies das Profil", "Preise für 30 und 60 Minuten, Ort und was angeboten wird."],
                ["3", "Melde dich direkt", "Per WhatsApp oder Telefon mit der Nummer aus dem Inserat. Wir verlangen keine Provision."],
              ].map(([n, t, d]) => (
                <li key={n} className="flex flex-col gap-3.5">
                  <span aria-hidden="true" className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-gold font-display text-[40px] leading-none text-gold">{n}</span>
                  <h3 className="text-[28px] leading-[1.15] text-ink">{t}</h3>
                  <p className="text-ink-soft">{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="inserieren" className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-10 rounded-[40px] border border-line bg-wine p-8 sm:p-14">
            <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-5">
              <h2 className="text-[40px] leading-[1.1] text-ink">Du bietest an? Inseriere ohne Provision.</h2>
              <p className="text-[20px] leading-relaxed text-ink">Dein Profil, deine Preise, deine Nummer. Wir nehmen nichts von deinen Buchungen.</p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link href="/register" className="inline-flex min-h-[52px] items-center rounded-full border border-gold px-7 font-bold text-gold hover:bg-gold hover:text-gold-on">
                  Profil eintragen
                </Link>
                <Link href="/safety" className="font-semibold text-gold hover:text-ink">So schützen wir dich</Link>
              </div>
            </div>
            <ul className="m-0 flex flex-[1_1_320px] list-none flex-col gap-4 p-0">
              {["0% Provision auf Buchungen", "Profil jederzeit pausieren oder löschen", "Dein Inserat hier ohne dein Wissen? Entfernen in einem Klick"].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8c98a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                  {t === "Dein Inserat hier ohne dein Wissen? Entfernen in einem Klick" ? (
                    <Link href="/report" className="text-ink underline decoration-gold underline-offset-4">{t}</Link>
                  ) : (
                    t
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
