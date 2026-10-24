import Link from "next/link";
import SEO from "@/components/SEO";
export default function PreviewAccess({ feature }: { feature: string }) {
 return <main className="min-h-screen bg-slate-950 px-5 py-20 text-white"><SEO title={feature + " | iWantSexNow.ch"} description="Dieser Bereich ist noch nicht freigeschaltet." /><div className="mx-auto max-w-2xl"><h1 className="text-3xl font-bold">{feature} noch nicht freigeschaltet</h1><p className="my-6">Hier werden keine persönlichen Angaben übermittelt, Nachrichten versendet oder Zahlungen ausgelöst.</p><nav className="flex flex-wrap gap-5"><Link href="/">Startseite</Link><Link href="/faq">Häufige Fragen</Link><Link href="/contact">Kontaktstatus</Link><Link href="/privacy">Datenschutz</Link><Link href="/terms">Nutzungsbedingungen</Link></nav></div></main>;
}
