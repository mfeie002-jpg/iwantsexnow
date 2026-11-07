export type DoorplateState = "FREI" | "BESETZT" | "RESERVIERT" | "NEU" | "EXTERN";

export const SWISS_DOORPLATE_TOKENS = {
  conceptOneLiner:
    "Schweizer Ordnung trifft Penthouse-Rotlicht: Mechanische 3D-Messing-Studiotürschilder (FREI / BESETZT), Darkroom-Porträt-Harmonisierung und 100 % Schweizer CHF-Preistransparenz.",
  colors: {
    canvasObsidian: "#070606",
    panelAnthracite: "#100D0B",
    brassPlate: "#C8A97E",
    brassHighlight: "#EAD2AA",
    emeraldVelvet: "#0D291E",
    rubyNoir: "#3B0A0F",
    states: {
      FREI: {
        bg: "#062E22",
        border: "#10B981",
        text: "#6EE7B7",
        dot: "#22C55E",
        glow: "0 0 10px #4ADE80",
        labelDe: "FREI",
      },
      BESETZT: {
        bg: "#3B0A0F",
        border: "#DC2626",
        text: "#FCA5A5",
        dot: "#EF4444",
        glow: "0 0 10px #F87171",
        labelDe: "BESETZT",
      },
      RESERVIERT: {
        bg: "#2B2112",
        border: "#C8A97E",
        text: "#FDE68A",
        dot: "#F59E0B",
        glow: "0 0 8px #FBBF24",
        labelDe: "RESERVIERT",
      },
      NEU: {
        bg: "#172554",
        border: "#60A5FA",
        text: "#BFDBFE",
        dot: "#3B82F6",
        glow: "0 0 8px #60A5FA",
        labelDe: "NEU IM HAUS",
      },
      EXTERN: {
        bg: "#100D0B",
        border: "#876633",
        text: "#EAD2AA",
        dot: "#C8A97E",
        glow: "0 0 6px #C8A97E",
        labelDe: "VERIFIZIERT",
      },
    },
  },
  microcopyDe: {
    emptyFilter:
      "Hinter dieser Suitentür brennt heute kein Licht. Filter lockern – Zürich ist teuer, aber du willst ja nicht heiraten.",
    loadingState:
      "Messingschilder werden gedreht… Geduld ist eine Tugend, die nach 22 Uhr selten belohnt wird.",
    zeroSearch:
      "Null Treffer im Tresor. Selbst im Kanton Zug kann man nicht alles kaufen – versuch eine Nachbarstadt.",
    errorState:
      "Das Suitenschloss klemmt (Server-Fehler). Einmal neu klopfen, wir holen den Concierge.",
    successState:
      "Tür steht auf FREI. Direktes +41 WhatsApp ist offen – benimm dich wie ein Gentleman.",
  },
};