import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

/** Preview help only: no message collection, simulated staff or delivery promises. */
export function LiveChatWidget() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button aria-label="Vorschau-Hilfe öffnen" className="fixed bottom-6 right-4 z-50 max-w-[45vw] rounded-full bg-slate-800 px-4 py-3 text-white shadow-xl hover:bg-slate-700">
          <HelpCircle className="mr-2 shrink-0" size={20} />Vorschau-Hilfe
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100vw-2rem)] rounded-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hilfe zur Vorschau</DialogTitle>
          <DialogDescription>Kein Live-Support: Es werden keine Nachrichten angenommen oder an ein Team zugestellt.</DialogDescription>
        </DialogHeader>
        <p className="text-sm">Alle Profile und Aktivitätsanzeigen sind Beispieldaten. Registrierung, Buchungen und Zahlungen sind noch nicht aktiv.</p>
        <div className="flex flex-wrap gap-3">
          <Button asChild><Link href="/faq">Fragen zur Vorschau</Link></Button>
          <Button variant="outline" asChild><Link href="/contact">Kontaktstatus</Link></Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
