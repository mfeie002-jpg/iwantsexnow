import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Sparkles, Trophy } from "lucide-react";

export function ContactSection() {
  return (
    <section className="py-14 bg-[#150810] border-t border-white/10 text-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="rounded-2xl bg-gradient-to-r from-[#22101a] via-[#2b1420] to-[#22101a] border-2 border-[#ee3c7c]/60 p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center lg:text-left max-w-xl">
            <div className="text-xs font-bold uppercase tracking-wider text-mint-400">
              Für Suchende & Selbstständige Anbieterinnen in Zürich, Zug & der Schweiz
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black">
              Bereit für echte Endpreise oder deinen kostenlosen Profil-Claim?
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              Starte den 30-Sekunden Smart-Matcher oder übernimm als Anbieterin kostenlos dein indexiertes Profil inklusive 2 Gratis Lead-Credits (CHF 50 Wert) und eigenem VIP-Video-Tresor.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 shrink-0">
            <Button className="bg-[#d6165f] hover:bg-[#d6165f] text-[#fbf1ec] font-black" asChild>
              <Link href="/matches">
                <Sparkles size={15} className="mr-1.5" /> 30-Sek. Smart-Matcher
              </Link>
            </Button>
            <Button variant="outline" className="border-[#ee3c7c] text-[#ee3c7c] hover:bg-[#d6165f]/10 font-black" asChild>
              <Link href="/create-post">
                <PlusCircle size={15} className="mr-1.5" /> Profil übernehmen (+2 Credits)
              </Link>
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 font-bold" asChild>
              <Link href="/rankings">
                <Trophy size={15} className="mr-1.5 text-[#ee3c7c]" /> Bestenliste
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}