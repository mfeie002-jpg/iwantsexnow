export type DoorplateState = "FREI" | "BESETZT" | "RESERVIERT" | "NEU" | "EXTERN";

export const SWISS_DOORPLATE_TOKENS = {
  conceptOneLiner: "Schweizer Ordnung trifft Rotlicht: Strenges Raster, präzise Typografie und mechanische Studiotür-Schilder (FREI / BESETZT) als unverwechselbare Signatur.",
  colors: {
    canvasObsidian: "#090A0F",
    panelAnthracite: "#11131C",
    brassPlate: "#C8A97E",
    heatSignalRed: "#991B1B",
    states: {
      FREI: { bg: "#062E22", border: "#10B981", text: "#6EE7B7", dot: "#10B981", labelDe: "FREI · 4H LIVE" },
      BESETZT: { bg: "#3B0A0F", border: "#DC2626", text: "#FCA5A5", dot: "#EF4444", labelDe: "BESETZT" },
      RESERVIERT: { bg: "#2B2112", border: "#C8A97E", text: "#FDE68A", dot: "#F59E0B", labelDe: "RESERVIERT" },
      NEU: { bg: "#172554", border: "#60A5FA", text: "#BFDBFE", dot: "#3B82F6", labelDe: "NEU IM HAUS" },
      EXTERN: { bg: "#0D111A", border: "#475569", text: "#CBD5E1", dot: "#94A3B8", labelDe: "INDEX-QUELLE" },
    },
  },
  microcopyDe: {
    emptyFilter: "Hinter dieser Tür brennt heute kein Licht. Filter lockern – Zürich ist teuer, aber du willst ja nicht heiraten.",
    loadingState: "Türschilder werden gedreht… Geduld ist eine Tugend, die nach 22 Uhr selten belohnt wird.",
    zeroSearch: "Null Treffer. Selbst im Kanton Zug kann man nicht alles kaufen – versuch eine Nachbarstadt.",
    errorState: "Das Schloss klemmt (Server-Fehler). Einmal neu klopfen, wir holen den Hausmeister.",
    successState: "Tür steht auf FREI. Direktes +41 WhatsApp ist offen – benimm dich wie ein Gentleman.",
  },
};