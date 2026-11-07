import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { SwissDoorplate } from "@/components/SwissDoorplate";
import offersData from "@/data/harvested-offers.json";
import { Scale, MessageCircle, User, Crown } from "lucide-react";

export default function CompareEscortsPage() {
  const [selected, setSelected] = useState<any[]>([]);

  useEffect(() => {
    const all = (offersData as any[]) || [];
    try {
      const favIds = JSON.parse(localStorage.getItem("ch_favorite_profiles") || "[]");
      const fromFavs = all.filter((o) => favIds.includes(o.id || o.dedupClusterId));
      const pool = fromFavs.length >= 2 ? fromFavs.slice(0, 4) : all.slice(0, 4);
      setSelected(pool);
    } catch {
      setSelected(all.slice(0, 4));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#070606] text-[#F5EFE6] pb-24">
      <SEO
        title="4-Suiten Direktvergleich · 30m/60m CHF & +41 Kontakt | iwantsexnow.ch"
        description="Vergleichen Sie bis zu 4 Schweizer Escort- und Tantra-Suiten nebeneinander nach 30-Minuten- und 60-Minuten-Honorar, Kanton und Verfügbarkeit."
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="penthouse-panel p-6 rounded-[24px] border border-[#C8A97E]/40 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#DEC393] font-bold">
              SWISS SIDE-BY-SIDE MATRIX
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#EAD2AA] flex items-center gap-2 mt-1">
              <Scale size={22} className="text-[#DEC393]" />
              <span>Direktvergleich Ihrer gemerkten Schweizer Suiten</span>
            </h1>
          </div>
          <SwissDoorplate state="FREI" roomNumber="MATRIX" customLabel={selected.length + " SUITEN IM VERGLEICH"} size="sm" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {selected.map((p: any, i: number) => {
            const pid = p.id || p.dedupClusterId;
            const r60 = Number(p.advertisedBaseChf) || 350;
            const r30 = Number(p.rate30Chf) || Math.round((r60 * 0.6) / 10) * 10;
            const cleanDigits = p.rawPhone ? String(p.rawPhone).replace(/\D/g, "") : "";
            const thumb = String(p.thumbnail || "").replace(/[?&]iwsn_clean=1.*$/i, "");

            return (
              <div key={pid || i} className="valentina-outer-card rounded-[24px] p-2.5 flex flex-col justify-between">
                <div className="rounded-[18px] border border-[#C8A97E]/35 bg-[#070505] overflow-hidden flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={"/profile/" + encodeURIComponent(pid)} className="darkroom-stage block aspect-[3/4] w-full">
                      <img
                        referrerPolicy="no-referrer"
                        src={thumb}
                        alt={p.rawName}
                        className="darkroom-img"
                      />
                      <div className="darkroom-vignette" />
                      <div className="darkroom-floor" />
                      <div className="absolute top-3 left-3 z-10">
                        <SwissDoorplate state="FREI" roomNumber={p.canton || "CH"} customLabel="FREI" size="sm" />
                      </div>
                      <div className="absolute inset-x-0 bottom-2 z-10 px-3 text-center">
                        <div className="font-serif text-lg text-[#EAD2AA] truncate uppercase">{p.rawName}</div>
                        <div className="text-[9px] font-mono text-[#C8B9A6]">{p.city} ({p.canton})</div>
                      </div>
                    </Link>

                    <div className="p-3.5 space-y-2 text-xs font-mono border-t border-[#C8A97E]/20">
                      <div className="flex justify-between">
                        <span className="text-[#9E8C74]">60 Min. Standard:</span>
                        <strong className="text-[#DEC393]">CHF {r60}.–</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#9E8C74]">30 Min. Express:</span>
                        <strong className="text-[#F5EFE6]">CHF {r30}.–</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#9E8C74]">Alter / Grösse:</span>
                        <strong className="text-[#EAD2AA]">{p.age || 25}J · {p.heightCm || 168}cm</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#9E8C74]">Körbchen:</span>
                        <strong className="text-[#EAD2AA]">Cup {p.cupSize || "C"}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 grid grid-cols-1 gap-2 border-t border-[#C8A97E]/20">
                    {cleanDigits && (
                      <a
                        href={"https://wa.me/" + cleanDigits}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="brass-3d py-2 px-3 rounded-full font-sans font-extrabold text-[10px] tracking-widest uppercase flex items-center justify-center gap-1.5"
                      >
                        <MessageCircle size={12} />
                        <span>WHATSAPP</span>
                      </a>
                    )}
                    <Link
                      href={"/profile/" + encodeURIComponent(pid)}
                      className="emerald-3d py-2 px-3 rounded-full border border-[#C8A97E]/45 font-sans font-bold text-[10px] tracking-widest uppercase flex items-center justify-center gap-1.5"
                    >
                      <User size={12} className="text-[#DEC393]" />
                      <span>DOSSIER ÖFFNEN</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}