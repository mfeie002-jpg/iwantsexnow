import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Download, Package, Info } from "lucide-react";

export function ExportTab() {
  const downloadMegaExport = () => {
    // This would generate the complete export package
    alert("Mega Export functionality - generates complete codebase ZIP with setup instructions");
  };

  const downloadStandaloneComponent = () => {
    // This would download just the AIFeedbackPackageStandalone.tsx component
    alert("Standalone Component download - AIFeedbackPackageStandalone.tsx");
  };

  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <Info className="w-4 h-4 text-blue-600" />
        <AlertTitle>Export Options</AlertTitle>
        <AlertDescription>
          Download the complete Web Analyzer Suite or just the standalone package generator component.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mega Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" />
              Mega Export
            </CardTitle>
            <CardDescription>
              Complete Web Analyzer Suite with all features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>✅ 6 Edge Functions</p>
              <p>✅ Complete database schema</p>
              <p>✅ Admin authentication system</p>
              <p>✅ All 8 analysis tools</p>
              <p>✅ RLS policies & security</p>
              <p>✅ Setup instructions & prompts</p>
            </div>
            <Button
              onClick={downloadMegaExport}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Mega Export
            </Button>
          </CardContent>
        </Card>

        {/* Standalone Component */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-green-600" />
              Standalone Component
            </CardTitle>
            <CardDescription>
              Just the AI Feedback Package Generator
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>✅ Single React component</p>
              <p>✅ Drop-in to any project</p>
              <p>✅ Auto-fill with AI</p>
              <p>✅ Multi-page analysis</p>
              <p>✅ Generates complete ZIP package</p>
              <p>✅ No external dependencies</p>
            </div>
            <Button
              onClick={downloadStandaloneComponent}
              variant="outline"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Component
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">After downloading Mega Export:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Create a new Next.js + Supabase project on Lovable/Softgen</li>
              <li>Copy the MEGA_PROMPT.md content into the chat</li>
              <li>Wait for the project to be generated</li>
              <li>Run the SQL migration in Supabase SQL Editor</li>
              <li>Deploy the Edge Functions</li>
              <li>Add FIRECRAWL_API_KEY to Supabase Secrets</li>
              <li>Register an account and add admin role manually</li>
              <li>Access /admin/tools to start using the suite</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Manual Admin Role Setup:</h4>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
{`-- After registering, run this SQL:
INSERT INTO user_roles (user_id, role) 
VALUES ('your-user-id-from-auth.users', 'admin');`}
            </pre>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Required Secrets:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li><strong>FIRECRAWL_API_KEY</strong> - Get from firecrawl.dev (500 free credits/month)</li>
              <li><strong>LOVABLE_API_KEY</strong> - Automatically available in Lovable Cloud projects</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}