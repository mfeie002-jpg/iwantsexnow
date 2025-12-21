import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Camera, AlertTriangle, CheckCircle, Plus, Eye, Trash2 } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Baseline {
  id: string;
  name: string;
  url: string;
  screenshot_url: string;
  last_checked_at: string;
}

export function RegressionTestingTab() {
  const [baselines, setBaselines] = useState<Baseline[]>([]);
  const [loading, setLoading] = useState(false);
  const [comparing, setComparing] = useState<string | null>(null);
  
  // New Baseline Form
  const [newBaseline, setNewBaseline] = useState({ name: "", url: "" });
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
    fetchBaselines();
  }, []);

  const fetchBaselines = async () => {
    const { data } = await supabase
      .from("screenshot_baselines")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setBaselines(data);
  };

  const createBaseline = async () => {
    if (!newBaseline.name || !newBaseline.url) return;
    setLoading(true);
    
    try {
      // 1. Capture Screenshot
      const { data: captureData, error: captureError } = await supabase.functions.invoke("capture-screenshot", {
        body: { url: newBaseline.url, viewportWidth: 1920, viewportHeight: 1080 }
      });
      
      if (captureError) throw captureError;

      // 2. Save to DB
      const { error: dbError } = await supabase
        .from("screenshot_baselines")
        .insert({
          name: newBaseline.name,
          url: newBaseline.url,
          screenshot_url: captureData.screenshotUrl,
          image_base64: "stored_in_url", // Optimization: Don't store huge base64 in DB if URL is persistent
        });

      if (dbError) throw dbError;
      
      setAddDialogOpen(false);
      fetchBaselines();
    } catch (err) {
      console.error("Failed to create baseline:", err);
    } finally {
      setLoading(false);
    }
  };

  const runRegressionTest = async (baseline: Baseline) => {
    setComparing(baseline.id);
    try {
      // Logic for comparison would go here:
      // 1. Capture new screenshot
      // 2. Compare with baseline screenshot (pixel diff)
      // 3. Store result
      // For now, we'll simulate a capture update
      await supabase.functions.invoke("capture-screenshot", {
        body: { url: baseline.url }
      });
      
      // Update last checked
      await supabase
        .from("screenshot_baselines")
        .update({ last_checked_at: new Date().toISOString() })
        .eq("id", baseline.id);

      fetchBaselines();
    } catch (err) {
      console.error("Regression test failed:", err);
    } finally {
      setComparing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Visual Regression Testing</h2>
          <p className="text-gray-500">Monitor visual changes across your website</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              New Baseline
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Baseline</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input 
                  value={newBaseline.name} 
                  onChange={e => setNewBaseline({...newBaseline, name: e.target.value})}
                  placeholder="e.g. Homepage Desktop" 
                />
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <Input 
                  value={newBaseline.url} 
                  onChange={e => setNewBaseline({...newBaseline, url: e.target.value})}
                  placeholder="https://..." 
                />
              </div>
              <Button onClick={createBaseline} disabled={loading} className="w-full">
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Capture Baseline"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {baselines.map((baseline) => (
          <Card key={baseline.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">{baseline.name}</h3>
                  <p className="text-sm text-gray-500">{baseline.url}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Last checked: {baseline.last_checked_at ? new Date(baseline.last_checked_at).toLocaleString() : 'Never'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => window.open(baseline.screenshot_url, '_blank')}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Baseline
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => runRegressionTest(baseline)}
                    disabled={comparing === baseline.id}
                  >
                    {comparing === baseline.id ? <Loader2 className="animate-spin w-4 h-4" /> : "Run Comparison"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {baselines.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Camera className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No baselines created yet. Start by adding one to monitor.</p>
          </div>
        )}
      </div>
    </div>
  );
}