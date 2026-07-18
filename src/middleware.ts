import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Edge middleware guarding the admin area.
 *
 * We verify the signed session cookie here (jose is Edge-safe) WITHOUT a DB
 * call, so protected pages never flash before redirecting. The `/admin/login`
 * route stays public.
 */

const SESSION_COOKIE = "estate_session";

async function isAuthed(token: string | undefined): Promise<boolean> {
  if (!token || !process.env.AUTH_SECRET) return false;
  try {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const authed = await isAuthed(token);

  const isLogin = pathname === "/admin/login";

  // Authenticated users hitting the login page go straight to the dashboard.
  if (isLogin) {
    if (authed) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  // All other /admin/* routes require a valid session.
  if (!authed) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
