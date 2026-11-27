# Swiss Night V2 – lokale Review-Galerie

Diese Galerie zeigt die implementierten Seiten der Anwendung mit dem vorhandenen Katalog. Jede der 20 Seiten lässt sich bei 1440 px und 390 px nebeneinander bedienen und scrollen. Es sind keine Screenshot-Attrappen.

- Anwendung: http://127.0.0.1:4181
- Galerie: http://127.0.0.1:4182
- Branch: `feat/swiss-night-v2-20261127`

Die beiden Dienste binden ausschliesslich an 127.0.0.1. Die Galerie setzt zusätzlich `noindex`. Es wird nichts veröffentlicht. Die Indexierungsregeln der eigentlichen öffentlichen Seiten bleiben erhalten.

## Nach einem Neustart

In zwei PowerShell-Fenstern aus diesem Worktree starten; die Befehle installieren nichts und deployen nichts:

```powershell
Set-Location -LiteralPath 'C:\Users\thest\Documents\GitHub\rearea\iwantsexnow-swiss-night-v2'
node .\node_modules\next\dist\bin\next start -H 127.0.0.1 -p 4181
```

```powershell
Set-Location -LiteralPath 'C:\Users\thest\Documents\GitHub\rearea\iwantsexnow-swiss-night-v2'
node .\docs\preview\server.mjs
```

## Reproduzierbare Prüfung

Die Anwendung auf Port 4181 muss für die HTTP-Tests laufen. Vor einem neuen Build die eigene Instanz beenden und danach wieder starten; keinen laufenden Entwicklungsserver parallel in derselben `.next`-Ausgabe verwenden.

```powershell
$ErrorActionPreference = 'Stop'
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
[Console]::OutputEncoding = $utf8NoBom
$OutputEncoding = $utf8NoBom
Set-Location -LiteralPath 'C:\Users\thest\Documents\GitHub\rearea\iwantsexnow-swiss-night-v2'
git status --short --branch
if ($LASTEXITCODE -ne 0) { throw 'Git-Pruefung fehlgeschlagen.' }
node --version
npm --version
npm run build
if ($LASTEXITCODE -ne 0) { throw 'Build fehlgeschlagen.' }
npm run lint -- --quiet
if ($LASTEXITCODE -ne 0) { throw 'Lint fehlgeschlagen.' }
npx tsc --noEmit --pretty false
if ($LASTEXITCODE -ne 0) { throw 'Typpruefung fehlgeschlagen.' }
# Jetzt den fertig gebauten Server im zweiten Fenster starten.
$env:IWSN_TEST_BASE_URL = 'http://127.0.0.1:4181'
node --test tests/*.test.mjs
if ($LASTEXITCODE -ne 0) { throw 'Tests fehlgeschlagen.' }
git diff --check
if ($LASTEXITCODE -ne 0) { throw 'Diff-Pruefung fehlgeschlagen.' }
```

Keine Zugangsdaten, Rohprofile oder Meldungsinhalte in Diagnoseprotokolle kopieren. Das Ansehen eines importierten Profils bestätigt weder Inhaberschaft noch Bildrechte. Nicht erreichbare Originalfotos erhalten einen sichtbaren neutralen Zustand.