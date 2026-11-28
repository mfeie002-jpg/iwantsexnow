import fs from "node:fs/promises";
import http from "node:http";
import https from "node:https";
import { lookup } from "node:dns/promises";
import { BlockList, isIP } from "node:net";
import path from "node:path";
import { profilePhotoSvg } from "../components/night/profile-image-model.ts";
import { matchesRasterSignature } from "./image-file.ts";
import { getProfileId, getProfileName, getProfilePhotos, type Offer, type ProfileState } from "./night-catalogue.ts";

export const MAX_IMAGE_BYTES = 6 * 1024 * 1024;
export const FETCH_TIMEOUT_MS = 5000;
export const DEAD_URL_TTL_MS = 6 * 60 * 60 * 1000;
const MAX_REDIRECTS = 3;
const MAX_NETWORK_ATTEMPTS = 8;

const STOCK_HOSTS = new Set([
  "images.unsplash.com", "unsplash.com", "plus.unsplash.com",
  "images.pexels.com", "www.pexels.com", "pexels.com",
  "pixabay.com", "cdn.pixabay.com"
]);

const blockedIps = new BlockList();
for (const [address, prefix] of [
  ["0.0.0.0", 8], ["10.0.0.0", 8], ["100.64.0.0", 10], ["127.0.0.0", 8],
  ["169.254.0.0", 16], ["172.16.0.0", 12], ["192.0.0.0", 24], ["192.0.2.0", 24],
  ["192.168.0.0", 16], ["198.18.0.0", 15], ["198.51.100.0", 24], ["203.0.113.0", 24],
  ["224.0.0.0", 4], ["240.0.0.0", 4]
] as const) blockedIps.addSubnet(address, prefix, "ipv4");
blockedIps.addAddress("255.255.255.255", "ipv4");
for (const [address, prefix] of [
  ["::", 128], ["::1", 128], ["fc00::", 7], ["fe80::", 10], ["ff00::", 8], ["2001:db8::", 32]
] as const) blockedIps.addSubnet(address, prefix, "ipv6");

const deadUntil = new Map<string, number>();

export function ipCheckDisabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.IMG_PROXY_ALLOW_FAKE_IP === "1";
}

export function clearDeadUrlCache(): void {
  deadUntil.clear();
}

export function isPrivateOrInternalIp(ip: string): boolean {
  let value = ip.trim().toLowerCase().replace(/^\[|\]$/g, "");
  const mapped = value.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) value = mapped[1];
  const family = isIP(value);
  if (family === 0) return true;
  return blockedIps.check(value, family === 6 ? "ipv6" : "ipv4");
}

export function containsBlurPlaceholder(value: string): boolean {
  try { return decodeURIComponent(value).toLowerCase().includes("bg_blur"); }
  catch { return value.toLowerCase().includes("bg_blur"); }
}

function rememberDead(url: string, now: number): void {
  deadUntil.set(url, now + DEAD_URL_TTL_MS);
  if (deadUntil.size > 5000) {
    for (const [key, until] of deadUntil) if (until <= now) deadUntil.delete(key);
  }
}

function isDead(url: string, now: number): boolean {
  const until = deadUntil.get(url);
  if (!until) return false;
  if (until <= now) { deadUntil.delete(url); return false; }
  return true;
}

export type PhotoCatalog = {
  profiles: Map<string, { name: string; photos: string[] }>;
  allow: Set<string>;
};

const PHOTO_KEYS = ["thumbnail", "photoUrl", "imageUrl", "image", "gallery", "galleryUrls", "originalGallery", "photos"];

export function collectPhotoHosts(records: readonly Record<string, unknown>[]): Set<string> {
  const hosts = new Set<string>();
  for (const record of records) {
    for (const key of PHOTO_KEYS) {
      const value = record[key];
      const list = Array.isArray(value) ? value : [value];
      for (const item of list) {
        if (typeof item !== "string") continue;
        try {
          const url = new URL(item.trim());
          if (url.protocol !== "http:" && url.protocol !== "https:") continue;
          const host = url.hostname.toLowerCase().replace(/\.$/, "");
          if (!host || STOCK_HOSTS.has(host) || host.endsWith(".unsplash.com") || host.endsWith(".pexels.com") || host.endsWith(".pixabay.com")) continue;
          if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) continue;
          hosts.add(host);
        } catch { /* A broken photo string is not a host we trust. */ }
      }
    }
  }
  return hosts;
}

let catalogPromise: Promise<PhotoCatalog> | null = null;

export function getPhotoCatalog(): Promise<PhotoCatalog> {
  if (!catalogPromise) catalogPromise = loadPhotoCatalog().catch((error) => { catalogPromise = null; throw error; });
  return catalogPromise;
}

async function loadPhotoCatalog(): Promise<PhotoCatalog> {
  const offersMod = await import("../data/harvested-offers.json");
  const statesMod = await import("../data/managed-profile-states.json");
  const offers = (offersMod.default ?? offersMod) as Offer[];
  const states = (statesMod.default ?? statesMod) as Record<string, ProfileState>;
  const profiles = new Map<string, { name: string; photos: string[] }>();
  for (const offer of offers) {
    const id = getProfileId(offer);
    if (!id) continue;
    const state = states[id] || {};
    profiles.set(id, { name: getProfileName(offer, state), photos: getProfilePhotos(offer, state) });
  }
  return { profiles, allow: collectPhotoHosts([...offers, ...Object.values(states)]) };
}

export type UpstreamResponse = {
  status: number;
  headers: { get(name: string): string | null };
  body: Buffer;
};

export type UpstreamRequest = (url: URL, init: { signal: AbortSignal; addresses: string[] | null }) => Promise<UpstreamResponse>;

function headerLookup(headers: http.IncomingHttpHeaders): UpstreamResponse["headers"] {
  return { get: (name) => {
    const value = headers[name.toLowerCase()];
    if (Array.isArray(value)) return value[0] ?? null;
    return value ?? null;
  } };
}

export const requestAllowlistedImage: UpstreamRequest = (url, { signal, addresses }) => new Promise((resolve, reject) => {
  const lib = url.protocol === "https:" ? https : http;
  const req = lib.request(url, {
    method: "GET",
    headers: {
      "User-Agent": "iwantsexnow.ch image proxy/1.0 (+https://iwantsexnow.ch/contact)",
      Accept: "image/avif,image/webp,image/png,image/jpeg,image/gif",
      "Accept-Encoding": "identity"
    },
    agent: false,
    lookup: addresses ? (_hostname, options, callback) => {
      const address = addresses[0];
      const family = address.includes(":") ? 6 : 4;
      if (options && typeof options === "object" && "all" in options && options.all) callback(null, [{ address, family }]);
      else callback(null, address, family);
    } : undefined,
    signal,
    timeout: FETCH_TIMEOUT_MS
  }, (res) => {
    const status = res.statusCode || 0;
    if ([301, 302, 303, 307, 308].includes(status)) {
      res.resume();
      resolve({ status, headers: headerLookup(res.headers), body: Buffer.alloc(0) });
      return;
    }
    const declared = Number(res.headers["content-length"] || "0");
    if (declared > MAX_IMAGE_BYTES) {
      res.resume();
      reject(Object.assign(new Error("too big"), { permanent: true }));
      return;
    }
    const chunks: Buffer[] = [];
    let size = 0;
    res.on("data", (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_IMAGE_BYTES) {
        req.destroy();
        reject(Object.assign(new Error("too big"), { permanent: true }));
        return;
      }
      chunks.push(chunk);
    });
    res.on("end", () => resolve({ status, headers: headerLookup(res.headers), body: Buffer.concat(chunks) }));
  });
  const fail = (error: Error) => reject(error);
  req.on("error", fail);
  req.on("timeout", () => req.destroy(Object.assign(new Error("timeout"), { permanent: true })));
  req.end();
});

async function resolveHostAddresses(hostname: string): Promise<string[]> {
  const records = await lookup(hostname, { all: true, verbatim: true });
  return records.map((record) => record.address);
}

function rasterType(contentType: string): string | null {
  const type = contentType.split(";")[0].trim().toLowerCase();
  if (type === "image/jpg" || type === "image/pjpeg") return "image/jpeg";
  if (["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"].includes(type)) return type;
  return null;
}

function parseRemote(candidate: string, allow: ReadonlySet<string>): URL | null {
  let url: URL;
  try { url = new URL(candidate); } catch { return null; }
  if (!["http:", "https:"].includes(url.protocol)) return null;
  if (url.username || url.password) return null;
  if (url.port && !["80", "443"].includes(url.port)) return null;
  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  if (!allow.has(host) || containsBlurPlaceholder(url.href)) return null;
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal") || /^\d+$/.test(host)) return null;
  url.hostname = host;
  url.hash = "";
  return url;
}

async function readLocalPhoto(urlPath: string): Promise<Buffer | null> {
  const pathname = decodeURIComponent(urlPath.split("?")[0] || "");
  if (!/^\/(?:uploads|images\/(?:profiles|uploads))\//.test(pathname) || pathname.split("/").includes("..")) return null;
  const root = path.resolve(process.cwd(), "public");
  const full = path.resolve(root, `.${pathname}`);
  if (full !== root && !full.startsWith(root + path.sep)) return null;
  try {
    const bytes = await fs.readFile(full);
    return bytes.length > 0 && bytes.length <= MAX_IMAGE_BYTES ? bytes : null;
  } catch { return null; }
}

function typeForBytes(bytes: Buffer): string | null {
  for (const type of ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]) {
    if (matchesRasterSignature(bytes, type)) return type;
  }
  return null;
}

export type ProxyResult = { status: number; contentType: string; body: Buffer; cacheControl: string };

function placeholder(name: string): ProxyResult {
  return {
    status: 200,
    contentType: "image/svg+xml; charset=utf-8",
    body: Buffer.from(profilePhotoSvg(name)),
    cacheControl: "public, max-age=600"
  };
}

const missing: ProxyResult = { status: 404, contentType: "text/plain", body: Buffer.alloc(0), cacheControl: "no-store" };

async function fetchCandidate(start: URL, input: {
  allow: ReadonlySet<string>;
  skipIpCheck: boolean;
  request: UpstreamRequest;
  resolveHost: (hostname: string) => Promise<string[]>;
  now: number;
}): Promise<Buffer | null> {
  let current = start;
  const seen = new Set<string>();
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    if (seen.has(current.href) || isDead(current.href, input.now)) return null;
    seen.add(current.href);
    let addresses: string[] | null = null;
    if (!input.skipIpCheck) {
      try {
        addresses = await input.resolveHost(current.hostname);
      } catch {
        rememberDead(current.href, input.now);
        return null;
      }
      if (!addresses.length || addresses.some(isPrivateOrInternalIp)) {
        rememberDead(current.href, input.now);
        return null;
      }
    }
    let response: UpstreamResponse;
    try {
      response = await input.request(current, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS), addresses });
    } catch {
      rememberDead(current.href, input.now);
      return null;
    }
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) { rememberDead(current.href, input.now); return null; }
      let next: URL;
      try { next = new URL(location, current); } catch { rememberDead(current.href, input.now); return null; }
      const allowed = parseRemote(next.href, input.allow);
      if (!allowed) { rememberDead(current.href, input.now); return null; }
      current = allowed;
      continue;
    }
    const type = rasterType(response.headers.get("content-type") || "");
    if (response.status !== 200 || !type || !matchesRasterSignature(response.body, type)) {
      rememberDead(current.href, input.now);
      return null;
    }
    return response.body;
  }
  rememberDead(start.href, input.now);
  return null;
}

export async function resolveProfilePhoto(input: {
  id: string;
  index?: number;
  catalog: PhotoCatalog;
  skipIpCheck?: boolean;
  request?: UpstreamRequest;
  resolveHost?: (hostname: string) => Promise<string[]>;
  readLocal?: (pathname: string) => Promise<Buffer | null>;
  now?: number;
}): Promise<ProxyResult> {
  const profile = input.catalog.profiles.get(input.id);
  if (!profile) return missing;
  const photos = profile.photos;
  const start = input.index === undefined ? 0 : input.index;
  if (!Number.isInteger(start) || start < 0 || start >= photos.length) return placeholder(profile.name);
  const now = input.now ?? Date.now();
  const request = input.request ?? requestAllowlistedImage;
  const resolveHost = input.resolveHost ?? resolveHostAddresses;
  const readLocal = input.readLocal ?? readLocalPhoto;
  let attempts = 0;
  for (const candidate of photos.slice(start)) {
    if (containsBlurPlaceholder(candidate)) continue;
    if (candidate.startsWith("/")) {
      const local = await readLocal(candidate);
      const type = local ? typeForBytes(local) : null;
      if (local && type) {
        return { status: 200, contentType: type, body: local, cacheControl: "public, max-age=86400, stale-while-revalidate=604800" };
      }
      continue;
    }
    const remote = parseRemote(candidate, input.catalog.allow);
    if (!remote || isDead(remote.href, now)) continue;
    if (attempts >= MAX_NETWORK_ATTEMPTS) break;
    attempts += 1;
    const bytes = await fetchCandidate(remote, {
      allow: input.catalog.allow,
      skipIpCheck: input.skipIpCheck === true,
      request, resolveHost, now
    });
    if (!bytes) continue;
    const type = typeForBytes(bytes);
    if (!type) { rememberDead(remote.href, now); continue; }
    return { status: 200, contentType: type, body: bytes, cacheControl: "public, max-age=86400, stale-while-revalidate=604800" };
  }
  return placeholder(profile.name);
}
