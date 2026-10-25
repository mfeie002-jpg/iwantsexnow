import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import SEO from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Lock,
  Camera,
  Calculator,
  PhoneCall,
  UserCheck,
  Coins,
  BookOpen,
} from "lucide-react";

const BUDDY_TIPS: Record<
  number,
  {
    title: string;
    greeting: string;
    bullets: string[];
    proTip: string;
  }
> = {
  1: {
    title: "Buddy-Hilfe Schritt 1: Neu-Einstieg vs. Portal-Übernahme",
    greeting: "Hallo! Ich bin dein Swiss Onboarding-Buddy 👋 Egal ob du komplett neu startest oder schon auf xdate/fgirl bist – ich führe dich in 3 Minuten zum fertigen Direktprofil!",
    bullets: [
      "Komplett neu dabei? Wähle 'Komplett neues Profil erstellen'. Du brauchst keinerlei Vorkenntnisse.",
      "Schon auf anderen Portalen aktiv? Wähle 'Bestehendes Index-Profil übernehmen' – wir bündeln deine bestehenden Inserate automatisch.",
      "Für alle offen: Wir unterstützen weibliche Escorts, männliche Gigolos / Callboys (für Damen, Herren & Paare), Trans-Models und Duo-Paare!",
    ],
    proTip: "Tipp für Einsteiger/innen: Nutze für dein Escort- oder Gigolo-Profil am besten eine separate Schweizer Prepaid-eSIM (z.B. Yallo, Wingo oder Swisscom) – so bleibt deine private Nummer zu 100% getrennt.",
  },
  2: {
    title: "Buddy-Hilfe Schritt 2: Künstlername, Region & Diskretion",
    greeting: "Jetzt legen wir fest, wie und wo Kunden dich in der Schweiz finden:",
    bullets: [
      "Künstlername: Wähle einen einprägsamen Vornamen (z.B. 'Sophia', 'Elena' oder als Gigolo 'Julian', 'Matteo').",
      "Standort & Reise-Radius: In Zürich, Zug und Cham werden Hotel-Outcalls (z.B. Park Hotel Zug, Dolder, Kameha) besonders hoch bezahlt.",
      "Gesicht zeigen? Du musst dein Gesicht auf öffentlichen Fotos NICHT zwingend unzensiert zeigen – du kannst es leicht weichzeichnen und unzensierte Videos später im geschützten VIP-Tresor für CHF 19–39 verkaufen!",
    ],
    proTip: "In der Schweiz dürfen selbstständige Begleiter/innen & Gigolos legal arbeiten. Wichtig für EU/EFTA-Gäste: Das einfache Online-Meldeverfahren (bis 90 Tage pro Jahr) ist in 5 Minuten erledigt.",
  },
  3: {
    title: "Buddy-Hilfe Schritt 3: Perfekte Schweizer Fixpreise kalkulieren",
    greeting: "Unser grösster Vorteil für dich: Schluss mit unangenehmen Preis-Diskussionen im Zimmer!",
    bullets: [
      "Übliche Schweizer Stundentarife (60 Min.): Für High-Class Escorts & Gigolos in Zürich/Zug liegen die Tarife meist zwischen CHF 350 und CHF 550 pro Stunde.",
      "Inklusive-Services anhaken: Je klarer du angibst, was im Grundpreis inklusive ist (z.B. GFE, Dinner-Begleitung, Hotel-Outcall, Massage), desto höher dein Match-Score im Endpreis-Rechner!",
      "0% Agentur-Provision: Was du hier als Stundentarif einträgst, gehört bei der Buchung zu 100% dir.",
    ],
    proTip: "Schalte zusätzlich den '3-Minuten 1:1 Live-Cam Vibe-Check' (CHF 29) ein – Kunden, die dich kurz per Kamera sehen, buchen danach zu 95% sofort das echte Treffen!",
  },
  4: {
    title: "Buddy-Hilfe Schritt 4: Fotos, Bio & Passives Einkommen (Locked Content)",
    greeting: "So hebt sich dein Profil sofort von der Masse ab:",
    bullets: [
      "Authentische Bilder schlagen Studio-Photoshop: Schweizer Kunden lieben natürliche, gepflegte Aufnahmen im Kleid, Anzug oder Lingerie.",
      "Über-mich-Text (Bio): Beschreibe in 2–3 Sätzen deine Persönlichkeit, welche Sprachen du sprichst und wen du empfängst (Herren, Damen, Paare).",
      "VIP-Tresor aktivieren: Du kannst im Dashboard unzensierte Vorab-Videos hochladen – du erhältst 80% Sofort-Auszahlung bei jedem Kauf!",
    ],
    proTip: "Wenn du gerade noch kein perfektes Foto-URL zur Hand hast, lassen wir dir ein edles Platzhalter-Porträt drin, das du jederzeit im Dashboard austauschen kannst.",
  },
  5: {
    title: "Buddy-Hilfe Schritt 5: Swiss-Shield Tagescode & 2 Gratis Credits",
    greeting: "Fast geschafft! So schalten wir dein blau-goldenes Verifizierungs-Siegel frei:",
    bullets: [
      "Notiere dir den 4-stelligen Tagescode (oder halte ihn kurz auf einem Zettel neben dich für den internen Echtheits-Check).",
      "Dieses Prüf-Bild wird NIEMALS veröffentlicht – es dient nur dazu, Fake-Profile von unserer Plattform fernzuhalten.",
      "Willkommens-Geschenk: Mit Klick auf 'Jetzt kostenlos aktivieren' schreiben wir dir sofort 1. Monat 100% kostenlos + offizieller ✓ Haken + CHF 50 Startguthaben (Wert CHF 50) gut!",
    ],
    proTip: "Nach dem Klick landest du direkt in deinem persönlichen Provider-Cockpit (/creator-dashboard) und kannst sofort Buchungen & Live-Cam-Anrufe empfangen!",
  },
};

export default function CreatePostOnboardingBuddyPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState<number>(1);
  const [onboardingMode, setOnboardingMode] = useState<"newbie" | "claim">("newbie");
  const [genderCategory, setGenderCategory] = useState<"female" | "male" | "trans" | "couple">("female");

  // Form Fields
  const [artistName, setArtistName] = useState("");
  const [age, setAge] = useState<number>(25);
  const [phone, setPhone] = useState("+41 79 ");
  const [canton, setCanton] = useState("ZH");
  const [city, setCity] = useState("Zürich & Zug");
  const [height, setHeight] = useState("170 cm");
  const [hairColor, setHairColor] = useState("Brünett");
  const [bustOrBuild, setBustOrBuild] = useState("75C (Natur)");
  const [languages, setLanguages] = useState<string[]>(["Deutsch", "English"]);

  const [rate30, setRate30] = useState<number>(300);
  const [rate60, setRate60] = useState<number>(450);
  const [rate120, setRate120] = useState<number>(800);
  const [includedServices, setIncludedServices] = useState<string[]>([
    "GFE",
    "Dinner Dates",
    "Outcall",
    "Massage",
  ]);
  const [enableLiveCamCheck, setEnableLiveCamCheck] = useState<boolean>(true);
  const [enableLockedVault, setEnableLockedVault] = useState<boolean>(true);

  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [dailyCode] = useState(() => `CH-${Math.floor(1000 + Math.random() * 9000)}`);

  useEffect(() => {
    const claimParam = String(router.query.claim || "");
    if (claimParam) {
      setOnboardingMode("claim");
      setArtistName(claimParam);
    }
  }, [router.query.claim]);

  const toggleService = (srv: string) => {
    setIncludedServices((prev) =>
      prev.includes(srv) ? prev.filter((x) => x !== srv) : [...prev, srv]
    );
  };

  const toggleLang = (lng: string) => {
    setLanguages((prev) =>
      prev.includes(lng) ? prev.filter((x) => x !== lng) : [...prev, lng]
    );
  };

  const handleFinishRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = artistName.trim() || (genderCategory === "male" ? "Julian" : "Sophia");

    localStorage.setItem("iwProviderAuth", finalName);
    localStorage.setItem("providerLeadCredits", "2");

    const customProfiles = JSON.parse(localStorage.getItem("customRegisteredProfiles") || "[]");
    customProfiles.push({
      rawName: finalName,
      genderCategory,
      age,
      rawPhone: phone,
      city,
      canton,
      advertisedBaseChf: rate60,
      rate30Chf: rate30,
      rate120Chf: rate120,
      hairColor,
      bust: bustOrBuild,
      height,
      languages,
      includedTags: includedServices,
      bio:
        bio.trim() ||
        `Verifiziertes Schweizer Direktprofil (${finalName}, ${age}) in ${city} (${canton}). Direkt zum garantierten Fixpreis buchbar.`,
      thumbnail:
        photoUrl.trim() ||
        (genderCategory === "male"
          ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop"
          : "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop"),
      dailyCode,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("customRegisteredProfiles", JSON.stringify(customProfiles));

    toast({
      title: `🎉 Herzlichen Glückwunsch, ${finalName}!`,
      description: "Dein Direktprofil ist aktiv + 1. Monat 100% kostenlos + offizieller ✓ Haken + CHF 50 Startguthaben (CHF 50) wurden deinem Konto gutgeschrieben!",
      duration: 5000,
    });

    router.push("/creator-dashboard");
  };

  const activeTip = BUDDY_TIPS[step] || BUDDY_TIPS[1];

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title="Als Escort, Model oder Gigolo registrieren (Mit interaktivem Schweizer Onboarding-Buddy) | iWantSexNow.ch"
        description="Schritt-für-Schritt Registrierung für Einsteigerinnen, verifizierte Escorts, Gigolos / Callboys und Paare in der Schweiz. Inklusive 1. Monat 100% kostenlos + offizieller ✓ Haken + CHF 50 Startguthaben."
      />
      <header className="border-b border-[#C69C6D]/25 bg-[#07101A] py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif font-black">
            <span>iWant</span><span className="text-[#D5A021]">Sex</span><span>Now</span><span className="text-[#C69C6D] text-sm font-sans">.ch</span>
          </Link>
          <div className="hidden lg:block"><Navigation /></div>
          <MobileNav />
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#09131E] border border-[#C69C6D]/45 p-6 rounded-2xl shadow-2xl">
          <div>
            <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-2">
              <Sparkles size={12} className="mr-1.5 inline" /> Interaktiver Schweizer Setup-Buddy · Für Damen, Gigolos & Paare
            </Badge>
            <h1 className="text-2xl md:text-4xl font-serif font-black">
              In 5 einfachen Schritten zum eigenen Schweizer Direktprofil
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              Egal ob du heute komplett neu startest oder dein bestehendes Inserat von einem anderen Portal übernimmst – unser Buddy erklärt dir jeden Schritt!
            </p>
          </div>
          <Link
            href="/guides"
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-[#C69C6D]/40 text-xs font-bold text-[#D5A021] shrink-0 flex items-center gap-1.5"
          >
            <BookOpen size={14} /> Schweizer Einsteiger- & Steuer-Guides lesen →
          </Link>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-5 gap-2">
          {[
            { s: 1, label: "1. Kategorie & Start" },
            { s: 2, label: "2. Name & Region" },
            { s: 3, label: "3. Fixpreis & Extras" },
            { s: 4, label: "4. Fotos & Bio" },
            { s: 5, label: "5. Aktivierung (+CHF 50)" },
          ].map((item) => (
            <button
              key={item.s}
              type="button"
              onClick={() => setStep(item.s)}
              className={`p-3 rounded-xl border text-center text-xs font-black transition-all ${
                step === item.s
                  ? "bg-[#C69C6D] text-[#0D1B2A] border-[#C69C6D] shadow-lg"
                  : step > item.s
                  ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                  : "bg-[#09131E] border-white/10 text-gray-400"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left 7 Columns: Interactive Step-by-Step Form */}
          <div className="lg:col-span-7">
            <Card className="bg-[#09131E] border-2 border-[#C69C6D]/55 p-6 md:p-8 rounded-2xl text-white shadow-2xl">
              <form onSubmit={handleFinishRegistration} className="space-y-6">
                {/* STEP 1: MODE & GENDER (FEMALE ESCORT, GIGOLO / CALLBOY, TRANS, COUPLE) */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div>
                      <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40 mb-2">
                        Schritt 1 von 5 · Deine Ausgangslage
                      </Badge>
                      <h2 className="text-2xl font-serif font-black">
                        Startest du komplett neu oder bist du schon auf einem Portal?
                      </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setOnboardingMode("newbie")}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          onboardingMode === "newbie"
                            ? "bg-emerald-950/50 border-2 border-emerald-400"
                            : "bg-black/40 border-white/15"
                        }`}
                      >
                        <div className="font-black text-sm text-white">🌱 Komplett neues Profil starten</div>
                        <p className="text-xs text-gray-300 mt-1">
                          Ich bin noch auf keinem anderen Portal und möchte Schritt für Schritt mein erstes eigenes Schweizer Profil aufbauen.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOnboardingMode("claim")}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          onboardingMode === "claim"
                            ? "bg-emerald-950/50 border-2 border-emerald-400"
                            : "bg-black/40 border-white/15"
                        }`}
                      >
                        <div className="font-black text-sm text-white">⚡ Bestehendes Index-Profil übernehmen</div>
                        <p className="text-xs text-gray-300 mt-1">
                          Ich bin bereits auf xdate, fgirl oder and6 und möchte mein gebündeltes Direktprofil kostenlos freischalten.
                        </p>
                      </button>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase text-[#D5A021] block mb-2">
                        Als was möchtest du dich registrieren? (Alle Kategorien willkommen!)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                        {[
                          { id: "female", label: "👩 Female Escort / Model", defaultBuild: "75C (Natur)" },
                          { id: "male", label: "🤵 Gigolo / Callboy (Male)", defaultBuild: "Athletisch (185 cm)" },
                          { id: "trans", label: "🏳️‍⚧️ Trans VIP Companion", defaultBuild: "75B / Schlank" },
                          { id: "couple", label: "👩‍❤️‍👨 Paar / Duo (MF / FF)", defaultBuild: "Sportliches Paar" },
                        ].map((g) => (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => {
                              setGenderCategory(g.id as any);
                              setBustOrBuild(g.defaultBuild);
                              if (g.id === "male") {
                                setIncludedServices(["Gigolo für Damen", "Begleitung für Paare (MMF)", "Dinner Dates", "Outcall", "Wellness-Massage"]);
                              }
                            }}
                            className={`p-3 rounded-xl border font-bold text-center transition-all ${
                              genderCategory === g.id
                                ? "bg-[#C69C6D] text-[#0D1B2A] border-[#C69C6D]"
                                : "bg-black/40 border-white/15 text-gray-300 hover:text-white"
                            }`}
                          >
                            {g.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button
                        type="button"
                        onClick={() => setStep(2)}
                        className="bg-[#C69C6D] text-[#0D1B2A] font-black px-6"
                      >
                        Weiter zu Schritt 2 (Name & Ort) <ArrowRight size={15} className="ml-1.5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 2: NAME, PHONE, CANTON & SPECS */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40 mb-2">
                        Schritt 2 von 5 · Steckbrief & Schweizer Region
                      </Badge>
                      <h2 className="text-2xl font-serif font-black">
                        Wie heisst du und in welcher Region empfängst/besuchst du?
                      </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-300 block mb-1">Dein Künstlername / Arbeitsname</label>
                        <input
                          type="text"
                          placeholder={genderCategory === "male" ? "z.B. Julian, Matteo, Luca..." : "z.B. Sophia, Elena, Aurelia..."}
                          value={artistName}
                          onChange={(e) => setArtistName(e.target.value)}
                          required
                          className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-2.5 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-300 block mb-1">Alter (Mindestens 18 Jahre)</label>
                        <input
                          type="number"
                          min={18}
                          max={65}
                          value={age}
                          onChange={(e) => setAge(Number(e.target.value))}
                          required
                          className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-2.5 text-sm text-white"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-gray-300 block mb-1">Schweizer Rufnummer (maskiert im Index)</label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-2.5 text-sm text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-300 block mb-1">Haupt-Kanton</label>
                        <select
                          value={canton}
                          onChange={(e) => setCanton(e.target.value)}
                          className="w-full rounded-xl bg-black/50 border border-white/20 px-3 py-2.5 text-sm text-white"
                        >
                          <option value="ZH">Zürich (ZH)</option>
                          <option value="ZG">Zug & Cham (ZG)</option>
                          <option value="BS">Basel (BS)</option>
                          <option value="BE">Bern (BE)</option>
                          <option value="LU">Luzern (LU)</option>
                          <option value="SG">St. Gallen (SG)</option>
                          <option value="AG">Aargau (AG)</option>
                          <option value="GE">Genève (GE)</option>
                          <option value="VD">Lausanne / Vaud (VD)</option>
                          <option value="TI">Lugano / Ticino (TI)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-300 block mb-1">Städte / Hotel-Radius</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="z.B. Zug, Cham, Zürich Paradeplatz"
                          className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-2.5 text-sm text-white"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-gray-300 block mb-1">Körpergrösse</label>
                        <input
                          type="text"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-2 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-300 block mb-1">Haarfarbe</label>
                        <select
                          value={hairColor}
                          onChange={(e) => setHairColor(e.target.value)}
                          className="w-full rounded-xl bg-black/50 border border-white/20 px-3 py-2 text-sm text-white"
                        >
                          <option value="Blond">Blond</option>
                          <option value="Brünett">Brünett / Braun</option>
                          <option value="Schwarz">Schwarz</option>
                          <option value="Rot">Rot</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-300 block mb-1">
                          {genderCategory === "male" ? "Statur / Figur" : "Oberweite / Körbchen"}
                        </label>
                        <input
                          type="text"
                          value={bustOrBuild}
                          onChange={(e) => setBustOrBuild(e.target.value)}
                          className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-2 text-sm text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1.5">Gesprochene Sprachen:</label>
                      <div className="flex flex-wrap gap-2">
                        {["Schweizerdeutsch", "Deutsch", "English", "Français", "Italiano", "Español"].map((lng) => {
                          const active = languages.includes(lng);
                          return (
                            <button
                              key={lng}
                              type="button"
                              onClick={() => toggleLang(lng)}
                              className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                                active ? "bg-emerald-500/20 border-emerald-400 text-emerald-300" : "bg-black/40 border-white/15 text-gray-400"
                              }`}
                            >
                              {active ? "✓ " : "+ "}{lng}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-2 flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(1)} className="border-white/20 text-white">
                        <ArrowLeft size={14} className="mr-1.5" /> Zurück
                      </Button>
                      <Button type="button" onClick={() => setStep(3)} className="bg-[#C69C6D] text-[#0D1B2A] font-black">
                        Weiter zu Schritt 3 (Preise & Services) <ArrowRight size={14} className="ml-1.5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 3: RATES, SERVICES & LIVE-CAM TOGGLE */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div>
                      <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40 mb-2">
                        Schritt 3 von 5 · Deine Fixpreis-Honorare (0% Provision)
                      </Badge>
                      <h2 className="text-2xl font-serif font-black">
                        Was kostet ein Treffen mit dir und was ist inklusive?
                      </h2>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-gray-300 block mb-1">30 Min. Schnupper-Date (CHF)</label>
                        <input
                          type="number"
                          value={rate30}
                          onChange={(e) => setRate30(Number(e.target.value))}
                          className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-2.5 text-base font-black text-[#D5A021]"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-300 block mb-1">60 Min. Standard (CHF)</label>
                        <input
                          type="number"
                          value={rate60}
                          onChange={(e) => setRate60(Number(e.target.value))}
                          className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-2.5 text-base font-black text-[#D5A021]"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-300 block mb-1">2 Stunden VIP-Date (CHF)</label>
                        <input
                          type="number"
                          value={rate120}
                          onChange={(e) => setRate120(Number(e.target.value))}
                          className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-2.5 text-base font-black text-[#D5A021]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 font-bold block mb-2">
                        Welche Leistungen sind in deinem Grundtarif bereits inklusive (CHF 0 Aufpreis)?
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {(genderCategory === "male"
                          ? [
                              "Gigolo für Damen",
                              "Begleitung für Paare (MMF)",
                              "Callboy (Herren / Bi)",
                              "Dinner Dates",
                              "Outcall",
                              "Wellness-Massage",
                              "Overnight",
                              "Reisebegleitung",
                            ]
                          : [
                              "GFE",
                              "Französisch Pur",
                              "Küssen",
                              "Dinner Dates",
                              "Outcall",
                              "Massage",
                              "69",
                              "Begleitung für Paare",
                              "Overnight",
                            ]
                        ).map((srv) => {
                          const active = includedServices.includes(srv);
                          return (
                            <button
                              key={srv}
                              type="button"
                              onClick={() => toggleService(srv)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                                active
                                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                                  : "bg-black/40 border-white/15 text-gray-400"
                              }`}
                            >
                              {active ? "✓ " : "+ "}{srv}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 pt-2">
                      <label className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40 flex items-start gap-2.5 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={enableLiveCamCheck}
                          onChange={(e) => setEnableLiveCamCheck(e.target.checked)}
                          className="mt-1 accent-rose-500"
                        />
                        <div>
                          <strong className="text-rose-300 block">🔴 3-Minuten 1:1 Live-Cam Check anbieten (CHF 29)</strong>
                          <span className="text-gray-300">Verdiene extra an kurzen Vorab-Video-Checks (80% Auszahlung an dich).</span>
                        </div>
                      </label>

                      <label className="p-3.5 rounded-xl bg-amber-950/30 border border-[#C69C6D]/40 flex items-start gap-2.5 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={enableLockedVault}
                          onChange={(e) => setEnableLockedVault(e.target.checked)}
                          className="mt-1 accent-[#C69C6D]"
                        />
                        <div>
                          <strong className="text-[#D5A021] block">🔒 Locked VIP Video-Tresor aktivieren</strong>
                          <span className="text-gray-300">Verkaufe gesperrte Vorab-Videos & Foto-Sets für CHF 19–39 direkt auf deinem Profil.</span>
                        </div>
                      </label>
                    </div>

                    <div className="pt-2 flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(2)} className="border-white/20 text-white">
                        <ArrowLeft size={14} className="mr-1.5" /> Zurück
                      </Button>
                      <Button type="button" onClick={() => setStep(4)} className="bg-[#C69C6D] text-[#0D1B2A] font-black">
                        Weiter zu Schritt 4 (Fotos & Text) <ArrowRight size={14} className="ml-1.5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 4: BIO & PHOTO */}
                {step === 4 && (
                  <div className="space-y-4">
                    <div>
                      <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40 mb-2">
                        Schritt 4 von 5 · Deine Beschreibung & Hauptbild
                      </Badge>
                      <h2 className="text-2xl font-serif font-black">
                        Stell dich deinen Gästen in 2–3 Sätzen vor
                      </h2>
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">
                        Dein Über-mich-Text (Was macht ein Date mit dir besonders?)
                      </label>
                      <textarea
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder={
                          genderCategory === "male"
                            ? "z.B. Charmanter, diskreter Schweizer Gentleman & Gigolo für stilvolle Damen, Dinner-Dates und aufgeschlossene Paare in Zürich & Zug..."
                            : "z.B. Sinnliche, humorvolle Begleiterin in Zürich & Zug. Ich empfange dich völlig diskret im privaten Apartment oder besuche dich im Hotel..."
                        }
                        className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">
                        Link zu deinem Haupt-Profilbild (optional – kann jederzeit im Dashboard hochgeladen/geändert werden)
                      </label>
                      <input
                        type="text"
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        placeholder="https://... (oder leer lassen für edles Starter-Porträt)"
                        className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>

                    <div className="pt-2 flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(3)} className="border-white/20 text-white">
                        <ArrowLeft size={14} className="mr-1.5" /> Zurück
                      </Button>
                      <Button type="button" onClick={() => setStep(5)} className="bg-[#C69C6D] text-[#0D1B2A] font-black">
                        Weiter zu Schritt 5 (Abschluss & Bonus) <ArrowRight size={14} className="ml-1.5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 5: DAILY CODE & INSTANT ACTIVATION */}
                {step === 5 && (
                  <div className="space-y-5">
                    <div>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-2">
                        Schritt 5 von 5 · Sofort-Aktivierung & CHF 50 Startguthaben
                      </Badge>
                      <h2 className="text-2xl font-serif font-black">
                        Dein Swiss-Shield Echtheits-Code & Gratis-Credits
                      </h2>
                    </div>

                    <div className="p-5 rounded-2xl bg-black/50 border-2 border-[#C69C6D] text-center space-y-2">
                      <div className="text-xs text-gray-400 uppercase font-bold">Dein persönlicher Verifizierungs-Code heute:</div>
                      <div className="text-3xl font-mono font-black text-[#D5A021] tracking-widest">{dailyCode}</div>
                      <p className="text-xs text-gray-300">
                        Halte diesen Code für den Echtheits-Check bereit. Dein Profil wird jetzt sofort mit <strong>1. Monat 100% kostenlos + offizieller ✓ Haken + CHF 50 Startguthaben (Wert CHF 50)</strong> im Dashboard freigeschaltet!
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs space-y-1.5">
                      <div className="font-black text-emerald-300">✓ Zusammenfassung für {artistName || (genderCategory === "male" ? "Julian" : "Sophia")}:</div>
                      <div>• Kategorie: {genderCategory === "male" ? "🤵 Gigolo / Male Escort" : genderCategory === "couple" ? "👩‍❤️‍👨 Paar / Duo" : genderCategory === "trans" ? "🏳️‍⚧️ Trans VIP" : "👩 Female Escort"}</div>
                      <div>• Region: {city} ({canton}) · Honorar: CHF {rate60} / 60 Min.</div>
                      <div>• Startbonus: 1. Monat 100% kostenlos + offizieller ✓ Haken + CHF 50 Startguthaben (CHF 50) + 80% VIP-Video-Tresor aktiv</div>
                    </div>

                    <div className="pt-2 flex justify-between gap-3">
                      <Button type="button" variant="outline" onClick={() => setStep(4)} className="border-white/20 text-white">
                        <ArrowLeft size={14} className="mr-1.5" /> Zurück
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] font-black py-6 text-sm shadow-xl"
                      >
                        <CheckCircle2 size={16} className="mr-2" />
                        Profil jetzt kostenlos aktivieren & ins Cockpit starten!
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </Card>
          </div>

          {/* Right 5 Columns: THE SWISS ONBOARDING BUDDY COACH */}
          <div className="lg:col-span-5 space-y-5">
            <Card className="bg-gradient-to-br from-[#13263B] to-[#09131E] border-2 border-[#C69C6D] p-6 rounded-2xl text-white space-y-4 sticky top-24 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#C69C6D] text-[#0D1B2A] flex items-center justify-center font-serif font-black text-xl shrink-0 shadow-lg">
                  iW
                </div>
                <div>
                  <Badge className="bg-emerald-500 text-[#0D1B2A] font-black text-[10px]">
                    ● SWISS ONBOARDING-BUDDY AKTIV
                  </Badge>
                  <h3 className="text-lg font-serif font-black mt-0.5">{activeTip.title}</h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-amber-200 font-medium leading-relaxed bg-black/40 p-3.5 rounded-xl border border-[#C69C6D]/30">
                {activeTip.greeting}
              </p>

              <ul className="space-y-2.5 text-xs text-gray-200">
                {activeTip.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>

              <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-200">
                <strong className="block text-emerald-400 mb-0.5">💡 Schweizer Insider-Tipp:</strong>
                {activeTip.proTip}
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                <span>Fragen zu Steuern, Sicherheit oder Preisen?</span>
                <Link href="/guides" className="text-[#D5A021] font-bold underline">
                  Kompletten Guide öffnen →
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}