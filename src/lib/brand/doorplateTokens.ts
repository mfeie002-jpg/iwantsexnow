export type DoorplateState = "FREI" | "BESETZT" | "RESERVIERT" | "NEU" | "EXTERN";

export const SWISS_DOORPLATE_TOKENS = {
  conceptOneLiner:
    "Schweizer Ordnung trifft Penthouse-Noir: gebürstetes Messing, mechanische Studiotür-Schilder und präzise tabellarische Typografie.",
  colors: {
    canvasObsidian: "#150810",
    panelAnthracite: "#22101a",
    brassPlate: "#e8c98a",
    brassGradient: "linear-gradient(135deg, #e8c98a 0%, #d6165f 52%, #3a1325 100%)",
    emeraldEnamel: "#22101a",
    heatSignalRed: "#22101a",
    states: {
      FREI: {
        bg: "#22101a",
        border: "#4fd6a0",
        text: "#cdb5be",
        dot: "#4fd6a0",
        labelDe: "FREI · 4H LIVE",
      },
      BESETZT: {
        bg: "#22101a",
        border: "#3d2231",
        text: "#cdb5be",
        dot: "#cdb5be",
        labelDe: "BESETZT",
      },
      RESERVIERT: {
        bg: "#150810",
        border: "#e8c98a",
        text: "#d6165f",
        dot: "#d6165f",
        labelDe: "RESERVIERT",
      },
      NEU: {
        bg: "#150810",
        border: "#e8c98a",
        text: "#d6165f",
        dot: "#e8c98a",
        labelDe: "NEU IM HAUS",
      },
      EXTERN: {
        bg: "#150810",
        border: "#3d2231",
        text: "#cdb5be",
        dot: "#cdb5be",
        labelDe: "INDEX-QUELLE",
      },
    },
  },
  typography: {
    editorial: "'Playfair Display', Georgia, serif",
    interface: "'Inter', Helvetica, Arial, sans-serif",
    figures: "'IBM Plex Mono', 'SFMono-Regular', Consolas, monospace",
  },
  motion: {
    mechanical: "cubic-bezier(0.22, 1, 0.36, 1)",
    fastMs: 180,
    deliberateMs: 420,
  },
  microcopyDe: {
    emptyFilter:
      "Hinter dieser Tür brennt heute kein Licht. Filter lockern – Zürich ist teuer, aber du willst ja nicht heiraten.",
    loadingState:
      "Türschilder werden gedreht… Geduld ist eine Tugend, die nach 22 Uhr selten belohnt wird.",
    zeroSearch:
      "Null Treffer. Selbst im Kanton Zug kann man nicht alles kaufen – versuch eine Nachbarstadt.",
    errorState:
      "Das Schloss klemmt (Server-Fehler). Einmal neu klopfen, wir holen den Hausmeister.",
    successState:
      "Tür steht auf FREI. Direktes +41 WhatsApp ist offen – benimm dich wie ein Gentleman.",
  },
};