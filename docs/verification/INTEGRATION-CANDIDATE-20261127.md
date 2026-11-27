# IWSN Flagship V2 – main-Integrationskandidat

**Stand:** 27. November 2026 (Europe/Zurich). Dieser Bericht dokumentiert einen lokalen und nicht veroeffentlichten Zusammenschluss. Keine Produktionsfreigabe.

## Quellenstand und Isolation

- Ziel-Branch: `integrate/flagship-v2-20261127`
- Separater Windows-Worktree: `C:\Users\thest\Documents\GitHub\rearea\iwantsexnow-flagship-integrated`
- Urspruenglicher `main`: `5f009f9f20009f157a265a69adfe8a23d64285d8`
- Swiss-Night-V2-Quellstand: `bc798ca` (`feat/swiss-night-v2-20261127`)
- Lokale Zusammenfuehrung: `git merge --no-ff --no-commit`, **ohne Konflikte**.
- Der laufende Performance-Worktree `perf/night-catalogue-on-demand-20261127` wurde weder bearbeitet noch integriert; dessen nicht committete Aenderungen bleiben unberuehrt.

## Unabhaengig wiederholte Pruefungen dieses Integrationsstands

| Test | Ergebnis |
|---|---|
| `npm run build` | Exit 0, Next.js 15.5.28, Typfehler nicht ignoriert |
| `npm run lint -- --quiet` | Exit 0, keine ESLint-Warnungen oder -Fehler |
| `tsc --noEmit --pretty false` | Exit 0 |
| `node --test tests/*.test.mjs` mit `IWSN_TEST_BASE_URL=http://127.0.0.1:4211` | 204 bestanden, 0 fehlgeschlagen, 0 uebersprungen |
| `git diff --cached --check` | Exit 0 |
| 20 Hauptseiten, Routen, kanonische URLs, ein Header/Ein Footer | Automatisierte HTTP-Regressionen bestanden |
| Bild-/Status-/Inhaberschafts-/Berichtsschutz | Negative Regressionen bestanden; keine produktive Rechtepruefung |

Der gebaute Kandidat liegt lokal auf ROG unter `http://127.0.0.1:4211` (nur von diesem Geraet aus, solange der lokale Server aktiv ist).
Die bereits im Feature-Branch dokumentierten Browseraufnahmen fuer 1440 px und 390 px wurden **nicht** in diesem Integrationslauf neu aufgenommen. Der Kandidat benoetigt daher vor Freigabe eine abschliessende visuelle und produktive Abnahme.

Der `First Load JS shared by all`-Wert des lokalen Kandidaten betraegt laut Build rund **143 KB**. Die historische Ausgangsbasis lag laut frueherem Build bei rund **863 KB**. Dies ist kein gemessener Core-Web-Vitals- oder Endnutzer-Ladewert. Das bestehende Problem einer grossen SSR-Datenlieferung bleibt gesondert bestehen.

## URL-Entscheidung: visuelles Konzept gegen echte Next.js-Routen

Die designorientierten Aliasnamen wie `/suche`, `/profil/[id]`, `/regionen` und `/portalvergleich` werden **nicht** ungeprueft als parallele indexierbare URLs angelegt. Die tatsaechlichen 20 Hauptansichten folgen den vorhandenen stabilen Routen aus `docs/verification/SWISS-NIGHT-V2-ACCEPTANCE.md`, insbesondere `/`, `/search`, `/profile/[id]`, `/orte/[slug]`, `/clubs`, `/reviews`, `/pricing`, `/register`, `/creator-dashboard` und `/report`.

## Offene Voraussetzungen fuer Live-Freigabe

1. **Persoenliche Daten/Medien:** Bildrechte, erlaubte Veroeffentlichung, Alter und Inhaberschaft echter Eintraege sind mit dem vorhandenen Repo allein nicht nachgewiesen. Diese externe Rechts-/Prozessgrundlage darf nicht als bestanden deklariert werden.
2. **Produktives Backend:** Zielprojekt, Datenbank-Migrationen, RLS und private Sitzungskonfiguration muessen in der tatsaechlichen Softgen/Supabase-Umgebung geprueft werden. Lokale Tests nutzten Testdaten und simulierte Dienste.
3. **Meldeweg:** Produktiver vertraulicher Fall-Eingang, Wiederfinden und globaler Entfernungs-/Reimport-Schutz muessen auf der Zielumgebung nachgewiesen werden.
4. **Leistung:** Server-Catalogue-Paginierung und mobile Core-Web-Vitals sind noch nicht abgenommen. Ein separater Performance-Branch enthaelt nicht committete Arbeit, die vor Integration erst auszufuehren und zu pruefen ist.
5. **Deployment:** GitHub-CI, Softgen-Zielbindung und veroeffentlichter SHA muessen vor/bei einem explizit freigegebenen Redeploy kontrolliert werden; bisher keine Veroeffentlichung.

## Ergebnis

Ein lokal zusammengefuehrter und durch Build, Lint, Typpruefung und 204 automatisierte Tests gegangener **Integrationskandidat**. Kein `origin/main`-Push, kein PR, kein produktiver Release und keine Aenderung am bestehenden Haupt-Worktree.
