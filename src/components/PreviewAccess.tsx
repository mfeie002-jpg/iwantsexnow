import Link from "next/link";
import { SEO } from "@/components/SEO";

/**
 * Safe public placeholder until a server-side authentication, age-check
 * and account lifecycle are implemented and production-tested.
 * Do not collect credentials into localStorage in the pre-launch version.
 */
export default function PreviewAccess({ feature }: { feature: string }) {
  return (
    <main className="min-h-screen bg-[#13161C] px-4 py-20 text-white">
      <SEO
        title={feature + " | iWantSexNow.ch – Vorschau"}
        description="Diese Funktion ist in Vorbereitung. Die bisherigen Benutzerkonten waren nur eine lokale Demofunktion."
      />
      <div className="mx-auto max-w-2xl rounded-2xl border border-amber-400/30 bg-white/10 p-8 text-center shadow-2xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-amber-300">Entwicklungs-Vorschau / 18+</p>
        <h1 className="mb-5 text-3xl font-extrabold md:text-4xl">{feature} noch nicht freigeschaltet</h1>
        <p className="mb-5 text-base leading-relaxed text-slate-200">
          Wir bereiten die echte Plattform vor. Bis zur Einführung eines sicheren Logins,
          der Alters- und Profilprüfung sowie der erforderlichen Einwilligungen
          gibt es keine öffentlichen Benutzerkonten oder realen Buchungen.
        </p>
        <p className="mb-7 rounded-lg border border-white/20 bg-black/20 p-3 text-sm text-amber-100">
          Bitte keine persönlichen Daten, Passwörter oder Zahlungsinformationen eingeben.
          Importierte Einträge werden erst nach dokumentierter Freigabe veröffentlicht.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/reviews" className="rounded-lg bg-[#C6A574] px-5 py-3 font-bold text-slate-950 hover:bg-amber-300">
            Portalberichte ansehen
          </Link>
          <Link href="/" className="rounded-lg border border-white/40 px-5 py-3 font-semibold text-white hover:bg-white/10">
            Zur Startseite
          </Link>
        </div>
      </div>
    </main>
  );
}
