import React, { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import * as Dialog from "@radix-ui/react-dialog";
import { CATEGORIES, REGIONS } from "@/lib/night-catalogue";
import {
  XENIA_BUDGETS, XENIA_STORAGE_KEY, emptyXeniaChoice, parseXeniaChoice, xeniaContextChips, xeniaSearchHref,
  type XeniaBudget, type XeniaChoice,
} from "@/lib/xenia-guide";
function remember(choice: XeniaChoice) {
  try { localStorage.setItem(XENIA_STORAGE_KEY, JSON.stringify(choice)); } catch { /* The choice still works for this visit. */ }
}

export function XeniaThumbBar() {
  const router = useRouter();
  const titleId = useId();
  const opener = useRef<HTMLButtonElement | null>(null);
  const [choice, setChoice] = useState<XeniaChoice>(emptyXeniaChoice);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  useEffect(() => {
    try { setChoice(parseXeniaChoice(localStorage.getItem(XENIA_STORAGE_KEY))); } catch { setChoice(emptyXeniaChoice()); }
  }, [router.asPath]);
  const save = (next: XeniaChoice) => { setChoice(next); remember(next); };
  const city = choice.canton === "ALL" ? "Ganze Schweiz" : (REGIONS.find((item) => item.canton === choice.canton)?.name || choice.canton);
  const desire = CATEGORIES.find((item) => item.id === choice.category)?.label || "Alle Bereiche";
  const budget = XENIA_BUDGETS.find((item) => item.id === choice.budget)?.label || "Budget offen";
  const chips = xeniaContextChips(router.pathname);
  const go = (next: XeniaChoice) => { save(next); setOpen(false); void router.push(xeniaSearchHref(next)); };
  return <>
    <nav className="xenia-bar" aria-label="Xenia">
      <div className="xenia-bar-row">
        <button ref={opener} type="button" className="xenia-mark" onClick={() => { setStep(0); setOpen(true); }} aria-haspopup="dialog">
          <i aria-hidden="true" />Xenia
        </button>
        <button type="button" onClick={() => { setStep(0); setOpen(true); }}>Stadt: {city}</button>
        <button type="button" onClick={() => { setStep(1); setOpen(true); }}>Lust: {desire}</button>
        <button type="button" onClick={() => { setStep(2); setOpen(true); }}>Budget: {budget}</button>
        <Link href={xeniaSearchHref(choice)}>Zeigen</Link>
      </div>
      <div className="xenia-chips" aria-label="Passende nächste Schritte">
        {chips.map((chip) => <Link key={chip.href + chip.label} href={chip.href}>{chip.label}</Link>)}
      </div>
    </nav>
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay style={{ position: "fixed", inset: 0, background: "#2b211280", zIndex: 75 }} />
        <Dialog.Content className="xenia-sheet" aria-labelledby={titleId} onCloseAutoFocus={(event) => { event.preventDefault(); opener.current?.focus(); }}>
          <p>Xenia · ohne Tippen</p>
          <Dialog.Title id={titleId}>{["Wo?", "Worauf?", "Budget und Zeit"][step]}</Dialog.Title>
          <Dialog.Description>{["Wähle eine Stadt.", "Wähle eine Kategorie.", "Wähle ein Budget. Die Zeit bleibt offen, weil niemand ein Zeitfenster bestätigt hat."][step]}</Dialog.Description>
          <div className="xenia-options">
            {step === 0 && <>
              <button type="button" onClick={() => { save({ ...choice, canton: "ALL" }); setStep(1); }}>Ganze Schweiz</button>
              {REGIONS.map((region) => <button type="button" key={region.canton} onClick={() => { save({ ...choice, canton: region.canton }); setStep(1); }}>{region.name}</button>)}
            </>}
            {step === 1 && CATEGORIES.map((item) => <button type="button" key={item.id} onClick={() => { save({ ...choice, category: item.id }); setStep(2); }}>{item.label}</button>)}
            {step === 2 && XENIA_BUDGETS.map((item) => <button type="button" key={item.id} onClick={() => go({ ...choice, budget: item.id as XeniaBudget })}>{item.label}</button>)}
          </div>
          {step === 2 && <p>Zeit: offen. «Heute frei 4 Std.» gibt es hier nicht, weil keine bestätigte Anbieter-Meldung vorliegt.</p>}
          <div className="xenia-options">
            {step > 0 && <button type="button" onClick={() => setStep((value) => value - 1)}>Zurück</button>}
            <Dialog.Close className="xenia-mark">Schliessen</Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </>;
}
