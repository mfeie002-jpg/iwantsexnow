export type DoorplateState = "FREI" | "BESETZT" | "RESERVIERT" | "NEU" | "EXTERN";

export const SWISS_DOORPLATE_TOKENS = {
  conceptOneLiner:
    "Schweizer Ordnung trifft Penthouse-Noir: gebürstetes Messing, mechanische Studiotür-Schilder und präzise tabellarische Typografie.",
  colors: {
    canvasObsidian: "#07141a",
    panelAnthracite: "#07141a",
    brassPlate: "#ff6b5e",
    brassGradient: "linear-gradient(135deg, #ff6b5e 0%, #e8564a 52%, #a8382e 100%)",
    emeraldEnamel: "#0d1f27",
    heatSignalRed: "#3a1830",
    states: {
      FREI: {
        bg: "#0d1f27",
        border: "#4fd1b0",
        text: "#B8E4D1",
        dot: "#4fd1b0",
        labelDe: "FREI · 4H LIVE",
      },
      BESETZT: {
        bg: "#3a1830",
        border: "#9F343B",
        text: "#E4B4B6",
        dot: "#DC4148",
        labelDe: "BESETZT",
      },
      RESERVIERT: {
        bg: "#5a2a24",
        border: "#ff6b5e",
        text: "#ff6b5e",
        dot: "#ff6b5e",
        labelDe: "RESERVIERT",
      },
      NEU: {
        bg: "#5a2a24",
        border: "#ff6b5e",
        text: "#ff6b5e",
        dot: "#ff6b5e",
        labelDe: "NEU IM HAUS",
      },
      EXTERN: {
        bg: "#07141a",
        border: "#6f8c93",
        text: "#6f8c93",
        dot: "#6f8c93",
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