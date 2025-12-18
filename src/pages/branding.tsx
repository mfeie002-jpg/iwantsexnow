import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Flame, Sparkles, Zap, Users, Check } from "lucide-react";
import Link from "next/link";

export default function Branding() {
  const [selectedLogo, setSelectedLogo] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState(0);

  const logoOptions = [
    {
      name: "Heart Flame",
      icon: Heart,
      description: "Classic heart with passion - romantic yet bold",
      tagline: "Find Your Spark",
      iconStyle: "fill-current"
    },
    {
      name: "Double Flame",
      icon: Flame,
      description: "Dynamic flames representing chemistry and heat",
      tagline: "Ignite Connections",
      iconStyle: "fill-current"
    },
    {
      name: "Sparkle Heart",
      icon: Sparkles,
      description: "Magical and exciting - represents new connections",
      tagline: "Magic Happens Here",
      iconStyle: ""
    },
    {
      name: "Lightning Bolt",
      icon: Zap,
      description: "Electric chemistry and instant attraction",
      tagline: "Instant Chemistry",
      iconStyle: "fill-current"
    },
    {
      name: "Connected Hearts",
      icon: Users,
      description: "People connecting - community focused",
      tagline: "Connect. Meet. Enjoy.",
      iconStyle: ""
    }
  ];

  const colorThemes = [
    {
      name: "Passionate Pink & Purple",
      description: "Bold, vibrant, and romantic - current theme",
      primary: "#E91E63",
      secondary: "#9C27B0",
      accent: "#FF4081",
      background: "from-pink-50 via-white to-purple-50",
      gradient: "from-pink-600 to-purple-600",
      sample: "This is the current energetic and passionate theme"
    },
    {
      name: "Seductive Red & Wine",
      description: "Luxurious, intimate, and sophisticated",
      primary: "#D32F2F",
      secondary: "#7B1FA2",
      accent: "#F06292",
      background: "from-red-50 via-white to-purple-50",
      gradient: "from-red-600 to-purple-700",
      sample: "Deep, rich colors that convey luxury and desire"
    },
    {
      name: "Electric Blue & Cyan",
      description: "Modern, fresh, and energetic",
      primary: "#2196F3",
      secondary: "#00BCD4",
      accent: "#03A9F4",
      background: "from-blue-50 via-white to-cyan-50",
      gradient: "from-blue-600 to-cyan-600",
      sample: "Cool, contemporary feel with high energy"
    },
    {
      name: "Sunset Orange & Pink",
      description: "Warm, inviting, and playful",
      primary: "#FF6F00",
      secondary: "#FF4081",
      accent: "#FFB300",
      background: "from-orange-50 via-white to-pink-50",
      gradient: "from-orange-600 to-pink-600",
      sample: "Warm sunset vibes - friendly and approachable"
    },
    {
      name: "Midnight Purple & Indigo",
      description: "Mysterious, elegant, and premium",
      primary: "#673AB7",
      secondary: "#3F51B5",
      accent: "#9575CD",
      background: "from-purple-50 via-white to-indigo-50",
      gradient: "from-purple-700 to-indigo-700",
      sample: "Dark, sophisticated with premium appeal"
    },
    {
      name: "Cherry Red & Hot Pink",
      description: "Bold, attention-grabbing, and confident",
      primary: "#E91E63",
      secondary: "#F44336",
      accent: "#FF5252",
      background: "from-pink-50 via-white to-red-50",
      gradient: "from-pink-600 to-red-600",
      sample: "High impact, impossible to ignore"
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
            <h1 className="text-5xl font-black mb-4">Brand Identity Options</h1>
            <p className="text-xl text-gray-600">
              Choose your perfect logo and color theme combination
            </p>
          </div>

          {/* Live Preview */}
          <Card className={`p-12 mb-12 bg-gradient-to-br ${theme.background}`}>
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col items-center gap-6 mb-8">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-2xl`}>
                  <Logo.icon size={48} className={`text-white ${Logo.iconStyle}`} />
                </div>
                <div className="text-center">
                  <h2 className={`text-5xl font-black bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent mb-2`}>
                    iWantSexNow.ch
                  </h2>
                  <p className="text-xl text-gray-600 font-medium">{Logo.tagline}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Button size="lg" className={`bg-gradient-to-r ${theme.gradient} hover:opacity-90 text-lg`}>
                  Primary Button
                </Button>
                <Button size="lg" variant="outline" className="text-lg">
                  Secondary Button
                </Button>
              </div>

              <div className="mt-8 grid md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="text-center">
                    <div className={`text-3xl font-black bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                      50K+
                    </div>
                    <div className="text-sm text-gray-600">Active Members</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <Badge className={`bg-gradient-to-r ${theme.gradient} border-0 w-full justify-center`}>
                    Online Now
                  </Badge>
                </Card>
                <Card className="p-4">
                  <div className={`w-full h-8 rounded-full bg-gradient-to-r ${theme.gradient}`}></div>
                </Card>
              </div>
            </div>
          </Card>

          {/* Logo Options */}
          <div className="mb-12">
            <h2 className="text-3xl font-black mb-6">Logo Designs</h2>
            <div className="grid md:grid-cols-5 gap-4">
              {logoOptions.map((logo, index) => (
                <Card
                  key={index}
                  className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                    selectedLogo === index ? "ring-4 ring-pink-600 shadow-xl" : ""
                  }`}
                  onClick={() => setSelectedLogo(index)}
                >
                  <div className="text-center space-y-3">
                    <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}>
                      <logo.icon size={40} className={`text-white ${logo.iconStyle}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm mb-1">{logo.name}</h3>
                      <p className="text-xs text-gray-600 leading-tight">{logo.description}</p>
                    </div>
                    {selectedLogo === index && (
                      <Badge className="bg-pink-600 border-0">
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
            <h2 className="text-3xl font-black mb-6">Color Themes</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {colorThemes.map((colorTheme, index) => (
                <Card
                  key={index}
                  className={`overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                    selectedTheme === index ? "ring-4 ring-pink-600 shadow-xl" : ""
                  }`}
                  onClick={() => setSelectedTheme(index)}
                >
                  <div className={`h-32 bg-gradient-to-br ${colorTheme.gradient} relative`}>
                    {selectedTheme === index && (
                      <Badge className="absolute top-4 right-4 bg-white text-gray-900 border-0">
                        <Check size={14} className="mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-bold text-lg mb-2">{colorTheme.name}</h3>
                      <p className="text-sm text-gray-600">{colorTheme.description}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <div
                        className="w-12 h-12 rounded-lg shadow-md"
                        style={{ backgroundColor: colorTheme.primary }}
                        title="Primary"
                      />
                      <div
                        className="w-12 h-12 rounded-lg shadow-md"
                        style={{ backgroundColor: colorTheme.secondary }}
                        title="Secondary"
                      />
                      <div
                        className="w-12 h-12 rounded-lg shadow-md"
                        style={{ backgroundColor: colorTheme.accent }}
                        title="Accent"
                      />
                    </div>

                    <div className={`p-3 rounded-lg bg-gradient-to-br ${colorTheme.background} border`}>
                      <p className="text-xs text-gray-700">{colorTheme.sample}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Apply Theme Section */}
          <Card className="p-8 mt-12 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-center">
            <h3 className="text-3xl font-black mb-4">Ready to Apply?</h3>
            <p className="text-white/90 mb-6 text-lg">
              Selected: <span className="font-bold">{Logo.name}</span> logo with{" "}
              <span className="font-bold">{theme.name}</span> theme
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8">
                Apply This Design
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8">
                Download Brand Kit
              </Button>
            </div>
          </Card>

          {/* Design Notes */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Logo Guidelines</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Use consistent sizing across all pages</li>
                <li>✓ Maintain clear space around the logo</li>
                <li>✓ Use gradient versions for primary branding</li>
                <li>✓ Solid color versions for small sizes or print</li>
                <li>✓ Never stretch, rotate, or distort the logo</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Color Usage</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Primary color for main CTAs and headers</li>
                <li>✓ Secondary for supporting elements</li>
                <li>✓ Gradient for premium features and emphasis</li>
                <li>✓ Maintain WCAG AA contrast standards</li>
                <li>✓ Use backgrounds to create depth and hierarchy</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}