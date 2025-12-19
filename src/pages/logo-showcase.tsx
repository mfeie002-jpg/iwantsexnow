import { Card } from "@/components/ui/card";
import SEO from "@/components/SEO";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function LogoShowcase() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(id);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0D1B2A]">
      <SEO 
        title="Brand Assets & Logo System - iWantSexNow.ch"
        description="Official typographic brand identity and design system for iWantSexNow.ch"
      />

      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0D1B2A] sticky top-0 z-50 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-4 group">
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-[#0D1B2A] dark:text-white">iWant</span>
                <span className="text-[#C69C6D] dark:text-[#D5A021]">Sex</span>
                <span className="text-[#0D1B2A] dark:text-white">Now</span>
                <span className="text-gray-500 dark:text-gray-400 text-lg">.ch</span>
              </span>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-16 max-w-6xl">
        
        {/* Hero Section */}
        <div className="mb-20 text-center">
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-4">
              <span className="text-[#0D1B2A] dark:text-white">iWant</span>
              <span className="text-[#C69C6D] dark:text-[#D5A021]">Sex</span>
              <span className="text-[#0D1B2A] dark:text-white">Now</span>
              <span className="text-gray-500 dark:text-gray-400 text-4xl">.ch</span>
            </h1>
            <div className="text-xs text-gray-400 dark:text-gray-500 tracking-widest font-mono">
              TYPOGRAPHIC BRAND IDENTITY
            </div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-light max-w-2xl mx-auto mb-4">
            Exklusive Begleitung für anspruchsvolle Momente. Vertraulich & stilvoll.
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-500 font-light max-w-2xl mx-auto">
            Exclusive companionship for discerning moments. Confidential & refined.
          </p>
        </div>

        {/* Design Philosophy */}
        <section className="mb-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-light text-[#0D1B2A] dark:text-white mb-6">Design Philosophy</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                The iWantSexNow.ch brand identity is <strong className="text-[#0D1B2A] dark:text-white font-medium">purely typographic</strong>. 
                Despite the provocative name, the brand conveys trust, sophistication, and premium quality. No symbols or erotic elements are used.
              </p>
              <p>
                The color palette uses <strong className="text-[#0D1B2A] dark:text-white font-medium">dark navy (#0D1B2A)</strong> for 
                elegance and trust, combined with <strong className="text-[#C69C6D] dark:text-[#D5A021] font-medium">gold accents</strong> that 
                communicate luxury and value. This combination is scientifically proven for premium brands.
              </p>
            </div>
          </div>
        </section>

        {/* Logo Variants - All Text Based */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-[#0D1B2A] dark:text-white mb-8">Logo Variants</h2>
          
          <div className="space-y-8">
            {/* Primary Logo - Light Mode */}
            <Card className="p-8 bg-white border-gray-200">
              <div className="aspect-video bg-white rounded-lg flex items-center justify-center mb-6 border border-gray-200">
                <div className="text-4xl font-bold tracking-tight">
                  <span className="text-[#0D1B2A]">iWant</span>
                  <span className="text-[#C69C6D]">Sex</span>
                  <span className="text-[#0D1B2A]">Now</span>
                  <span className="text-gray-500 text-2xl">.ch</span>
                </div>
              </div>
              <h3 className="text-lg font-medium text-[#0D1B2A] mb-2">Primary Logo – Light Mode</h3>
              <p className="text-sm text-gray-600 mb-4">
                Navy wordmark with gold accent on "Sex". For white backgrounds and light surfaces.
              </p>
            </Card>

            {/* Primary Logo - Dark Mode */}
            <Card className="p-8 bg-[#0D1B2A] border-gray-800">
              <div className="aspect-video bg-[#0D1B2A] rounded-lg flex items-center justify-center mb-6 border border-gray-800">
                <div className="text-4xl font-bold tracking-tight">
                  <span className="text-white">iWant</span>
                  <span className="text-[#D5A021]">Sex</span>
                  <span className="text-white">Now</span>
                  <span className="text-gray-400 text-2xl">.ch</span>
                </div>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Primary Logo – Dark Mode</h3>
              <p className="text-sm text-gray-400 mb-4">
                White/gold wordmark on navy. Gold conveys luxury, white represents trust.
              </p>
            </Card>

            {/* Desktop Variations */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Full Logo */}
              <Card className="p-6 bg-white dark:bg-[#0D1B2A] border-gray-200 dark:border-gray-800">
                <div className="aspect-square bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center mb-4 border border-gray-200 dark:border-gray-800">
                  <div className="text-2xl font-bold tracking-tight">
                    <span className="text-[#0D1B2A] dark:text-white">iWant</span>
                    <span className="text-[#C69C6D] dark:text-[#D5A021]">Sex</span>
                    <span className="text-[#0D1B2A] dark:text-white">Now</span>
                    <span className="text-gray-500 dark:text-gray-400 text-lg">.ch</span>
                  </div>
                </div>
                <h4 className="font-semibold text-[#0D1B2A] dark:text-white mb-2">Full Desktop</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Complete wordmark for headers
                </p>
              </Card>

              {/* Short Logo */}
              <Card className="p-6 bg-white dark:bg-[#0D1B2A] border-gray-200 dark:border-gray-800">
                <div className="aspect-square bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center mb-4 border border-gray-200 dark:border-gray-800">
                  <div className="text-2xl font-bold tracking-tight">
                    <span className="text-[#0D1B2A] dark:text-white">IW</span>
                    <span className="text-[#C69C6D] dark:text-[#D5A021]">SN</span>
                    <span className="text-gray-500 dark:text-gray-400 text-base">.ch</span>
                  </div>
                </div>
                <h4 className="font-semibold text-[#0D1B2A] dark:text-white mb-2">Short Form</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  IWSN.ch for mobile navigation
                </p>
              </Card>

              {/* Minimal Icon */}
              <Card className="p-6 bg-white dark:bg-[#0D1B2A] border-gray-200 dark:border-gray-800">
                <div className="aspect-square bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center mb-4 border border-gray-200 dark:border-gray-800">
                  <div className="text-3xl font-bold tracking-tight">
                    <span className="text-[#0D1B2A] dark:text-white">I</span>
                    <span className="text-[#C69C6D] dark:text-[#D5A021]">W</span>
                  </div>
                </div>
                <h4 className="font-semibold text-[#0D1B2A] dark:text-white mb-2">Minimal Icon</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  IW for favicon/app icon
                </p>
              </Card>
            </div>

            {/* Stacked Logo */}
            <Card className="p-8 bg-[#0D1B2A] border-gray-800">
              <div className="aspect-video bg-gradient-to-br from-[#0D1B2A] to-[#1a2a3a] rounded-lg flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="text-5xl font-bold tracking-tight mb-2">
                    <span className="text-white">iWant</span>
                  </div>
                  <div className="text-5xl font-bold tracking-tight">
                    <span className="text-[#D5A021]">Sex</span>
                    <span className="text-white">Now</span>
                    <span className="text-gray-400 text-3xl">.ch</span>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Stacked Logo – Hero Version</h3>
              <p className="text-sm text-gray-400 mb-4">
                Two-line variant for hero sections. "iWant" on top, "SexNow.ch" below. Creates more verticality.
              </p>
            </Card>
          </div>
        </section>

        {/* Color System */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-[#0D1B2A] dark:text-white mb-8">Color System</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-white border-gray-200">
              <h3 className="text-xl font-medium text-[#0D1B2A] mb-4">Light Mode Palette</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-[#0D1B2A] border border-gray-300 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-[#0D1B2A]">Dark Navy</div>
                    <div className="text-sm text-gray-600 font-mono">#0D1B2A</div>
                    <div className="text-xs text-gray-500">Primary text & accents</div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard("#0D1B2A", "navy-light")}
                    className="flex-shrink-0"
                  >
                    {copiedColor === "navy-light" ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-[#C69C6D] border border-gray-300 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-[#0D1B2A]">Gold Accent</div>
                    <div className="text-sm text-gray-600 font-mono">#C69C6D</div>
                    <div className="text-xs text-gray-500">Luxury highlights</div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard("#C69C6D", "gold-light")}
                    className="flex-shrink-0"
                  >
                    {copiedColor === "gold-light" ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-[#0D1B2A] border-gray-800">
              <h3 className="text-xl font-medium text-white mb-4">Dark Mode Palette</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-[#0D1B2A] border-2 border-gray-700 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-white">Dark Navy</div>
                    <div className="text-sm text-gray-400 font-mono">#0D1B2A</div>
                    <div className="text-xs text-gray-500">Primary background</div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard("#0D1B2A", "navy-dark")}
                    className="flex-shrink-0 text-white hover:bg-gray-800"
                  >
                    {copiedColor === "navy-dark" ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-[#D5A021] border border-gray-700 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-white">Gold Accent</div>
                    <div className="text-sm text-gray-400 font-mono">#D5A021</div>
                    <div className="text-xs text-gray-500">Brighter gold for contrast</div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard("#D5A021", "gold-dark")}
                    className="flex-shrink-0 text-white hover:bg-gray-800"
                  >
                    {copiedColor === "gold-dark" ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Extended Color Palette */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-[#0D1B2A] dark:text-white mb-8">Extended Color Palette</h2>
          
          {/* Navy Scale */}
          <div className="mb-8">
            <h3 className="text-xl font-medium text-[#0D1B2A] dark:text-white mb-4">Navy Scale</h3>
            <Card className="p-6 bg-white dark:bg-[#0D1B2A] border-gray-200 dark:border-gray-800">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <div className="w-full h-24 rounded-lg bg-[#1a2a3a] mb-2 border border-gray-200 dark:border-gray-700" />
                  <div className="text-sm font-semibold text-[#0D1B2A] dark:text-white">Navy 100</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">#1a2a3a</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Hover states</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard("#1a2a3a", "navy-100")}
                    className="mt-1 text-xs h-7"
                  >
                    {copiedColor === "navy-100" ? <Check size={12} /> : <Copy size={12} />}
                  </Button>
                </div>
                <div>
                  <div className="w-full h-24 rounded-lg bg-[#0D1B2A] mb-2 border border-gray-200 dark:border-gray-700" />
                  <div className="text-sm font-semibold text-[#0D1B2A] dark:text-white">Navy 200</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">#0D1B2A</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Primary</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard("#0D1B2A", "navy-200")}
                    className="mt-1 text-xs h-7"
                  >
                    {copiedColor === "navy-200" ? <Check size={12} /> : <Copy size={12} />}
                  </Button>
                </div>
                <div>
                  <div className="w-full h-24 rounded-lg bg-[#091421] mb-2 border border-gray-200 dark:border-gray-700" />
                  <div className="text-sm font-semibold text-[#0D1B2A] dark:text-white">Navy 300</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">#091421</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Pressed states</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard("#091421", "navy-300")}
                    className="mt-1 text-xs h-7"
                  >
                    {copiedColor === "navy-300" ? <Check size={12} /> : <Copy size={12} />}
                  </Button>
                </div>
                <div>
                  <div className="w-full h-24 rounded-lg bg-[#334455] mb-2 border border-gray-200 dark:border-gray-700" />
                  <div className="text-sm font-semibold text-[#0D1B2A] dark:text-white">Navy 400</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">#334455</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Disabled</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard("#334455", "navy-400")}
                    className="mt-1 text-xs h-7"
                  >
                    {copiedColor === "navy-400" ? <Check size={12} /> : <Copy size={12} />}
                  </Button>
                </div>
                <div>
                  <div className="w-full h-24 rounded-lg bg-[#0D1B2A]/10 mb-2 border border-gray-200 dark:border-gray-700" />
                  <div className="text-sm font-semibold text-[#0D1B2A] dark:text-white">Navy 500</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">rgba(13,27,42,0.1)</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Subtle bg</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard("rgba(13,27,42,0.1)", "navy-500")}
                    className="mt-1 text-xs h-7"
                  >
                    {copiedColor === "navy-500" ? <Check size={12} /> : <Copy size={12} />}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Gold Scale */}
          <div className="mb-8">
            <h3 className="text-xl font-medium text-[#0D1B2A] dark:text-white mb-4">Gold Scale</h3>
            <Card className="p-6 bg-white dark:bg-[#0D1B2A] border-gray-200 dark:border-gray-800">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <div className="w-full h-24 rounded-lg bg-[#E8D5B7] mb-2 border border-gray-200 dark:border-gray-700" />
                  <div className="text-sm font-semibold text-[#0D1B2A] dark:text-white">Gold 100</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">#E8D5B7</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Light tint</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard("#E8D5B7", "gold-100")}
                    className="mt-1 text-xs h-7"
                  >
                    {copiedColor === "gold-100" ? <Check size={12} /> : <Copy size={12} />}
                  </Button>
                </div>
                <div>
                  <div className="w-full h-24 rounded-lg bg-[#C69C6D] mb-2 border border-gray-200 dark:border-gray-700" />
                  <div className="text-sm font-semibold text-[#0D1B2A] dark:text-white">Gold 200</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">#C69C6D</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Primary light</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard("#C69C6D", "gold-200")}
                    className="mt-1 text-xs h-7"
                  >
                    {copiedColor === "gold-200" ? <Check size={12} /> : <Copy size={12} />}
                  </Button>
                </div>
                <div>
                  <div className="w-full h-24 rounded-lg bg-[#D5A021] mb-2 border border-gray-200 dark:border-gray-700" />
                  <div className="text-sm font-semibold text-[#0D1B2A] dark:text-white">Gold 300</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">#D5A021</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Primary dark</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard("#D5A021", "gold-300")}
                    className="mt-1 text-xs h-7"
                  >
                    {copiedColor === "gold-300" ? <Check size={12} /> : <Copy size={12} />}
                  </Button>
                </div>
                <div>
                  <div className="w-full h-24 rounded-lg bg-[#B8851D] mb-2 border border-gray-200 dark:border-gray-700" />
                  <div className="text-sm font-semibold text-[#0D1B2A] dark:text-white">Gold 400</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">#B8851D</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Hover/Active</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard("#B8851D", "gold-400")}
                    className="mt-1 text-xs h-7"
                  >
                    {copiedColor === "gold-400" ? <Check size={12} /> : <Copy size={12} />}
                  </Button>
                </div>
                <div>
                  <div className="w-full h-24 rounded-lg bg-[#C69C6D]/20 mb-2 border border-gray-200 dark:border-gray-700" />
                  <div className="text-sm font-semibold text-[#0D1B2A] dark:text-white">Gold 500</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">rgba(198,156,109,0.2)</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Subtle accent</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard("rgba(198,156,109,0.2)", "gold-500")}
                    className="mt-1 text-xs h-7"
                  >
                    {copiedColor === "gold-500" ? <Check size={12} /> : <Copy size={12} />}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Semantic Colors */}
          <div className="mb-8">
            <h3 className="text-xl font-medium text-[#0D1B2A] dark:text-white mb-4">Semantic Colors</h3>
            <Card className="p-6 bg-white dark:bg-[#0D1B2A] border-gray-200 dark:border-gray-800">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="w-full h-24 rounded-lg bg-[#10B981] mb-2 border border-gray-200 dark:border-gray-700" />
                  <div className="text-sm font-semibold text-[#0D1B2A] dark:text-white">Success</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">#10B981</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Confirmations</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard("#10B981", "success")}
                    className="mt-1 text-xs h-7"
                  >
                    {copiedColor === "success" ? <Check size={12} /> : <Copy size={12} />}
                  </Button>
                </div>
                <div>
                  <div className="w-full h-24 rounded-lg bg-[#F59E0B] mb-2 border border-gray-200 dark:border-gray-700" />
                  <div className="text-sm font-semibold text-[#0D1B2A] dark:text-white">Warning</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">#F59E0B</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Alerts</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard("#F59E0B", "warning")}
                    className="mt-1 text-xs h-7"
                  >
                    {copiedColor === "warning" ? <Check size={12} /> : <Copy size={12} />}
                  </Button>
                </div>
                <div>
                  <div className="w-full h-24 rounded-lg bg-[#EF4444] mb-2 border border-gray-200 dark:border-gray-700" />
                  <div className="text-sm font-semibold text-[#0D1B2A] dark:text-white">Error</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">#EF4444</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Errors</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard("#EF4444", "error")}
                    className="mt-1 text-xs h-7"
                  >
                    {copiedColor === "error" ? <Check size={12} /> : <Copy size={12} />}
                  </Button>
                </div>
                <div>
                  <div className="w-full h-24 rounded-lg bg-[#3B82F6] mb-2 border border-gray-200 dark:border-gray-700" />
                  <div className="text-sm font-semibold text-[#0D1B2A] dark:text-white">Info</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">#3B82F6</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Information</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard("#3B82F6", "info")}
                    className="mt-1 text-xs h-7"
                  >
                    {copiedColor === "info" ? <Check size={12} /> : <Copy size={12} />}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Neutral Colors */}
          <div>
            <h3 className="text-xl font-medium text-[#0D1B2A] dark:text-white mb-4">Neutral Colors</h3>
            <Card className="p-6 bg-white dark:bg-[#0D1B2A] border-gray-200 dark:border-gray-800">
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                <div>
                  <div className="w-full h-20 rounded-lg bg-white mb-2 border-2 border-gray-300" />
                  <div className="text-xs font-semibold text-[#0D1B2A] dark:text-white">White</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">#FFFFFF</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard("#FFFFFF", "white")}
                    className="mt-1 text-xs h-6 p-1"
                  >
                    {copiedColor === "white" ? <Check size={10} /> : <Copy size={10} />}
                  </Button>
                </div>
                <div>
                  <div className="w-full h-20 rounded-lg bg-gray-100 mb-2 border border-gray-300 dark:border-gray-700" />
                  <div className="text-xs font-semibold text-[#0D1B2A] dark:text-white">Gray 100</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">#F3F4F6</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard("#F3F4F6", "gray-100")}
                    className="mt-1 text-xs h-6 p-1"
                  >
                    {copiedColor === "gray-100" ? <Check size={10} /> : <Copy size={10} />}
                  </Button>
                </div>
                <div>
                  <div className="w-full h-20 rounded-lg bg-gray-300 mb-2 border border-gray-300 dark:border-gray-700" />
                  <div className="text-xs font-semibold text-[#0D1B2A] dark:text-white">Gray 300</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">#D1D5DB</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard("#D1D5DB", "gray-300")}
                    className="mt-1 text-xs h-6 p-1"
                  >
                    {copiedColor === "gray-300" ? <Check size={10} /> : <Copy size={10} />}
                  </Button>
                </div>
                <div>
                  <div className="w-full h-20 rounded-lg bg-gray-500 mb-2 border border-gray-300 dark:border-gray-700" />
                  <div className="text-xs font-semibold text-[#0D1B2A] dark:text-white">Gray 500</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">#6B7280</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard("#6B7280", "gray-500")}
                    className="mt-1 text-xs h-6 p-1"
                  >
                    {copiedColor === "gray-500" ? <Check size={10} /> : <Copy size={10} />}
                  </Button>
                </div>
                <div>
                  <div className="w-full h-20 rounded-lg bg-gray-700 mb-2 border border-gray-300 dark:border-gray-700" />
                  <div className="text-xs font-semibold text-[#0D1B2A] dark:text-white">Gray 700</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">#374151</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard("#374151", "gray-700")}
                    className="mt-1 text-xs h-6 p-1"
                  >
                    {copiedColor === "gray-700" ? <Check size={10} /> : <Copy size={10} />}
                  </Button>
                </div>
                <div>
                  <div className="w-full h-20 rounded-lg bg-gray-900 mb-2 border border-gray-300 dark:border-gray-700" />
                  <div className="text-xs font-semibold text-[#0D1B2A] dark:text-white">Gray 900</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">#111827</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard("#111827", "gray-900")}
                    className="mt-1 text-xs h-6 p-1"
                  >
                    {copiedColor === "gray-900" ? <Check size={10} /> : <Copy size={10} />}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Color Usage Guide */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-[#0D1B2A] dark:text-white mb-8">Color Usage Guide</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-white dark:bg-[#0D1B2A] border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-[#0D1B2A] dark:text-white mb-4">Primary Actions</h3>
              <div className="space-y-3">
                <Button className="w-full bg-[#C69C6D] hover:bg-[#B8851D] text-white">
                  Gold CTA Button
                </Button>
                <Button className="w-full bg-[#0D1B2A] hover:bg-[#1a2a3a] text-white">
                  Navy Button
                </Button>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Use gold for premium actions and navy for standard actions.
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white dark:bg-[#0D1B2A] border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-[#0D1B2A] dark:text-white mb-4">Status Indicators</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                  <span className="text-sm text-[#0D1B2A] dark:text-white">Available / Success</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                  <span className="text-sm text-[#0D1B2A] dark:text-white">Pending / Warning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                  <span className="text-sm text-[#0D1B2A] dark:text-white">Error / Offline</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#3B82F6]" />
                  <span className="text-sm text-[#0D1B2A] dark:text-white">Information</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white dark:bg-[#0D1B2A] border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-[#0D1B2A] dark:text-white mb-4">Text Hierarchy</h3>
              <div className="space-y-2">
                <p className="text-base text-[#0D1B2A] dark:text-white font-bold">Primary Text - Navy/White</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Secondary Text - Gray 600/400</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">Tertiary Text - Gray 500</p>
                <p className="text-sm text-[#C69C6D] dark:text-[#D5A021] font-semibold">Gold Accent Text</p>
              </div>
            </Card>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-[#0D1B2A] dark:text-white mb-8">Typography</h2>
          
          <Card className="p-8 bg-white dark:bg-[#0D1B2A] border-gray-200 dark:border-gray-800">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-[#0D1B2A] dark:text-white mb-2">
                  System Font Stack – Primary
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Using system fonts for optimal performance and native feel across all platforms.
                </p>
                <div className="space-y-2 text-[#0D1B2A] dark:text-white">
                  <div className="text-4xl font-normal">Aa Bb Cc 123</div>
                  <div className="text-2xl font-bold">Regular & Bold Weights</div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <h4 className="font-semibold text-[#0D1B2A] dark:text-white mb-2">Font Stack:</h4>
                <code className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-3 py-2 rounded block">
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                </code>
              </div>
            </div>
          </Card>
        </section>

        {/* Usage Examples */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-[#0D1B2A] dark:text-white mb-8">Real-World Usage</h2>
          
          <div className="space-y-6">
            {/* Website Header Example */}
            <Card className="overflow-hidden bg-white dark:bg-[#0D1B2A] border-gray-200 dark:border-gray-800">
              <div className="bg-white dark:bg-[#0D1B2A] p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                  <div className="text-2xl font-bold tracking-tight">
                    <span className="text-[#0D1B2A] dark:text-white">iWant</span>
                    <span className="text-[#C69C6D] dark:text-[#D5A021]">Sex</span>
                    <span className="text-[#0D1B2A] dark:text-white">Now</span>
                    <span className="text-gray-500 dark:text-gray-400 text-lg">.ch</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" className="text-[#0D1B2A] dark:text-white">
                      Browse
                    </Button>
                    <Button className="bg-[#C69C6D] dark:bg-[#D5A021] text-white font-bold hover:opacity-90">
                      Join Now
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  <strong className="text-[#0D1B2A] dark:text-white">Desktop Header</strong> — Full logo with CTA buttons
                </p>
              </div>
            </Card>

            {/* Mobile Header Example */}
            <Card className="overflow-hidden bg-white dark:bg-[#0D1B2A] border-gray-200 dark:border-gray-800">
              <div className="bg-white dark:bg-[#0D1B2A] p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between max-w-[375px] mx-auto">
                  <div className="text-xl font-bold tracking-tight">
                    <span className="text-[#0D1B2A] dark:text-white">IW</span>
                    <span className="text-[#C69C6D] dark:text-[#D5A021]">SN</span>
                    <span className="text-gray-500 dark:text-gray-400 text-base">.ch</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded" />
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded" />
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  <strong className="text-[#0D1B2A] dark:text-white">Mobile Header</strong> — Compact IWSN.ch saves space
                </p>
              </div>
            </Card>

            {/* Hero Section Example */}
            <Card className="overflow-hidden bg-white dark:bg-[#0D1B2A] border-gray-200 dark:border-gray-800">
              <div className="bg-gradient-to-br from-[#0D1B2A] to-[#1a2a3a] p-16 text-center">
                <div className="max-w-2xl mx-auto">
                  <div className="text-6xl font-bold tracking-tight mb-4">
                    <span className="text-white">iWant</span>
                  </div>
                  <div className="text-6xl font-bold tracking-tight mb-8">
                    <span className="text-[#D5A021]">Sex</span>
                    <span className="text-white">Now</span>
                    <span className="text-gray-400 text-4xl">.ch</span>
                  </div>
                  <p className="text-xl text-gray-300 mb-8">
                    Exklusive Begleitung für anspruchsvolle Momente. Vertraulich & stilvoll.
                  </p>
                  <Button size="lg" className="bg-[#D5A021] text-white hover:opacity-90">
                    Jetzt entdecken
                  </Button>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  <strong className="text-[#0D1B2A] dark:text-white">Hero Section</strong> — Stacked logo with premium tagline
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Guidelines */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-[#0D1B2A] dark:text-white mb-8">Brand Guidelines</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 bg-white dark:bg-[#0D1B2A] border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-medium text-green-600 dark:text-green-400 mb-6 flex items-center gap-2">
                <span className="text-2xl">✓</span>
                Do This
              </h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                  <span>Use full logo for desktop headers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                  <span>Use IWSN.ch for mobile navigation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                  <span>Use stacked version for hero sections</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                  <span>Maintain 4.5:1 contrast ratio minimum</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                  <span>Use system font stack for performance</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-white dark:bg-[#0D1B2A] border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-medium text-red-600 dark:text-red-400 mb-6 flex items-center gap-2">
                <span className="text-2xl">✗</span>
                Avoid This
              </h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                  <span>Never add symbols or erotic elements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                  <span>Don't distort or stretch the wordmark</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                  <span>Never change color values</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                  <span>Don't overuse gold accent</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                  <span>Avoid insufficient contrast with backgrounds</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* HTML/CSS Code Examples */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-[#0D1B2A] dark:text-white mb-8">Implementation Code</h2>
          
          <div className="space-y-6">
            <Card className="p-6 bg-white dark:bg-[#0D1B2A] border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-medium text-[#0D1B2A] dark:text-white mb-4">HTML Logo - Light Mode</h3>
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-gray-800 dark:text-gray-200">{`<div class="logo">
  <span class="text-navy">iWant</span>
  <span class="text-gold">Sex</span>
  <span class="text-navy">Now</span>
  <span class="text-gray">.ch</span>
</div>`}</code>
              </pre>
            </Card>

            <Card className="p-6 bg-white dark:bg-[#0D1B2A] border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-medium text-[#0D1B2A] dark:text-white mb-4">CSS Variables</h3>
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-gray-800 dark:text-gray-200">{`:root {
  --brand-navy: #0D1B2A;
  --brand-gold: #C69C6D;
  --brand-gray: #6B7280;
}

.dark {
  --brand-navy: #0D1B2A;
  --brand-gold: #D5A021;
  --brand-gray: #9CA3AF;
}

.logo {
  font-weight: 700;
  font-size: 2rem;
  letter-spacing: -0.025em;
}

.text-navy { color: var(--brand-navy); }
.text-gold { color: var(--brand-gold); }
.text-gray { color: var(--brand-gray); }`}</code>
              </pre>
            </Card>
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 mt-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
              © 2025 iWantSexNow.ch — All brand assets are protected.
            </p>
            <Link href="/logo-concepts">
              <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-[#0D1B2A] dark:hover:text-white">
                View Alternative Concepts →
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}