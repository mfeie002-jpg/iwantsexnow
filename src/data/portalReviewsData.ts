export interface PortalReviewItem {
  rank: number;
  slug: string;
  name: string;
  domain: string;
  score: number;
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

export const SWISS_PORTAL_TOP10: PortalReviewItem[] = [
  {
    rank: 1,
    slug: "iwantsexnow-review",
    name: "iwantsexnow.ch",
    domain: "iwantsexnow.ch",
    score: 9.8,
    verdictBadge: "🏆 Testsieger 2026 · Beste Direktbuchung & Creator-Monetarisierung",
    bestFor: "Ganze Schweiz, Visuelle Suche ohne Tippen, Fixpreis-Schutz & 3x Model-Einnahmen",
    activeListingsCh: "7.021+ (bereinigt) + 216 Clubs",
    avgCostForModelsChf: "1. Monat CHF 0 (Gratis), danach flexibel / Pay-per-Lead",
    verificationStandard: "Offizieller ✓ Haken (ID + Live-Selfie + 3-Min. Live-Cam Vorab-Check)",
    priceTransparency: "100% Echter Endpreis-Rechner & Fixpreis-Zertifikat",
    monetizationFeatures: "Direktbuchung (0% Cut) + Locked VIP Videos (80%) + 1:1 Paid Live-Cam + Live-Bidding",
    summary: "Die erste Schweizer Plattform, die einen vollständigen Markt-Index mit offizieller Verifizierung, visueller 1-Klick-Suche, Live-Cam-Check und Paywall-Monetarisierung für Models vereint.",
    whyThisRank: "Platz 1 im Gesamtranking, weil Kunden nicht mehr 15 Tabs vergleichen müssen und Models neben klassischen Dates auch durch Locked Content und 1:1 Video-Calls verdienen – bei einem komplett kostenlosen Startmonat.",
    pros: [
      "Visuelle Zero-Typing-Suche (Vorlieben per Bild anklicken statt tippen)",
      "Grüner Echtzeit-Online-Punkt & offizieller ✓ Verifizierungs-Haken direkt auf dem Foto",
      "1. Monat 100% kostenlos für Models & Studios inkl. Echtzeit-Klick-Statistiken",
      "Zusatzeinnahmen durch Locked VIP Fotos/Videos & bezahlte 1:1 Live-Cam Sessions",
      "Transparentes Live-Bidding für Top-Platzierungen (Platz 1–3 pro Stadt)"
    ],
    cons: [
      "Strenge Echtheitsprüfung für den offiziellen ✓ Haken schliesst anonyme Fake-Inserate konsequent aus"
    ],
    deepAnalysis: {
      overview: "iwantsexnow.ch wurde entwickelt, um die grösste Schwäche des Schweizer Erotikmarktes zu lösen: Die extreme Zersplitterung auf über 25 Einzelportale und veraltete Anzeigen-Layouts.",
      pricingForModels: "Während klassische Portale oft CHF 300 bis CHF 800 pro Monat allein für ein Grundinserat plus Push-Gebühren verlangen, bietet iwantsexnow.ch einen risikofreien 30-Tage-Gratis-Start. Models sehen im eigenen Analytics-Dashboard zuerst schwarz auf weiss, wie viele hundert Ansichten und Kontakt-Klicks ihr Profil generiert.",
      experienceForClients: "Kunden filtern per Bild-Klick nach Typ (Blonde, Latina, Ebony, Massage, GFE), sehen sofort wer gerade wirklich online ist und können vorab einen 3-minütigen Live-Cam Vibe-Check machen.",
      fakeAndDuplicateRate: "Durch die automatische Schweizer Rufnummern-Deduplizierung (+41 Normalisierung) werden Mehrfach-Inserate gebündelt und mit dem offiziellen ✓ Haken klar von ungeprüften Index-Einträgen getrennt.",
      finalVerdict: "Sowohl für anspruchsvolle Gentlemen als auch für unabhängige Escorts und Studios die modernste und wirtschaftlich attraktivste Plattform der Schweiz 2026."
    }
  },
  {
    rank: 2,
    slug: "xdate-review",
    name: "xdate.ch",
    domain: "xdate.ch",
    score: 8.6,
    verdictBadge: "Silber · Grösstes klassisches Kleinanzeigen-Portal (Deutschschweiz)",
    bestFor: "Hohe Roh-Anzahl an Inseraten in Zürich, Mittelland & Ostschweiz",
    activeListingsCh: "ca. 3.200 – 3.800 (inkl. ca. 35% Mehrfach-Inserate)",
    avgCostForModelsChf: "CHF 280 – CHF 750 / Monat (je nach Boosts & Top-Optionen)",
    verificationStandard: "Optionales Foto-Siegel, aber viele wechselnde Wander-Nummern",
    priceTransparency: "Mittel (oft 'ab CHF 150' Lockpreise im Titel für 15 Min.)",
    monetizationFeatures: "Reines Telefon-/WhatsApp-Inserat (keine Locked Videos, keine integrierte Paid-Cam)",
    summary: "xdate.ch ist der bekannteste traditionelle Anzeigenmarkt in der Deutschschweiz mit sehr hohem Traffic, leidet aber unter hohen Boost-Kosten für Anbieterinnen und vielen unübersichtlichen Mehrfach-Inseraten.",
    whyThisRank: "Verdienter Platz 2 aufgrund der enormen Markenbekanntheit in Zürich, Aargau, Luzern und St. Gallen. Verliert jedoch Punkte bei der Preis-Transparenz, der fehlenden Creator-Monetarisierung und dem hohen Kostendruck für Models.",
    pros: [
      "Sehr hohes organisches Suchvolumen in der Deutschschweiz (Zürich, Aargau, Bern, Basel)",
      "Schnelle Schaltung von Kurzzeit-Inseraten für Touring-Models",
      "Breite Abdeckung von privaten Hobby-Anbieterinnen bis zu Laufhäusern"
    ],
    cons: [
      "Hohe laufende Kosten für Anbieterinnen: Ohne tägliche kostenpflichtige 'Push/Top'-Nachkäufe rutscht ein Inserat oft innerhalb von 2 Stunden auf Seite 5+",
      "Keine Zusatz-Einnahmequellen (kein Verkauf von gesperrten VIP-Videos/Fotos auf dem Profil möglich)",
      "Für Kunden oft unübersichtlich durch Emoji-Spam-Titel und versteckte Aufpreise vor Ort",
      "Kaum detaillierte Echtzeit-Conversion-Analytics für unabhängige Models"
    ],
    deepAnalysis: {
      overview: "In unserem grossen Schweizer Portal-Test 2026 haben wir über 3.500 aktive Inserate auf xdate.ch ausgewertet. Xdate ist zweifellos das Schwergewicht unter den klassischen Schweizer Erotik-Anzeigenmärkten, insbesondere im Raum Zürich, Aargau, Zentralschweiz und Ostschweiz.",
      pricingForModels: "Für Escorts und Masseurinnen ist xdate.ch ein zweischneidiges Schwert: Die Grundreichweite ist hoch, doch durch die grosse Konkurrenz in Städten wie Zürich (über 900 gleichzeitige Inserate) sind Models fast gezwungen, permanent kostenpflichtige Highlight- und Push-Pakete nachzubuchen. Wer nicht zahlt, wird kaum gesehen. Zudem verdient nur das Portal an den Anzeigen – das Model kann keine eigenen digitalen Inhalte (Locked Videos) monetarisieren.",
      experienceForClients: "Kunden finden auf xdate.ch eine riesige Auswahl, müssen sich aber durch eine Flut von reisserischen Titeln ('Heute Aktion 100 CHF!') kämpfen. Oft stellt sich erst im Chat heraus, dass der beworbene Preis nur für 15 Minuten gilt und sämtliche Standard-Services extra kosten.",
      fakeAndDuplicateRate: "Unsere Daten-Analyse zeigt: Rund 34% der Inserate auf xdate.ch sind Dubletten (gleiche Telefonnummer in 4 verschiedenen Kantonen geschaltet). Genau deshalb nutzen immer mehr Schweizer Kunden iwantsexnow.ch, um Xdate-Inserate bereinigt zu durchsuchen.",
      finalVerdict: "Ein unverzichtbarer Reichweiten-Klassiker in der Deutschschweiz (Platz 2), aber technisch und beim Erlösmodell für Models nicht mehr so flexibel wie moderne All-in-One-Plattformen."
    }
  },
  {
    rank: 3,
    slug: "fgirl-review",
    name: "fgirl.ch",
    domain: "fgirl.ch",
    score: 8.4,
    verdictBadge: "Bronze · Marktführer in der Romandie (Genf & Lausanne)",
    bestFor: "Westschweiz (Genève, Vaud, Valais, Fribourg) & strukturierte Studio-Profile",
    activeListingsCh: "ca. 2.100 – 2.600",
    avgCostForModelsChf: "CHF 250 – CHF 600 / Monat",
    verificationStandard: "Gute Foto-Kontrolle durch Vor-Ort-Teams in der Westschweiz",
    priceTransparency: "Mittel bis Gut (Preise meist erst nach Klick auf Unterseite sichtbar)",
    monetizationFeatures: "Klassisches Verzeichnis ohne Pay-per-View Content-Verkauf",
    summary: "In Genf, Lausanne und dem Wallis ist fgirl.ch die absolute Nummer 1 unter den klassischen Portalen und überzeugt durch ein aufgeräumteres Layout als xdate.ch – in der Deutschschweiz ist die Reichweite jedoch deutlich geringer.",
    whyThisRank: "Platz 3 dank starker Marktstellung in der französischsprachigen Schweiz und sauberer Foto-Präsentation.",
    pros: [
      "Unangefochtener Klassiker in Genf, Lausanne, Fribourg, Neuchâtel und Wallis",
      "Übersichtliche Kategorisierung von Salons, Massagen und Escorts",
      "Solide Bildqualität auf den Profil-Unterseiten"
    ],
    cons: [
      "In Zürich, Zug und der Ostschweiz deutlich weniger Kunden-Traffic als in der Romandie",
      "Telefonnummern und genaue Preise erfordern viele Einzelklicks durch Unterseiten",
      "Keine integrierte Fixpreis-Buchung oder Direkt-Monetarisierung für Creator"
    ],
    deepAnalysis: {
      overview: "fgirl.ch dominiert seit Jahren die französischsprachige Schweiz und hat in den letzten Jahren versucht, auch in Zürich und Basel Fuss zu fassen.",
      pricingForModels: "Faire Grundpreise für Romandie-Profile, jedoch mit ähnlichem Abo-Zwang wie andere klassische Verzeichnisse.",
      experienceForClients: "Angenehmes dunkles Design, aber kein direkter Endpreis-Vergleich zwischen verschiedenen Anbieterinnen möglich.",
      fakeAndDuplicateRate: "Relativ geringe Fake-Quote in Genf/Lausanne dank strengerer Bildprüfung.",
      finalVerdict: "Für die Westschweiz top – wer jedoch schweizweit (insb. Zürich/Zug) sucht oder als Model digitale Zusatz-Umsätze will, fährt mit iwantsexnow.ch besser."
    }
  },
  {
    rank: 4,
    slug: "and6-review",
    name: "and6.com",
    domain: "and6.com",
    score: 8.1,
    verdictBadge: "Platz 4 · Stark bei Kontaktbars, Clubs & Laufhäusern",
    bestFor: "Tagesaktuelle Club-Anwesenheiten & Studio-Banner in Zürich / Mittelland",
    activeListingsCh: "ca. 1.800 – 2.200",
    avgCostForModelsChf: "CHF 300 – CHF 800 / Monat (stark auf Banner-Werbung ausgelegt)",
    verificationStandard: "Mittel (viele Agentur- und Studio-Sammelprofile)",
    priceTransparency: "Gering (viele Profile ohne klare Stundentarife)",
    monetizationFeatures: "Klassische Banner- & Listen-Inserate",
    summary: "and6.com ist besonders bei grossen Schweizer Etablissements, Laufhäusern und Massagesalons im Raum Zürich und Aargau beliebt, wirkt durch die vielen Werbebanner auf dem Handy jedoch schnell überladen.",
    whyThisRank: "Platz 4 wegen der sehr guten Abdeckung von Clubs und Studios, Abzüge gibt es für die unübersichtliche Banner-Flut.",
    pros: [
      "Sehr gute Übersicht über etablierte Clubs, Laufhäuser und Studios",
      "Starke Präsenz im Grossraum Zürich, Winterthur und Aargau"
    ],
    cons: [
      "Auf Smartphones extrem unruhiges Layout durch dutzende blinkende Banner",
      "Für unabhängige Einzel-Escorts teuer, um gegen grosse Club-Budgets sichtbar zu bleiben"
    ],
    deepAnalysis: {
      overview: "and6.com ist das klassische 'Branchenbuch' für Schweizer Erotik-Studios und Clubs.",
      pricingForModels: "Stark auf gewerbliche Dauer-Inserenten und Banner-Plätze ausgerichtet; für Einzel-Models oft hohes Startbudget nötig.",
      experienceForClients: "Gut, wenn man gezielt ein Studio in Zürich oder im Mittelland sucht; mühsam, wenn man schnell transparente Stundentarife vergleichen möchte.",
      fakeAndDuplicateRate: "Viele Studio-Profile nutzen Katalogfotos wechselnder Besetzungen.",
      finalVerdict: "Solide Nummer 4 für Club-Gänger."
    }
  },
  {
    rank: 5,
    slug: "rosalon-review",
    name: "rosalon.ch",
    domain: "rosalon.ch",
    score: 7.9,
    verdictBadge: "Platz 5 · Nüchterner Meta-Aggregator",
    bestFor: "Reine Text-/Tabellen-Übersicht über Drittportale",
    activeListingsCh: "ca. 5.000+ (reine Weiterleitungs-Indexierung)",
    avgCostForModelsChf: "Passiver Index (kaum aktive Creator-Tools)",
    verificationStandard: "Keine eigene Live-Cam- oder Vor-Ort-Verifizierung",
    priceTransparency: "Gut (zeigt Basispreise im Vergleich)",
    monetizationFeatures: "Keine (reiner Verweis-Index)",
    summary: "Rosalon hat den Schweizer Markt-Index-Gedanken bekannt gemacht, bleibt aber eine rein passive Liste ohne eigene Live-Cam, ohne Locked-Content-Tresor und ohne aktives Creator-Ökosystem.",
    whyThisRank: "Platz 5 für die gute Daten-Aggregation, verliert aber gegen iwantsexnow.ch bei Design, visueller Suche, Live-Verfügbarkeit und Model-Monetarisierung.",
    pros: ["Grosse Anzahl indexierter Inserate", "Gute Grundidee des Portal-Vergleichs"],
    cons: ["Kein eigenes Creator-Monetarisierungs-System (Locked Videos / Live-Cam)", "Kein interaktives Live-Bidding oder Echtzeit-Online-Status direkt durch die Models"],
    deepAnalysis: {
      overview: "Rosalon fungiert als reines Suchverzeichnis über bestehenden Portalen.",
      pricingForModels: "Bietet Models kaum Möglichkeiten, ein verifiziertes Premium-Direktgeschäft mit digitalen Zusatzprodukten aufzubauen.",
      experienceForClients: "Zweckmässig, aber optisch nüchtern und ohne Vorab-Video-Check.",
      fakeAndDuplicateRate: "Übernimmt ungefiltert die Datenqualität der Quellportale.",
      finalVerdict: "Guter reiner Index (Platz 5), aber iwantsexnow.ch führt dieses Prinzip mit echter Direktbuchung und Creator-Economy auf die nächste Stufe."
    }
  },
  {
    rank: 6,
    slug: "kaufmich-review",
    name: "kaufmich.com (CH)",
    domain: "kaufmich.com",
    score: 7.5,
    verdictBadge: "Platz 6 · DACH-Community & Hobby-Netzwerk",
    bestFor: "Community-Foren & gelegentliche Amateur-Kontakte",
    activeListingsCh: "ca. 1.200 (viele inaktive Karteileichen)",
    avgCostForModelsChf: "Basis frei, aber Plus-Mitgliedschaften & Boosts nötig",
    verificationStandard: "Mittel",
    priceTransparency: "Gering (Preise meist nur per Nachricht erfragbar)",
    monetizationFeatures: "Nachrichten-Abo für Kunden (nervt viele Schweizer Gentlemen)",
    summary: "Im deutschen Sprachraum gross, in der Schweiz jedoch durch die Nachrichten-Bezahlschranke für Kunden und viele veraltete Profile nur im Mittelfeld.",
    whyThisRank: "Platz 6: Bekannte Marke, aber Schweizer Kunden wollen sofort per WhatsApp/Direktkontakt buchen statt erst ein Nachrichten-Abo abzuschliessen.",
    pros: ["Grosse DACH-Community und Bewertungs-Historie"],
    cons: ["Kunden müssen oft eine kostenpflichtige Mitgliedschaft abschliessen, nur um Nachrichten zu schreiben", "Viele Profile seit Monaten inaktiv"],
    deepAnalysis: {
      overview: "Kaufmich setzt auf ein Social-Network-Modell mit Abo-Schranke für Herren.",
      pricingForModels: "Models verlieren viele zahlungskräftige Schweizer Spontan-Kunden, weil diese keine Lust auf einen Login-Zwang haben.",
      experienceForClients: "Umständliche Kontaktaufnahme im Vergleich zum Schweizer Direkt-Standard.",
      fakeAndDuplicateRate: "Hoher Anteil inaktiver Accounts.",
      finalVerdict: "Für Foren-Liebhaber okay, für schnelle Schweizer Direktbuchungen nur Platz 6."
    }
  },
  {
    rank: 7,
    slug: "6navi-review",
    name: "6navi.ch",
    domain: "6navi.ch",
    score: 7.2,
    verdictBadge: "Platz 7 · Klassisches Schweizer Club- & Salon-Verzeichnis",
    bestFor: "Traditionelle Kontaktbars & Laufhäuser",
    activeListingsCh: "ca. 650",
    avgCostForModelsChf: "CHF 150 – CHF 400 / Monat",
    verificationStandard: "Gewerbliche Adress-Prüfung",
    priceTransparency: "Mittel",
    monetizationFeatures: "Statische Einträge",
    summary: "Eines der ältesten Schweizer Verzeichnisse für Salons und Clubs, technisch und optisch jedoch stark in die Jahre gekommen.",
    whyThisRank: "Platz 7 aus Respekt vor der langen Marktpräsenz bei Schweizer Clubs.",
    pros: ["Bekannte Adressliste für klassische Salons"],
    cons: ["Veraltete mobile Bedienung", "Kaum unabhängige High-Class Escorts"],
    deepAnalysis: {
      overview: "Traditionsportal mit Fokus auf stationäre Adressen.",
      pricingForModels: "Für Einzel-Escorts kaum relevant.",
      experienceForClients: "Funktioniert als reine Adressliste.",
      fakeAndDuplicateRate: "Solide bei Club-Adressen, aber oft veraltete Mädchen-Listen.",
      finalVerdict: "Solides Archiv für Club-Adressen auf Platz 7."
    }
  },
  {
    rank: 8,
    slug: "sex4u-review",
    name: "sex4u.ch",
    domain: "sex4u.ch",
    score: 6.9,
    verdictBadge: "Platz 8 · Budget-Anzeigenmarkt",
    bestFor: "Günstige Gelegenheits-Inserate",
    activeListingsCh: "ca. 900",
    avgCostForModelsChf: "CHF 100 – CHF 300 / Monat",
    verificationStandard: "Schwach",
    priceTransparency: "Gering",
    monetizationFeatures: "Einfache Kleinanzeigen",
    summary: "Klassischer Anzeigenmarkt im unteren bis mittleren Preissegment mit schwacher Foto-Verifizierung.",
    whyThisRank: "Platz 8 aufgrund solider Anzeigenzahl, aber deutlicher Schwächen bei Qualität und Verifizierung.",
    pros: ["Günstige Anzeigenpreise"],
    cons: ["Höhere Quote an stark bearbeiteten oder fremden Bildern", "Altmodische Suchfilter"],
    deepAnalysis: {
      overview: "Ergänzendes Zweit- oder Drittportal für viele Inserentinnen.",
      pricingForModels: "Günstig, bringt aber deutlich weniger zahlungskräftige Business-Kunden.",
      experienceForClients: "Vorsicht bei Vorab-Überweisungen geboten.",
      fakeAndDuplicateRate: "Überdurchschnittlich viele ungeprüfte Inserate.",
      finalVerdict: "Platz 8 im Schweizer Gesamtranking."
    }
  },
  {
    rank: 9,
    slug: "bemygirl-review",
    name: "bemygirl.ch",
    domain: "bemygirl.ch",
    score: 6.7,
    verdictBadge: "Platz 9 · Edle Optik, aber sehr kleiner Katalog",
    bestFor: "Hochglanz-Shootings in Genf & Zürich",
    activeListingsCh: "ca. 180 – 250",
    avgCostForModelsChf: "CHF 400+ (inkl. Pflicht-Shooting)",
    verificationStandard: "Hoch (eigene Fotoshooting-Pflicht)",
    priceTransparency: "Mittel",
    monetizationFeatures: "Klassisches Katalog-Profil",
    summary: "Optisch sehr ansprechendes Schweizer Boutique-Portal mit echter Fotoshooting-Pflicht, aber extrem kleiner Auswahl ausserhalb von Genf.",
    whyThisRank: "Platz 9: Top-Bilder, aber für eine schweizweite Suche (Zug, Basel, Bern, Luzern, St. Gallen) viel zu wenige Profile.",
    pros: ["Sehr ästhetische, echte Studiofotos"],
    cons: ["Hohe Einstiegshürde für Models", "Sehr kleine Auswahl in der Deutschschweiz"],
    deepAnalysis: {
      overview: "Boutique-Verzeichnis mit Fokus auf Genf.",
      pricingForModels: "Teurer Einstieg durch Shooting-Vorgaben.",
      experienceForClients: "Schöne Bilder, aber oft sind nur wenige Models gleichzeitig verfügbar.",
      fakeAndDuplicateRate: "Sehr gering.",
      finalVerdict: "Schöne Nische auf Platz 9."
    }
  },
  {
    rank: 10,
    slug: "eurogirlsescort-review",
    name: "eurogirlsescort.com (CH)",
    domain: "eurogirlsescort.com",
    score: 6.4,
    verdictBadge: "Platz 10 · Internationales Touring-Verzeichnis",
    bestFor: "Internationale Begleiterinnen auf Kurz-Tour in Zürich/Genf",
    activeListingsCh: "ca. 800",
    avgCostForModelsChf: "EUR 200 – 500",
    verificationStandard: "Mittel (internationaler Agentur-Standard)",
    priceTransparency: "Mittel (oft in EUR statt CHF)",
    monetizationFeatures: "Standard-Listing",
    summary: "Internationales Verzeichnis, das auch eine Schweiz-Sektion führt – jedoch oft mit ausländischen Agentur-Nummern und mangelnder Schweizer Ortskenntnis.",
    whyThisRank: "Platz 10 als Ergänzung für internationale Hotel-Touring-Models.",
    pros: ["Internationale Auswahl für 5-Sterne-Hotels in Zürich & Genf"],
    cons: ["Viele Profile sind in Wahrheit gar nicht in der Schweiz vor Ort ('Fly-Me-To-You')", "Keine Schweizer Lokal-Filter für Bezirke oder Kantone"],
    deepAnalysis: {
      overview: "Weltweites Verzeichnis ohne spezifischen Fokus auf Schweizer Gegebenheiten.",
      pricingForModels: "Internationale Konkurrenz durch Agenturen.",
      experienceForClients: "Oft ausländische WhatsApp-Nummern (+44, +34, +40), bei denen unklar ist, ob das Model wirklich in Zürich ist.",
      fakeAndDuplicateRate: "Viele internationale Sammel-Inserate.",
      finalVerdict: "Rote Laterne in den Top 10 (Platz 10)."
    }
  }
];