import { getEnv } from "./db";

const encoder = new TextEncoder();

function base64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";

  for (const byte of bytes) binary += String.fromCharCode(byte);

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function decodeBase64Url(value: string): Uint8Array {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);

  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function mediaKey(secret: string, usage: KeyUsage[]) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    usage
  );
}

export async function createMediaSignature(
  id: string,
  mode: "stream" | "download",
  expires: number
): Promise<string> {
  const env = await getEnv();
  const key = await mediaKey(env.MEDIA_SIGNING_SECRET, ["sign"]);
  const payload = `${id}.${mode}.${expires}`;

  return base64Url(
    await crypto.subtle.sign("HMAC", key, encoder.encode(payload))
  );
}

export async function verifyMediaSignature(
  id: string,
  mode: "stream" | "download",
  expires: number,
  signature: string
): Promise<boolean> {
  if (!Number.isFinite(expires) || expires < Date.now() / 1000) return false;
  if (expires > Date.now() / 1000 + 60 * 60 * 8) return false;

  try {
    const env = await getEnv();
    const key = await mediaKey(env.MEDIA_SIGNING_SECRET, ["verify"]);

    return crypto.subtle.verify(
      "HMAC",
      key,
      decodeBase64Url(signature),
      encoder.encode(`${id}.${mode}.${expires}`)
    );
  } catch {
    return false;
  }
}

export async function validateMediaOrigin(source: string): Promise<boolean> {
  try {
    const env = await getEnv();
    const url = new URL(source);

    if (url.protocol !== "https:") return false;
    if (url.username || url.password) return false;

    const allowedHosts = env.MEDIA_HOSTS.split(",")
      .map((host) => host.trim().toLowerCase())
      .filter(Boolean);

    return allowedHosts.some(
      (host) =>
        url.hostname.toLowerCase() === host ||
        url.hostname.toLowerCase().endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
}
