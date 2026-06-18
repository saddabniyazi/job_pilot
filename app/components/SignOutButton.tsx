"use client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    router.replace("/");
  }

  return (
    <button onClick={handleSignOut} className="rounded-md bg-surface px-3 py-1 text-sm">
      Sign out
    </button>
  );
}
