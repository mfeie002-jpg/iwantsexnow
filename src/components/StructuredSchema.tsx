import React from "react";
import Head from "next/head";

export interface FaqItem {
  question: string;
  answer: string;
}

export function StructuredSchema({
  pageType = "directory",
  cityName,
  cantonCode,
  faqs = [],
}: {
  pageType?: "directory" | "city_price" | "review";
  cityName?: string;
  cantonCode?: string;
  faqs?: FaqItem[];
}) {
  const defaultFaqs: FaqItem[] =
    faqs.length > 0
      ? faqs
      : cityName
      ? [
          {
            question: `Was kostet ein Escort- oder Studio-Besuch in ${cityName} (${cantonCode || "CH"})?`,
            answer: `Veröffentlichte Richtwerte in ${cityName} liegen meist zwischen CHF 250 und CHF 500 für 60 Minuten. Niedrigere Angaben (ab CHF 150) beziehen sich häufig auf 30 Minuten. Prüfen Sie im jeweiligen Profil stets die angegebene Dauer sowie eventuelle Zusatzkosten für Hotel- oder Hausbesuche (Outcall).`,
          },
          {
            question: `Was bedeutet die Kennzeichnung „Jetzt verfügbar“ auf iwantsexnow.ch?`,
            answer: `„Jetzt verfügbar“ wird ausschliesslich dann angezeigt, wenn der Anbieter diesen Status in seinem eigenen Konto aktiv bestätigt hat (inklusive Zeitstempel). Der Status läuft nach 4 Stunden automatisch ab.`,
          },
          {
            question: `Woher stammen die Profile in ${cityName}?`,
            answer: `Wir unterscheiden transparent zwischen selbst verwalteten Direktprofilen (mit bestätigtem Anbieterkonto) und gekennzeichneten Einträgen aus öffentlich zugänglichen Schweizer Verzeichnissen.`,
          },
        ]
      : [
          {
            question: "Wie unterscheidet iwantsexnow.ch zwischen eigenen Profilen und externen Quellen?",
            answer: "Jede Profilkarte zeigt offen, ob ein Eintrag direkt vom Anbieter selbst verwaltet wird oder aus einem externen Schweizer Verzeichnis stammt. Mehrfach-Inserate können über 'Quellen ansehen' direkt verglichen werden.",
          },
          {
            question: "Können Anbieter ihren Eintrag kostenlos verwalten oder entfernen?",
            answer: "Ja. Bestehende Einträge können kostenlos übernommen, korrigiert, pausiert oder über /report auch ohne Registrierung entfernt werden.",
          },
        ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: defaultFaqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "iwantsexnow.ch – Schweizer Profilverzeichnis & Portalvergleich",
    url: "https://iwantsexnow.ch",
    inLanguage: ["de-CH", "fr-CH", "it-CH"],
    potentialAction: {
      "@type": "SearchAction",
      target: "https://iwantsexnow.ch/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </Head>
  );
}
export default StructuredSchema;
