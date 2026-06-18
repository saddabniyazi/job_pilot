import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import createInsforgeServer from "../../../../lib/insforge-server";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const insforge = createInsforgeServer({
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          cookieStore.set({ name, value, ...options });
        },
        remove: (name: string, options: any) => {
          cookieStore.delete(name);
        },
      },
    });
    await insforge.auth.signOut();
  } catch (e) {
    // ignore
  }

  const res = NextResponse.json({ ok: true });
  return res;
}
