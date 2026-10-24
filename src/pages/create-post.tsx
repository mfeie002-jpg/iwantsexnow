import { useState } from "react";
import Link from "next/link";
import SEO from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Globe, PlusCircle, CheckCircle2, Search, Sparkles, ArrowRight } from "lucide-react";

export default function CreatePostPage() {
  const { toast } = useToast();
  const [mode, setMode] = useState<"claim" | "create">("claim");
  const [claimQuery, setClaimQuery] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("Zürich & Zug");
  const [rate60, setRate60] = useState("450");

  const handleClaimSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Index-Suche abgeschlossen",
      description: `Wir haben passende Einträge für "${claimQuery || "deine Nummer"}" gefunden. Bestätige jetzt per SMS/Signal-Code deine Inhaberschaft.`,
    });
  };

  const handleCreateDirect = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: `Direktprofil für ${name || "Anbieterin"} angelegt!`,
      description: "Dein Profil ist bereit für den Foto- & ID-Check und ab sofort im Endpreis-Rechner sichtbar.",
    });
  };

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title="Profil übernehmen oder Direktprofil inserieren | iWantSexNow.ch"
        description="Übernehme dein automatisch indexiertes Schweizer Profil kostenlos oder erstelle ein verifiziertes Direktbuchungs-Inserat."
      />
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
        <div className="text-center space-y-3">
          <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40">
            Für selbstständige Escorts, Begleiterinnen & Studios
          </Badge>
          <h1 className="text-3xl md:text-5xl font-serif font-black">
            In 60 Sekunden zur direkten Buchbarkeit
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
            Unsere Suchmaschine indexiert bereits alle öffentlichen Schweizer Portale. Übernimm dein bestehendes Profil kostenlos, um Dubletten zusammenzuführen, oder erstelle ein neues Direktprofil.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="grid sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setMode("claim")}
            className={`p-5 rounded-2xl border text-left transition-all ${
              mode === "claim"
                ? "bg-[#09131E] border-[#C69C6D] shadow-xl"
                : "bg-white/5 border-white/10 text-gray-400"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-[#D5A021] flex items-center gap-1.5">
                <Globe size={15} /> Option 1 · Empfohlen
              </span>
              {mode === "claim" && <CheckCircle2 size={18} className="text-emerald-400" />}
            </div>
            <div className="text-lg font-black text-white">Bestehendes Index-Profil übernehmen</div>
            <p className="text-xs text-gray-300 mt-1">
              Gib deine Telefonnummer oder deinen Künstlernamen ein, fasse alle Drittportal-Inserate zusammen und schalte Direktbuchung frei.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setMode("create")}
            className={`p-5 rounded-2xl border text-left transition-all ${
              mode === "create"
                ? "bg-[#09131E] border-[#C69C6D] shadow-xl"
                : "bg-white/5 border-white/10 text-gray-400"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                <PlusCircle size={15} /> Option 2 · Neu-Inserat
              </span>
              {mode === "create" && <CheckCircle2 size={18} className="text-emerald-400" />}
            </div>
            <div className="text-lg font-black text-white">Neues Direktprofil erstellen</div>
            <p className="text-xs text-gray-300 mt-1">
              Erstelle ein exklusives Direktprofil für Zürich, Zug oder die ganze Schweiz inklusive Endpreis-Rechner & Echtheits-Siegel.
            </p>
          </button>
        </div>

        {mode === "claim" ? (
          <Card className="bg-[#09131E] border border-[#C69C6D]/40 p-6 md:p-8 rounded-2xl text-white space-y-5">
            <h2 className="text-2xl font-serif font-black">
              Indexiertes Profil suchen & kostenlos beanspruchen
            </h2>
            <p className="text-xs text-gray-300">
              Gib deine Schweizer Rufnummer (`+41 79...`) oder deinen Namen auf `xdate.ch`, `fgirl.ch` oder `and6.com` ein. Wir bündeln alle Dubletten unter deiner Kontrolle:
            </p>
            <form onSubmit={handleClaimSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D5A021]" />
                <input
                  type="text"
                  placeholder="Telefonnummer (+41 79...) oder Künstlername..."
                  value={claimQuery}
                  onChange={(e) => setClaimQuery(e.target.value)}
                  required
                  className="w-full rounded-xl bg-black/50 border border-white/20 pl-10 pr-4 py-3.5 text-sm text-white"
                />
              </div>
              <Button type="submit" className="bg-[#C69C6D] hover:bg-[#b5895a] text-[#0D1B2A] font-black px-6 py-3.5 h-auto">
                Im Schweizer Index suchen
              </Button>
            </form>
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
              <span>Nach der SMS-/Signal-Verifizierung landest du direkt im Provider-Dashboard.</span>
              <Link href="/creator-dashboard" className="text-[#D5A021] font-bold hover:underline flex items-center gap-1">
                Direkt zum Provider-Dashboard <ArrowRight size={14} />
              </Link>
            </div>
          </Card>
        ) : (
          <Card className="bg-[#09131E] border border-[#C69C6D]/40 p-6 md:p-8 rounded-2xl text-white space-y-5">
            <h2 className="text-2xl font-serif font-black">
              Neues verifiziertes Direktprofil anlegen
            </h2>
            <form onSubmit={handleCreateDirect} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Künstlername / Studio-Name</label>
                  <input
                    type="text"
                    placeholder="z.B. Sophia"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-2.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Haupt-Region & Outcall-Radius</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-2.5 text-sm text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-300 block mb-1">Direktbuchungs-Stundentarif (60 Min. in CHF inkl. Basis-Services)</label>
                <input
                  type="number"
                  value={rate60}
                  onChange={(e) => setRate60(e.target.value)}
                  required
                  className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-2.5 text-sm text-white"
                />
              </div>
              <Button type="submit" className="w-full bg-[#C69C6D] hover:bg-[#b5895a] text-[#0D1B2A] font-black py-6 text-base">
                Direktprofil speichern & zum Foto-Check →
              </Button>
            </form>
          </Card>
        )}
      </main>
    </div>
  );
}