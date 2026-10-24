import { useState } from "react";
import Link from "next/link";
import { MessageCircle, X, ShieldCheck, Sparkles, Calculator, PlusCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<"client" | "provider">("client");

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {isOpen ? (
        <div className="w-80 sm:w-96 rounded-2xl bg-[#09131E] border-2 border-[#C69C6D]/70 text-white shadow-[0_15px_50px_rgba(0,0,0,0.85)] overflow-hidden">
          <div className="bg-gradient-to-r from-[#0D1B2A] to-[#16293D] p-4 border-b border-[#C69C6D]/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#C69C6D]/20 border border-[#C69C6D] flex items-center justify-center font-serif font-black text-[#D5A021]">
                iW
              </div>
              <div>
                <div className="text-sm font-black text-white">Swiss Shield Concierge</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Zürich, Zug & Cham · Live-Assistent
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
              aria-label="Schließen"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-3 bg-black/40 border-b border-white/10 grid grid-cols-2 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setTab("client")}
              className={
                tab === "client"
                  ? "py-1.5 rounded-lg font-black bg-[#C69C6D] text-[#0D1B2A]"
                  : "py-1.5 rounded-lg font-bold text-gray-300 hover:text-white"
              }
            >
              Für Suchende
            </button>
            <button
              type="button"
              onClick={() => setTab("provider")}
              className={
                tab === "provider"
                  ? "py-1.5 rounded-lg font-black bg-[#C69C6D] text-[#0D1B2A]"
                  : "py-1.5 rounded-lg font-bold text-gray-300 hover:text-white"
              }
            >
              Für Anbieter (B2B)
            </button>
          </div>

          {tab === "client" ? (
            <div className="p-4 space-y-3 text-xs">
              <p className="text-gray-300 leading-relaxed">
                Suchst du ein sofort verfügbares Direktprofil in <strong>Zürich, Zug oder Cham</strong> mit garantiertem Komplettpreis ohne Nachverhandlung?
              </p>
              <div className="space-y-2">
                <Button className="w-full bg-[#C69C6D] hover:bg-[#b5895a] text-[#0D1B2A] font-black text-xs justify-start" asChild>
                  <Link href="/matches" onClick={() => setIsOpen(false)}>
                    <Sparkles size={14} className="mr-2" /> 30-Sekunden Smart-Matcher starten
                  </Link>
                </Button>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 text-xs justify-start" asChild>
                  <Link href="/escort-zurich" onClick={() => setIsOpen(false)}>
                    <ShieldCheck size={14} className="mr-2 text-emerald-400" /> Pilot-Hub Zürich, Zug & Cham (11 Profile)
                  </Link>
                </Button>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 text-xs justify-start" asChild>
                  <Link href="/compare-escorts" onClick={() => setIsOpen(false)}>
                    <Calculator size={14} className="mr-2 text-[#D5A021]" /> Schweizer Endpreis-Matrix öffnen
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-3 text-xs">
              <p className="text-gray-300 leading-relaxed">
                Dein Inserat wurde im Schweizer Index gefunden? Übernimm dein Profil kostenlos und sichere dir <strong>2 Gratis Lead-Credits (CHF 50 Wert)</strong>:
              </p>
              <div className="space-y-2">
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-[#0D1B2A] font-black text-xs justify-start" asChild>
                  <Link href="/create-post" onClick={() => setIsOpen(false)}>
                    <PlusCircle size={14} className="mr-2" /> Profil kostenlos übernehmen (+2 Credits)
                  </Link>
                </Button>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 text-xs justify-start" asChild>
                  <Link href="/creator-dashboard" onClick={() => setIsOpen(false)}>
                    <Send size={14} className="mr-2 text-[#D5A021]" /> Zum Provider Lead-Tresor
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-12 px-5 bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] font-black shadow-[0_8px_25px_rgba(213,160,33,0.45)] flex items-center gap-2"
        >
          <MessageCircle size={18} />
          <span className="text-xs">Swiss Concierge</span>
        </Button>
      )}
    </div>
  );
}