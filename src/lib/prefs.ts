import { useCallback, useEffect, useState } from "react";

export type Lang = "de" | "fr" | "it" | "en";

export const LANGS: { code: Lang; label: string }[] = [
  { code: "de", label: "DE" },
  { code: "fr", label: "FR" },
  { code: "it", label: "IT" },
  { code: "en", label: "EN" },
];

const DICT: Record<string, Record<Lang, string>> = {
  discover: { de: "Entdecken", fr: "Découvrir", it: "Scopri", en: "Discover" },
  cities: { de: "Städte", fr: "Villes", it: "Città", en: "Cities" },
  saved: { de: "Merkliste", fr: "Favoris", it: "Preferiti", en: "Saved" },
  advertise: { de: "Inserieren", fr: "Publier", it: "Inserisci", en: "Advertise" },
  discreet: { de: "Diskret-Modus", fr: "Mode discret", it: "Modalità discreta", en: "Discreet mode" },
  discreetHint: {
    de: "Neutraler Tab-Titel, Fotos erst beim Antippen",
    fr: "Titre neutre, photos floues jusqu'au toucher",
    it: "Titolo neutro, foto sfocate finché non tocchi",
    en: "Neutral tab title, photos blurred until tapped",
  },
  language: { de: "Sprache", fr: "Langue", it: "Lingua", en: "Language" },
  menu: { de: "Menü", fr: "Menu", it: "Menu", en: "Menu" },
};

export function translate(key: string, lang: Lang): string {
  return DICT[key]?.[lang] ?? DICT[key]?.de ?? key;
}

const NEUTRAL_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23666'/%3E%3C/svg%3E";

function readLS(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeLS(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

/** Applies the stored preferences to <html> and the tab. Call once in _app. */
export function applyPrefs() {
  if (typeof document === "undefined") return;
  const lang = (readLS("ch_lang") as Lang) || "de";
  document.documentElement.lang = lang === "de" ? "de-CH" : lang;
  const discreet = readLS("ch_discreet") === "on";
  document.documentElement.classList.toggle("discreet", discreet);

  let icon = document.querySelector<HTMLLinkElement>('link[rel="icon"][data-discreet]');
  if (discreet) {
    document.title = "Notizen";
    if (!icon) {
      icon = document.createElement("link");
      icon.rel = "icon";
      icon.setAttribute("data-discreet", "1");
      document.head.appendChild(icon);
    }
    icon.href = NEUTRAL_ICON;
  } else if (icon) {
    icon.remove();
  }
}

export function usePrefs() {
  const [lang, setLangState] = useState<Lang>("de");
  const [discreet, setDiscreetState] = useState(false);

  useEffect(() => {
    const sync = () => {
      setLangState(((readLS("ch_lang") as Lang) || "de"));
      setDiscreetState(readLS("ch_discreet") === "on");
    };
    sync();
    window.addEventListener("ch-prefs-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("ch-prefs-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const setLang = useCallback((l: Lang) => {
    writeLS("ch_lang", l);
    applyPrefs();
    window.dispatchEvent(new Event("ch-prefs-updated"));
  }, []);

  const setDiscreet = useCallback((on: boolean) => {
    writeLS("ch_discreet", on ? "on" : "off");
    applyPrefs();
    window.dispatchEvent(new Event("ch-prefs-updated"));
  }, []);

  const t = useCallback((key: string) => translate(key, lang), [lang]);

  return { lang, setLang, discreet, setDiscreet, t };
}
