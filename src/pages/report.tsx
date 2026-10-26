import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { CorporateFooter } from "@/components/CorporateFooter";
export default function ReportPage() {
  return <div className="min-h-screen bg-[#13161C] text-white"><SEO title="Meldungen und Entfernung | iwantsexnow.ch" noindex /><LuxuryHeader />
    <main className="mx-auto max-w-2xl px-6 py-16 space-y-5"><h1 className="text-3xl font-serif">Meldungen und Entfernung</h1>
    <p>Der vertrauliche Meldeweg ist noch nicht freigeschaltet. Hier werden keine Meldungen gespeichert oder versendet.</p>
    <p>Bis die Veröffentlichungsgrundlage und die dauerhafte Entfernung geprüft sind, werden importierte Einträge nicht öffentlich angezeigt.</p>
    <p>Bitte keine Ausweisdokumente oder vertraulichen Angaben übermitteln.</p></main><CorporateFooter /></div>;
}
