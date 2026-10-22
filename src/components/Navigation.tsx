import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { previewNavigation } from "@/lib/preview-navigation";

export function Navigation() {
  return (
    <nav aria-label="Vorschau-Navigation" className="hidden items-center gap-4 md:flex">
      {previewNavigation.map((group) => (
        <details key={group.label} className="relative">
          <summary className="flex cursor-pointer list-none items-center gap-1 rounded px-3 py-2 font-semibold text-current focus-visible:outline focus-visible:outline-2">
            {group.label}<ChevronDown size={16} aria-hidden="true" />
          </summary>
          <ul className="absolute left-0 top-full z-50 mt-2 w-72 space-y-1 rounded-xl border border-slate-200 bg-white p-3 text-slate-900 shadow-xl">
            {group.items.map((item) => (
              <li key={item.href}><Link href={item.href} className="block rounded px-3 py-2 text-sm hover:bg-slate-100 focus-visible:bg-slate-100">{item.label}</Link></li>
            ))}
          </ul>
        </details>
      ))}
    </nav>
  );
}
