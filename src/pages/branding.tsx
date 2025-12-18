import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Lock, Infinity, Smile, Sun, Compass, Check, Flame, Zap, Target, Users, StarOff, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Branding() {
  const [selectedLogo, setSelectedLogo] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState(0);

  const logoOptions = [
    {
      name: "Interlocked Hearts",
      icon: null,
      description: "Two hearts connecting - intimate connection",
      tagline: "Where Hearts Connect",
      slogan: "Find Your Perfect Match Tonight",
      iconStyle: "",
      svgPath: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Left heart */}
          <path d="M 30 35 C 30 20, 10 20, 10 35 C 10 45, 30 60, 30 60 C 30 60, 50 45, 50 35 C 50 20, 30 20, 30 35 Z" 
                fill="currentColor" stroke="none"/>
          {/* Right heart */}
          <path d="M 70 45 C 70 30, 50 30, 50 45 C 50 55, 70 70, 70 70 C 70 70, 90 55, 90 45 C 90 30, 70 30, 70 45 Z" 
                fill="currentColor" stroke="none" opacity="0.8"/>
        </svg>
      )
    },
    {
      name: "Flame of Passion",
      icon: Flame,
      description: "Bold flame - ignite desire and passion",
      tagline: "Ignite Your Desires",
      slogan: "Where Passion Meets Connection",
      iconStyle: "fill-current"
    },
    {
      name: "Lightning Strike",
      icon: Zap,
      description: "Electric energy - instant attraction",
      tagline: "Instant Chemistry",
      slogan: "Feel The Spark Tonight",
      iconStyle: "fill-current"
    },
    {
      name: "Target Lock",
      icon: Target,
      description: "Precision matching - find exactly what you want",
      tagline: "Find What You Want",
      slogan: "Precise. Private. Passionate.",
      iconStyle: ""
    },
    {
      name: "Dual Profiles",
      icon: Users,
      description: "Two people connecting - community focus",
      tagline: "Your Dating Community",
      slogan: "Thousands Ready To Meet You",
      iconStyle: ""
    },
    {
      name: "Rising Star",
      icon: Sparkles,
      description: "Shine bright - stand out and get noticed",
      tagline: "Be Discovered",
      slogan: "Where Attraction Begins",
      iconStyle: ""
    },
    {
      name: "Kiss Lips",
      icon: null,
      description: "Stylized lips - direct and sensual",
      tagline: "No Games, Just Fun",
      slogan: "Real People. Real Connections.",
      iconStyle: "",
      svgPath: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Upper lip */}
          <path d="M 20 45 Q 35 30, 50 45 Q 65 30, 80 45" 
                fill="currentColor" stroke="none"/>
          {/* Lower lip */}
          <path d="M 20 45 Q 35 65, 50 55 Q 65 65, 80 45" 
                fill="currentColor" stroke="none" opacity="0.9"/>
        </svg>
      )
    },
    {
      name: "Heart Lock",
      icon: Lock,
      description: "Exclusive and intimate - unlock desires",
      tagline: "Unlock Your Desires",
      slogan: "Discreet. Secure. Exciting.",
      iconStyle: ""
    },
    {
      name: "Infinity Hearts",
      icon: Infinity,
      description: "Endless connections and possibilities",
      tagline: "Endless Possibilities",
      slogan: "Never Stop Exploring",
      iconStyle: ""
    },
    {
      name: "Gender Symbols",
      icon: null,
      description: "Classic male/female symbols - universal dating icon",
      tagline: "Where Everyone Connects",
      slogan: "Switzerland's #1 Dating Platform",
      iconStyle: "",
      svgPath: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Female symbol */}
          <circle cx="35" cy="35" r="18" fill="none" stroke="currentColor" strokeWidth="4"/>
          <line x1="35" y1="53" x2="35" y2="70" stroke="currentColor" strokeWidth="4"/>
          <line x1="28" y1="63" x2="42" y2="63" stroke="currentColor" strokeWidth="4"/>
          {/* Male symbol */}
          <circle cx="60" cy="50" r="18" fill="none" stroke="currentColor" strokeWidth="4"/>
          <line x1="73" y1="37" x2="88" y2="22" stroke="currentColor" strokeWidth="4"/>
          <line x1="88" y1="22" x2="88" y2="35" stroke="currentColor" strokeWidth="4"/>
          <line x1="75" y1="22" x2="88" y2="22" stroke="currentColor" strokeWidth="4"/>
        </svg>
      )
    },
    {
      name: "Compass Rose",
      icon: Compass,
      description: "Navigate to find your perfect match",
      tagline: "Find Your Direction",
      slogan: "Your Journey Starts Here",
      iconStyle: ""
    },
    {
      name: "Rising Sun",
      icon: Sun,
      description: "Fresh starts and new beginnings daily",
      tagline: "New Beginnings Daily",
      slogan: "Every Day Brings New Matches",
      iconStyle: ""
    }
  ];

  const colorThemes = [
    // SOLID COLOR THEMES
    {
      name: "Classic Pink (Solid)",
      description: "Clean, bold, no-nonsense pink - pure energy",
      primary: "#EC4899",
      secondary: "#DB2777",
      accent: "#F472B6",
      background: "from-pink-50 via-white to-pink-50",
      gradient: "from-pink-600 to-pink-600",
      buttonClass: "bg-pink-600 hover:bg-pink-700",
      isSolid: true,
      sample: "Bold single pink color - direct, confident, energetic"
    },
    {
      name: "Deep Purple (Solid)",
      description: "Sophisticated single purple - luxury and desire",
      primary: "#9333EA",
      secondary: "#7E22CE",
      accent: "#A855F7",
      background: "from-purple-50 via-white to-purple-50",
      gradient: "from-purple-600 to-purple-600",
      buttonClass: "bg-purple-600 hover:bg-purple-700",
      isSolid: true,
      sample: "Rich purple tone - exclusive, mysterious, premium"
    },
    {
      name: "Crimson Red (Solid)",
      description: "Passionate single red - intense attraction",
      primary: "#DC2626",
      secondary: "#B91C1C",
      accent: "#EF4444",
      background: "from-red-50 via-white to-red-50",
      gradient: "from-red-600 to-red-600",
      buttonClass: "bg-red-600 hover:bg-red-700",
      isSolid: true,
      sample: "Pure red - passionate, bold, attention-demanding"
    },
    {
      name: "Teal Green (Solid)",
      description: "Sophisticated single teal - upscale and modern",
      primary: "#14B8A6",
      secondary: "#0D9488",
      accent: "#2DD4BF",
      background: "from-teal-50 via-white to-teal-50",
      gradient: "from-teal-600 to-teal-600",
      buttonClass: "bg-teal-600 hover:bg-teal-700",
      isSolid: true,
      sample: "Clean teal - fresh, premium, contemporary"
    },
    {
      name: "Royal Blue (Solid)",
      description: "Trustworthy single blue - professional confidence",
      primary: "#2563EB",
      secondary: "#1D4ED8",
      accent: "#3B82F6",
      background: "from-blue-50 via-white to-blue-50",
      gradient: "from-blue-600 to-blue-600",
      buttonClass: "bg-blue-600 hover:bg-blue-700",
      isSolid: true,
      sample: "Strong blue - reliable, trustworthy, confident"
    },
    {
      name: "Midnight Black (Solid)",
      description: "Premium single black - exclusive and elite",
      primary: "#1F2937",
      secondary: "#111827",
      accent: "#374151",
      background: "from-gray-50 via-white to-gray-50",
      gradient: "from-gray-800 to-gray-800",
      buttonClass: "bg-gray-800 hover:bg-gray-900",
      isSolid: true,
      sample: "Dark elegance - VIP, exclusive, high-end"
    },
    // GRADIENT THEMES
    {
      name: "Pink-Purple Gradient",
      description: "Classic dating app gradient - playful energy",
      primary: "#EC4899",
      secondary: "#9333EA",
      accent: "#F472B6",
      background: "from-pink-50 via-white to-purple-50",
      gradient: "from-pink-600 to-purple-600",
      buttonClass: "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700",
      isSolid: false,
      sample: "Dynamic gradient - energetic, fun, modern"
    },
    {
      name: "Coral-Peach Gradient",
      description: "Warm, inviting sunset tones",
      primary: "#FF6B6B",
      secondary: "#FFB347",
      accent: "#FF8B94",
      background: "from-orange-50 via-white to-pink-50",
      gradient: "from-orange-500 to-pink-500",
      buttonClass: "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600",
      isSolid: false,
      sample: "Sunset warmth - friendly, approachable, welcoming"
    },
    {
      name: "Magenta-Lime Gradient",
      description: "Energetic pop of vibrant neon",
      primary: "#D946EF",
      secondary: "#84CC16",
      accent: "#EC4899",
      background: "from-fuchsia-50 via-white to-lime-50",
      gradient: "from-fuchsia-600 to-lime-500",
      buttonClass: "bg-gradient-to-r from-fuchsia-600 to-lime-500 hover:from-fuchsia-700 hover:to-lime-600",
      isSolid: false,
      sample: "Electric neon - youthful, bold, impossible to ignore"
    },
    {
      name: "Navy-Gold Gradient",
      description: "Premium luxury positioning",
      primary: "#1E3A8A",
      secondary: "#D97706",
      accent: "#3B82F6",
      background: "from-blue-50 via-white to-amber-50",
      gradient: "from-blue-900 to-amber-600",
      buttonClass: "bg-gradient-to-r from-blue-900 to-amber-600 hover:from-blue-950 hover:to-amber-700",
      isSolid: false,
      sample: "Luxury gradient - exclusive, trustworthy, high-end"
    },
    {
      name: "Turquoise-Orange Gradient",
      description: "Tropical, playful adventure",
      primary: "#06B6D4",
      secondary: "#F97316",
      accent: "#22D3EE",
      background: "from-cyan-50 via-white to-orange-50",
      gradient: "from-cyan-600 to-orange-600",
      buttonClass: "bg-gradient-to-r from-cyan-600 to-orange-600 hover:from-cyan-700 hover:to-orange-700",
      isSolid: false,
      sample: "Tropical vibes - fun, exciting, adventurous"
    },
    {
      name: "Emerald-Teal Gradient",
      description: "Sophisticated jewel tones",
      primary: "#059669",
      secondary: "#14B8A6",
      accent: "#10B981",
      background: "from-emerald-50 via-white to-teal-50",
      gradient: "from-emerald-600 to-teal-600",
      buttonClass: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700",
      isSolid: false,
      sample: "Jewel gradient - sophisticated, premium, elegant"
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
              🎨 Brand Identity Studio
            </Badge>
            <h1 className="text-5xl font-black mb-4">Create Your Perfect Brand</h1>
            <p className="text-xl text-gray-600 mb-2">
              12 unique logos × 12 color themes = 144 combinations
            </p>
            <p className="text-lg text-gray-500">
              Each with unique taglines and slogans
            </p>
          </div>

          {/* Live Preview */}
          <Card className={`p-12 mb-12 bg-gradient-to-br ${theme.background} border-4 shadow-2xl`}>
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col items-center gap-6 mb-8">
                <div className={`w-32 h-32 rounded-full ${theme.buttonClass} flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform p-6`}>
                  {Logo.svgPath ? (
                    <div className="text-white w-full h-full">
                      {Logo.svgPath}
                    </div>
                  ) : Logo.icon ? (
                    <Logo.icon size={64} className={`text-white ${Logo.iconStyle}`} />
                  ) : null}
                </div>
                <div className="text-center">
                  <h2 className="text-6xl font-black mb-3" style={{ color: theme.primary }}>
                    iWantSexNow.ch
                  </h2>
                  <p className="text-3xl font-bold text-gray-700 mb-2">{Logo.tagline}</p>
                  <p className="text-xl text-gray-600 italic">"{Logo.slogan}"</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <Button size="lg" className={`${theme.buttonClass} text-lg h-14 shadow-lg text-white`}>
                  Join Now - It's Free
                </Button>
                <Button size="lg" variant="outline" className="text-lg h-14 border-2">
                  Browse Members
                </Button>
              </div>

              <div className="mt-8 grid md:grid-cols-4 gap-4">
                <Card className="p-4 bg-white/80 backdrop-blur">
                  <div className="text-center">
                    <div className="text-3xl font-black" style={{ color: theme.primary }}>
                      50K+
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Members</div>
                  </div>
                </Card>
                <Card className="p-4 bg-white/80 backdrop-blur">
                  <Badge className={`${theme.buttonClass} border-0 w-full justify-center h-10 text-base text-white`}>
                    Online Now
                  </Badge>
                </Card>
                <Card className="p-4 bg-white/80 backdrop-blur">
                  <div className={`w-full h-10 rounded-full ${theme.buttonClass} shadow-inner`}></div>
                </Card>
                <Card className="p-4 bg-white/80 backdrop-blur">
                  <div className="flex items-center justify-center gap-2 h-10">
                    {Logo.svgPath ? (
                      <div className="w-6 h-6" style={{ color: theme.primary }}>
                        {Logo.svgPath}
                      </div>
                    ) : Logo.icon ? (
                      <Logo.icon size={24} style={{ color: theme.primary }} />
                    ) : null}
                    <span className="font-bold text-gray-700">Icon</span>
                  </div>
                </Card>
              </div>
            </div>
          </Card>

          {/* Logo Selection */}
          <div className="mb-12">
            <h2 className="text-3xl font-black mb-6 text-center">Choose Your Logo & Message</h2>
            <p className="text-center text-gray-600 mb-8">Each logo comes with a unique tagline and slogan</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {logoOptions.map((logo, index) => (
                <Card
                  key={index}
                  className={`p-6 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 ${
                    selectedLogo === index ? "ring-4 ring-pink-600 shadow-2xl scale-105" : ""
                  }`}
                  onClick={() => setSelectedLogo(index)}
                >
                  <div className="text-center space-y-3">
                    <div className={`w-20 h-20 mx-auto rounded-full ${theme.buttonClass} flex items-center justify-center shadow-lg p-4`}>
                      {logo.svgPath ? (
                        <div className="text-white w-full h-full">
                          {logo.svgPath}
                        </div>
                      ) : logo.icon ? (
                        <logo.icon size={32} className={`text-white ${logo.iconStyle}`} />
                      ) : null}
                    </div>
                    <div>
                      <h3 className="font-bold mb-1 text-sm">{logo.name}</h3>
                      <p className="text-xs text-gray-600 leading-tight mb-2">{logo.description}</p>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-pink-600">"{logo.tagline}"</p>
                        <p className="text-xs text-gray-500 italic">{logo.slogan}</p>
                      </div>
                    </div>
                    {selectedLogo === index && (
                      <Badge className="bg-pink-600 border-0 w-full justify-center text-xs text-white">
                        <Check size={12} className="mr-1" />
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
            <p className="text-center text-gray-600 mb-4">6 solid colors + 6 gradient options</p>
            
            {/* Solid Colors Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-center text-gray-700">Solid Colors (No Gradients)</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {colorThemes.filter(t => t.isSolid).map((colorTheme, index) => {
                  const actualIndex = colorThemes.indexOf(colorTheme);
                  return (
                    <Card
                      key={actualIndex}
                      className={`overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 ${
                        selectedTheme === actualIndex ? "ring-4 ring-pink-600 shadow-2xl" : ""
                      }`}
                      onClick={() => setSelectedTheme(actualIndex)}
                    >
                      <div className={`h-40 ${colorTheme.buttonClass} relative flex items-center justify-center`}>
                        <div className="text-white text-center">
                          <div className="text-4xl font-black mb-2">Aa</div>
                          <div className="text-sm opacity-90">Preview Text</div>
                        </div>
                        {selectedTheme === actualIndex && (
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
                  );
                })}
              </div>
            </div>

            {/* Gradient Colors Section */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-center text-gray-700">Gradient Colors</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {colorThemes.filter(t => !t.isSolid).map((colorTheme, index) => {
                  const actualIndex = colorThemes.indexOf(colorTheme);
                  return (
                    <Card
                      key={actualIndex}
                      className={`overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 ${
                        selectedTheme === actualIndex ? "ring-4 ring-pink-600 shadow-2xl" : ""
                      }`}
                      onClick={() => setSelectedTheme(actualIndex)}
                    >
                      <div className={`h-40 bg-gradient-to-br ${colorTheme.gradient} relative flex items-center justify-center`}>
                        <div className="text-white text-center">
                          <div className="text-4xl font-black mb-2">Aa</div>
                          <div className="text-sm opacity-90">Preview Text</div>
                        </div>
                        {selectedTheme === actualIndex && (
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
                  );
                })}
              </div>
            </div>
          </div>

          {/* Apply Theme Section */}
          <Card className="p-8 mt-12 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-center shadow-2xl">
            <h3 className="text-3xl font-black mb-4">Your Selected Brand Identity</h3>
            <div className="space-y-2 mb-6">
              <p className="text-white/90 text-xl">
                <span className="font-bold text-2xl">{Logo.name}</span> logo
              </p>
              <p className="text-white text-lg font-medium">"{Logo.tagline}"</p>
              <p className="text-white/80 italic">{Logo.slogan}</p>
              <p className="text-white/90 text-xl mt-4">
                with <span className="font-bold text-2xl">{theme.name}</span>
              </p>
              <p className="text-white/90">
                {theme.isSolid ? "✓ Solid color design (no gradients)" : "✓ Dynamic gradient design"}
              </p>
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 h-14 shadow-xl">
                Apply This Design
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 h-14">
                Download Brand Kit
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
                Logo + Message
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ 12 unique logo designs</li>
                <li>✓ Custom tagline for each</li>
                <li>✓ Unique slogan messaging</li>
                <li>✓ Different brand personalities</li>
              </ul>
            </Card>
            <Card className="p-6 bg-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"></div>
                Brand Flexibility
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ 144 total combinations</li>
                <li>✓ Solid & gradient options</li>
                <li>✓ Mix freely for unique identity</li>
                <li>✓ Professional quality throughout</li>
              </ul>
            </Card>
            <Card className="p-6 bg-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-600 to-orange-600"></div>
                Implementation
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Ready for immediate use</li>
                <li>✓ Fully responsive design</li>
                <li>✓ Accessible contrast ratios</li>
                <li>✓ Scalable vector graphics</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}