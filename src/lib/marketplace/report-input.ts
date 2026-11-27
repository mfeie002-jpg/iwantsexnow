export type ReportFields = { profileId: string; sourceUrl: string; reason: string; contact: string };
export type ReportInputField = "profileId" | "sourceUrl" | "reason" | "contact" | "form";
export type ReportInputResult = { ok: true; value: ReportFields } | { ok: false; field: ReportInputField; message: string };

// A random per-submission capability, never a profile ID or a public case number.
export function isReportSubmissionKey(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

const invalid = (field: ReportInputField, message: string): ReportInputResult => ({ ok: false, field, message });
const controls = /[\u0000-\u001f\u007f]/;

// Reporting references are validated as text only; this function never resolves or fetches URLs.
export function validateReportInput(input: unknown): ReportInputResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) return invalid("form", "Bitte prüfe deine Angaben.");
  const raw = input as Record<string, unknown>;
  const limits = { profileId: 150, sourceUrl: 500, reason: 500, details: 500, contact: 120 } as const;
  const text: Record<keyof typeof limits, string> = { profileId: "", sourceUrl: "", reason: "", details: "", contact: "" };
  for (const key of Object.keys(limits) as Array<keyof typeof limits>) {
    const value = raw[key];
    const field = key === "details" ? "reason" : key;
    if (value === undefined) continue;
    if (typeof value !== "string") return invalid(field, "Bitte verwende Text für diese Angabe.");
    if (value.length > limits[key]) return invalid(field, `Diese Angabe darf höchstens ${limits[key]} Zeichen enthalten.`);
    text[key] = value.trim();
  }
  if (controls.test(text.profileId)) return invalid("profileId", "Bitte prüfe die Profil-ID.");
  if (text.sourceUrl) {
    if (controls.test(raw.sourceUrl as string) || !/^https?:\/\//i.test(text.sourceUrl)) {
      return invalid("sourceUrl", "Bitte gib eine vollständige http://- oder https://-Adresse an.");
    }
    try {
      const url = new URL(text.sourceUrl);
      if (!url.hostname || !["http:", "https:"].includes(url.protocol) || url.username || url.password) {
        return invalid("sourceUrl", "Bitte verwende eine Webadresse ohne Zugangsdaten.");
      }
    } catch {
      return invalid("sourceUrl", "Bitte gib eine gültige Webadresse an.");
    }
  }
  if (!text.profileId && !text.sourceUrl) return invalid("profileId", "Bitte gib eine Profil-ID oder einen Link zur betroffenen Seite an.");
  const reason = [text.reason, text.details].filter(Boolean).join(" | ");
  if (reason.length < 5 || reason.length > 500) return invalid("reason", "Der Meldegrund darf zusammen mit der Erläuterung 5 bis 500 Zeichen enthalten.");
  return { ok: true, value: { profileId: text.profileId, sourceUrl: text.sourceUrl, reason, contact: text.contact } };
}
