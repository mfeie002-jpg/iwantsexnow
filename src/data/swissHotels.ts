export interface SwissDiscreetHotel {
  id: string;
  name: string;
  city: string;
  canton: string;
  category: "dayuse_client" | "luxury_outcall" | "provider_apartment";
  dayUseRateChf: number;
  overnightRateChf: number;
  discretionScore: number;
  parkingToElevator: boolean;
  selfCheckIn: boolean;
  receptionPolicy: string;
  highlights: string[];
  addressArea: string;
  image: string;
  partnerVerified: boolean;
}

export const SWISS_DISCREET_HOTELS: SwissDiscreetHotel[] = [
  {
    id: "zug-park-executive",
    name: "Executive Business Suite & Day-Room Zug City",
    city: "Zug",
    canton: "ZG",
    category: "dayuse_client",
    dayUseRateChf: 150,
    overnightRateChf: 290,
    discretionScore: 9.9,
    parkingToElevator: true,
    selfCheckIn: true,
    receptionPolicy: "Direkter Lift aus der Tiefgarage auf die Etage · Kein Vorzeigen des Ausweises für Begleitpersonen nötig.",
    highlights: ["Tiefgaragen-Direktlift", "Day-Use 10:00–18:00 Uhr", "24h Digitaler Schlüssel", "Champagner-Service"],
    addressArea: "Zug Zentrum / Metalli (3 Min. ab Bahnhof Zug)",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=550&fit=crop",
    partnerVerified: true,
  },
  {
    id: "cham-lorzen-apartments",
    name: "Discreet Serviced Loft & Touring-Studio Cham",
    city: "Cham",
    canton: "ZG",
    category: "provider_apartment",
    dayUseRateChf: 130,
    overnightRateChf: 210,
    discretionScore: 9.8,
    parkingToElevator: true,
    selfCheckIn: true,
    receptionPolicy: "100% kontaktloser Self-Check-in per PIN-Code · Ideal für Escorts auf Tour oder diskrete 2-Stunden-Dates.",
    highlights: ["Für Escorts & Kunden buchbar", "Eigene Küche & Regendusche", "Besucher-Parkplätze vor der Tür", "Kein Hotel-Empfang"],
    addressArea: "Cham / Lorzenpark (Autobahnausfahrt A4/A14)",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=550&fit=crop",
    partnerVerified: true,
  },
  {
    id: "zurich-paradeplatz-boutique",
    name: "Private Luxury Hideaway Paradeplatz / Enge",
    city: "Zürich",
    canton: "ZH",
    category: "luxury_outcall",
    dayUseRateChf: 220,
    overnightRateChf: 480,
    discretionScore: 9.9,
    parkingToElevator: true,
    selfCheckIn: false,
    receptionPolicy: "Diskrete 5-Sterne-Concierge-Abwicklung · Separater Seiteneingang & VIP-Lift mit Zimmerkarten-Freigabe.",
    highlights: ["5★ Luxus-Ausstattung", "Separater VIP-Eingang", "In-Room Dining für Dinner-Dates", "Valet Parking"],
    addressArea: "Zürich Kreis 1 / Kreis 2 (Paradeplatz & See)",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=550&fit=crop",
    partnerVerified: true,
  },
  {
    id: "zurich-oerlikon-airport-dayuse",
    name: "Airport & Glattpark Day-Use Lifestyle Suites",
    city: "Zürich Oerlikon / Airport",
    canton: "ZH",
    category: "dayuse_client",
    dayUseRateChf: 125,
    overnightRateChf: 220,
    discretionScore: 9.7,
    parkingToElevator: true,
    selfCheckIn: true,
    receptionPolicy: "Schneller Check-in am Terminal · Perfekt für Tageszimmer (Day-Use) zwischen zwei Meetings oder Flügen.",
    highlights: ["Ab CHF 125 für Tages-Slot", "Grosses Parkhaus im Gebäude", "King-Size Bett & Soundproofing", "5 Min. zum Airport"],
    addressArea: "Zürich-Oerlikon / Glattpark / Kloten",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=550&fit=crop",
    partnerVerified: true,
  },
  {
    id: "zurich-seefeld-creator-suite",
    name: "Seefeld Boutique Work-Apartment (Für Models & Gigolos)",
    city: "Zürich Seefeld",
    canton: "ZH",
    category: "provider_apartment",
    dayUseRateChf: 160,
    overnightRateChf: 240,
    discretionScore: 9.8,
    parkingToElevator: false,
    selfCheckIn: true,
    receptionPolicy: "Speziell für selbstständige Begleiterinnen, Masseurinnen & Gigolos: 100% legaler Arbeits-Standort mit Code-Zugang.",
    highlights: ["Tages- oder Wochenmiete für Models", "Keine Rezeption (100% Anonym)", "Perfekte Beleuchtung für Cam/Fotos", "Zürich Kreis 8"],
    addressArea: "Zürich Seefeld / Bellevue",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=550&fit=crop",
    partnerVerified: true,
  },
  {
    id: "basel-messequartier-suite",
    name: "Swiss Border & Art-District Discreet Suites Basel",
    city: "Basel",
    canton: "BS",
    category: "dayuse_client",
    dayUseRateChf: 135,
    overnightRateChf: 250,
    discretionScore: 9.6,
    parkingToElevator: true,
    selfCheckIn: true,
    receptionPolicy: "Tiefgarage mit direktem Zimmer-Lift ohne Lobby-Kontakt · Beliebt bei Gästen aus Basel, Deutschland & Frankreich.",
    highlights: ["Kein Lobby-Kontakt", "Day-Use & Overnight", "Sowohl für Kunden als auch Touring-Models", "Nahe Messe & City"],
    addressArea: "Basel City / Messe",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=550&fit=crop",
    partnerVerified: true,
  },
];