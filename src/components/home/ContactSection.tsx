import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Sparkles, PlusCircle, SlidersHorizontal } from "lucide-react";

export function ContactSection() {
  return (
    <section id="contact" className="border-y border-white/10 bg-[#09131E] px-4 py-16 text-white">
      <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-8">
        <Card className="border-[#C69C6D]/40 bg-white/5 p-8 text-white flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
              <Sparkles size={15} />
              Für Suchende · Diskreter Entscheidungs-Service
            </div>
            <h2 className="mb-3 text-2xl md:text-3xl font-black">
              Keine Lust, 100 Inserate zu durchsuchen?
            </h2>
            <p className="mb-6 text-sm md:text-base text-gray-300 leading-relaxed">
              Nutze unseren vollständigen 47-Portale-Vergleich oder starte das Smart-Matching für Zürich & Zug: Gib Budget, Zeitfenster und Wunsch-Optionen an und vergleiche sofort die besten verifizierten Treffer.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button className="bg-[#C69C6D] hover:bg-[#b5895a] text-[#0D1B2A] font-bold" asChild>
              <Link href="/compare-escorts">
                <SlidersHorizontal size={16} className="mr-2" />
                47 Portale & Preise vergleichen
              </Link>
            </Button>
            <Button variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10" asChild>
              <Link href="/matches">Smart-Matching öffnen</Link>
            </Button>
          </div>
        </Card>

        <Card className="border-white/15 bg-white/5 p-8 text-white flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D5A021] mb-3">
              <ShieldCheck size={15} />
              Für selbstständige Anbieterinnen & Studios (B2B)
            </div>
            <h2 className="mb-3 text-2xl md:text-3xl font-black">
              Als verifiziertes Direktprofil listen
            </h2>
            <p className="mb-6 text-sm md:text-base text-gray-300 leading-relaxed">
              Erhalte vorqualifizierte, diskrete Direkt-Anfragen mit klarem Budget statt Zeitverschwendung. Verwalte dein Profil, deine Echtzeit-Verfügbarkeit und deine Konditionen im eigenen Dashboard.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button className="bg-white hover:bg-gray-200 text-[#0D1B2A] font-bold" asChild>
              <Link href="/create-post">
                <PlusCircle size={16} className="mr-2" />
                Direktprofil erstellen
              </Link>
            </Button>
            <Button variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10" asChild>
              <Link href="/pricing">B2B Pakete & Lead-Preise</Link>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
