# Swiss Night V2 – Anbieterbereich und erhaltene Schutzgrenzen

Stand: 27. November 2026. Geprüfte Ausgangsstände: `main` bei `d337498c87c2b9789b78f069966c185173bcb972`, Foto-/Trust-Branch bei `9cd79c23a71231a095649813bf69b8ffac30e5d7`. Empfohlene und gewählte Integrationsbasis: **9cd79c2**, damit die Bildproxy-, Claim-, Zahlungs-, SEO- und Meldeschutzmassnahmen erhalten bleiben. Dieser Bericht ist keine Produktionsfreigabe.

## Datenbestand, ohne Identitätsbehauptung

Die Dateien beider Ausgangsstände wurden gelesen und als JSON verglichen. Ihre Inhalte sind identisch; unterschiedliche Dateihashes stammen aus der Dateidarstellung. Keine einzelnen Namen, Kontakte, Token oder anderen personenbezogenen Rohdaten sind in diesem Bericht enthalten.

| Datenquelle | Beobachteter Umfang | Bedeutung |
|---|---:|---|
| `src/data/harvested-offers.json` | 2'590 Zeilen, 2'590 eindeutige IDs | Importierte Katalogeinträge; jeder hat ein `sourceUrl`-Feld. Das belegt keine Identität oder Einwilligung. |
| `src/data/swiss-establishments-vault.json` | 108 Einträge | Tatsächliche Arraylänge. Die ältere UI-Zahl 305 war keine aus diesem Array abgeleitete aktuelle Anzahl. |
| `src/data/managed-profile-states.json` | 2'546 Zustände | In der gelesenen Datei: 0 `claimed`, 0 `identityVerified`, 0 `aiOptIn`, 0 bestätigte Verfügbarkeit. |

Der Rohkatalog enthält dennoch 65 `identityVerified`- und 7 `verified`-Flags. Solche Legacy-Felder sind kein belastbarer Prüfbeleg. `directAuthorized` ist bei keinem gelesenen Datensatz `true`. Einwilligungen, Bildrechte, aktueller Publikationsauftrag und Altersprüfung sind durch diese Dateien **nicht nachgewiesen**. Ob entsprechende Nachweise ausserhalb des Repositorys existieren, wurde nicht verifiziert.

1'979 Katalogzeilen tragen ein `hasRealPortalPhoto`-Flag. Bei 611 Zeilen fand die reine Zeichenkettenprüfung keinen nicht offensichtlich als Platzhalter erkennbaren HTTP-Bildkandidaten. Diese Prüfung belegt weder Erreichbarkeit noch Bildrechte. Fehlende Originale dürfen nicht durch fremde oder KI-generierte Personenporträts ersetzt werden. Die vorhandenen IDs, Quelldaten und Profile werden durch diese Integration nicht gelöscht oder mit Demoprofilen überschrieben.

## Bereits vorhandene Grenzen, die erhalten bleiben

- `src/pages/api/img.ts`: Quellen-Host-Allowlist, erneute Prüfung jedes Redirects, Typprüfung, 8-MB-Grenze beim Streamen, Timeout, Ablehnung bekannter Platzhalter. Technische Quellenfreigabe ist keine Lizenzbestätigung.
- `src/components/LuxuryPhotoCard.tsx`: echte Bildkandidaten und sichtbarer Hinweis, wenn kein Originalfoto verfügbar ist. Keine neue Person als Ersatz erzeugen.
- `src/pages/api/claims/create.ts` und `src/pages/api/vault/unlock.ts`: anonyme Profilübernahme bzw. clientseitige Zahlungsbehauptung bleiben gesperrt.
- `src/lib/marketplace/private-draft-http.ts` sowie `api/private/provider-session.ts` und `provider-drafts.ts`: servergeprüfte Sitzung, bestätigte E-Mail, zugelassene Konten, gleicher Origin, HttpOnly-/SameSite-Cookie, begrenzte Sitzung, Eigentümerprüfung und private Speicherung. Keine dieser Prüfungen wird in der neuen Oberfläche umgangen.
- `src/lib/marketplace/drafts.ts`, `supabase-drafts.ts` und `publication.ts`: begrenzte Felder, eigene Entwürfe, gesonderte Nachweis-/Freigabepflichten für Veröffentlichung. Ein eigenes Konto beweist keine Inhaberschaft eines importierten Profils.
- `supabase/migrations/20261127_private_report_intake.sql`: vertraulicher Meldeeingang ohne öffentliche Leserechte. Ob die Migration im tatsächlichen Zielprojekt angewendet wurde, ist hier nicht nachgewiesen.

## Umgesetzter Anbieterbereich

Die Routen `/register`, `/login`, `/creator-dashboard`, `/create-post` und `/report` sind in die bestehende Next.js-Anwendung integriert. Sie verwenden die gemeinsamen Night-Klassen und keinen zweiten Seitenheader oder Footer.

Der neue gemeinsame Arbeitsbereich nutzt ausschliesslich die vorhandenen privaten Sitzungs-/Entwurfs-APIs. Eine Anmeldung erscheint erst nach bestätigter Serverantwort erfolgreich. Er speichert nur `displayAlias`, `city`, `description` und `photoRightsConfirmed`. Antworten mit fremdem Eigentümer, falschem Datensatz, veröffentlichtem Zustand oder ungültiger Struktur werden nicht als Speichererfolg akzeptiert.

Ohne Sitzung kann der Nutzer bewusst einen eigenen Entwurf lokal im Browser speichern. Das ist sichtbar von einem Konto und einem privaten Serverentwurf getrennt; es gibt keine automatische Veröffentlichung, keine automatische Übertragung des lokalen Entwurfs und keine Speicherung von Passwörtern oder Sitzungstoken im Browserspeicher. Bild-Upload und Veröffentlichung bleiben bis zu einem überprüften Ablauf gesperrt. Die Schreibhilfe ordnet ausschliesslich eingegebenen Text; kein Modell oder kostenpflichtiger Dienst wird aufgerufen.

Eine Meldung erhält erst bei HTTP 202, `RECEIVED` und gültiger Fall-ID eine Eingangsbestätigung. Die Oberfläche behauptet dabei keine Entfernung und keine abgeschlossene Prüfung.

## Zusätzlich geschlossene P0-Pfade

Die alten Routen `api/avatar-chat/[providerId].ts` und `api/fantasy-preview/generate.ts` importierten zwar einen Einwilligungshelfer, riefen ihn aber nicht auf. Damit waren unter anderem eine anonyme Opt-in-Umschaltung und kostenpflichtige Voice-/Video-Aufrufe möglich. Beide Routen verwenden jetzt `consent-feature-gate.ts` und antworten vor Speicherung oder externen Aufrufen mit 503. Body-Felder wie `unlocked`, `hasPaidCredit` oder `aiOptIn` können die Sperre nicht umgehen. Andere Methoden erhalten 405.

Die beiden alten internen Anfragewege (`api/enquiries/create.ts` und `create_enquiry` in `api/vault/metrics.ts`) konnten ungeprüfte persönliche Angaben weiterleiten bzw. eine Zustellung behaupten. Sie antworten jetzt ohne Schreib- oder Nachrichteneffekt mit 503, bis eine bestätigte Zustellung an den richtigen Empfänger eingerichtet ist. Vorhandene direkte Quellen-/Kontaktverweise im Katalog werden dadurch nicht geändert. Der vertrauliche Meldeweg bleibt erhalten.

`api/vault/metrics.ts` gibt bei konfigurierter Datenbank und fehlgeschlagenem oder strukturell ungültigem Statusabruf 503 zurück, statt lokale Altdaten als aktuellen Stand auszugeben. Die öffentliche Whitelist enthält zusätzlich nur die vier expliziten Preisbelegfelder `priceConfirmed`, `rateConfirmed`, `priceConfirmedAt`, `rateUpdatedAt` und die Ablaufzeit `availableUntil`. Keine Tokens, privaten Meldungen oder zusätzlichen Eigentümerdaten werden dadurch öffentlich.

## Prüfstand und verbleibende Grenzen

`node --test tests/provider-workspace-v2.test.mjs`: **16 Tests bestanden**. Enthalten sind erlaubte Felder, Eigentümer-/Status-Verwechslung, fehlende Sitzung ohne Netzaufruf, fehlgeschlagene Speicherung/Abmeldung, echte Meldungsquittung, beide AI-Sperren, interne Anfrage ohne Seiteneffekt, Datenbankausfall ohne Altdatenveröffentlichung sowie Syntaxprüfung der fünf Seiten und der gemeinsamen Komponente. Tests verwenden ausschliesslich synthetische Daten und simulierte Dienste; es wurden keine Nachrichten versandt oder bezahlten Dienste aufgerufen.

Die tatsächliche Datenbankkonfiguration, vorhandene Nutzerfreigaben, produktive RLS-Regeln und das Verhalten des späteren Deployments müssen in der gemeinsamen Abnahme geprüft werden. Die Integration darf die bestehende Indexierung öffentlicher Katalog-/Orts-/Kategorieseiten nicht pauschal sperren. Anbieter-Arbeitsseiten bleiben `noindex`; echte Profil-IDs und bestehende öffentliche URL-Muster bleiben erhalten. Frühere Rohdaten-Flags und importierte Standardpreise sind weiterhin kein Beleg für Verifizierung, Einwilligung oder ein bestätigtes Honorar.
