# IWSN Swiss Night — On-Demand Catalogue, Mobile Performance Gate

**Datum:** 27.11.2026 (Europe/Zurich)  
**Arbeitszweig:** `perf/night-catalogue-on-demand-20261127`  
**Basis:** `feat/swiss-night-v2-20261127`, Commit `bc798cada62024c951652e7809401bbd9b20f95b`  
**Status:** Lokal implementiert und geprüft; **kein** Git-Push, Merge, Softgen-Publish oder produktiver Datenzugriff.

## Ausgangsproblem

Der Katalog wird auf relevanten Next.js-Seiten bereits über `getServerSideProps` bereitgestellt. `CatalogueProvider` fragte ihn nach Hydrierung trotzdem immer über `GET /api/catalogue` erneut ab. Auch reine Informationsseiten lösten bei jedem Besuch einen vollständigen Abruf aus, obwohl die Daten erst beim freiwilligen Öffnen der Xenia-Auswahl benötigt wurden.

## Änderungen

- Bereits als `pageProps.catalogue` übertragene Katalogdaten werden direkt verwendet, ohne zweiten Browser-Abruf.
- Seiten ohne initiales Katalogobjekt laden die Daten bei Bedarf, wenn ein Nutzer den Xenia-Guide öffnet.
- Der Xenia-Guide zeigt während des Ladevorgangs einen Ladezustand und behält die bestehenden Filter.
- Fehler auf einem öffentlichen Katalogabruf bleiben sichtbar; es wird kein erfundener Trefferbestand eingesetzt.
- Die vorhandenen 20 Seiten, Profil-IDs, Daten-, Preis-, Quellen-, Verfügbarkeits- und Rechteprüfungen wurden nicht verändert.

## Geprüfte Resultate

| Prüfung | Ergebnis |
|---|---|
| `npm run build` (Next.js 15.5.28) | Bestanden, Exit 0 |
| `npx tsc --noEmit --pretty false` | Bestanden, Exit 0 |
| `npm run lint -- --quiet` | Bestanden, Exit 0 |
| `node --test tests/*.test.mjs` | **204 bestanden, 0 fehlgeschlagen, 0 übersprungen** |
| Echte Browserprüfung (Chrome-CDP, Desktop 1440 px) | Bestanden |
| Startseite: zusätzliche `/api/catalogue`-Requests | **0** |
| Informationsseite `/safety` vor Xenia-Aktivierung | **0** |
| `/safety` nach explizitem Öffnen von Xenia | **genau 1 Request**, HTTP 200 |
| Transfer dieses Katalog-Requests | **270'408 Byte** im Browserlauf |
| Footer auf Startseite | 1 |
| Unbehandelte Runtime-Ausnahmen im Browserlauf | 0 |

Der alte unnötige zusätzliche Katalogabruf auf SSR-Seiten wurde damit eliminiert. **Die tatsächlichen Endnutzer-Ladezeiten wurden nicht gemessen**; 270'408 Byte beschreiben den beobachteten kodierten Netztransfer eines Katalog-Abrufs, nicht eine garantierte Einsparung bei jedem Besucher.

## Reproduktion

1. Lokalen Produktionsbuild auf `127.0.0.1:4188` starten.
2. Chrome mit separatem Testprofil ausschliesslich lokal auf Debug-Port `9327` starten.
3. `node scripts/verify-catalogue-on-demand.mjs` ausführen.
4. Für die regulären HTTP-Tests `IWSN_TEST_BASE_URL=http://127.0.0.1:4188` setzen.

Hinweis: HTTP-Port 4190 kann von Node/undici als reservierter Port abgelehnt werden und erzeugt dann irreführende `fetch failed: bad port`-Testfehler. Die abschliessende Suite wurde deshalb erneut gegen 4188 ausgeführt und bestand vollständig.

## Verbleibende Freigabebedingungen

**Keine Produktivfreigabe:** Bildrechte/Einwilligungen und Volljährigkeit, reales Supabase-Projekt und RLS, privater Meldeeingang, Herkunft und Änderungsstand der Live-Auslieferung sowie reale mobile Ladeleistung sind weiterhin vor dem Rollout zu prüfen. Die bestehenden importierten Profile werden nicht als verifiziert ausgegeben. Xenia ist weiterhin ein transparenter, regelbasierter Touch-Lotse und kein angebundener, eigenständig handelnder LLM-Dienst.

**Nächstes Performance-Arbeitspaket:** den noch grossen SSR-Katalog durch serverseitig limitierte und paginierte Suchantworten ersetzen, ohne Indexierung, ID-Konsistenz, Merkliste und Filtervertrag zu beschädigen. Danach reproduzierbare Mobile-Lighthouse-Messung und Core-Web-Vitals-Basis.
