import Link from "next/link";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { SEO } from "@/components/SEO";

/** Pages that do not yet have a real account flow. No credentials are collected. */
export default function PreviewAccess({ feature }: { feature: string }) {
  return (
    <div className="min-h-screen">
      <SEO title={feature + " | iwantsexnow.ch"} description="Diese Funktion hat noch keinen eigenen Konten-Ablauf." />
      <LuxuryHeader />
      <header className="mast">
        <div className="mast-grid mast-grid-photo">
          <div>
            <p className="kicker">Noch ohne Konto</p>
            <h1>{feature}</h1>
            <p className="dek">
              Hier gibt es noch kein öffentliches Benutzerkonto. Die Merkliste bleibt lokal im Browser. Anbieterinnen melden sich mit ihrer Nummer an.
            </p>
            <div className="mast-actions">
              <Link href="/login" className="brass-button">
                Anbieter-Login
              </Link>
              <Link href="/" className="text-link">
                Zur Startseite
              </Link>
            </div>
          </div>
          <figure className="mast-figure">
            <img src="/editorial/editorial-salon.jpg" alt="" />
          </figure>
        </div>
      </header>
    </div>
  );
}
