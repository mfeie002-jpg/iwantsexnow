import Link from "next/link";
import { SEO } from "@/components/SEO";

/**
 * Safe public placeholder until a server-side authentication, age-check
 * and account lifecycle are implemented and production-tested.
 * Do not collect credentials into localStorage in the pre-launch version.
 */
export default function PreviewAccess({ feature }: { feature: string }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-dusk-100 px-4 py-20 text-tinte">
      <SEO
        title={feature + " | iWantSexNow.ch – Vorschau"}
        description="Diese Funktion ist in Vorbereitung. Die bisherigen Benutzerkonten waren nur eine lokale Demofunktion."
      />
      <div className="mx-auto max-w-2xl rounded-2xl border border-sun-400/30 bg-tinte/[0.06] p-8 text-center shadow-2xl">
        <p className="mb-3 text-[13px] font-bold text-sun-700">Entwicklungs-Vorschau / 18+</p>
        <h1 className="mb-5 text-3xl font-extrabold md:text-4xl">{feature} noch nicht freigeschaltet</h1>
        <p className="mb-5 text-base leading-relaxed text-gray-800">
          Wir bereiten die echte Plattform vor. Bis zur Einführung eines sicheren Logins,
          der Alters- und Profilprüfung sowie der erforderlichen Einwilligungen
          gibt es keine öffentlichen Benutzerkonten oder realen Buchungen.
        </p>
        <p className="mb-7 rounded-lg border border-tinte/30 bg-tinte/5 p-3 text-sm text-sun-900">
          Bitte keine persönlichen Daten, Passwörter oder Zahlungsinformationen eingeben.
          Alle dargestellten Profile und Kennzahlen sind fiktive Demoinhalte.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/demo-accounts" className="rounded-lg bg-sun-400 px-5 py-3 font-bold text-gray-100 hover:bg-sun-300">
            Design-Demo ansehen
          </Link>
          <Link href="/" className="rounded-lg border border-tinte/40 px-5 py-3 font-semibold text-tinte hover:bg-tinte/[0.06]">
            Zur Startseite
          </Link>
        </div>
      </div>
    </main>
  );
}
