# Swiss Night V2 – lokaler Abnahmebericht

Stand: 27. November 2026 (Europe/Zurich). Umfang: bestehende Next.js-Anwendung, 20 Hauptseiten, Desktop und Mobile, echter importierter Katalog, freiwillige Touch-Auswahl. Kein produktives Deployment, kein Push, kein Merge.

## Git und Isolation

- Worktree: `C:\Users\thest\Documents\GitHub\rearea\iwantsexnow-swiss-night-v2`
- Branch: `feat/swiss-night-v2-20261127`
- Integrationsbasis: `9cd79c23a71231a095649813bf69b8ffac30e5d7` einschliesslich der vorangehenden Bild-/Trust-Korrekturen.
- Originalcheckout `C:\Users\thest\Documents\GitHub\rearea\iwantsexnow`: sauber; HEAD und origin/main unverändert bei `d337498c87c2b9789b78f069966c185173bcb972`.
- Keine Änderungen an `src/data`; vorhandene 2'590 eindeutige Profil-IDs und 108 Einrichtungsdatensätze erhalten. Keine Zugangsdaten oder Änderungen an Paketabhängigkeiten enthalten.

## Lokale Vorschau

- Interaktive Galerie: http://127.0.0.1:4182
- Fertiger Anwendungsbuild: http://127.0.0.1:4181
- Beide Dienste binden nur an Loopback. Anleitung nach einem Rechnerneustart: `docs/preview/README.md`.
- Galerie lädt die tatsächlichen Seiten bei 1440 px bzw. 390 px, jeweils scrollbar und bedienbar. Keine nachgebauten Demo-Seiten.

## Die 20 geprüften Seiten

| Nr. | Seite | Route | Desktop / Mobile |
|---|---|---|---|
| 1 | Startseite | `/` | bestanden |
| 2 | Suche und Filter | `/search` | bestanden |
| 3 | Zürich | `/escort-zurich` | bestanden |
| 4 | Zug | `/orte/zug` | bestanden |
| 5 | Genève | `/escort-geneva` | bestanden |
| 6 | Clubs und Studios | `/clubs` | bestanden |
| 7 | Bestehendes Profil | `/profile/ch-f62306bf1ed6` | bestanden |
| 8 | Profilvergleich | `/compare-escorts` | bestanden |
| 9 | Merkliste | `/favorites` | bestanden |
| 10 | Zehn Portale vergleichen | `/reviews` | bestanden |
| 11 | and6-Einzelbericht | `/reviews/and6` | bestanden |
| 12 | Preise verstehen | `/pricing` | bestanden |
| 13 | Sicherheit und Vertrauen | `/safety` | bestanden |
| 14 | Ablauf | `/how-it-works` | bestanden |
| 15 | Für Anbieter | `/advertise` | bestanden |
| 16 | Zugang vorbereiten | `/register` | bestanden |
| 17 | Anmelden | `/login` | bestanden |
| 18 | Arbeitsbereich | `/creator-dashboard` | bestanden |
| 19 | Profilentwurf | `/create-post` | bestanden |
| 20 | Meldungen und Korrekturen | `/report` | bestanden |

Alle 20 Seiten wurden bei 1440 × 1000 und 390 × 844 im Browser kontrolliert: jeweils genau ein h1, ein main und ein Footer; kein horizontaler Dokumentüberlauf. Anschliessend wurden nach dem abschliessenden Build alle 20 Seiten nochmals in beiden Galerie-Iframes geladen und die passenden Seitenüberschriften abgewartet. Screenshots wichtiger Ansichten wurden im Chat angezeigt. Die Galerie meldete dabei keine Browserwarnungen oder Konsolenfehler.

## Funktionsprüfungen im Browser

- Touch-Auswahl: Zug → Alle Bereiche → Offen → Zusammenfassung → `/search?canton=ZG`; 95 vorhandene Einträge. Ohne Text- oder Standortfreigabe.
- Originalprofil: sechs tatsächlich geladene Quellenbilder im betrachteten Profil, Wechsel von Bild 1 auf Bild 2. Bildquellen bleiben an dieselbe Profil-ID gebunden.
- Merken, Vergleichsauswahl bis drei Profile, mobile Auswahl des rechten Vergleichsprofils, Entfernen und leerer Zustand geprüft.
- Eigener Testentwurf lokal gespeichert, Vorschau geprüft und danach wieder gelöscht. Keine Veröffentlichung oder Server-Registrierung behauptet.
- Eigene Testauswahl aus Merkliste und Vergleich entfernt. Keine Nachrichten an Anbieter, keine bezahlten Dienste und keine echten Meldungen ausgelöst.
- Finale Studioseite: 108 Einträge aus serverseitig gefilterter Projektion; mobile Darstellung ohne Überlauf.

## Automatisierte Abnahme

| Prüfung | Ergebnis |
|---|---|
| `npm run build` | Exit 0, Next.js 15.5.28; TypeScript-Fehler werden nicht ignoriert |
| `npm run lint -- --quiet` | Exit 0, keine Lintfehler |
| `npx tsc --noEmit --pretty false` | Exit 0 |
| `node --test tests/*.test.mjs` | 166 bestanden, 0 fehlgeschlagen, 0 übersprungen |
| `git diff --check` | Exit 0 |
| Client-Bundle-Stichprobe | 101 JavaScript-Chunks auf die ersten 20 eindeutigen Rohquell-URLs geprüft; keine Treffer |

Rohprotokolle liegen als UTF-8 ohne BOM unter `docs/verification/`. HTTP-Tests liefen gegen den finalen lokalen Produktionsbuild. Provider-/Datenbankfehler und Autorisierungsgrenzen werden mit Testdaten und simulierten Diensten geprüft; das ist keine Abnahme eines produktiven Supabase-Projekts.

Die Suite enthält unter anderem Quellenbildauswahl, Bildsignaturen, erlaubte Bildproxyziele, Sichtbarkeit und Sperren, private Statusprojektion, sichere Anbieterentwürfe, falsche Eigentümer-/Zahlungs-/Claim-Angaben, ausgefallene Datenbank, alle Hauptseiten, 404-Fälle, bestehende Orts-/Kategorie-URLs, Sitemap und Legacyzugänge.

Ein verwaister Test importierte ein am 19.11.2026 in Commit `28f12104658c` entferntes Demo-Modul. Er wurde auf den echten Katalog migriert; ausschließlich Test-Fixtures bleiben in der Testdatei. Seine Suchverträge führten zu drei Korrekturen: Schweizer Ortsvarianten, feldübergreifende Suche mit allen Suchwörtern und Ablehnung ungültiger/mehrfacher Filter statt stiller Erweiterung auf alle Einträge.

## Bilddarstellung und Wahrheit der Angaben

- Originalfoto-Kandidaten werden geprüft und nacheinander versucht. Nicht erreichbare oder ungeeignete Bilder erhalten einen sichtbaren neutralen Zustand statt einer schwarzen Karte oder eines erfundenen Gesichts.
- Das dokumentierte Beispielprofil lädt sechs Originalquellenbilder. Das ist keine Aussage über die Erreichbarkeit aller externen Fotos.
- 611 Rohdatensätze enthalten KI-/Platzhalterporträts ohne wiederherstellbares geeignetes Original aus der geprüften Historie. Sie bleiben als Datensätze erhalten; diese Porträts werden nicht als echte Anbieterfotos ausgegeben. Details: `docs/profile-media-provenance.md`.
- Brand-, Stadt- und Kategoriemotive sind als Illustrationen getrennt. Sie ersetzen keine Profilbilder.
- Keine übernommenen Legacy-Flags als Identitätsnachweis, keine erfundenen Preise und keine zeitlich unbelegten Online-/Verfügbarkeitsversprechen.
- Die Auswahlhilfe ist ein deterministischer Touch-Flow. Sie gibt sich nicht als laufendes Sprachmodell oder allwissender Chat aus. Es gibt keinen kostenpflichtigen KI-Aufruf und keinen Pflichtchat.
- Der Portalvergleich zeigt zehn ausgewählte Websites, Quellen und Beobachtungsgrenzen. Er behauptet kein unbelegtes Markt-/Traffic-/Qualitätsranking.

## Zusätzlich geschlossene Datenpfade

Verborgene und gesperrte Profile liefern keine Namen, Ortskorrekturen oder Bilddaten in der öffentlichen Statusprojektion. Verwaiste Statusdatensätze werden entfernt. Studios werden vor Auslieferung serverseitig gefiltert und auf erlaubte Felder reduziert. Konfigurierte Datenbankausfälle führen zu Fehlerantworten statt einer veröffentlichten lokalen Ersatzantwort.

Elf ältere Oberflächen importierten komplette Rohkataloge und enthielten teilweise unbelegte Preis-, Freischaltungs- oder Verfügbarkeitsbehauptungen. Sie werden reversibel mit HTTP 307 auf die funktionsfähige Oberfläche weitergeleitet:

- `/checkout` → `/pricing`
- `/events` → `/clubs`
- `/members`, `/messages`, `/notifications` → `/favorites`
- `/gifts`, `/live-cam`, `/matches`, `/rankings`, `/stories` → `/search`
- `/fantasy-preview` → `/how-it-works`

Die frühere Adminseite liefert keine Pilot-/Studio-Rohdaten mehr aus und zeigt einen noindex-Zugangshinweis bis zur geprüften administrativen Sitzung. `/api/admin/overview` und `/api/admin/health` verlangen die serverseitige administrative Zugangsprüfung. Beide Legacy-Such-APIs verwenden die neue öffentliche Projektion mit denselben Sichtbarkeits-/Preisregeln; erfundene Vector-/Pinecone-Engine-Angaben entfallen.

Die 2'590 vorhandenen Profil-URLs bleiben indexierbar; die Sitemap enthält alle sichtbaren Profile statt der früheren Begrenzung auf 1'000. Bestehende Orts- und Kategorienmuster bleiben erhalten. Die vorübergehenden Weiterleitungen betreffen die oben ausdrücklich aufgeführten Altoberflächen.

## Vor einer späteren Produktionsfreigabe offen

1. Bildrechte, Veröffentlichungseinwilligungen, Volljährigkeits- und Inhaberschaftsnachweise sind durch den Repositorybestand nicht nachgewiesen. Keine solche Prüfung wurde erfunden.
2. Tatsächliche Produktionskonfiguration, private Nutzerfreigaben, Supabase-Migrationen/RLS und der reale Meldeeingang wurden hier nicht live verändert oder abgenommen.
3. Der vollständige öffentliche Katalog wird weiterhin als SSR-Datensatz übertragen (rund 1,6 MB vor Transportkompression). Der gemeinsame JS-Anteil wurde reduziert; eine gemessene mobile Ladezeit-/Core-Web-Vitals-Abnahme und serverseitige Katalogpaginierung bleiben eigenständige Aufgaben. Ein grüner Build beweist diese Leistung nicht.
4. Externe Originalbilder bleiben von der Erreichbarkeit ihrer Quellen abhängig.

Lokaler Build, automatisierte Tests und responsive Review sind abgeschlossen. GitHub-CI, Merge, produktives Deployment und produktive Abnahme wurden nicht durchgeführt.