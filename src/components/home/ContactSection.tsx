import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ContactSection() {
  return (
    <section id="contact" className="border-y border-white/10 bg-slate-900 px-4 py-16 text-white">
      <Card className="mx-auto max-w-3xl border-white/20 bg-white/5 p-8 text-center text-white">
        <h2 className="mb-4 text-3xl font-black">Kontakt, Buchungen und Newsletter – noch nicht aktiv</h2>
        <p className="mb-6 text-slate-200">Diese Vorschau nimmt keine Anfragen, Buchungen oder Newsletter-Anmeldungen entgegen. Bitte keine persönlichen Daten eingeben. Es gibt keinen betreuten Supportkanal und keine zugesagte Antwortzeit.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild><Link href="/contact">Kontaktstatus ansehen</Link></Button>
          <Button variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white" asChild><Link href="/faq">Fragen zur Vorschau</Link></Button>
        </div>
      </Card>
    </section>
  );
}
