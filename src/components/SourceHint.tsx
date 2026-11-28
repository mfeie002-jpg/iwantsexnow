import React, { useId, useState } from "react";
import { formatStandDate } from "@/lib/honesty";

export function SourceHint({ source, date, kind = "source" }: { source?: string; date?: string; kind?: "source" | "confirmed" | "estimate" }) {
  const [open, setOpen] = useState(false);
  const noteId = useId();
  const shown = formatStandDate(date);
  const info = kind === "confirmed"
    ? "Bestätigtes Honorar." + (shown ? " Bestätigt am " + shown + "." : "")
    : kind === "estimate"
      ? "Schätzwert aus einem Standardwert oder der anderen Dauer."
      : "Quelle: " + (source || "nicht angegeben") + "." + (shown ? " Erfasst am " + shown + "." : " Erfassungsdatum offen.");
  return (
    <span className="xenia-hint">
      <button type="button" aria-expanded={open} aria-controls={noteId} aria-label="Herkunft und Datum dieser Angabe" onClick={(event) => { event.preventDefault(); event.stopPropagation(); setOpen((value) => !value); }}>?</button>
      {open && <span role="note" id={noteId}>{info}</span>}
    </span>
  );
}
