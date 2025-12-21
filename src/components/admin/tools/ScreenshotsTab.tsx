import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Camera, Download, AlertCircle } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DIMENSION_PRESETS = [
  { label: "Desktop HD", value: "1920x1080" },
  { label: "Desktop Full Page", value: "1920xfull" },
  { label: "MacBook", value: "1440x900" },
  { label: "iPad Pro", value: "1024x1366" },
  { label: "iPhone 14 Pro", value: "393x852" },
  { label: "iPhone SE", value: "375x667" },
  { label: "Android", value: "360x800" },
];

export function ScreenshotsTab() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Single Screenshot
  const [singleUrl, setSingleUrl] = useState("");
  const [dimension, setDimension] = useState("1920x1080");
  const [waitTime, setWaitTime] = useState(0);
  const [fullPage, setFullPage] = useState(false);
  const [screenshotResult, setScreenshotResult] = useState<string | null>(null);

  // Bulk Screenshots
  const [bulkUrls, setBulkUrls] = useState("");
  const [bulkDimension, setBulkDimension] = useState("1920x1080");

  const captureSingleScreenshot = async () => {
    if (!singleUrl) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setScreenshotResult(null);

    try {
      const [width, height] = dimension.split("x");
      const { data, error: funcError } = await supabase.functions.invoke("capture-screenshot", {
        body: {
          url: singleUrl,
          viewportWidth: parseInt(width),
          viewportHeight: height === "full" ? 5000 : parseInt(height),
          waitFor: waitTime,
          fullPage: fullPage || height === "full",
        },
      });

      if (funcError) throw funcError;

      setScreenshotResult(data.screenshotUrl);
      setSuccess("Screenshot captured successfully!");

      // Save to history
      await supabase.from("screenshot_history").insert({
        url: singleUrl,
        dimension,
        image_base64: data.screenshotUrl,
        is_full_page: fullPage,
      });
    } catch (err: any) {
      console.error("Screenshot error:", err);
      setError(err.message || "Failed to capture screenshot");
    } finally {
      setLoading(false);
    }
  };

  const captureBulkScreenshots = async () => {
    const urls = bulkUrls.split("\n").filter(u => u.trim());
    
    if (urls.length === 0) {
      setError("Please enter at least one URL");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const zip = new JSZip();
      const [width, height] = bulkDimension.split("x");

      for (let i = 0; i < urls.length; i++) {
        const url = urls[i].trim();
        try {
          const { data } = await supabase.functions.invoke("capture-screenshot", {
            body: {
              url,
              viewportWidth: parseInt(width),
              viewportHeight: height === "full" ? 5000 : parseInt(height),
              fullPage: height === "full",
            },
          });

          if (data?.screenshotUrl) {
            const imgBlob = await fetch(data.screenshotUrl).then(r => r.blob());
            const filename = `screenshot-${i + 1}-${url.replace(/[^a-z0-9]/gi, "-").substring(0, 50)}.png`;
            zip.file(filename, imgBlob);
          }
        } catch (err) {
          console.error(`Failed to capture ${url}:`, err);
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `bulk-screenshots-${Date.now()}.zip`);
      setSuccess(`Successfully captured ${urls.length} screenshots!`);
    } catch (err: any) {
      console.error("Bulk screenshot error:", err);
      setError(err.message || "Failed to capture bulk screenshots");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="bg-green-50 text-green-900 border-green-200 dark:bg-green-950 dark:text-green-100">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Single Screenshot */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Single Screenshot
          </CardTitle>
          <CardDescription>Capture a screenshot of a single URL</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>URL</Label>
            <Input
              value={singleUrl}
              onChange={(e) => setSingleUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Dimension</Label>
              <Select value={dimension} onValueChange={setDimension}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIMENSION_PRESETS.map((preset) => (
                    <SelectItem key={preset.value} value={preset.value}>
                      {preset.label} ({preset.value})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Wait Time (seconds)</Label>
              <Input
                type="number"
                min="0"
                max="30"
                value={waitTime}
                onChange={(e) => setWaitTime(parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label>Options</Label>
              <label className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <Checkbox checked={fullPage} onCheckedChange={(c) => setFullPage(!!c)} />
                <span className="text-sm">Full Page</span>
              </label>
            </div>
          </div>

          <Button
            onClick={captureSingleScreenshot}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Capturing...
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 mr-2" />
                Capture Screenshot
              </>
            )}
          </Button>

          {screenshotResult && (
            <div className="border rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium">Screenshot captured:</p>
              <img src={screenshotResult} alt="Screenshot" className="w-full rounded border" />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(screenshotResult, "_blank")}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Image
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Screenshots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Bulk Screenshots
          </CardTitle>
          <CardDescription>Capture screenshots of multiple URLs at once</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>URLs (one per line)</Label>
            <Textarea
              value={bulkUrls}
              onChange={(e) => setBulkUrls(e.target.value)}
              placeholder="https://example.com/page1&#10;https://example.com/page2&#10;https://example.com/page3"
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label>Dimension</Label>
            <Select value={bulkDimension} onValueChange={setBulkDimension}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIMENSION_PRESETS.map((preset) => (
                  <SelectItem key={preset.value} value={preset.value}>
                    {preset.label} ({preset.value})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={captureBulkScreenshots}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Capturing Bulk Screenshots...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download Bulk Screenshots (ZIP)
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}