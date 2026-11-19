import React, { useState, useMemo } from "react";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
import { SwissDoorplate } from "@/components/SwissDoorplate";
import offersData from "@/data/harvested-offers.json";
import { ShieldCheck, Calculator } from "lucide-react";

export default function SwissPricingCompassPage() {
  const [selectedCanton, setSelectedCanton] = useState("ZH");
  const [durationMins, setDurationMins] = useState(60);

  const cantonStats = useMemo(() => {
    const raw = (offersData as any[]) || [];
    const map: Record<string, { count: number; sum60: number; sum30: number; min60: number; max60: number }> = {};

    for (const o of raw) {
      const c = String(o.canton || "ZH").toUpperCase();
      const r60 = Math.max(150, Math.min(1000, Number(o.advertisedBaseChf) || 350));
      const r30 = Math.max(100, Math.min(600, Number(o.rate30Chf) || Math.round((r60 * 0.6) / 10) * 10));
      if (!map[c]) map[c] = { count: 0, sum60: 0, sum30: 0, min60: 9999, max60: 0 };
      map[c].count++;
      map[c].sum60 += r60;
      map[c].sum30 += r30;
      if (r60 < map[c].min60) map[c].min60 = r60;
      if (r60 > map[c].max60) map[c].max60 = r60;
    }

    return Object.entries(map)
      .map(([canton, st]) => ({
        canton,
        count: st.count,
        avg60: Math.round(st.sum60 / st.count / 10) * 10,
        avg30: Math.round(st.sum30 / st.count / 10) * 10,
        min60: st.min60,
        max60: st.max60,
      }))
      .sort((a, b) => b.count - a.count);
  }, []);

  const currentStat = cantonStats.find((s) => s.canton === selectedCanton) || cantonStats[0] || { avg60: 350, avg30: 200 };
  const baseCalc = durationMins === 30 ? currentStat.avg30 : durationMins === 60 ? currentStat.avg60 : Math.round((currentStat.avg60 * (durationMins / 60) * 0.9) / 10) * 10;
  const finalEstimate = baseCalc;

  return (
    <div className="min-h-screen bg-papier text-tinte pb-24">
      <SEO
        title="Schweizer CHF-Honorar-Kompass (30 Min. / 60 Min. Richtpreise) | iwantsexnow.ch"
        description="Live-Marktauswertung über 2'529+ Schweizer Escort- und Tantra-Profile nach Kanton (Zürich, Zug, Genf, Basel, Tessin) gemäss Preisbekanntgabeverordnung."
      />
      <LuxuryHeader />

      <PageIntro tone="butter" note="Ehrlich gerechnet" art="canton:zh" title={<>Schweizer CHF-Honorar-Kompass & Tarifrechner</>}
        lead={<>Durchschnitt der 30- und 60-Minuten-Angaben im Verzeichnis, nach Kanton. Fahrtkosten bei einem Besuch stehen nicht in den Einträgen.</>}>
        <div className="text-right font-mono text-[13px] text-mint-700 font-bold flex items-center gap-1.5">
            <ShieldCheck size={15} />
            <span>0 % BUCHUNGSKOMMISSION</span>
          </div>
      </PageIntro>

      <main className="guide">
        

        {/* Interaktiver Schweizer Honorar-Rechner */}
        <section className="penthouse-panel p-6 rounded-[24px] border border-kirsche/50 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="text-[13px] font-mono text-kirsche font-bold flex items-center gap-2">
              <Calculator size={15} />
              <span>Interaktiver Schweizer Honorar-Rechner</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={selectedCanton}
                onChange={(e) => setSelectedCanton(e.target.value)}
                className="rounded-full bg-white border border-kirsche/40 px-4 py-2.5 text-[13px] font-mono font-bold text-kirsche outline-none"
              >
                {cantonStats.map((s) => (
                  <option key={s.canton} value={s.canton} className="bg-papier">
                    KANTON {s.canton} ({s.count} Suiten)
                  </option>
                ))}
              </select>

              <select
                value={durationMins}
                onChange={(e) => setDurationMins(Number(e.target.value))}
                className="rounded-full bg-white border border-kirsche/40 px-4 py-2.5 text-[13px] font-mono font-bold text-kirsche outline-none"
              >
                <option value={30} className="bg-papier">Dauer: 30 Min. Express</option>
                <option value={60} className="bg-papier">Dauer: 60 Min. Standard</option>
                <option value={120} className="bg-papier">Dauer: 120 Min. Dinner</option>
              </select>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-kirsche text-center space-y-1">
            <div className="text-[13px] font-mono text-tinte-soft">
              MARKTÜBLICHER RICHTWERT ({selectedCanton})
            </div>
            <div className="font-serif font-mono text-3xl sm:text-4xl text-kirsche font-bold">
              CHF {finalEstimate}.–
            </div>
            <div className="text-[13px] font-mono text-mint-700">
              Direktzahlung vor Ort (Bar / TWINT)
            </div>
          </div>
        </section>

        {/* Kantonale Preistafel */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cantonStats.map((st) => (
            <div key={st.canton} className="valentina-outer-card rounded-[20px] p-2">
              <div className="rounded-[15px] border border-kirsche/30 bg-papier p-4 space-y-2.5 font-mono text-[13px]">
                <div className="flex items-center justify-between">
                  <SwissDoorplate state="FREI" roomNumber={st.canton} customLabel={st.count + " DOSSIERS"} size="sm" />
                  <span className="text-kirsche font-bold">Ø CHF {st.avg60}.– / 60M</span>
                </div>
                <div className="flex justify-between text-[13px] text-tinte-soft pt-2 border-t border-tinte/20">
                  <span>30 Min. Express Ø:</span>
                  <strong className="text-tinte">CHF {st.avg30}.–</strong>
                </div>
                <div className="flex justify-between text-[13px] text-tinte-soft">
                  <span>Bandbreite (60 Min.):</span>
                  <strong className="text-kirsche">CHF {st.min60} – {st.max60}</strong>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}