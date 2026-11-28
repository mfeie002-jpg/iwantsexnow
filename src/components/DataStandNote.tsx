import React, { createContext, useContext } from "react";

export const StandLabelContext = createContext("");

export function DataStandNote({ className = "night-note", label }: { className?: string; label?: string }) {
  const fromPage = useContext(StandLabelContext);
  const text = label || fromPage;
  if (!text) return null;
  return <p className={className}>Jüngster Erfassungszeitstempel in den Einträgen: {text}.</p>;
}
