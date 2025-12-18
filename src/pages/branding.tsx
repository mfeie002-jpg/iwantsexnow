import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Lock, Infinity, Smile, Sun, Compass, Check } from "lucide-react";
import Link from "next/link";

export default function Branding() {
  const [selectedLogo, setSelectedLogo] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState(0);

  const logoOptions = [
    {
      name: "Heart Lock",
      icon: Lock,
      description: "Exclusive and intimate - unlock desires",
      tagline: "Unlock Your Desires",
      iconStyle: ""
    },
    {
      name: "Infinity Hearts",
      icon: Infinity,
      description: "Endless connections and possibilities",
      tagline: "Endless Possibilities",
      iconStyle: ""
    },
    {
      name: "Lips Kiss",
      icon: Smile,
      description: "Bold and direct - where attraction begins",
      tagline: "Where Attraction Begins",
      iconStyle: ""
    },
    {
      name: "Rising Sun",
      icon: Sun,
      description: "Fresh starts and new beginnings daily",
      tagline: "New Beginnings Daily",
      iconStyle: ""
    },
    {
      name: "Compass Rose",
      icon: Compass,
      description: "Navigate to find your perfect match",
      tagline: "Find Your Match",
      iconStyle: ""
    }
  ];

  const colorThemes = [
    {
      name: "Emerald & Teal Luxe",
      description: "Sophisticated and premium - luxury positioning",
      primary: "#059669",
      secondary: "#14B8A6",
      accent: "#10B981",
      background: "from-emerald-50 via-white to-teal-50",
      gradient: "from-emerald-600 to-teal-600",
      sample: "Deep, rich jewel tones that convey sophistication and exclusivity"
    },
    {
      name: "Coral & Peach Sunset",
      description: "Warm, inviting, and approachable",
      primary: "#FF6B6B",
      secondary: "#FFB347",
      accent: "#FF8B94",
      background: "from-orange-50 via-white to-pink-50",
      gradient: "from-orange-500 to-pink-500",
      sample: "Warm sunset colors that feel friendly and welcoming"
    },
    {
      name: "Slate & Rose Gold",
      description: "Modern, elegant, and refined",
      primary: "#64748B",
      secondary: "#B76E79",
      accent: "#E9967A",
      background: "from-slate-50 via-white to-rose-50",
      gradient: "from-slate-600 to-rose-400",
      sample: "Contemporary elegance with metallic sophistication"
    },
    {
      name: "Magenta & Lime Pop",
      description: "Energetic, youthful, and attention-grabbing",
      primary: "#D946EF",
      secondary: "#84CC16",
      accent: "#EC4899",
      background: "from-fuchsia-50 via-white to-lime-50",
      gradient: "from-fuchsia-600 to-lime-500",
      sample: "Bold neon vibes - impossible to ignore, full of energy"
    },
    {
      name: "Navy & Gold Premium",
      description: "Exclusive, trustworthy, and high-end",
      primary: "#1E3A8A",
      secondary: "#D97706",
      accent: "#3B82F6",
      background: "from-blue-50 via-white to-amber-50",
      gradient: "from-blue-900 to-amber-600",
      sample: "Premium positioning with trust and exclusivity"
    },
    {
      name: "Turquoise & Tangerine",
      description: "Playful, tropical, and exciting",
      primary: "#06B6D4",
      secondary: "#F97316",
      accent: "#22D3EE",
      background: "from-cyan-50 via-white to-orange-50",
      gradient: "from-cyan-600 to-orange-600",
      sample: "Tropical vacation vibes - fun, adventurous, and carefree"
    }
  ];

  const Logo = logoOptions[selectedLogo];
  const theme = colorThemes[selectedTheme];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="text-pink-600 fill-pink-600" size={32} />
            <span className="text-2xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              iWantSexNow.ch
            </span>
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-pink-600 to-purple-600 border-0 text-lg px-6 py-2">
              New Design Options
            </Badge>
            <h1 className="text-5xl font-black mb-4">Brand Identity Concepts</h1>
            <p className="text-xl text-gray-600">
              5 completely different design directions - choose your perfect match
            </p>
          </div>

          {/* Live Preview */}
          <Card className={`p-12 mb-12 bg-gradient-to-br ${theme.background} border-4`}>
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col items-center gap-6 mb-8">
                <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform`}>
                  <Logo.icon size={56} className={`text-white ${Logo.iconStyle}`} />
                </div>
                <div className="text-center">
                  <h2 className={`text-6xl font-black bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent mb-3`}>
                    iWantSexNow.ch
                  </h2>
                  <p className="text-2xl font-bold text-gray-700">{Logo.tagline}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <Button size="lg" className={`bg-gradient-to-r ${theme.gradient} hover:opacity-90 text-lg h-14 shadow-lg`}>
                  Join Now - It's Free
                </Button>
                <Button size="lg" variant="outline" className="text-lg h-14 border-2">
                  Browse Members
                </Button>
              </div>

              <div className="mt-8 grid md:grid-cols-4 gap-4">
                <Card className="p-4 bg-white/80 backdrop-blur">
                  <div className="text-center">
                    <div className={`text-3xl font-black bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                      50K+
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Members</div>
                  </div>
                </Card>
                <Card className="p-4 bg-white/80 backdrop-blur">
                  <Badge className={`bg-gradient-to-r ${theme.gradient} border-0 w-full justify-center h-10 text-base`}>
                    Online Now
                  </Badge>
                </Card>
                <Card className="p-4 bg-white/80 backdrop-blur">
                  <div className={`w-full h-10 rounded-full bg-gradient-to-r ${theme.gradient} shadow-inner`}></div>
                </Card>
                <Card className="p-4 bg-white/80 backdrop-blur">
                  <div className="flex items-center justify-center gap-2">
                    <Logo.icon size={24} className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`} />
                    <span className="font-bold text-gray-700">Icon</span>
                  </div>
                </Card>
              </div>
            </div>
          </Card>

          {/* Design Direction Cards */}
          <div className="mb-12">
            <h2 className="text-3xl font-black mb-6 text-center">Choose Your Logo Design</h2>
            <p className="text-center text-gray-600 mb-8">Each logo represents a different brand personality</p>
            <div className="grid md:grid-cols-5 gap-4">
              {logoOptions.map((logo, index) => (
                <Card
                  key={index}
                  className={`p-6 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 ${
                    selectedLogo === index ? "ring-4 ring-pink-600 shadow-2xl scale-105" : ""
                  }`}
                  onClick={() => setSelectedLogo(index)}
                >
                  <div className="text-center space-y-3">
                    <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-lg`}>
                      <logo.icon size={40} className={`text-white ${logo.iconStyle}`} />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">{logo.name}</h3>
                      <p className="text-xs text-gray-600 leading-tight mb-2">{logo.description}</p>
                      <p className="text-xs font-medium text-pink-600">"{logo.tagline}"</p>
                    </div>
                    {selectedLogo === index && (
                      <Badge className="bg-pink-600 border-0 w-full justify-center">
                        <Check size={14} className="mr-1" />
                        Selected
                      </Badge>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Color Themes */}
          <div>
            <h2 className="text-3xl font-black mb-6 text-center">Choose Your Color Theme</h2>
            <p className="text-center text-gray-600 mb-8">Each palette creates a unique emotional response</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {colorThemes.map((colorTheme, index) => (
                <Card
                  key={index}
                  className={`overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 ${
                    selectedTheme === index ? "ring-4 ring-pink-600 shadow-2xl" : ""
                  }`}
                  onClick={() => setSelectedTheme(index)}
                >
                  <div className={`h-40 bg-gradient-to-br ${colorTheme.gradient} relative flex items-center justify-center`}>
                    <div className="text-white text-center">
                      <div className="text-4xl font-black mb-2">Aa</div>
                      <div className="text-sm opacity-90">Preview Text</div>
                    </div>
                    {selectedTheme === index && (
                      <Badge className="absolute top-4 right-4 bg-white text-gray-900 border-0 shadow-lg">
                        <Check size={14} className="mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-bold text-lg mb-2">{colorTheme.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{colorTheme.description}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <div
                        className="flex-1 h-14 rounded-lg shadow-md border-2 border-white"
                        style={{ backgroundColor: colorTheme.primary }}
                        title="Primary"
                      />
                      <div
                        className="flex-1 h-14 rounded-lg shadow-md border-2 border-white"
                        style={{ backgroundColor: colorTheme.secondary }}
                        title="Secondary"
                      />
                      <div
                        className="flex-1 h-14 rounded-lg shadow-md border-2 border-white"
                        style={{ backgroundColor: colorTheme.accent }}
                        title="Accent"
                      />
                    </div>

                    <div className={`p-4 rounded-lg bg-gradient-to-br ${colorTheme.background} border-2`}>
                      <p className="text-xs text-gray-700 leading-relaxed">{colorTheme.sample}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Brand Personality Matrix */}
          <Card className="p-8 mt-12 bg-gradient-to-br from-gray-50 to-gray-100">
            <h3 className="text-2xl font-black mb-6 text-center">Design Direction Personalities</h3>
            <div className="grid md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-white rounded-lg shadow">
                <Lock size={32} className="mx-auto mb-2 text-emerald-600" />
                <h4 className="font-bold text-sm mb-1">Exclusive</h4>
                <p className="text-xs text-gray-600">Premium, intimate, private</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow">
                <Infinity size={32} className="mx-auto mb-2 text-blue-600" />
                <h4 className="font-bold text-sm mb-1">Limitless</h4>
                <p className="text-xs text-gray-600">Romantic, hopeful, endless</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow">
                <Smile size={32} className="mx-auto mb-2 text-pink-600" />
                <h4 className="font-bold text-sm mb-1">Bold</h4>
                <p className="text-xs text-gray-600">Direct, sensual, confident</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow">
                <Sun size={32} className="mx-auto mb-2 text-orange-600" />
                <h4 className="font-bold text-sm mb-1">Fresh</h4>
                <p className="text-xs text-gray-600">Optimistic, energetic, new</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow">
                <Compass size={32} className="mx-auto mb-2 text-purple-600" />
                <h4 className="font-bold text-sm mb-1">Adventure</h4>
                <p className="text-xs text-gray-600">Discovery, guidance, journey</p>
              </div>
            </div>
          </Card>

          {/* Apply Theme Section */}
          <Card className="p-8 mt-12 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-center shadow-2xl">
            <h3 className="text-3xl font-black mb-4">Ready to Transform Your Brand?</h3>
            <p className="text-white/90 mb-2 text-lg">
              <span className="font-bold text-xl">{Logo.name}</span> logo
            </p>
            <p className="text-white/90 mb-6 text-lg">
              with <span className="font-bold text-xl">{theme.name}</span> theme
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 h-14 shadow-xl">
                Apply This Design
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 h-14">
                Download Brand Assets
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 h-14">
                Compare Options
              </Button>
            </div>
          </Card>

          {/* Design System Overview */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-600 to-purple-600"></div>
                Visual Impact
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Each combination creates distinct first impression</li>
                <li>✓ Color psychology drives emotional response</li>
                <li>✓ Logo personality reinforces brand message</li>
                <li>✓ Consistency builds recognition and trust</li>
              </ul>
            </Card>
            <Card className="p-6 bg-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"></div>
                Target Audience
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Premium themes: affluent, discerning users</li>
                <li>✓ Vibrant themes: younger, energetic audience</li>
                <li>✓ Warm themes: approachable, friendly vibe</li>
                <li>✓ Bold themes: confident, direct users</li>
              </ul>
            </Card>
            <Card className="p-6 bg-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-600 to-orange-600"></div>
                Implementation
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ All designs ready for immediate use</li>
                <li>✓ Responsive across all device sizes</li>
                <li>✓ Accessible color contrast ratios</li>
                <li>✓ Scalable vector graphics (SVG)</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}