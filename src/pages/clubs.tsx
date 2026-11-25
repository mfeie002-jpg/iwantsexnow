import React, { useMemo, useState } from "react";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
import { countLabel, phoneDigits } from "@/lib/listing";

function spokenPhone(raw: string) {
  const digits = phoneDigits(raw);
  if (digits.startsWith("41") && digits.length === 11) {
    return "+41 " + digits.slice(2, 4) + " " + digits.slice(4, 7) + " " + digits.slice(7, 9) + " " + digits.slice(9);
  }
  return String(raw || "").trim();
}
import clubsData from "@/data/swiss-establishments-vault.json";

export default function SwissClubsDirectoryPage() {
  const all = Array.isArray(clubsData) ? (clubsData as any[]) : [];
  const [canton, setCanton] = useState("ALL");
  const [search, setSearch] = useState("");

  const cantons = useMemo(() => {
    const set = new Set<string>();
    for (const club of all) {
      const code = String(club.canton || "").toUpperCase();
      if (code) set.add(code);
    }
    return Array.from(set).sort();
  }, [all]);

  const filtered = useMemo(() => {
    return all.filter((club) => {
      if (canton !== "ALL" && String(club.canton || "").toUpperCase() !== canton) return false;
      if (!search.trim()) return true;
      const hay = [club.name, club.city, club.canton, club.type, club.description].filter(Boolean).join(" ").toLowerCase();
      return hay.includes(search.trim().toLowerCase());
    });
  }, [all, canton, search]);

  return (
    <div className="min-h-screen pb-24">
      <SEO
        title={countLabel(all.length) + " Schweizer Clubs, Studios & Laufhäuser | iwantsexnow.ch"}
        description={
          "Verzeichnis stationärer Adressen: " +
          countLabel(all.length) +
          " Einträge mit Stadt, Art und Telefon, wo eine Nummer hinterlegt ist."
        }
        url="https://iwantsexnow.ch/clubs"
      />
      <LuxuryHeader />
      <PageIntro
        tone="minze"
        note="Häuser"
        art="category:clubs"
        title={<>Clubs, Studios, Saunen</>}
        lead={
          <>
            {countLabel(all.length)} Einträge im Haus-Verzeichnis. Angezeigt werden Name, Ort, Art und die Telefonnummer, wenn sie im Datensatz steht.
          </>
        }
      />

      <main className="sheet">
        <form className="filter-bar" onSubmit={(e) => e.preventDefault()}>
          <label>
            Name oder Stadt
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="z. B. Zürich, Sauna, Studio"
              aria-label="Club, Stadt oder Art"
            />
          </label>
          <label>
            Kanton
            <select value={canton} onChange={(e) => setCanton(e.target.value)} aria-label="Kanton">
              <option value="ALL">Alle Kantone</option>
              {cantons.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </label>
          <p className="filter-count">{countLabel(filtered.length)} angezeigt</p>
        </form>

        <ul className="place-list">
          {filtered.map((club: any, index: number) => {
            const digits = phoneDigits(club.phone);
            const tel = digits ? "+" + digits : "";
            return (
              <li key={club.id || index}>
                <div>
                  <p className="listing-place">
                    {club.city || "Schweiz"} <span>{club.canton}</span>
                    {club.type ? <span> · {club.type}</span> : null}
                  </p>
                  <h2>{club.name}</h2>
                  {club.openingHours ? <p className="place-hours">{club.openingHours}</p> : null}
                </div>
                <div className="place-contact">
                  {tel ? (
                    <a href={"tel:" + tel}>{spokenPhone(String(club.phone || ""))}</a>
                  ) : (
                    <span>Keine Nummer hinterlegt</span>
                  )}
                  {club.sourceUrl ? (
                    <a href={club.sourceUrl} target="_blank" rel="noopener noreferrer">
                      Quelle
                    </a>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
        {filtered.length === 0 && <p className="listing-empty">Kein Haus passt auf diese Suche.</p>}
      </main>
    </div>
  );
}
