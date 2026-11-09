import React, { useEffect, useState } from "react";
import {
  DoorplateState,
  SWISS_DOORPLATE_TOKENS,
} from "@/lib/brand/doorplateTokens";

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

  useEffect(() => {
    setCurrentState(state);
  }, [state]);

  const activeState = interactiveToggle ? currentState : state;
  const cfg =
    SWISS_DOORPLATE_TOKENS.colors.states[activeState] ||
    SWISS_DOORPLATE_TOKENS.colors.states.FREI;

  const flip = () => {
    const next: DoorplateState =
      activeState === "FREI" ? "BESETZT" : "FREI";
    setCurrentState(next);
    if (onToggle) onToggle(next);
  };

  const handleFlip = (e: React.MouseEvent) => {
    if (!interactiveToggle) return;
    e.preventDefault();
    e.stopPropagation();
    flip();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!interactiveToggle) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      flip();
    }
  };

  const sizeCls =
    size === "lg"
      ? "min-h-[42px] gap-2.5 px-4 text-sm"
      : size === "md"
      ? "min-h-[36px] gap-2 px-3.5 text-[13px]"
      : "min-h-[26px] gap-1.5 px-2.5 text-[11px]";

  const interactiveCls = interactiveToggle
    ? "cursor-pointer hover:-translate-y-px hover:brightness-110 active:translate-y-px"
    : "";

  const pulseCls = activeState === "FREI" ? "animate-pulse" : "";

  return (
    <div
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
      role={interactiveToggle ? "button" : undefined}
      tabIndex={interactiveToggle ? 0 : undefined}
      aria-pressed={interactiveToggle ? activeState === "FREI" : undefined}
      aria-label={customLabel || cfg.labelDe}
      title={interactiveToggle ? "Türschild umschalten" : customLabel || cfg.labelDe}
      className={
        "relative inline-flex max-w-full select-none items-center overflow-hidden rounded-full border font-bold tabular-nums tracking-[0.02em] transition duration-200 " +
        sizeCls +
        " " +
        interactiveCls +
        " " +
        className
      }
      style={{ background: cfg.bg, borderColor: cfg.border + "aa", color: cfg.text }}
    >
      <span
        className={"h-2 w-2 shrink-0 rounded-full " + pulseCls}
        style={{ backgroundColor: cfg.dot, boxShadow: "0 0 8px " + cfg.dot + "aa" }}
      />

      {roomNumber && (
        <span className="shrink-0 rounded-full bg-black/30 px-1.5 text-[0.86em] leading-5 opacity-90">{roomNumber}</span>
      )}

      <span className="truncate">{customLabel || cfg.labelDe}</span>
    </div>
  );
}
