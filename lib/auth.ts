import { cookies } from "next/headers";
import { getEnv } from "./db";

const encoder = new TextEncoder();

function toBase64Url(input: ArrayBuffer): string {
  const bytes = new Uint8Array(input);
  let binary = "";

  for (const byte of bytes) binary += String.fromCharCode(byte);

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function fromBase64Url(input: string): Uint8Array {
  const base64 = input.replaceAll("-", "+").replaceAll("_", "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);

  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function hmac(secret: string, value: string): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );

  return crypto.subtle.sign("HMAC", key, encoder.encode(value));
}

export async function createAdminSession(): Promise<string> {
  const env = await getEnv();
  const expires = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
  const payload = `admin.${expires}`;
  const signature = toBase64Url(await hmac(env.AUTH_SECRET, payload));

  return `${expires}.${signature}`;
}

export async function verifyAdminSession(
  value?: string
): Promise<boolean> {
  if (!value) return false;

  const [expiresString, signature] = value.split(".");
  const expires = Number(expiresString);

  if (!expires || !signature || expires < Date.now() / 1000) return false;

  const env = await getEnv();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(env.AUTH_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  return crypto.subtle.verify(
    "HMAC",
    key,
    fromBase64Url(signature),
    encoder.encode(`admin.${expires}`)
  );
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifyAdminSession(store.get("romeo_admin")?.value);
}

export async function credentialsAreValid(
  username: string,
  password: string
): Promise<boolean> {
  const env = await getEnv();

  const digest = async (value: string) =>
    crypto.subtle.digest("SHA-256", encoder.encode(value));

  const [givenUser, realUser, givenPassword, realPassword] =
    await Promise.all([
      digest(username),
      digest(env.ADMIN_USERNAME),
      digest(password),
      digest(env.ADMIN_PASSWORD)
    ]);

  const equal = (a: ArrayBuffer, b: ArrayBuffer) => {
    const x = new Uint8Array(a);
    const y = new Uint8Array(b);

    if (x.length !== y.length) return false;

    let result = 0;
    for (let i = 0; i < x.length; i++) result |= x[i] ^ y[i];

    return result === 0;
  };

  return equal(givenUser, realUser) && equal(givenPassword, realPassword);
}
