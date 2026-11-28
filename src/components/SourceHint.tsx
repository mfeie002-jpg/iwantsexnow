import React, { useId, useState } from "react";
import { formatStandDate } from "@/lib/honesty";

export function SourceHint({ source, date }: { source?: string; date?: string }) {
  const [open, setOpen] = useState(false);
  const noteId = useId();
  const shown = formatStandDate(date);
  return (
    <span className="xenia-hint">
      <button type="button" aria-expanded={open} aria-controls={noteId} aria-label="Herkunft und Datum dieser Angabe" onClick={(event) => { event.preventDefault(); event.stopPropagation(); setOpen((value) => !value); }}>?</button>
      {open && <span role="note" id={noteId}>Quelle: {source || "nicht angegeben"}.{shown ? ` Erfasst: ${shown}.` : " Kein Erfassungsdatum an diesem Eintrag."}</span>}
    </span>
  );
}
