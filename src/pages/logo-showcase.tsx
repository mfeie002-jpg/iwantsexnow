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
      { file: 'logo_monochrome_black.png', name: 'iWantSexNow-monochrome-black.png' }
    ];

    files.forEach((item, index) => {
      setTimeout(() => {
        handleDownload(item.file, item.name);
      }, index * 500);
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0D1B2A]">
      <SEO 
        title="Brand Assets - iWantSexNow.ch"
        description="Official typographic logo system and brand guidelines for iWantSexNow.ch"
      />

      {/* Minimalist Header */}
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
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-2">
              <span className="text-[#0D1B2A] dark:text-white">iWant</span>
              <span className="text-[#C69C6D] dark:text-[#D5A021]">Sex</span>
              <span className="text-[#0D1B2A] dark:text-white">Now</span>
              <span className="text-gray-500 dark:text-gray-400 text-4xl">.ch</span>
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-light max-w-2xl mx-auto mb-4">
            Exklusive Begleitung für anspruchsvolle Momente. Vertraulich & stilvoll.
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-500 font-light max-w-2xl mx-auto mb-8">
            Exclusive companionship for discerning moments. Confidential & refined.
          </p>
          
          {/* Prominent CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Button 
              size="lg"
              className="bg-[#C69C6D] dark:bg-[#D5A021] hover:bg-[#B88C5D] dark:hover:bg-[#C08A1E] text-white font-bold text-lg px-8 py-6 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
            >
              Jetzt Begleitung finden
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-[#C69C6D] dark:border-[#D5A021] text-[#0D1B2A] dark:text-white hover:bg-[#C69C6D] dark:hover:bg-[#D5A021] hover:text-white font-semibold text-lg px-8 py-6 rounded-lg transition-all duration-300"
            >
              Premium Angebote ansehen
            </Button>
          </div>
        </div>

        {/* Design Philosophy */}
        <section className="mb-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-light text-[#0D1B2A] dark:text-white mb-6">Design Philosophie</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                Das iWantSexNow.ch Logo-System ist <strong className="text-[#0D1B2A] dark:text-white font-medium">rein typografisch</strong> gestaltet. 
                Trotz des provokanten Namens soll die Marke seriös, vertrauenswürdig und hochwertig wirken. Es werden bewusst 
                keine Symbole oder erotischen Elemente verwendet.
              </p>
              <p>
                Die Farbpalette nutzt <strong className="text-[#0D1B2A] dark:text-white font-medium">dunkles Navy (#0D1B2A)</strong> für 
                Eleganz und Vertrauen, kombiniert mit <strong className="text-[#C69C6D] dark:text-[#D5A021] font-medium">Gold-Akzenten</strong> die 
                Luxus und Wert vermitteln. Diese Kombination ist wissenschaftlich für Premium-Marken empfohlen.
              </p>
            </div>
          </div>
        </section>

        {/* Logo Variants */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-[#0D1B2A] dark:text-white mb-8">Logo-Varianten</h2>
          
          <div className="space-y-8">
            {/* Primary Logo - Light & Dark Mode */}
            <div className="grid md:grid-cols-2 gap-6">
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
                  Navy-Schriftzug mit goldenem Akzent für das Wort "Sex". Für weisse Hintergründe und helle Oberflächen.
                </p>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleDownload('logo_256x256.png', 'iWantSexNow-primary-light.png')}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-gray-300"
                  >
                    <Download size={14} className="mr-2" />
                    Download
                  </Button>
                </div>
              </Card>

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
                  Weiss/goldener Schriftzug auf Navy. Gold vermittelt Luxus, Weiss steht für Vertrauen.
                </p>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleDownload('logo_256x256.png', 'iWantSexNow-primary-dark.png')}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-gray-700 text-white hover:bg-gray-800"
                  >
                    <Download size={14} className="mr-2" />
                    Download
                  </Button>
                </div>
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
                Zweizeilige Variante für Hero-Bereiche. Oben "iWant", unten "SexNow.ch". Schafft mehr Vertikalität.
              </p>
              <Button 
                onClick={() => handleDownload('logo_256x256.png', 'iWantSexNow-stacked.png')}
                variant="outline"
                size="sm"
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                <Download size={14} className="mr-2" />
                Download
              </Button>
            </Card>

            {/* Short Logos */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-8 bg-[#0D1B2A] border-gray-800">
                <div className="aspect-square bg-gradient-to-br from-[#0D1B2A] to-[#1a2a3a] rounded-lg flex items-center justify-center mb-6">
                  <div className="text-3xl font-bold tracking-tight">
                    <span className="text-white">IW</span>
                    <span className="text-[#D5A021]">SN</span>
                    <span className="text-gray-400 text-xl">.ch</span>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Short Logo</h3>
                <p className="text-sm text-gray-400 mb-4">
                  IWSN.ch – für enge Bereiche wie Mobile-Header. "SN" in Akzentfarbe.
                </p>
                <Button 
                  onClick={() => handleDownload('logo_128x128.png', 'iWantSexNow-short.png')}
                  variant="outline"
                  size="sm"
                  className="w-full border-gray-700 text-white hover:bg-gray-800"
                >
                  <Download size={14} className="mr-2" />
                  Download
                </Button>
              </Card>

              <Card className="p-8 bg-[#0D1B2A] border-gray-800">
                <div className="aspect-square bg-gradient-to-br from-[#0D1B2A] to-[#1a2a3a] rounded-lg flex items-center justify-center mb-6">
                  <div className="text-3xl font-bold tracking-tight">
                    <span className="text-white">IW</span>
                    <span className="text-[#D5A021]">SN</span>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Ultra-Short</h3>
                <p className="text-sm text-gray-400 mb-4">
                  IWSN ohne Domain – für Social Media Icons und Buttons.
                </p>
                <Button 
                  onClick={() => handleDownload('logo_64x64.png', 'iWantSexNow-ultrashort.png')}
                  variant="outline"
                  size="sm"
                  className="w-full border-gray-700 text-white hover:bg-gray-800"
                >
                  <Download size={14} className="mr-2" />
                  Download
                </Button>
              </Card>

              <Card className="p-8 bg-[#0D1B2A] border-gray-800">
                <div className="aspect-square bg-gradient-to-br from-[#0D1B2A] to-[#1a2a3a] rounded-lg flex items-center justify-center mb-6">
                  <div className="text-4xl font-bold tracking-tight">
                    <span className="text-white">I</span>
                    <span className="text-[#D5A021]">W</span>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Minimal Icon</h3>
                <p className="text-sm text-gray-400 mb-4">
                  IW – Favicon und App-Icon. 512×512px empfohlen.
                </p>
                <Button 
                  onClick={() => handleDownload('logo_32x32.png', 'iWantSexNow-icon.png')}
                  variant="outline"
                  size="sm"
                  className="w-full border-gray-700 text-white hover:bg-gray-800"
                >
                  <Download size={14} className="mr-2" />
                  Download
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Color System */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-[#0D1B2A] dark:text-white mb-8">Farbsystem</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-white border-gray-200">
              <h3 className="text-xl font-medium text-[#0D1B2A] mb-4">Light Mode Palette</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-[#0D1B2A] border border-gray-300" />
                  <div>
                    <div className="font-semibold text-[#0D1B2A]">Dark Navy</div>
                    <div className="text-sm text-gray-600">#0D1B2A</div>
                    <div className="text-xs text-gray-500">Primärer Text & Akzente</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-[#C69C6D] border border-gray-300" />
                  <div>
                    <div className="font-semibold text-[#0D1B2A]">Gold Accent</div>
                    <div className="text-sm text-gray-600">#C69C6D</div>
                    <div className="text-xs text-gray-500">Luxury-Hervorhebungen</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-white border-2 border-gray-300" />
                  <div>
                    <div className="font-semibold text-[#0D1B2A]">White / Light Grey</div>
                    <div className="text-sm text-gray-600">#FFFFFF / #F5F5F5</div>
                    <div className="text-xs text-gray-500">Hintergründe</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-[#0D1B2A] border-gray-800">
              <h3 className="text-xl font-medium text-white mb-4">Dark Mode Palette</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-[#0D1B2A] border-2 border-gray-700" />
                  <div>
                    <div className="font-semibold text-white">Dark Navy</div>
                    <div className="text-sm text-gray-400">#0D1B2A</div>
                    <div className="text-xs text-gray-500">Primärer Hintergrund</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-[#D5A021] border border-gray-700" />
                  <div>
                    <div className="font-semibold text-white">Gold Accent</div>
                    <div className="text-sm text-gray-400">#D5A021</div>
                    <div className="text-xs text-gray-500">Helleres Gold für Kontrast</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-white border border-gray-700" />
                  <div>
                    <div className="font-semibold text-white">White</div>
                    <div className="text-sm text-gray-400">#FFFFFF</div>
                    <div className="text-xs text-gray-500">Primärer Text</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-[#0D1B2A] dark:text-white mb-8">Typografie</h2>
          
          <Card className="p-8 bg-white dark:bg-[#0D1B2A] border-gray-200 dark:border-gray-800">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-[#0D1B2A] dark:text-white mb-2" style={{ fontFamily: 'Noto Sans, sans-serif' }}>
                  Noto Sans – Primary
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Modernes, offenes Schriftbild; ideal für digitale Interfaces. Gut lesbar in verschiedenen Größen.
                </p>
                <div className="space-y-2 text-[#0D1B2A] dark:text-white" style={{ fontFamily: 'Noto Sans, sans-serif' }}>
                  <div className="text-4xl font-normal">Aa Bb Cc 123</div>
                  <div className="text-2xl font-bold">Regular & Bold</div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <h4 className="font-semibold text-[#0D1B2A] dark:text-white mb-2">Fallback Stack:</h4>
                <code className="text-sm text-gray-600 dark:text-gray-400">
                  font-family: 'Noto Sans', Arial, Helvetica Neue, sans-serif;
                </code>
              </div>
            </div>
          </Card>
        </section>

        {/* Slogans */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-[#0D1B2A] dark:text-white mb-8">Marken-Claims</h2>
          
          <div className="space-y-6">
            <Card className="p-8 bg-gradient-to-br from-[#0D1B2A] to-[#1a2a3a] border-gray-800">
              <div className="mb-4">
                <span className="text-xs font-bold text-[#D5A021] tracking-wider">HERO / PREMIUM</span>
              </div>
              <p className="text-2xl font-light text-white mb-3">
                Exklusive Begleitung für anspruchsvolle Momente. Vertraulich & stilvoll.
              </p>
              <p className="text-xl font-light text-gray-300">
                Exclusive companionship for discerning moments. Confidential & refined.
              </p>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-white dark:bg-[#0D1B2A] border-gray-200 dark:border-gray-800">
                <div className="mb-3">
                  <span className="text-xs font-bold text-[#C69C6D] dark:text-[#D5A021] tracking-wider">CONVERSION</span>
                </div>
                <p className="text-lg font-medium text-[#0D1B2A] dark:text-white mb-2">
                  Diskrete Premium-Begleitung – buche jetzt!
                </p>
                <p className="text-base text-gray-600 dark:text-gray-400">
                  Discreet premium companionship – book now!
                </p>
              </Card>

              <Card className="p-6 bg-white dark:bg-[#0D1B2A] border-gray-200 dark:border-gray-800">
                <div className="mb-3">
                  <span className="text-xs font-bold text-[#C69C6D] dark:text-[#D5A021] tracking-wider">MICRO-CLAIM</span>
                </div>
                <p className="text-lg font-medium text-[#0D1B2A] dark:text-white mb-2">
                  Verifiziert. Premium. Sofort verfügbar.
                </p>
                <p className="text-base text-gray-600 dark:text-gray-400">
                  Verified. Premium. On demand.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-[#0D1B2A] dark:text-white mb-8">Verwendungsrichtlinien</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 bg-white dark:bg-[#0D1B2A] border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-medium text-green-600 dark:text-green-400 mb-6 flex items-center gap-2">
                <span className="text-2xl">✓</span>
                Best Practices
              </h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                  <span>Primary Logo für Desktop-Header verwenden</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                  <span>Short Logo (IWSN.ch) für Mobile-Navigation nutzen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                  <span>Stacked Version für Hero-Bereiche mit viel Vertikalität</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                  <span>IW Minimal Icon als 512×512px Favicon/App-Icon</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                  <span>Kontrast mindestens 4.5:1 für Fließtext sicherstellen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                  <span>Noto Sans in Regular und Bold für Hierarchien verwenden</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-white dark:bg-[#0D1B2A] border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-medium text-red-600 dark:text-red-400 mb-6 flex items-center gap-2">
                <span className="text-2xl">✗</span>
                Zu vermeiden
              </h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                  <span>Keine Symbole oder erotischen Elemente hinzufügen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                  <span>Logo nicht verzerren oder strecken</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                  <span>Farbwerte nicht ändern (Navy muss #0D1B2A bleiben)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                  <span>Keine anderen Schriftarten als Noto Sans verwenden</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                  <span>Gold-Akzent nicht übermäßig einsetzen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                  <span>Unzureichenden Kontrast zu Hintergründen vermeiden</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Implementation Examples */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-[#0D1B2A] dark:text-white mb-8">Website-Integration</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-3xl">
            Praktische Beispiele für die Implementierung des Logo-Systems in verschiedenen Website-Kontexten.
          </p>
          
          <div className="space-y-6">
            {/* Desktop Header */}
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
                      Jetzt buchen
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  <strong className="text-[#0D1B2A] dark:text-white">Desktop Header</strong> — Primary Logo mit CTA-Buttons
                </p>
              </div>
            </Card>

            {/* Mobile Header */}
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
                  <strong className="text-[#0D1B2A] dark:text-white">Mobile Header</strong> — Short Logo (IWSN.ch) spart Platz
                </p>
              </div>
            </Card>

            {/* Hero Section */}
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
                  <strong className="text-[#0D1B2A] dark:text-white">Hero Section</strong> — Stacked Logo mit Premium-Slogan
                </p>
              </div>
            </Card>

            {/* Footer */}
            <Card className="overflow-hidden bg-white dark:bg-[#0D1B2A] border-gray-200 dark:border-gray-800">
              <div className="bg-[#0D1B2A] p-8">
                <div className="max-w-6xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl font-bold text-white">
                        <span>I</span>
                        <span className="text-[#D5A021]">W</span>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Verifiziert. Premium.</div>
                        <div className="text-sm text-gray-400">Sofort verfügbar.</div>
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <a href="#" className="hover:text-white">Datenschutz</a>
                      <a href="#" className="hover:text-white">AGB</a>
                      <a href="#" className="hover:text-white">Kontakt</a>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    © 2025 iWantSexNow.ch — Premium Escort Services
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  <strong className="text-[#0D1B2A] dark:text-white">Footer</strong> — Minimal Icon (IW) mit Micro-Claim
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Download CTA */}
        <div className="text-center py-12">
          <h2 className="text-3xl font-light text-[#0D1B2A] dark:text-white mb-4">
            Deploy-fertige Assets
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Laden Sie das komplette typografische Logo-System mit allen Varianten in PNG-Format herunter. 
            SVG/EPS-Versionen sollten für die Produktion erstellt werden.
          </p>
          <Button 
            onClick={handleDownloadAll}
            size="lg"
            className="bg-[#0D1B2A] dark:bg-[#D5A021] text-white hover:opacity-90"
          >
            <Download size={20} className="mr-2" />
            Komplettes Logo-Paket herunterladen
          </Button>
        </div>

      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 mt-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
              © 2025 iWantSexNow.ch — Alle Brand-Assets sind geschützt.
            </p>
            <Link href="/logo-concepts">
              <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-[#0D1B2A] dark:hover:text-white">
                Alternative Design-Konzepte ansehen →
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}