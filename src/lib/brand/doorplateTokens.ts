export type DoorplateState = "FREI" | "BESETZT" | "RESERVIERT" | "NEU" | "EXTERN";

export const SWISS_DOORPLATE_TOKENS = {
  conceptOneLiner:
    "Türschilder als kleine Papier-Etiketten: frei, besetzt, reserviert.",
  colors: {
    canvasObsidian: "#fbfaf8",
    panelAnthracite: "#ffffff",
    brassPlate: "#d92b52",
    brassGradient: "#d92b52",
    emeraldEnamel: "#ffffff",
    heatSignalRed: "#ffd3dc",
    states: {
      FREI: { bg: "#bfebd6", border: "#1e2247", text: "#1e2247", dot: "#1e8a64", labelDe: "Zeitfenster nur nach Bestätigung" },
      BESETZT: { bg: "#ffd3dc", border: "#1e2247", text: "#1e2247", dot: "#d92b52", labelDe: "BESETZT" },
      RESERVIERT: { bg: "#e1e1ec", border: "#1e2247", text: "#1e2247", dot: "#73759a", labelDe: "RESERVIERT" },
      NEU: { bg: "#ffe48a", border: "#1e2247", text: "#1e2247", dot: "#cc8400", labelDe: "NEU IM HAUS" },
      EXTERN: { bg: "#ffffff", border: "#1e2247", text: "#1e2247", dot: "#9c9dba", labelDe: "INDEX-QUELLE" },
    },
  },
  typography: {
    editorial: "'Bricolage Grotesque', 'Figtree', Arial, sans-serif",
    interface: "'Figtree', Helvetica, Arial, sans-serif",
    figures: "'Figtree', Helvetica, Arial, sans-serif",
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
      "Angaben bleiben Angaben. Ein Portal-Eintrag ist keine Live-Meldung.",
  },
};