import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, Clock, CheckCircle, XCircle } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ScheduledUrl {
  id: string;
  name: string;
  url: string;
  last_captured_at: string;
  status: string;
}

export function ScheduledMonitoringTab() {
  const [urls, setUrls] = useState<ScheduledUrl[]>([]);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    const { data } = await supabase
      .from("scheduled_screenshot_urls")
      .select("*")
      .order("name");
    if (data) setUrls(data);
  };

  const triggerManualRun = async () => {
    setRunning(true);
    try {
      // Trigger the Edge Function manually
      const { data, error } = await supabase.functions.invoke("scheduled-screenshots");
      if (error) throw error;
      
      // Refresh list
      await fetchUrls();
      
      // Could show toast success here
    } catch (err) {
      console.error("Manual run failed:", err);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Scheduled Monitoring</h2>
          <p className="text-gray-500">Automated daily screenshots of critical pages</p>
        </div>
        <Button onClick={triggerManualRun} disabled={running}>
          {running ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
          Run All Now
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Monitored</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{urls.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Success Rate (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">98%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Next Run</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2">
              00:00 <span className="text-sm font-normal text-gray-400">UTC</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page Name</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Last Captured</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {urls.map((url) => (
                <TableRow key={url.id}>
                  <TableCell className="font-medium">{url.name}</TableCell>
                  <TableCell className="font-mono text-xs text-gray-500 max-w-[200px] truncate" title={url.url}>
                    {url.url}
                  </TableCell>
                  <TableCell>
                    {url.last_captured_at ? new Date(url.last_captured_at).toLocaleString() : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">History</Button>
                  </TableCell>
                </TableRow>
              ))}
              {urls.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No scheduled URLs configured. Add them in the database or config.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}