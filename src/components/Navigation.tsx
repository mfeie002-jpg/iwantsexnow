import Link from "next/link";
import { useRouter } from "next/router";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  PlusCircle,
  Trophy,
  KeyRound,
  Video,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const router = useRouter();
  const isActive = (path: string) =>
    router.pathname === path || router.pathname.startsWith(path + "/");

  return (
    <nav className="flex items-center gap-1.5 xl:gap-2">
      <Link
        href="/search"
        className={`px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
          isActive("/search") ? "bg-[#C69C6D] text-[#0D1B2A]" : "text-gray-200 hover:bg-white/10"
        }`}
      >
        <Search size={14} className={isActive("/search") ? "text-[#0D1B2A]" : "text-[#D5A021]"} />
        <span>Suche</span>
      </Link>

      <Link
        href="/compare-escorts"
        className={`px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
          isActive("/compare-escorts") ? "bg-[#C69C6D] text-[#0D1B2A]" : "text-gray-200 hover:bg-white/10"
        }`}
      >
        <SlidersHorizontal
          size={14}
          className={isActive("/compare-escorts") ? "text-[#0D1B2A]" : "text-emerald-400"}
        />
        <span>Endpreis-Matrix</span>
      </Link>

      <Link
        href="/live-cam"
        className={`px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
          isActive("/live-cam") ? "bg-rose-600 text-white" : "text-gray-200 hover:bg-white/10"
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
        <Video size={14} className="text-rose-400" />
        <span>1:1 Live-Cam</span>
      </Link>

      <Link
        href="/rankings"
        className={`px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
          isActive("/rankings") ? "bg-[#C69C6D] text-[#0D1B2A]" : "text-gray-200 hover:bg-white/10"
        }`}
      >
        <Trophy size={14} className={isActive("/rankings") ? "text-[#0D1B2A]" : "text-[#D5A021]"} />
        <span>Bestenliste</span>
      </Link>

      <Link
        href="/guides"
        className={`px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
          isActive("/guides") ? "bg-[#C69C6D] text-[#0D1B2A]" : "text-gray-200 hover:bg-white/10"
        }`}
      >
        <HelpCircle size={14} className={isActive("/guides") ? "text-[#0D1B2A]" : "text-emerald-400"} />
        <span>Guides & Hilfe</span>
      </Link>

      <Link
        href="/escort-zurich"
        className={`px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
          isActive("/escort-zurich") ? "bg-[#C69C6D] text-[#0D1B2A]" : "text-gray-200 hover:bg-white/10"
        }`}
      >
        <MapPin size={14} className={isActive("/escort-zurich") ? "text-[#0D1B2A]" : "text-[#D5A021]"} />
        <span>Zürich & Zug</span>
      </Link>

      <Link
        href="/login"
        className="px-2.5 py-2 rounded-xl text-xs font-bold text-gray-200 hover:bg-white/10 flex items-center gap-1.5 border border-white/15"
      >
        <KeyRound size={13} className="text-[#D5A021]" />
        <span>Login</span>
      </Link>

      <Button
        size="sm"
        className="bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] font-black text-xs px-3 h-9 shadow-lg"
        asChild
      >
        <Link href="/create-post">
          <PlusCircle size={14} className="mr-1" />
          Claim
        </Link>
      </Button>

      <Link
        href="/guides/english-tourist-expat-escort-guide-switzerland"
        title="English Guide for Tourists & Expats in Switzerland"
        className="px-2 py-1.5 rounded-lg text-[10px] font-black bg-[#C69C6D]/15 hover:bg-[#C69C6D] text-[#D5A021] hover:text-[#0D1B2A] border border-[#C69C6D]/40 transition-all"
      >
        🇬🇧 EN
      </Link>

      <a
        href="https://www.sbb.ch"
        title="Diskreter Quick-Exit (Sofort zu SBB.ch wechseln)"
        className="px-2 py-1.5 rounded-lg text-[10px] font-black bg-white/5 hover:bg-rose-600/80 text-gray-400 hover:text-white border border-white/10 transition-all"
      >
        ESC
      </a>
    </nav>
  );
}