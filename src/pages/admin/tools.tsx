import { useState } from "react";
import Head from "next/head";
import { AdminLayout } from "@/components/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Camera, 
  Zap, 
  Package, 
  MessageSquare, 
  Code, 
  Search, 
  Activity, 
  Download 
} from "lucide-react";

// Import Tabs
import { RegressionTestingTab } from "@/components/admin/tools/RegressionTestingTab";
import { ScheduledMonitoringTab } from "@/components/admin/tools/ScheduledMonitoringTab";
import { AIFeedbackPackageStandalone } from "@/components/AIFeedbackPackageStandalone";
import { ScreenshotsTab } from "@/components/admin/tools/ScreenshotsTab";
import { AIAnalysisTab } from "@/components/admin/tools/AIAnalysisTab";
import { ChatGPTPromptsTab } from "@/components/admin/tools/ChatGPTPromptsTab";
import { SEOAnalyzerTab } from "@/components/admin/tools/SEOAnalyzerTab";
import { ExportTab } from "@/components/admin/tools/ExportTab";

export default function AdminTools() {
  const [activeTab, setActiveTab] = useState("screenshots");

  return (
    <AdminLayout>
      <Head>
        <title>Admin Tools - Web Analyzer Suite</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
            Web Analyzer Tools
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Professional suite for website analysis, monitoring, and debugging.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0 justify-start">
            <TabsTrigger value="screenshots" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white border border-gray-200 dark:border-gray-800">
              <Camera className="w-4 h-4 mr-2" /> Screenshots
            </TabsTrigger>
            <TabsTrigger value="ai-analysis" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white border border-gray-200 dark:border-gray-800">
              <Zap className="w-4 h-4 mr-2" /> AI Analysis
            </TabsTrigger>
            <TabsTrigger value="feedback" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white border border-gray-200 dark:border-gray-800">
              <Package className="w-4 h-4 mr-2" /> Feedback Package
            </TabsTrigger>
            <TabsTrigger value="prompts" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white border border-gray-200 dark:border-gray-800">
              <MessageSquare className="w-4 h-4 mr-2" /> Prompts
            </TabsTrigger>
            <TabsTrigger value="seo" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white border border-gray-200 dark:border-gray-800">
              <Code className="w-4 h-4 mr-2" /> SEO Analyzer
            </TabsTrigger>
            <TabsTrigger value="regression" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white border border-gray-200 dark:border-gray-800">
              <Activity className="w-4 h-4 mr-2" /> Regression
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white border border-gray-200 dark:border-gray-800">
              <Search className="w-4 h-4 mr-2" /> Monitoring
            </TabsTrigger>
            <TabsTrigger value="export" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white border border-gray-200 dark:border-gray-800">
              <Download className="w-4 h-4 mr-2" /> Export
            </TabsTrigger>
          </TabsList>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm min-h-[600px]">
            <TabsContent value="screenshots" className="m-0">
              <ScreenshotsTab />
            </TabsContent>
            
            <TabsContent value="ai-analysis" className="m-0">
              <AIAnalysisTab />
            </TabsContent>

            <TabsContent value="feedback" className="m-0">
              <AIFeedbackPackageStandalone />
            </TabsContent>

            <TabsContent value="prompts" className="m-0">
              <ChatGPTPromptsTab />
            </TabsContent>

            <TabsContent value="seo" className="m-0">
              <SEOAnalyzerTab />
            </TabsContent>

            <TabsContent value="regression" className="m-0">
              <RegressionTestingTab />
            </TabsContent>

            <TabsContent value="monitoring" className="m-0">
              <ScheduledMonitoringTab />
            </TabsContent>

            <TabsContent value="export" className="m-0">
              <ExportTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AdminLayout>
  );
}