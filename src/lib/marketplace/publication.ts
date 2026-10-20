/**
 * Only a trusted server may construct evidence/approval fields. This
 * projection is a second boundary, NOT a replacement for database RLS.
 * Never use it to publish raw marketplace or Alexandria profiles.
 */
export type ProviderCandidate = {
  id: string; ownerId: string; displayAlias: string; city: string; description: string;
  origin: "first_party_opt_in" | "imported" | "demo";
  state: "draft" | "submitted" | "approved" | "rejected";
  photoRightsConfirmed: boolean;
  moderation?: { approvedBy: string; approvedAt: string } | null;
  proof?: {
    ageVerifiedAt: string; identityVerifiedAt: string;
    consentAt: string; consentVersion: string;
  } | null;
  [key: string]: unknown;
};
export type PublicProviderCard = {
  id: string; displayAlias: string; city: string; description: string;
};
const obj = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === "object" && !Array.isArray(v);
const nonempty = (v: unknown, limit: number): v is string =>
  typeof v === "string" && v.trim().length > 0 && v.length <= limit;
function evidenceDate(v: unknown, maxAgeDays: number, now: Date): boolean {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}T/.test(v)) return false;
  const n = Date.parse(v);
  return Number.isFinite(n) && n <= now.getTime() && n >= now.getTime() - maxAgeDays * 86400000;
}
/**
 * If no final legal policy version has been approved, always reject.
 */
export function mayPublishProvider(
  candidate: unknown,
  approvedPolicyVersion: string | undefined,
  now: Date = new Date(),
): boolean {
  if (!obj(candidate) || !nonempty(approvedPolicyVersion, 80)) return false;
  if (candidate.origin !== "first_party_opt_in" || candidate.state !== "approved") return false;
  if (candidate.photoRightsConfirmed !== true) return false;
  if (!nonempty(candidate.id, 100) || !nonempty(candidate.ownerId, 100)) return false;
  if (!nonempty(candidate.displayAlias, 80) || !nonempty(candidate.city, 100)) return false;
  if (!nonempty(candidate.description, 1000)) return false;
  if (!obj(candidate.moderation) || !obj(candidate.proof)) return false;
  const m = candidate.moderation, p = candidate.proof;
  if (!nonempty(m.approvedBy, 100) || m.approvedBy === candidate.ownerId) return false;
  if (!evidenceDate(m.approvedAt, 180, now)) return false;
  if (!evidenceDate(p.ageVerifiedAt, 365, now)) return false;
  if (!evidenceDate(p.identityVerifiedAt, 365, now)) return false;
  if (!evidenceDate(p.consentAt, 365, now)) return false;
  return p.consentVersion === approvedPolicyVersion;
}
/** Whitelist safe public fields. Never leak real name, contact or ID documents. */
export function toPublicProviderCard(
  candidate: unknown,
  approvedPolicyVersion: string | undefined,
  now: Date = new Date(),
): PublicProviderCard | null {
  if (!mayPublishProvider(candidate, approvedPolicyVersion, now)) return null;
  const p = candidate as ProviderCandidate;
  return {
    id: p.id,
    displayAlias: p.displayAlias.trim(),
    city: p.city.trim(),
    description: p.description.trim(),
  };
}
