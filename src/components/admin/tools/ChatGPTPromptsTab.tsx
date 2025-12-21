import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Search, Code, Camera, FileText, Sparkles, CheckCircle2, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PROMPTS = [
  {
    id: "quick",
    icon: Zap,
    name: "Quick Analysis",
    description: "Fast UX/Conversion checks (~2 min)",
    duration: "~2 min",
    prompt: `# Quick Website Analysis

Analysiere diese Website und gib mir die TOP 3 Conversion-Killer und Quick Wins.

**Format:**
1. TOP 3 Conversion-Killer (Was verhindert Conversions?)
2. Quick Wins (Einfache Verbesserungen mit hoher Wirkung)
3. Priorisierter Aktionsplan

---
[Screenshot und HTML hier einfügen]`,
  },
  {
    id: "deep",
    icon: Search,
    name: "Deep Audit",
    description: "Comprehensive analysis (~10 min)",
    duration: "~10 min",
    prompt: `# Deep Website Audit

Führe eine vollständige Analyse dieser Website durch.

**Analysiere:**
1. UX/UI Design & Navigation
2. Conversion-Optimierung
3. Content-Qualität
4. Mobile Experience
5. Performance
6. SEO Basics
7. Call-to-Actions
8. Trust-Elemente

**Format:** Strukturierter Markdown-Report mit konkreten Empfehlungen.

---
[Screenshot und HTML hier einfügen]`,
  },
  {
    id: "code",
    icon: Code,
    name: "Code Review",
    description: "Technical quality check (~5 min)",
    duration: "~5 min",
    prompt: `# Code Review & Technical Quality

Überprüfe die technische Qualität dieser Website.

**Fokus auf:**
1. HTML-Struktur & Semantik
2. CSS-Qualität & Organisation
3. JavaScript-Patterns
4. Performance-Optimierung
5. Accessibility (WCAG)
6. SEO-technische Aspekte
7. Security Best Practices

**Format:** Technischer Report mit Code-Beispielen und Fixes.

---
[HTML-Code hier einfügen]`,
  },
  {
    id: "screenshot",
    icon: Camera,
    name: "Screenshot Analysis",
    description: "Visual review (~3 min)",
    duration: "~3 min",
    prompt: `# Screenshot Analysis

Analysiere diese Website basierend auf den Screenshots.

**Analysiere visuell:**
1. First Impression (Was fällt sofort auf?)
2. Visuelle Hierarchie
3. Farbschema & Branding
4. Lesbarkeit & Typography
5. Mobile vs. Desktop Unterschiede
6. Call-to-Action Sichtbarkeit
7. Trust-Signale & Social Proof

**Format:** Visuelles Review mit konkreten Design-Empfehlungen.

---
[Screenshots hier einfügen - Desktop + Mobile]`,
  },
  {
    id: "regression",
    icon: FileText,
    name: "Regression Report",
    description: "Before/After comparison (~3 min)",
    duration: "~3 min",
    prompt: `# Regression Report (Vorher/Nachher)

Vergleiche die alte und neue Version dieser Website.

**Vergleiche:**
1. Visuelle Änderungen
2. Content-Änderungen
3. Funktionale Änderungen
4. Performance-Unterschiede
5. SEO-Auswirkungen
6. UX-Verbesserungen/-Verschlechterungen

**Format:** Vorher/Nachher Analyse mit Impact-Assessment.

---
[Alt-Screenshot | Neu-Screenshot]`,
  },
  {
    id: "seo",
    icon: Sparkles,
    name: "SEO Deep Dive",
    description: "Search engine optimization (~8 min)",
    duration: "~8 min",
    prompt: `# SEO Deep Dive

Führe eine umfassende SEO-Analyse durch.

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

**Format:** SEO-Report mit priorisierten Fixes und Quick Wins.

---
[Raw HTML + Rendered HTML hier einfügen]`,
  },
  {
    id: "accessibility",
    icon: CheckCircle2,
    name: "Accessibility Audit",
    description: "WCAG compliance check (~5 min)",
    duration: "~5 min",
    prompt: `# Accessibility Audit (WCAG 2.1)

Überprüfe die Barrierefreiheit dieser Website.

**WCAG-Prinzipien:**
1. Wahrnehmbar (Perceivable)
2. Bedienbar (Operable)
3. Verständlich (Understandable)
4. Robust (Robust)

**Fokus auf:**
- Farbkontraste (min. 4.5:1)
- Tastatur-Navigation
- Screen Reader Kompatibilität
- Alternative Texte
- Formular-Labels
- Focus-States
- ARIA-Attributes
- Heading-Hierarchie
- Link-Texte
- Video/Audio Untertitel

**Format:** WCAG-Compliance-Report mit Severity-Levels:
- 🔴 Critical (Blocker)
- 🟠 High (Muss behoben werden)
- 🟡 Medium (Sollte behoben werden)
- 🟢 Low (Nice-to-have)

---
[Screenshot + HTML hier einfügen]`,
  },
];

export function ChatGPTPromptsTab() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const copyPrompt = (id: string, prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    toast({
      title: "Prompt copied!",
      description: "Paste it into ChatGPT or Claude",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">AI Analysis Prompts</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Copy-paste ready prompts for ChatGPT, Claude, or Gemini
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROMPTS.map((item) => {
          const Icon = item.icon;
          const isCopied = copiedId === item.id;

          return (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{item.duration}</span>
                </div>
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => copyPrompt(item.id, item.prompt)}
                  variant="outline"
                  className="w-full"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Prompt
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-lg">💡 Usage Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <p>1. Copy the prompt that matches your analysis goal</p>
          <p>2. Upload screenshots + HTML to ChatGPT/Claude</p>
          <p>3. Get a structured, actionable report</p>
          <p>4. Use GPT-4 or Claude 3 for best results</p>
        </CardContent>
      </Card>
    </div>
  );
}