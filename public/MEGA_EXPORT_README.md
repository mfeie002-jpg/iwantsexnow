# 🚀 Web Analyzer Suite - Mega Export

## Was ist das?

Dieses Paket enthält ALLES, was du brauchst, um die Web Analyzer Suite auf einem neuen Lovable-Projekt zu replizieren.

## 📦 Inhalt

```
MEGA_EXPORT/
├── supabase/
│   ├── migrations/
│   │   └── 20250121_web_analyzer_suite.sql
│   ├── functions/
│   │   ├── fetch-html/
│   │   ├── capture-screenshot/
│   │   ├── capture-rendered-html/
│   │   ├── ai-website-analyze/
│   │   └── firecrawl-map/
│   └── config.toml
├── src/
│   └── pages/
│       ├── web-analyzer.tsx
│       └── api/
│           └── supabase-function.ts
├── README.md (diese Datei)
└── LOVABLE_PROMPT.md (Kopiere das in Lovable!)
```

## 🎯 Schritt-für-Schritt Anleitung

### 1. Neues Lovable-Projekt erstellen
```
1. Gehe zu https://lovable.dev
2. Klicke "New Project"
3. Wähle "Next.js + Supabase" Template
```

### 2. Lovable Prompt kopieren
```
1. Öffne LOVABLE_PROMPT.md aus diesem ZIP
2. Kopiere den gesamten Inhalt
3. Füge ihn in den Lovable Chat ein
4. Warte bis das Projekt generiert ist
```

### 3. Supabase Setup
```
1. Gehe zu Project Settings → Database
2. SQL Editor öffnen
3. Kopiere Inhalt von supabase/migrations/20250121_web_analyzer_suite.sql
4. Führe das SQL aus
```

### 4. Edge Functions deployen
```
1. Für jede Function in supabase/functions/:
   - Erstelle neue Edge Function in Supabase Dashboard
   - Kopiere den Code aus index.ts
   - Speichere und deploye
```

### 5. Secrets konfigurieren
```
1. Gehe zu Project Settings → Edge Functions → Secrets
2. Füge hinzu:
   - FIRECRAWL_API_KEY (von firecrawl.dev)
   - LOVABLE_API_KEY (automatisch bei Lovable Cloud)
```

### 6. Admin-Rolle zuweisen
```sql
-- Registriere dich zuerst in der App
-- Dann führe in SQL Editor aus:

INSERT INTO user_roles (user_id, role) 
VALUES ('deine-user-id-aus-auth.users', 'admin');
```

### 7. Frontend-Code hinzufügen
```
1. Kopiere src/pages/web-analyzer.tsx in dein Projekt
2. Kopiere src/pages/api/supabase-function.ts in dein Projekt
3. Deploy das Projekt
```

## 🔐 Benötigte API Keys

### Firecrawl API (für Screenshots & URL Discovery)
1. Gehe zu https://firecrawl.dev
2. Erstelle Account (Free Tier: 500 Credits/Monat)
3. Kopiere API Key
4. Füge in Supabase Secrets ein

### Lovable API (für 1-Klick Analyse)
- Automatisch verfügbar bei Lovable Cloud Projekten
- Keine manuelle Konfiguration nötig

## 📊 Was bekommst du?

### 7 Analyse-Tools:
1. **Mega Export** - Das Tool replizieren (🎉 Du bist hier!)
2. **1-Klick KI-Analyse** - Automatische Website-Analyse
3. **Manuelles Package** - Daten für ChatGPT/Claude
4. **Screenshot Machine** - Einzel- & Bulk-Screenshots
5. **SEO HTML Analyzer** - Raw vs Rendered HTML
6. **KI-Prompt Generator** - 7 optimierte Prompts
7. **URL Discovery** - Alle Unterseiten finden

### Datenbank-Schema:
- ✅ user_roles (Admin-System)
- ✅ screenshot_history (Screenshot-Archiv)
- ✅ screenshot_baselines (Regression Testing)
- ✅ analysis_reports (Analyse-Historie)
- ✅ html_cache (SEO-Cache)
- ✅ url_discovery_cache (URL-Cache)

### Security:
- ✅ Row Level Security (RLS) Policies
- ✅ Admin-only Zugriff
- ✅ has_role() Helper-Funktion
- ✅ Public/Protected Endpoints

## 🚨 Troubleshooting

### "Supabase URL nicht gefunden"
→ Füge NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local hinzu

### "Firecrawl nicht verbunden"
→ API Key in Supabase Secrets hinzufügen

### "Admin-Zugriff verweigert"
→ user_id in user_roles Tabelle mit role='admin' hinzufügen

### Edge Functions funktionieren nicht
→ Überprüfe config.toml Settings für JWT-Verifikation

## 📞 Support

Bei Fragen oder Problemen:
1. Überprüfe die vollständige Dokumentation in diesem ZIP
2. Stelle sicher, dass alle Secrets konfiguriert sind
3. Überprüfe die Browser-Konsole für Fehler

## 📜 Lizenz

Dieses Tool wurde für iWantSexNow.ch entwickelt und kann frei verwendet und angepasst werden.

---

**Viel Erfolg! 🚀**