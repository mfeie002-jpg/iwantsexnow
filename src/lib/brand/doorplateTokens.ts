export type DoorplateState = "FREI" | "BESETZT" | "RESERVIERT" | "NEU" | "EXTERN";

export const SWISS_DOORPLATE_TOKENS = {
  conceptOneLiner:
    "Schweizer Ordnung trifft Penthouse-Noir: gebürstetes Messing, mechanische Studiotür-Schilder und präzise tabellarische Typografie.",
  colors: {
    canvasObsidian: "#070606",
    panelAnthracite: "#100D0B",
    brassPlate: "#C8A97E",
    brassGradient: "linear-gradient(135deg, #DEC393 0%, #B38E52 52%, #876633 100%)",
    emeraldEnamel: "#0D291E",
    heatSignalRed: "#3B0A0F",
    states: {
      FREI: {
        bg: "#0D291E",
        border: "#10B981",
        text: "#B8E4D1",
        dot: "#10B981",
        labelDe: "FREI · 4H LIVE",
      },
      BESETZT: {
        bg: "#3B0A0F",
        border: "#9F343B",
        text: "#E4B4B6",
        dot: "#DC4148",
        labelDe: "BESETZT",
      },
      RESERVIERT: {
        bg: "#2B2112",
        border: "#C8A97E",
        text: "#E4C98E",
        dot: "#F59E0B",
        labelDe: "RESERVIERT",
      },
      NEU: {
        bg: "#211B14",
        border: "#DEC393",
        text: "#E8D5B1",
        dot: "#DEC393",
        labelDe: "NEU IM HAUS",
      },
      EXTERN: {
        bg: "#171411",
        border: "#6E6254",
        text: "#B9AEA0",
        dot: "#8C8174",
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