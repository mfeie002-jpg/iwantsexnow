import React, { useState } from "react";
import Link from "next/link";
import { DoorplateState, SWISS_DOORPLATE_TOKENS } from "@/lib/brand/doorplateTokens";
import { Sparkles, Volume2, ArrowRight } from "lucide-react";

interface SwissDoorplateProps {
  state?: DoorplateState;
  customLabel?: string;
  roomNumber?: string;
  size?: "sm" | "md" | "lg";
  interactiveToggle?: boolean;
  onToggle?: (nextState: DoorplateState) => void;
  className?: string;
}

export function SwissDoorplate({
  state = "FREI",
  customLabel,
  roomNumber,
  size = "sm",
  interactiveToggle = false,
  onToggle,
  className = "",
}: SwissDoorplateProps) {
  const [currentState, setCurrentState] = useState<DoorplateState>(state);
  const activeState = interactiveToggle ? currentState : state;
  const cfg = SWISS_DOORPLATE_TOKENS.colors.states[activeState] || SWISS_DOORPLATE_TOKENS.colors.states.FREI;

  const handleFlip = (e: React.MouseEvent) => {
    if (!interactiveToggle) return;
    e.preventDefault();
    e.stopPropagation();
    const next: DoorplateState = activeState === "FREI" ? "BESETZT" : "FREI";
    setCurrentState(next);
    if (onToggle) onToggle(next);
  };

  const sizeClasses =
    size === "lg"
      ? "px-3.5 py-1.5 text-xs tracking-[0.16em]"
      : size === "md"
      ? "px-2.5 py-1 text-[10px] tracking-[0.14em]"
      : "px-2 py-0.5 text-[9px] tracking-[0.12em]";

  return (
    <div
      onClick={handleFlip}
      style={{
        backgroundColor: cfg.bg,
        borderColor: cfg.border,
        color: cfg.text,
        transition: "transform 180ms cubic-bezier(0.22, 1, 0.36, 1), background-color 180ms ease",
      }}
      className={`relative inline-flex items-center gap-1.5 rounded-[4px] border font-mono font-bold uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_4px_10px_rgba(0,0,0,0.65)] select-none ${
        interactiveToggle ? "cursor-pointer hover:scale-[1.03] active:scale-[0.98]" : ""
      } ${sizeClasses} ${className}`}
      title={interactiveToggle ? "Türschild umdrehen (FREI / BESETZT)" : undefined}
    >
      {/* Linke Messing-Schraube */}
      <span className="w-1 h-1 rounded-full bg-[#C8A97E]/70 shadow-inner shrink-0" />

      {/* Leucht-Indikator */}
      <span
        style={{ backgroundColor: cfg.dot }}
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeState === "FREI" ? "animate-pulse" : ""}`}
      />

      {roomNumber && (
        <span className="text-[#C8A97E] border-r border-white/15 pr-1.5 mr-0.5 font-serif">
          {roomNumber}
        </span>
      )}

      <span>{customLabel || cfg.labelDe}</span>

      {/* Rechte Messing-Schraube */}
      <span className="w-1 h-1 rounded-full bg-[#C8A97E]/70 shadow-inner shrink-0" />
    </div>
  );
}

export function XeniaDoorplateTeaser() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="bg-[#11131C] border-b border-[#C8A97E]/35 px-4 py-2">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <SwissDoorplate state="FREI" roomNumber="TÜR 01" customLabel="XENIA & AVATARE · FREI" size="sm" />
          <span className="text-gray-200 font-medium">
            „Keine Lust auf Endlos-Scrollen? Ich ziehe dir in 3 Klicks aus der Nase, wer heute Abend in deinem Kanton wirklich frei ist.“
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/fantasy-preview"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#C8A97E] hover:bg-[#d8b98e] text-[#090A0F] font-bold text-[11px] transition"
          >
            <Volume2 size={12} />
            <span>Voice-Avatar & Preview öffnen</span>
            <ArrowRight size={12} />
          </Link>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-gray-500 hover:text-gray-300 px-1.5 text-xs cursor-pointer"
            aria-label="Türschild ausblenden"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default SwissDoorplate;