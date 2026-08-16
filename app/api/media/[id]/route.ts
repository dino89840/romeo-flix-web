import { NextRequest } from "next/server";
import { getMovieById } from "@/lib/db";
import {
  validateMediaOrigin,
  verifyMediaSignature
} from "@/lib/media";

async function proxyMedia(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const mode =
    request.nextUrl.searchParams.get("mode") === "download"
      ? "download"
      : "stream";

  const expires = Number(request.nextUrl.searchParams.get("expires"));
  const signature = request.nextUrl.searchParams.get("signature") ?? "";

  const valid = await verifyMediaSignature(
    id,
    mode,
    expires,
    signature
  );

  if (!valid) {
    return new Response("Signed media link expired or invalid", {
      status: 403
    });
  }

  const movie = await getMovieById(id);

  if (!movie?.source_url) {
    return new Response("Media not found", { status: 404 });
  }

  if (!(await validateMediaOrigin(movie.source_url))) {
    return new Response("Media origin is not allowed", { status: 403 });
  }

  const upstreamHeaders = new Headers();

  for (const header of ["range", "if-range", "if-none-match", "if-modified-since"]) {
    const value = request.headers.get(header);
    if (value) upstreamHeaders.set(header, value);
  }

  upstreamHeaders.set(
    "accept",
    request.headers.get("accept") ?? "*/*"
  );

  const upstream = await fetch(movie.source_url, {
    method: request.method,
    headers: upstreamHeaders,
    redirect: "follow"
  });

  const responseHeaders = new Headers();

  const passthrough = [
    "content-type",
    "content-length",
    "content-range",
    "accept-ranges",
    "etag",
    "last-modified"
  ];

  for (const header of passthrough) {
    const value = upstream.headers.get(header);
    if (value) responseHeaders.set(header, value);
  }

  responseHeaders.set("Cache-Control", "private, no-store");
  responseHeaders.set("X-Content-Type-Options", "nosniff");
  responseHeaders.set("Accept-Ranges", upstream.headers.get("accept-ranges") ?? "bytes");

  if (mode === "download") {
    const filename =
      movie.download_name ||
      `${movie.slug}.${movie.source_url.split(".").pop()?.split("?")[0] || "mp4"}`;

    responseHeaders.set(
      "Content-Disposition",
      `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`
    );
  } else {
    responseHeaders.set("Content-Disposition", "inline");
  }

  return new Response(request.method === "HEAD" ? null : upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders
  });
}

export const GET = proxyMedia;
export const HEAD = proxyMedia;
