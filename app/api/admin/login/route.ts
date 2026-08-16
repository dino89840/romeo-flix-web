import { NextRequest, NextResponse } from "next/server";
import {
  createAdminSession,
  credentialsAreValid
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const username = String(form.get("username") ?? "");
  const password = String(form.get("password") ?? "");

  if (!(await credentialsAreValid(username, password))) {
    return NextResponse.redirect(
      new URL("/admin/login?error=1", request.url),
      303
    );
  }

  const response = NextResponse.redirect(new URL("/admin", request.url), 303);

  response.cookies.set("romeo_admin", await createAdminSession(), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return response;
}
