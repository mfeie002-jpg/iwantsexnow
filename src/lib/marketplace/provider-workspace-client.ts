import type { DraftFields, PrivateDraft } from "./drafts";
import { isReportSubmissionKey, validateReportInput } from "./report-input";
export const LOCAL_DRAFT_KEY = "iwsn-night-local-draft-v2";
export const emptyDraft = (): DraftFields => ({ displayAlias: "", city: "", description: "", photoRightsConfirmed: false });
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export class WorkspaceError extends Error { constructor(public status: number) { super("REQUEST_FAILED"); } }
export function safeDraftFields(input: unknown): DraftFields | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const v = input as Record<string, unknown>;
  if (typeof v.displayAlias !== "string" || v.displayAlias.length > 80 || typeof v.city !== "string" || v.city.length > 100 ||
      typeof v.description !== "string" || v.description.length > 1000 || typeof v.photoRightsConfirmed !== "boolean") return null;
  return { displayAlias: v.displayAlias, city: v.city, description: v.description, photoRightsConfirmed: v.photoRightsConfirmed };
}
export function workspaceErrorMessage(error: unknown): string {
  const status = error instanceof WorkspaceError ? error.status : 0;
  if (status === 401) return "Sitzung fehlt oder abgelaufen. Bitte erneut anmelden. Es wurde kein Speichererfolg bestätigt.";
  if (status === 404) return "Privater Zugang oder Entwurf nicht verfügbar. Ein Entwurf kann auch einem anderen Konto gehören.";
  if (status === 429) return "Zu viele Versuche. Bitte später erneut versuchen.";
  if (status === 400) return "Bitte prüfe deine Angaben. Es wurde nichts als gespeichert bestätigt.";
  return "Der Vorgang wurde nicht bestätigt. Bitte erneut versuchen. Deine Eingaben bleiben hier erhalten.";
}
export function createProviderWorkspaceClient(fetcher: typeof fetch = fetch) {
  async function request(url: string, method = "GET", body?: unknown) {
    let response: Response;
    try { response = await fetcher(url, { method, credentials: "same-origin", cache: "no-store",
      headers: body === undefined ? {} : { "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(20000) }); } catch { throw new WorkspaceError(0); }
    if (!response.ok) throw new WorkspaceError(response.status);
    try { return await response.json(); } catch { throw new WorkspaceError(502); }
  }
  function userId(data: any): string {
    if (typeof data?.userId !== "string" || !uuid.test(data.userId)) throw new WorkspaceError(502);
    return data.userId;
  }
  function draft(data: any, ownerId: string, id?: string): PrivateDraft {
    const row = data?.draft, fields = safeDraftFields(row);
    if (!row || !fields || !uuid.test(row.id) || row.ownerId !== ownerId || row.state !== "draft" || (id && id !== row.id)) throw new WorkspaceError(502);
    return { ...fields, id: row.id, ownerId, state: "draft" };
  }
  return {
    async session() { return userId(await request("/api/private/provider-session")); },
    async signIn(email: string, password: string) { return userId(await request("/api/private/provider-session", "POST", { email, password })); },
    async signOut() { if ((await request("/api/private/provider-session", "DELETE"))?.signedOut !== true) throw new WorkspaceError(502); },
    async open(ownerId: string, id: string) {
      if (!uuid.test(ownerId) || !uuid.test(id)) throw new WorkspaceError(400);
      return draft(await request("/api/private/provider-drafts?id=" + encodeURIComponent(id)), ownerId, id);
    },
    async save(ownerId: string, fields: DraftFields, id?: string) {
      const safe = safeDraftFields(fields);
      if (!uuid.test(ownerId) || !safe || !safe.displayAlias.trim() || !safe.city.trim() || (id && !uuid.test(id))) throw new WorkspaceError(400);
      return draft(await request("/api/private/provider-drafts", id ? "PUT" : "POST", id ? { id, fields: safe } : safe), ownerId, id);
    }
  };
}
async function requestReportReceipt(body: Record<string, string>, fetcher: typeof fetch) {
  let response: Response;
  try { response = await fetcher("/api/vault/metrics", { method: "POST", credentials: "omit", cache: "no-store", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body), signal: AbortSignal.timeout(20000) }); }
  catch { throw new WorkspaceError(0); }
  if (response.status !== 202) throw new WorkspaceError(response.status);
  let data: any;
  try { data = await response.json(); } catch { throw new WorkspaceError(502); }
  if (data?.ok !== true || data.status !== "RECEIVED" || typeof data.caseId !== "string" || !uuid.test(data.caseId)) throw new WorkspaceError(502);
  return data.caseId as string;
}
export async function submitProviderReport(body: { profileId: string; sourceUrl: string; reason: string; contact: string; submissionKey: string }, fetcher: typeof fetch = fetch) {
  const parsed = validateReportInput(body);
  if (parsed.ok === false || !isReportSubmissionKey(body.submissionKey)) throw new WorkspaceError(400);
  return requestReportReceipt({ action: "report_profile", ...parsed.value, submissionKey: body.submissionKey.toLowerCase() }, fetcher);
}
export async function checkProviderReportReceipt(submissionKey: string, fetcher: typeof fetch = fetch) {
  if (!isReportSubmissionKey(submissionKey)) throw new WorkspaceError(400);
  return requestReportReceipt({ action: "report_receipt", submissionKey: submissionKey.toLowerCase() }, fetcher);
}
