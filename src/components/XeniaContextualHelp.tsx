import React, { useState } from "react";
import Link from "next/link";
import { HelpCircle, X, Clock, ShieldCheck, Layers, Scale } from "lucide-react";

export type DoubtTopic = "status" | "price" | "source";

const EXPLANATIONS: Record<
  DoubtTopic,
  { title: string; badge: string; summary: string; bullets: string[]; linkHref: string; linkLabel: string }
> = {
  status: {
    title: "Was bedeutet dieser Status?",
    badge: "Xenia · Status-Erklärung",
    summary:
      "Wir unterscheiden strikt zwischen aktiv bestätigter Verfügbarkeit, allgemeiner Konto-Aktivität und ungeprüften Fremdeinträgen:",
    bullets: [
      "Jetzt verfügbar (Grün): Vom Anbieter selbst aktiv bestätigt; läuft nach 4 Stunden automatisch ab.",
      "Online (Blau): Das Konto war kürzlich auf unserer Plattform aktiv.",
      "Verfügbarkeit unbekannt: Der Eintrag stammt aus einer externen Quelle; wir erfinden keinen grünen Punkt.",
    ],
    linkHref: "/for-clients",
    linkLabel: "Alle Kennzeichnungen im Detail →",
  },
  price: {
    title: "Wie ist dieser Preis zu verstehen?",
    badge: "Xenia · Preis-Einordnung",
    summary:
      "Veröffentlichte Preise stammen aus den Angaben des jeweiligen Profils oder Inserats und sind an die genannte Dauer gekoppelt:",
    bullets: [
      "Dauer beachten: Ein niedriger Betrag (z.B. CHF 150) bezieht sich oft auf 30 Minuten statt 60 Minuten.",
      "Rahmenbedingungen: Hotelbesuche (Outcall), Anfahrtswege oder besondere Wünsche können den Endpreis verändern.",
      "Keine Preisangabe: Wenn im Inserat kein klarer Betrag steht, weisen wir dies offen als 'Keine Preisangabe' aus.",
    ],
    linkHref: "/reviews",
    linkLabel: "Preis- & Portalvergleich ansehen →",
  },
  source: {
    title: "Woher stammen diese Angaben?",
    badge: "Xenia · Quellen-Transparenz",
    summary:
      "Damit du weißt, welcher Angabe du vertrauen kannst, zeigen wir für jedes Profil die genaue Herkunft:",
    bullets: [
      "Selbst verwaltet: Die betreffende Person pflegt dieses Profil über ein bestätigtes eigenes Konto.",
      "Identität geprüft (✓): Volljährigkeit und Bildberechtigung wurden von uns dokumentiert geprüft.",
      "Externe Quelle: Öffentlicher Verzeichnis-Eintrag mit direktem Link zum Originalinserat.",
    ],
    linkHref: "/advertise",
    linkLabel: "Eigenes Profil kostenlos übernehmen →",
  },
};

export function XeniaDoubtTrigger({
  topic,
  label,
  light = false,
}: {
  topic: DoubtTopic;
  label?: string;
  light?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const info = EXPLANATIONS[topic];

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(!open);
        }}
        title={info.title}
        className={`inline-flex items-center gap-1 text-[11px] font-medium transition cursor-pointer ${
          light
            ? "text-stone-500 hover:text-[#8A642B]"
            : "text-gray-400 hover:text-[#C6A574]"
        }`}
      >
        {label && <span className="underline decoration-dotted underline-offset-2">{label}</span>}
        <HelpCircle size={12} className="text-[#C6A574] shrink-0" />
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 text-left"
        >
          <div className="max-w-md w-full rounded-2xl bg-[#161A23] border border-[#C6A574]/60 p-5 shadow-2xl text-white space-y-3.5">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5C99B]">
                ✨ {info.badge}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <h4 className="text-base font-serif font-bold text-white">{info.title}</h4>
            <p className="text-xs text-gray-300 leading-relaxed">{info.summary}</p>

            <ul className="space-y-1.5 text-xs text-gray-200 bg-[#0F1218] p-3.5 rounded-xl border border-white/10">
              {info.bullets.map((b, i) => (
                <li key={i} className="leading-relaxed">
                  • {b}
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between pt-1 text-xs">
              <Link href={info.linkHref} className="text-[#C6A574] font-bold hover:underline">
                {info.linkLabel}
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-[#C6A574] text-[#0F1218] font-bold cursor-pointer"
              >
                Verstanden
              </button>
            </div>
          </div>
        </div>
      )}
    </span>
  );
}
export default XeniaDoubtTrigger;
