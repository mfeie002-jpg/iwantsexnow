import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { previewNavigation } from "@/lib/preview-navigation";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menü öffnen"><Menu size={24} /></Button>
      </SheetTrigger>
      <SheetContent className="w-[90vw] overflow-y-auto bg-slate-950 pb-32 text-white sm:max-w-sm">
        <SheetHeader className="mb-6 text-left">
          <SheetTitle className="text-white">iWantSexNow.ch</SheetTitle>
          <SheetDescription className="text-amber-200">Plattform in Vorbereitung · öffentliche Funktionen nicht freigeschaltet</SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile Navigation" className="space-y-5">
          <SheetClose asChild><Link href="/" className="block rounded px-3 py-2 font-bold hover:bg-white/10">Startseite</Link></SheetClose>
          {previewNavigation.map((group) => (
            <section key={group.label}>
              <h2 className="mb-2 px-3 text-sm font-bold text-amber-200">{group.label}</h2>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.href}><SheetClose asChild><Link href={item.href} className="block rounded px-3 py-2 text-sm hover:bg-white/10 focus-visible:bg-white/10">{item.label}</Link></SheetClose></li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
