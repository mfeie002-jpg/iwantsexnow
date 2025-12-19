import { Card } from "@/components/ui/card";
import SEO from "@/components/SEO";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function LogoShowcase() {
  const handleDownload = (filename: string, displayName: string) => {
    const link = document.createElement('a');
    link.href = `/${filename}`;
    link.download = displayName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    const files = [
      { file: 'logo_512x512.png', name: 'iWantSexNow-logo-512x512.png' },
      { file: 'logo_256x256.png', name: 'iWantSexNow-logo-256x256.png' },
      { file: 'logo_128x128.png', name: 'iWantSexNow-logo-128x128.png' },
      { file: 'logo_64x64.png', name: 'iWantSexNow-logo-64x64.png' },
      { file: 'logo_32x32.png', name: 'iWantSexNow-logo-32x32.png' },
      { file: 'logo_16x16.png', name: 'iWantSexNow-logo-16x16.png' },
      { file: 'logo_monochrome_white.png', name: 'iWantSexNow-logo-white.png' },
      { file: 'logo_monochrome_black.png', name: 'iWantSexNow-logo-black.png' },
      { file: '9d4e92fe-6caa-40e2-a75b-d159fbcf8c21.png', name: 'iWantSexNow-full-lockup.png' }
    ];

    files.forEach((item, index) => {
      setTimeout(() => {
        handleDownload(item.file, item.name);
      }, index * 500);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <SEO 
        title="Logo Showcase - iWantSexNow.ch"
        description="Preview and download all logo variations for iWantSexNow.ch"
      />

      {/* Header */}
      <header className="border-b border-white/10 bg-black/60 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/logo_128x128.png" 
                alt="iWantSexNow.ch" 
                className="w-10 h-10"
              />
              <h1 className="text-2xl font-bold text-white">Logo Showcase</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleDownloadAll}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold"
              >
                <Download size={18} className="mr-2" />
                Download All
              </Button>
              <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Link href="/">← Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Introduction */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-4">
              iWantSexNow.ch Logo System
            </h2>
            <p className="text-xl text-gray-400 mb-6">
              Elegant geometric heart design with multiple variations
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-semibold text-sm">All logos ready for download</span>
            </div>
          </div>

          {/* Primary Logo - Full Color */}
          <Card className="p-8 bg-gradient-to-br from-gray-900 to-gray-950 border-white/20 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4">
                <div className="inline-block px-4 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                  PRIMARY LOGO
                </div>
                <h3 className="text-3xl font-bold text-white">Full Color Logo</h3>
                <p className="text-gray-400">
                  The primary logo for dark backgrounds. Use this as the main logo across the site header and navigation.
                </p>
                <div className="space-y-2 text-sm text-gray-400">
                  <p><strong className="text-white">Best for:</strong> Website header, navigation bars, dark-themed pages</p>
                  <p><strong className="text-white">File:</strong> logo_128x128.png (recommended for web)</p>
                  <p><strong className="text-white">Background:</strong> Dark backgrounds only</p>
                </div>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => handleDownload('logo_128x128.png', 'iWantSexNow-logo-128x128.png')}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold"
                  >
                    <Download size={18} className="mr-2" />
                    Download (128px)
                  </Button>
                  <Button 
                    onClick={() => handleDownload('logo_512x512.png', 'iWantSexNow-logo-512x512.png')}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Download size={18} className="mr-2" />
                    HD (512px)
                  </Button>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-6">
                <div className="bg-gray-950 p-8 rounded-lg border border-white/10 flex items-center justify-center">
                  <img 
                    src="/logo_128x128.png" 
                    alt="Primary Logo" 
                    className="h-48 w-auto"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-950 p-4 rounded border border-white/10 flex items-center justify-center">
                    <img src="/logo_512x512.png" alt="512px" className="w-16 h-16" />
                  </div>
                  <div className="bg-gray-950 p-4 rounded border border-white/10 flex items-center justify-center">
                    <img src="/logo_256x256.png" alt="256px" className="w-12 h-12" />
                  </div>
                  <div className="bg-gray-950 p-4 rounded border border-white/10 flex items-center justify-center">
                    <img src="/logo_128x128.png" alt="128px" className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Monochrome White Version */}
          <Card className="p-8 bg-gradient-to-br from-gray-900 to-gray-950 border-white/20 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4">
                <div className="inline-block px-4 py-1 bg-gray-500 text-white text-xs font-bold rounded-full">
                  MONOCHROME WHITE
                </div>
                <h3 className="text-3xl font-bold text-white">White Logo Version</h3>
                <p className="text-gray-400">
                  Pure white monochrome version for dark backgrounds. Clean and minimal design perfect for overlays and watermarks.
                </p>
                <div className="space-y-2 text-sm text-gray-400">
                  <p><strong className="text-white">Best for:</strong> Video overlays, dark backgrounds, minimal designs, watermarks</p>
                  <p><strong className="text-white">File:</strong> logo_monochrome_white.png</p>
                </div>
                <Button 
                  onClick={() => handleDownload('logo_monochrome_white.png', 'iWantSexNow-logo-white.png')}
                  className="bg-white hover:bg-gray-100 text-gray-900 font-bold"
                >
                  <Download size={18} className="mr-2" />
                  Download White Logo
                </Button>
              </div>
              <div className="flex-1">
                <div className="bg-gray-950 p-8 rounded-lg border border-white/10 flex items-center justify-center">
                  <img 
                    src="/logo_monochrome_white.png" 
                    alt="White Logo" 
                    className="h-48 w-auto"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Monochrome Black Version */}
          <Card className="p-8 bg-white border-gray-200 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4">
                <div className="inline-block px-4 py-1 bg-gray-700 text-white text-xs font-bold rounded-full">
                  MONOCHROME BLACK
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Black Logo Version</h3>
                <p className="text-gray-600">
                  For light backgrounds and printed materials. Features clean black design that works well on white or light-colored surfaces.
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong className="text-gray-900">Best for:</strong> Documents, invoices, light-themed pages, print materials</p>
                  <p><strong className="text-gray-900">File:</strong> logo_monochrome_black.png</p>
                </div>
                <Button 
                  onClick={() => handleDownload('logo_monochrome_black.png', 'iWantSexNow-logo-black.png')}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-bold"
                >
                  <Download size={18} className="mr-2" />
                  Download Black Logo
                </Button>
              </div>
              <div className="flex-1">
                <div className="bg-gray-100 p-8 rounded-lg border border-gray-300 flex items-center justify-center">
                  <img 
                    src="/logo_monochrome_black.png" 
                    alt="Black Logo" 
                    className="h-48 w-auto"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Full Logo Lockup */}
          <Card className="p-8 bg-gradient-to-br from-gray-900 to-gray-950 border-white/20 shadow-2xl">
            <div className="flex flex-col gap-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">
                  MARKETING LOCKUP
                </div>
                <h3 className="text-3xl font-bold text-white">Full Logo with Wordmark</h3>
                <p className="text-gray-400">
                  Complete logo with "iWantSexNow.ch" wordmark for marketing materials, 
                  business cards, and promotional content. Features elegant typography.
                </p>
                <div className="space-y-2 text-sm text-gray-400">
                  <p><strong className="text-white">Best for:</strong> Marketing materials, business cards, advertisements, social media</p>
                  <p><strong className="text-white">File:</strong> 9d4e92fe-6caa-40e2-a75b-d159fbcf8c21.png</p>
                  <p><strong className="text-white">Note:</strong> Horizontal lockup with logo mark and full wordmark</p>
                </div>
                <Button 
                  onClick={() => handleDownload('9d4e92fe-6caa-40e2-a75b-d159fbcf8c21.png', 'iWantSexNow-full-lockup.png')}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  <Download size={18} className="mr-2" />
                  Download Full Lockup
                </Button>
              </div>
              <div className="bg-gray-950 p-12 rounded-lg border border-white/10 flex items-center justify-center">
                <img 
                  src="/9d4e92fe-6caa-40e2-a75b-d159fbcf8c21.png" 
                  alt="Full Logo Lockup" 
                  className="max-w-md w-full"
                />
              </div>
            </div>
          </Card>

          {/* Logo in Context - Live Preview */}
          <Card className="p-8 bg-gradient-to-br from-gray-900 to-gray-950 border-white/20 shadow-2xl">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white">Logo in Context</h3>
              <p className="text-gray-400">
                See how the logo appears in the actual website header with interactive effects:
              </p>
              
              {/* Simulated Header */}
              <div className="bg-black border border-white/10 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer">
                      <div className="relative">
                        <img 
                          src="/logo_128x128.png" 
                          alt="iWantSexNow.ch Logo" 
                          className="w-12 h-12 transition-all group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-rose-400/10 blur-xl group-hover:bg-rose-400/20 transition-all rounded-lg" />
                      </div>
                      <div>
                        <span className="text-2xl font-black text-white tracking-tight">
                          iWantSexNow.ch
                        </span>
                        <div className="text-xs text-gray-400 font-semibold tracking-wider">WHERE DESIRE MEETS DISCRETION</div>
                      </div>
                    </div>
                    
                    <Button className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-bold">
                      Join Free
                    </Button>
                  </div>
                </div>
                <div className="p-8 bg-gradient-to-b from-gray-900 to-black">
                  <p className="text-center text-gray-500 text-sm">
                    Hover over the logo to see the interactive glow effect
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Link href="/">View Live on Homepage →</Link>
                </Button>
              </div>
            </div>
          </Card>

          {/* All Sizes Reference */}
          <Card className="p-8 bg-gradient-to-br from-gray-900 to-gray-950 border-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-bold text-white">Complete Size Collection</h3>
              <Button 
                onClick={handleDownloadAll}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold"
              >
                <Download size={18} className="mr-2" />
                Download All Sizes
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-6 p-4 bg-black/40 rounded-lg hover:bg-black/60 transition-all">
                <img src="/logo_512x512.png" alt="512px" className="w-20 h-20" />
                <div className="flex-1 text-gray-300">
                  <p className="text-xl font-bold text-white">512×512px</p>
                  <p className="text-sm">High resolution • Android Chrome PWA • App icons</p>
                </div>
                <Button 
                  onClick={() => handleDownload('logo_512x512.png', 'iWantSexNow-logo-512x512.png')}
                  variant="outline"
                  size="sm"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
              </div>
              
              <div className="flex items-center gap-6 p-4 bg-black/40 rounded-lg hover:bg-black/60 transition-all">
                <img src="/logo_256x256.png" alt="256px" className="w-16 h-16" />
                <div className="flex-1 text-gray-300">
                  <p className="text-xl font-bold text-white">256×256px</p>
                  <p className="text-sm">Android Chrome • PWA icons • High-DPI displays</p>
                </div>
                <Button 
                  onClick={() => handleDownload('logo_256x256.png', 'iWantSexNow-logo-256x256.png')}
                  variant="outline"
                  size="sm"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
              </div>
              
              <div className="flex items-center gap-6 p-4 bg-black/40 rounded-lg hover:bg-black/60 transition-all border-2 border-green-500/30">
                <img src="/logo_128x128.png" alt="128px" className="w-12 h-12" />
                <div className="flex-1 text-gray-300">
                  <p className="text-xl font-bold text-white">128×128px <span className="text-green-400 text-sm">⭐ RECOMMENDED</span></p>
                  <p className="text-sm">Primary web use • Website header • Navigation</p>
                </div>
                <Button 
                  onClick={() => handleDownload('logo_128x128.png', 'iWantSexNow-logo-128x128.png')}
                  variant="outline"
                  size="sm"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
              </div>
              
              <div className="flex items-center gap-6 p-4 bg-black/40 rounded-lg hover:bg-black/60 transition-all">
                <img src="/logo_64x64.png" alt="64px" className="w-8 h-8" />
                <div className="flex-1 text-gray-300">
                  <p className="text-xl font-bold text-white">64×64px</p>
                  <p className="text-sm">Small contexts • Buttons • Compact layouts</p>
                </div>
                <Button 
                  onClick={() => handleDownload('logo_64x64.png', 'iWantSexNow-logo-64x64.png')}
                  variant="outline"
                  size="sm"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
              </div>
              
              <div className="flex items-center gap-6 p-4 bg-black/40 rounded-lg hover:bg-black/60 transition-all">
                <img src="/logo_32x32.png" alt="32px" className="w-6 h-6" />
                <div className="flex-1 text-gray-300">
                  <p className="text-xl font-bold text-white">32×32px</p>
                  <p className="text-sm">Favicon • Browser tabs • Retina displays</p>
                </div>
                <Button 
                  onClick={() => handleDownload('logo_32x32.png', 'iWantSexNow-logo-32x32.png')}
                  variant="outline"
                  size="sm"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
              </div>
              
              <div className="flex items-center gap-6 p-4 bg-black/40 rounded-lg hover:bg-black/60 transition-all">
                <img src="/logo_16x16.png" alt="16px" className="w-4 h-4" />
                <div className="flex-1 text-gray-300">
                  <p className="text-xl font-bold text-white">16×16px</p>
                  <p className="text-sm">Smallest favicon • Legacy browser support</p>
                </div>
                <Button 
                  onClick={() => handleDownload('logo_16x16.png', 'iWantSexNow-logo-16x16.png')}
                  variant="outline"
                  size="sm"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </Card>

          {/* Usage Guidelines */}
          <Card className="p-8 bg-gradient-to-br from-gray-900 to-gray-950 border-white/20 shadow-2xl">
            <h3 className="text-3xl font-bold text-white mb-6">Usage Guidelines</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-green-400 flex items-center gap-2">
                  <span className="text-2xl">✓</span> DO
                </h4>
                <ul className="space-y-2 text-gray-300 pl-6">
                  <li>• Use full color logo on dark backgrounds</li>
                  <li>• Maintain aspect ratio (always square)</li>
                  <li>• Use proper clear space around logo</li>
                  <li>• Apply subtle hover effects for interactivity</li>
                  <li>• Use appropriate size for context (128px recommended for web)</li>
                  <li>• Ensure logo is clearly visible and has good contrast</li>
                  <li>• Use monochrome versions when color isn't suitable</li>
                  <li>• Download highest resolution needed for print</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-red-400 flex items-center gap-2">
                  <span className="text-2xl">✗</span> DON'T
                </h4>
                <ul className="space-y-2 text-gray-300 pl-6">
                  <li>• Don't distort or stretch the logo</li>
                  <li>• Don't use full color on light backgrounds</li>
                  <li>• Don't add unauthorized effects or filters</li>
                  <li>• Don't rotate the logo at odd angles</li>
                  <li>• Don't change the colors or gradients</li>
                  <li>• Don't place on busy or cluttered backgrounds</li>
                  <li>• Don't make the logo too small to be recognizable</li>
                  <li>• Don't add drop shadows or outlines</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-600/10 border border-blue-500/30 rounded-lg">
              <h4 className="text-lg font-bold text-blue-400 mb-3">💡 Pro Tips</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• For web use, 128×128px is the sweet spot for header logos</li>
                <li>• Use 512×512px for high-resolution needs and app icons</li>
                <li>• White monochrome version works great for video overlays</li>
                <li>• Black monochrome is perfect for documents and invoices</li>
                <li>• The full lockup with wordmark is ideal for marketing materials</li>
              </ul>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="text-center py-12 space-y-6">
            <h3 className="text-2xl font-bold text-white">Ready to use these logos?</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={handleDownloadAll}
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold"
              >
                <Download size={20} className="mr-2" />
                Download Complete Logo Pack
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Link href="/">View Live Website →</Link>
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2025 iWantSexNow.ch. All logos and branding materials are proprietary.</p>
        </div>
      </footer>
    </div>
  );
}