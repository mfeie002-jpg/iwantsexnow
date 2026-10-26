export interface PortalReviewItem {
  rank: number;
  slug: string;
  name: string;
  domain: string;
  lastAudited: string;
  visitorScore: number;
  providerScore: number;
  verdictBadge: string;
  bestFor: string;
  activeListingsCh: string;
  avgCostForModelsChf: string;
  verificationStandard: string;
  priceTransparency: string;
  monetizationFeatures: string;
  summary: string;
  whyThisRank: string;
  pros: string[];
  cons: string[];
  deepAnalysis: {
    overview: string;
    pricingForModels: string;
    experienceForClients: string;
    fakeAndDuplicateRate: string;
    finalVerdict: string;
  };
}

export const OUR_PLATFORM_DISCLOSURE = {
  name: "iwantsexnow.ch (Unser eigenes Angebot – ausserhalb der Fremd-Wertung)",
  role: "Schweizer Vergleichs-, Such- & Direktverwaltungs-Plattform",
  note: "Hinweis zur Transparenz: Da wir iwantsexnow.ch selbst betreiben, vergeben wir uns bewusst keine redaktionelle Eigen-Note und keinen selbst verliehenen 'Testsieg'. Besucher und Anbieter können unser Angebot anhand derselben offengelegten Kriterien selbst prüfen.",
  highlights: [
    "Kostenlose Basis-Profilkontrolle (Angaben selbst korrigieren, pausieren oder entfernen)",
    "Strikte Trennung zwischen externen Quellen-Einträgen, selbst verwalteten Profilen und geprüfter Identität",
    "Visuelle Kategorien- und Regionsauswahl ohne Pflicht-Registrierung für Besucher",
    "Nachvollziehbare Echtzeit-Messung von Aufrufen und Weiterklicks ohne erfundene Zähler"
  ]
};

export const SWISS_PORTAL_TOP10: PortalReviewItem[] = [
  {
    rank: 1,
    slug: "xdate-review",
    name: "xdate.ch",
    domain: "xdate.ch",
    lastAudited: "25. Oktober 2026",
    visitorScore: 8.3,
    providerScore: 7.4,
    verdictBadge: "Grösste Reichweite in der Deutschschweiz",
    bestFor: "Hohe Anzahl an Inseraten in Zürich, Mittelland & Ostschweiz",
    activeListingsCh: "ca. 3.200 – 3.800 (inkl. Mehrfachschaltungen)",
    avgCostForModelsChf: "Abhängig von Laufzeit & Push-Paketen (öffentlich teils erst nach Login einsehbar)",
    verificationStandard: "Optionales Foto-Siegel; keine durchgängige Live-Verfügbarkeitsprüfung",
    priceTransparency: "Mittel (Preise oft im Freitext, teils Kurztarife als Blickfang)",
    monetizationFeatures: "Klassisches Kontakt-Inserat mit kostenpflichtigen Hervorhebungen",
    summary: "xdate.ch ist nach aktivem Inseratevolumen und Markenbekanntheit der grösste klassische Anzeigenmarkt in der Deutschschweiz, erfordert von Anbieterinnen jedoch regelmässige Zukäufe für obere Listenplätze.",
    whyThisRank: "Führend bei der reinen Abdeckung in der Deutschschweiz (Zürich, Aargau, Bern, Basel, Luzern). Abzüge gibt es bei der Übersichtlichkeit durch Mehrfach-Inserate und der geringen Vorab-Preistransparenz.",
    pros: [
      "Sehr hohe Bekanntheit und aktive Nutzung in der Deutschschweiz",
      "Schnelle Veröffentlichung für kurzfristig anwesende Anbieterinnen",
      "Breite Abdeckung von Einzelanbieterinnen bis zu Studios"
    ],
    cons: [
      "Hoher Sichtbarkeitsdruck: Ohne kostenpflichtige Push-Optionen sinken Inserate in grossen Städten schnell ab",
      "Mehrfachschaltungen derselben Telefonnummer in mehreren Regionen erschweren den Vergleich",
      "Ausgaben und tatsächlicher Rücklauf lassen sich vorab schwer kalkulieren"
    ],
    deepAnalysis: {
      overview: "Geprüft am 25. Oktober 2026: xdate.ch bildet für die Deutschschweiz den wichtigsten Referenzmarkt für klassische Erotik- und Escort-Kleinanzeigen.",
      pricingForModels: "Die Grundschaltung wird durch diverse Zusatzoptionen (Top-Listenplatz, Farbhervorhebung, automatisches Hochschieben) ergänzt. Für Anbieterinnen in stark umkämpften Regionen wie Zürich entstehen dadurch laufende Werbekosten.",
      experienceForClients: "Besucher finden eine sehr grosse Auswahl, müssen Preisangaben und tatsächlich enthaltene Leistungen jedoch oft mühsam aus Fliesstexten herauslesen.",
      fakeAndDuplicateRate: "Da identische Rufnummern oft parallel für verschiedene Orte inseriert werden, empfiehlt sich vorab ein Abgleich der Quellenangaben.",
      finalVerdict: "Für Reichweite in der Deutschschweiz der wichtigste Klassiker; bei Struktur, Datenkontrolle und Vergleichbarkeit jedoch mit typischen Schwächen traditioneller Kleinanzeigenmärkte."
    }
  },
  {
    rank: 2,
    slug: "fgirl-review",
    name: "fgirl.ch",
    domain: "fgirl.ch",
    lastAudited: "25. Oktober 2026",
    visitorScore: 8.4,
    providerScore: 7.8,
    verdictBadge: "Marktführer in der Romandie (Genf & Lausanne)",
    bestFor: "Westschweiz (Genève, Vaud, Valais, Fribourg) & strukturierte Studio-Darstellung",
    activeListingsCh: "ca. 2.100 – 2.600",
    avgCostForModelsChf: "Monats- & Wochenpakete (je nach Region und Sichtbarkeitsstufe)",
    verificationStandard: "Gute Bildkontrolle in den Westschweizer Kernkantonen",
    priceTransparency: "Mittel (Details meist auf der Profil-Unterseite)",
    monetizationFeatures: "Verzeichnis-Profil mit Galerie und Direktkontakt",
    summary: "In der französischsprachigen Schweiz ist fgirl.ch die klar führende Plattform mit einer aufgeräumten Bilddarstellung, während die Abdeckung in der Deutschschweiz deutlich kleiner ausfällt.",
    whyThisRank: "Sehr starke regionale Marktstellung in Genf und Lausanne sowie gute mobile Bildergalerien.",
    pros: [
      "Klare Nummer 1 in Genf, Lausanne, Fribourg und Wallis",
      "Übersichtliche Trennung zwischen unabhängigen Escorts, Salons und Massagen",
      "Saubere mobile Profilansichten"
    ],
    cons: [
      "In Zürich, Zug und der Ostschweiz deutlich geringere Abdeckung als in der Romandie",
      "Direkter Preis- und Leistungsvergleich erfordert das Öffnen vieler Einzelprofile"
    ],
    deepAnalysis: {
      overview: "Geprüft am 25. Oktober 2026: fgirl.ch ist das Referenzverzeichnis für die Westschweiz.",
      pricingForModels: "Für Anbieterinnen in der Romandie kaum verzichtbar; in der Deutschschweiz ist das Kosten-Nutzen-Verhältnis noch im Aufbau.",
      experienceForClients: "Angenehme visuelle Führung, jedoch ohne quellenübergreifenden Vergleich.",
      fakeAndDuplicateRate: "Solide Bildqualität durch redaktionelle Prüfungen.",
      finalVerdict: "Erste Wahl für die Westschweiz."
    }
  },
  {
    rank: 3,
    slug: "and6-review",
    name: "and6.com",
    domain: "and6.com",
    lastAudited: "25. Oktober 2026",
    visitorScore: 7.8,
    providerScore: 7.3,
    verdictBadge: "Stark bei Clubs, Laufhäusern & Studios",
    bestFor: "Stationäre Etablissements & Tages-Anwesenheiten im Raum Zürich / Mittelland",
    activeListingsCh: "ca. 1.800 – 2.200",
    avgCostForModelsChf: "Einzel- & Club-Pakete plus starker Fokus auf Bannerplätze",
    verificationStandard: "Fokus auf gewerbliche Studio- und Club-Adressen",
    priceTransparency: "Mittel bis Gering (oft fehlende Standardtarife auf Übersichtsseiten)",
    monetizationFeatures: "Listenplätze und grossflächige Werbebanner",
    summary: "and6.com ist stark bei etablierten Schweizer Clubs, Kontaktbars und Massagesalons verankert, wirkt auf Mobilgeräten durch viele Werbebanner jedoch unruhig.",
    whyThisRank: "Wichtige Quelle für Club- und Studio-Besetzungen im Raum Zürich und Aargau.",
    pros: [
      "Gute Übersicht über Schweizer Laufhäuser, Clubs und Studios",
      "Regelmässige Aktualisierung von Club-Anwesenheitslisten"
    ],
    cons: [
      "Hohe Banner-Dichte erschwert die schnelle Orientierung auf dem Smartphone",
      "Für unabhängige Einzelanbieterinnen oft schwer gegen grosse Studio-Budgets sichtbar zu bleiben"
    ],
    deepAnalysis: {
      overview: "Geprüft am 25. Oktober 2026: Traditionelles Portal mit starkem B2B-Fokus auf Schweizer Etablissements.",
      pricingForModels: "Vor allem für Studios mit mehreren Zimmern kalkulierbar; für Einzelprofile durch Banner-Konkurrenz anspruchsvoll.",
      experienceForClients: "Nützlich für Club-Besucher, weniger übersichtlich für gezielte Filterung.",
      fakeAndDuplicateRate: "Viele Studio-Sammelprofile mit wechselnder Besetzung.",
      finalVerdict: "Solide Adresse für Clubs und Studios."
    }
  },
  {
    rank: 4,
    slug: "rosalon-review",
    name: "rosalon.ch",
    domain: "rosalon.ch",
    lastAudited: "25. Oktober 2026",
    visitorScore: 7.9,
    providerScore: 6.8,
    verdictBadge: "Reiner Meta-Suchindex über Drittportale",
    bestFor: "Quellenübergreifende Text- und Preisübersicht",
    activeListingsCh: "Grosses aggregiertes Archiv (inkl. historischer Einträge)",
    avgCostForModelsChf: "Passiver Index ohne ausgebautes Self-Service-Cockpit",
    verificationStandard: "Übernimmt Angaben der Ursprungsportale ohne eigene Identitätsprüfung",
    priceTransparency: "Gut (stellt gefundene Preisangaben nebeneinander)",
    monetizationFeatures: "Reine Weiterleitungs- und Index-Plattform",
    summary: "Rosalon bündelt Inserate aus zahlreichen Schweizer Portalen in einer nüchternen Suchoberfläche, bietet Anbieterinnen jedoch kaum Werkzeuge zur aktiven eigenen Profilpflege.",
    whyThisRank: "Guter reiner Daten-Aggregator, jedoch ohne eigene Verifizierungsprozesse oder direkte Anbieterverwaltung.",
    pros: [
      "Breite Sammlung verschiedener Schweizer Quellportale",
      "Hilfreich zum Erkennen von Mehrfachinseraten"
    ],
    cons: [
      "Keine eigene Identitäts- oder Echtzeit-Verfügbarkeitsprüfung",
      "Für Anbieterinnen kaum Möglichkeiten, das eigene Profil aktiv zu gestalten"
    ],
    deepAnalysis: {
      overview: "Geprüft am 25. Oktober 2026: Bekannter Schweizer Meta-Index.",
      pricingForModels: "Da es sich primär um einen Suchindex handelt, steht keine klassische Profilverwaltung im Vordergrund.",
      experienceForClients: "Funktional für reine Recherche, optisch und bei der Aktualitätsprüfung jedoch eingeschränkt.",
      fakeAndDuplicateRate: "Abhängig von der Datenqualität der gecrawlten Quellseiten.",
      finalVerdict: "Gute Referenz für reine Aggregation."
    }
  },
  {
    rank: 5,
    slug: "kaufmich-review",
    name: "kaufmich.com (CH)",
    domain: "kaufmich.com",
    lastAudited: "25. Oktober 2026",
    visitorScore: 7.1,
    providerScore: 7.2,
    verdictBadge: "DACH-Community mit Nachrichten-Bezahlschranke",
    bestFor: "Foren-Austausch & Community-Profile im deutschsprachigen Raum",
    activeListingsCh: "ca. 1.000 – 1.400 (teilweise längere Inaktivität)",
    avgCostForModelsChf: "Freemium-Modell mit kostenpflichtigen Boosts & Plus-Paketen",
    verificationStandard: "Community-Bewertungen und optionaler Foto-Check",
    priceTransparency: "Mittel (Honorar oft erst per Nachricht erfragbar)",
    monetizationFeatures: "Kunden-Abo für Nachrichtenversand & Profil-Boosts",
    summary: "Grosses DACH-Netzwerk, das in der Schweiz jedoch viele spontane Besucher verliert, weil für die direkte Kontaktaufnahme oft ein kostenpflichtiges Kundenkonto nötig ist.",
    whyThisRank: "Solide Community-Funktionen, aber durch die Login- und Abo-Hürde für Suchende im Schweizer Markt weniger direkt.",
    pros: ["Grosse Community und Erfahrungsberichte im DACH-Raum"],
    cons: ["Besucher müssen sich registrieren und teils zahlen, um Nachrichten zu schreiben", "Einige Profile sind nicht tagesaktuell gepflegt"],
    deepAnalysis: {
      overview: "Geprüft am 25. Oktober 2026: Community-orientiertes Portal aus Deutschland mit Schweizer Sektion.",
      pricingForModels: "Einstieg kostenlos möglich, Sichtbarkeit erfordert jedoch regelmässige Aktivität und Zukäufe.",
      experienceForClients: "Wer in der Schweiz gewohnt ist, direkt per Telefon/WhatsApp anzufragen, empfindet die interne Nachrichten-Schranke oft als Umweg.",
      fakeAndDuplicateRate: "Viele ältere Karteileichen unter den kostenlosen Profilen.",
      finalVerdict: "Für Community-Nutzer interessant, für schnelle Schweizer Direktkontakte zweitrangig."
    }
  }
];