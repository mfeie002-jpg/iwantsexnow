import { Card } from "@/components/ui/card";
import SEO from "@/components/SEO";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";

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
      { file: 'logo_monochrome_white.png', name: 'iWantSexNow-monochrome-white.png' },
      { file: 'logo_monochrome_black.png', name: 'iWantSexNow-monochrome-black.png' },
      { file: '9d4e92fe-6caa-40e2-a75b-d159fbcf8c21.png', name: 'iWantSexNow-full-lockup.png' }
    ];

    files.forEach((item, index) => {
      setTimeout(() => {
        handleDownload(item.file, item.name);
      }, index * 500);
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <SEO 
        title="Brand Assets - iWantSexNow.ch"
        description="Official logo assets and brand guidelines for iWantSexNow.ch"
      />

      {/* Minimalist Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black sticky top-0 z-50 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-4 group">
              <img 
                src="/logo_64x64.png" 
                alt="iWantSexNow.ch" 
                className="w-8 h-8 transition-transform group-hover:scale-110"
              />
              <span className="text-xl font-light tracking-tight text-gray-900 dark:text-white">
                Brand Assets
              </span>
            </Link>
            <Button 
              onClick={handleDownloadAll}
              variant="outline"
              className="border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <Download size={16} className="mr-2" />
              Download All
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-16 max-w-6xl">
        
        {/* Hero Section */}
        <div className="mb-20 text-center">
          <div className="mb-8 flex justify-center">
            <img 
              src="/logo_256x256.png" 
              alt="iWantSexNow.ch Logo" 
              className="w-32 h-32"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-light tracking-tight text-gray-900 dark:text-white mb-4">
            iWantSexNow.ch
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 font-light max-w-2xl mx-auto">
            A contemporary geometric mark embodying discretion, sophistication, and modern Swiss design principles.
          </p>
        </div>

        {/* Design Philosophy */}
        <section className="mb-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-6">Design Philosophy</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                The iWantSexNow.ch logo system centers on a <strong className="text-gray-900 dark:text-white font-medium">geometric heart mark</strong> – 
                a refined symbol that balances emotional resonance with mathematical precision. Drawing from Swiss design traditions 
                of clarity and restraint, the mark avoids explicit imagery in favor of sophisticated abstraction.
              </p>
              <p>
                The color palette employs <strong className="text-gray-900 dark:text-white font-medium">warm gradients</strong> from 
                rose through coral to amber, conveying passion and desire while maintaining elegance. This approach ensures the 
                brand communicates its purpose with confidence yet remains appropriate for public-facing contexts.
              </p>
            </div>
          </div>
        </section>

        {/* Primary Assets Grid */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-8">Primary Logo Mark</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Full Color on Dark */}
            <Card className="p-8 bg-gray-900 border-gray-800">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-950 rounded-lg flex items-center justify-center mb-6">
                <img 
                  src="/logo_256x256.png" 
                  alt="Full Color Logo" 
                  className="w-40 h-40"
                />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Full Color – Dark Backgrounds</h3>
              <p className="text-sm text-gray-400 mb-4">
                Primary version for website headers, navigation, and digital applications on dark surfaces.
              </p>
              <Button 
                onClick={() => handleDownload('logo_256x256.png', 'iWantSexNow-logo-color-dark.png')}
                variant="outline"
                size="sm"
                className="w-full border-gray-700 text-white hover:bg-gray-800"
              >
                <Download size={14} className="mr-2" />
                Download PNG (256px)
              </Button>
            </Card>

            {/* Monochrome White */}
            <Card className="p-8 bg-gray-900 border-gray-800">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-950 rounded-lg flex items-center justify-center mb-6">
                <img 
                  src="/logo_monochrome_white.png" 
                  alt="White Logo" 
                  className="w-40 h-40"
                />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Monochrome White</h3>
              <p className="text-sm text-gray-400 mb-4">
                For video overlays, watermarks, and contexts where single-color reproduction is required.
              </p>
              <Button 
                onClick={() => handleDownload('logo_monochrome_white.png', 'iWantSexNow-logo-white.png')}
                variant="outline"
                size="sm"
                className="w-full border-gray-700 text-white hover:bg-gray-800"
              >
                <Download size={14} className="mr-2" />
                Download PNG
              </Button>
            </Card>

            {/* Monochrome Black */}
            <Card className="p-8 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <div className="aspect-square bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center mb-6 border border-gray-200 dark:border-gray-700">
                <img 
                  src="/logo_monochrome_black.png" 
                  alt="Black Logo" 
                  className="w-40 h-40"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Monochrome Black</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                For light backgrounds, print materials, invoices, and official documentation.
              </p>
              <Button 
                onClick={() => handleDownload('logo_monochrome_black.png', 'iWantSexNow-logo-black.png')}
                variant="outline"
                size="sm"
                className="w-full border-gray-300 dark:border-gray-700"
              >
                <Download size={14} className="mr-2" />
                Download PNG
              </Button>
            </Card>

            {/* Full Lockup */}
            <Card className="p-8 bg-gray-900 border-gray-800">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-950 rounded-lg flex items-center justify-center mb-6 p-8">
                <img 
                  src="/9d4e92fe-6caa-40e2-a75b-d159fbcf8c21.png" 
                  alt="Full Lockup" 
                  className="w-full h-auto"
                />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Complete Lockup</h3>
              <p className="text-sm text-gray-400 mb-4">
                Logo mark with full wordmark for marketing materials and brand presentations.
              </p>
              <Button 
                onClick={() => handleDownload('9d4e92fe-6caa-40e2-a75b-d159fbcf8c21.png', 'iWantSexNow-full-lockup.png')}
                variant="outline"
                size="sm"
                className="w-full border-gray-700 text-white hover:bg-gray-800"
              >
                <Download size={14} className="mr-2" />
                Download PNG
              </Button>
            </Card>
          </div>
        </section>

        {/* Size Reference */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-8">Available Sizes</h2>
          
          <Card className="p-8 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <div className="space-y-4">
              {[
                { size: '512×512', file: 'logo_512x512.png', use: 'High-resolution web, app icons, Android Chrome' },
                { size: '256×256', file: 'logo_256x256.png', use: 'Standard web use, PWA icons, retina displays' },
                { size: '128×128', file: 'logo_128x128.png', use: 'Website headers, navigation (recommended)', recommended: true },
                { size: '64×64', file: 'logo_64x64.png', use: 'Compact layouts, buttons, small contexts' },
                { size: '32×32', file: 'logo_32x32.png', use: 'Favicons, browser tabs' },
                { size: '16×16', file: 'logo_16x16.png', use: 'Smallest favicon, legacy support' }
              ].map((item) => (
                <div 
                  key={item.size}
                  className={`flex items-center gap-6 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    item.recommended ? 'border-2 border-green-500/20 bg-green-500/5' : ''
                  }`}
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded">
                    <img 
                      src={`/${item.file}`} 
                      alt={`${item.size} logo`}
                      className="max-w-full max-h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">{item.size}px</span>
                      {item.recommended && (
                        <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-600 dark:text-green-400 rounded-full font-medium">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{item.use}</p>
                  </div>
                  <Button
                    onClick={() => handleDownload(item.file, `iWantSexNow-logo-${item.size}.png`)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 dark:text-gray-400"
                  >
                    <Download size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Usage Guidelines */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-8">Usage Guidelines</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-medium text-green-600 dark:text-green-400 mb-6 flex items-center gap-2">
                <span className="text-2xl">✓</span>
                Best Practices
              </h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                  <span>Maintain square aspect ratio (1:1) at all times</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                  <span>Ensure minimum clear space around logo (1/4 of logo height)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                  <span>Use full color version on dark backgrounds only</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                  <span>Apply subtle hover states (scale: 1.05-1.1) for interactivity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                  <span>Use 128×128px for standard web header implementation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                  <span>Ensure sufficient contrast with background (WCAG AA)</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-medium text-red-600 dark:text-red-400 mb-6 flex items-center gap-2">
                <span className="text-2xl">✗</span>
                Avoid These
              </h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                  <span>Never distort, stretch, or skew the logo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                  <span>Don't use full color on light or busy backgrounds</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                  <span>Avoid rotating logo to arbitrary angles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                  <span>Don't alter colors, gradients, or add effects</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                  <span>Never add outlines, shadows, or embellishments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                  <span>Avoid placing on cluttered or low-contrast backgrounds</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Live Example - EXPANDED */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-8">Logo in Context</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-3xl">
            See how the logo adapts across different platforms and use cases, maintaining consistency while fitting seamlessly into various design contexts.
          </p>
          
          <div className="space-y-8">
            
            {/* Website Header */}
            <Card className="overflow-hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <div className="bg-gradient-to-b from-gray-900 to-black p-6 border-b border-gray-800">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                  <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative">
                      <img 
                        src="/logo_128x128.png" 
                        alt="iWantSexNow.ch" 
                        className="w-12 h-12 transition-transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-rose-400/10 blur-xl group-hover:bg-rose-400/20 transition-all rounded-lg" />
                    </div>
                    <div>
                      <span className="text-2xl font-black text-white tracking-tight">
                        iWantSexNow.ch
                      </span>
                      <div className="text-xs text-gray-400 font-semibold tracking-wider">
                        WHERE DESIRE MEETS DISCRETION
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" className="text-white hover:text-rose-400">
                      Browse
                    </Button>
                    <Button className="bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold hover:shadow-lg hover:shadow-rose-500/50">
                      Join Free
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-800/50">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  <strong className="text-gray-900 dark:text-white">Desktop Navigation</strong> — Logo at 128×128px with glow effect on hover
                </p>
              </div>
            </Card>

            {/* Mobile App Interface */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="overflow-hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <div className="bg-black p-4">
                  <div className="max-w-[375px] mx-auto">
                    <div className="flex items-center justify-between mb-6">
                      <img 
                        src="/logo_64x64.png" 
                        alt="App Icon" 
                        className="w-10 h-10"
                      />
                      <div className="flex gap-2">
                        <div className="w-8 h-8 bg-gray-800 rounded-full" />
                        <div className="w-8 h-8 bg-gray-800 rounded-full" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-gray-900 rounded-lg p-4 h-20" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    <strong className="text-gray-900 dark:text-white">Mobile App</strong> — 64×64px in navigation bar
                  </p>
                </div>
              </Card>

              <Card className="overflow-hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <div className="bg-gradient-to-br from-gray-900 to-black p-8">
                  <div className="text-center">
                    <img 
                      src="/logo_256x256.png" 
                      alt="Splash Screen" 
                      className="w-32 h-32 mx-auto mb-4"
                    />
                    <div className="text-white text-2xl font-bold tracking-tight">
                      iWantSexNow.ch
                    </div>
                    <div className="text-gray-400 text-xs mt-2 tracking-widest">
                      LOADING YOUR EXPERIENCE
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    <strong className="text-gray-900 dark:text-white">App Splash Screen</strong> — 256×256px centered
                  </p>
                </div>
              </Card>
            </div>

            {/* Social Media Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Profile Picture */}
              <Card className="overflow-hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-8">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-xl">
                    <img 
                      src="/logo_256x256.png" 
                      alt="Profile Picture" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    <strong className="text-gray-900 dark:text-white">Social Profile</strong> — 256×256px circular crop
                  </p>
                </div>
              </Card>

              {/* Instagram Story */}
              <Card className="overflow-hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <div className="bg-gradient-to-b from-rose-600 to-pink-600 p-8 aspect-[9/16] flex items-center justify-center">
                  <div className="text-center">
                    <img 
                      src="/logo_monochrome_white.png" 
                      alt="Story Logo" 
                      className="w-20 h-20 mx-auto mb-4 opacity-90"
                    />
                    <div className="text-white text-sm font-bold tracking-wider">
                      SWIPE UP
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    <strong className="text-gray-900 dark:text-white">Instagram Story</strong> — White monochrome
                  </p>
                </div>
              </Card>

              {/* Video Watermark */}
              <Card className="overflow-hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <div className="bg-gray-900 p-8 aspect-video relative">
                  <div className="absolute top-4 right-4">
                    <img 
                      src="/logo_monochrome_white.png" 
                      alt="Watermark" 
                      className="w-12 h-12 opacity-70"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    <strong className="text-gray-900 dark:text-white">Video Watermark</strong> — 64×64px, 70% opacity
                  </p>
                </div>
              </Card>
            </div>

            {/* Print Materials */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Business Card */}
              <Card className="overflow-hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <div className="bg-white dark:bg-gray-900 p-8 border border-gray-200 dark:border-gray-800 m-4">
                  <div className="aspect-[3.5/2] bg-gradient-to-br from-gray-900 to-black rounded-lg p-6 flex flex-col justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src="/logo_128x128.png" 
                        alt="Business Card Logo" 
                        className="w-12 h-12"
                      />
                      <div>
                        <div className="text-white font-bold text-lg">iWantSexNow.ch</div>
                        <div className="text-gray-400 text-xs tracking-wider">Premium Companions</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-sm">+41 XX XXX XX XX</div>
                      <div className="text-gray-400 text-xs">contact@iwantsexnow.ch</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    <strong className="text-gray-900 dark:text-white">Business Card</strong> — 128×128px full color
                  </p>
                </div>
              </Card>

              {/* Email Signature */}
              <Card className="overflow-hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <div className="bg-gray-50 dark:bg-gray-800 p-8 m-4 rounded border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-4">
                    <img 
                      src="/logo_64x64.png" 
                      alt="Email Signature" 
                      className="w-16 h-16 flex-shrink-0"
                    />
                    <div className="border-l-2 border-rose-500 pl-4">
                      <div className="font-bold text-gray-900 dark:text-white">Emma Laurent</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Customer Relations</div>
                      <div className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        iWantSexNow.ch
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        contact@iwantsexnow.ch | +41 XX XXX XX XX
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    <strong className="text-gray-900 dark:text-white">Email Signature</strong> — 64×64px with border accent
                  </p>
                </div>
              </Card>
            </div>

            {/* Browser & System */}
            <Card className="overflow-hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <div className="bg-gray-100 dark:bg-gray-800 p-6">
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
                  {/* Browser Chrome */}
                  <div className="bg-gray-200 dark:bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-300 dark:border-gray-700">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 bg-white dark:bg-gray-900 rounded px-3 py-1 text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <img 
                        src="/logo_32x32.png" 
                        alt="Favicon" 
                        className="w-4 h-4"
                      />
                      <span>iWantSexNow.ch — Premium Escort Services</span>
                    </div>
                  </div>
                  {/* Browser Content */}
                  <div className="bg-white dark:bg-gray-900 p-8 text-center">
                    <img 
                      src="/logo_128x128.png" 
                      alt="Page Logo" 
                      className="w-20 h-20 mx-auto mb-4"
                    />
                    <div className="text-gray-400 text-sm">Browser preview with 32×32px favicon</div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  <strong className="text-gray-900 dark:text-white">Browser Tab</strong> — 16×16px and 32×32px favicons for crisp display
                </p>
              </div>
            </Card>

          </div>
        </section>

        {/* Download CTA */}
        <div className="text-center py-12">
          <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-4">
            Ready to use these assets?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Download the complete logo pack including all sizes and variations in PNG format with transparent backgrounds.
          </p>
          <Button 
            onClick={handleDownloadAll}
            size="lg"
            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
          >
            <Download size={20} className="mr-2" />
            Download Complete Logo Pack
          </Button>
        </div>

      </div>

      {/* Minimal Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 mt-20">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
            © 2025 iWantSexNow.ch — All brand assets are proprietary and protected.
          </p>
        </div>
      </footer>
    </div>
  );
}