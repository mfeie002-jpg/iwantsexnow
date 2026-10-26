export interface NormalizedSwissLocation {
  cleanCity: string;
  trueCanton: string;
  languageRegion: "de" | "fr" | "it";
}

const SWISS_GEO_DICTIONARY: Array<{
  matches: string[];
  cleanCity: string;
  canton: string;
  lang: "de" | "fr" | "it";
}> = [
  // GENÈVE (GE) - Inkl. englischer Schreibweise "Geneva" & allen Genfer Quartieren!
  {
    matches: [
      "geneva", "genève", "geneve", "genf", "champel", "carouge", "servette",
      "plainpalais", "eaux-vives", "eaux vives", "paquis", "pâquis", "florissant",
      "meyrin", "vernier", "lancy", "onex", "chêne", "chene", "cointrin", "cornavin"
    ],
    cleanCity: "Genève",
    canton: "GE",
    lang: "fr",
  },
  // VAUD / LAUSANNE (VD)
  {
    matches: [
      "lausanne", "ouchy", "flon", "renens", "pully", "morges", "nyon", "vevey",
      "montreux", "yverdon", "aigle", "prilly", "ecublens", "crissier", "vaud", "waadt"
    ],
    cleanCity: "Lausanne",
    canton: "VD",
    lang: "fr",
  },
  // VALAIS / FRIBOURG / NEUCHÂTEL / JURA (Romandie)
  {
    matches: ["sion", "sierre", "martigny", "monthey", "brig", "visp", "crans-montana", "verbier", "zermatt", "valais", "wallis"],
    cleanCity: "Sion / Valais",
    canton: "VS",
    lang: "fr",
  },
  {
    matches: ["fribourg", "freiburg", "bulle", "murten", "morat", "estavayer"],
    cleanCity: "Fribourg",
    canton: "FR",
    lang: "fr",
  },
  {
    matches: ["neuchâtel", "neuchatel", "neuenburg", "la chaux-de-fonds", "le locle"],
    cleanCity: "Neuchâtel",
    canton: "NE",
    lang: "fr",
  },
  // TICINO / LUGANO (IT) - Strikt Schweizer Tessin!
  {
    matches: [
      "lugano", "paradiso", "massagno", "locarno", "ascona", "bellinzona",
      "mendrisio", "chiasso", "biasca", "giubiasco", "minusio", "ticino", "tessin"
    ],
    cleanCity: "Lugano",
    canton: "TI",
    lang: "it",
  },
  // LUZERN (LU)
  {
    matches: ["luzern", "lucerne", "emmen", "emmenbrücke", "emmenbrucke", "kriens", "horw", "sursee", "sempach", "ebikon", "meggen", "root"],
    cleanCity: "Luzern",
    canton: "LU",
    lang: "de",
  },
  // ZUG (ZG)
  {
    matches: ["zug", "cham", "baar", "rotkreuz", "risch", "steinhausen", "unterägeri", "oberägeri", "walchwil", "hünenberg"],
    cleanCity: "Zug",
    canton: "ZG",
    lang: "de",
  },
  // BASEL (BS / BL)
  {
    matches: ["basel", "bâle", "riehen", "allschwil", "binningen", "muttenz", "pratteln", "liestal", "reinach", "birsfelden", "laufen"],
    cleanCity: "Basel",
    canton: "BS",
    lang: "de",
  },
  // AARGAU (AG)
  {
    matches: [
      "aarau", "baden", "wettingen", "spreitenbach", "menziken", "oftringen", "zofingen",
      "lenzburg", "wohlen", "brugg", "rheinfelden", "riniken", "schafisheim", "muri",
      "hunzenschwil", "kölliken", "suhr", "buchs ag", "neuenhof", " Rothrist"
    ],
    cleanCity: "Aarau / Baden",
    canton: "AG",
    lang: "de",
  },
  // BERN (BE)
  {
    matches: ["bern", "berne", "biel", "bienne", "thun", "interlaken", "burgdorf", "langenthal", "spiez", "köniz", "ostermundigen", "muri bei bern", "ittigen", "lyss", "niederbipp"],
    cleanCity: "Bern",
    canton: "BE",
    lang: "de",
  },
  // ST. GALLEN (SG)
  {
    matches: ["st. gallen", "st gallen", "sankt gallen", "wil", "rapperswil", "jona", "buchs", "gossau", "orschach", "rorschach", "bad ragaz", "heerbrugg", "widnau", "uzwil"],
    cleanCity: "St. Gallen",
    canton: "SG",
    lang: "de",
  },
  // THURGAU (TG)
  {
    matches: ["frauenfeld", "weinfelden", "kreuzlingen", "arbon", "amriswil", "romanshorn", "sirnach"],
    cleanCity: "Frauenfeld",
    canton: "TG",
    lang: "de",
  },
  // SOLOTHURN (SO)
  {
    matches: ["solothurn", "olten", "grenchen", "härkingen", "harkingen", "zuchwil", "trimbach", "egerkingen"],
    cleanCity: "Solothurn / Olten",
    canton: "SO",
    lang: "de",
  },
  // SCHWYZ (SZ) / GRAUBÜNDEN (GR) / SCHAFFHAUSEN (SH)
  {
    matches: ["pfäffikon sz", "pfaffikon", "altendorf", "wangen", "lachen", "einsiedeln", "schwyz", "küssnacht", "arth", "goldau", "freienbach", "bäch", "wollerau"],
    cleanCity: "Pfäffikon / SZ",
    canton: "SZ",
    lang: "de",
  },
  {
    matches: ["chur", "davos", "st. moritz", "st moritz", "landquart", "ilanz", "arosa", "laax"],
    cleanCity: "Chur / Davos",
    canton: "GR",
    lang: "de",
  },
  {
    matches: ["schaffhausen", "neuhausen"],
    cleanCity: "Schaffhausen",
    canton: "SH",
    lang: "de",
  },
  // ZÜRICH (ZH)
  {
    matches: [
      "zürich", "zurich", "zuerich", "winterthur", "oerlikon", "altstetten", "seefeld",
      "wiedikon", "enge", "schlieren", "dietikon", "kloten", "opfik", "glattbrugg",
      "wallisellen", "dübendorf", "uster", "wetzikon", "bülach", "horgen", "wädenswil",
      "thalwil", "adliswil", "regensdorf", "rüti", "unterengstringen", "oberengstringen", "effretikon"
    ],
    cleanCity: "Zürich",
    canton: "ZH",
    lang: "de",
  },
];

export function normalizeSwissGeo(cityRaw: any, cantonRaw?: any): NormalizedSwissLocation {
  const rawText = String(cityRaw || "").trim();
  const firstSegment = rawText.split("/")[0].split(",")[0].replace(/\(.*?\)/g, "").trim();
  const searchHay = `${rawText} ${firstSegment}`.toLowerCase();

  const explicitCanton = String(cantonRaw || "").toUpperCase().trim();
  const matches = SWISS_GEO_DICTIONARY.flatMap(entry => entry.matches.map(keyword => ({ entry, keyword: keyword.trim().toLowerCase() })))
    .filter(({ keyword }) => {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp("(?:^|[^\\p{L}\\p{N}])" + escaped + "(?=$|[^\\p{L}\\p{N}])", "u").test(searchHay);
    }).sort((a, b) => b.keyword.length - a.keyword.length);
  if (matches.length) {
    const entry = matches[0].entry;
    const canton = entry.canton === "BS" && explicitCanton === "BL" ? "BL" : entry.canton;
    return { cleanCity: firstSegment || entry.cleanCity, trueCanton: canton, languageRegion: entry.lang };
  }
  const valid = new Set("ZH BE LU UR SZ OW NW GL ZG FR SO BS BL SH AR AI SG GR AG TG TI VD VS NE GE JU".split(" "));
  const canton = valid.has(explicitCanton) ? explicitCanton : "";
  return {
    cleanCity: firstSegment && !/^(unknown|unbekannt)$/i.test(firstSegment) ? firstSegment : "Ort unbekannt",
    trueCanton: canton,
    languageRegion: ["GE", "VD", "VS", "FR", "NE", "JU"].includes(canton) ? "fr" : canton === "TI" ? "it" : "de",
  };
}
