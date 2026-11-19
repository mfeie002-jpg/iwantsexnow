import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { CantonIndex, type CantonLink } from "@/components/listing/CantonIndex";
import { ListingGrid } from "@/components/listing/ListingCard";
import { countLabel, toListing, type ListingProfile } from "@/lib/listing";
import offersData from "@/data/harvested-offers.json";
import clubsData from "@/data/swiss-establishments-vault.json";

const TOTAL_CLUBS = Array.isArray(clubsData) ? clubsData.length : 0;
const TOTAL_PROFILES = Array.isArray(offersData) ? offersData.length : 0;

const CANTON_NAMES: Record<string, string> = {
  ZH: "Zürich", ZG: "Zug", LU: "Luzern", BE: "Bern", BS: "Basel", BL: "Basel-Land",
  AG: "Aargau", SG: "St. Gallen", GE: "Genève", VD: "Lausanne", TI: "Lugano",
  VS: "Wallis", FR: "Freiburg", NE: "Neuenburg", SO: "Solothurn", GR: "Graubünden",
  TG: "Thurgau", SZ: "Schwyz", SH: "Schaffhausen", AR: "Appenzell A.", AI: "Appenzell I.",
  OW: "Obwalden", NW: "Nidwalden", UR: "Uri", GL: "Glarus", JU: "Jura",
};

const HUB: Record<string, string> = {
  ZG: "/orte/zug",
  ZH: "/escort-zurich",
  LU: "/orte/luzern",
  BS: "/escort-basel",
  BE: "/escort-bern",
  AG: "/orte/baden",
  SG: "/orte/st-gallen",
  GE: "/escort-geneva",
  VD: "/escort-lausanne",
  TI: "/escort-lugano",
};

const CATEGORIES = [
  { href: "/search?rubric=female", title: "Escort & Begleitung", text: "Girlfriend Experience, Dinner, Hotel.", image: "/editorial/editorial-zurich.jpg" },
  { href: "/search?rubric=massage", title: "Tantra & Massage", text: "Studios und private Termine.", image: "/editorial/editorial-still.jpg" },
  { href: "/clubs", title: "Clubs & Laufhäuser", text: countLabel(TOTAL_CLUBS) + " Adressen mit Telefon.", image: "/editorial/editorial-salon.jpg" },
  { href: "/search?rubric=trans", title: "Trans", text: "Profile, die sich so eintragen.", image: "/editorial/editorial-alps.jpg" },
];

function cantonHref(code: string) {
  return HUB[code] || "/search?canton=" + encodeURIComponent(code);
}

export default function HomePage() {
  const [serverStates, setServerStates] = useState<Record<string, any>>({});
  const [blockedIds, setBlockedIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/vault/metrics")
      .then((r) => r.json())
      .then((d) => {
        if (d?.states) setServerStates(d.states);
        if (Array.isArray(d?.blockedIds)) setBlockedIds(d.blockedIds);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const cantons: CantonLink[] = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const o of (offersData as any[]) || []) {
      const code = String(o?.canton || "").toUpperCase();
      if (!code) continue;
      counts[code] = (counts[code] || 0) + 1;
    }
    return Object.keys(counts)
      .map((code) => ({
        code,
        label: CANTON_NAMES[code] || code,
        href: cantonHref(code),
        count: counts[code],
      }))
      .sort((a, b) => b.count - a.count);
  }, []);

  const selection: ListingProfile[] = useMemo(() => {
    const blocked = new Set(blockedIds);
    const rows: { item: ListingProfile; photo: number; score: number }[] = [];
    for (const o of (offersData as any[]) || []) {
      const id = String(o.id || o.dedupClusterId || "");
      if (!id || blocked.has(id)) continue;
      const st = serverStates[id] || {};
      if (st.paused || st.hidden || st.removedByReport) continue;
      const item = toListing(o, st);
      if (!item) continue;
      rows.push({
        item,
        photo: item.photo ? 1 : 0,
        score: Number(o.curationScore) || 0,
      });
    }
    rows.sort((a, b) => b.photo - a.photo || b.score - a.score || a.item.id.localeCompare(b.item.id));
    return rows.slice(0, 8).map((row) => row.item);
  }, [serverStates, blockedIds]);

  const profileLabel = countLabel(TOTAL_PROFILES);

  return (
    <div className="min-h-screen">
      <SEO
        title="IWANTSEXNOW.CH — Schweizer Escort, Tantra & Studio Direktverzeichnis (0% Provision)"
        description={
          profileLabel +
          " Profile in der Schweiz und " +
          countLabel(TOTAL_CLUBS) +
          " Clubs. Echte 30- und 60-Minuten-Preise in CHF, direkter +41 Kontakt, 0% Provision."
        }
        url="https://iwantsexnow.ch"
      />
      <LuxuryHeader />

      <section className="hero">
        <div className="hero-copy">
          <p className="kicker">Schweizer Verzeichnis · ab 18</p>
          <h1>
            Eine Suche für die ganze Schweiz.
            <span> Vergleichen & direkt buchen.</span>
          </h1>
          <p className="dek">
            {profileLabel} Profile, {countLabel(TOTAL_CLUBS)} Clubs. Preise für 30 und 60 Minuten in Franken, Kontakt über die Nummer im Eintrag. Keine Agentur, keine Provision.
          </p>

          <form className="sentence-search" action="/search" method="get">
            <label>
              <span>Ich suche</span>
              <input name="q" type="search" placeholder="Name oder Stadt" aria-label="Name oder Stadt" />
            </label>
            <label>
              <span>in</span>
              <select name="canton" aria-label="Kanton" defaultValue="ALL">
                <option value="ALL">der ganzen Schweiz</option>
                {cantons.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Art</span>
              <select name="rubric" aria-label="Art" defaultValue="ALL">
                <option value="ALL">alles</option>
                <option value="female">Escort & Begleitung</option>
                <option value="massage">Tantra & Massage</option>
                <option value="bdsm">Domina & BDSM</option>
                <option value="trans">Trans</option>
              </select>
            </label>
            <label>
              <span>bis</span>
              <select name="max" aria-label="Preisgrenze 60 Minuten" defaultValue="1200">
                <option value="1200">jeder Preis</option>
                <option value="250">CHF 250 / 60 Min.</option>
                <option value="350">CHF 350 / 60 Min.</option>
                <option value="500">CHF 500 / 60 Min.</option>
              </select>
            </label>
            <button type="submit" className="brass-button">
              Zeigen
            </button>
          </form>
        </div>
        <figure className="hero-figure">
          <img src="/editorial/editorial-zurich.jpg" alt="Zürich am See, Abendstimmung" />
          <figcaption>Zürich, vom See. Die Städte darunter führen in die Einträge.</figcaption>
        </figure>
      </section>

      <section className="band" aria-labelledby="orte-h">
        <div className="band-head">
          <h2 id="orte-h">Wo du bist</h2>
          <p>Die Zahl ist die Anzahl der Profile im Verzeichnis, nicht eine Bewertung.</p>
        </div>
        <CantonIndex cantons={cantons} />
      </section>

      <section className="band" aria-labelledby="art-h">
        <div className="band-head">
          <h2 id="art-h">Wonach du suchst</h2>
          <Link href="/search">Alle Filter</Link>
        </div>
        <div className="category-row">
          {CATEGORIES.map((cat) => (
            <Link key={cat.href} href={cat.href} className="category-tile">
              <img src={cat.image} alt="" loading="lazy" decoding="async" />
              <span>
                <strong>{cat.title}</strong>
                <em>{cat.text}</em>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="band" aria-labelledby="blatt-h">
        <div className="band-head">
          <h2 id="blatt-h">Aus dem Verzeichnis</h2>
          <p>{ready ? "Acht Einträge mit Foto, wie sie im Index liegen." : "Einträge werden geladen."}</p>
        </div>
        {ready ? <ListingGrid profiles={selection} eagerCount={2} /> : null}
        <p className="band-more">
          <Link href="/search" className="brass-button">
            Ganzes Verzeichnis öffnen
          </Link>
        </p>
      </section>

      <section className="split-note">
        <div>
          <h2>So läuft ein Kontakt</h2>
          <p>
            Du suchst nach Ort, Art und Preis. Im Eintrag stehen 30 und 60 Minuten nebeneinander. Schreiben oder anrufen geht über die +41 Nummer, die im Profil steht. Was ihr ausmacht, bleibt zwischen euch. Die Plattform nimmt auf diesen Direktkontakt keine Provision.
          </p>
          <p>
            Bis zu vier Profile lassen sich unter <Link href="/compare-escorts">Vergleich</Link> nebeneinander legen. Wer nicht gelistet sein will, nutzt das <Link href="/report">Opt-Out</Link>.
          </p>
        </div>
        <aside>
          <h2>Du bietest an</h2>
          <p>Profil übernehmen oder neu eintragen, Preise selbst setzen, Verfügbarkeit für die nächsten vier Stunden bestätigen. Paid-Inhalte: 80% an dich.</p>
          <p className="mast-actions">
            <Link href="/register" className="brass-button">Profil eintragen</Link>
            <Link href="/advertise" className="text-link">Für Anbieterinnen</Link>
          </p>
        </aside>
      </section>
    </div>
  );
}
