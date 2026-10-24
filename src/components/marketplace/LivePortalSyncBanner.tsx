import { useState, useEffect } from "react";
import Link from "next/link";
import { RefreshCw, CheckCircle2, Globe, Building2, Flame, Trophy, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const SWISS_HOUSES_AND_CLUBS = [
  {
    id: "house-aphrodite",
    name: "Villa / Haus Aphrodite",
    region: "Zentralschweiz / Zürich-Einzugsgebiet",
    type: "Exklusives Kontakt- & Wellness-Haus",
    walkInPossible: true,
    entryFeeChf: 0,
    standardRoomRate30Chf: 150,
    standardRoomRate60Chf: 250,
    activeLadiesCount: "12–18 Damen vor Ort",
    discretionNote: "Diskrete Zufahrt, eigene Parkplätze direkt am Haus, kein Vorab-Termin nötig (Walk-In).",
    rating: 9.4,
    verifiedPartner: true,
  },
  {
    id: "house-zeus",
    name: "Haus / Club Zeus",
    region: "Zürich / Ostschweiz & Mittelland",
    type: "Etabliertes Schweizer Lauf- & Studio-Haus",
    walkInPossible: true,
    entryFeeChf: 0,
    standardRoomRate30Chf: 140,
    standardRoomRate60Chf: 240,
    activeLadiesCount: "15–25 internationale Damen",
    discretionNote: "Direkter diskreter Eingang, wöchentlich wechselnde Besetzung, transparente Zimmer-Tarife.",
    rating: 9.2,
    verifiedPartner: true,
  },
  {
    id: "club-zurich-gold",
    name: "Suites & Private Lounge Paradeplatz / Seefeld",
    region: "Zürich City (ZH)",
    type: "Diskrete High-Class Privat-Suiten",
    walkInPossible: false,
    entryFeeChf: 0,
    standardRoomRate30Chf: 250,
    standardRoomRate60Chf: 400,
    activeLadiesCount: "6–8 handverlesene Top-Escorts",
    discretionNote: "Kein Schild an der Tür, Zugang per persönlichem Code nach Voranmeldung.",
    rating: 9.8,
    verifiedPartner: true,
  },
  {
    id: "club-zug-discrete",
    name: "Executive Apartment-Lounge Zug / Cham",
    region: "Kanton Zug (ZG)",
    type: "Business & VIP Apartment-Studios",
    walkInPossible: false,
    entryFeeChf: 0,
    standardRoomRate30Chf: 220,
    standardRoomRate60Chf: 380,
    activeLadiesCount: "4–6 verifizierte Direktprofile",
    discretionNote: "Direkter Lift aus der Tiefgarage, 100% anonym für Business-Gäste in Zug & Cham.",
    rating: 9.7,
    verifiedPartner: true,
  },
];

export function LivePortalSyncBanner({ totalProfiles = 180 }: { totalProfiles?: number }) {
  const [secondsToNextSync, setSecondsToNextSync] = useState(2415); // ~40 mins countdown

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsToNextSync((prev) => (prev <= 1 ? 3600 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const mins = Math.floor(secondsToNextSync / 60);
  const secs = secondsToNextSync % 60;

  const syncedPortals = [
    { name: "xdate.ch", ago: "vor 9 Min.", status: "100% Sync" },
    { name: "fgirl.ch", ago: "vor 14 Min.", status: "100% Sync" },
    { name: "and6.com", ago: "vor 6 Min.", status: "100% Sync" },
    { name: "6navi.ch", ago: "vor 18 Min.", status: "100% Sync" },
    { name: "Direkt-Profile", ago: "Echtzeit", status: "Live" },
  ];

  return (
    <div className="bg-[#060D16] border-y border-[#C69C6D]/30 py-2.5 px-4 text-xs text-white">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-black text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            STÜNDLICHER LIVE-PORTAL-SYNC AKTIV
          </span>
          <span className="text-gray-300 hidden sm:inline">
            Du musst keine anderen Seiten mehr öffnen – alle Schweizer Portale sind hier bereits zusammengeführt:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {syncedPortals.map((p) => (
            <div
              key={p.name}
              className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg px-2 py-0.5 text-[11px]"
            >
              <CheckCircle2 size={11} className="text-emerald-400 shrink-0" />
              <span className="font-bold text-white">{p.name}</span>
              <span className="text-gray-400">({p.ago})</span>
            </div>
          ))}
          <div className="flex items-center gap-1 bg-[#C69C6D]/15 border border-[#C69C6D]/40 text-[#D5A021] font-mono font-bold px-2.5 py-0.5 rounded-lg text-[11px]">
            <RefreshCw size={11} className="animate-spin" />
            Nächster Scan: {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </div>
        </div>
      </div>
    </div>
  );
}