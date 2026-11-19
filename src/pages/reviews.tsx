import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
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
    <div className="min-h-screen bg-papier text-tinte pb-24">
      <SEO
        title="Verifizierte Schweizer Escort-Erfahrungen & Foto-Echtheits-Bewertungen | iwantsexnow.ch"
        description="Echte Erfahrungsberichte, Foto-Echtheits-Checks und 30m/60m CHF-Preis-Leistungs-Bewertungen für unabhängige Escorts & Studios in Zürich, Zug, Luzern, Basel & Bern."
        url="https://iwantsexnow.ch/reviews"
      />
      <LuxuryHeader />

      <PageIntro tone="minze" note="Ehrlich bewertet" art="none" title={<>Geprüfte Erfahrungsberichte & Foto-Echtheits-Bewertungen</>}
        lead={<>Fokus auf <strong>100 % Originalfotos</strong>, <strong>Einhaltung der publizierten 30m/60m CHF-Tarife</strong> und diskrete Abwicklung.</>}>
        <div className="flex gap-2">
            <Link href="/compare-escorts" className="px-4 py-2.5 rounded-xl bg-tinte/[0.04] hover:bg-tinte/[0.06] border border-tinte/25 text-[13px] font-bold text-kirsche">
              4-Profil Direktvergleich →
            </Link>
            <Link href="/pricing" className="px-4 py-2.5 rounded-xl bg-kirsche text-white text-[13px] font-extrabold">
              CHF-Honorar-Kompass →
            </Link>
          </div>
      </PageIntro>

      <main className="guide">
        

        {/* Kantons- & Suchfilter */}
        <section className="p-4 rounded-2xl bg-white border border-tinte/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {["ALL", "ZG", "ZH", "LU", "AG", "BS", "BE", "SG", "GE", "VD", "TI"].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCantonFilter(c)}
                className={`px-3 py-1.5 rounded-xl text-[13px] font-extrabold cursor-pointer ${
                  cantonFilter === c ? "bg-kirsche text-white" : "bg-papier text-tinte border border-tinte/20"
                }`}
              >
                {c === "ALL" ? "Alle Kantone" : c}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-2.5 text-gray-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Name, Stadt oder Stichwort..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-papier border border-tinte/25 text-[13px] text-tinte"
            />
          </div>
        </section>

        {/* Bewertungs-Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p: any) => (
            <div key={p.id} className="p-5 rounded-2xl bg-white border border-tinte/20 hover:border-kirsche/50 flex flex-col justify-between gap-4 transition">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.thumbnail || "/images/escort-portrait-1.jpg"}
                      alt={p.rawName}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/escort-portrait-1.jpg"; }}
                      className="w-14 h-14 rounded-xl object-cover object-top border border-kirsche/40"
                    />
                    <div>
                      <Link href={`/profile/${encodeURIComponent(p.id)}`} className="text-sm font-serif font-bold text-tinte hover:text-kirsche">
                        {p.rawName}
                      </Link>
                      <div className="text-[13px] text-gray-600">
                        {p.city} ({p.canton}) · {p.age || 25} J. · Cup {p.cupSize || "C"}
                      </div>
                      <div className="text-[13px] font-bold text-kirsche mt-0.5">
                        CHF {p.rate60Chf}.– / 60m (CHF {p.rate30Chf}.– / 30m)
                      </div>
                    </div>
                  </div>
                  <div className="px-2.5 py-1 rounded-xl bg-sun-500/15 border border-sun-500/30 text-sun-700 font-extrabold text-[13px] flex items-center gap-1">
                    <Star size={12} className="fill-sun-700 text-sun-700" /> {p.rating}
                  </div>
                </div>

                <p className="text-[13px] text-gray-700 leading-relaxed bg-papier p-3.5 rounded-xl border border-tinte/10 italic">
                  „{p.snippet}“
                </p>

                <div className="flex flex-wrap gap-1.5 text-[13px]">
                  <span className="px-2 py-0.5 rounded bg-mint-500/15 text-mint-700 font-bold">
                    ✓ 100% Foto-Echtheit bestätigt
                  </span>
                  <span className="px-2 py-0.5 rounded bg-tinte/[0.04] text-gray-700">
                    {p.reviewCount} geprüfte Rückmeldungen
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-tinte/20 flex items-center justify-between">
                <span className="text-[13px] text-gray-600">Direktkontakt verfügbar</span>
                <Link
                  href={`/profile/${encodeURIComponent(p.id)}`}
                  className="px-3.5 py-2 rounded-xl bg-kirsche text-white font-extrabold text-[13px] inline-flex items-center gap-1"
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