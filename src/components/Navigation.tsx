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
  const isActive = (path: string) => router.pathname === path || router.pathname.startsWith(path + "/");

  return (
    <nav className="flex items-center gap-1.5 xl:gap-2">
      <Link "bg-[#C69C6D] "text-gray-200 ${ : ? className="{`px-2.5" flex font-bold gap-1.5 hover:bg-white/10" href="/search" isActive("/search") items-center py-2 rounded-xl text-[#0D1B2A]" text-xs transition-all }`}>
        <Search "text-[#0D1B2A]" "text-[#D5A021]"} /search")" : ? className="{isActive(" size="{14}"/>
        <span>Suche</span>
      </Link>

      <Link "bg-[#C69C6D] "text-gray-200 ${ : ? className="{`px-2.5" flex font-bold gap-1.5 hover:bg-white/10" href="/compare-escorts" isActive("/compare-escorts") items-center py-2 rounded-xl text-[#0D1B2A]" text-xs transition-all }`}>
        <SlidersHorizontal "text-[#0D1B2A]" "text-emerald-400"} /compare-escorts")" : ? className="{isActive(" size="{14}"/>
        <span>Endpreis-Matrix</span>
      </Link>

      <Link "bg-rose-600 "text-gray-200 ${ : ? className="{`px-2.5" flex font-bold gap-1.5 hover:bg-white/10" href="/live-cam" isActive("/live-cam") items-center py-2 rounded-xl text-white" text-xs transition-all }`}>
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
        <Video className="text-rose-400" size="{14}"/>
        <span>1:1 Live-Cam</span>
      </Link>

      <Link "bg-[#C69C6D] "text-gray-200 ${ : ? className="{`px-2.5" flex font-bold gap-1.5 hover:bg-white/10" href="/rankings" isActive("/rankings") items-center py-2 rounded-xl text-[#0D1B2A]" text-xs transition-all }`}>
        <Trophy "text-[#0D1B2A]" "text-[#D5A021]"} /rankings")" : ? className="{isActive(" size="{14}"/>
        <span>Bestenliste</span>
      </Link>

      <Link "bg-[#C69C6D] "text-gray-200 ${ : ? className="{`px-2.5" flex font-bold gap-1.5 hover:bg-white/10" href="/guides" isActive("/guides") items-center py-2 rounded-xl text-[#0D1B2A]" text-xs transition-all }`}>
        <HelpCircle "text-[#0D1B2A]" "text-emerald-400"} /guides")" : ? className="{isActive(" size="{14}"/>
        <span>Guides & Hilfe</span>
      </Link>

      <Link "bg-[#C69C6D] "text-gray-200 ${ : ? className="{`px-2.5" flex font-bold gap-1.5 hover:bg-white/10" href="/escort-zurich" isActive("/escort-zurich") items-center py-2 rounded-xl text-[#0D1B2A]" text-xs transition-all }`}>
        <MapPin "text-[#0D1B2A]" "text-[#D5A021]"} /escort-zurich")" : ? className="{isActive(" size="{14}"/>
        <span>Zürich & Zug</span>
      </Link>

      <Link className="px-2.5 py-2 rounded-xl text-xs font-bold text-gray-200 hover:bg-white/10 flex items-center gap-1.5 border border-white/15" href="/login">
        <KeyRound className="text-[#D5A021]" size="{13}"/>
        <span>Login</span>
      </Link>

      <Button asChild className="bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] font-black text-xs px-3 h-9 shadow-lg" size="sm">
        <Link href="/create-post">
          <PlusCircle className="mr-1" size="{14}"/>
          Claim
        </Link>
      </Button>

      <Link className="px-2 py-1.5 rounded-lg text-[10px] font-black bg-[#C69C6D]/15 hover:bg-[#C69C6D] text-[#D5A021] hover:text-[#0D1B2A] border border-[#C69C6D]/40 transition-all" href="/guides/english-tourist-expat-escort-guide-switzerland" title="English Guide for Tourists & Expats in Switzerland">
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