export type DoorplateState = "FREI" | "BESETZT" | "RESERVIERT" | "NEU" | "EXTERN";

export const SWISS_DOORPLATE_TOKENS = {
  conceptOneLiner:
    "Schweizer Ordnung trifft Alpenglühen: klare Türschilder als Status-Chips, präzise tabellarische Ziffern, Nachtsee und Abendrot.",
  colors: {
    canvasObsidian: "#07141a",
    panelAnthracite: "#07141a",
    brassPlate: "#ff6b5e",
    brassGradient: "linear-gradient(135deg, #ff6b5e 0%, #e8564a 52%, #a8382e 100%)",
    emeraldEnamel: "#0d1f27",
    heatSignalRed: "#3a1830",
    states: {
      FREI: {
        bg: "#0c2e2c",
        border: "#4fd1b0",
        text: "#b8f0de",
        dot: "#4fd1b0",
        labelDe: "FREI · 4H LIVE",
      },
      BESETZT: {
        bg: "#3a1830",
        border: "#ff5a8a",
        text: "#ffc3d4",
        dot: "#ff5a8a",
        labelDe: "BESETZT",
      },
      RESERVIERT: {
        bg: "#143039",
        border: "#9fb8b5",
        text: "#d6e4e2",
        dot: "#9fb8b5",
        labelDe: "RESERVIERT",
      },
      NEU: {
        bg: "#3a2410",
        border: "#ffb067",
        text: "#ffd9a0",
        dot: "#ffb067",
        labelDe: "NEU IM HAUS",
      },
      EXTERN: {
        bg: "#0d1f27",
        border: "#6f8c93",
        text: "#b4cac8",
        dot: "#6f8c93",
        labelDe: "INDEX-QUELLE",
      },
    },
  },
  typography: {
    editorial: "'Archivo', 'Hanken Grotesk', Arial, sans-serif",
    interface: "'Hanken Grotesk', Helvetica, Arial, sans-serif",
    figures: "'Hanken Grotesk', Helvetica, Arial, sans-serif",
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