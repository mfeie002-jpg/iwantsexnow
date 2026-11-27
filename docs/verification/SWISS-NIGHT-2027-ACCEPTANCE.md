# Swiss Night 2027 – lokale Erweiterung

Stand: 27. November 2026 (Europe/Zurich). Aufbauend auf dem lokal geprüften V2-Stand `d302c1a6e0f0b29fa23d5167afcc67e97b0f0366`, im Branch `feat/swiss-night-v2-20261127`. Kein Push, Merge oder Deployment.

## Neue Funktionen und Gestaltung

- Neu gestaltete Startseite: gerahmtes Stadtmotiv, grössere Typografie, Pink-/Pflaumentöne, funktionale Einstiegskarten für Touch-Auswahl, Merkliste und Vergleich. Bestehende Profile stehen vor dem vollständigen Regionen- und Kategorienbereich.
- Schnellzugriff mit Touch-Zielen, optionaler Navigationssuche und Ctrl/Cmd+K. Dialoge unterstützen Escape und die Rückgabe des Fokus.
- Erweiterte Touch-Auswahl mit tatsächlicher Kataloganzahl, direkt bearbeitbarer Zusammenfassung und klarer Trennung von Katalogtreffern und Verfügbarkeit. Überspringen entfernt die Auswahl des jeweiligen Schritts.
- Bis zu fünf ausdrücklich gespeicherte Suchen auf diesem Gerät; wiederherstellen und entfernen. Validierte lokale Routen/Filter, Dublettenabgleich, sichtbare Speicherfehler. Keine automatische Speicherung sensibler Suchpräferenzen.
- Einzelne Filter entfernen und zwischen Detail- und Kompaktansicht wechseln.
- Originalprofil-Galerie im Vollbild, Vor/Zurück, Pfeiltasten, Zähler und Abschnittsnavigation. Das ausgewählte Bild bleibt an dieselbe Originalquelle gebunden.
- Vergleich mit „Nur Unterschiede“; mobile Berechnung anhand der tatsächlich angezeigten Profile. Fehlende oder nicht bestätigte Angaben bleiben sichtbar.
- „Bilder ausblenden“ gilt nur für die Darstellung im aktuellen Tab und überlebt einen Reload ohne beabsichtigtes Aufblitzen. Keine Behauptung, dass Verlauf, Texte oder Netzwerkzugriffe verborgen wären.

## Automatisierte Prüfung des finalen Builds

| Prüfung | Ergebnis |
|---|---|
| Produktionsbuild | Exit 0, Next.js 15.5.28 |
| Gesamte Testsuite gegen lokalen Produktionsbuild | 194 bestanden, 0 fehlgeschlagen, 0 übersprungen |
| ESLint | Exit 0, keine Warnungen oder Fehler |
| TypeScript | Exit 0 |

Die Suite enthält weiterhin HTTP-Prüfungen der 20 Hauptseiten, Footer-/Indexierungsverträge, Bildquellen, Datenprojektion und Berechtigungsgrenzen. Hinzu kommen 23 Tests für gespeicherte Suchen, Guide-Zustände, Galerie/Vergleich und den frühen Bild-Sichtbarkeitszustand. Die Rohprotokolle in diesem Ordner gehören zu diesem finalen Build. Der frühere V2-Bericht dokumentiert seinen damaligen Stand mit 171 Tests.

## Browserprüfung

- Desktop: Guide → Zug → Alle Bereiche → Offen → Zusammenfassung → Suche mit 95 Katalogeinträgen. Gespeicherte Suche erstellen, wiederherstellen, entfernen; aktiven Ortsfilter entfernen; Kompaktansicht aktivieren.
- Schnellzugriff: Touch-Ziele, Ctrl+K, Escape und Rückgabe des Fokus geprüft. Bilddarstellung aus- und eingeschaltet.
- Profilgalerie: sechs vorhandene Quellenbilder, Öffnen, nächstes Bild, Pfeil zurück, Escape und Fokus auf dem Auslöser geprüft.
- Vergleich: zwei vorhandene Profile; „Nur Unterschiede“ reduziert sechs auf vier Kriterien, offene Angaben bleiben sichtbar.
- Echter mobiler Browser-Viewport 390 × 844: Vergleichsumschalter, Schnellzugriff, Bilddarstellung ausblenden → Reload → weiterhin null sichtbare img-Elemente → wieder anzeigen; kompletter Touch-Flow bis `/search?canton=ZG` geprüft.
- Suche bei 390 und 320 px: Dokumentbreite entspricht der Viewportbreite. Startseiten-Header und Überschriften zusätzlich bei 320/390 px geprüft. Desktop-Screenshotbreite 1440 px.
- Neue Desktop-/Mobile-Aufnahmen für Startseite, Suche und Vergleich liegen unter `output/playwright/swiss-night-2027/`. Es sind obere Ausschnitte des laufenden Builds. Die 20-Seiten-Galerie unter http://127.0.0.1:4182 lädt den aktuellen Build; die früheren 20 JPEGs bleiben als V2-Aufnahmen erhalten.
- Eigene Testsuche und beide Vergleichsauswahlen nach der Prüfung entfernt. Bilder wieder sichtbar, temporäre Viewport-Overrides zurückgesetzt. Keine Anbieter kontaktiert und keine Veröffentlichung ausgelöst.

## Erhalten und weiterhin offen

Keine Änderungen an `src/data`, Profil-IDs, Originalbildquellen oder Paketabhängigkeiten. Der ursprüngliche Checkout bleibt sauber auf `main`, Commit `d337498c87c2b9789b78f069966c185173bcb972`.

Der Guide bleibt eine transparente, regelbasierte Auswahlhilfe. Diese Erweiterung behauptet weder ein angebundenes Sprachmodell noch erfundene Empfehlungen, Preise, Identitätsprüfungen oder Online-Status. Fehlende Originalbilder erhalten weiterhin einen neutralen Hinweis.

Die bereits dokumentierten Produktionspunkte bleiben offen: Rechte-/Einwilligungs-/Inhaberschaftsnachweise, tatsächliche Produktionskonfiguration und RLS, produktiver Meldeeingang, externe Bildverfügbarkeit und gemessene mobile Ladeleistung. Der öffentliche SSR-Katalog ist weiterhin rund 1,6 MB vor Transportkompression. Die lokale Abnahme ist keine GitHub-CI- oder Produktionsfreigabe.
