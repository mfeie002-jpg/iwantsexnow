import Link from "next/link";
import { useRouter } from "next/router";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  PlusCircle,
  Trophy,
  KeyRound,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const router = useRouter();
  const isActive = (path: string) => router.pathname === path;

  return (
    <nav className="flex items-center gap-2 xl:gap-3">
      <Link
        href="/search"
        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
          isActive("/search") ? "bg-[#C69C6D] text-[#0D1B2A]" : "text-gray-200 hover:bg-white/10"
        }`}
      >
        <Search size={14} className={isActive("/search") ? "text-[#0D1B2A]" : "text-[#D5A021]"} />
        <span>Meta-Suche</span>
      </Link>

      <Link
        href="/compare-escorts"
        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
          isActive("/compare-escorts") ? "bg-[#C69C6D] text-[#0D1B2A]" : "text-gray-200 hover:bg-white/10"
        }`}
      >
        <SlidersHorizontal size={14} className={isActive("/compare-escorts") ? "text-[#0D1B2A]" : "text-emerald-400"} />
        <span>Endpreis-Matrix</span>
      </Link>

      <Link
        href="/rankings"
        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
          isActive("/rankings") ? "bg-[#C69C6D] text-[#0D1B2A]" : "text-gray-200 hover:bg-white/10"
        }`}
      >
        <Trophy size={14} className={isActive("/rankings") ? "text-[#0D1B2A]" : "text-[#D5A021]"} />
        <span>Bestenliste & Ratings</span>
      </Link>

      <Link
        href="/escort-zurich"
        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
          isActive("/escort-zurich") ? "bg-[#C69C6D] text-[#0D1B2A]" : "text-gray-200 hover:bg-white/10"
        }`}
      >
        <MapPin size={14} className={isActive("/escort-zurich") ? "text-[#0D1B2A]" : "text-[#D5A021]"} />
        <span>Zürich & Zug</span>
      </Link>

      <Link
        href="/login"
        className="px-3 py-2 rounded-xl text-xs font-bold text-gray-200 hover:bg-white/10 flex items-center gap-1.5 border border-white/15"
      >
        <KeyRound size={13} className="text-[#D5A021]" />
        <span>Login / Cockpit</span>
      </Link>

      <Button
        size="sm"
        className="bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] font-black text-xs px-3.5 h-9 shadow-lg"
        asChild
      >
        <Link href="/create-post">
          <PlusCircle size={14} className="mr-1.5" />
          Profil übernehmen
        </Link>
      </Button>
    </nav>
  );
}