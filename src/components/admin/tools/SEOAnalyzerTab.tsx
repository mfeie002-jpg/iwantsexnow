import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Code, AlertCircle, ExternalLink } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function SEOAnalyzerTab() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");
  
  const [rawHtml, setRawHtml] = useState<any>(null);
  const [renderedHtml, setRenderedHtml] = useState<any>(null);

  const analyzeURL = async () => {
    if (!url) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);
    setError("");
    setRawHtml(null);
    setRenderedHtml(null);

    try {
      // Fetch Raw HTML
      const { data: rawData, error: rawError } = await supabase.functions.invoke("fetch-html", {
        body: { url },
      });

      if (rawError) throw rawError;
      setRawHtml(rawData);

      // Fetch Rendered HTML
      const { data: renderedData, error: renderedError } = await supabase.functions.invoke("capture-rendered-html", {
        body: { url },
      });

      if (renderedError) throw renderedError;
      setRenderedHtml(renderedData);

    } catch (err: any) {
      console.error("SEO Analysis error:", err);
      setError(err.message || "Failed to analyze URL");
    } finally {
      setLoading(false);
    }
  };

  const MetaTagsSection = ({ title, metaTags }: { title: string; metaTags: Record<string, string> }) => (
    <div className="space-y-2">
      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">{title}</h4>
      <div className="space-y-1">
        {Object.entries(metaTags).map(([key, value]) => (
          <div key={key} className="flex items-start gap-2 text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded">
            <Badge variant="outline" className="shrink-0">{key}</Badge>
            <span className="text-gray-600 dark:text-gray-400 break-all">{value}</span>
          </div>
        ))}
        {Object.keys(metaTags).length === 0 && (
          <p className="text-xs text-gray-500">No meta tags found</p>
        )}
      </div>
    </div>
  );

  const HeadingsSection = ({ title, headings }: { title: string; headings: { level: string; text: string }[] }) => (
    <div className="space-y-2">
      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">{title}</h4>
      <div className="space-y-1">
        {headings.map((heading, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs">
            <Badge variant={heading.level === "H1" ? "default" : "outline"} className="shrink-0">
              {heading.level}
            </Badge>
            <span className="text-gray-600 dark:text-gray-400">{heading.text}</span>
          </div>
        ))}
        {headings.length === 0 && (
          <p className="text-xs text-gray-500">No headings found</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            SEO HTML Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>URL</Label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <Button
            onClick={analyzeURL}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Code className="w-4 h-4 mr-2" />
                Analyze HTML
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {(rawHtml || renderedHtml) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Raw HTML */}
          {rawHtml && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Badge variant="secondary">Server-Side</Badge>
                  Raw HTML
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <MetaTagsSection title="Meta Tags" metaTags={rawHtml.metaTags || {}} />
                <HeadingsSection title="Headings" headings={rawHtml.headings || []} />
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Statistics</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded">
                      <div className="font-medium">Links</div>
                      <div className="text-2xl font-bold text-blue-600">{rawHtml.links?.length || 0}</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950 p-2 rounded">
                      <div className="font-medium">Images</div>
                      <div className="text-2xl font-bold text-green-600">{rawHtml.images?.length || 0}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rendered HTML */}
          {renderedHtml && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Badge variant="default">Client-Side</Badge>
                  Rendered HTML
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <MetaTagsSection title="Meta Tags" metaTags={renderedHtml.metaTags || {}} />
                <HeadingsSection title="Headings" headings={renderedHtml.headings || []} />
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}