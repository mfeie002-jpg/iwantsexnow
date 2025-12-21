import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Zap, AlertCircle, Copy, Download, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function AIAnalysisTab() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");
  const [pageCount, setPageCount] = useState("5");
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const analyzeWebsite = async () => {
    if (!url) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const { data, error: funcError } = await supabase.functions.invoke("ai-website-analyze", {
        body: {
          url,
          pageCount: parseInt(pageCount),
        },
      });

      if (funcError) throw funcError;

      if (data.error) {
        if (data.rateLimitReset) {
          setError(`Rate limit exceeded. Try again after: ${new Date(data.rateLimitReset).toLocaleString()}`);
        } else if (data.creditsExhausted) {
          setError("API credits exhausted. Please contact support or try again later.");
        } else {
          throw new Error(data.error);
        }
        return;
      }

      setResult(data.analysis || data.report || "Analysis completed but no report returned.");
    } catch (err: any) {
      console.error("AI Analysis error:", err);
      setError(err.message || "Failed to analyze website");
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      toast({
        title: "Copied to clipboard!",
        description: "Analysis report has been copied",
      });
    }
  };

  const downloadResult = () => {
    if (result) {
      const blob = new Blob([result], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `website-analysis-${Date.now()}.md`;
      a.click();
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <Info className="w-4 h-4 text-blue-600" />
        <AlertTitle>1-Click AI Analysis</AlertTitle>
        <AlertDescription>
          Automatically captures screenshots and HTML, then analyzes with AI. Select how many pages to analyze for deeper insights.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Quick AI Analysis
          </CardTitle>
          <CardDescription>Instant website analysis powered by AI</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Website URL</Label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-2">
            <Label>Page Count</Label>
            <Select value={pageCount} onValueChange={setPageCount}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 Pages (Quick Scan)</SelectItem>
                <SelectItem value="10">10 Pages (Standard Analysis)</SelectItem>
                <SelectItem value="25">25 Pages (Deep Audit)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={analyzeWebsite}
            disabled={loading}
            className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing Website...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Analyze Website Now
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Analysis Report</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyResult}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={downloadResult}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}