import { NextRequest, NextResponse } from "next/server";

/** Set or clear the `ui-lang` cookie (`en` or home), then redirect back. Country slugs stay unchanged. */
export async function GET(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get("lang");
  let redirectTo = "/";
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      const url = new URL(referer);
      if (url.origin === request.nextUrl.origin) {
        redirectTo = `${url.pathname}${url.search}`;
      }
    } catch {
      // keep home
    }
  }
  const response = NextResponse.redirect(new URL(redirectTo, request.url));
  if (lang === "en") {
    response.cookies.set("ui-lang", "en", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  } else {
    response.cookies.delete("ui-lang");
  }
  return response;
}
