import Link from "next/link";
import SEO from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft, PlusCircle, Calculator } from "lucide-react";

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO title="Nutzungsbedingungen & Endpreis-Garantie (18+) | iWantSexNow.ch" description="Nutzungsbedingungen für Suchende & B2B-Anbieter" />
      <header className="border-b border-[#C69C6D]/25 bg-[#07101A] py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif font-black">
            <span>iWant</span><span className="text-[#D5A021]">Sex</span><span>Now</span><span className="text-[#C69C6D] text-sm font-sans">.ch</span>
          </Link>
          <div className="hidden lg:block"><Navigation /></div>
          <MobileNav />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white">
          <ArrowLeft size={14} /> Zurück zur Startseite
        </Link>

        <Card className="bg-[#09131E] border border-[#C69C6D]/40 p-8 rounded-2xl text-white space-y-5 shadow-2xl">
          <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40 w-fit">
            <ShieldCheck size={13} className="mr-1.5 inline" /> Allgemeine Nutzungsbedingungen (Schweiz · 18+)
          </Badge>
          <h1 className="text-3xl md:text-4xl font-serif font-black">Nutzungsbedingungen für Suchende & B2B-Anbieter</h1>
          <p className="text-gray-300 leading-relaxed text-sm md:text-base">
            Der Zugang zu iWantSexNow.ch ist strikt volljährigen Personen (18+) vorbehalten. Verifizierte Direkt-Anbieterinnen verpflichten sich im Rahmen des Swiss-Shield-Kodex, die im Endpreis-Rechner ausgewiesenen Tarife und Inklusiv-Leistungen ohne versteckte Nachverhandlungen vor Ort einzuhalten. Anbieterinnen können ihr indexiertes Profil jederzeit kostenlos beanspruchen, aktualisieren oder aus dem Index entfernen lassen.
          </p>
          <div className="pt-4 border-t border-white/10 flex flex-wrap gap-3">
            <Button className="bg-[#C69C6D] text-[#0D1B2A] font-black" asChild>
              <Link href="/compare-escorts">
                <Calculator size={15} className="mr-1.5" /> Zum Endpreis-Rechner
              </Link>
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
              <Link href="/create-post">
                <PlusCircle size={15} className="mr-1.5" /> Profil übernehmen / Inserieren
              </Link>
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}