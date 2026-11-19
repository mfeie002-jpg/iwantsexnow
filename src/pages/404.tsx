import React from "react";
import Head from "next/head";
import Link from "next/link";
import { LuxuryHeader } from "@/components/LuxuryHeader";

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Head>
        <title>Seite nicht gefunden | iwantsexnow.ch</title>
        <meta name="robots" content="index,follow" />
      </Head>
      <LuxuryHeader />
      <header className="mast">
        <div className="mast-grid mast-grid-photo">
          <div>
            <p className="kicker">404</p>
            <h1>Diese Seite gibt es nicht.</h1>
            <p className="dek">
              Der Link ist veraltet oder die Adresse hat sich verschrieben. Suche und Städte führen zu jedem Profil und jedem Club, der im Verzeichnis steht.
            </p>
            <div className="mast-actions">
              <Link href="/" className="brass-button">
                Zur Startseite
              </Link>
              <Link href="/search" className="text-link">
                Zur Suche
              </Link>
            </div>
          </div>
          <figure className="mast-figure">
            <img src="/editorial/editorial-alps.jpg" alt="" loading="lazy" decoding="async" />
          </figure>
        </div>
      </header>
    </div>
  );
}
