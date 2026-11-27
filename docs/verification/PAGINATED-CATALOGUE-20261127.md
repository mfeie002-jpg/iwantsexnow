# IWSN — Serverseitige Katalog-Paginierung und gezielte Profilauswahl

**Datum:** 27. November 2026 (Europe/Zurich)
**Arbeitsbranch:** `feat/iwsn-catalogue-pages-20261127`
**Ausgangsbasis:** `aa444bde2ffff51e1bea2f25d1d0303f9d1bce1f` (Swiss Night + On-Demand Xenia-Katalog)
**Status:** isolierter lokaler Release-Kandidat, **kein Merge, kein Git-Push, kein Softgen-Publish**.

## Technische Umsetzung

- `GET /api/catalogue/page` gibt höchstens 48 Einträge pro Aufruf aus (Standard: 24). Eingaben werden begrenzt und validiert; doppelte Filter, unbekannte Parameter, ungültige Bereiche, negative Offsetwerte und übergrosse Limits liefern HTTP 400.
- Mit `count=1` liefert dieselbe API eine tatsächliche gefilterte Gesamtzahl, ohne Profilkarten oder Kontaktangaben zu übertragen.
- Serverfilter für Kanton, Kategorie, freiwillige Textsuche, bestätigte CHF-Preise, Verfügbarkeit, Quelle/Kontakt und bestehende Service-Landingpages bleiben verbindlich.
- Erstes SSR-HTML: 4 Profile auf `/`; 24 passende Profile auf `/search`, festen Regionen und dynamischen Orts-/Kategorieseiten; 1 Profil auf Detailseiten; Studios nur auf `/clubs`.
- Weitere Profile werden auf Such- und Regionsseiten über die serverseitige API nachgeladen; ihre Original-IDs und öffentlichen Zustände werden zur bestehenden UI-Auswahl hinzugefügt.
- `POST /api/catalogue/selected` liefert nur ausdrücklich gemerkte, weiterhin sichtbare Profil-IDs (maximal 100 je Aufruf) für Merkliste und Vergleich. Vertrauliche Meldungen, Zugangstokens und gesperrte IDs werden nicht herausgegeben.
- Die bestehenden Vergleichs-IDs bleiben bei **teilweise** geladenen Listen erhalten. Nur ein vollständig abgeglichener Katalog kann fehlende IDs als wirklich nicht mehr sichtbar einstufen.
- Xenia fragt für die regionale Trefferzahl eine schlanke serverseitige Zählung ab. Der Guide ersetzt fehlgeschlagene API-Antworten nicht durch erfundene Treffer.

## Direkte HTML-Benchmarks

Vergleich mit dem zuvor gebauten Arbeitsstand auf demselben Windows-ROG (Node.js/Next.js). Messwert: **ungekürztes HTML in Byte**, ohne Transportkompression. Baseline `127.0.0.1:4188`; paginierter Build `127.0.0.1:4186`.

| Route | Vorher Bytes | Nachher Bytes | Gerundete Einsparung | SSR-Profile danach |
|---|---:|---:|---:|---:|
| `/` | 1'627'280 | 48'665 | 97 % | 4 |
| `/search` | 1'671'010 | 106'377 | 94 % | 24 |
| `/escort-zurich` | 1'672'037 | 107'656 | 94 % | 24 / total 577 |
| `/orte/zug` | 1'671'416 | 105'670 | 94 % | 24 / total 95 |
| `/clubs` | 1'628'173 | 65'074 | 96 % | 0 Profile / 108 Clubs |
| `/profile/ch-76ccbbea1078` | 1'605'682 | 24'615 | 98 % | 1 |
| `/favorites` | 1'594'359 | 11'661 | 99 % | 0; nur gemerkte IDs nachladen |
| `/compare-escorts` | 1'594'058 | 11'272 | 99 % | 0; nur ausgewählte IDs nachladen |

Die Einzelmesswerte sind lokale HTTP-Antworten. **Kein Beleg für reale Mobile-Ladezeit, Core Web Vitals oder Conversions.**

## Browser- und Funktionstest

Im 390 × 844 px grossen echten Chrome-Viewport wurden `/search?canton=ZG`, `/compare-escorts`, `/favorites` und die Xenia-Auswahl getestet.

- Server-Suche: 95 Treffer in Zug, 24 initial sichtbare Profilkarten.
- Nachladen: 24 weitere Profile hinzugefügt; insgesamt 48 Karten.
- Ein Eintrag von Seite 2 wurde mit `Merken` und `Vergleichen` ausgewählt und auf beiden persönlichen Seiten wiederhergestellt.
- Xenia gab dieselbe Gesamtzahl 95 aus, ohne den alten vollständigen `/api/catalogue`-Endpoint abzurufen.
- 390-px-Dokumentbreite ohne horizontalen Überlauf; keine unbehandelten Browserausnahmen.
- Zusätzlich 12 relevante Seiten bei 320, 390 und 1440 px getestet: **36/36 responsive Prüfungen bestanden**, kein horizontaler Überlauf, genau ein Footer und eine Hauptüberschrift pro Seite.
- An keine Person wurde eine Nachricht gesendet, keine Zahlung ausgelöst, keine Anmeldung oder Veröffentlichung simuliert.

## Sicherheits- und QA-Grenzen

- Externe Quellbilder bleiben nach Verfügbarkeit und Nutzungsrechten begrenzt; fehlende Originalbilder werden neutral gekennzeichnet, keine KI-Ersatzpersonen.
- Importierte 30/60-Minuten-Preise und alte Online-Flags werden nicht als nachgewiesene Honorar-/Verfügbarkeitsangaben umgedeutet.
- Geschlossene, pausierte, gesperrte und entfernte Einträge werden vor jedem Server-Response herausgefiltert.
- Profil-IDs, Canonicals, Indexierbarkeit öffentlicher Regionen/Kategorieseiten und Sitemap bleiben erhalten.
- Die serverseitige Funktion materialisiert weiterhin den vorhandenen Katalog vor dem Filtern. Für sehr hohe Last ist eine indexierte Datenbankabfrage mit stabilem Cursor die nächste skalierende Ausbaustufe.
- Die Produktivkonfiguration von Supabase, RLS, Bildrechte, Einwilligungen, Volljährigkeit, Meldeeingang und realer Softgen-Deployment-SHA sind **nicht** mit diesem lokalen Test abgenommen.
- Xenia bleibt ein regelbasierter, transparenter Touch-Guide. Ein echtes Sprachmodell ist nicht angeschlossen.

## Reproduzierbare QA

**Abnahme:** Next.js 15.5.28 Build Exit 0; TypeScript Exit 0; ESLint Exit 0; **212/212 Tests bestanden**, 0 fehlgeschlagen oder übersprungen.

Mit gebautem Next.js-Prozess auf `127.0.0.1:4186` und `IWSN_TEST_BASE_URL=http://127.0.0.1:4186`:

```powershell
npm run build
npm run lint -- --quiet
npx tsc --noEmit --pretty false
node --test tests/*.test.mjs
```

Ein isolierter Arbeitsbranch erhält die vorherige Live-Basis für Rollback und Codevergleich. Vor einem produktiven Publish sind Review, endgültiges CI-Gate und die oben genannten Freigabebedingungen erforderlich.
