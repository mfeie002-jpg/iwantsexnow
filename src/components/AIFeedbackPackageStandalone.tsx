import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Download, Package, Wand2, FileText, Smartphone, Monitor } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function AIFeedbackPackageStandalone() {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Project Info
  const [projectInfo, setProjectInfo] = useState({
    name: "",
    url: "",
    description: "",
    goals: "",
    targetAudience: "",
    competitors: "",
  });

  // Pages to analyze
  const [pages, setPages] = useState<{ url: string; name: string }[]>([
    { url: "", name: "Home" },
  ]);

  // Options
  const [options, setOptions] = useState({
    desktopScreenshots: true,
    mobileScreenshots: true,
    rawHtml: true,
    renderedHtml: true,
    prompts: true,
    pdfBrief: true,
  });

  const handleAutoFill = async () => {
    if (!projectInfo.url) {
      setError("Please enter a URL first");
      return;
    }

    setAiLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.functions.invoke("ai-extract-project-info", {
        body: { url: projectInfo.url },
      });

      if (error) throw error;

      setProjectInfo({
        ...projectInfo,
        name: data.projectName || "",
        description: data.description || "",
        goals: data.goals || "",
        targetAudience: data.targetAudience || "",
        competitors: Array.isArray(data.competitors) ? data.competitors.join(", ") : (data.competitors || ""),
      });

      setSuccess("Project info extracted successfully!");
    } catch (err: any) {
      console.error("Auto-fill error:", err);
      setError("Failed to extract project info. Please fill manually.");
    } finally {
      setAiLoading(false);
    }
  };

  const generatePackage = async () => {
    if (!projectInfo.url || !projectInfo.name) {
      setError("Please fill in project details");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const zip = new JSZip();
      
      // 1. Generate PDF Brief
      if (options.pdfBrief) {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text(`Project Brief: ${projectInfo.name}`, 20, 20);
        
        doc.setFontSize(12);
        doc.text(`URL: ${projectInfo.url}`, 20, 30);
        
        doc.setFontSize(16);
        doc.text("Description", 20, 45);
        doc.setFontSize(12);
        const descLines = doc.splitTextToSize(projectInfo.description, 170);
        doc.text(descLines, 20, 55);
        
        doc.setFontSize(16);
        doc.text("Goals", 20, 80);
        doc.setFontSize(12);
        const goalLines = doc.splitTextToSize(projectInfo.goals, 170);
        doc.text(goalLines, 20, 90);
        
        doc.setFontSize(16);
        doc.text("Target Audience", 20, 115);
        doc.setFontSize(12);
        const audienceLines = doc.splitTextToSize(projectInfo.targetAudience, 170);
        doc.text(audienceLines, 20, 125);

        zip.file("PROJECT_BRIEF.pdf", doc.output("blob"));
      }

      // 2. Add Prompts
      if (options.prompts) {
        const promptsFolder = zip.folder("prompts");
        // Add basic prompts
        promptsFolder?.file("01_QUICK_ANALYSIS.md", `# Quick Analysis for ${projectInfo.name}\n\nAnalyze ${projectInfo.url} for conversion killers...`);
        promptsFolder?.file("02_DEEP_AUDIT.md", `# Deep Audit for ${projectInfo.name}\n\nGoals: ${projectInfo.goals}\nAudience: ${projectInfo.targetAudience}...`);
      }

      // 3. Process Pages (Screenshots & HTML)
      const allPages = [{ url: projectInfo.url, name: "Home" }, ...pages.filter(p => p.url)];
      
      for (const page of allPages) {
        // Screenshots
        if (options.desktopScreenshots) {
          try {
            const { data } = await supabase.functions.invoke("capture-screenshot", {
              body: { url: page.url, viewportWidth: 1920, viewportHeight: 1080 }
            });
            if (data?.screenshotUrl) {
              const imgBlob = await fetch(data.screenshotUrl).then(r => r.blob());
              zip.folder("screenshots/desktop")?.file(`${page.name.replace(/\s+/g, '-')}.png`, imgBlob);
            }
          } catch (e) { console.error(`Screenshot failed for ${page.name}`, e); }
        }

        // HTML
        if (options.rawHtml) {
          try {
            const { data } = await supabase.functions.invoke("fetch-html", { body: { url: page.url } });
            if (data?.html) {
              zip.folder("html/raw")?.file(`${page.name.replace(/\s+/g, '-')}.html`, data.html);
            }
          } catch (e) { console.error(`HTML fetch failed for ${page.name}`, e); }
        }
      }

      // Generate Zip
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${projectInfo.name.replace(/\s+/g, '-')}_feedback_package.zip`);
      setSuccess("Package generated successfully!");

    } catch (err: any) {
      console.error("Package generation error:", err);
      setError(err.message || "Failed to generate package");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-6 h-6 text-purple-600" />
          AI Feedback Package Generator
        </CardTitle>
        <CardDescription>
          Generate a complete context package for ChatGPT/Claude analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Project Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Project Name</Label>
              <Input 
                value={projectInfo.name} 
                onChange={(e) => setProjectInfo({ ...projectInfo, name: e.target.value })} 
                placeholder="e.g. My Awesome Startup"
              />
            </div>
            <div className="space-y-2">
              <Label>Website URL</Label>
              <div className="flex gap-2">
                <Input 
                  value={projectInfo.url} 
                  onChange={(e) => setProjectInfo({ ...projectInfo, url: e.target.value })} 
                  placeholder="https://example.com"
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleAutoFill}
                  disabled={aiLoading}
                  title="Auto-fill with AI"
                >
                  {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              value={projectInfo.description} 
              onChange={(e) => setProjectInfo({ ...projectInfo, description: e.target.value })} 
              placeholder="What does the project do?"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Goals</Label>
              <Input 
                value={projectInfo.goals} 
                onChange={(e) => setProjectInfo({ ...projectInfo, goals: e.target.value })} 
                placeholder="Key objectives..."
              />
            </div>
            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Input 
                value={projectInfo.targetAudience} 
                onChange={(e) => setProjectInfo({ ...projectInfo, targetAudience: e.target.value })} 
                placeholder="Who is this for?"
              />
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Package Contents</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <label className="flex items-center space-x-2 border p-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
              <Checkbox 
                checked={options.desktopScreenshots} 
                onCheckedChange={(c) => setOptions({...options, desktopScreenshots: !!c})} 
              />
              <Monitor className="w-4 h-4 text-gray-500" />
              <span>Desktop Screenshots</span>
            </label>
            <label className="flex items-center space-x-2 border p-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
              <Checkbox 
                checked={options.mobileScreenshots} 
                onCheckedChange={(c) => setOptions({...options, mobileScreenshots: !!c})} 
              />
              <Smartphone className="w-4 h-4 text-gray-500" />
              <span>Mobile Screenshots</span>
            </label>
            <label className="flex items-center space-x-2 border p-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
              <Checkbox 
                checked={options.pdfBrief} 
                onCheckedChange={(c) => setOptions({...options, pdfBrief: !!c})} 
              />
              <FileText className="w-4 h-4 text-gray-500" />
              <span>PDF Brief</span>
            </label>
            {/* Add more options as needed */}
          </div>
        </div>

        {/* Actions */}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="bg-green-50 text-green-900 border-green-200">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Button 
          className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" 
          onClick={generatePackage}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating Package...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Download AI Feedback Package
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}