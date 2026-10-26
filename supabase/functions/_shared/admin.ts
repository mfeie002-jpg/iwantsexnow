/** Each Edge entry point verifies a user AND an admin role before any work. */
export async function requireEdgeAdmin(req: Request): Promise<Response | null> {
  const deny = (status: number) => new Response(JSON.stringify({ error: status === 401 ? 'SESSION_REQUIRED' : status === 403 ? 'ADMIN_REQUIRED' : 'AUTH_UNAVAILABLE' }), {
    status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
  const header = req.headers.get('authorization') || '';
  if (!/^Bearer [A-Za-z0-9._~-]{50,5000}$/.test(header)) return deny(401);
  try {
    const base = new URL(Deno.env.get('SUPABASE_URL') || '');
    const key = Deno.env.get('SUPABASE_ANON_KEY');
    if (base.protocol !== 'https:' || base.username || base.password || base.pathname !== '/' || !key) return deny(503);
    const headers = { Authorization: header, apikey: key };
    const read = (url: URL) => fetch(url, { headers, redirect: 'error', signal: AbortSignal.timeout(10000) });
    const auth = await read(new URL('/auth/v1/user', base));
    if (!auth.ok) return deny(401);
    const user = await auth.json();
    if (!/^[a-f0-9]{8}-[a-f0-9-]{27}$/i.test(user?.id || '') || !user.email_confirmed_at) return deny(401);
    const rolesUrl = new URL('/rest/v1/user_roles', base);
    rolesUrl.search = new URLSearchParams({ select: 'role', user_id: 'eq.' + user.id, role: 'eq.admin', limit: '1' }).toString();
    const roleResponse = await read(rolesUrl);
    const roles = roleResponse.ok ? await roleResponse.json() : [];
    if (!Array.isArray(roles) || !roles.some(r => r?.role === 'admin')) return deny(403);
    return null;
  } catch { return deny(503); }
}
