import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createInsforgeServer from "./lib/insforge-server";

const protectedPaths = [
  "/dashboard",
  "/profile",
  "/upload-resume",
  "/agents",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (protectedPaths.some((p) => pathname.startsWith(p))) {
    let res = NextResponse.next();
    try {
      const insforge = createInsforgeServer({
        cookies: {
          get: (name: string) => req.cookies.get(name)?.value,
          set: (name: string, value: string, options: any) => {
            req.cookies.set({ name, value, ...options });
            res.cookies.set({ name, value, ...options });
          },
          remove: (name: string, options: any) => {
            req.cookies.delete(name);
            res.cookies.delete(name);
          },
        },
      });
      const { data } = await insforge.auth.getUser();
      if (!data?.user) {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(url);
      }
      return res;
    } catch (e) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/upload-resume/:path*",
    "/agents/:path*",
  ],
};
