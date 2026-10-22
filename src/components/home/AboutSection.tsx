import { Card } from "@/components/ui/card";

export function AboutSection() {
  const features = [
    {
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=300&fit=crop",
      title: "Fiktive Beispielprofile",
      description: "Stockfotos und erfundene Namen zeigen das Layout. Keine Person ist als echt geprüft.",
      color: "bg-blue-500"
    },
    {
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=300&fit=crop",
      title: "Design-Vorschau",
      description: "Die Auswahl dient ausschliesslich der Illustration. Es gibt noch keine echten Inserate.",
      color: "bg-purple-500"
    },
    {
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=300&fit=crop",
      title: "Keine privaten Nachrichten",
      description: "Nachrichten und Kontaktaufnahme sind deaktiviert. Bitte keine sensiblen Daten eingeben.",
      color: "bg-pink-500"
    },
    {
      image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=300&fit=crop",
      title: "Beispielbewertungen",
      description: "Sterne und Bewertungen sind fiktiv und stammen nicht von echten Kundinnen oder Kunden.",
      color: "bg-yellow-500"
    },
    {
      image: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=300&fit=crop",
      title: "Keine Live-Verfügbarkeit",
      description: "Statusanzeigen sind Demodaten. Es können keine realen Termine oder Buchungen angefragt werden.",
      color: "bg-green-500"
    },
    {
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      title: "Plattform in Vorbereitung",
      description: "Betreiberangaben, Prüfprozesse und verbindliche Bedingungen müssen vor dem Produktivstart vorliegen.",
      color: "bg-orange-500"
    }
  ];

  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Was diese Vorschau zeigt
            </h2>
            <p className="text-xl text-gray-300">
              Ein Konzept mit Beispieldaten – noch kein aktiver Vermittlungsbetrieb
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <Card key={idx} className="overflow-hidden bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 ${feature.color} opacity-30 group-hover:opacity-20 transition-opacity duration-300`} />
                </div>
                <div className="p-6 relative">
                  <div className={`absolute top-0 left-0 w-full h-1 ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">{feature.title}</h3>
                  <p className="text-gray-300 group-hover:text-white transition-colors">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}