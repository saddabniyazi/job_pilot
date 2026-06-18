"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import insforgeClient from "../../lib/insforge-client";
import SignOutButton from "./SignOutButton";

export default function AuthButton() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    async function check() {
      try {
        const { data, error } = await insforgeClient.auth.getCurrentUser();
        if (!mounted) return;
        if (!error && data?.user) setUser(data.user);
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    }
    check();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="inline-flex items-center rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text-primary">
        Loading...
      </div>
    );
  }

  if (user) {
    return <SignOutButton />;
  }

  return (
    <Link
      href="/login"
      className="inline-flex items-center rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text-primary transition hover:bg-surface-secondary"
    >
      Start for free
    </Link>
  );
}
