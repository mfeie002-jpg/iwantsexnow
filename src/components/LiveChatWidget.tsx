import Link from "next/link";
import { ShieldCheck, Calculator, Sparkles, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function LiveChatWidget() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          aria-label="Diskreter Concierge öffnen"
          className="fixed bottom-6 right-4 z-50 rounded-full bg-[#C69C6D] px-5 py-3 text-[#0D1B2A] font-bold shadow-2xl hover:bg-[#b5895a]"
        >
          <Sparkles className="mr-2 shrink-0" size={18} />
          Quick-Finder & Hilfe
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100vw-2rem)] rounded-2xl border border-[#C69C6D]/40 bg-[#0D1B2A] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-white flex items-center gap-2">
            <ShieldCheck size={20} className="text-emerald-400" />
            iWantSexNow.ch Decision-Assistent
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Direkter Zugriff auf Endpreis-Rechner, 47-Portale-Dublettencheck und Provider-Onboarding.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2.5 text-sm my-2">
          <Link
            href="/compare-escorts"
            className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 p-3 hover:border-[#C69C6D]"
          >
            <span className="font-semibold">47 Portale & Endpreise vergleichen</span>
            <Calculator size={16} className="text-[#D5A021]" />
          </Link>
          <Link
            href="/escort-zurich"
            className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 p-3 hover:border-[#C69C6D]"
          >
            <span className="font-semibold">Pilot-Region Zürich & Zug öffnen</span>
            <Sparkles size={16} className="text-emerald-400" />
          </Link>
          <Link
            href="/create-post"
            className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 p-3 hover:border-[#C69C6D]"
          >
            <span className="font-semibold">Eigenes Direktprofil inserieren (B2B)</span>
            <PlusCircle size={16} className="text-[#D5A021]" />
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
