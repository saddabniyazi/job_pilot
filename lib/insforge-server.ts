import { createServerClient } from "@insforge/sdk/ssr";

export function createInsforgeServer(options: Record<string, any> = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL;
  const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY;
  if (!baseUrl || !anonKey) {
    throw new Error("Missing InsForge env vars NEXT_PUBLIC_INSFORGE_URL or NEXT_PUBLIC_INSFORGE_ANON_KEY");
  }

  return createServerClient({ baseUrl, anonKey, ...options });
}

export default createInsforgeServer;
