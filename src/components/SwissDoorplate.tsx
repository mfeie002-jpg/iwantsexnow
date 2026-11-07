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
      ? "min-h-[38px] text-[10px] tracking-[0.16em]"
      : size === "md"
      ? "min-h-[31px] text-[9px] tracking-[0.14em]"
      : "min-h-[25px] text-[8px] tracking-[0.11em]";

  const innerPadding =
    size === "lg"
      ? "px-3 py-2"
      : size === "md"
      ? "px-2.5 py-1.5"
      : "px-2 py-1";

  const interactiveCls = interactiveToggle
    ? "cursor-pointer hover:-translate-y-px hover:brightness-110 active:translate-y-px"
    : "";

  const pulseCls = activeState === "FREI" ? "animate-pulse" : "";
  const plateClass =
    "relative inline-flex max-w-full select-none items-center overflow-hidden rounded-[5px] border font-mono tabular-nums font-semibold uppercase transition duration-200 " +
    sizeCls +
    " " +
    interactiveCls +
    " " +
    className;

  const enamelStyle: React.CSSProperties = {
    background:
      "linear-gradient(180deg, rgba(255,245,220,0.055), transparent 38%), " +
      cfg.bg,
    borderColor: cfg.border + "66",
    color: cfg.text,
  };

  const ledStyle: React.CSSProperties = {
    backgroundColor: cfg.dot,
    boxShadow:
      "0 0 5px " +
      cfg.dot +
      ", 0 0 12px " +
      cfg.dot +
      "55, inset 0 1px 0 rgba(255,255,255,0.55)",
  };

  return (
    <div
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
      role={interactiveToggle ? "button" : undefined}
      tabIndex={interactiveToggle ? 0 : undefined}
      aria-pressed={
        interactiveToggle ? activeState === "FREI" : undefined
      }
      aria-label={customLabel || cfg.labelDe}
      title={
        interactiveToggle
          ? "Mechanisches Türschild umschalten"
          : customLabel || cfg.labelDe
      }
      className={plateClass}
      style={{
        borderColor: "rgba(222,195,147,0.5)",
        background:
          "linear-gradient(135deg, #DEC393 0%, #B38E52 52%, #876633 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,245,220,0.35), inset 0 -1px 0 rgba(55,34,10,0.5), 0 6px 18px rgba(0,0,0,0.7)",
      }}
    >
      <span className="pointer-events-none absolute left-[3px] top-[3px] h-[3px] w-[3px] rounded-full bg-[#5F461F] shadow-[0_1px_0_rgba(255,245,220,0.35)]" />
      <span className="pointer-events-none absolute right-[3px] top-[3px] h-[3px] w-[3px] rounded-full bg-[#5F461F] shadow-[0_1px_0_rgba(255,245,220,0.35)]" />
      <span className="pointer-events-none absolute bottom-[3px] left-[3px] h-[3px] w-[3px] rounded-full bg-[#5F461F] shadow-[0_1px_0_rgba(255,245,220,0.25)]" />
      <span className="pointer-events-none absolute bottom-[3px] right-[3px] h-[3px] w-[3px] rounded-full bg-[#5F461F] shadow-[0_1px_0_rgba(255,245,220,0.25)]" />

      <div
        className={
          "relative m-[3px] flex min-w-0 items-center gap-1.5 rounded-[2px] border " +
          innerPadding
        }
        style={enamelStyle}
      >
        <span className="flex h-2.5 w-2.5 shrink-0 items-center justify-center rounded-full border border-[#DEC393]/35 bg-black/45 p-[2px]">
          <span
            className={"h-full w-full rounded-full " + pulseCls}
            style={ledStyle}
          />
        </span>

        {roomNumber && (
          <span className="shrink-0 border-r border-[#DEC393]/25 pr-1.5 text-[#DEC393]">
            {roomNumber}
          </span>
        )}

        <span className="truncate">{customLabel || cfg.labelDe}</span>
      </div>
    </div>
  );
}

export default SwissDoorplate;