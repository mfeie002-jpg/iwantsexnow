import Head from "next/head";
import Navigation from "@/components/Navigation";
import MobileNav from "@/components/MobileNav";
import { Download, Heart, Star, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LogoRedesigns() {
  return (
    <>
      <Head>
        <title>Logo Redesigns - Brand Exploration | iWantSexNow.ch</title>
        <meta name="description" content="Three complete brand redesign concepts for iWantSexNow.ch" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-gray-900 dark:via-purple-950 dark:to-pink-950">
        <Navigation />
        <MobileNav />

        <main className="container mx-auto px-4 py-24">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
              Brand Redesigns
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Three distinct visual identities exploring different facets of our brand
            </p>
          </div>

          {/* Concept 1: Minimalist Luxury */}
          <section className="mb-32">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-2xl">
              <div className="text-center mb-12">
                <span className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100 rounded-full text-sm font-bold mb-4">
                  Concept 1
                </span>
                <h2 className="text-4xl font-light mb-4 tracking-tight">Minimalist Luxury</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Sophisticated, refined, and unmistakably premium. This design speaks to discerning clients seeking elegance.
                </p>
              </div>

              {/* Primary Logo - Minimalist */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-950 rounded-2xl p-16 mb-8">
                <div className="flex flex-col items-center justify-center">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 blur-3xl opacity-30"></div>
                    <svg width="200" height="200" viewBox="0 0 200 200" className="relative">
                      {/* Minimalist Heart/Diamond Icon */}
                      <path
                        d="M100 40 L60 70 L60 130 L100 160 L140 130 L140 70 Z"
                        fill="none"
                        stroke="url(#gradient1)"
                        strokeWidth="2"
                        className="animate-pulse"
                      />
                      <path
                        d="M100 70 L80 90 L80 130 L100 145 L120 130 L120 90 Z"
                        fill="url(#gradient1)"
                        opacity="0.3"
                      />
                      <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: "#9333EA", stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: "#EC4899", stopOpacity: 1 }} />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <h3 className="text-5xl font-light tracking-widest mb-2">
                    <span className="text-gray-900 dark:text-white">iWant</span>
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-normal">SexNow</span>
                  </h3>
                  <p className="text-sm tracking-[0.3em] text-gray-500 dark:text-gray-400 font-light">.CH</p>
                </div>
              </div>

              {/* Variations */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* Monogram */}
                <Card className="p-8 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-purple-900 border-0">
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="35" fill="none" stroke="white" strokeWidth="1" opacity="0.3" />
                    <text x="40" y="50" textAnchor="middle" fill="white" fontSize="36" fontWeight="300" fontFamily="serif">
                      iS
                    </text>
                  </svg>
                  <p className="text-white text-xs mt-4 font-light tracking-wide">MONOGRAM</p>
                </Card>

                {/* Horizontal Layout */}
                <Card className="p-8 flex flex-col items-center justify-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-sm"></div>
                    <div className="text-left">
                      <p className="text-lg font-light leading-none text-gray-900 dark:text-white">iWantSexNow</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 tracking-wider">.CH</p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-xs mt-4 font-light tracking-wide">HORIZONTAL</p>
                </Card>

                {/* Badge */}
                <Card className="p-8 flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600 border-0">
                  <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center">
                    <Heart className="w-8 h-8 text-white" fill="white" />
                  </div>
                  <p className="text-white text-xs mt-4 font-light tracking-wide">BADGE</p>
                </Card>
              </div>

              {/* Color Palette */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <h4 className="text-sm font-light tracking-wider text-gray-500 dark:text-gray-400 mb-4">COLOR PALETTE</h4>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <div className="h-20 bg-gray-900 dark:bg-white rounded-lg mb-2"></div>
                    <p className="text-xs text-center font-mono text-gray-600 dark:text-gray-400">#0F0F0F</p>
                  </div>
                  <div className="flex-1">
                    <div className="h-20 bg-purple-600 rounded-lg mb-2"></div>
                    <p className="text-xs text-center font-mono text-gray-600 dark:text-gray-400">#9333EA</p>
                  </div>
                  <div className="flex-1">
                    <div className="h-20 bg-pink-600 rounded-lg mb-2"></div>
                    <p className="text-xs text-center font-mono text-gray-600 dark:text-gray-400">#EC4899</p>
                  </div>
                  <div className="flex-1">
                    <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2"></div>
                    <p className="text-xs text-center font-mono text-gray-600 dark:text-gray-400">#F5F5F5</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Concept 2: Bold & Confident */}
          <section className="mb-32">
            <div className="bg-gray-900 rounded-3xl p-12 shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-purple-500/10"></div>
              
              <div className="relative text-center mb-12">
                <span className="inline-block px-4 py-2 bg-red-500 text-white rounded-full text-sm font-bold mb-4">
                  Concept 2
                </span>
                <h2 className="text-4xl font-black mb-4 text-white tracking-tight">Bold & Confident</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Unapologetic, powerful, and direct. This design makes a statement with strong typography and fearless color.
                </p>
              </div>

              {/* Primary Logo - Bold */}
              <div className="bg-black rounded-2xl p-16 mb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-purple-600/20 to-pink-600/20"></div>
                <div className="relative flex flex-col items-center justify-center">
                  <div className="mb-8">
                    <svg width="120" height="120" viewBox="0 0 120 120">
                      {/* Bold Abstract Icon */}
                      <circle cx="60" cy="60" r="50" fill="url(#gradient2)" opacity="0.2" />
                      <path
                        d="M40 40 L80 40 L80 60 L60 60 L60 80 L40 80 Z"
                        fill="url(#gradient2)"
                        className="animate-pulse"
                      />
                      <circle cx="70" cy="50" r="15" fill="#EF4444" opacity="0.8" />
                      <defs>
                        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: "#EF4444", stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: "#A855F7", stopOpacity: 1 }} />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <h3 className="text-6xl md:text-7xl font-black tracking-tighter mb-2">
                    <span className="text-white">i</span>
                    <span className="bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">WANT</span>
                    <span className="text-white">SEX</span>
                  </h3>
                  <p className="text-4xl font-black text-red-500 tracking-wider">NOW</p>
                  <p className="text-lg tracking-[0.4em] text-gray-500 mt-2 font-bold">.CH</p>
                </div>
              </div>

              {/* Variations */}
              <div className="relative grid md:grid-cols-3 gap-6 mb-8">
                {/* Stacked */}
                <Card className="p-8 flex flex-col items-center justify-center bg-red-600 border-0">
                  <div className="text-center">
                    <p className="text-5xl font-black text-white leading-none mb-1">iWANT</p>
                    <p className="text-5xl font-black text-black leading-none mb-1">SEX</p>
                    <p className="text-5xl font-black text-white leading-none">NOW</p>
                  </div>
                  <p className="text-white text-xs mt-4 font-bold tracking-wide">STACKED</p>
                </Card>

                {/* Icon Only */}
                <Card className="p-8 flex flex-col items-center justify-center bg-purple-600 border-0">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center rotate-12 transform hover:rotate-0 transition-transform">
                    <Star className="w-12 h-12 text-purple-600" fill="currentColor" />
                  </div>
                  <p className="text-white text-xs mt-4 font-bold tracking-wide">ICON</p>
                </Card>

                {/* Minimal */}
                <Card className="p-8 flex flex-col items-center justify-center bg-white border-4 border-black">
                  <p className="text-4xl font-black text-black leading-none">iWSN</p>
                  <p className="text-xs text-gray-600 mt-2 font-bold tracking-wider">.CH</p>
                  <p className="text-black text-xs mt-4 font-bold tracking-wide">MINIMAL</p>
                </Card>
              </div>

              {/* Color Palette */}
              <div className="relative border-t border-gray-800 pt-8">
                <h4 className="text-sm font-bold tracking-wider text-gray-400 mb-4">COLOR PALETTE</h4>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <div className="h-20 bg-black rounded-lg mb-2 border-2 border-white"></div>
                    <p className="text-xs text-center font-mono text-gray-400">#000000</p>
                  </div>
                  <div className="flex-1">
                    <div className="h-20 bg-red-500 rounded-lg mb-2"></div>
                    <p className="text-xs text-center font-mono text-gray-400">#EF4444</p>
                  </div>
                  <div className="flex-1">
                    <div className="h-20 bg-purple-600 rounded-lg mb-2"></div>
                    <p className="text-xs text-center font-mono text-gray-400">#A855F7</p>
                  </div>
                  <div className="flex-1">
                    <div className="h-20 bg-white rounded-lg mb-2"></div>
                    <p className="text-xs text-center font-mono text-gray-400">#FFFFFF</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Concept 3: Swiss Precision */}
          <section className="mb-32">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-2xl">
              <div className="text-center mb-12">
                <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 rounded-full text-sm font-bold mb-4">
                  Concept 3
                </span>
                <h2 className="text-4xl font-bold mb-4 tracking-tight">Swiss Precision</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Geometric perfection meets Swiss design heritage. Clean, technical, and unmistakably Swiss.
                </p>
              </div>

              {/* Primary Logo - Swiss */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-16 mb-8 border-2 border-gray-200 dark:border-gray-700">
                <div className="flex flex-col items-center justify-center">
                  <div className="mb-8 relative">
                    <svg width="160" height="160" viewBox="0 0 160 160">
                      {/* Swiss Cross Inspired */}
                      <rect x="40" y="70" width="80" height="20" fill="#DC2626" />
                      <rect x="70" y="40" width="20" height="80" fill="#DC2626" />
                      
                      {/* Geometric Frame */}
                      <rect x="30" y="30" width="100" height="100" fill="none" stroke="#1F2937" strokeWidth="2" />
                      <rect x="35" y="35" width="90" height="90" fill="none" stroke="#1F2937" strokeWidth="1" opacity="0.3" />
                      
                      {/* Corner Markers */}
                      <circle cx="30" cy="30" r="3" fill="#DC2626" />
                      <circle cx="130" cy="30" r="3" fill="#DC2626" />
                      <circle cx="30" cy="130" r="3" fill="#DC2626" />
                      <circle cx="130" cy="130" r="3" fill="#DC2626" />
                    </svg>
                  </div>
                  <h3 className="text-4xl font-bold tracking-tight mb-1 text-gray-900 dark:text-white">
                    iWantSexNow
                  </h3>
                  <p className="text-sm tracking-[0.3em] text-red-600 font-bold">.CH</p>
                  <p className="text-xs tracking-wider text-gray-400 mt-2 font-mono">SWITZERLAND • HELVETICA</p>
                </div>
              </div>

              {/* Variations */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* Grid System */}
                <Card className="p-8 flex flex-col items-center justify-center bg-white dark:bg-gray-900 border-2 border-gray-900 dark:border-white">
                  <div className="grid grid-cols-3 gap-1 w-20 h-20">
                    <div className="bg-red-600"></div>
                    <div className="bg-gray-900 dark:bg-white"></div>
                    <div className="bg-red-600"></div>
                    <div className="bg-gray-900 dark:bg-white"></div>
                    <div className="bg-red-600"></div>
                    <div className="bg-gray-900 dark:bg-white"></div>
                    <div className="bg-red-600"></div>
                    <div className="bg-gray-900 dark:bg-white"></div>
                    <div className="bg-red-600"></div>
                  </div>
                  <p className="text-gray-900 dark:text-white text-xs mt-4 font-bold tracking-wide">GRID</p>
                </Card>

                {/* Typography Mark */}
                <Card className="p-8 flex flex-col items-center justify-center bg-red-600 border-0">
                  <div className="text-center">
                    <p className="text-6xl font-black text-white leading-none font-mono">i</p>
                    <div className="w-12 h-1 bg-white mx-auto my-2"></div>
                    <p className="text-xs text-white tracking-[0.3em] font-bold">WSNG.CH</p>
                  </div>
                  <p className="text-white text-xs mt-4 font-bold tracking-wide">TYPE</p>
                </Card>

                {/* Swiss Flag Inspired */}
                <Card className="p-8 flex flex-col items-center justify-center bg-gray-900 dark:bg-white border-0">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-red-600"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Crown className="w-10 h-10 text-red-600" />
                    </div>
                  </div>
                  <p className="text-white dark:text-gray-900 text-xs mt-4 font-bold tracking-wide">SWISS</p>
                </Card>
              </div>

              {/* Color Palette */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <h4 className="text-sm font-bold tracking-wider text-gray-500 dark:text-gray-400 mb-4">COLOR PALETTE</h4>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <div className="h-20 bg-gray-900 dark:bg-white rounded-lg mb-2 border border-gray-200 dark:border-gray-700"></div>
                    <p className="text-xs text-center font-mono text-gray-600 dark:text-gray-400">#1F2937</p>
                  </div>
                  <div className="flex-1">
                    <div className="h-20 bg-red-600 rounded-lg mb-2"></div>
                    <p className="text-xs text-center font-mono text-gray-600 dark:text-gray-400">#DC2626</p>
                  </div>
                  <div className="flex-1">
                    <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2 border border-gray-200 dark:border-gray-700"></div>
                    <p className="text-xs text-center font-mono text-gray-600 dark:text-gray-400">#F3F4F6</p>
                  </div>
                  <div className="flex-1">
                    <div className="h-20 bg-white dark:bg-gray-900 rounded-lg mb-2 border border-gray-200 dark:border-gray-700"></div>
                    <p className="text-xs text-center font-mono text-gray-600 dark:text-gray-400">#FFFFFF</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Comparison Table */}
          <section className="mb-16">
            <Card className="p-12 bg-white dark:bg-gray-800">
              <h2 className="text-3xl font-bold mb-8 text-center">Design Philosophy Comparison</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                      <th className="text-left py-4 px-6 font-bold text-gray-900 dark:text-white">Attribute</th>
                      <th className="text-left py-4 px-6 font-bold text-purple-600">Minimalist Luxury</th>
                      <th className="text-left py-4 px-6 font-bold text-red-500">Bold & Confident</th>
                      <th className="text-left py-4 px-6 font-bold text-red-600">Swiss Precision</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-4 px-6 font-medium">Target Audience</td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">High-end, sophisticated</td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">Modern, confident</td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">Professional, precise</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-4 px-6 font-medium">Typography</td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">Light, spacious</td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">Black, condensed</td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">Bold, geometric</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-4 px-6 font-medium">Color Approach</td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">Subtle gradients</td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">High contrast</td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">Limited palette</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-4 px-6 font-medium">Emotional Tone</td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">Elegant, refined</td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">Powerful, direct</td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">Trustworthy, technical</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-medium">Best For</td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">Premium positioning</td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">Bold marketing</td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">Swiss market focus</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </section>

          {/* CTA */}
          <div className="text-center">
            <div className="inline-flex gap-4">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Download className="w-5 h-5 mr-2" />
                Download All Concepts
              </Button>
              <Button size="lg" variant="outline">
                Schedule Review Call
              </Button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Each concept includes full brand guidelines and asset packages
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800 mt-24 py-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              © 2025 iWantSexNow.ch - Brand Exploration & Design Concepts
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}