# Lovable Prompt für Web Analyzer Suite

Kopiere diesen Text in ein neues Lovable-Projekt, um die komplette Web Analyzer Suite zu generieren.

---

Erstelle eine umfassende **Web Analyzer Suite** mit 7 leistungsstarken Website-Analyse-Tools.

## Projekt-Anforderungen

### Tech Stack
- Next.js (Page Router)
- TypeScript
- Tailwind CSS
- Shadcn/UI Komponenten
- Supabase (Backend + Edge Functions)
- Lucide Icons

### UI/UX Design
- Moderne, professionelle Admin-Oberfläche
- Gradient-Design (Purple → Pink → Red)
- Responsive für Desktop & Mobile
- Tab-basierte Navigation für die 7 Tools
- Dark Mode Support
- Loading States & Error Handling
- Success/Error Alerts mit Icons

### Seiten-Struktur

#### /web-analyzer (Haupt-Admin-Dashboard)

**Header:**
- Großer Titel: "Web Analyzer Suite"
- Untertitel: "7 leistungsstarke Tools für umfassende Website-Analysen"
- Alert-Bereiche für Errors & Success Messages

**Projekt Konfiguration Card:**
- Projektname (Input)
- Website-URL (Input, required)
- Beschreibung (Textarea)
- Ziele (Input)
- Zielgruppe (Input)

**Tab Navigation (7 Tabs):**
1. 1-Klick (Zap Icon) - Quick Analysis
2. Screenshots (Camera Icon) - Screenshot Machine
3. SEO HTML (Code Icon) - HTML Analyzer
4. URL Discovery (Search Icon) - URL Finder
5. Prompts (Sparkles Icon) - AI Prompt Generator
6. Package (Package Icon) - Manual Package
7. Export (Download Icon) - Mega Export

### Tool 1: 1-Klick KI-Analyse
**UI:**
- Info Alert über automatische Analyse
- Großer Primary Button: "Website jetzt analysieren"
- Loading State mit Animation
- Ergebnis-Bereich mit Markdown-Rendering
- Copy Button für Ergebnis

**Funktion:**
1. Screenshot erfassen (1920x1080)
2. HTML abrufen
3. An Lovable AI senden
4. Strukturierte Analyse zurückgeben

**Edge Function:** `ai-website-analyze`

### Tool 2: Screenshot Machine
**UI:**
- 2 Bereiche: Einzel-Screenshot & Bulk-Screenshots

**Einzel-Screenshot:**
- URL Input
- Viewport Preset Dropdown:
  * Desktop HD (1920x1080)
  * Desktop Full Page (1920xfull)
  * MacBook (1440x900)
  * iPhone 14 Pro (393x852)
  * iPhone SE (375x667)
  * Android (360x800)
- Verzögerung Input (0-30 Sek)
- Volle Seite Checkbox
- Button: "Screenshot erfassen"

**Bulk-Screenshots:**
- Textarea (URLs, eine pro Zeile)
- Button: "Bulk Screenshots herunterladen"

**Edge Function:** `capture-screenshot`

### Tool 3: SEO HTML Analyzer
**UI:**
- Button: "HTML abrufen"
- 2-spaltige Vergleichsansicht:
  * Links: Raw HTML (Server-Side Badge)
  * Rechts: Rendered HTML (Client-Side Badge)
- Für jede Seite:
  * Meta Tags (JSON)
  * Headings (H1-H6) mit Badges
  * Links Count
  * Images Count

**Edge Functions:** 
- `fetch-html` (Raw HTML)
- `capture-rendered-html` (Rendered HTML)

### Tool 4: URL Discovery
**UI:**
- Button: "URLs entdecken"
- Liste aller gefundenen URLs
- Checkboxen zum Auswählen
- External Link Icons
- Button: "Ausgewählte Seiten hinzufügen (X)"

**Edge Function:** `firecrawl-map`

### Tool 5: KI-Prompt Generator
**UI:**
- Grid mit 7 Cards (2-3 Spalten responsive)
- Jede Card zeigt:
  * Icon (unterschiedlich für jeden Typ)
  * Name
  * Beschreibung
  * "Prompt kopieren" Button

**7 Prompt-Typen:**
1. Quick Analysis (Zap) - ~2 Min
2. Deep Audit (Search) - ~10 Min
3. Code Review (Code) - ~5 Min
4. Screenshot Analysis (Camera) - ~3 Min
5. Regression Report (FileText) - ~3 Min
6. SEO Deep Dive (Sparkles) - ~8 Min
7. Accessibility Audit (CheckCircle2) - ~5 Min

**Funktion:**
- Prompts werden mit Projektdaten befüllt
- Copy-to-Clipboard Funktionalität

### Tool 6: Manuelles Package
**UI:**
- Seiten-Liste mit Badges
- Add/Remove Seiten Interface:
  * URL Input
  * Name Input
  * "Seite hinzufügen" Button
- Info Alert über Package-Inhalt
- Button: "feedback-package.zip herunterladen"

**Package Inhalt:**
- Screenshots (Desktop + Mobile)
- Raw HTML
- Rendered HTML
- Alle 7 Prompts
- Project Brief PDF

### Tool 7: Mega Export
**UI:**
- Info Alert über Export-Inhalt
- Anleitung (8 Schritte) in styled List
- Button: "MEGA_EXPORT.zip herunterladen"

**Export Inhalt:**
- 5 Edge Functions (Code)
- SQL Migration
- RLS Policies
- config.toml
- README.md mit Prompt

### Backend (Supabase)

#### Datenbank-Schema:

**user_roles:**
- id (uuid, PK)
- user_id (uuid, FK → auth.users)
- role (text: 'admin' | 'user')
- created_at (timestamptz)

**screenshot_history:**
- id (uuid, PK)
- user_id (uuid, FK)
- url (text)
- viewport_width (int)
- viewport_height (int)
- screenshot_url (text)
- created_at (timestamptz)

**screenshot_baselines:**
- id (uuid, PK)
- user_id (uuid, FK)
- url (text)
- viewport_width (int)
- viewport_height (int)
- screenshot_url (text)
- is_baseline (boolean)
- created_at (timestamptz)

**analysis_reports:**
- id (uuid, PK)
- user_id (uuid, FK)
- project_name (text)
- website_url (text)
- analysis_type (text enum)
- report_data (jsonb)
- created_at (timestamptz)

**html_cache:**
- id (uuid, PK)
- url (text, unique)
- raw_html (text)
- rendered_html (text)
- meta_tags (jsonb)
- headings (jsonb)
- links (jsonb)
- images (jsonb)
- structured_data (jsonb)
- cached_at (timestamptz)

**url_discovery_cache:**
- id (uuid, PK)
- base_url (text, unique)
- discovered_urls (jsonb)
- total_count (int)
- discovered_at (timestamptz)

#### RLS Policies:
- user_roles: Admin-only
- screenshot_history: Users see own, admins see all
- screenshot_baselines: Admin-only
- analysis_reports: Users see own, admins see all
- html_cache: Public read, admin write
- url_discovery_cache: Public read, admin write

#### Helper Function:
```sql
CREATE FUNCTION has_role(user_id uuid, required_role text)
RETURNS boolean;
```

#### Edge Functions:

**fetch-html:**
- Fetch raw HTML
- Extract meta tags, headings, links, images
- Extract structured data (JSON-LD)
- Public endpoint (no auth)

**capture-screenshot:**
- Use Firecrawl screenshot API
- Configurable viewport & wait time
- Full page optional
- Protected endpoint (auth required)

**capture-rendered-html:**
- Use Firecrawl scrape API
- Wait for JS rendering (3 sec)
- Extract meta tags & headings
- Public endpoint

**ai-website-analyze:**
- Accept screenshot URL + HTML
- Send to Lovable AI API
- Return structured Markdown analysis
- Protected endpoint

**firecrawl-map:**
- Use Firecrawl map API
- Discover all URLs (limit 50)
- Return URL list
- Public endpoint

### API Routes

**/api/supabase-function:**
- POST endpoint
- Proxy to Supabase Edge Functions
- Handle authentication
- Error handling

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
FIRECRAWL_API_KEY= (in Supabase Secrets)
LOVABLE_API_KEY= (in Supabase Secrets)
```

### Styling Guidelines
- Gradient backgrounds (purple-pink-red)
- White/Dark cards with backdrop-blur
- Icon-basierte Navigation
- Loading spinners überall
- Success = Green, Error = Red
- Badges für Status/Labels
- Smooth transitions

### UX Guidelines
- Klare Fortschritts-Indikatoren
- Copy-to-Clipboard mit Success-Feedback
- Responsive Grid Layouts
- Tab-State bleibt erhalten
- Fehler werden prominent angezeigt
- Download-Links öffnen in neuem Tab

### Code-Qualität
- TypeScript Strict Mode
- Proper error handling
- Loading states everywhere
- Input validation
- Accessible forms (labels!)
- Clean component structure

---

Baue das komplette System mit allen 7 Tools, Backend-Schema, Edge Functions und einer polished Admin-UI.