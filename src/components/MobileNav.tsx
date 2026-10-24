import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search, SlidersHorizontal, MapPin, PlusCircle, Heart, Sparkles, Trophy, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        aria-label="Menü öffnen"
        className="text-white hover:bg-white/10"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {open && (
        <div className="fixed inset-x-0 top-[68px] z-50 border-b border-[#C69C6D]/40 bg-[#07101A]/98 backdrop-blur-xl p-5 text-white shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto">
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#D5A021] px-2">
              Suchmaschine, Rankings & Endpreis-Rechner
            </div>
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-white/10"
            >
              <Search size={16} className="text-[#D5A021]" />
              Schweizweite Meta-Suche & Filter
            </Link>
            <Link
              href="/compare-escorts"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-white/10"
            >
              <SlidersHorizontal size={16} className="text-emerald-400" />
              Endpreis- & Portal-Matrix
            </Link>
            <Link
              href="/rankings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-white/10"
            >
              <Trophy size={16} className="text-[#D5A021]" />
              Schweizer Bestenliste & Portal-Ratings
            </Link>
            <Link
              href="/matches"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-white/10"
            >
              <Sparkles size={16} className="text-[#D5A021]" />
              30-Sekunden Smart-Matcher
            </Link>
            <Link
              href="/favorites"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-white/10"
            >
              <Heart size={16} className="text-rose-400" />
              Meine Merkliste & Preisvergleich
            </Link>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-white/10">
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#D5A021] px-2">
              Städte & Kantone
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/escort-zurich"
                onClick={() => setOpen(false)}
                className="flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs font-bold text-white"
              >
                <MapPin size={13} className="text-[#D5A021]" /> Zürich & Zug
              </Link>
              <Link
                href="/escort-basel"
                onClick={() => setOpen(false)}
                className="flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs font-bold text-white"
              >
                <MapPin size={13} className="text-[#D5A021]" /> Basel
              </Link>
              <Link
                href="/escort-bern"
                onClick={() => setOpen(false)}
                className="flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs font-bold text-white"
              >
                <MapPin size={13} className="text-[#D5A021]" /> Bern
              </Link>
              <Link
                href="/escort-geneva"
                onClick={() => setOpen(false)}
                className="flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs font-bold text-white"
              >
                <MapPin size={13} className="text-[#D5A021]" /> Genève & Vaud
              </Link>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-white/10">
            <div className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 px-2">
              Login & B2B Provider-Cockpit
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-white/10 border border-[#C69C6D]/40 px-3 py-2.5 font-bold text-center flex items-center justify-center gap-1.5"
              >
                <KeyRound size={13} className="text-[#D5A021]" /> Login / Cockpit
              </Link>
              <Link
                href="/creator-dashboard"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 font-bold text-center"
              >
                Provider Tresor
              </Link>
            </div>
            <Link
              href="/create-post"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#C69C6D] py-3 text-sm font-black text-[#0D1B2A] shadow-lg"
            >
              <PlusCircle size={16} />
              Profil übernehmen / Inserieren
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}