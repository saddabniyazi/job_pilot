import { createClient } from "@insforge/sdk";

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL;
const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY;

if (!baseUrl || !anonKey) {
  // Avoid throwing at import-time so the app can build in environments
  // where env vars are not set. Consumers will receive a safe stub
  // client that returns error objects instead of causing runtime crashes.
  // eslint-disable-next-line no-console
  console.warn(
    "Warning: InsForge env vars not set. Auth calls will be no-ops."
  );
}

const noopAuth = {
  async signInWithPassword() {
    return { error: { message: "InsForge not configured" } };
  },
  async signUp() {
    return { error: { message: "InsForge not configured" } };
  },
  async getUser() {
    return { data: { user: null } };
  },
  async signOut() {
    return { error: null };
  },
};

export const insforgeClient = baseUrl && anonKey ? createClient({ baseUrl, anonKey }) : { auth: noopAuth };

export default insforgeClient;
