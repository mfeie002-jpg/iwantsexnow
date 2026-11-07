import React, { useState } from "react";
import { DoorplateState, SWISS_DOORPLATE_TOKENS } from "@/lib/brand/doorplateTokens";

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

  const sizeCls =
    size === "lg"
      ? "px-3.5 py-1.5 text-[11px] tracking-[0.18em]"
      : size === "md"
      ? "px-2.5 py-1 text-[10px] tracking-[0.15em]"
      : "px-2 py-0.5 text-[9px] tracking-[0.14em]";

  const interactiveCls = interactiveToggle ? "cursor-pointer hover:scale-[1.03] active:scale-[0.98]" : "";
  const pulseCls = activeState === "FREI" ? "animate-pulse" : "";

  return (
    <div
      onClick={handleFlip}
      style={{
        backgroundColor: cfg.bg,
        borderColor: cfg.border,
        color: cfg.text,
        transition: "transform 180ms cubic-bezier(0.22, 1, 0.36, 1), background-color 180ms ease",
      }}
      className={"relative inline-flex items-center gap-1.5 rounded-[3px] border font-mono tabular-nums font-bold uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_6px_16px_rgba(0,0,0,0.75)] select-none backdrop-blur-md " + interactiveCls + " " + sizeCls + " " + className}
    >
      <span className="w-1 h-1 rounded-full bg-[#C8A97E]/80 shrink-0" />
      <span style={{ backgroundColor: cfg.dot }} className={"w-1.5 h-1.5 rounded-full shrink-0 " + pulseCls} />
      {roomNumber && (
        <span className="text-[#C8A97E] border-r border-white/20 pr-1.5 mr-0.5 font-mono">
          {roomNumber}
        </span>
      )}
      <span>{customLabel || cfg.labelDe}</span>
      <span className="w-1 h-1 rounded-full bg-[#C8A97E]/80 shrink-0" />
    </div>
  );
}

export default SwissDoorplate;