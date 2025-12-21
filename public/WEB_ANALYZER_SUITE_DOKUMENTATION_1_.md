# 📚 Web Analyzer Suite - Vollständige Dokumentation

## Überblick

Die Web Analyzer Suite ist eine umfassende Sammlung von Analyse-Tools für Websites, bestehend aus **7 Szenarien/Tools** mit unterschiedlichen Anwendungsfällen.

---

# 🎯 Die 7 Szenarien im Überblick

| # | Tool | Wann verwenden? | Dauer | Output |
|---|------|-----------------|-------|--------|
| 1 | **Mega Export** | Komplettes Tool auf neues Lovable replizieren | 10 Min | ZIP + Prompt |
| 2 | **1-Klick KI-Analyse** | Schnelle Website-Analyse ohne Aufwand | 1-2 Min | Markdown Report |
| 3 | **Manuelles Package** | Daten für externe KI (ChatGPT/Claude) | 3-5 Min | ZIP mit allem |
| 4 | **Screenshot Machine** | Einzel- oder Bulk-Screenshots | 30 Sek | PNG/ZIP |
| 5 | **SEO HTML Analyzer** | Raw vs. Rendered HTML vergleichen | 1 Min | Diff + Tags |
| 6 | **KI-Prompt Generator** | 7 optimierte Prompts für KI-Analyse | 1 Min | Copy-Paste Prompts |
| 7 | **URL Discovery** | Alle Seiten einer Website finden | 30 Sek | URL-Liste |

---

# 📦 SZENARIO 1: Mega Export (Tool replizieren)

## Zweck
Repliziert das KOMPLETTE Admin-Tools-System auf ein neues Lovable-Projekt.

## Wann verwenden?
- Du willst das Tool für einen Kunden aufsetzen
- Du willst eine eigene Instanz haben
- Du willst das Tool anpassen/erweitern

## Was ist enthalten?
1. **5 Edge Functions** (echter Code)
   - fetch-html
   - capture-rendered-html  
   - ai-website-analyze
   - lighthouse
   - firecrawl-map

2. **SQL Migration** (Datenbank-Schema)
   - profiles Tabelle
   - user_roles Tabelle
   - screenshot_history
   - screenshot_baselines
   - analysis_reports

3. **RLS Policies** (Sicherheit)
   - Admin-only Zugriff
   - has_role() Funktion

4. **config.toml** (Supabase Config)
   - JWT-Verifikation deaktiviert für öffentliche Funktionen

5. **README.md** (Prompt für Lovable)
   - Kopiere diesen Text in ein neues Lovable-Projekt

## Anleitung
1. Klicke "MEGA_EXPORT.zip herunterladen"
2. Öffne lovable.dev → Neues Projekt
3. Kopiere Inhalt von README.md in den Chat
4. Warte bis generiert
5. Registriere dich in der App
6. Gehe ins Backend → user_roles Tabelle
7. Füge deine user_id mit role='admin' hinzu
8. (Optional) Verbinde Firecrawl für Screenshots

## Worauf achten?
⚠️ **Secrets nicht vergessen!**
- FIRECRAWL_API_KEY muss nach dem Setup hinzugefügt werden
- LOVABLE_API_KEY ist automatisch vorhanden bei Lovable Cloud

⚠️ **Admin-Rolle manuell hinzufügen!**
```sql
INSERT INTO user_roles (user_id, role) 
VALUES ('deine-user-id', 'admin');
```

---

# 🤖 SZENARIO 2: 1-Klick KI-Analyse

## Zweck
Sofortige, automatische Website-Analyse mit Lovable AI.

## Wann verwenden?
- Schnelle Erst-Analyse einer Website
- Keine Zeit für manuelle Prompts
- Interne Reviews

## Was passiert?
1. Screenshot der Startseite wird erstellt
2. HTML-Quellcode wird abgerufen
3. Beides wird an Lovable AI gesendet
4. Strukturierte Analyse wird zurückgegeben

## Output
- Markdown-Report mit:
  - TOP 3 Conversion-Killer
  - Quick Wins
  - SEO-Probleme
  - Mobile UX Issues
  - Priorisierter Aktionsplan

## Anleitung
1. Gib die Website-URL ein (im "Projekt Konfiguration" Bereich)
2. (Optional) Füge Projektname und Beschreibung hinzu
3. Klicke "Website jetzt analysieren"
4. Warte 1-2 Minuten
5. Kopiere/Downloade das Ergebnis

## Worauf achten?
⚠️ **URL muss erreichbar sein** (kein Passwortschutz)
⚠️ **Rate Limits** bei vielen Anfragen möglich
⚠️ **Kein Firecrawl nötig** für Basis-Analyse

---

# 📁 SZENARIO 3: Manuelles Package

## Zweck
Erstellt ein komplettes Analyse-Paket für externe KI-Tools.

## Wann verwenden?
- Du willst ChatGPT/Claude mit Kontext füttern
- Du brauchst Screenshots + HTML für Dokumentation
- Kunde soll Paket für eigene Analyse erhalten

## Was ist enthalten?
```
📦 feedback-package.zip
├── 📁 screenshots/
│   ├── homepage-desktop.png
│   ├── homepage-mobile.png
│   ├── page-1-desktop.png
│   └── ...
├── 📁 html/
│   └── homepage-raw.html
├── 📁 rendered-html/
│   └── homepage-rendered.html
├── 📁 prompts/
│   ├── 01_QUICK_ANALYSIS.md
│   ├── 02_DEEP_AUDIT.md
│   ├── 03_CODE_REVIEW.md
│   ├── 04_SCREENSHOT_ANALYSIS.md
│   ├── 05_REGRESSION_REPORT.md
│   ├── 06_SEO_DEEP_DIVE.md
│   └── 07_ACCESSIBILITY_AUDIT.md
├── ANALYSIS_PROMPT.md
├── PROJECT_BRIEF.pdf
└── README.md
```

## Anleitung
1. Fülle alle Projektdaten aus (Name, URL, Beschreibung, Ziele)
2. (Optional) Nutze "URL Discovery" um Unterseiten zu finden
3. Füge zusätzliche Seiten hinzu
4. Klicke "Package für ChatGPT/Claude"
5. Warte bis ZIP generiert ist
6. Öffne ChatGPT/Claude
7. Wähle einen Prompt aus /prompts/
8. Lade relevante Screenshots/HTML hoch

## Worauf achten?
⚠️ **Firecrawl benötigt** für Screenshots
⚠️ **Kann 3-5 Minuten dauern** bei vielen Seiten
⚠️ **Grosse Dateien** - nicht zu viele Seiten auf einmal

---

# 📸 SZENARIO 4: Screenshot Machine

## Zweck
Erstellt Screenshots von einer oder mehreren URLs.

## Wann verwenden?
- Dokumentation / Archivierung
- Vorher/Nachher Vergleiche
- Bulk-Screenshots für Berichte

## Modi
1. **Einzel-Screenshot**
   - Eine URL
   - Wählbare Dimension
   - Optional: Volle Seite

2. **Bulk-Screenshots**
   - Mehrere URLs (eine pro Zeile)
   - Automatisches ZIP

## Dimension-Presets
| Gerät | Auflösung |
|-------|-----------|
| Desktop HD | 1920x1080 |
| Desktop Full Page | 1920xfull |
| MacBook | 1440x900 |
| iPhone 14 Pro | 393x852 |
| iPhone SE | 375x667 |
| Android | 360x800 |

## Anleitung
1. Gib URL(s) ein
2. Wähle Dimension
3. Setze Verzögerung (für dynamische Inhalte)
4. Aktiviere "Volle Seite" wenn gewünscht
5. Klicke "Screenshot erfassen" oder "Bulk Download"

## Worauf achten?
⚠️ **Firecrawl benötigt**
⚠️ **Verzögerung nutzen** für Lazy-Load Inhalte
⚠️ **Volle Seite** kann sehr grosse Bilder erzeugen

---

# 🔍 SZENARIO 5: SEO HTML Analyzer

## Zweck
Vergleicht Raw HTML mit Rendered HTML und extrahiert SEO-relevante Tags.

## Wann verwenden?
- JavaScript-SEO Debugging
- Meta-Tag Überprüfung
- Heading-Struktur analysieren
- Interne Links prüfen

## Was wird analysiert?
- **Meta Tags**: Title, Description, Keywords
- **Headings**: H1-H6 Hierarchie
- **Links**: Interne und externe Links
- **Images**: Alt-Tags
- **Structured Data**: JSON-LD

## Anleitung
1. Gehe zum Tab "SEO HTML Analyzer"
2. Gib URL ein oder wähle Preset
3. Klicke "HTML abrufen"
4. Vergleiche Raw vs. Rendered
5. Exportiere für KI-Analyse

## Worauf achten?
⚠️ **Raw ≠ Rendered** bei JavaScript-Seiten
⚠️ **Google sieht Rendered** (wenn JS indexiert wird)
⚠️ **Firecrawl für Rendered** HTML benötigt

---

# ✨ SZENARIO 6: KI-Prompt Generator

## Zweck
Generiert optimierte, Copy-Paste-fertige Prompts für KI-Analyse.

## Wann verwenden?
- Du willst einen spezifischen Analyse-Typ
- Du nutzt ChatGPT/Claude manuell
- Du willst Prompts für das Team bereitstellen

## Die 7 Prompt-Varianten

| # | Prompt | Fokus | Dauer |
|---|--------|-------|-------|
| 1 | Quick Analysis | Schnelle UX/Conversion-Checks | ~2 Min |
| 2 | Deep Audit | Vollständige Analyse | ~10 Min |
| 3 | Code Review | Technische Qualität | ~5 Min |
| 4 | Screenshot Analysis | Visuelles Review | ~3 Min |
| 5 | Regression Report | Änderungs-Analyse | ~3 Min |
| 6 | SEO Deep Dive | Suchmaschinen-Optimierung | ~8 Min |
| 7 | Accessibility Audit | WCAG-Konformität | ~5 Min |

## Anleitung
1. Klicke auf gewünschten Prompt-Typ
2. Der Prompt wird mit deinen Projektdaten gefüllt
3. Kopiere den Prompt
4. Füge in ChatGPT/Claude ein
5. Lade Screenshots/HTML hoch
6. Erhalte strukturierte Analyse

## Worauf achten?
⚠️ **Projektdaten vorher ausfüllen** für personalisierte Prompts
⚠️ **Screenshot + HTML hochladen** für beste Ergebnisse
⚠️ **GPT-4/Claude 3** für komplexe Analysen empfohlen

---

# 🌐 SZENARIO 7: URL Discovery

## Zweck
Findet automatisch alle URLs/Unterseiten einer Website.

## Wann verwenden?
- Du kennst nicht alle Seiten
- Sitemap fehlt oder ist unvollständig
- Du willst Bulk-Analyse machen

## Was passiert?
1. Firecrawl "mappt" die Website
2. Alle erreichbaren URLs werden extrahiert
3. Du wählst welche Seiten du analysieren willst

## Anleitung
1. Gib die Haupt-URL ein
2. Klicke "URLs entdecken"
3. Warte 10-30 Sekunden
4. Wähle die gewünschten Seiten aus
5. Klicke "Ausgewählte hinzufügen"
6. Die Seiten werden zur Analyse-Liste hinzugefügt

## Worauf achten?
⚠️ **Firecrawl benötigt**
⚠️ **Limit: 50 URLs** pro Scan
⚠️ **Nur öffentliche Seiten** werden gefunden

---

# 🔐 Voraussetzungen & Secrets

## Benötigte Secrets

| Secret | Benötigt für | Wo hinzufügen |
|--------|--------------|---------------|
| FIRECRAWL_API_KEY | Screenshots, Rendered HTML, URL Discovery | Connectors → Firecrawl |
| LOVABLE_API_KEY | 1-Klick KI-Analyse | Automatisch bei Lovable Cloud |

## Wie Firecrawl hinzufügen?
1. Gehe zu https://firecrawl.dev
2. Erstelle Account
3. Kopiere API Key
4. In Lovable: Settings → Connectors → Firecrawl → Connect

---

# 🎯 Welches Tool für welches Szenario?

| Ich will... | Verwende... |
|-------------|-------------|
| Das komplette Tool woanders replizieren | Mega Export |
| Schnelle Website-Analyse (1 Klick) | 1-Klick KI-Analyse |
| Daten für ChatGPT/Claude vorbereiten | Manuelles Package |
| Nur Screenshots machen | Screenshot Machine |
| SEO-Tags analysieren | SEO HTML Analyzer |
| Prompt für spezielle Analyse | KI-Prompt Generator |
| Alle Unterseiten finden | URL Discovery |

---

# 📊 Entscheidungsbaum

```
Willst du das Tool replizieren?
├── JA → Mega Export
└── NEIN → Willst du eine Website analysieren?
    ├── JA → Brauchst du externe KI (ChatGPT/Claude)?
    │   ├── JA → Manuelles Package
    │   └── NEIN → 1-Klick KI-Analyse
    └── NEIN → Was willst du?
        ├── Screenshots → Screenshot Machine
        ├── HTML/SEO → SEO HTML Analyzer
        ├── Prompts → KI-Prompt Generator
        └── URLs finden → URL Discovery
```

---

# ⚡ Quick Reference

## Tastenkürzel
- **Enter** in URL-Feld → Seite hinzufügen
- **Klick auf Badge** → Seite entfernen

## Beste Praktiken
1. **Immer Projektdaten ausfüllen** → Bessere Prompts
2. **Verzögerung 3-5 Sek** → Für JavaScript-Seiten
3. **Desktop + Mobile** → Für vollständige Analyse
4. **Raw + Rendered HTML** → Für SEO-Analyse

## Troubleshooting
| Problem | Lösung |
|---------|--------|
| Screenshot leer | Verzögerung erhöhen |
| "Firecrawl nicht verbunden" | Connector hinzufügen |
| Rate Limit | 1 Minute warten |
| Analyse fehlgeschlagen | URL prüfen (https://) |

---

Erstellt mit ❤️ für umzugscheck.ch
