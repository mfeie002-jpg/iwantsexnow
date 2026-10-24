import { Card } from "@/components/ui/card";
import { Search, Calculator, ShieldCheck, Send, Clock, Award } from "lucide-react";

export function AboutSection() {
  const pillars = [
    {
      icon: Calculator,
      step: "01 · Transparent Total Cost",
      title: "Echte Endpreise statt Lockangebote",
      description: "Andere Portale werben mit ab-Preisen und berechnen jedes Extra vor Ort teuer nach. Unser Rechner addiert Dauer und gewünschte Services vorab zum verbindlichen Komplettpreis.",
    },
    {
      icon: ShieldCheck,
      step: "02 · Multi-Portal Deduplizierung",
      title: "47 Portale gebündelt – 0% Fake-Dubletten",
      description: "Wir gleichen Telefonnummern, Fotos und Standortdaten über 47 Schweizer Verzeichnisse ab, fassen Mehrfach-Inserate zusammen und zeigen dir sofort die Original-Quelle.",
    },
    {
      icon: Clock,
      step: "03 · Provider-Confirmed Freshness",
      title: "Bestätigte Echtzeit-Verfügbarkeit",
      description: "Keine Karteileichen und kein endloses Durchtelefonieren: Anbieterinnen bestätigen ihren Live-Status für Zürich, Zug & Umgebung aktiv mit Zeitstempel.",
    },
    {
      icon: Send,
      step: "04 · Private Enquiry Flow",
      title: "1-Klick Diskrete Direkt-Anfrage",
      description: "Statt ungeschützter Chats auf Dutzenden Seiten sendest du eine strukturierte, diskrete Anfrage mit fixiertem Gesamtpreis direkt an den verifizierten Provider.",
    },
    {
      icon: Search,
      step: "05 · Intent-Based Smart Matching",
      title: "Gezielte Auswahl statt Reizüberflutung",
      description: "Nach dem bewährten Schweizer Vergleichsprinzip filtern wir nach echtem Vorhaben, Budget, Zeitfenster und verifizierten Merkmalen.",
    },
    {
      icon: Award,
      step: "06 · Self-Service für Anbieterinnen",
      title: "Direktprofile ohne Zwischenhändler",
      description: "Verifizierte Anbieterinnen verwalten ihre Verfügbarkeit, Konditionen und qualifizierten Anfragen direkt im eigenen Provider-Dashboard.",
    },
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-[#09131E] to-[#0D1B2A]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D5A021]">
              Search → Compare → Match → Enquire
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-2 mb-4">
              Warum iWantSexNow.ch mehr kann als klassische Portale
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Wir kombinieren den Marktüberblick eines Portal-Aggregators mit der Zuverlässigkeit einer Schweizer Vergleichs- und Buchungsplattform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Card
                  key={idx}
                  className="p-6 bg-white/5 border-white/15 hover:border-[#C69C6D]/60 transition-all duration-300 text-white flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-[#D5A021] uppercase tracking-wider">
                        {item.step}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-[#C69C6D]/15 border border-[#C69C6D]/40 flex items-center justify-center text-[#D5A021]">
                        <Icon size={20} />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
