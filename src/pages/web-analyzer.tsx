import { useState } from "react";
import Head from "next/head";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Zap, 
  Camera, 
  Code, 
  Search, 
  FileText, 
  Sparkles,
  Plus,
  X,
  Loader2,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Copy,
  Package
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProjectConfig {
  name: string;
  url: string;
  description: string;
  goals: string;
  targetAudience: string;
}

interface PageToAnalyze {
  url: string;
  name: string;
}

const VIEWPORT_PRESETS = [
  { name: "Desktop HD", width: 1920, height: 1080 },
  { name: "Desktop Full Page", width: 1920, height: 0 },
  { name: "MacBook", width: 1440, height: 900 },
  { name: "iPhone 14 Pro", width: 393, height: 852 },
  { name: "iPhone SE", width: 375, height: 667 },
  { name: "Android", width: 360, height: 800 },
];

const PROMPT_TEMPLATES = [
  {
    id: "quick",
    name: "Quick Analysis",
    description: "Schnelle UX/Conversion-Checks (~2 Min)",
    icon: Zap,
  },
  {
    id: "deep",
    name: "Deep Audit",
    description: "Vollständige Analyse (~10 Min)",
    icon: Search,
  },
  {
    id: "code",
    name: "Code Review",
    description: "Technische Qualität (~5 Min)",
    icon: Code,
  },
  {
    id: "screenshot",
    name: "Screenshot Analysis",
    description: "Visuelles Review (~3 Min)",
    icon: Camera,
  },
  {
    id: "regression",
    name: "Regression Report",
    description: "Änderungs-Analyse (~3 Min)",
    icon: FileText,
  },
  {
    id: "seo",
    name: "SEO Deep Dive",
    description: "Suchmaschinen-Optimierung (~8 Min)",
    icon: Sparkles,
  },
  {
    id: "accessibility",
    name: "Accessibility Audit",
    description: "WCAG-Konformität (~5 Min)",
    icon: CheckCircle2,
  },
];

export default function WebAnalyzer() {
  const [projectConfig, setProjectConfig] = useState<ProjectConfig>({
    name: "",
    url: "",
    description: "",
    goals: "",
    targetAudience: "",
  });

  const [pages, setPages] = useState<PageToAnalyze[]>([]);
  const [newPageUrl, setNewPageUrl] = useState("");
  const [newPageName, setNewPageName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(VIEWPORT_PRESETS[0]);
  const [waitFor, setWaitFor] = useState(3);
  const [fullPage, setFullPage] = useState(false);

  const [bulkUrls, setBulkUrls] = useState("");
  const [discoveredUrls, setDiscoveredUrls] = useState<string[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);

  const [analysisResult, setAnalysisResult] = useState("");
  const [htmlData, setHtmlData] = useState<any>(null);
  const [renderedHtmlData, setRenderedHtmlData] = useState<any>(null);

  const addPage = () => {
    if (newPageUrl && newPageName) {
      setPages([...pages, { url: newPageUrl, name: newPageName }]);
      setNewPageUrl("");
      setNewPageName("");
    }
  };

  const removePage = (index: number) => {
    setPages(pages.filter((_, i) => i !== index));
  };

  const handleQuickAnalysis = async () => {
    if (!projectConfig.url) {
      setError("Bitte Website-URL eingeben");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // 1. Capture screenshot
      const screenshotRes = await fetch("/api/supabase-function", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          function: "capture-screenshot",
          payload: {
            url: projectConfig.url,
            viewportWidth: 1920,
            viewportHeight: 1080,
            waitFor: 3,
          },
        }),
      });

      if (!screenshotRes.ok) throw new Error("Screenshot fehlgeschlagen");
      const { screenshotUrl } = await screenshotRes.json();

      // 2. Fetch HTML
      const htmlRes = await fetch("/api/supabase-function", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          function: "fetch-html",
          payload: { url: projectConfig.url },
        }),
      });

      if (!htmlRes.ok) throw new Error("HTML-Abruf fehlgeschlagen");
      const { html } = await htmlRes.json();

      // 3. AI Analysis
      const analysisRes = await fetch("/api/supabase-function", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          function: "ai-website-analyze",
          payload: {
            url: projectConfig.url,
            screenshotUrl,
            html: html.substring(0, 5000),
            projectName: projectConfig.name,
            projectDescription: projectConfig.description,
          },
        }),
      });

      if (!analysisRes.ok) throw new Error("KI-Analyse fehlgeschlagen");
      const { analysis } = await analysisRes.json();

      setAnalysisResult(analysis);
      setSuccess("Analyse erfolgreich abgeschlossen!");
    } catch (err: any) {
      setError(err.message || "Ein Fehler ist aufgetreten");
    } finally {
      setLoading(false);
    }
  };

  const handleScreenshot = async () => {
    if (!screenshotUrl) {
      setError("Bitte URL eingeben");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/supabase-function", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          function: "capture-screenshot",
          payload: {
            url: screenshotUrl,
            viewportWidth: selectedPreset.width,
            viewportHeight: selectedPreset.height || 1080,
            waitFor,
            fullPage,
          },
        }),
      });

      if (!res.ok) throw new Error("Screenshot fehlgeschlagen");
      const { screenshotUrl: resultUrl } = await res.json();

      // Open in new tab
      window.open(resultUrl, "_blank");
      setSuccess("Screenshot erfolgreich erstellt!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkScreenshots = async () => {
    const urls = bulkUrls.split("\n").filter((u) => u.trim());
    if (urls.length === 0) {
      setError("Bitte URLs eingeben (eine pro Zeile)");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const screenshots = await Promise.all(
        urls.map(async (url) => {
          const res = await fetch("/api/supabase-function", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              function: "capture-screenshot",
              payload: {
                url: url.trim(),
                viewportWidth: selectedPreset.width,
                viewportHeight: selectedPreset.height || 1080,
                waitFor,
                fullPage,
              },
            }),
          });
          const data = await res.json();
          return { url, screenshotUrl: data.screenshotUrl };
        })
      );

      // Create download links
      screenshots.forEach(({ url, screenshotUrl }) => {
        const a = document.createElement("a");
        a.href = screenshotUrl;
        a.download = `screenshot-${new URL(url).hostname}.png`;
        a.click();
      });

      setSuccess(`${screenshots.length} Screenshots erfolgreich erstellt!`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUrlDiscovery = async () => {
    if (!projectConfig.url) {
      setError("Bitte Website-URL eingeben");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/supabase-function", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          function: "firecrawl-map",
          payload: { url: projectConfig.url, limit: 50 },
        }),
      });

      if (!res.ok) throw new Error("URL Discovery fehlgeschlagen");
      const { urls } = await res.json();

      setDiscoveredUrls(urls);
      setSuccess(`${urls.length} URLs gefunden!`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchHtml = async () => {
    if (!projectConfig.url) {
      setError("Bitte URL eingeben");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch raw HTML
      const rawRes = await fetch("/api/supabase-function", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          function: "fetch-html",
          payload: { url: projectConfig.url },
        }),
      });

      if (!rawRes.ok) throw new Error("Raw HTML fehlgeschlagen");
      const rawData = await rawRes.json();
      setHtmlData(rawData);

      // Fetch rendered HTML
      const renderedRes = await fetch("/api/supabase-function", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          function: "capture-rendered-html",
          payload: { url: projectConfig.url },
        }),
      });

      if (!renderedRes.ok) throw new Error("Rendered HTML fehlgeschlagen");
      const renderedData = await renderedRes.json();
      setRenderedHtmlData(renderedData);

      setSuccess("HTML erfolgreich abgerufen!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generatePrompt = (templateId: string) => {
    const prompts: Record<string, string> = {
      quick: `# Quick Website Analysis

Analysiere diese Website und gib mir die TOP 3 Conversion-Killer und Quick Wins.

**Website:** ${projectConfig.url}
**Projekt:** ${projectConfig.name || "Nicht angegeben"}
**Beschreibung:** ${projectConfig.description || "Nicht angegeben"}

**Format:**
1. TOP 3 Conversion-Killer (Was verhindert Conversions?)
2. Quick Wins (Einfache Verbesserungen mit hoher Wirkung)
3. Priorisierter Aktionsplan`,

      deep: `# Deep Website Audit

Führe eine vollständige Analyse dieser Website durch.

**Website:** ${projectConfig.url}
**Projekt:** ${projectConfig.name || "Nicht angegeben"}
**Ziele:** ${projectConfig.goals || "Nicht angegeben"}
**Zielgruppe:** ${projectConfig.targetAudience || "Nicht angegeben"}

**Analysiere:**
1. UX/UI Design & Navigation
2. Conversion-Optimierung
3. Content-Qualität
4. Mobile Experience
5. Performance
6. SEO Basics
7. Call-to-Actions
8. Trust-Elemente

**Format:** Strukturierter Markdown-Report mit konkreten Empfehlungen.`,

      code: `# Code Review & Technical Quality

Überprüfe die technische Qualität dieser Website.

**Website:** ${projectConfig.url}

**Fokus auf:**
1. HTML-Struktur & Semantik
2. CSS-Qualität & Organisation
3. JavaScript-Patterns
4. Performance-Optimierung
5. Accessibility (WCAG)
6. SEO-technische Aspekte
7. Security Best Practices

**Format:** Technischer Report mit Code-Beispielen und Fixes.`,

      screenshot: `# Screenshot Analysis

Analysiere diese Website basierend auf den Screenshots.

**Website:** ${projectConfig.url}
**Projekt:** ${projectConfig.name || "Nicht angegeben"}

**Analysiere visuell:**
1. First Impression (Was fällt sofort auf?)
2. Visuelle Hierarchie
3. Farbschema & Branding
4. Lesbarkeit & Typography
5. Mobile vs. Desktop Unterschiede
6. Call-to-Action Sichtbarkeit
7. Trust-Signale & Social Proof

**Format:** Visuelles Review mit konkreten Design-Empfehlungen.`,

      regression: `# Regression Report (Vorher/Nachher)

Vergleiche die alte und neue Version dieser Website.

**Website:** ${projectConfig.url}

**Vergleiche:**
1. Visuelle Änderungen
2. Content-Änderungen
3. Funktionale Änderungen
4. Performance-Unterschiede
5. SEO-Auswirkungen
6. UX-Verbesserungen/-Verschlechterungen

**Format:** Vorher/Nachher Analyse mit Impact-Assessment.`,

      seo: `# SEO Deep Dive

Führe eine umfassende SEO-Analyse durch.

**Website:** ${projectConfig.url}

**Analysiere:**
1. Title Tags & Meta Descriptions
2. Heading-Struktur (H1-H6)
3. Internal Linking
4. Image Alt-Tags
5. Structured Data (Schema.org)
6. URL-Struktur
7. Content-Qualität
8. Mobile-Friendliness
9. Page Speed
10. Indexability

**Format:** SEO-Report mit priorisierten Fixes und Quick Wins.`,

      accessibility: `# Accessibility Audit (WCAG 2.1)

Überprüfe die Barrierefreiheit dieser Website.

**Website:** ${projectConfig.url}

**WCAG-Prinzipien:**
1. Wahrnehmbar (Perceivable)
2. Bedienbar (Operable)
3. Verständlich (Understandable)
4. Robust (Robust)

**Fokus auf:**
- Farbkontraste
- Tastatur-Navigation
- Screen Reader Kompatibilität
- Alternative Texte
- Formular-Labels
- Focus-States
- ARIA-Attributes

**Format:** WCAG-Compliance-Report mit Severity-Levels (Critical/High/Medium/Low).`,
    };

    return prompts[templateId] || "";
  };

  const copyPrompt = (templateId: string) => {
    const prompt = generatePrompt(templateId);
    navigator.clipboard.writeText(prompt);
    setSuccess("Prompt in Zwischenablage kopiert!");
  };

  const downloadMegaExport = () => {
    setSuccess("MEGA_EXPORT.zip wird vorbereitet... (Dies ist eine Demo - Funktion muss noch implementiert werden)");
  };

  const generateManualPackage = () => {
    setSuccess("Feedback Package wird generiert... (Dies ist eine Demo - Funktion muss noch implementiert werden)");
  };

  return (
    <>
      <Head>
        <title>Web Analyzer Suite | iWantSexNow.ch</title>
        <meta name="description" content="Umfassende Website-Analyse-Tools für professionelle Audits" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-gray-900 dark:via-purple-950 dark:to-pink-950">
        <Navigation />
        <MobileNav />

        <main className="container mx-auto px-4 py-24">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
              Web Analyzer Suite
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              7 leistungsstarke Tools für umfassende Website-Analysen
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <Alert className="mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">{success}</AlertDescription>
            </Alert>
          )}

          {/* Project Configuration */}
          <Card className="p-8 mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Projekt Konfiguration
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="projectName">Projektname</Label>
                <Input
                  id="projectName"
                  value={projectConfig.name}
                  onChange={(e) => setProjectConfig({ ...projectConfig, name: e.target.value })}
                  placeholder="Mein Website-Projekt"
                />
              </div>
              <div>
                <Label htmlFor="projectUrl">Website-URL *</Label>
                <Input
                  id="projectUrl"
                  type="url"
                  value={projectConfig.url}
                  onChange={(e) => setProjectConfig({ ...projectConfig, url: e.target.value })}
                  placeholder="https://example.com"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  value={projectConfig.description}
                  onChange={(e) => setProjectConfig({ ...projectConfig, description: e.target.value })}
                  placeholder="Kurze Beschreibung des Projekts..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="goals">Ziele</Label>
                <Input
                  id="goals"
                  value={projectConfig.goals}
                  onChange={(e) => setProjectConfig({ ...projectConfig, goals: e.target.value })}
                  placeholder="Leads generieren, Verkäufe steigern..."
                />
              </div>
              <div>
                <Label htmlFor="targetAudience">Zielgruppe</Label>
                <Input
                  id="targetAudience"
                  value={projectConfig.targetAudience}
                  onChange={(e) => setProjectConfig({ ...projectConfig, targetAudience: e.target.value })}
                  placeholder="B2B, Millennials, Schweizer Kunden..."
                />
              </div>
            </div>
          </Card>

          {/* Main Tabs */}
          <Tabs defaultValue="quick-analysis" className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 h-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur p-2">
              <TabsTrigger value="quick-analysis" className="flex flex-col items-center gap-1 py-3">
                <Zap className="w-5 h-5" />
                <span className="text-xs">1-Klick</span>
              </TabsTrigger>
              <TabsTrigger value="screenshot" className="flex flex-col items-center gap-1 py-3">
                <Camera className="w-5 h-5" />
                <span className="text-xs">Screenshots</span>
              </TabsTrigger>
              <TabsTrigger value="seo-analyzer" className="flex flex-col items-center gap-1 py-3">
                <Code className="w-5 h-5" />
                <span className="text-xs">SEO HTML</span>
              </TabsTrigger>
              <TabsTrigger value="url-discovery" className="flex flex-col items-center gap-1 py-3">
                <Search className="w-5 h-5" />
                <span className="text-xs">URL Discovery</span>
              </TabsTrigger>
              <TabsTrigger value="prompts" className="flex flex-col items-center gap-1 py-3">
                <Sparkles className="w-5 h-5" />
                <span className="text-xs">Prompts</span>
              </TabsTrigger>
              <TabsTrigger value="manual-package" className="flex flex-col items-center gap-1 py-3">
                <Package className="w-5 h-5" />
                <span className="text-xs">Package</span>
              </TabsTrigger>
              <TabsTrigger value="mega-export" className="flex flex-col items-center gap-1 py-3">
                <Download className="w-5 h-5" />
                <span className="text-xs">Export</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab: 1-Click AI Analysis */}
            <TabsContent value="quick-analysis">
              <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Szenario 2: 1-Klick KI-Analyse</h2>
                    <p className="text-gray-600 dark:text-gray-400">Sofortige, automatische Website-Analyse mit Lovable AI</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Diese Funktion erstellt automatisch einen Screenshot, lädt den HTML-Code herunter und analysiert die Website mit KI.
                      Dauert ca. 1-2 Minuten.
                    </AlertDescription>
                  </Alert>

                  <Button
                    onClick={handleQuickAnalysis}
                    disabled={loading || !projectConfig.url}
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analysiere Website...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Website jetzt analysieren
                      </>
                    )}
                  </Button>

                  {analysisResult && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold">Analyse-Ergebnis</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(analysisResult);
                            setSuccess("In Zwischenablage kopiert!");
                          }}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Kopieren
                        </Button>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 max-h-[600px] overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm">{analysisResult}</pre>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* Tab: Screenshot Machine */}
            <TabsContent value="screenshot">
              <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Szenario 4: Screenshot Machine</h2>
                    <p className="text-gray-600 dark:text-gray-400">Erstelle Screenshots von einer oder mehreren URLs</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold mb-4">Einzel-Screenshot</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="screenshotUrl">URL</Label>
                        <Input
                          id="screenshotUrl"
                          type="url"
                          value={screenshotUrl}
                          onChange={(e) => setScreenshotUrl(e.target.value)}
                          placeholder="https://example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="preset">Viewport Preset</Label>
                        <Select
                          value={selectedPreset.name}
                          onValueChange={(value) => {
                            const preset = VIEWPORT_PRESETS.find((p) => p.name === value);
                            if (preset) setSelectedPreset(preset);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {VIEWPORT_PRESETS.map((preset) => (
                              <SelectItem key={preset.name} value={preset.name}>
                                {preset.name} ({preset.width}x{preset.height || "full"})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="waitFor">Verzögerung (Sekunden)</Label>
                        <Input
                          id="waitFor"
                          type="number"
                          min="0"
                          max="30"
                          value={waitFor}
                          onChange={(e) => setWaitFor(Number(e.target.value))}
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-6">
                        <input
                          type="checkbox"
                          id="fullPage"
                          checked={fullPage}
                          onChange={(e) => setFullPage(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <Label htmlFor="fullPage">Volle Seite (Full Page)</Label>
                      </div>
                    </div>
                    <Button
                      onClick={handleScreenshot}
                      disabled={loading || !screenshotUrl}
                      className="mt-4 w-full"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Screenshot wird erstellt...
                        </>
                      ) : (
                        <>
                          <Camera className="w-5 h-5 mr-2" />
                          Screenshot erfassen
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-bold mb-4">Bulk-Screenshots</h3>
                    <div>
                      <Label htmlFor="bulkUrls">URLs (eine pro Zeile)</Label>
                      <Textarea
                        id="bulkUrls"
                        value={bulkUrls}
                        onChange={(e) => setBulkUrls(e.target.value)}
                        placeholder="https://example.com&#10;https://example.com/about&#10;https://example.com/contact"
                        rows={6}
                      />
                    </div>
                    <Button
                      onClick={handleBulkScreenshots}
                      disabled={loading || !bulkUrls.trim()}
                      className="mt-4 w-full"
                      variant="secondary"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Screenshots werden erstellt...
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5 mr-2" />
                          Bulk Screenshots herunterladen
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Tab: SEO HTML Analyzer */}
            <TabsContent value="seo-analyzer">
              <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Szenario 5: SEO HTML Analyzer</h2>
                    <p className="text-gray-600 dark:text-gray-400">Vergleiche Raw HTML mit Rendered HTML</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <Button
                    onClick={handleFetchHtml}
                    disabled={loading || !projectConfig.url}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        HTML wird abgerufen...
                      </>
                    ) : (
                      <>
                        <Code className="w-5 h-5 mr-2" />
                        HTML abrufen
                      </>
                    )}
                  </Button>

                  {htmlData && renderedHtmlData && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                          Raw HTML
                          <Badge variant="outline">Server-Side</Badge>
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Meta Tags ({Object.keys(htmlData.metaTags || {}).length})</h4>
                            <div className="bg-gray-50 dark:bg-gray-900 rounded p-4 max-h-48 overflow-y-auto text-sm">
                              <pre>{JSON.stringify(htmlData.metaTags, null, 2)}</pre>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Headings ({htmlData.headings?.length || 0})</h4>
                            <div className="bg-gray-50 dark:bg-gray-900 rounded p-4 max-h-48 overflow-y-auto text-sm space-y-1">
                              {htmlData.headings?.map((h: any, i: number) => (
                                <div key={i}>
                                  <Badge variant="outline" className="mr-2">{h.level}</Badge>
                                  {h.text}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                          Rendered HTML
                          <Badge variant="outline">Client-Side</Badge>
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Meta Tags ({Object.keys(renderedHtmlData.metaTags || {}).length})</h4>
                            <div className="bg-gray-50 dark:bg-gray-900 rounded p-4 max-h-48 overflow-y-auto text-sm">
                              <pre>{JSON.stringify(renderedHtmlData.metaTags, null, 2)}</pre>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Headings ({renderedHtmlData.headings?.length || 0})</h4>
                            <div className="bg-gray-50 dark:bg-gray-900 rounded p-4 max-h-48 overflow-y-auto text-sm space-y-1">
                              {renderedHtmlData.headings?.map((h: any, i: number) => (
                                <div key={i}>
                                  <Badge variant="outline" className="mr-2">{h.level}</Badge>
                                  {h.text}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* Tab: URL Discovery */}
            <TabsContent value="url-discovery">
              <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Szenario 7: URL Discovery</h2>
                    <p className="text-gray-600 dark:text-gray-400">Finde automatisch alle Unterseiten einer Website</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <Button
                    onClick={handleUrlDiscovery}
                    disabled={loading || !projectConfig.url}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        URLs werden entdeckt...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        URLs entdecken
                      </>
                    )}
                  </Button>

                  {discoveredUrls.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold mb-3">
                        Gefundene URLs ({discoveredUrls.length})
                      </h3>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto space-y-2">
                        {discoveredUrls.map((url, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={selectedUrls.includes(url)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedUrls([...selectedUrls, url]);
                                } else {
                                  setSelectedUrls(selectedUrls.filter((u) => u !== url));
                                }
                              }}
                              className="w-4 h-4"
                            />
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center gap-1"
                            >
                              {url}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={() => {
                          selectedUrls.forEach((url) => {
                            const name = new URL(url).pathname.replace(/\//g, "-") || "homepage";
                            setPages([...pages, { url, name }]);
                          });
                          setSelectedUrls([]);
                          setSuccess(`${selectedUrls.length} Seiten hinzugefügt!`);
                        }}
                        disabled={selectedUrls.length === 0}
                        className="mt-4 w-full"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Ausgewählte Seiten hinzufügen ({selectedUrls.length})
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* Tab: AI Prompt Generator */}
            <TabsContent value="prompts">
              <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Szenario 6: KI-Prompt Generator</h2>
                    <p className="text-gray-600 dark:text-gray-400">7 optimierte Prompts für verschiedene Analyse-Typen</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PROMPT_TEMPLATES.map((template) => (
                    <Card key={template.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
                          <template.icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold mb-1">{template.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => copyPrompt(template.id)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Prompt kopieren
                      </Button>
                    </Card>
                  ))}
                </div>

                <Alert className="mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Tipp: Fülle zuerst die Projekt-Konfiguration aus, damit die Prompts personalisiert werden.
                    Lade dann Screenshots und HTML in ChatGPT/Claude hoch für beste Ergebnisse.
                  </AlertDescription>
                </Alert>
              </Card>
            </TabsContent>

            {/* Tab: Manual Package */}
            <TabsContent value="manual-package">
              <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Szenario 3: Manuelles Package</h2>
                    <p className="text-gray-600 dark:text-gray-400">Komplettes Analyse-Paket für externe KI-Tools</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold mb-4">Seiten zum Analysieren</h3>
                    <div className="space-y-3 mb-4">
                      {pages.map((page, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Badge variant="secondary" className="flex-1">
                            {page.name}: {page.url}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removePage(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="newPageUrl">URL</Label>
                        <Input
                          id="newPageUrl"
                          type="url"
                          value={newPageUrl}
                          onChange={(e) => setNewPageUrl(e.target.value)}
                          placeholder="https://example.com/about"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") addPage();
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="newPageName">Name</Label>
                        <Input
                          id="newPageName"
                          value={newPageName}
                          onChange={(e) => setNewPageName(e.target.value)}
                          placeholder="About Page"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") addPage();
                          }}
                        />
                      </div>
                    </div>
                    <Button onClick={addPage} className="mt-4 w-full" variant="outline">
                      <Plus className="w-5 h-5 mr-2" />
                      Seite hinzufügen
                    </Button>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Das Package enthält: Screenshots (Desktop + Mobile), Raw HTML, Rendered HTML, 
                      alle 7 Analyse-Prompts, und ein Project Brief PDF.
                    </AlertDescription>
                  </Alert>

                  <Button
                    onClick={generateManualPackage}
                    disabled={loading || pages.length === 0}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Package wird generiert...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5 mr-2" />
                        feedback-package.zip herunterladen
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Tab: Mega Export */}
            <TabsContent value="mega-export">
              <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Szenario 1: Mega Export</h2>
                    <p className="text-gray-600 dark:text-gray-400">Repliziere das komplette Tool auf ein neues Lovable-Projekt</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Dieser Export enthält: 5 Edge Functions, SQL-Migration, RLS Policies, config.toml, und README mit Lovable-Prompt.
                    </AlertDescription>
                  </Alert>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 space-y-3">
                    <h3 className="font-bold mb-3">Anleitung:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>Klicke "MEGA_EXPORT.zip herunterladen"</li>
                      <li>Öffne lovable.dev → Neues Projekt</li>
                      <li>Kopiere Inhalt von README.md in den Chat</li>
                      <li>Warte bis generiert</li>
                      <li>Registriere dich in der App</li>
                      <li>Gehe ins Backend → user_roles Tabelle</li>
                      <li>Füge deine user_id mit role='admin' hinzu</li>
                      <li>(Optional) Verbinde Firecrawl für Screenshots</li>
                    </ol>
                  </div>

                  <Button
                    onClick={downloadMegaExport}
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                    size="lg"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    MEGA_EXPORT.zip herunterladen
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800 mt-24 py-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              © 2025 iWantSexNow.ch - Web Analyzer Suite
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}