export const XENIA_STORAGE_KEY = "iwsn_xenia_choice_v1";

export type XeniaBudget = "open" | "250" | "200" | "under300" | "400";
export type XeniaChoice = { canton: string; category: string; budget: XeniaBudget };

export const XENIA_BUDGETS: { id: XeniaBudget; label: string }[] = [
  { id: "open", label: "Budget offen" },
  { id: "200", label: "Bis CHF 200" },
  { id: "250", label: "Bis CHF 250" },
  { id: "under300", label: "Unter CHF 300" },
  { id: "400", label: "Bis CHF 400" },
];

export const XENIA_DEVICE_KEY = "iwsn_xenia_opt_in_v2";
const SESSION_KEY = "iwsn_xenia_tab_v2";
type ChoiceStorage = { sessionStorage: Storage; localStorage: Storage };

export function restoreXeniaChoice(storage: ChoiceStorage) {
  let device: string | null = null;
  let session: string | null = null;
  try {
    // Previous versions wrote this key without an explicit opt-in.
    storage.localStorage.removeItem(XENIA_STORAGE_KEY);
    device = storage.localStorage.getItem(XENIA_DEVICE_KEY);
  } catch { /* The session store may still be available. */ }
  try { session = storage.sessionStorage.getItem(SESSION_KEY); } catch { /* In-memory selection still works. */ }
  return { choice: parseXeniaChoice(device ?? session), remember: device !== null };
}

export function storeXeniaChoice(storage: ChoiceStorage, choice: XeniaChoice, remember: boolean) {
  const raw = JSON.stringify(choice);
  let sessionSaved = false;
  try { storage.sessionStorage.setItem(SESSION_KEY, raw); sessionSaved = true; } catch { /* Device storage is separate. */ }
  try {
    if (remember) storage.localStorage.setItem(XENIA_DEVICE_KEY, raw);
    else storage.localStorage.removeItem(XENIA_DEVICE_KEY);
  } catch { return false; }
  return remember || sessionSaved;
}

const BUDGETS = new Set<XeniaBudget>(XENIA_BUDGETS.map((item) => item.id));

export function emptyXeniaChoice(): XeniaChoice {
  return { canton: "ALL", category: "all", budget: "open" };
}

export function parseXeniaChoice(raw: string | null): XeniaChoice {
  if (!raw) return emptyXeniaChoice();
  try {
    const data = JSON.parse(raw) as Partial<XeniaChoice>;
    const canton = typeof data.canton === "string" && /^[A-Z]{2,3}$/.test(data.canton) ? data.canton : "ALL";
    const category = typeof data.category === "string" && data.category.length <= 24 ? data.category : "all";
    const budget = BUDGETS.has(data.budget as XeniaBudget) ? (data.budget as XeniaBudget) : "open";
    return { canton, category, budget };
  } catch {
    return emptyXeniaChoice();
  }
}

export function xeniaSearchHref(choice: XeniaChoice): string {
  const params = new URLSearchParams();
  if (choice.canton && choice.canton !== "ALL") params.set("canton", choice.canton);
  if (choice.category && choice.category !== "all") params.set("category", choice.category);
  if (choice.budget === "200" || choice.budget === "250") params.set("max", choice.budget);
  if (choice.budget === "400") params.set("max", "400");
  if (choice.budget === "under300") params.set("under60", "300");
  const query = params.toString();
  return "/search" + (query ? "?" + query : "");
}

export function xeniaContextChips(pathname: string): { href: string; label: string }[] {
  if (pathname.startsWith("/profile/")) {
    return [
      { href: "/search", label: "Weitere Einträge" },
      { href: "/pricing", label: "Preise verstehen" },
      { href: "/reviews", label: "Portale" },
      { href: "/report", label: "Melden" },
    ];
  }
  if (pathname.startsWith("/clubs") || pathname.startsWith("/studios")) {
    return [
      { href: "/clubs", label: "Alle Orte" },
      { href: "/search", label: "Profile" },
      { href: "/report", label: "Eintrag korrigieren" },
    ];
  }
  if (pathname.startsWith("/reviews") || pathname.startsWith("/portalvergleich")) {
    return [
      { href: "/reviews", label: "Zehn Portale" },
      { href: "/pricing", label: "Preise" },
      { href: "/safety", label: "Vertrauen" },
      { href: "/report", label: "Korrektur" },
    ];
  }
  if (pathname.startsWith("/search") || pathname.startsWith("/escort-") || pathname.startsWith("/orte/")) {
    return [
      { href: "/search", label: "Alle Filter" },
      { href: "/regionen", label: "Regionen" },
      { href: "/kategorien", label: "Kategorien" },
      { href: "/reviews", label: "Quellen" },
    ];
  }
  return [
    { href: "/search", label: "Einträge" },
    { href: "/regionen", label: "Regionen" },
    { href: "/kategorien", label: "Kategorien" },
    { href: "/reviews", label: "Portale" },
  ];
}
