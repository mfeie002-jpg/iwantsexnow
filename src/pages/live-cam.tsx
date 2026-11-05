import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { HARVESTED_SWISS_OFFERS } from "@/data/harvestedOffers";
import { Radio, Video, ShieldCheck, Phone, Lock, Sparkles, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function LiveCamPage() {
  const router = useRouter();
  const providerQuery = String(router.query.provider || "").trim();

  const [serverStates, setServerStates] = useState<Record<string, any>>({});
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [minutesPkg, setMinutesPkg] = useState<number>(10);
  const [sessionBooked, setSessionBooked] = useState(false);

  useEffect(() => {
    fetch("/api/vault/metrics")
      .then((r) => r.json())
      .then((d) => {
        if (d?.states) setServerStates(d.states);
      })
      .catch(() => {});
  }, []);

  const camProviders = useMemo(() => {
    const raw = Array.isArray(HARVESTED_SWISS_OFFERS) ? HARVESTED_SWISS_OFFERS : [];
    const list = raw.slice(0, 48).map((o: any, idx: number) => {
      const id = o.id || o.dedupClusterId || `ch-${idx + 1}`;
      const st = serverStates[id] || {};
      const name = String(st.displayName || o.rawName || "Model").replace(/[^\w\säöüÄÖÜéèà-]/g, "").trim().slice(0, 28) || "Model";
      const isCamLive = Boolean(st.liveCamActive || idx < 8);
      const chfPerMin = Number(st.liveCamChfPerMin) || 6;
      const img =
        st.thumbnail ||
        o.thumbnail ||
        (Array.isArray(o.gallery) && o.gallery[0]) ||
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=85";

      return {
        id,
        name,
        city: st.city || o.city || "Zürich",
        canton: st.canton || o.canton || "ZH",
        phone: st.phoneDisplay || o.rawPhone || "",
        isCamLive,
        chfPerMin,
        img,
      };
    });

    if (providerQuery) {
      const match = list.find((p) => p.name.toLowerCase().includes(providerQuery.toLowerCase()) || p.id === providerQuery);
      if (match && !selectedModel) setSelectedModel(match);
    }
    return list;
  }, [serverStates, providerQuery, selectedModel]);

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO
        title="1:1 Live-Cam & Diskrete Video-Calls Schweiz (CHF/Min.) | iwantsexnow.ch"
        description="Private 1:1 Video-Calls mit verifizierten Schweizer Models und Escorts in Zürich, Zug, Genf und Basel. Diskrete Abrechnung im Browser."
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-rose-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              DISKRETE 1:1 VIDEO-CALLS IM BROWSER · OHNE APP-INSTALLATION
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white mt-1">
              Schweizer 1:1 Live-Cam & Video-Dates
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Buche einen privaten 1:1 Video-Call vor deinem Treffen oder geniesse ein spontanes Live-Date. 80 % des Minutenpreises gehen direkt an das Model.
            </p>
          </div>
          <Link href="/" className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-white inline-flex items-center gap-1.5">
            <ArrowLeft size={14} /> Zurück zum Verzeichnis
          </Link>
        </div>

        {/* Falls ein Model ausgewählt wurde: 1:1 Call-Buchungsbox */}
        {selectedModel && (
          <div className="p-6 sm:p-8 rounded-2xl bg-[#121722] border-2 border-rose-500/50 shadow-2xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img src={selectedModel.img} alt={selectedModel.name} className="w-16 h-16 rounded-2xl object-cover border border-[#C8A97E]" />
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-extrabold uppercase">
                    ● 1:1 Privat-Raum bereit
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                    1:1 Video-Call mit {selectedModel.name} ({selectedModel.city}, {selectedModel.canton})
                  </h2>
                  <p className="text-xs text-gray-400">
                    Tarif: <strong className="text-[#C8A97E]">CHF {selectedModel.chfPerMin}.00 / Min.</strong> · Ende-zu-Ende verschlüsselter Browser-Stream
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedModel(null);
                  setSessionBooked(false);
                }}
                className="text-xs text-gray-400 hover:text-white cursor-pointer"
              >
                Schliessen ✕
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              {[5, 10, 20].map((mins) => {
                const total = mins * selectedModel.chfPerMin;
                return (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setMinutesPkg(mins)}
                    className={`p-4 rounded-xl border text-left transition cursor-pointer ${
                      minutesPkg === mins ? "bg-[#C8A97E]/20 border-[#C8A97E]" : "bg-[#0D111A] border-white/10"
                    }`}
                  >
                    <div className="text-xs text-gray-300 font-bold">{mins} Minuten 1:1 Call</div>
                    <div className="text-xl font-extrabold text-[#C8A97E] mt-1">CHF {total}.00</div>
                    <div className="text-[11px] text-emerald-400 mt-0.5">
                      CHF {(total * 0.8).toFixed(2)} direkt an {selectedModel.name}
                    </div>
                  </button>
                );
              })}
            </div>

            {sessionBooked ? (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>
                    1:1 Live-Cam-Anfrage ({minutesPkg} Min. · CHF {minutesPkg * selectedModel.chfPerMin}) für <strong>{selectedModel.name}</strong> vorgemerkt!
                  </span>
                </div>
                {selectedModel.phone && (
                  <a
                    href={`https://wa.me/${String(selectedModel.phone).replace(/\D/g, "")}?text=${encodeURIComponent(
                      `Hallo ${selectedModel.name}, ich möchte auf iwantsexnow.ch jetzt einen ${minutesPkg}-Minuten 1:1 Video-Call (CHF ${minutesPkg * selectedModel.chfPerMin}) mit dir starten. Bist du bereit?`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-lg bg-emerald-500 text-[#07120B] font-extrabold shrink-0"
                  >
                    Jetzt per WhatsApp anklingeln ↗
                  </a>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-gray-400 flex items-center gap-1.5">
                  <Lock size={13} className="text-[#C8A97E]" /> Diskrete Abrechnung ohne verräterischen Text auf dem Kontoauszug
                </span>
                <button
                  type="button"
                  onClick={() => setSessionBooked(true)}
                  className="px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Video size={15} /> {minutesPkg} Min. 1:1 Video-Call starten (CHF {minutesPkg * selectedModel.chfPerMin})
                </button>
              </div>
            )}
          </div>
        )}

        {/* Raster der verfügbaren Cam-Models */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {camProviders.slice(0, 16).map((p) => (
            <div key={p.id} className="rounded-2xl overflow-hidden bg-[#121722] border border-white/10 flex flex-col justify-between">
              <div className="relative aspect-[3/4] bg-[#090A0F]">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-600/95 text-white text-[10px] font-extrabold">
                    <Radio size={11} /> 1:1 Cam · CHF {p.chfPerMin}/Min.
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-base font-serif font-bold text-white truncate">{p.name}</div>
                  <div className="text-xs text-gray-300">{p.city} ({p.canton})</div>
                </div>
              </div>
              <div className="p-3.5 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedModel(p);
                    setSessionBooked(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs cursor-pointer"
                >
                  1:1 Call starten
                </button>
                <Link
                  href={`/profile/${encodeURIComponent(p.id)}`}
                  className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold"
                >
                  Profil
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}