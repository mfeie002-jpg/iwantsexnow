import { useCallback, useEffect, useState } from "react";

export const DISCREET_KEY = "iwsn_discreet";
export const DISCREET_EVENT = "iwsn-discreet-changed";
export const NEUTRAL_TITLE = "Lesezeichen";

export function readDiscreet(): boolean {
  try {
    return localStorage.getItem(DISCREET_KEY) === "on";
  } catch {
    return false;
  }
}

export function applyDiscreet(on: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("iw-discreet", on);
  if (on) document.title = NEUTRAL_TITLE;
}

export function setDiscreet(on: boolean) {
  try {
    localStorage.setItem(DISCREET_KEY, on ? "on" : "off");
    if (on) {
      localStorage.removeItem("ch_recent_searches");
      localStorage.removeItem("iwsn_recent_searches");
    }
  } catch {}
  applyDiscreet(on);
  try {
    window.dispatchEvent(new Event(DISCREET_EVENT));
  } catch {}
}

export function useDiscreet(): [boolean, () => void] {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const sync = () => setOn(readDiscreet());
    sync();
    window.addEventListener(DISCREET_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(DISCREET_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback(() => setDiscreet(!readDiscreet()), []);
  return [on, toggle];
}
