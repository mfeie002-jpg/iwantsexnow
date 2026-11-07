import React, { useState } from "react";
import Link from "next/link";
import { DoorplateState, SWISS_DOORPLATE_TOKENS } from "@/lib/brand/doorplateTokens";
import { Volume2, ArrowRight } from "lucide-react";

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
  roomNumber = "SUITE 215",
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

  const interactiveCls = interactiveToggle
    ? "cursor-pointer hover:scale-[1.03] active:scale-[0.98]"
    : "";

  if (size === "lg") {
    return (
      <div
        onClick={handleFlip}
        style={{
          background: "linear-gradient(145deg, #DEC393 0%, #B38E52 50%, #7D5D2B 100%)",
          boxShadow:
            "0 12px 32px rgba(0,0,0,0.88), inset 0 1px 1px rgba(255,248,228,0.72), 0 0 24px rgba(212,175,55,0.22)",
          transition: "transform 180ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        className={
          "relative inline-flex flex-col items-center justify-between px-5 py-3 rounded-xl border border-[#F5E3B8]/65 text-[#1E1407] select-none " +
          interactiveCls +
          " " +
          className
        }
        title={interactiveToggle ? "Türschild umdrehen (FREI / BESETZT)" : undefined}
      >
        <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-b from-[#4B3616] to-[#9E7B42] p-[2px] shadow-inner flex items-center justify-center mb-1">
          <span
            className="w-full h-full rounded-full"
            style={{ backgroundColor: cfg.dot, boxShadow: cfg.glow }}
          />
        </div>

        <div className="w-full flex items-center justify-between gap-3.5 my-0.5">
          <span className="w-2 h-2 rounded-full bg-gradient-to-br from-[#FFF3D1] to-[#59401B] border border-[#3A280E] shadow-inner shrink-0" />
          <span className="font-mono text-xs font-extrabold tracking-[0.26em] text-[#1A1105] drop-shadow-[0_1px_0_rgba(255,255,255,0.45)] uppercase">
            {customLabel || cfg.labelDe}
          </span>
          <span className="w-2 h-2 rounded-full bg-gradient-to-br from-[#FFF3D1] to-[#59401B] border border-[#3A280E] shadow-inner shrink-0" />
        </div>

        <div className="w-8 h-[1px] bg-[#3A280E]/40 my-1" />
        <div className="text-[9px] font-mono font-bold tracking-[0.22em] text-[#2C1E0A] uppercase">
          {roomNumber}
        </div>
      </div>
    );
  }

  const paddingCls =
    size === "md"
      ? "px-3 py-1 text-[10px] tracking-[0.18em] rounded-[8px]"
      : "px-2.5 py-1 text-[9px] tracking-[0.16em] rounded-[7px]";

  return (
    <div
      onClick={handleFlip}
      style={{
        background: "linear-gradient(135deg, #DEC393 0%, #B69156 52%, #876633 100%)",
        boxShadow:
          "0 6px 16px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,250,230,0.65), 0 0 12px rgba(200,169,126,0.22)",
        transition: "transform 180ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      className={
        "relative inline-flex items-center gap-1.5 border border-[#F5E3B8]/60 text-[#1B1205] font-mono font-extrabold uppercase select-none " +
        paddingCls +
        " " +
        interactiveCls +
        " " +
        className
      }
      title={interactiveToggle ? "Türschild umdrehen (FREI / BESETZT)" : undefined}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#FFF3D1] to-[#59401B] border border-[#3B290F] shrink-0" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#4A3516] p-[1.5px] flex items-center justify-center shrink-0">
        <span
          className="w-full h-full rounded-full"
          style={{ backgroundColor: cfg.dot, boxShadow: cfg.glow }}
        />
      </span>
      <span className="text-[#1A1105] drop-shadow-[0_1px_0_rgba(255,255,255,0.45)]">
        {customLabel || cfg.labelDe}
      </span>
      {roomNumber && (
        <span className="text-[#3B280D] border-l border-[#3B280D]/35 pl-1.5 font-mono font-bold">
          {roomNumber}
        </span>
      )}
      <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#FFF3D1] to-[#59401B] border border-[#3B290F] shrink-0" />
    </div>
  );
}

export function XeniaDoorplateTeaser() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="bg-[#100D0B] border-b border-[#C8A97E]/35 px-4 py-2">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <SwissDoorplate state="FREI" roomNumber="SUITE 01" customLabel="CONCIERGE · FREI" size="sm" />
          <span className="text-[#EAD2AA] font-medium">
            „Keine Lust auf Endlos-Scrollen? Ich zeige dir in 3 Klicks, welche Suite heute Abend in deinem Kanton offen steht.“
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/fantasy-preview"
            className="brass-3d inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-[11px] uppercase tracking-wider transition"
          >
            <Volume2 size={12} />
            <span>Voice & Preview</span>
            <ArrowRight size={12} />
          </Link>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-gray-500 hover:text-[#EAD2AA] px-1.5 text-xs cursor-pointer"
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