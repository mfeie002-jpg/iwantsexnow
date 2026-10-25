import Link from "next/link";
import { PlusCircle } from "lucide-react";

export function Navigation() {
  return (
    <nav aria-label="Hauptnavigation" className="hidden lg:flex items-center gap-5 text-xs font-semibold text-gray-200">
      <Link href="/search" className="hover:text-[#C8A97E] transition">
        Alle 7.021+ Profile
      </Link>
      <Link href="/rankings" className="hover:text-[#C8A97E] transition">
        🏆 Top Rankings & Clubs
      </Link>
      <Link href="/reviews" className="hover:text-[#C8A97E] transition">
        ⭐ Portal-Reviews
      </Link>
      <Link href="/live-cam" className="text-rose-300 hover:text-rose-200 transition flex items-center gap-1.5 font-bold">
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" /> 1:1 Live-Cam
      </Link>
      <Link href="/hotels" className="hover:text-[#C8A97E] transition">
        🏨 Diskrete Hotels
      </Link>
      <Link href="/for-clients" className="hover:text-[#C8A97E] transition">
        Für Kunden
      </Link>
      <Link href="/advertise" className="text-emerald-300 hover:text-emerald-200 transition font-bold">
        Für Models (1. Monat Gratis)
      </Link>
      <Link
        href="/create-post"
        className="inline-flex items-center gap-1.5 rounded-xl bg-[#C8A97E] hover:bg-[#d8b98e] px-3.5 py-2 text-xs font-extrabold text-[#0D1826] transition"
      >
        <PlusCircle size={14} />
        Gratis Inserieren
      </Link>
      <a
        href="https://www.sbb.ch"
        title="Diskreter Quick-Exit (Sofort zu SBB.ch wechseln)"
        className="px-2 py-1 rounded-lg text-[10px] font-black bg-white/5 hover:bg-rose-600/80 text-gray-400 hover:text-white border border-white/10 transition"
      >
        ESC
      </a>
    </nav>
  );
}