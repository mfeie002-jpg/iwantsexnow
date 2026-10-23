/** Server-side use cases only. No route or live storage is enabled by this module.
 * resolveUser must verify the session on the server, never decode a browser claim.
 * Storage must enforce owner + draft-state predicates atomically under RLS.
 */
export type DraftFields = {
  displayAlias: string; city: string; description: string; photoRightsConfirmed: boolean;
};
export type PrivateDraft = DraftFields & { id: string; ownerId: string; state: "draft" };
export type DraftDependencies = {
  resolveUser: () => Promise<{ id: string } | null>;
  repository: {
    create: (ownerId: string, fields: DraftFields) => Promise<PrivateDraft>;
    readOwn: (id: string, ownerId: string) => Promise<PrivateDraft | null>;
    // Must UPDATE WHERE id = id AND owner_id = ownerId AND state = 'draft'.
    // Return null for missing, foreign, submitted or approved records alike.
    replaceOwnDraft: (id: string, ownerId: string, fields: DraftFields) => Promise<PrivateDraft | null>;
  };
};
export class DraftError extends Error {
  code: "UNAUTHENTICATED" | "INVALID_INPUT" | "NOT_FOUND" | "STORAGE_FAILURE";
  constructor(code: DraftError["code"]) {
    super(code);
    this.code = code;
  }
}
const fields = new Set(["displayAlias", "city", "description", "photoRightsConfirmed"]);
function parseFields(input: unknown): DraftFields {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new DraftError("INVALID_INPUT");
  const value = input as Record<string, unknown>;
  // Reject approval/ownership/consent evidence instead of silently accepting it.
  if (Object.keys(value).length !== fields.size || Object.keys(value).some(key => !fields.has(key))) {
    throw new DraftError("INVALID_INPUT");
  }
  function text(key: string, max: number, allowEmpty = false): string {
    const v = value[key];
    if (typeof v !== "string" || v.length > max || /[\u0000-\u001f\u007f]/.test(v.replace(/[\r\n\t]/g, ""))) {
      throw new DraftError("INVALID_INPUT");
    }
    const trimmed = v.trim();
    if (!allowEmpty && !trimmed) throw new DraftError("INVALID_INPUT");
    return trimmed;
  }
  if (typeof value.photoRightsConfirmed !== "boolean") throw new DraftError("INVALID_INPUT");
  return { displayAlias: text("displayAlias", 80), city: text("city", 100),
    description: text("description", 1000, true), photoRightsConfirmed: value.photoRightsConfirmed };
}
function validId(id: unknown): id is string {
  return typeof id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}
export function createDraftService(deps: DraftDependencies) {
  async function owner(): Promise<string> {
    try {
      const user = await deps.resolveUser();
      if (user && validId(user.id)) return user.id;
    } catch { /* Never expose tokens or upstream error details. */ }
    throw new DraftError("UNAUTHENTICATED");
  }
  async function store(operation: () => Promise<PrivateDraft | null>, ownerId: string, id?: string) {
    let record: PrivateDraft | null;
    try { record = await operation(); } catch { throw new DraftError("STORAGE_FAILURE"); }
    if (!record) throw new DraftError("NOT_FOUND");
    // Defense in depth: never return a foreign record or private adapter columns.
    if (record.ownerId !== ownerId || record.state !== "draft" || !validId(record.id) || (id && record.id !== id)) {
      throw new DraftError("STORAGE_FAILURE");
    }
    let safeFields: DraftFields;
    try {
      safeFields = parseFields({ displayAlias: record.displayAlias, city: record.city,
        description: record.description, photoRightsConfirmed: record.photoRightsConfirmed });
    } catch { throw new DraftError("STORAGE_FAILURE"); }
    return { id: record.id, ownerId, state: "draft" as const, ...safeFields };
  }
  return {
    async create(input: unknown) {
      const ownerId = await owner();
      const values = parseFields(input);
      return store(() => deps.repository.create(ownerId, values), ownerId);
    },
    async read(id: unknown) {
      const ownerId = await owner();
      if (!validId(id)) throw new DraftError("INVALID_INPUT");
      return store(() => deps.repository.readOwn(id, ownerId), ownerId, id);
    },
    async replace(id: unknown, input: unknown) {
      const ownerId = await owner();
      if (!validId(id)) throw new DraftError("INVALID_INPUT");
      const values = parseFields(input);
      return store(() => deps.repository.replaceOwnDraft(id, ownerId, values), ownerId, id);
    },
  };
}
