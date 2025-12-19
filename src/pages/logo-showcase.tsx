import { Card } from "@/components/ui/card";
import SEO from "@/components/SEO";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LogoShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <SEO 
        title="Logo Showcase - iWantSexNow.ch"
        description="Preview all logo variations"
      />

      {/* Header */}
      <header className="border-b border-white/10 bg-black/60 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Logo Showcase</h1>
            <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Link href="/">← Back to Home</Link>
            </Button>
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
            <p className="text-xl text-gray-400">
              Elegant geometric heart design with multiple variations
            </p>
          </div>

          {/* Rose Gold Gradient - PRIMARY */}
          <Card className="p-8 bg-gradient-to-br from-gray-900 to-gray-950 border-white/20">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4">
                <div className="inline-block px-4 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                  PRIMARY LOGO
                </div>
                <h3 className="text-3xl font-bold text-white">Rose Gold Gradient</h3>
                <p className="text-gray-400">
                  The primary logo for dark backgrounds. Features an elegant rose gold gradient 
                  that adds sophistication without being too colorful.
                </p>
                <div className="space-y-2 text-sm text-gray-400">
                  <p><strong className="text-white">Use for:</strong> Main website header, navigation, dark-themed pages</p>
                  <p><strong className="text-white">File:</strong> logo_128x128.png</p>
                  <p><strong className="text-white">Colors:</strong> Champagne gold to muted rose gradient</p>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-6">
                <div className="bg-gray-950 p-8 rounded-lg border border-white/10 flex items-center justify-center">
                  <img 
                    src="/logo_512x512.png" 
                    alt="Rose Gold Logo" 
                    className="w-48 h-48"
                  />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-gray-950 p-4 rounded border border-white/10 flex items-center justify-center">
                    <img src="/logo_128x128.png" alt="128px" className="w-16 h-16" />
                  </div>
                  <div className="bg-gray-950 p-4 rounded border border-white/10 flex items-center justify-center">
                    <img src="/logo_64x64.png" alt="64px" className="w-8 h-8" />
                  </div>
                  <div className="bg-gray-950 p-4 rounded border border-white/10 flex items-center justify-center">
                    <img src="/logo_32x32.png" alt="32px" className="w-4 h-4" />
                  </div>
                  <div className="bg-gray-950 p-4 rounded border border-white/10 flex items-center justify-center">
                    <img src="/logo_16x16.png" alt="16px" className="w-2 h-2" />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Monochrome White */}
          <Card className="p-8 bg-gradient-to-br from-gray-900 to-gray-950 border-white/20">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4">
                <div className="inline-block px-4 py-1 bg-gray-500 text-white text-xs font-bold rounded-full">
                  ALTERNATIVE
                </div>
                <h3 className="text-3xl font-bold text-white">Monochrome White</h3>
                <p className="text-gray-400">
                  Pure grayscale version for dark backgrounds when you want a more neutral look 
                  without the rose gold gradient.
                </p>
                <div className="space-y-2 text-sm text-gray-400">
                  <p><strong className="text-white">Use for:</strong> When pure grayscale is preferred, print materials</p>
                  <p><strong className="text-white">File:</strong> logo_monochrome_white.png</p>
                  <p><strong className="text-white">Colors:</strong> White to light gray</p>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-gray-950 p-8 rounded-lg border border-white/10 flex items-center justify-center">
                  <img 
                    src="/logo_monochrome_white.png" 
                    alt="Monochrome White Logo" 
                    className="w-48 h-48"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Monochrome Black */}
          <Card className="p-8 bg-white border-gray-200">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4">
                <div className="inline-block px-4 py-1 bg-gray-700 text-white text-xs font-bold rounded-full">
                  LIGHT BACKGROUNDS
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Monochrome Black</h3>
                <p className="text-gray-600">
                  For light backgrounds and documents. Features dark gray tones that work well 
                  on white or light-colored surfaces.
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong className="text-gray-900">Use for:</strong> Documents, invoices, light-themed pages</p>
                  <p><strong className="text-gray-900">File:</strong> logo_monochrome_black.png</p>
                  <p><strong className="text-gray-900">Colors:</strong> Black to dark gray</p>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-gray-100 p-8 rounded-lg border border-gray-300 flex items-center justify-center">
                  <img 
                    src="/logo_monochrome_black.png" 
                    alt="Monochrome Black Logo" 
                    className="w-48 h-48"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Full Lockup */}
          <Card className="p-8 bg-gradient-to-br from-gray-900 to-gray-950 border-white/20">
            <div className="flex flex-col gap-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">
                  MARKETING MATERIALS
                </div>
                <h3 className="text-3xl font-bold text-white">Full Logo Lockup</h3>
                <p className="text-gray-400">
                  Complete logo with wordmark "iWantSexNow.ch" for marketing materials, 
                  business cards, and promotional content.
                </p>
                <div className="space-y-2 text-sm text-gray-400">
                  <p><strong className="text-white">Use for:</strong> Marketing materials, business cards, advertisements</p>
                  <p><strong className="text-white">File:</strong> 9d4e92fe-6caa-40e2-a75b-d159fbcf8c21.png</p>
                  <p><strong className="text-white">Note:</strong> Includes rose gold logo with elegant serif typography</p>
                </div>
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

          {/* Logo in Context - Homepage Preview */}
          <Card className="p-8 bg-gradient-to-br from-gray-900 to-gray-950 border-white/20">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white">Logo in Context</h3>
              <p className="text-gray-400">
                See how the logo appears in the actual website header:
              </p>
              
              {/* Simulated Header */}
              <div className="bg-black border border-white/10 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 group">
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
                    Hover over the logo to see the interactive effect
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Usage Guidelines */}
          <Card className="p-8 bg-gradient-to-br from-gray-900 to-gray-950 border-white/20">
            <h3 className="text-3xl font-bold text-white mb-6">Usage Guidelines</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-green-400">✓ DO</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Use the rose gold gradient version on dark backgrounds</li>
                  <li>• Maintain aspect ratio (always square)</li>
                  <li>• Use proper clear space around logo</li>
                  <li>• Apply subtle hover effects for interactivity</li>
                  <li>• Use appropriate size for context</li>
                  <li>• Ensure logo is clearly visible</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-red-400">✗ DON'T</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Don't distort or stretch the logo</li>
                  <li>• Don't use rose gold on light backgrounds</li>
                  <li>• Don't add unauthorized effects</li>
                  <li>• Don't rotate the logo</li>
                  <li>• Don't change the gradient colors</li>
                  <li>• Don't place on busy backgrounds</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Size Reference */}
          <Card className="p-8 bg-gradient-to-br from-gray-900 to-gray-950 border-white/20">
            <h3 className="text-3xl font-bold text-white mb-6">Size Reference</h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-6 p-4 bg-black/40 rounded-lg">
                <img src="/logo_512x512.png" alt="512px" className="w-64 h-64" />
                <div className="text-gray-300">
                  <p className="text-xl font-bold text-white">512×512px</p>
                  <p className="text-sm">High resolution, Android Chrome PWA</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 p-4 bg-black/40 rounded-lg">
                <img src="/logo_256x256.png" alt="256px" className="w-32 h-32" />
                <div className="text-gray-300">
                  <p className="text-xl font-bold text-white">256×256px</p>
                  <p className="text-sm">Android Chrome, PWA icons</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 p-4 bg-black/40 rounded-lg">
                <img src="/logo_128x128.png" alt="128px" className="w-16 h-16" />
                <div className="text-gray-300">
                  <p className="text-xl font-bold text-white">128×128px</p>
                  <p className="text-sm">Standard web use (PRIMARY)</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 p-4 bg-black/40 rounded-lg">
                <img src="/logo_64x64.png" alt="64px" className="w-8 h-8" />
                <div className="text-gray-300">
                  <p className="text-xl font-bold text-white">64×64px</p>
                  <p className="text-sm">Small contexts, buttons</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 p-4 bg-black/40 rounded-lg">
                <img src="/logo_32x32.png" alt="32px" className="w-4 h-4" />
                <div className="text-gray-300">
                  <p className="text-xl font-bold text-white">32×32px</p>
                  <p className="text-sm">Favicon, browser tabs (retina)</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 p-4 bg-black/40 rounded-lg">
                <img src="/logo_16x16.png" alt="16px" className="w-2 h-2" />
                <div className="text-gray-300">
                  <p className="text-xl font-bold text-white">16×16px</p>
                  <p className="text-sm">Smallest favicon size</p>
                </div>
              </div>
            </div>
          </Card>

          {/* CTA */}
          <div className="text-center py-12">
            <Button asChild size="lg" className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-bold">
              <Link href="/">View Logo on Live Site →</Link>
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}