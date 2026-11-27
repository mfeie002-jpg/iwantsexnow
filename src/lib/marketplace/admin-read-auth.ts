import crypto from 'node:crypto';
export function hasAdminReadAccess(header: unknown, secret = process.env.ADMIN_PIN || ''): boolean {
  if (secret.length < 16 || typeof header !== 'string' || !header) return false;
  const expected=Buffer.from(secret),provided=Buffer.from(header);
  return expected.length===provided.length && crypto.timingSafeEqual(expected,provided);
}
