import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import * as Dialog from "@radix-ui/react-dialog";
import { CATEGORIES, REGIONS } from "@/lib/night-catalogue";
import {
  XENIA_BUDGETS, XENIA_DEVICE_KEY, emptyXeniaChoice, restoreXeniaChoice, storeXeniaChoice, xeniaSearchHref,
  type XeniaChoice,
} from "@/lib/xenia-guide";

const QuickContext = createContext({ choice: emptyXeniaChoice(), openStep: (_step: number) => {} });
export const useQuickXenia = () => useContext(QuickContext);

export function XeniaThumbBar({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const opener = useRef<HTMLElement | null>(null);
  const [choice, setChoice] = useState<XeniaChoice>(emptyXeniaChoice);
  const [remember, setRemember] = useState(false);
  const [storageNote, setStorageNote] = useState("");
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const restore = () => {
      const saved = restoreXeniaChoice(window);
      setChoice(saved.choice);
      setRemember(saved.remember);
    };
    restore();
    const changed = (event: StorageEvent) => {
      if (event.key === XENIA_DEVICE_KEY || event.key === null) restore();
    };
    window.addEventListener("storage", changed);
    return () => window.removeEventListener("storage", changed);
  }, []);
  useEffect(() => { setOpen(false); }, [router.asPath]);

  function openStep(next: number) {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setStep(next);
    setStorageNote("");
    setOpen(true);
  }
  function save(next: XeniaChoice, persist = remember) {
    setChoice(next);
    const saved = storeXeniaChoice(window, next, persist);
    setRemember(persist && saved);
    setStorageNote(saved ? "" : "Die Speichereinstellung konnte nicht übernommen werden. Prüfe die Website-Daten deines Browsers.");
  }
  function select(next: XeniaChoice) {
    save(next);
    if (step < 2) setStep(step + 1);
    else {
      setOpen(false);
      void router.push(xeniaSearchHref(next));
    }
  }
  return <QuickContext.Provider value={{ choice, openStep }}>
    {children}
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="discovery-overlay" />
        <Dialog.Content className="xenia-sheet" onCloseAutoFocus={event => {
          event.preventDefault();
          if (opener.current?.isConnected) opener.current.focus();
        }}>
          <p className="discovery-kicker">Xenia · {step + 1} / 3</p>
          <Dialog.Title>{["Ort wählen", "Kategorie wählen", "Budget wählen"][step]}</Dialog.Title>
          <Dialog.Description>{["In welchem Kanton möchtest du suchen?", "Welcher Bereich interessiert dich?", "Der Preisfilter berücksichtigt bestätigte Honorare für 60 Minuten."][step]}</Dialog.Description>
          <div className="xenia-options">
            {step === 0 && [{ name: "Ganze Schweiz", canton: "ALL" }, ...REGIONS].map(region =>
              <button key={region.canton} aria-pressed={choice.canton === region.canton} onClick={() => select({ ...choice, canton: region.canton })}>{region.name}</button>)}
            {step === 1 && CATEGORIES.map(item =>
              <button key={item.id} aria-pressed={choice.category === item.id} onClick={() => select({ ...choice, category: item.id })}>{item.label}</button>)}
            {step === 2 && XENIA_BUDGETS.map(item =>
              <button key={item.id} aria-pressed={choice.budget === item.id} onClick={() => select({ ...choice, budget: item.id })}>{item.label}</button>)}
          </div>
          <label className="discovery-remember"><input type="checkbox" checked={remember} onChange={event => save(choice, event.target.checked)} /> Auf diesem Gerät merken</label>
          <p className="discovery-storage">{storageNote || (remember ? "Auch bei deinem nächsten Besuch verfügbar." : "Deine Auswahl gilt für diesen Tab.")}</p>
          <div className="xenia-options">
            {step > 0 && <button onClick={() => setStep(step - 1)}>Zurück</button>}
            <Dialog.Close>Schliessen</Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </QuickContext.Provider>;
}
