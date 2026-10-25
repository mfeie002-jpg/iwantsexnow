import Link from "next/link";
import { ChevronDown, PlusCircle } from "lucide-react";

export function Navigation() {
  return (
    <nav className="hidden lg:flex items-center gap-4 text-xs font-semibold text-gray-200">
      <Link href="/search" className="px-3 py-1.5 rounded-lg hover:bg-white/5 hover:text-[#C8A97E] transition">
        Escorts & Filter
      </Link>
      <Link href="/escort-zurich" className="px-3 py-1.5 rounded-lg hover:bg-white/5 hover:text-[#C8A97E] transition">
        Zürich & Zug
      </Link>
      <Link href="/rankings" className="px-3 py-1.5 rounded-lg hover:bg-white/5 hover:text-[#C8A97E] transition">
        Clubs & Studios
      </Link>
      <Link href="/reviews" className="px-3 py-1.5 rounded-lg hover:bg-white/5 hover:text-[#C8A97E] transition">
        Portal-Reviews
      </Link>
      <Link href="/live-cam" className="px-3 py-1.5 rounded-lg text-rose-300 hover:bg-rose-500/10 transition">
        1:1 Live-Cam
      </Link>
      <Link href="/advertise" className="px-3 py-1.5 rounded-lg text-[#C8A97E] hover:underline transition">
        Für Models (1. Monat Gratis)
      </Link>
      <Link
        href="/create-post"
        className="inline-flex items-center gap-1.5 rounded-lg bg-[#C8A97E] px-3.5 py-2 text-xs font-bold text-[#090A0F]"
      >
        <PlusCircle size={14} /> Inserat / Claim
      </Link>
    </nav>
  );
}