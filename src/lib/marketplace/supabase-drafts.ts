import { createClient } from "@supabase/supabase-js";
import type { DraftDependencies, DraftFields, PrivateDraft } from "./drafts";

const columns = "id,owner_id,state,display_alias,city,description,photo_rights_attested";
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
type Config = { url: string; publicKey: string; accessToken: string };
function isPublicKey(key: string): boolean {
  if (key.startsWith("sb_publishable_")) return true;
  try { return JSON.parse(Buffer.from(key.split(".")[1], "base64url").toString()).role === "anon"; }
  catch { return false; }
}
/** Existing backend only. Never provisions resources or uses a service-role key.
 * This adapter is not exposed by any route; activation remains gated.
 */
export function supabaseDraftDependencies(config: Config, transport: typeof fetch = fetch): DraftDependencies {
  if (typeof window !== "undefined") throw new Error("SERVER_ONLY");
  const url = new URL(config.url);
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash || url.pathname !== "/") {
    throw new Error("INVALID_BACKEND_CONFIG");
  }
  if (!isPublicKey(config.publicKey) || !config.accessToken || /\s/.test(config.accessToken)) {
    throw new Error("INVALID_BACKEND_CONFIG");
  }
  const client = createClient(url.origin, config.publicKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: transport, headers: { Authorization: `Bearer ${config.accessToken}` } },
  });
  let verifiedOwner: string | null = null;
  function owner(id: string) {
    if (!verifiedOwner || verifiedOwner !== id || !uuid.test(id)) throw new Error("UNAUTHENTICATED");
  }
  const table = () => client.from("marketplace_listing_drafts");
  function values(fields: DraftFields) {
    return { display_alias: fields.displayAlias, city: fields.city, description: fields.description,
      photo_rights_attested: fields.photoRightsConfirmed };
  }
  function row(data: Record<string, unknown> | null, ownerId: string, id?: string): PrivateDraft | null {
    if (!data) return null;
    if (data.owner_id !== ownerId || data.state !== "draft" || typeof data.id !== "string" ||
      !uuid.test(data.id) || (id && data.id !== id) || typeof data.display_alias !== "string" ||
      typeof data.city !== "string" || typeof data.description !== "string" || typeof data.photo_rights_attested !== "boolean") {
      throw new Error("STORAGE_FAILURE");
    }
    return { id: data.id, ownerId, state: "draft", displayAlias: data.display_alias,
      city: data.city, description: data.description, photoRightsConfirmed: data.photo_rights_attested };
  }
  return {
    async resolveUser() {
      verifiedOwner = null;
      try {
        const { data, error } = await client.auth.getUser(config.accessToken);
        if (error || !data.user || !uuid.test(data.user.id)) return null;
        verifiedOwner = data.user.id;
        return { id: verifiedOwner };
      } catch { return null; }
    },
    repository: {
      async create(ownerId, fields) {
        owner(ownerId);
        const { data, error } = await table().insert({ owner_id: ownerId, ...values(fields) }).select(columns).single();
        if (error || !data) throw new Error("STORAGE_FAILURE");
        return row(data, ownerId) as PrivateDraft;
      },
      async readOwn(id, ownerId) {
        owner(ownerId);
        const { data, error } = await table().select(columns).eq("id", id).eq("owner_id", ownerId).eq("state", "draft").maybeSingle();
        if (error) throw new Error("STORAGE_FAILURE");
        return row(data, ownerId, id);
      },
      async replaceOwnDraft(id, ownerId, fields) {
        owner(ownerId);
        // Ownership and state are checked in the UPDATE itself, never a preceding read.
        const { data, error } = await table().update(values(fields)).eq("id", id).eq("owner_id", ownerId)
          .eq("state", "draft").select(columns);
        if (error || !Array.isArray(data) || data.length > 1) throw new Error("STORAGE_FAILURE");
        return row(data[0] ?? null, ownerId, id);
      },
    },
  };
}
