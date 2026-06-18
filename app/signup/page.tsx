"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import insforgeClient from "../../lib/insforge-client";
import { posthog } from "@/lib/posthog-client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    posthog.capture("signup_attempt", {
      email_provided: Boolean(email),
    });

    try {
      const res = await insforgeClient.auth.signUp({ email, password });
      if (res.error) {
        posthog.capture("signup_failed", {
          reason: res.error.message,
        });
        setError(res.error.message || "Failed to sign up");
        return;
      }

      posthog.capture("signup_success");
      router.push("/dashboard");
    } catch (err: any) {
      posthog.capture("signup_failed", {
        reason: err?.message || String(err),
      });
      setError(err?.message || String(err));
    }
  }

  return (
    <div className="mx-auto max-w-md py-24">
      <h1 className="text-2xl font-semibold">Create account</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div>
          <button className="w-full rounded-md bg-accent px-4 py-2 text-white">Create account</button>
        </div>
      </form>
      <p className="mt-4 text-sm">
        Already have an account? <a href="/login" className="text-accent">Sign in</a>
      </p>
    </div>
  );
}
