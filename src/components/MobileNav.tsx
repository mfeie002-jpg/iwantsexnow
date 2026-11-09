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
        className="text-tinte hover:bg-tinte/[0.06]"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {open && (
        <div className="fixed inset-x-0 top-[68px] z-50 border-b border-kirsche/40 bg-papier/98 backdrop-blur-xl p-5 text-tinte shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto">
          <div className="space-y-1.5">
            <div className="text-[13px] font-bold text-kirsche px-2">
              Suchmaschine, Rankings & Endpreis-Rechner
            </div>
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-tinte/[0.06]"
            >
              <Search size={16} className="text-kirsche" />
              Schweizweite Meta-Suche & Filter
            </Link>
            <Link
              href="/compare-escorts"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-tinte/[0.06]"
            >
              <SlidersHorizontal size={16} className="text-mint-700" />
              Endpreis- & Portal-Matrix
            </Link>
            <Link
              href="/live-cam"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-black bg-glow-100/50 border border-glow-500/40 text-glow-800 hover:bg-glow-100/50"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-glow-500 animate-ping" />
              1:1 Live-Cam & Video-Vibe-Check
            </Link>
            <Link
              href="/rankings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-tinte/[0.06]"
            >
              <Trophy size={16} className="text-kirsche" />
              Schweizer Bestenliste & Portal-Ratings
            </Link>
            <Link
              href="/matches"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-tinte/[0.06]"
            >
              <Sparkles size={16} className="text-kirsche" />
              30-Sekunden Smart-Matcher
            </Link>
            <Link
              href="/favorites"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-tinte/[0.06]"
            >
              <Heart size={16} className="text-glow-700" />
              Meine Merkliste & Preisvergleich
            </Link>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-tinte/20">
            <div className="text-[13px] font-bold text-kirsche px-2">
              Städte & Kantone
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/escort-zurich"
                onClick={() => setOpen(false)}
                className="flex items-center gap-1.5 rounded-xl bg-tinte/[0.04] border border-tinte/20 px-3 py-2 text-[13px] font-bold text-tinte"
              >
                <MapPin size={13} className="text-kirsche" /> Zürich & Zug
              </Link>
              <Link
                href="/escort-basel"
                onClick={() => setOpen(false)}
                className="flex items-center gap-1.5 rounded-xl bg-tinte/[0.04] border border-tinte/20 px-3 py-2 text-[13px] font-bold text-tinte"
              >
                <MapPin size={13} className="text-kirsche" /> Basel
              </Link>
              <Link
                href="/escort-bern"
                onClick={() => setOpen(false)}
                className="flex items-center gap-1.5 rounded-xl bg-tinte/[0.04] border border-tinte/20 px-3 py-2 text-[13px] font-bold text-tinte"
              >
                <MapPin size={13} className="text-kirsche" /> Bern
              </Link>
              <Link
                href="/escort-geneva"
                onClick={() => setOpen(false)}
                className="flex items-center gap-1.5 rounded-xl bg-tinte/[0.04] border border-tinte/20 px-3 py-2 text-[13px] font-bold text-tinte"
              >
                <MapPin size={13} className="text-kirsche" /> Genève & Vaud
              </Link>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-tinte/20">
            <div className="text-[13px] font-bold text-mint-700 px-2">
              Login & B2B Provider-Cockpit
            </div>
            <div className="grid grid-cols-2 gap-2 text-[13px]">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-tinte/[0.06] border border-kirsche/40 px-3 py-2.5 font-bold text-center flex items-center justify-center gap-1.5"
              >
                <KeyRound size={13} className="text-kirsche" /> Login / Cockpit
              </Link>
              <Link
                href="/creator-dashboard"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-tinte/[0.04] border border-tinte/20 px-3 py-2.5 font-bold text-center"
              >
                Provider Tresor
              </Link>
            </div>
            <Link
              href="/create-post"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-kirsche py-3 text-sm font-black text-[#ffffff] shadow-lg"
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