import { Card } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";

export default function LogoConcepts() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <SEO 
        title="Alternative Logo Concepts - iWantSexNow.ch"
        description="Explore 5 different logo design concepts for iWantSexNow.ch"
      />

      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black sticky top-0 z-50 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/logo-redesigns" className="flex items-center gap-3 group">
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
              <span className="text-xl font-light tracking-tight text-gray-900 dark:text-white">
                Alternative Logo Concepts
              </span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-16 max-w-7xl">
        
        {/* Intro */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900 dark:text-white mb-4">
            Five Design Directions
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-light">
            Exploring alternative visual identities for iWantSexNow.ch. Each concept offers a unique approach to balancing discretion, sophistication, and modern Swiss design principles.
          </p>
        </div>

        {/* Concept 1: Minimalist Wordmark */}
        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-2">Concept 1: Minimalist Wordmark</h2>
            <p className="text-gray-600 dark:text-gray-400">Ultra-clean typography with subtle gradient accent. Swiss typography meets modern tech aesthetic.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Desktop with .ch */}
            <Card className="p-6 bg-gray-900 border-gray-800">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-950 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="text-2xl font-black text-white tracking-tighter mb-1">
                    <span className="bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent">iWantSex</span>
                    <span className="text-white">Now</span>
                  </div>
                  <div className="text-xs text-gray-400 tracking-widest font-bold">.CH</div>
                </div>
              </div>
              <div className="text-sm text-gray-400">Desktop / with .ch</div>
            </Card>

            {/* Desktop without .ch */}
            <Card className="p-6 bg-gray-900 border-gray-800">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-950 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="text-2xl font-black text-white tracking-tighter">
                    <span className="bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent">iWantSex</span>
                    <span className="text-white">Now</span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-400">Desktop / no extension</div>
            </Card>

            {/* Mobile Compact */}
            <Card className="p-6 bg-gray-900 border-gray-800">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-950 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="text-lg font-black text-white tracking-tighter">
                    <span className="bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent">iWSN</span>
                  </div>
                  <div className="text-[8px] text-gray-400 tracking-wider font-bold">.CH</div>
                </div>
              </div>
              <div className="text-sm text-gray-400">Mobile / compact</div>
            </Card>

            {/* Icon/Favicon */}
            <Card className="p-6 bg-gray-900 border-gray-800">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-950 rounded-lg flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl font-black text-white">i</span>
                </div>
              </div>
              <div className="text-sm text-gray-400">Icon / favicon</div>
            </Card>
          </div>
        </section>

        {/* Concept 2: Abstract Initial */}
        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-2">Concept 2: Abstract Initial "I"</h2>
            <p className="text-gray-600 dark:text-gray-400">Flowing geometric letterform suggesting both identity and intimacy through negative space.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Desktop with .ch */}
            <Card className="p-6 bg-gray-900 border-gray-800">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-950 rounded-lg flex items-center justify-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500 via-pink-500 to-amber-500 rounded-lg opacity-90" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-gray-950 rounded" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white tracking-tight leading-tight">iWantSexNow</div>
                    <div className="text-[10px] text-gray-400 tracking-wider">.CH</div>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-400">Desktop / with .ch</div>
            </Card>

            {/* Desktop without .ch */}
            <Card className="p-6 bg-gray-900 border-gray-800">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-950 rounded-lg flex items-center justify-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500 via-pink-500 to-amber-500 rounded-lg opacity-90" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-gray-950 rounded" />
                    </div>
                  </div>
                  <div className="text-sm font-bold text-white tracking-tight">iWantSexNow</div>
                </div>
              </div>
              <div className="text-sm text-gray-400">Desktop / no extension</div>
            </Card>

            {/* Mobile Compact */}
            <Card className="p-6 bg-gray-900 border-gray-800">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-950 rounded-lg flex items-center justify-center mb-4">
                <div className="w-16 h-16 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500 via-pink-500 to-amber-500 rounded-lg opacity-90" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-gray-950 rounded" />
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-400">Mobile / icon only</div>
            </Card>

            {/* Icon/Favicon */}
            <Card className="p-6 bg-gray-900 border-gray-800">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-950 rounded-lg flex items-center justify-center mb-4">
                <div className="w-16 h-16 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500 via-pink-500 to-amber-500 rounded-lg opacity-90" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-gray-950 rounded" />
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-400">Icon / favicon</div>
            </Card>
          </div>
        </section>

        {/* Concept 3: Geometric Hexagon */}
        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-2">Concept 3: Swiss Hexagon</h2>
            <p className="text-gray-600 dark:text-gray-400">Angular precision with warm gradient. Geometric perfection meets passionate energy.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Desktop with .ch */}
            <Card className="p-6 bg-gray-900 border-gray-800">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-950 rounded-lg flex items-center justify-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <defs>
                        <linearGradient id="hex1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f43f5e" />
                          <stop offset="50%" stopColor="#ec4899" />
                          <stop offset="100%" stopColor="#f59e0b" />
                        </linearGradient>
                      </defs>
                      <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="url(#hex1)" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white tracking-tight leading-tight">iWantSexNow</div>
                    <div className="text-[10px] text-gray-400 tracking-wider">.CH</div>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-400">Desktop / with .ch</div>
            </Card>

            {/* Desktop without .ch */}
            <Card className="p-6 bg-gray-900 border-gray-800">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-950 rounded-lg flex items-center justify-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <defs>
                        <linearGradient id="hex2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f43f5e" />
                          <stop offset="50%" stopColor="#ec4899" />
                          <stop offset="100%" stopColor="#f59e0b" />
                        </linearGradient>
                      </defs>
                      <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="url(#hex2)" />
                    </svg>
                  </div>
                  <div className="text-sm font-bold text-white tracking-tight">iWantSexNow</div>
                </div>
              </div>
              <div className="text-sm text-gray-400">Desktop / no extension</div>
            </Card>

            {/* Mobile Compact */}
            <Card className="p-6 bg-gray-900 border-gray-800">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-950 rounded-lg flex items-center justify-center mb-4">
                <div className="relative w-16 h-16">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                      <linearGradient id="hex3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f43f5e" />
                        <stop offset="50%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                    <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="url(#hex3)" />
                  </svg>
                </div>
              </div>
              <div className="text-sm text-gray-400">Mobile / icon only</div>
            </Card>

            {/* Icon/Favicon */}
            <Card className="p-6 bg-gray-900 border-gray-800">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-950 rounded-lg flex items-center justify-center mb-4">
                <div className="relative w-16 h-16">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                      <linearGradient id="hex4" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f43f5e" />
                        <stop offset="50%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                    <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="url(#hex4)" />
                  </svg>
                </div>
              </div>
              <div className="text-sm text-gray-400">Icon / favicon</div>
            </Card>
          </div>
        </section>

        {/* Concept 4: Flowing Curves */}
        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-2">Concept 4: Organic Waves</h2>
            <p className="text-gray-600 dark:text-gray-400">Sensual curved forms suggesting connection and desire through fluid movement.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Desktop with .ch */}
            <Card className="p-6 bg-gray-900 border-gray-800">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-950 rounded-lg flex items-center justify-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <defs>
                        <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f43f5e" />
                          <stop offset="50%" stopColor="#ec4899" />
                          <stop offset="100%" stopColor="#f59e0b" />
                        </linearGradient>
                      </defs>
                      <path d="M20 50 Q35 20, 50 50 T80 50" stroke="url(#wave1)" strokeWidth="12" fill="none" strokeLinecap="round"/>
                      <path d="M20 60 Q35 80, 50 50 T80 60" stroke="url(#wave1)" strokeWidth="12" fill="none" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white tracking-tight leading-tight">iWantSexNow</div>
                    <div className="text-[10px] text-gray-400 tracking-wider">.CH</div>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-400">Desktop / with .ch</div>
            </Card>

            {/* Desktop without .ch */}
            <Card className="p-6 bg-gray-900 border-gray-800">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-950 rounded-lg flex items-center justify-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <defs>
                        <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f43f5e" />
                          <stop offset="50%" stopColor="#ec4899" />
                          <stop offset="100%" stopColor="#f59e0b" />
                        </linearGradient>
                      </defs>
                      <path d="M20 50 Q35 20, 50 50 T80 50" stroke="url(#wave2)" strokeWidth="12" fill="none" strokeLinecap="round"/>
                      <path d="M20 60 Q35 80, 50 50 T80 60" stroke="url(#wave2)" strokeWidth="12" fill="none" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="text-sm font-bold text-white tracking-tight">iWantSexNow</div>
                </div>
              </div>
              <div className="text-sm text-gray-400">Desktop / no extension</div>
            </Card>

            {/* Mobile Compact */}
            <Card className="p-6 bg-gray-900 border-gray-800">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-950 rounded-lg flex items-center justify-center mb-4">
                <div className="relative w-16 h-16">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                      <linearGradient id="wave3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f43f5e" />
                        <stop offset="50%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                    <path d="M20 50 Q35 20, 50 50 T80 50" stroke="url(#wave3)" strokeWidth="12" fill="none" strokeLinecap="round"/>
                    <path d="M20 60 Q35 80, 50 50 T80 60" stroke="url(#wave3)" strokeWidth="12" fill="none" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <div className="text-sm text-gray-400">Mobile / icon only</div>
            </Card>

            {/* Icon/Favicon */}
            <Card className="p-6 bg-gray-900 border-gray-800">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-950 rounded-lg flex items-center justify-center mb-4">
                <div className="relative w-16 h-16">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                      <linearGradient id="wave4" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f43f5e" />
                        <stop offset="50%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                    <path d="M20 50 Q35 20, 50 50 T80 50" stroke="url(#wave4)" strokeWidth="12" fill="none" strokeLinecap="round"/>
                    <path d="M20 60 Q35 80, 50 50 T80 60" stroke="url(#wave4)" strokeWidth="12" fill="none" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <div className="text-sm text-gray-400">Icon / favicon</div>
            </Card>
          </div>
        </section>

        {/* Concept 5: Monogram */}
        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-2">Concept 5: ISN Monogram</h2>
            <p className="text-gray-600 dark:text-gray-400">Interlocking letterforms creating a sophisticated badge. Luxury meets discretion.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Desktop with .ch */}
            <Card className="p-6 bg-gray-900 border-gray-800">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-950 rounded-lg flex items-center justify-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 via-pink-500 to-amber-500 flex items-center justify-center border-2 border-white/10">
                    <span className="text-xl font-black text-white tracking-tighter">ISN</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white tracking-tight leading-tight">iWantSexNow</div>
                    <div className="text-[10px] text-gray-400 tracking-wider">.CH</div>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-400">Desktop / with .ch</div>
            </Card>

            {/* Desktop without .ch */}
            <Card className="p-6 bg-gray-900 border-gray-800">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-950 rounded-lg flex items-center justify-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 via-pink-500 to-amber-500 flex items-center justify-center border-2 border-white/10">
                    <span className="text-xl font-black text-white tracking-tighter">ISN</span>
                  </div>
                  <div className="text-sm font-bold text-white tracking-tight">iWantSexNow</div>
                </div>
              </div>
              <div className="text-sm text-gray-400">Desktop / no extension</div>
            </Card>

            {/* Mobile Compact */}
            <Card className="p-6 bg-gray-900 border-gray-800">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-950 rounded-lg flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 via-pink-500 to-amber-500 flex items-center justify-center border-2 border-white/10">
                  <span className="text-2xl font-black text-white tracking-tighter">ISN</span>
                </div>
              </div>
              <div className="text-sm text-gray-400">Mobile / icon only</div>
            </Card>

            {/* Icon/Favicon */}
            <Card className="p-6 bg-gray-900 border-gray-800">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-950 rounded-lg flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 via-pink-500 to-amber-500 flex items-center justify-center border-2 border-white/10">
                  <span className="text-2xl font-black text-white tracking-tighter">ISN</span>
                </div>
              </div>
              <div className="text-sm text-gray-400">Icon / favicon</div>
            </Card>
          </div>
        </section>

        {/* Comparison Note */}
        <div className="mt-20 p-8 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-4">Design Considerations</h3>
          <div className="grid md:grid-cols-2 gap-8 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Versatility</h4>
              <p>Each concept works across all required formats (desktop, mobile, favicon, icon) while maintaining brand recognition at any size.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Discretion</h4>
              <p>All designs avoid explicit imagery, using abstraction and sophistication to communicate purpose while remaining appropriate for public contexts.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Swiss Design Influence</h4>
              <p>Clean geometry, precise execution, and restrained elegance reflect Swiss design principles adapted for modern digital contexts.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Brand Warmth</h4>
              <p>The rose-to-amber gradient palette conveys passion and desire while maintaining premium aesthetic standards.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link href="/logo-redesigns">
            <Button size="lg" variant="outline" className="border-gray-300 dark:border-gray-700">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Current Logo Assets
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}