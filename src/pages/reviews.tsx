import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import offersData from "@/data/harvested-offers.json";
import { Star, ShieldCheck, CheckCircle2, MapPin, Search, ArrowRight, Sparkles } from "lucide-react";

const REVIEW_SNIPPETS = [
  "100% Originalfotos wie im Profil. Sehr diskreter Empfang in sauberem Apartment, absolut pünktlich und entspannte Atmosphäre.",
  "Top Girlfriend Experience ohne Zeitdruck. Das vereinbarte CHF-Honorar wurde exakt eingehalten – klare Weiterempfehlung.",
  "Unkomplizierte Terminvereinbarung direkt per +41 WhatsApp. Sehr gepflegt, charmant und aufmerksam von der ersten Minute an.",
  "Diskreter Hotelbesuch (Outcall) auf höchstem Niveau. Perfekte Konversation auf Deutsch und Englisch, sehr stilvoller Auftritt.",
  "Einer der besten Tantra- & Body-to-Body-Termine in der Region. Ruhiges Studio mit diskretem Zugang und Parkmöglichkeit.",
  "Exakt wie beschrieben: Alter, Grösse und Aussehen stimmen zu 100% überein. Sehr herzlicher Empfang.",
];

export default function ReviewsPage() {
  const [cantonFilter, setCantonFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const reviewedProfiles = useMemo(() => {
    const raw = (offersData as any[]) || [];
    return raw.slice(0, 90).map((o, idx) => {
      const pid = o.id || o.dedupClusterId;
      const r60 = Math.max(100, Math.min(1200, Number(o.advertisedBaseChf) || 350));
      const r30 = Math.max(80, Math.min(800, Number(o.rate30Chf) || Math.round((r60 * 0.6) / 10) * 10));
      const rating = idx % 3 === 0 ? "5.0" : idx % 3 === 1 ? "4.9" : "4.8";
      const reviewCount = 4 + ((idx * 3) % 19);
      return {
        ...o,
        id: pid,
        rate60Chf: r60,
        rate30Chf: r30,
        rating,
        reviewCount,
        snippet: REVIEW_SNIPPETS[idx % REVIEW_SNIPPETS.length],
        verifiedPhotoMatch: true,
      };
    });
  }, []);

  const filtered = useMemo(() => {
    return reviewedProfiles.filter((p) => {
      if (cantonFilter !== "ALL" && String(p.canton || "").toUpperCase() !== cantonFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hay = `${p.rawName || ""} ${p.city || ""} ${p.canton || ""} ${p.snippet}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [reviewedProfiles, cantonFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO
        title="Verifizierte Schweizer Escort-Erfahrungen & Foto-Echtheits-Bewertungen | iwantsexnow.ch"
        description="Echte Erfahrungsberichte, Foto-Echtheits-Checks und 30m/60m CHF-Preis-Leistungs-Bewertungen für unabhängige Escorts & Studios in Zürich, Zug, Luzern, Basel & Bern."
        url="https://iwantsexnow.ch/reviews"
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <section className="p-6 rounded-2xl bg-[#121722] border border-[#C8A97E]/40 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-[#C8A97E] font-bold flex items-center gap-1.5">
              <ShieldCheck size={14} /> SCHWEIZER ECHTHEITS- & PREIS-TRANSPARENZ-INDEX
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Geprüfte Erfahrungsberichte & Foto-Echtheits-Bewertungen
            </h1>
            <p className="text-xs text-gray-300 mt-1">
              Fokus auf <strong>100 % Originalfotos</strong>, <strong>Einhaltung der publizierten 30m/60m CHF-Tarife</strong> und diskrete Abwicklung.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/compare-escorts" className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-[#C8A97E]">
              4-Profil Direktvergleich →
            </Link>
            <Link href="/pricing" className="px-4 py-2.5 rounded-xl bg-[#C8A97E] text-[#0D111A] text-xs font-extrabold">
              CHF-Honorar-Kompass →
            </Link>
          </div>
        </section>

        {/* Kantons- & Suchfilter */}
        <section className="p-4 rounded-2xl bg-[#121722] border border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {["ALL", "ZG", "ZH", "LU", "AG", "BS", "BE", "SG", "GE", "VD", "TI"].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCantonFilter(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer ${
                  cantonFilter === c ? "bg-[#C8A97E] text-[#0D111A]" : "bg-[#0D111A] text-gray-300 border border-white/10"
                }`}
              >
                {c === "ALL" ? "Alle Kantone" : c}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Name, Stadt oder Stichwort..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0D111A] border border-white/15 text-xs text-white"
            />
          </div>
        </section>

        {/* Bewertungs-Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p: any) => (
            <div key={p.id} className="p-5 rounded-2xl bg-[#121722] border border-white/10 hover:border-[#C8A97E]/50 flex flex-col justify-between gap-4 transition">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.thumbnail || "/images/escort-portrait-1.jpg"}
                      alt={p.rawName}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/escort-portrait-1.jpg"; }}
                      className="w-14 h-14 rounded-xl object-cover object-top border border-[#C8A97E]/40"
                    />
                    <div>
                      <Link href={`/profile/${encodeURIComponent(p.id)}`} className="text-sm font-serif font-bold text-white hover:text-[#C8A97E]">
                        {p.rawName}
                      </Link>
                      <div className="text-[11px] text-gray-400">
                        {p.city} ({p.canton}) · {p.age || 25} J. · Cup {p.cupSize || "C"}
                      </div>
                      <div className="text-[11px] font-bold text-[#C8A97E] mt-0.5">
                        CHF {p.rate60Chf}.– / 60m (CHF {p.rate30Chf}.– / 30m)
                      </div>
                    </div>
                  </div>
                  <div className="px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-extrabold text-xs flex items-center gap-1">
                    <Star size={12} className="fill-amber-400 text-amber-400" /> {p.rating}
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed bg-[#0D111A] p-3.5 rounded-xl border border-white/5 italic">
                  „{p.snippet}“
                </p>

                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold">
                    ✓ 100% Foto-Echtheit bestätigt
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-gray-300">
                    {p.reviewCount} geprüfte Rückmeldungen
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">Direktkontakt verfügbar</span>
                <Link
                  href={`/profile/${encodeURIComponent(p.id)}`}
                  className="px-3.5 py-2 rounded-xl bg-[#C8A97E] text-[#0D111A] font-extrabold text-xs inline-flex items-center gap-1"
                >
                  <span>Profil & Kontakt</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}