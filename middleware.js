import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";

// ✅ Verify JWT in middleware (Edge-safe)
async function verifyToken(token) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = verifyJwt(token, secret);
  return payload;
}

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  // ✅ Public auth pages (never protect)
  const isPublicAuthPage =
    path === "/recruiter-login" ||
    path.startsWith("/recruiter-login/") ||
    path === "/seeker-login" ||
    path.startsWith("/seeker-login/") ||
    path.startsWith("/recruiter/forgot-password") ||
    path.startsWith("/recruiter/reset") ||
    path.startsWith("/seeker/forgot-password") ||
    path.startsWith("/seeker/reset");

  if (isPublicAuthPage) {
    return NextResponse.next();
  }

  // ---------------- Recruiter Protected Area ----------------
  const isRecruiterArea = path === "/overview" || path.startsWith("/recruiter");

  if (isRecruiterArea) {
    const token = request.cookies.get("recruiter_token")?.value;

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/recruiter-login";
      return NextResponse.redirect(url);
    }

    try {
      const payload = await verifyToken(token);

      if (payload?.role !== "recruiter" || !payload?.recruiter_id) {
        throw new Error("Invalid recruiter token");
      }

      return NextResponse.next();
    } catch {
      const url = request.nextUrl.clone();
      url.pathname = "/recruiter-login";
      return NextResponse.redirect(url);
    }
  }

  // ---------------- Seeker Protected Area ----------------
  if (path.startsWith("/seeker")) {
    const token = request.cookies.get("seeker_token")?.value;

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/seeker-login";
      return NextResponse.redirect(url);
    }

    try {
      const payload = await verifyToken(token);

      if (payload?.role !== "seeker" || !payload?.seeker_id) {
        throw new Error("Invalid seeker token");
      }

      return NextResponse.next();
    } catch {
      const url = request.nextUrl.clone();
      url.pathname = "/seeker-login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/overview",
    "/recruiter/:path*",
    "/seeker/:path*",
  ],
};
