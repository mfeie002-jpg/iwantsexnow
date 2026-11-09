import React from "react";
import Head from "next/head";
import Link from "next/link";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { Doodle, EmptyArt, Wave } from "@/components/visuals";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-papier text-tinte">
      <Head>
        <title>Seite nicht gefunden | iwantsexnow.ch</title>
        <meta name="robots" content="noindex" />
      </Head>
      <LuxuryHeader />
      <section className="field-blush relative isolate overflow-hidden">
        <div className="mx-auto grid max-w-5xl items-center gap-8 px-4 pb-20 pt-12 sm:px-6 md:grid-cols-[1fr_auto] md:gap-12 md:pt-16">
          <div className="relative z-10">
            <p className="hand text-[1.8rem] leading-none text-kirsche-tief">Hoppla, hier ist nichts.</p>
            <h1 className="mt-1 font-display text-[clamp(2.6rem,7vw,5rem)] font-extrabold leading-[1] tracking-tight">Diese Seite gibt es nicht.</h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-tinte/80">
              Vielleicht wurde sie verschoben oder der Link ist veraltet. Von der Suche aus findest du jedes Profil und jeden Club in der Schweiz.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/" className="brass-button inline-flex min-h-[52px] items-center px-7">
                Zur Startseite
              </Link>
              <Link href="/search" className="emerald-button inline-flex min-h-[52px] items-center px-7">
                Zur Suche
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-64 rotate-3 md:w-72" aria-hidden="true">
            <div className="polaroid" style={{ paddingBottom: "0.65rem" }}>
              <span className="tape" style={{ top: "-0.75rem", left: "50%", marginLeft: "-2.6rem", ["--r" as string]: "-4deg" }} />
              <EmptyArt className="block h-auto w-full" />
            </div>
          </div>
          <Doodle kind="star" color="#1e2247" className="pointer-events-none absolute left-[46%] top-8 hidden h-10 w-10 -rotate-12 md:block" />
        </div>
        <Wave color="#fbfaf8" className="absolute inset-x-0 bottom-[-1px]" />
      </section>
    </div>
  );
}
