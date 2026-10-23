import test from "node:test";
import assert from "node:assert/strict";

test("integration import is safe on a build server without runtime configuration", async () => {
  const { getSupabaseClient } = await import("../src/integrations/supabase/client.ts");
  assert.throws(() => getSupabaseClient(), /BROWSER_AUTH_ONLY/);
});

test("browser auth fails closed when managed configuration is absent", async () => {
  const savedUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const savedKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const savedWindow = globalThis.window;
  try {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    globalThis.window = {};
    const { getSupabaseClient } = await import("../src/integrations/supabase/client.ts");
    assert.throws(() => getSupabaseClient(), /SUPABASE_CONFIG_MISSING/);
  } finally {
    if (savedUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = savedUrl;
    if (savedKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = savedKey;
    if (savedWindow === undefined) delete globalThis.window;
    else globalThis.window = savedWindow;
  }
});
