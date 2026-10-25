import { BrandLogo } from "@/components/BrandLogo";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft, PlusCircle, Calculator } from "lucide-react";

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO title="Häufige Fragen zum Schweizer Escort-Index & Endpreis-Rechner | iWantSexNow.ch" description="Wie funktioniert das Google + Booking.com Prinzip?" />
      <header className="border-b border-[#C69C6D]/25 bg-[#07101A] py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/"><BrandLogo compact /></Link>
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
            <ShieldCheck size={13} className="mr-1.5 inline" /> FAQ · So funktioniert iWantSexNow.ch
          </Badge>
          <h1 className="text-3xl md:text-4xl font-serif font-black">Wie funktioniert das Google + Booking.com Prinzip?</h1>
          <p className="text-gray-300 leading-relaxed text-sm md:text-base">
            1. Warum sehe ich verschiedene Portal-Preise auf einer Karte? Unsere Engine erkennt anhand normalisierter Schweizer Telefonnummern, wenn dieselbe Anbieterin auf mehreren Portalen zu unterschiedlichen Preisen inseriert, und zeigt dir den günstigsten Direkt-Tarif. 2. Wie funktioniert die Direktbuchung? Bei allen mit Direkt Buchbar markierten Profilen wählst du Dauer und Extras im Rechner aus und sendest deinen Terminwunsch zum garantierten Komplettpreis direkt an die Anbieterin.
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