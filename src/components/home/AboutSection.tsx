import { ShieldCheck, Calculator, Database, Video } from "lucide-react";

export function AboutSection() {
  const pillars = [
    {
      icon: Database,
      title: "Automatischer Schweizer Dubletten-Filter",
      desc: "Wir durchsuchen xdate.ch, fgirl.ch, and6.com und Direkt-Inserate, führen mehrfach kopierte Profile unter einer Rufnummer zusammen und zeigen dir den echten Basispreis.",
    },
    {
      icon: Calculator,
      title: "100% Verbindliche Endpreis-Garantie",
      desc: "Wähle 30 Min., 60 Min. oder 2 Stunden plus deine Wunsch-Extras vorab aus. Der berechnete Komplettpreis gilt garantiert ohne Nachverhandlung im Hotel oder Studio.",
    },
    {
      icon: Video,
      title: "Vorab-Videos & 1:1 Live-Cam Vibe-Check",
      desc: "Schalte vor deiner Buchung unzensierte 4K-Originalvideos frei oder buche einen 3-Minuten 1:1 Live-Kameracheck (inkl. CHF 20 Gutschein auf dein reales Treffen).",
    },
    {
      icon: ShieldCheck,
      title: "Schweizer Datenschutz (revDSG) & Diskretion",
      desc: "Keine Weitergabe deiner Daten an Werbenetzwerke. Alle Buchungsanfragen und B2B-Transaktionen (TWINT / Swiss QR / USDT) laufen verschlüsselt.",
    },
  ];

  return (
    <section className="py-16 bg-[#07101A] border-t border-[#C69C6D]/20 text-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <div className="text-xs font-bold uppercase tracking-widest text-[#D5A021]">
            Warum iWantSexNow.ch?
          </div>
          <h2 className="text-2xl md:text-4xl font-serif font-black">
            Die erste echte Vergleichs- & Direktbuchungsmaschine der Schweiz
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#09131E] border border-[#C69C6D]/35 space-y-3 shadow-xl"
              >
                <div className="w-11 h-11 rounded-xl bg-[#C69C6D]/15 border border-[#C69C6D]/40 flex items-center justify-center text-[#D5A021]">
                  <Icon size={20} />
                </div>
                <h3 className="text-base font-bold text-white">{p.title}</h3>
                <p className="text-xs text-gray-300 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}